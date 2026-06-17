"use client";

import Link from "next/link";
import StatusBar from "../../components/StatusBar";
import BottomNav from "../../components/BottomNav";

export default function DrivewayPage() {
  return (
    <div className="min-h-screen bg-[#0B111E] flex flex-col pb-28">
      <StatusBar />
      <div className="flex items-center gap-3 px-5 pt-2">
        <Link href="/zones" className="text-[#9CA3AF] text-sm">
          ← Zones
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#9CA3AF] text-sm">Driveway zone — coming soon</p>
      </div>
      <BottomNav />
    </div>
  );
}
