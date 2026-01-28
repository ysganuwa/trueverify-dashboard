// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // if using node 18+, you can skip require
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data
let balance = 1000; // initial wallet balance
let transactions = [];
let verifications = [];

// Helper to call ElyakubICT API
async function callAPI(type, number) {
    let endpoint = '';
    switch(type){
        case 'nin': endpoint = 'https://api.elyakubict.com.ng/nin/'; break;
        case 'nin_phone': endpoint = 'https://api.elyakubict.com.ng/phone/'; break;
        case 'bvn': endpoint = 'https://api.elyakubict.com.ng/bvn/'; break;
        case 'bvn_phone': endpoint = 'https://api.elyakubict.com.ng/phone/'; break;
        default: throw new Error('Invalid verification type');
    }

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number })
    });

    const data = await res.json();
    return data;
}

// GET wallet balance
app.get('/balance', (req,res) => {
    res.json({ balance });
});

// POST verification
app.post('/verify', async (req,res) => {
    try {
        const { type, idNumber } = req.body;

        // Call API
        const apiResponse = await callAPI(type, idNumber);

        if(apiResponse.status !== 'success') {
            return res.json({ status: 'error', message: apiResponse.message || 'Verification failed' });
        }

        // Charge amount (example: 50 per verification)
        const charge = 50;
        balance -= charge;

        // Save transaction
        const transaction = { date: new Date().toLocaleString(), type, idNumber, charged: charge };
        transactions.push(transaction);

        // Save verification data
        const verificationRecord = { date: new Date().toLocaleString(), type, idNumber, data: apiResponse.data };
        verifications.push(verificationRecord);

        res.json({
            status: 'success',
            balance,
            charged: charge,
            data: apiResponse.data
        });

    } catch(err){
        console.error(err);
        res.json({ status:'error', message:'Server error. Please try again.' });
    }
});

// GET transactions history
app.get('/transactions', (req,res) => {
    res.json(transactions);
});

// GET verifications history
app.get('/verifications', (req,res) => {
    res.json(verifications);
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
