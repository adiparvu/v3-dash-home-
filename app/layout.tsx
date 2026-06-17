import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRVIO EARTH",
  description: "Property Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#050A14] min-h-screen flex items-start justify-center py-8">
        <div className="w-[390px] min-h-[844px] bg-[#0B111E] relative overflow-hidden shadow-2xl rounded-[40px]">
          {children}
        </div>
      </body>
    </html>
  );
}
