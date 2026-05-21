// Resume Download Handler
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET = process.env.S3_BUCKET || 'fairchancefinder-uploads';

exports.handler = async (event) => {
  try {
    const key = event.queryStringParameters?.key;
    if (!key) {
      return { statusCode: 400, body: 'Missing file key' };
    }

    const params = {
      Bucket: BUCKET,
      Key: key,
    };

    const fileData = await s3.getObject(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${key.split('/').pop()}"`,
      },
      body: fileData.Body.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};