simulator#1-flow

Download test data from S3
Get the number of test data items
Create an SQS client
Create a thread pool
Loop (number of test data items)
    Send messages to SQS
    Create a thread --------------------------------->  SQS Client,Outgoing Messages,Test  ---------------> Subthread
                                                                                                            Receive messages from SQS
                                                                                                            Delete messages from SQS
                                                                                                            Determine if there is a timeout period of 1
                                                                                                            Receive messages from SQS
                                                                                                            Delete messages from SQS
                                                                                                            Determine if there is a timeout period of 2
Wait for the previous thread to finish

