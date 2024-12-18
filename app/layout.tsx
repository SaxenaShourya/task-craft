import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {default: "Task Craft - Boost Productivity", template: "%s | Task Craft"},
  description: "TaskCraft is a collaborative task management tool inspired by Trello. It enables users to create, manage, and track tasks through an intuitive board system, featuring drag-and-drop organization and real-time collaboration for enhanced productivity.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <ClerkProvider>
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
