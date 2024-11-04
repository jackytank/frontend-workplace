import { CopyObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Handler, S3Event } from "aws-lambda";

const s3 = new S3Client({
});

export const handler: Handler = async (event: S3Event): Promise<object> => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    for (const record of event.Records) {
        const bucketName = record.s3.bucket.name;
        const key = record.s3.object.key;
        const newKey = key.replace('.txt', '_modified_by_lambda.txt');
        console.log(`Bucket: ${bucketName}, Key: ${key}`);

        const copySource = `${bucketName}/${key}`;
        await s3.send(new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: copySource,
            Key: newKey
        }));
        console.log(`Copied ${copySource} to ${bucketName}/${newKey}`);

        await s3.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key
        }));
        console.log(`Deleted ${bucketName}/${key}`);
    }

    return {
        statusCode: 200,
        body: JSON.stringify('File copied and deleted successfully')
    };
};