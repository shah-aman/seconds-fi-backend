import Image from "next/image";
import BridgeForm from "./components/BridgeForm";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const oktoWalletAddress = searchParams.oktoWalletAddress as string | undefined;
  if (!oktoWalletAddress) {
    return <div>No wallet address provided</div>;
  }
  return (
    <div>
      <h1>Bridge USDC to Solana</h1>
      <BridgeForm oktoWalletAddress={oktoWalletAddress || ""} />
    </div>
  );
}
