# Empty S3 Bucket

For a given S3 bucket, all objects and their versions will be deleted.

## Getting Started

### Run

```
npm install --save empty-aws-bucket
```

### API

The first argument is the bucket name, and the second argument is an optional config object passed to the [AWS SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property).

```
emptyBucket(bucketName, [config]);
```

### Usage

```
const emptyBucket = require('empty-aws-bucket');

emptyBucket('my-bucket');

const awsConfig = {
    accessKeyId: 'AKID',
    secretAccessKey: 'SECRET',
    region: 'us-west-2'
};

emptyBucket('other-bucket', awsConfig);
```

### Debugging

The [`AWSJS_DEBUG`](https://github.com/aws/aws-sdk-js/blob/master/CHANGELOG.md#21420) environment variable enables logging in `aws-sdk`. If the `AWSJS_DEBUG` environment variable is set this module will log debug information also.
