import { useEffect, useRef } from "react";

export const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      video.currentTime = 120; // Start at 2 minutes
      video.play();
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    return () => video.removeEventListener("loadedmetadata", handleLoaded);
  }, []);

  return (
    <section className="relative w-full h-[75vh] bg-black overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/main.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Text Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center px-6 max-w-3xl">
          <h1 className="text-5xl sm:text-6xl font-heading font-bold text-white drop-shadow-md mb-6 leading-tight">
            Create. Collaborate. <br/>Be Discovered.
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 font-light drop-shadow-sm mb-8">
            Discover powerful collaborations and rising stars. Artproof brings together creators, producers, and fans across genres and geographies.
          </p>
          <a
            href="#explore"
            className="inline-block px-6 py-3 bg-brand-olive text-white font-medium text-sm rounded-lg hover:bg-brand-yellow transition shadow-md"
          >
            Explore Events
          </a>
        </div>
      </div>
    </section>
  );
};
