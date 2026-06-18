import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { StoreProvider } from "./lib/store";

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
  themeColor: "#060810",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased prvio-bg">
        <ThemeProvider>
         <StoreProvider>
          <div className="min-h-screen flex items-start justify-center md:py-8 prvio-bg">
            {/* Phone frame — the mesh gradient lives HERE, pages are transparent over it */}
            <div
              className="prvio-frame w-full md:w-[390px] min-h-screen md:min-h-[844px] md:max-h-[844px] relative overflow-hidden md:shadow-2xl md:rounded-[44px]"
            >
              {/* Subtle inner frame border for depth on desktop */}
              <div
                className="hidden md:block absolute inset-0 rounded-[44px] pointer-events-none z-50"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10), inset 0 1px 0 rgba(255,255,255,0.18)",
                  borderRadius: 44,
                }}
              />
              <div className="w-full h-full overflow-y-auto overflow-x-hidden">
                {children}
              </div>
            </div>
          </div>
         </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
