// import { NextResponse } from 'next/server';
// import { setupWormholeBridge, completeBridgeTransfer } from '@/app/services/wormhole-service';


// export async function POST(req: Request) {
//   const { transferId, destinationAddress } = await req.json();
  
//   try {
//     const wh = await setupWormholeBridge();
    
//     const transfer = await prisma.transfer.findUnique({ where: { id: transferId } });
//     if (!transfer) {
//       return NextResponse.json({ error: 'Transfer not found' }, { status: 404 });
//     }
    
//     const completionTxs = await completeBridgeTransfer(wh, transfer, destinationAddress);
//     return NextResponse.json({ completionTxs });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to complete transfer' }, { status: 500 });
//   }
// }