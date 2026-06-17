import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRVIO EARTH",
  description: "Private Estate Operating System",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050A14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased min-h-screen" style={{ background: "#050A14" }}>
        {/* Phone frame on desktop */}
        <div className="min-h-screen flex items-start justify-center md:py-8">
          <div
            className="w-full md:w-[390px] min-h-screen md:min-h-[844px] md:max-h-[844px] relative overflow-hidden md:shadow-2xl md:rounded-[44px]"
            style={{ background: "#050A14" }}
          >
            <div className="w-full h-full overflow-y-auto overflow-x-hidden">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
