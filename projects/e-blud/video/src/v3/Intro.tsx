import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";
import { SceneShell3 } from "./SceneShell3";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Scene 1: the hook. The problem in one line, then the name.
export const V1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (from: number) => spring({ frame: frame - from, fps, config: { damping: 13, stiffness: 140 } });
  const phase1 = interpolate(frame, [0, 3, 46, 58], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase2 = (from: number) => interpolate(frame, [from, from + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const grid = interpolate(frame, [0, 120], [1, 1.12]);
  return (
    <SceneShell3 id="V1Hook" background={`radial-gradient(circle at 82% 12%, rgba(125,211,252,0.25), transparent 42%), ${C.navy}`}>
      <div style={{ position: "absolute", inset: 0, scale: grid, backgroundImage: "linear-gradient(rgba(186,230,253,0.09) 2px, transparent 2px), linear-gradient(90deg, rgba(186,230,253,0.09) 2px, transparent 2px)", backgroundSize: "160px 90px" }} />
      <div style={{ position: "absolute", left: 150, top: 170, opacity: phase1 }}>
        <div style={{ fontSize: 150, lineHeight: 1, fontWeight: 700, color: C.white, letterSpacing: -4, scale: pop(2), transformOrigin: "0% 50%" }}>Masih pakai</div>
        <div style={{ fontSize: 330, lineHeight: 1.05, fontWeight: 700, color: C.sky, letterSpacing: -10, marginTop: 10, scale: pop(10), transformOrigin: "0% 50%" }}>Excel?</div>
      </div>
      <div style={{ position: "absolute", left: 180, top: 150 }}>
        <div style={{ width: 130, height: 130, borderRadius: 34, background: C.white, color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 66, fontWeight: 700, opacity: phase2(54), scale: pop(54) }}>eB</div>
        <div style={{ fontSize: 220, lineHeight: 1, fontWeight: 700, color: C.white, letterSpacing: -7, marginTop: 34, opacity: phase2(60), translate: `0px ${interpolate(phase2(60), [0, 1], [24, 0])}px` }}>e-BLUD</div>
        <div style={{ fontSize: 60, lineHeight: 1.2, color: C.halo, marginTop: 20, opacity: phase2(70) }}>Sistem digital untuk BLUD Diskum Batam</div>
        <div style={{ display: "inline-block", marginTop: 34, background: C.warnBg, color: C.warn, borderRadius: 40, padding: "10px 34px", fontSize: 40, fontWeight: 600, opacity: phase2(80) }}>Contoh tampilan · Draft v0</div>
      </div>
    </SceneShell3>
  );
};

// Scene 2: the problem, a spreadsheet with duplicated and missing data. All values are examples.
const HEAD = ["Nomor", "Mitra", "Jumlah", "Status"];
const ROWS: string[][] = [
  ["KD-2026-0001", "Mitra Contoh A", "Rp 20.000.000", "Lunas"],
  ["KD-2026-0002", "Mitra Contoh B", "Rp 30.000.000", "Berjalan"],
  ["KD-2026-0003", "Mitra Contoh C", "Rp 15.000.000", ""],
  ["KD-2026-0004", "Mitra Contoh B", "Rp 30.000.000", "Berjalan"],
  ["KD-2026-0005", "Mitra Contoh D", "Rp 10.000.000", ""],
  ["KD-2026-0006", "Mitra Contoh E", "Rp 25.000.000", "Lunas"],
];
const COLS = [260, 270, 250, 160];

export const V2Masalah: React.FC = () => {
  const frame = useCurrentFrame();
  const show = (from: number) => interpolate(frame, [from, from + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const dup = show(56);
  const statements = ["Data ganda", "Status sulit dicari", "Laporan lambat"];
  return (
    <SceneShell3 id="V2Masalah" background={C.navy}>
      <div style={{ position: "absolute", left: 110, top: 150, width: 760 }}>
        <div style={{ fontSize: 32, fontWeight: 600, color: C.sky }}>Masalah sekarang</div>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 34 }}>
          {statements.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 24, opacity: show(12 + i * 28), translate: `${interpolate(show(12 + i * 28), [0, 1], [-30, 0])}px 0px` }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: C.pin }} />
              <div style={{ fontSize: 80, lineHeight: 1.05, fontWeight: 700, color: C.white, letterSpacing: -2 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 170, width: 940, opacity: show(2) }}>
        <div style={{ borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.06)", border: "2px solid rgba(186,230,253,0.25)" }}>
          <div style={{ display: "flex", background: "rgba(125,211,252,0.18)" }}>
            {HEAD.map((h, i) => (
              <div key={h} style={{ width: COLS[i], padding: "16px 20px", fontSize: 30, fontWeight: 700, color: C.halo }}>{h}</div>
            ))}
          </div>
          {ROWS.map((r, ri) => {
            const isDup = ri === 1 || ri === 3;
            return (
              <div key={ri} style={{ display: "flex", borderTop: "1px solid rgba(186,230,253,0.18)", background: isDup ? `rgba(194,65,12,${0.35 * dup})` : "transparent" }}>
                {r.map((c, ci) => (
                  <div key={ci} style={{ width: COLS[ci], padding: "16px 20px", fontSize: 30, color: c ? "#E6F0F8" : "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{c || "?"}</div>
                ))}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 22, display: "inline-block", background: C.pin, color: C.white, borderRadius: 30, padding: "6px 24px", fontSize: 32, fontWeight: 600, opacity: dup }}>Data ganda, status kosong (contoh)</div>
      </div>
    </SceneShell3>
  );
};
