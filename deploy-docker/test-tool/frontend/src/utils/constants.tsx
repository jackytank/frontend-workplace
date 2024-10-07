import crypto from 'crypto';

// 10 aws regions please
const awsRegions = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'ap-south-1',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-3',
    'ca-central-1',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'eu-north-1',
    'sa-east-1',
];

export const constants = {
    aws: {
        regions: awsRegions,
    },
    localStorageKey: {
        selectedProfileKey: 'selectedProfileKey',
        awsProfiles: 'awsProfiles',
        sim2page: {
            queueUrl: 'sim2page_queueUrl',
            bucketName: 'sim2page_bucketName',
            lambdaName: 'sim2page_lambdaName',
            lambdaParams: 'sim2page_lambdaParams',
        },
    },
    enc: {
        secretKey: 'my-super-secure-secret-key-and-no-one-will-know', // don't change this encryption/decryption
        algorithm: 'aes-256-cbc',
    }
};