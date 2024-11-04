import boto3
import os

s3 = boto3.client('s3')

def handler(event: dict, context: dict):
    bucket_name  = os.environ['BUCKET_NAME']
    for record in event['Records']:
        key = record['s3']['object']['key']
        # get the file extension of the object
        file_extension = key.split('.')[-1]
        new_key = key.replace(file_extension, '_modified_by_lambda.' + file_extension)

        s3.copy_object(
            Bucket=bucket_name ,
            CopySource={'Bucket': bucket_name , 'Key': key},
            Key=new_key
        )
        s3.delete_object(Bucket=bucket_name, Key=key)
        print(f'File {key} has been deleted')
        print(f'File {key} has been modified and renamed to {new_key}')