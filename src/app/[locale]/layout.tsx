import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { locales, type Locale } from "@/config/i18n";

// Google Analytics ID - 실제 ID로 변경하세요
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

const siteUrl = "https://jinhyeok.dev"; // 실제 도메인으로 변경

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jinhyeok Kim | Blockchain Developer",
    template: "%s | Jinhyeok Kim",
  },
  description:
    "Blockchain Developer specialized in Hyperledger, ZKP (Zero-Knowledge Proofs), and high-performance systems. Achieved 26x TPS optimization. 5+ IEEE/KCI papers published.",
  keywords: [
    "Blockchain Developer",
    "Hyperledger Besu",
    "Hyperledger Fabric",
    "ZKP",
    "Zero Knowledge Proof",
    "Solidity",
    "Smart Contract",
    "Node.js",
    "TypeScript",
    "Backend Developer",
    "블록체인 개발자",
    "김진혁",
  ],
  authors: [{ name: "Jinhyeok Kim", url: siteUrl }],
  creator: "Jinhyeok Kim",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: "Jinhyeok Kim Portfolio",
    title: "Jinhyeok Kim | Blockchain Developer",
    description:
      "Blockchain Developer with 26x TPS optimization, 5+ papers (IEEE, KCI), and enterprise blockchain experience.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jinhyeok Kim - Blockchain Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jinhyeok Kim | Blockchain Developer",
    description:
      "Blockchain Developer with 26x TPS optimization and enterprise experience.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-verification-code",
  },
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
      {/* Google Analytics - production에서만 활성화 */}
      {process.env.NODE_ENV === "production" && GA_ID !== "G-XXXXXXXXXX" && (
        <GoogleAnalytics gaId={GA_ID} />
      )}
    </NextIntlClientProvider>
  );
}
