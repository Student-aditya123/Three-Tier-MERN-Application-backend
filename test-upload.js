
async function testUpload() {
  try {
    const content = "Hello World!";
    const fileBuffer = Buffer.from(content);

    // Step 1: Request pre-signed URL
    const response = await fetch(
      "http://localhost:5000/api/files/upload-url",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileName: "test.txt",
          contentType: "text/plain",
          size: fileBuffer.length
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    // Step 2: Upload file directly to S3
    const uploadResponse = await fetch(data.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "text/plain"
      },
      body: fileBuffer
    });

    if (!uploadResponse.ok) {
      throw new Error(
        `S3 upload failed: ${uploadResponse.status}`
      );
    }

    console.log("S3 Upload Successful!");

    // Step 3: Save metadata in MongoDB
    const confirmResponse = await fetch(
      "http://localhost:5000/api/files/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          key: data.key,
          fileName: data.fileName,
          contentType: data.contentType,
          size: fileBuffer.length
        })
      }
    );

    const result = await confirmResponse.json();

    if (!confirmResponse.ok) {
      throw new Error(JSON.stringify(result));
    }

    console.log("MongoDB Save Successful!");
    console.log("File ID:", result.file._id);
    console.log("S3 Key:", result.file.s3Key);

  } catch (error) {
    console.error("Upload Test Failed:", error);
  }
}

testUpload();
