# Control Request Simulator

Control Request Simulator (MDMS) / Simulator #1

## Prerequisites

## Development Commands Guide (for local LocalStack's AWS only, aware when use in REAL prod AWS)

### Lambda
1. build .jar file first before create-function or update-function
```bash
mvn clean package -DskipTests
```
2. create-function
```bash
aws lambda create-function \
    --endpoint-url https://localhost.localstack.cloud:4566 \
    --function-name control_request_simulator \
    --runtime java17 \
    --role arn:aws:iam::033237493133:role/demo-aws-role \
    --handler jp.co.kepco.mdky.smlib.ControlRequestSimulator::handleRequest \
    --zip-file fileb://target/control-instruction-simulator-1.0-SNAPSHOT.jar \
    --timeout 15 \
    --memory-size 512
```
3. update-function
```sh
aws lambda update-function-code \
    --endpoint-url https://localhost.localstack.cloud:4566 \
    --function-name control_request_simulator \
    --zip-file fileb://target/control-instruction-simulator-1.0-SNAPSHOT.jar

```
4. delete-function
```sh
aws lambda delete-function \
    --endpoint-url https://localhost.localstack.cloud:4566 \
    --function-name control_request_simulator

```
5. invoke
```sh
aws lambda invoke \
    --endpoint-url https://localhost.localstack.cloud:4566 \
    --function-name control_request_simulator \
    --payload '{"bucket": "control-request-simulator-bucket", "key": "sample_simulatorSettings.json"}' \
    --cli-binary-format raw-in-base64-out lambda_response.json

```

### S3
1. create bucket
```sh
aws --endpoint-url https://localhost.localstack.cloud:4566 s3 mb s3://control-request-simulator-bucket

```
2. up demo file to s3
```sh
aws --endpoint-url https://localhost.localstack.cloud:4566 s3 cp src/main/resources/sample_simulatorSettings.json s3://control-request-simulator-bucket/sample_simulatorSettings.json

```

### SQS
1. create queue
```sh
aws --endpoint-url https://localhost.localstack.cloud:4566 sqs create-queue --queue-name control-request-simulator-queue
```
