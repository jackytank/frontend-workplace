import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';

export class MyServerlessAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.initBucketAndModifiedKeyLambda();
    this.initWebsiteBucketAndHostStaticWebsite();
  }

  private initWebsiteBucketAndHostStaticWebsite(): void {
    const websiteBucket = new s3.Bucket(this, 'websiteBucket', {
      bucketName: 'learn-cdk-website-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    });

    new cdk.CfnOutput(this, 'WebsiteBucket', {
      value: websiteBucket.bucketName,
      description: 'The bucket to host the static website',
    });

    new s3Deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3Deploy.Source.asset('./website/dist')],
      destinationBucket: websiteBucket,
    });
  };

  private initBucketAndModifiedKeyLambda(): void {
    const bucket = new s3.Bucket(this, 'LearnCdkBucket', {
      bucketName: 'learn-cdk-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    const myFunction = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        BUCKET_NAME: bucket.bucketName
      }
    });

    // Grant the lambda function read/write permissions to the bucket
    bucket.grantReadWrite(myFunction);
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new s3n.LambdaDestination(myFunction)
    );
  }
}
