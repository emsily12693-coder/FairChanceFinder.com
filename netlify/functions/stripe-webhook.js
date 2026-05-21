// Stripe Webhook Handler - Process payments and create jobs
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { DynamoDB } = require('aws-sdk');

const dynamodb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.JOBS_TABLE || 'fair-chance-jobs';

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    try {
      const jobData = JSON.parse(session.metadata.jobData);

      // Create job record in database
      const jobId = `job_${Date.now()}`;
      const expiresAt = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days

      await dynamodb.put({
        TableName: TABLE_NAME,
        Item: {
          id: jobId,
          companyName: jobData.companyName,
          jobTitle: jobData.jobTitle,
          jobCategory: jobData.jobCategory,
          jobType: jobData.jobType,
          payRange: jobData.payRange,
          location: jobData.location,
          description: jobData.description,
          applyUrl: jobData.applyUrl,
          contactEmail: jobData.contactEmail,
          fairChance: jobData.fairChance,
          createdAt: new Date().toISOString(),
          expiresAt: expiresAt,
          status: 'active',
          paymentId: session.payment_intent,
          views: 0,
          applications: 0,
        },
      }).promise();

      // Send confirmation email to employer
      await sendConfirmationEmail(jobData.contactEmail, jobData.companyName, jobData.jobTitle, jobId);

      // Initiate ACH transfer to your account
      await initiateACHTransfer(session.payment_intent, 7500, jobData.contactEmail);

      console.log('✓ Job posted successfully:', jobId);
    } catch (error) {
      console.error('Error processing job posting:', error);
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};

async function sendConfirmationEmail(email, company, jobTitle, jobId) {
  // TODO: Implement email via SendGrid or similar
  console.log(`Sending confirmation to ${email} for job ${jobId}`);
}

async function initiateACHTransfer(paymentId, amountCents, email) {
  try {
    // TODO: Configure Stripe Connect to transfer funds
    // For now, log the transfer request
    console.log(`ACH Transfer initiated: ${amountCents / 100} USD from ${email}`);
  } catch (error) {
    console.error('ACH transfer failed:', error);
  }
}