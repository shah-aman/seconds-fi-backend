import { NextResponse } from 'next/server';
import { setupWormholeBridge, initiateBridgeTransfer } from '@/app/services/wormhole-service';

export async function POST(req: Request) {
  const { sourceAddress, destinationAddress, amount } = await req.json();
  
  try {
    const wh = await setupWormholeBridge();
    const { transfer, unsignedTxs } = await initiateBridgeTransfer(wh, 'Ethereum', sourceAddress, destinationAddress, amount);
    
    // Store the transfer object in your database for later use
    // ...

    return NextResponse.json({ unsignedTxs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to initiate bridge transfer' }, { status: 500 });
  }
}