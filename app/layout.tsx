import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

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
  themeColor: "#08090E",
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
      <body className="antialiased min-h-screen prvio-bg">
        <ThemeProvider>
          {/* Phone frame on desktop */}
          <div className="min-h-screen flex items-start justify-center md:py-8 prvio-bg">
            <div
              className="prvio-frame w-full md:w-[390px] min-h-screen md:min-h-[844px] md:max-h-[844px] relative overflow-hidden md:shadow-2xl md:rounded-[44px]"
            >
              <div className="w-full h-full overflow-y-auto overflow-x-hidden">
                {children}
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
