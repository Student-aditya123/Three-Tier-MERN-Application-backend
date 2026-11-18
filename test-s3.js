
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "eu-north-1"
});

async function testS3() {
  try {
    const result = await s3.send(
      new ListObjectsV2Command({
        Bucket: "student-management-files1",
        MaxKeys: 5
      })
    );

    console.log("S3 IAM Connection Successful!");
    console.log("Bucket:", "student-management-files1");
    console.log("Objects:", result.KeyCount);
  } catch (error) {
    console.error("S3 Connection Failed:", error);
  }
}

testS3();
