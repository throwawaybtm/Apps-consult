import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { C, captionOf, framesOf } from "../theme";

// The problem: a spreadsheet with duplicated and missing data. All values are examples.
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

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const S2Masalah: React.FC = () => {
  const frame = useCurrentFrame();
  const show = (from: number) => interpolate(frame, [from, from + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const dup = show(100);
  const statements = ["Data mudah ganda", "Status sulit dicari", "Laporan lambat"];
  return (
    <SceneShell frames={framesOf("S2Masalah")} caption={captionOf("S2Masalah")} background={C.navy}>
      <div style={{ position: "absolute", left: 110, top: 150, width: 720 }}>
        <div style={{ fontSize: 32, fontWeight: 600, color: C.sky }}>Masalah sekarang</div>
        <div style={{ fontSize: 84, lineHeight: 1.05, fontWeight: 700, color: C.white, letterSpacing: -2, marginTop: 14 }}>Manual di Excel</div>
        <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 30 }}>
          {statements.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 22, opacity: show(30 + i * 40), translate: `${interpolate(show(30 + i * 40), [0, 1], [-24, 0])}px 0px` }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: C.pin }} />
              <div style={{ fontSize: 56, fontWeight: 600, color: C.white }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 170, width: 940, opacity: show(4) }}>
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
    </SceneShell>
  );
};
