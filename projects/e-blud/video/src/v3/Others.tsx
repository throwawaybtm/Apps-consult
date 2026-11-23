import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { SceneShell3 } from "./SceneShell3";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clampIn = (frame: number, a: number, b: number, easing = ease) => interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// Number with Indonesian formatting: 1.234,5
const fmt = (v: number, dec: number) => {
  const [i, d] = v.toFixed(dec).split(".");
  const g = i.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return d ? `${g},${d}` : g;
};

// Scene 7: the dashboard numbers count up (F9). Example data only.
const KPIS: Array<{ label: string; value: number; dec: number; prefix: string; suffix: string }> = [
  { label: "Pencairan tahun ini", value: 338, dec: 0, prefix: "Rp ", suffix: " juta" },
  { label: "Pencairan bulan ini", value: 68, dec: 0, prefix: "Rp ", suffix: " juta" },
  { label: "Cicilan tahun ini", value: 96.4, dec: 1, prefix: "Rp ", suffix: " juta" },
  { label: "Jumlah mitra", value: 128, dec: 0, prefix: "", suffix: " orang" },
];

export const V7Angka: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell3 id="V7Angka" background={`linear-gradient(180deg, ${C.tint}, #E0F2FE)`}>
      <div style={{ position: "absolute", left: 100, top: 110 }}>
        <div style={{ fontSize: 32, fontWeight: 600, color: C.brand }}>Dashboard petugas · F9</div>
        <div style={{ fontSize: 84, lineHeight: 1.05, fontWeight: 700, color: C.navy, letterSpacing: -2, marginTop: 10 }}>Angka langsung terlihat</div>
      </div>
      <div style={{ position: "absolute", left: 100, top: 400, width: 1720, display: "flex", gap: 24 }}>
        {KPIS.map((k, i) => {
          const start = 4 + i * 10;
          const appear = clampIn(frame, start, start + 12);
          const v = k.value * clampIn(frame, start, start + 44, Easing.out(Easing.cubic));
          return (
            <div key={k.label} style={{ boxSizing: "border-box", flex: 1, background: C.white, border: `3px solid ${C.line}`, borderRadius: 28, padding: "36px 32px", opacity: appear, translate: `0px ${interpolate(appear, [0, 1], [30, 0])}px`, boxShadow: "0 18px 40px rgba(11,37,64,0.10)" }}>
              <div style={{ fontSize: 34, fontWeight: 600, color: C.body }}>{k.label}</div>
              <div style={{ fontSize: 76, lineHeight: 1.1, fontWeight: 700, color: C.navy, marginTop: 14, letterSpacing: -2, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                {k.prefix}{fmt(v, k.dec)}<span style={{ fontSize: 40, fontWeight: 600, color: C.brand, letterSpacing: 0 }}>{k.suffix}</span>
              </div>
              <div style={{ fontSize: 28, color: C.body, marginTop: 14 }}>Contoh data</div>
            </div>
          );
        })}
      </div>
    </SceneShell3>
  );
};

// Scene 10: the 14 features of the PRD (F1 to F14), same names and numbers.
const FEATURES: Array<[string, string, boolean]> = [
  ["F1", "Login dan peran", false], ["F2", "Data mitra", false], ["F3", "Permohonan pembiayaan", true], ["F4", "Survei dan analisa", false],
  ["F5", "Penetapan dan validasi SOP", false], ["F6", "Akad dan pencairan", false], ["F7", "Jadwal cicilan dan pembayaran", false],
  ["F8", "Pelunasan dan penyesuaian", false], ["F9", "Dashboard", false], ["F10", "Laporan inti", false], ["F11", "Cetak dokumen", false],
  ["F12", "Log aktivitas", false], ["F13", "Situs publik", true], ["F14", "Lacak permohonan", true],
];

export const V10Fitur: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell3 id="V10Fitur" background={`linear-gradient(180deg, ${C.tint}, #E0F2FE)`}>
      <div style={{ position: "absolute", left: 100, top: 70 }}>
        <div style={{ fontSize: 32, fontWeight: 600, color: C.brand }}>Cakupan</div>
        <div style={{ fontSize: 84, lineHeight: 1.05, fontWeight: 700, color: C.navy, letterSpacing: -2, marginTop: 8 }}>14 fitur, satu nomor di semua dokumen</div>
      </div>
      <div style={{ position: "absolute", left: 100, top: 300, width: 1720, display: "flex", flexWrap: "wrap", gap: 16 }}>
        {FEATURES.map(([f, name, pub], i) => {
          const t = clampIn(frame, 6 + i * 3, 20 + i * 3);
          return (
            <div key={f} style={{ boxSizing: "border-box", width: 232, minHeight: 238, background: pub ? C.halo : C.white, border: `3px solid ${pub ? C.brand : C.line}`, borderRadius: 20, padding: "18px 18px 16px", opacity: t, translate: `0px ${interpolate(t, [0, 1], [24, 0])}px` }}>
              <div style={{ fontSize: 64, lineHeight: 1, fontWeight: 700, color: C.brand }}>{f}</div>
              <div style={{ fontSize: 32, lineHeight: 1.2, fontWeight: 600, color: C.ink, marginTop: 12 }}>{name}</div>
              <div style={{ fontSize: 28, color: C.body, marginTop: 10 }}>{pub ? "Publik" : "Petugas"}</div>
            </div>
          );
        })}
      </div>
    </SceneShell3>
  );
};

// Scene 11: what is still an assumption.
const ASSUMPTIONS: Array<[string, string]> = [
  ["Alur kerja", "Mengikuti sistem rujukan, perlu dikoreksi"],
  ["Aturan pembiayaan", "Batas, jasa, denda, dan tanggal pencairan"],
  ["Peran petugas", "Peran yang ada di Diskum Batam"],
];

export const V11Asumsi: React.FC = () => {
  const frame = useCurrentFrame();
  const head = clampIn(frame, 4, 20);
  return (
    <SceneShell3 id="V11Asumsi" background={C.navy}>
      <div style={{ position: "absolute", left: 120, top: 130, opacity: head }}>
        <div style={{ fontSize: 32, fontWeight: 600, color: C.sky }}>Sebelum PRD disetujui</div>
        <div style={{ fontSize: 120, lineHeight: 1, fontWeight: 700, color: C.white, letterSpacing: -3, marginTop: 14 }}>Masih asumsi</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 400, width: 1680, display: "flex", gap: 28 }}>
        {ASSUMPTIONS.map(([title, text], i) => {
          const t = clampIn(frame, 14 + i * 24, 30 + i * 24);
          return (
            <div key={title} style={{ boxSizing: "border-box", flex: 1, background: C.navy2, border: "2px solid #1E4A75", borderRadius: 26, padding: 40, opacity: t, translate: `0px ${interpolate(t, [0, 1], [28, 0])}px` }}>
              <div style={{ display: "inline-block", background: C.warnBg, color: C.warn, borderRadius: 30, padding: "4px 22px", fontSize: 30, fontWeight: 700 }}>asumsi</div>
              <div style={{ fontSize: 56, lineHeight: 1.1, fontWeight: 700, color: C.white, marginTop: 24 }}>{title}</div>
              <div style={{ fontSize: 34, lineHeight: 1.3, color: "#C9DDEB", marginTop: 16 }}>{text}</div>
            </div>
          );
        })}
      </div>
    </SceneShell3>
  );
};

// Scene 12: the benefit and the next step.
const NEXT: string[] = ["Koreksi alur dan aturan", "PRD disetujui", "Panduan lengkap"];

export const V12Tutup: React.FC = () => {
  const frame = useCurrentFrame();
  const head = clampIn(frame, 4, 24);
  return (
    <SceneShell3 id="V12Tutup" background={`radial-gradient(circle at 80% 10%, rgba(125,211,252,0.25), transparent 42%), ${C.navy}`}>
      <div style={{ position: "absolute", left: 150, top: 120, width: 1500, opacity: head, translate: `0px ${interpolate(head, [0, 1], [26, 0])}px` }}>
        <div style={{ width: 110, height: 110, borderRadius: 28, background: C.white, color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, fontWeight: 700 }}>eB</div>
        <div style={{ fontSize: 112, lineHeight: 1.05, fontWeight: 700, color: C.white, letterSpacing: -3, marginTop: 30 }}>Satu sistem, dari permohonan sampai lunas</div>
      </div>
      <div style={{ position: "absolute", left: 150, top: 560, width: 1620 }}>
        <div style={{ fontSize: 34, fontWeight: 600, color: C.sky, opacity: clampIn(frame, 30, 44) }}>Langkah berikut</div>
        <div style={{ display: "flex", gap: 24, marginTop: 18 }}>
          {NEXT.map((n, i) => {
            const t = clampIn(frame, 36 + i * 16, 52 + i * 16);
            return (
              <div key={n} style={{ boxSizing: "border-box", display: "flex", alignItems: "center", gap: 18, background: C.navy2, border: "2px solid #1E4A75", borderRadius: 24, padding: "22px 30px", opacity: t, translate: `0px ${interpolate(t, [0, 1], [24, 0])}px` }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: C.brand, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700 }}>{i + 1}</div>
                <div style={{ fontSize: 40, fontWeight: 600, color: C.white, whiteSpace: "nowrap" }}>{n}</div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell3>
  );
};
