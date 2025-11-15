import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header/Header";
import MobileBottomButton from "./components/common/MobileBottomButton";
import Toast from "./components/common/Toast";

export const metadata: Metadata = {
  title: "Mission Driven Assignment",
  description: "Mission Driven Assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body
        className="antialiased"
      >
        <div className="bg-white min-h-screen">
          <Header />
          {children}
          <MobileBottomButton />
          <Toast />
        </div>
      </body>
    </html>
  );
}
