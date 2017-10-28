# Empty S3 Bucket

For a given S3 bucket, all objects and their versions will be deleted.

## Getting Started

### Run

```
npm install --save empty-s3-bucket
```

### API

The first argument is the bucket name, and the second argument is an optional config object passed to the [AWS SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property).

```
emptyBucket(bucketName, [config]);
```


### Usage

```
const emptyBucket = require('empty-s3-bucket');

emptyBucket('my-bucket');

const awsConfig = {
    accessKeyId: 'AKID',
    secretAccessKey: 'SECRET',
    region: 'us-west-2'
};

emptyBucket('other-bucket', awsConfig);
```
