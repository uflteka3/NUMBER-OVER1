import type { Metadata } from "next";
import { WalletView } from "@/components/app/views/wallet-view";

export const metadata: Metadata = { title: "Wallet" };

export default function WalletPage() {
  return <WalletView />;
}
