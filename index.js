const aws = require('aws-sdk');
const s3 = new aws.S3();

const emptyBucket = async (Bucket) => {

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
  await Versions.length > 0
    ? deleteObjects(Versions)
    : Promise.resolve();

  // check for any files marked as deleted previously
  const { DeleteMarkers } = await s3.listObjectVersions({ Bucket }).promise();

  // if the bucket contains delete markers, delete them
  await DeleteMarkers.length > 0
    ? deleteObjects(DeleteMarkers)
    : Promise.resolve();
};

module.exports = emptyBucket;
