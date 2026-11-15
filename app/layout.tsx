import { AuthGate } from "@/components/auth-gate";
import type { Metadata } from "next";
import { AppProvider } from "@/components/app-provider";
import { Shell } from "@/components/shell";
import "./globals.css";
import "./backend.css";

export const metadata: Metadata = {
  title: "TrojanPals — Make your next move",
  description: "Explore courses, discover research, and build your own academic path. USC hackathon frontend prototype.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppProvider><AuthGate><Shell>{children}</Shell></AuthGate></AppProvider></body></html>;
}
