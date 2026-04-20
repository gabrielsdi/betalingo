import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BetaLingo - Web Dev Interview Vocabulary",
  description: "Master web development interview vocabulary with AI-powered pronunciation practice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  BetaLingo
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/lessons" className="text-gray-700 hover:text-gray-900">
                  Lessons
                </Link>
                <Link href="/interview" className="text-gray-700 hover:text-gray-900">
                  Interview
                </Link>
                <Link href="/progress" className="text-gray-700 hover:text-gray-900">
                  Progress
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
