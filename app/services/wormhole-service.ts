import { wormhole, TokenTransfer, Wormhole, Chain } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { ethers } from 'ethers';

export async function setupWormholeBridge() {
  const wh = await wormhole('Testnet', [evm, solana]);
  return wh;
}

export async function initiateBridgeTransfer(
  wh: any,
  sourceChain: string,
  sourceAddress: string,
  destinationAddress: string,
  amount: number
) {
  const srcChain = wh.getChain(sourceChain);
  const dstChain = wh.getChain('Solana');

  const transfer = await wh.tokenTransfer(
    Wormhole.tokenId(sourceChain as Chain, 'USDC_ADDRESS_ON_SOURCE_CHAIN'),
    amount,
    { chain: sourceChain as Chain, address: sourceAddress },
    { chain: 'Solana', address: destinationAddress },
    false // not automatic
  );

  const unsignedTxs = await transfer.initiateTransfer();
  return { transfer, unsignedTxs };
}

export async function completeBridgeTransfer(
  wh: any, // Replace 'any' with the actual type of 'wh'
  transfer: any, // Replace 'any' with the actual type of 'transfer'
  destinationAddress: string
) {
  const dstChain = wh.getChain('Solana');
  const completionTxs = await transfer.completeTransfer(destinationAddress);
  return completionTxs;
}
// export async function approveUSDCSpending(
//     provider: ethers.Provider,
//     usdcAddress: string,
//     spenderAddress: string,
//     amount: ethers.BigNumberish
//   ) {
//     const signer = provider.getSigner();
//     const usdcContract = new ethers.Contract(usdcAddress, USDC_ABI, signer);
//     const tx = await usdcContract.approve(spenderAddress, amount);
//     await tx.wait();
//     return tx;
//   }
  