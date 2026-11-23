import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { C, captionOf, framesOf } from "../theme";

// The 14 features of the PRD (F1 to F14), same names and numbers.
const FEATURES: Array<[string, string, boolean]> = [
  ["F1", "Login dan peran", false],
  ["F2", "Data mitra", false],
  ["F3", "Permohonan pembiayaan", true],
  ["F4", "Survei dan analisa", false],
  ["F5", "Penetapan dan validasi SOP", false],
  ["F6", "Akad dan pencairan", false],
  ["F7", "Jadwal cicilan dan pembayaran", false],
  ["F8", "Pelunasan dan penyesuaian", false],
  ["F9", "Dashboard", false],
  ["F10", "Laporan inti", false],
  ["F11", "Cetak dokumen", false],
  ["F12", "Log aktivitas", false],
  ["F13", "Situs publik", true],
  ["F14", "Lacak permohonan", true],
];

export const S9Fitur: React.FC = () => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  return (
    <SceneShell frames={framesOf("S9Fitur")} caption={captionOf("S9Fitur")} background={`linear-gradient(180deg, ${C.tint}, #E0F2FE)`}>
      <div style={{ position: "absolute", left: 100, top: 70 }}>
        <div style={{ fontSize: 32, fontWeight: 600, color: C.brand }}>Cakupan</div>
        <div style={{ fontSize: 84, lineHeight: 1.05, fontWeight: 700, color: C.navy, letterSpacing: -2, marginTop: 8 }}>14 fitur, satu nomor di semua dokumen</div>
      </div>
      <div style={{ position: "absolute", left: 100, top: 300, width: 1720, display: "flex", flexWrap: "wrap", gap: 16 }}>
        {FEATURES.map(([f, name, pub], i) => {
          const t = interpolate(frame, [10 + i * 5, 26 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
          return (
            <div key={f} style={{ boxSizing: "border-box", width: 232, minHeight: 238, background: pub ? C.halo : C.white, border: `3px solid ${pub ? C.brand : C.line}`, borderRadius: 20, padding: "18px 18px 16px", opacity: t, translate: `0px ${interpolate(t, [0, 1], [24, 0])}px` }}>
              <div style={{ fontSize: 64, lineHeight: 1, fontWeight: 700, color: C.brand }}>{f}</div>
              <div style={{ fontSize: 32, lineHeight: 1.2, fontWeight: 600, color: C.ink, marginTop: 12 }}>{name}</div>
              <div style={{ fontSize: 28, color: C.body, marginTop: 10 }}>{pub ? "Publik" : "Petugas"}</div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};
