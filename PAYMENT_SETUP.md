# Payment Gateway Setup Instructions

## Environment Variables Setup

To get the payment gateway working, you need to set up the following environment variables in your Vercel project:

### Step 1: Get Your Razorpay Credentials

1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** > **API Keys**
3. Generate a new API key pair or use existing ones
4. Copy your **Key ID** and **Key Secret**

### Step 2: Configure Vercel Environment Variables

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project settings
3. Go to **Settings** > **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID | Production, Preview, Development |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Key Secret | Production, Preview, Development |

### Step 3: Deploy

After setting the environment variables, redeploy your application:

```bash
vercel --prod
```

## How It Works

The payment flow now works as follows:

1. **Frontend** (`Pricing.tsx`) calls `/api/create-order` with the plan name
2. **Backend** (`create-order.ts`) creates a Razorpay order and returns the order details + keyId
3. **Frontend** uses the returned keyId to initialize Razorpay checkout
4. **User** completes payment through Razorpay
5. **Frontend** calls `/api/verify-payment` to verify the payment signature
6. **Backend** (`verify-payment.ts`) verifies the signature and confirms payment

## Security Features

- ✅ Secret key is never exposed to the frontend
- ✅ Payment signature verification prevents tampering
- ✅ All sensitive operations happen on the backend
- ✅ Environment variables are securely stored in Vercel

## Testing

To test the payment system:

1. Use Razorpay's test mode credentials
2. Use test card numbers from Razorpay documentation
3. Check the browser console and Vercel function logs for any errors

## Troubleshooting

If payments aren't working:

1. Check that environment variables are set correctly in Vercel
2. Verify that the Razorpay script is loading (check browser console)
3. Check Vercel function logs for API errors
4. Ensure your Razorpay account is active and has sufficient balance
