import boto3
import os

s3 = boto3.client('s3')

def handler(event: dict, context: dict):
    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        new_key = key + '_modified'

        s3.copy_object(
            Bucket=bucket_name ,
            CopySource={'Bucket': bucket_name , 'Key': key},
            Key=new_key
        )
        s3.delete_object(Bucket=bucket_name, Key=key)
        print(f'File {key} has been deleted')
        print(f'File {key} has been modified and renamed to {new_key}')