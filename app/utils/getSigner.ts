// app/utils/getSigner.ts

import { ethers } from 'ethers';

export const getSigner = async (chain: string, walletAddress: string) => {
    // Check if the wallet is connected
    if (!window.ethereum) {
        throw new Error('No crypto wallet found. Please install it.');
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create a provider
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Get the signer
    const signer = provider.getSigner(walletAddress);

    return { signer, address: await (await signer).getAddress() };
};