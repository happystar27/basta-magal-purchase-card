import React from "react";

export default function BackgroundVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 sm:opacity-45 md:opacity-50 video-filters"
      >
        <source src="/assets/video.mp4" type="video/mp4" />
        {/* Fallback para navegadores sin soporte de video */}
        <img
          src="/assets/fallback.jpg"
          alt="background"
          className="w-full h-full object-cover video-filters"
        />
      </video>

      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
