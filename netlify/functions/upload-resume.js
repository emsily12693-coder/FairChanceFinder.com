// Resume Upload Handler
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET = process.env.S3_BUCKET || 'fairchancefinder-uploads';

exports.handler = async (event) => {
  const method = event.httpMethod;

  if (method === 'GET') {
    const clientId = event.queryStringParameters?.clientId;
    if (!clientId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing clientId' }) };
    }

    try {
      const params = {
        Bucket: BUCKET,
        Prefix: `resumes/${clientId}/`,
      };

      const result = await s3.listObjectsV2(params).promise();
      const files = (result.Contents || []).map(obj => ({
        name: obj.Key.split('/').pop(),
        size: obj.Size,
        uploadedAt: obj.LastModified.toISOString(),
        downloadUrl: `${process.env.URL}/api/download-resume?key=${encodeURIComponent(obj.Key)}`,
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({ files }),
      };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
  }

  if (method === 'POST') {
    const clientId = event.queryStringParameters?.clientId;
    if (!clientId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing clientId' }) };
    }

    try {
      const body = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
      const filename = `resume_${Date.now()}.pdf`;
      const key = `resumes/${clientId}/${filename}`;

      await s3.putObject({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: 'application/pdf',
      }).promise();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          fileId: key,
          message: 'Resume uploaded successfully',
        }),
      };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
  }

  return { statusCode: 405, body: 'Method not allowed' };
};