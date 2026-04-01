"use client";

import Image from "next/image";
import { useSettings } from "@/components/dashboard/settings-context";

export default function Companion() {
  const { personality } = useSettings();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-transparent">
      <Image
        src="/kisaki.gif"
        alt={personality.name}
        width={256}
        height={256}
        style={{
          objectFit: "contain",
          imageRendering: "pixelated"
        }}
      />
    </div>
  );
}
