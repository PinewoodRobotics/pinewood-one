"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center items-center h-screen z-10">
        <Image
          src="/pwone.png"
          alt="Pinewood One"
          width="500"
          height="500"
          className="w-1/2 h-auto cursor-pointer custom-transition"
          onClick={logoOnClick}
          id="logo"
        />
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-[-1]">
        <video
          loop
          playsInline
          className="w-full h-full object-cover opacity-0"
          src="https://cdn.hackclubber.dev/slackcdn/3342a21636498dd66c6e423e694eb841.mp4"
          id="video"
        />
      </div>
    </div>
  );
}

let clicks = 0;

function logoOnClick() {
  clicks++;
  document.body.style.backgroundColor = `rgba(0, 0, 0, ${clicks * 0.08})`;

  if (clicks >= 13) {
    const video = document.getElementById("video") as HTMLVideoElement;
    if (video) {
      const playPromise = video.play();
      video.style.opacity = "100";
      document.getElementById("logo").style.opacity = "0";

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video playing successfully");
          })
          .catch((error) => {
            console.error("Error playing video:", error);
          });
      }
    }
  }
}
