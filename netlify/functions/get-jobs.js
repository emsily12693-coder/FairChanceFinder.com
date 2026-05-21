// Fetch Jobs from Database
const { DynamoDB } = require('aws-sdk');
const dynamodb = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.JOBS_TABLE || 'fair-chance-jobs';

exports.handler = async (event) => {
  try {
    const { radius = 100, category = '', search = '' } = event.queryStringParameters || {};

    const params = {
      TableName: TABLE_NAME,
      FilterExpression: '#status = :status AND #expiresAt > :now',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#expiresAt': 'expiresAt',
      },
      ExpressionAttributeValues: {
        ':status': 'active',
        ':now': Math.floor(Date.now() / 1000),
      },
    };

    // Add category filter if specified
    if (category && category !== 'All') {
      params.FilterExpression += ' AND #category = :category';
      params.ExpressionAttributeNames['#category'] = 'jobCategory';
      params.ExpressionAttributeValues[':category'] = category;
    }

    const result = await dynamodb.scan(params).promise();

    // Filter by search term and distance
    const filtered = result.Items.filter(job => {
      const searchLower = search.toLowerCase();
      const matches = job.jobTitle.toLowerCase().includes(searchLower) ||
                      job.companyName.toLowerCase().includes(searchLower) ||
                      job.description.toLowerCase().includes(searchLower);
      return matches;
    }).map(job => ({
      ...job,
      distance: 0, // TODO: Calculate actual distance from Phoenix
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        count: filtered.length,
        jobs: filtered,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};