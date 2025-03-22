"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Image
        src="/pwone.png"
        alt="Pinewood One"
        width="500"
        height="500"
        className="w-1/2 h-auto hover:scale-105 active:scale-95 transition-transform duration-300 ease-in-out cursor-pointer"
        onClick={logoOnClick}
      />
    </div>
  );
}

let clicks = 0;

function logoOnClick() {
  clicks++;
  // make background a little bit darker
  document.body.style.backgroundColor = `rgba(0, 0, 0, ${clicks * 0.05})`;
  if (clicks >= 10) {
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  }
}
