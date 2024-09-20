simulator#1-flow

simulator#1-flow

1. Download test data from S3
2. Get the number of test data items
3. Create an SQS client
4. Create a thread pool
5. Loop (number of test data items)
    5.1 Send messages to SQS
    5.2 Create a thread
        5.2.1 SQS Client,Outgoing Messages,Test
        5.2.2 Sub-thread
            5.2.2.1 Receive messages from SQS
                    Delete messages from SQS
                    Determine if there is a timeout period of 1
                    Receive messages from SQS
                    Delete messages from SQS
                    Determine if there is a timeout period of 2
6. Wait for the previous thread to finish

please implement in Java AWS Lambda code for me to write detailed design

meaning the lambda receive a Request POJO object have 2 fields {bucketName, key} then use that to find .csv from S3

please extract to private methods in order for handleRequest method to have a high level view, the flow didn't describe validation step, please add validation for request and csv data, also the csv data header and content is Japanese so please add step for decoding that using Shift JIS

I'm writing detailed design document, meaning I have to list method names, its parameters, return type,

I also attach a sample the customer sent us (it is demo code for another flow and only contain best case code), the code I give you only to give you an idea of how the customer expecting us