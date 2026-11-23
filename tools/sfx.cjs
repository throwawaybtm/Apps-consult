const fs = require("node:fs");
const path = require("node:path");

const API = "https://api.openverse.org/v1/audio/";
const ROOT = path.join(__dirname, "..");

// Licenses safe for commercial client videos that we edit and mix.
// CC0 and Public Domain Mark need no credit; CC BY needs a visible credit.
// NC (non-commercial), ND (no edits), SA (share-alike) and sampling+ are refused.
const ALLOWED = {
  cc0: { label: "CC0", needsCredit: false },
  pdm: { label: "Public Domain Mark", needsCredit: false },
  by: { label: "CC BY", needsCredit: true },
};

const slug = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "sound";
const sfxDir = (project, root) => path.join(root, "projects", project, "video", "public", "sfx");
const creditsFile = (project, root) => path.join(sfxDir(project, root), "credits.json");

function toResult(r) {
  return {
    id: r.id,
    title: r.title,
    license: r.license,
    needsCredit: ALLOWED[r.license]?.needsCredit ?? true,
    seconds: r.duration ? Math.round(r.duration / 100) / 10 : null,
    creator: r.creator || "unknown",
    source: r.foreign_landing_url,
  };
}

async function searchSounds(query, { fetchFn = fetch, cc0Only = false, pageSize = 10 } = {}) {
  const params = new URLSearchParams({ q: query, license: cc0Only ? "cc0" : "cc0,by", page_size: String(pageSize) });
  const res = await fetchFn(`${API}?${params}`);
  if (!res.ok) throw new Error(`Openverse search failed (HTTP ${res.status})`);
  return (await res.json()).results.map(toResult);
}

function readCredits(project, root) {
  const f = creditsFile(project, root);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : [];
}

async function getSound(id, project, { fetchFn = fetch, root = ROOT } = {}) {
  const res = await fetchFn(`${API}${encodeURIComponent(id)}/`);
  if (!res.ok) throw new Error(`Openverse sound ${id} not found (HTTP ${res.status})`);
  const r = await res.json();
  const lic = ALLOWED[r.license];
  if (!lic) throw new Error(`License "${r.license}" is not allowed for client videos (only CC0, Public Domain Mark or CC BY).`);

  const ext = (r.filetype || "mp3").replace(/[^a-z0-9]/gi, "") || "mp3";
  const name = `${slug(r.title || "sound")}-${String(r.id).slice(0, 8)}.${ext}`;
  const dir = sfxDir(project, root);
  fs.mkdirSync(dir, { recursive: true });
  const audio = await fetchFn(r.url);
  if (!audio.ok) throw new Error(`Download failed (HTTP ${audio.status}): ${r.url}`);
  const file = path.join(dir, name);
  fs.writeFileSync(file, Buffer.from(await audio.arrayBuffer()));

  const version = r.license_version ? ` ${r.license_version}` : "";
  const entry = {
    file: name,
    id: r.id,
    title: r.title,
    creator: r.creator || "unknown",
    license: r.license,
    licenseLabel: `${lic.label}${version}`,
    needsCredit: lic.needsCredit,
    credit: `"${r.title}" by ${r.creator || "unknown"}, ${lic.label}${version}, via ${r.source}`,
    source: r.foreign_landing_url,
  };
  const credits = readCredits(project, root).filter((c) => c.id !== r.id);
  credits.push(entry);
  fs.writeFileSync(creditsFile(project, root), JSON.stringify(credits, null, 2) + "\n");
  return { file, needsCredit: lic.needsCredit, entry };
}

function creditsStatus(project, { root = ROOT } = {}) {
  const entries = readCredits(project, root);
  const toSwap = entries.filter((e) => e.needsCredit).map((e) => e.file);
  return { entries, needsCredit: toSwap.length > 0, toSwap };
}

module.exports = { searchSounds, getSound, creditsStatus };

// Node's built-in fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY=1 (Node >= 22.21).
// Cloud sessions reach the internet only through that proxy, so re-run with it switched on.
function needsProxyRelaunch(env = process.env) {
  return Boolean(env.HTTPS_PROXY || env.https_proxy) && !env.NODE_USE_ENV_PROXY;
}

if (require.main === module && needsProxyRelaunch()) {
  const { spawnSync } = require("node:child_process");
  const r = spawnSync(process.execPath, ["--disable-warning=UNDICI-EHPA", __filename, ...process.argv.slice(2)], {
    env: { ...process.env, NODE_USE_ENV_PROXY: "1" },
    stdio: "inherit",
  });
  process.exit(r.status ?? 1);
} else if (require.main === module) {
  const [cmd, ...args] = process.argv.slice(2);
  const usage = [
    'npm run sfx -- search "<terms>" [--cc0]',
    "npm run sfx -- get <openverse-id> <project>",
    "npm run sfx -- status <project>",
  ].join("\n  ");
  const needProject = (p) => {
    if (!p || !fs.existsSync(path.join(ROOT, "projects", p))) throw new Error(`Unknown project "${p}" (expected a folder in projects/).`);
  };
  (async () => {
    if (cmd === "search" && args[0]) {
      const results = await searchSounds(args[0], { cc0Only: args.includes("--cc0") });
      if (!results.length) console.log("No results.");
      for (const r of results) {
        console.log(`${r.id}  [${r.license}${r.needsCredit ? ", needs credit" : ""}]  ${r.seconds ?? "?"}s  ${r.title} by ${r.creator}\n    ${r.source}`);
      }
    } else if (cmd === "get" && args[1]) {
      needProject(args[1]);
      const r = await getSound(args[0], args[1]);
      console.log(`${path.relative(ROOT, r.file)}  (${r.entry.licenseLabel}${r.needsCredit ? ", needs credit in the video" : ", no credit needed"})`);
    } else if (cmd === "status" && args[0]) {
      needProject(args[0]);
      const s = creditsStatus(args[0]);
      for (const e of s.entries) console.log(`${e.file}  ${e.licenseLabel}${e.needsCredit ? "  ← needs credit" : ""}`);
      console.log(s.needsCredit
        ? `\nCredits needed: add a credits end card (read video/public/sfx/credits.json), or swap these for CC0 sounds: ${s.toSwap.join(", ")}`
        : "\nNo credits needed.");
    } else {
      console.error(`Usage:\n  ${usage}`);
      process.exit(1);
    }
  })().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
