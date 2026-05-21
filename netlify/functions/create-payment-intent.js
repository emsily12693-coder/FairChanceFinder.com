// Stripe Payment Intent Handler
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { amount, jobData } = JSON.parse(event.body);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Job Posting: ${jobData.jobTitle}`,
              description: `30-day listing by ${jobData.companyName}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/employer-posting.html`,
      metadata: {
        companyName: jobData.companyName,
        jobTitle: jobData.jobTitle,
        contactEmail: jobData.contactEmail,
        jobData: JSON.stringify(jobData),
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Payment error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};