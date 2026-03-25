"use client";

import Image from "next/image";

export default function Companion() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-transparent">
      <Image
        src="/kisaki.gif"
        alt="Kisaki"
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
