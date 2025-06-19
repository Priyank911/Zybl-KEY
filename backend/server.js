import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { paymentMiddleware } from 'x402-express';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Revenue split addresses
const USER_TREASURY_ADDRESS = process.env.USER_TREASURY_ADDRESS || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
const PROTOCOL_ADDRESS = process.env.PROTOCOL_ADDRESS || "0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721";

// X402 Payment Middleware Configuration
const paymentConfig = {
  "/api/verify": { 
    price: "$2.00", 
    network: "base-sepolia",
    assetAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // Base Sepolia USDC
  }
};

// Apply X402 middleware
app.use(paymentMiddleware(PROTOCOL_ADDRESS, paymentConfig));

// Protected verification endpoint
app.post('/api/verify', (req, res) => {
  // This route is protected by X402 payment middleware
  // Only accessible after payment is made
  
  // Revenue split logic would be handled by the X402 protocol or a smart contract
  
  res.json({
    success: true,
    message: "Verification payment processed successfully",
    verificationStatus: "active",
    timestamp: new Date().toISOString(),
    receipt: {
      transactionHash: req.get('X-PAYMENT-RESPONSE'),
      paymentId: req.get('X-PAYMENT-ID'),
      amount: "2.00 USDC",
      network: "Base Sepolia",
      splits: [
        {
          name: "Protocol",
          percentage: 60,
          address: PROTOCOL_ADDRESS
        },
        {
          name: "User Treasury",
          percentage: 40,
          address: USER_TREASURY_ADDRESS
        }
      ]
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Zybl payment backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
