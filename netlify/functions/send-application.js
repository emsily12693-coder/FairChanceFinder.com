// Handle Job Application Submissions
const nodemailer = require('nodemailer');
const { DynamoDB } = require('aws-sdk');

const dynamodb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.JOBS_TABLE || 'fair-chance-jobs';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { jobId, applicantName, applicantEmail, applicantPhone, resumeUrl, coverLetter } = JSON.parse(event.body);

    // Get job details
    const job = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { id: jobId },
    }).promise();

    if (!job.Item) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Job not found' }) };
    }

    // Send email to employer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: job.Item.contactEmail,
      subject: `New Application: ${applicantName} - ${job.Item.jobTitle}`,
      html: `
        <h2>New Job Application</h2>
        <p><strong>Applicant:</strong> ${applicantName}</p>
        <p><strong>Email:</strong> ${applicantEmail}</p>
        <p><strong>Phone:</strong> ${applicantPhone}</p>
        <p><strong>Job:</strong> ${job.Item.jobTitle}</p>
        <p><strong>Company:</strong> ${job.Item.companyName}</p>
        ${resumeUrl ? `<p><strong>Resume:</strong> <a href="${resumeUrl}">Download</a></p>` : ''}
        ${coverLetter ? `<p><strong>Cover Letter:</strong></p><p>${coverLetter.replace(/\n/g, '<br>')}</p>` : ''}
      `,
    });

    // Send confirmation to applicant
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: applicantEmail,
      subject: `Application Submitted: ${job.Item.jobTitle}`,
      html: `
        <h2>Application Received</h2>
        <p>Hi ${applicantName},</p>
        <p>Your application for <strong>${job.Item.jobTitle}</strong> at ${job.Item.companyName} has been submitted.</p>
        <p>The employer will contact you if they wish to move forward.</p>
        <p>Best of luck!</p>
        <p>FairChance Finder Team</p>
      `,
    });

    // Update job application count
    await dynamodb.update({
      TableName: TABLE_NAME,
      Key: { id: jobId },
      UpdateExpression: 'SET applications = if_not_exists(applications, :zero) + :inc',
      ExpressionAttributeValues: {
        ':zero': 0,
        ':inc': 1,
      },
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Application submitted successfully',
      }),
    };
  } catch (error) {
    console.error('Application error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};