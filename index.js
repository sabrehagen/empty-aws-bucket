const aws = require('aws-sdk');
const s3 = new aws.S3();

const emptyBucket = async (Bucket, options) => {

  if (options) {
    aws.config.update(options);
  }

  // if AWS SDK debugging is enabled, log our actions
  const debug = (...args) => {
    if (process.env.AWSJS_DEBUG) {
      console.log(`empty-aws-bucket | ${Bucket} |`, ...args);
    }
  }

  const deleteObjects = async (objects) => {
    // before we can delete the bucket, we must delete all versions of all objects
    const Objects = objects.map(({ Key, VersionId }) => ({ Key, VersionId }));

    await s3.deleteObjects({
      Bucket,
      Delete: { Objects }
    }).promise()
  };

  // get the list of all objects in the bucket
  const { Versions } = await s3.listObjectVersions({ Bucket }).promise();

  // if the bucket contains objects, delete them
  debug(`Deleting ${Versions.length} object versions`);
  if (Versions.length > 0) {
    await deleteObjects(Versions);
  }

  // check for any files marked as deleted previously
  const { DeleteMarkers } = await s3.listObjectVersions({ Bucket }).promise();

  // if the bucket contains delete markers, delete them
  debug(`Deleting ${DeleteMarkers.length} object delete markers`);
  if (DeleteMarkers.length > 0) {
    await deleteObjects(DeleteMarkers);
  }

  // if there are any non-versioned contents, delete them too
  const { Contents } = await s3.listObjectsV2({ Bucket }).promise();

  // if the bucket contains delete markers, delete them
  debug(`Deleting ${Contents.length} objects`);
  if (Contents.length > 0) {
    await deleteObjects(Contents);
  }
};

module.exports = emptyBucket;
