
"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

// Premium, subtle network particles tuned for dark-cinematic UIs.
const ParticlesBackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(
    () => ({
      background: { color: { value: "transparent" } },
      fpsLimit: 45,
      interactivity: {
        events: {
          onClick: { enable: false },
          onHover: { enable: false },
          resize: true,
        },
      },
      particles: {
        color: { value: "#94a3b8" },
        links: {
          color: "#cbd5e1",
          distance: isMobile ? 120 : 160,
          enable: true,
          opacity: isMobile ? 0.15 : 0.2,
          width: 0.5,
        },
        collisions: { enable: false },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "out" },
          random: false,
          speed: isMobile ? 0.08 : 0.16,
          straight: false,
        },
        number: { density: { enable: true }, value: isMobile ? 10 : 20 },
        opacity: { value: isMobile ? 0.15 : 0.2 },
        shape: { type: "circle" },
        size: { value: { min: 0.6, max: 1.6 } },
      },
      detectRetina: true,
    }),
    [isMobile]
  );

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default ParticlesBackground;
