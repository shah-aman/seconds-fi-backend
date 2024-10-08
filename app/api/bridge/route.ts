// app/api/bridge/route.ts

import { NextResponse } from 'next/server';
import { wormhole } from '@wormhole-foundation/sdk';
import solana from '@wormhole-foundation/sdk/solana';
import evm from '@wormhole-foundation/sdk/evm';
import { getSigner } from '../../utils/getSigner';
import { signSendWait } from '../../utils/signSendWait';
import { setupWormholeBridge } from '@/app/services/wormhole-service';

let wh: any;

export async function POST(request: Request) {
    if (!wh) {
        wh = await setupWormholeBridge();
    }
    const { sourceWallet, tokenAddress, amount, destinationWallet } = await request.json();

    try {
        const srcChain = wh.getChain('Ethereum'); // Assuming Ethereum as source
        const dstChain = wh.getChain('Solana');

        // Get signer for source wallet
        const { signer } = await getSigner(srcChain.chain, sourceWallet);

        // Create transfer transaction
        const tokenBridge = await srcChain.getTokenBridge();
        const transferTx = tokenBridge.transfer(
            sourceWallet,
            destinationWallet,
            tokenAddress,
            amount
        );

        // Sign and send the transaction
        const txIds = await signSendWait(srcChain.chain, transferTx, signer);

        return NextResponse.json({ success: true, txIds });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error as string }, { status: 500 });
    }
}