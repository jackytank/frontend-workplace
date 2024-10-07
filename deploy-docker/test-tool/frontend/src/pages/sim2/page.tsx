import { getSelectedProfile } from '../../utils/helper';
import { Button, Card, Col, Input, message, notification, Result, Row, Upload } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AwsProfile } from '../settings';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { SiAmazonsqs } from "react-icons/si";
import { IoRemoveOutline } from "react-icons/io5";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { constants } from '../../utils/constants';

const Sim2Page = () => {
  const profile: AwsProfile | null = useMemo(() => getSelectedProfile(), []);
  const [queueUrl, setQueueUrl] = useState(localStorage.getItem(constants.localStorageKey.sim2page.queueUrl) || '');
  const [fileContent, setFileContent] = useState<object | null>(null);
  const [bucketName, setBucketName] = useState(localStorage.getItem(constants.localStorageKey.sim2page.bucketName) || '');
  const [lambdaName, setLambdaName] = useState(localStorage.getItem(constants.localStorageKey.sim2page.lambdaName) || '');
  const [lambdaParams, setLambdaParams] = useState(localStorage.getItem(constants.localStorageKey.sim2page.lambdaParams) || '');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(constants.localStorageKey.sim2page.queueUrl, queueUrl);
    localStorage.setItem(constants.localStorageKey.sim2page.bucketName, bucketName);
    localStorage.setItem(constants.localStorageKey.sim2page.lambdaName, lambdaName);
    localStorage.setItem(constants.localStorageKey.sim2page.lambdaParams, lambdaParams);
  }, [queueUrl, bucketName, lambdaName, lambdaParams]);

  const beforeUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = JSON.parse(reader.result as string);
        setFileContent(content);
        message.success('File uploaded successfully!');
      } catch (error) {
        notification.error({ message: 'Invalid JSON content in the file.' });
      }
    };
    reader.readAsText(file);
    return false; // Prevent automatic upload
  };

  const handleSubmit = async () => {
    if (!profile) {
      message.error('No profile selected!');
      return;
    }
    if (!queueUrl) {
      message.error('Queue URL is required!');
      return;
    }
    if (!fileContent) {
      message.error('No file uploaded!');
      return;
    }
    // send to sqs
    const client = new SQSClient({
      region: profile.region,
      credentials: {
        accessKeyId: profile.aws_access_key_id,
        secretAccessKey: profile.aws_secret_access_key,
      },
    });

    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(fileContent),
    });
    try {
      await client.send(command);
      message.success('Message sent to SQS successfully!');
    } catch (error) {
      message.error('Error while sending message to SQS');
    }
  };

  const handleSubmitS3 = async () => {
    if (!profile) {
      message.error('No profile selected!');
      return;
    }
    if (!bucketName) {
      message.error('Bucket name is required!');
      return;
    }
    if (!fileContent) {
      message.error('No file uploaded!');
      return;
    }
    const client = new S3Client({
      region: profile.region,
      credentials: {
        accessKeyId: profile.aws_access_key_id,
        secretAccessKey: profile.aws_secret_access_key,
      },
    });

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: 'uploaded-file.json',
      Body: JSON.stringify(fileContent),
    });
    try {
      await client.send(command);
      message.success('File uploaded to S3 successfully!');
    } catch (error) {
      message.error('Error while uploading file to S3');
    }
  };

  const handleInvokeLambda = async () => {
    if (!profile) {
      message.error('No profile selected!');
      return;
    }
    if (!lambdaName) {
      message.error('Lambda name is required!');
      return;
    }
    if (!lambdaParams) {
      message.error('Lambda parameters are required!');
      return;
    }
    const client = new LambdaClient({
      region: profile.region,
      credentials: {
        accessKeyId: profile.aws_access_key_id,
        secretAccessKey: profile.aws_secret_access_key,
      },
    });

    const command = new InvokeCommand({
      FunctionName: lambdaName,
      Payload: new TextEncoder().encode(lambdaParams),
    });
    try {
      const response = await client.send(command);
      message.success('Lambda invoked successfully!');
      console.log('Lambda response:', new TextDecoder().decode(response.Payload));
    } catch (error) {
      message.error('Error while invoking Lambda');
    }
  };

  const genLeftArrow = (size: number) => {
    return <FaLongArrowAltLeft size={size} />;
  };
  const genLineDash = (num: number) => {
    const lineDash = [];
    for (let i = 0; i < num; i++) {
      lineDash.push(<IoRemoveOutline size={64} />);
    }
    return lineDash;
  };

  return (
    <>
      {profile ? (
        <Row gutter={16} justify={'space-between'}>
          <Col span={8}>
            <Card
              title="MDMS Simulator 2"
              style={{
                minHeight: '500px'
              }}
            >
              <div style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px' }}>
                <Upload beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Upload .txt file</Button>
                </Upload>
                {fileContent && (
                  <Card title="Uploaded JSON Content" style={{ marginTop: 16 }}>
                    <pre>{JSON.stringify(fileContent, null, 2)}</pre>
                  </Card>
                )}
                <Input
                  placeholder="Enter Bucket Name"
                  value={bucketName}
                  onChange={(e) => setBucketName(e.target.value)}
                  required
                  style={{ marginTop: 16 }}
                />
                <Button
                  type="primary"
                  onClick={handleSubmitS3}
                  style={{ marginTop: 16 }}
                >
                  Upload test data JSON to S3
                </Button>
              </div>
              <div style={{ border: '1px solid #ccc', padding: '16px' }}>
                <Input
                  placeholder="Enter Lambda Name"
                  value={lambdaName}
                  onChange={(e) => setLambdaName(e.target.value)}
                  required
                />
                {/* <CodeEditor
                  value={lambdaParams}
                  language="json"
                  placeholder="Enter Lambda request parameters"
                  onChange={(e) => setLambdaParams(e.target.value)}
                  padding={15}
                  style={{ marginTop: 16, minHeight: '200px', border: '1px solid #ccc' }}
                /> */}
                <Button
                  type="primary"
                  onClick={handleInvokeLambda}
                  style={{ marginTop: 16 }}
                >
                  Invoke Simulator 2 Lambda
                </Button>
              </div>
            </Card>
          </Col>
          <Col span={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {genLeftArrow(32)} {genLineDash(2)}  <SiAmazonsqs size={48} color="#FF9900" /> {genLineDash(3)}
          </Col>
          <Col span={8}>
            <Card
              title="LambdaTestTool"
              style={{
                minHeight: '500px'
              }}
            >
              <div style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px' }}>
                <Upload
                  beforeUpload={beforeUpload}
                // onChange={handleFileChange}

                >
                  <Button icon={<UploadOutlined />}>Upload .txt file</Button>
                </Upload>
                {fileContent && (
                  <Card title="Uploaded JSON Content" style={{ marginTop: 16 }}>
                    <pre>{JSON.stringify(fileContent, null, 2)}</pre>
                  </Card>
                )}
                <Input
                  placeholder="Enter Queue URL"
                  value={queueUrl}
                  onChange={(e) => setQueueUrl(e.target.value)}
                  required
                  style={{ marginTop: 16 }}
                />
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  style={{ marginTop: 16 }}
                >
                  {genLeftArrow(16)} Send message to SQS
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        <Result
          status={'warning'}
          title='No profile selected!'
          extra={
            <Button
              type='primary'
              key='settings'
              onClick={() => {
                navigate('/settings');
              }}
            >
              Go to Settings
            </Button>
          }
        />
      )}
    </>
  );
};

export default Sim2Page;