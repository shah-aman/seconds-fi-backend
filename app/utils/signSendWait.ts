// app/utils/signSendWait.ts

import axios from 'axios';

const OKTO_API_BASE_URL = process.env.OKTO_API_BASE_URL; // Replace with your Okto API base URL
const OKTO_API_KEY = process.env.OKTO_API_KEY; // Replace with your Okto API key

export const signSendWait = async (chain: string, transaction: any, signer: any) => {
    const networkName = chain === 'Ethereum' ? 'ETH_MAINNET' : 'SOLANA_MAINNET'; // Adjust as necessary

    // Prepare the request data for raw transaction execution
    const requestData = {
        network_name: networkName,
        transaction,
    };

    try {
        // Execute the raw transaction
        const response = await axios.post(`${OKTO_API_BASE_URL}/api/v1/rawtransaction/execute`, requestData, {
            headers: {
                'x-api-key': OKTO_API_KEY,
                'Authorization': `Bearer ${await signer.getAddress()}`, // Use appropriate token if needed
                'Content-Type': 'application/json',
            },
        });

        const jobId = response.data.data.jobId;

        // Poll for transaction status
        return await waitForTransactionStatus(jobId);
    } catch (error) {
        console.error('Error executing transaction:', error);
        throw error;
    }
};

const waitForTransactionStatus = async (jobId: string) => {
    let status;
    
    do {
        const response = await axios.get(`${OKTO_API_BASE_URL}/api/v1/rawtransaction/status/${jobId}`, {
            headers: {
                'x-api-key': OKTO_API_KEY,
            },
        });
        
        status = response.data.status;
        
        if (status === 'success') {
            return response.data; // Transaction was successful
        }
        
        if (status === 'failed') {
            throw new Error('Transaction failed');
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
        
    } while (status !== 'success' && status !== 'failed');

    return null; // In case of unexpected behavior
};