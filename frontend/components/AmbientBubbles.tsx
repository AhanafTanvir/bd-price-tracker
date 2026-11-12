export default function AmbientBubbles() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* Top-Left Soft Sky-Indigo Orb */}
      <div
        className="absolute -top-28 -left-24 w-[440px] h-[440px] rounded-full blur-[95px] opacity-[0.20] animate-bubble-1"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #60a5fa 0%, #818cf8 45%, transparent 75%)",
        }}
      />

      {/* Top-Right Soft Lavender-Violet Orb */}
      <div
        className="absolute top-[10%] -right-32 w-[500px] h-[500px] rounded-full blur-[105px] opacity-[0.17] animate-bubble-2"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, #a78bfa 0%, #c084fc 45%, transparent 75%)",
        }}
      />

      {/* Center-Mid Subtle Cyan Breath */}
      <div
        className="absolute top-[42%] left-[38%] w-[360px] h-[360px] rounded-full blur-[110px] opacity-[0.13] animate-bubble-3"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #38bdf8 0%, #93c5fd 45%, transparent 75%)",
        }}
      />

      {/* Bottom-Left Soft Mint-Emerald Orb */}
      <div
        className="absolute bottom-[8%] -left-24 w-[460px] h-[460px] rounded-full blur-[100px] opacity-[0.17] animate-bubble-4"
        style={{
          background:
            "radial-gradient(circle at 45% 45%, #34d399 0%, #2dd4bf 45%, transparent 75%)",
        }}
      />

      {/* Bottom-Right Soft Warm Rose-Peach Orb */}
      <div
        className="absolute -bottom-24 right-[8%] w-[400px] h-[400px] rounded-full blur-[95px] opacity-[0.15] animate-bubble-1"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #fda4af 0%, #fcd34d 45%, transparent 75%)",
        }}
      />
    </div>
  );
}

