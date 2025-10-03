import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as transfer from 'aws-cdk-lib/aws-transfer';

export interface CdkSftpTransferFamilyStackStackProps extends cdk.StackProps {
  /**
   * Whether this stack creates a server internally or not. If a server is created internally, the customer identity provider is automatically associated with it.
   * @default 'true'
   */
  readonly createServer?: boolean;
  /**
   * (Optional) The region the secrets are stored in. If this value is not provided, the region this stack is deployed in will be used. Use this field if you are deploying this stack in a region where SecretsManager is not available.
   * @default ''
   */
  readonly secretsManagerRegion?: string;
}

/**
 * A basic template for creating a Lambda-backed API Gateway for use as a custom identity provider in AWS Transfer. It authenticates against an entry in AWS Secrets Manager of the format SFTP/username. Additionally, the secret must hold the key-value pairs for all user properties returned to AWS Transfer. You can modify the Lambda function code to do something different after deployment.
 */
export class CdkSftpTransferFamilyStackStack extends cdk.Stack {
  public readonly serverId?;
  public readonly stackArn;
  /**
   * URL to pass to AWS Transfer CreateServer call as part of optional IdentityProviderDetails
   */
  public readonly transferIdentityProviderUrl?;
  /**
   * IAM Role to pass to AWS Transfer CreateServer call as part of optional IdentityProviderDetails
   */
  public readonly transferIdentityProviderInvocationRole?;

  public constructor(scope: cdk.App, id: string, props: CdkSftpTransferFamilyStackStackProps = {}) {
    super(scope, id, props);

    // Applying default props
    props = {
      ...props,
      createServer: props.createServer ?? true,
      secretsManagerRegion: props.secretsManagerRegion ?? '',
    };

    // Conditions
    const createServer = props.createServer! === 'true';
    const secretsManagerRegionProvided = !(props.secretsManagerRegion! === '');
    const notCreateServer = !createServer;

    // Resources
    const apiCloudWatchLogsRole = new iam.CfnRole(this, 'ApiCloudWatchLogsRole', {
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: [
                'apigateway.amazonaws.com',
              ],
            },
            Action: [
              'sts:AssumeRole',
            ],
          },
        ],
      },
      policies: [
        {
          policyName: 'ApiGatewayLogsPolicy',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'logs:CreateLogGroup',
                  'logs:CreateLogStream',
                  'logs:DescribeLogGroups',
                  'logs:DescribeLogStreams',
                  'logs:DescribeQueries',
                  'logs:FilterLogEvents',
                  'logs:GetLogEvents',
                  'logs:GetLogGroupFields',
                  'logs:GetLogRecord',
                  'logs:GetQueryResults',
                  'logs:PutLogEvents',
                  'logs:StartQuery',
                  'logs:StopQuery',
                ],
                Resource: '*',
              },
            ],
          },
        },
      ],
    });

    const cloudWatchLoggingRole = createServer
      ? new iam.CfnRole(this, 'CloudWatchLoggingRole', {
          assumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: [
                    'transfer.amazonaws.com',
                  ],
                },
                Action: [
                  'sts:AssumeRole',
                ],
              },
            ],
          },
          policies: [
            {
              policyName: 'TransferLogsPolicy',
              policyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:DescribeLogStreams',
                      'logs:PutLogEvents',
                    ],
                    Resource: `*`,
                  },
                ],
              },
            },
          ],
        })
      : undefined;
    if (cloudWatchLoggingRole != null) {
    }

    const customIdentityProviderApi = new apigateway.CfnRestApi(this, 'CustomIdentityProviderApi', {
      name: 'Transfer Custom Identity Provider basic template API',
      description: 'API used for GetUserConfig requests',
      failOnWarnings: true,
      endpointConfiguration: {
        types: [
          'REGIONAL',
        ],
      },
    });

    const lambdaExecutionRole = new iam.CfnRole(this, 'LambdaExecutionRole', {
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: [
                'lambda.amazonaws.com',
              ],
            },
            Action: [
              'sts:AssumeRole',
            ],
          },
        ],
      },
      managedPolicyArns: [
        `arn:${this.partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole`,
      ],
      policies: [
        {
          policyName: 'LambdaSecretsPolicy',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'secretsmanager:GetSecretValue',
                ],
                Resource: `arn:${this.partition}:secretsmanager:${secretsManagerRegionProvided ? props.secretsManagerRegion! : this.region}:${this.account}:secret:aws/transfer/*`,
              },
            ],
          },
        },
      ],
    });

    const apiLoggingAccount = new apigateway.CfnAccount(this, 'ApiLoggingAccount', {
      cloudWatchRoleArn: apiCloudWatchLogsRole.attrArn,
    });
    apiLoggingAccount.addDependency(customIdentityProviderApi);

    const getUserConfigLambda = new lambda.CfnFunction(this, 'GetUserConfigLambda', {
      code: {
        zipFile: `import os
        import json
        import boto3
        import base64
        from botocore.exceptions import ClientError

        def lambda_handler(event, context):
            resp_data = {}

            if 'username' not in event or 'serverId' not in event:
                print("Incoming username or serverId missing  - Unexpected")
                return response_data

            # It is recommended to verify server ID against some value, this template does not verify server ID
            input_username = event['username']
            input_serverId = event['serverId']
            print("Username: {}, ServerId: {}".format(input_username, input_serverId));

            if 'password' in event:
                input_password = event['password']
                if input_password == '' and (event['protocol'] == 'FTP' or event['protocol'] == 'FTPS'):
                  print("Empty password not allowed")
                  return response_data
            else:
                print("No password, checking for SSH public key")
                input_password = ''

            # Lookup user's secret which can contain the password or SSH public keys
            resp = get_secret("aws/transfer/" + input_serverId + "/" + input_username)

            if resp != None:
                resp_dict = json.loads(resp)
            else:
                print("Secrets Manager exception thrown")
                return {}

            if input_password != '':
                if 'Password' in resp_dict:
                    resp_password = resp_dict['Password']
                else:
                    print("Unable to authenticate user - No field match in Secret for password")
                    return {}

                if resp_password != input_password:
                    print("Unable to authenticate user - Incoming password does not match stored")
                    return {}
            else:
                # SSH Public Key Auth Flow - The incoming password was empty so we are trying ssh auth and need to return the public key data if we have it
                if 'PublicKey' in resp_dict:
                    resp_data['PublicKeys'] = resp_dict['PublicKey'].split(",")
                else:
                    print("Unable to authenticate user - No public keys found")
                    return {}

            # If we've got this far then we've either authenticated the user by password or we're using SSH public key auth and
            # we've begun constructing the data response. Check for each key value pair.
            # These are required so set to empty string if missing
            if 'Role' in resp_dict:
                resp_data['Role'] = resp_dict['Role']
            else:
                print("No field match for role - Set empty string in response")
                resp_data['Role'] = ''

            # These are optional so ignore if not present
            if 'Policy' in resp_dict:
                resp_data['Policy'] = resp_dict['Policy']

            if 'HomeDirectoryDetails' in resp_dict:
                print("HomeDirectoryDetails found - Applying setting for virtual folders")
                resp_data['HomeDirectoryDetails'] = resp_dict['HomeDirectoryDetails']
                resp_data['HomeDirectoryType'] = "LOGICAL"
            elif 'HomeDirectory' in resp_dict:
                print("HomeDirectory found - Cannot be used with HomeDirectoryDetails")
                resp_data['HomeDirectory'] = resp_dict['HomeDirectory']
            else:
                print("HomeDirectory not found - Defaulting to /")

            print("Completed Response Data: "+json.dumps(resp_data))
            return resp_data

        def get_secret(id):
            region = os.environ['SecretsManagerRegion']
            print("Secrets Manager Region: "+region)

            client = boto3.session.Session().client(service_name='secretsmanager', region_name=region)

            try:
                resp = client.get_secret_value(SecretId=id)
                # Decrypts secret using the associated KMS CMK.
                # Depending on whether the secret is a string or binary, one of these fields will be populated.
                if 'SecretString' in resp:
                    print("Found Secret String")
                    return resp['SecretString']
                else:
                    print("Found Binary Secret")
                    return base64.b64decode(resp['SecretBinary'])
            except ClientError as err:
                print('Error Talking to SecretsManager: ' + err.response['Error']['Code'] + ', Message: ' + str(err))
                return None
        `,
      },
      description: 'A function to lookup and return user data from AWS Secrets Manager.',
      handler: 'index.lambda_handler',
      role: lambdaExecutionRole.attrArn,
      runtime: 'python3.11',
      environment: {
        variables: {
          SecretsManagerRegion: secretsManagerRegionProvided ? props.secretsManagerRegion! : this.region,
        },
      },
    });

    const getUserConfigResponseModel = new apigateway.CfnModel(this, 'GetUserConfigResponseModel', {
      restApiId: customIdentityProviderApi.ref,
      contentType: 'application/json',
      description: 'API response for GetUserConfig',
      name: 'UserConfigResponseModel',
      schema: {
        '$schema': 'http://json-schema.org/draft-04/schema#',
        title: 'UserUserConfig',
        type: 'object',
        properties: {
          HomeDirectory: {
            type: 'string',
          },
          Role: {
            type: 'string',
          },
          Policy: {
            type: 'string',
          },
          PublicKeys: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    });

    const serversResource = new apigateway.CfnResource(this, 'ServersResource', {
      restApiId: customIdentityProviderApi.ref,
      parentId: customIdentityProviderApi.attrRootResourceId,
      pathPart: 'servers',
    });

    const transferIdentityProviderRole = new iam.CfnRole(this, 'TransferIdentityProviderRole', {
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: 'transfer.amazonaws.com',
            },
            Action: [
              'sts:AssumeRole',
            ],
          },
        ],
      },
      policies: [
        {
          policyName: 'TransferCanInvokeThisApi',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'execute-api:Invoke',
                ],
                Resource: `arn:${this.partition}:execute-api:${this.region}:${this.account}:${customIdentityProviderApi.ref}/prod/GET/*`,
              },
            ],
          },
        },
        {
          policyName: 'TransferCanReadThisApi',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'apigateway:GET',
                ],
                Resource: '*',
              },
            ],
          },
        },
      ],
    });

    const getUserConfigLambdaPermission = new lambda.CfnPermission(this, 'GetUserConfigLambdaPermission', {
      action: 'lambda:invokeFunction',
      functionName: getUserConfigLambda.attrArn,
      principal: 'apigateway.amazonaws.com',
      sourceArn: `arn:${this.partition}:execute-api:${this.region}:${this.account}:${customIdentityProviderApi.ref}/*`,
    });

    const serverIdResource = new apigateway.CfnResource(this, 'ServerIdResource', {
      restApiId: customIdentityProviderApi.ref,
      parentId: serversResource.ref,
      pathPart: '{serverId}',
    });

    const usersResource = new apigateway.CfnResource(this, 'UsersResource', {
      restApiId: customIdentityProviderApi.ref,
      parentId: serverIdResource.ref,
      pathPart: 'users',
    });

    const userNameResource = new apigateway.CfnResource(this, 'UserNameResource', {
      restApiId: customIdentityProviderApi.ref,
      parentId: usersResource.ref,
      pathPart: '{username}',
    });

    const getUserConfigResource = new apigateway.CfnResource(this, 'GetUserConfigResource', {
      restApiId: customIdentityProviderApi.ref,
      parentId: userNameResource.ref,
      pathPart: 'config',
    });

    const getUserConfigRequest = new apigateway.CfnMethod(this, 'GetUserConfigRequest', {
      authorizationType: 'AWS_IAM',
      httpMethod: 'GET',
      integration: {
        type: 'AWS',
        integrationHttpMethod: 'POST',
        uri: [
          'arn:',
          this.partition,
          ':apigateway:',
          this.region,
          ':lambda:path/2015-03-31/functions/',
          getUserConfigLambda.attrArn,
          '/invocations',
        ].join(''),
        integrationResponses: [
          {
            statusCode: 200,
          },
        ],
        requestTemplates: {
          'application/json': '{\n  \"username\": \"$util.urlDecode($input.params(\'username\'))\",\n  \"password\": \"$util.escapeJavaScript($util.base64Decode($input.params(\'PasswordBase64\'))).replaceAll(\"\\\\\'\",\"\'\")\",\n  \"protocol\": \"$input.params(\'protocol\')\",\n  \"serverId\": \"$input.params(\'serverId\')\",\n  \"sourceIp\": \"$input.params(\'sourceIp\')\"\n}\n',
        },
      },
      requestParameters: {
        'method.request.header.PasswordBase64': false,
        'method.request.querystring.protocol': false,
        'method.request.querystring.sourceIp': false,
      },
      resourceId: getUserConfigResource.ref,
      restApiId: customIdentityProviderApi.ref,
      methodResponses: [
        {
          statusCode: 200,
          responseModels: {
            'application/json': 'UserConfigResponseModel',
          },
        },
      ],
    });
    getUserConfigRequest.addDependency(getUserConfigResponseModel);

    const apiDeployment202008 = new apigateway.CfnDeployment(this, 'ApiDeployment202008', {
      restApiId: customIdentityProviderApi.ref,
    });
    apiDeployment202008.addDependency(getUserConfigRequest);

    const apiStage = new apigateway.CfnStage(this, 'ApiStage', {
      deploymentId: apiDeployment202008.ref,
      methodSettings: [
        {
          dataTraceEnabled: false,
          httpMethod: '*',
          loggingLevel: 'INFO',
          resourcePath: '/*',
        },
      ],
      restApiId: customIdentityProviderApi.ref,
      stageName: 'prod',
    });

    const transferServer = createServer
      ? new transfer.CfnServer(this, 'TransferServer', {
          endpointType: 'PUBLIC',
          identityProviderDetails: {
            invocationRole: transferIdentityProviderRole.attrArn,
            url: [
              'https://',
              customIdentityProviderApi.ref,
              '.execute-api.',
              this.region,
              '.',
              this.urlSuffix,
              '/',
              apiStage.ref,
            ].join(''),
          },
          identityProviderType: 'API_GATEWAY',
          loggingRole: cloudWatchLoggingRole?.attrArn,
        })
      : undefined;
    if (transferServer != null) {
    }

    // Outputs
    this.serverId = createServer
      ? transferServer?.attrServerId
      : undefined;
    if (createServer) {
      new cdk.CfnOutput(this, 'CfnOutputServerId', {
        key: 'ServerId',
        value: this.serverId!.toString(),
      });
    }
    this.stackArn = this.stackId;
    new cdk.CfnOutput(this, 'CfnOutputStackArn', {
      key: 'StackArn',
      value: this.stackArn!.toString(),
    });
    this.transferIdentityProviderUrl = notCreateServer
      ? [
        'https://',
        customIdentityProviderApi.ref,
        '.execute-api.',
        this.region,
        '.',
        this.urlSuffix,
        '/',
        apiStage.ref,
      ].join('')
      : undefined;
    if (notCreateServer) {
      new cdk.CfnOutput(this, 'CfnOutputTransferIdentityProviderUrl', {
        key: 'TransferIdentityProviderUrl',
        description: 'URL to pass to AWS Transfer CreateServer call as part of optional IdentityProviderDetails',
        value: this.transferIdentityProviderUrl!.toString(),
      });
    }
    this.transferIdentityProviderInvocationRole = notCreateServer
      ? transferIdentityProviderRole.attrArn
      : undefined;
    if (notCreateServer) {
      new cdk.CfnOutput(this, 'CfnOutputTransferIdentityProviderInvocationRole', {
        key: 'TransferIdentityProviderInvocationRole',
        description: 'IAM Role to pass to AWS Transfer CreateServer call as part of optional IdentityProviderDetails',
        value: this.transferIdentityProviderInvocationRole!.toString(),
      });
    }
  }
}
