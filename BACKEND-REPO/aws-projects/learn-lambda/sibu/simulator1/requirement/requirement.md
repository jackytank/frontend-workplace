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
