'use client'
import { useState, useMemo, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BridgeFormProps {
  oktoWalletAddress?: string;
}

const USDC_ADDRESSES = {
  base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  ethereum: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  polygon: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  optimism: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"
};
function formatChainId(chainId: string | number): string {
    // If it's already a hex string, remove padding
    if (typeof chainId === 'string' && chainId.startsWith('0x')) {
      return '0x' + chainId.replace(/^0x0*/, '');
    }
    // If it's a number or numeric string, convert to hex and remove padding
    return '0x' + Number(chainId).toString(16);
  } 
const CHAIN_IDS = {
  base: formatChainId(8453),
  ethereum: formatChainId(1),
  polygon: formatChainId(137),
  optimism: formatChainId(10)
};

export default function BridgeForm({ oktoWalletAddress }: BridgeFormProps)  {
  const [amount, setAmount] = useState("0.00")
  const [sourceChain, setSourceChain] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [sourceAddress, setSourceAddress] = useState("")
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const usdcAddress = useMemo(() => sourceChain ? USDC_ADDRESSES[sourceChain as keyof typeof USDC_ADDRESSES] : "", [sourceChain]);

  useEffect(() => {
    if (isConnected && provider) {
      provider.getSigner().then(signer => signer.getAddress()).then(setSourceAddress);
    } else {
      setSourceAddress("");
    }
  }, [isConnected, provider]);

  const handleChainSelect = (chain: string) => {
    setSourceChain(chain);
    setIsConnected(false);
    setProvider(null);
  };

  const handleConnect = async () => {
    if (!sourceChain) {
      alert("Please select a source chain first");
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const network = await browserProvider.getNetwork();
        
        if (network.chainId !== BigInt(CHAIN_IDS[sourceChain as keyof typeof CHAIN_IDS])) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.toBeHex(CHAIN_IDS[sourceChain as keyof typeof CHAIN_IDS], 32) }],
          });
        }
        
        setProvider(browserProvider);
        setIsConnected(true);

        const signer = await browserProvider.getSigner();
        const address = await signer.getAddress();
        setSourceAddress(address);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet");
    }
  };

  const handleBridge = async () => {
    if (!provider || !sourceAddress || !oktoWalletAddress) {
      alert("Please ensure wallet is connected and destination address is provided");
      return;
    }

    // This is a placeholder for the actual bridging logic
    console.log(`Initiating bridge of ${amount} USDC from ${sourceChain} (${usdcAddress}) to Solana address: ${oktoWalletAddress}`);
    console.log(`Source address: ${sourceAddress}`);

    // Here you would typically:
    // 1. Create a transaction to approve the bridge contract to spend USDC
    // 2. Create a transaction to initiate the bridge
    // 3. Sign and send these transactions
    // 4. Wait for confirmation and update UI accordingly
    // try {
    //     // 1. Approve USDC spending
    //     const approvalTx = await approveUSDC(signer, BRIDGE_ADDRESS, amount);
    //     await approvalTx.wait();
  
    //     // 2. Initiate bridge transaction
    //     const bridgeTx = await bridgeUSDC(signer, amount, destinationAddress);
    //     const receipt = await bridgeTx.wait();
  
    //     setTxHash(receipt.transactionHash);
    //   } catch (err) {
    //     console.error('Bridge error:', err);
    //     setError('An error occurred while bridging. Please try again.');
    //   } finally {
    //     setIsLoading(false);
    //   }
    alert("Bridge initiated! (This is a demo purpose only - not bridging actual USDC)");
  };

  return (
    <div className="font-serif bg-[#EFEFEF] min-h-screen p-4">
      <Card className="max-w-md mx-auto bg-[#D7D7D7] shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Bridge USDC to Solana</CardTitle>
        </CardHeader>
        <CardContent>
          <Card className="bg-white mb-4">
            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From Network</Label>
                  <Select value={sourceChain} onValueChange={handleChainSelect}>
                    <SelectTrigger id="from">
                      <SelectValue placeholder="Select source network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base">Base</SelectItem>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="optimism">Optimism</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {sourceChain && !isConnected && (
                  <Button 
                    onClick={handleConnect} 
                    className="w-full bg-[#1C344A] hover:bg-[#1C344A]/90 text-white"
                  >
                    Connect Wallet
                  </Button>
                )}
                {isConnected && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USDC)</Label>
                      <Input
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to">To Network</Label>
                      <Select defaultValue="solana" disabled>
                        <SelectTrigger id="to">
                          <SelectValue placeholder="Select destination network" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solana">Solana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>USDC Token Address</Label>
                      <p className="text-sm text-gray-600 break-all">{usdcAddress}</p>
                    </div>
                    <div>
                      <Label>Source Address</Label>
                      <p className="text-sm text-gray-600 break-all">{sourceAddress || "Not connected"}</p>
                    </div>
                    <div>
                      <Label>Destination Address</Label>
                      <p className="text-sm text-gray-600 break-all">{oktoWalletAddress || "No wallet address provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">You will receive (estimated)</p>
                      <p className="font-semibold">{amount} USDC on Solana</p>
                      <p className="text-sm text-gray-600">Bridge fee: TBD</p>
                    </div>
                    <Button 
                      className="w-full bg-[#1C344A] hover:bg-[#1C344A]/90 text-white"
                      onClick={handleBridge}
                      disabled={!oktoWalletAddress}
                    >
                      Bridge to Solana
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}