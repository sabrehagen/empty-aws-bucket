const aws = require('aws-sdk');

const method = {
  Contents: 'listObjectsV2',
  Versions: 'listObjectVersions',
  DeleteMarkers: 'listObjectVersions',
};

const emptyBucket = async (Bucket, options) => {

  if (options) {
    aws.config.update(options);
  }

  const s3 = new aws.S3();

  // if AWS SDK debugging is enabled, log our actions
  const debug = (...args) => {
    if (process.env.AWSJS_DEBUG) {
      console.log(`empty-aws-bucket | ${Bucket} |`, ...args);
    }
  }

  const emptyBucket = async () => {
    const deleteObjects = async (objects) => {
      // before we can delete the bucket, we must delete all versions of all objects
      const Objects = objects.map(({ Key, VersionId }) => ({ Key, VersionId }));

      await s3.deleteObjects({
        Bucket,
        Delete: { Objects }
      }).promise()
    };

    const empty = async (Bucket, Type) => {
      const objects = await s3[method[Type]]({ Bucket }).promise();
      if (objects[Type].length === 0) return;

      debug(`Deleting ${objects[Type].length} object ${Type}`);
      await deleteObjects(objects[Type]);

      if (objects.IsTruncated) await empty(Bucket, Type);
    };

    await empty(Bucket, 'Contents');
    await empty(Bucket, 'Versions');
    await empty(Bucket, 'DeleteMarkers');
  };

  try {
    debug(`Emptying bucket`);
    await emptyBucket();
  } catch (e) {
    if (e.code === 'NoSuchBucket') {
      debug('Bucket not found!');
    } else {
      throw e;
    }
  }
};

module.exports = emptyBucket;
