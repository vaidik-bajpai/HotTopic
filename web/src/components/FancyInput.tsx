import React, { useRef, useState } from "react";

export default function GlowingInput() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="group relative w-full max-w-sm overflow-hidden rounded-xl border border-neutral-700 bg-zinc-900 px-4 py-3 transition-all duration-300"
      >
        {/* Dynamic Glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(300px circle at ${coords.x}px ${coords.y}px, rgba(0,212,255,0.15), transparent 80%)`,
            opacity: hovering ? 1 : 0,
          }}
        />

        <input
          type="text"
          placeholder="Type something..."
          className="relative z-10 w-full bg-transparent text-white placeholder:text-neutral-400 focus:outline-none"
        />
      </div>
    </div>
  );
}