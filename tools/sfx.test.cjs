const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { searchSounds, getSound, creditsStatus } = require("./sfx.cjs");

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "sfx-"));

// Fake Openverse + CDN: no network in tests.
function fakeFetch(records) {
  const calls = [];
  const fn = async (url) => {
    calls.push(url);
    const u = new URL(url);
    if (u.pathname === "/v1/audio/") {
      return { ok: true, json: async () => ({ results: Object.values(records) }) };
    }
    const m = u.pathname.match(/^\/v1\/audio\/([^/]+)\/$/);
    if (m) return records[m[1]] ? { ok: true, json: async () => records[m[1]] } : { ok: false, status: 404 };
    return { ok: true, arrayBuffer: async () => new TextEncoder().encode("ID3fake-mp3").buffer };
  };
  fn.calls = calls;
  return fn;
}

const rec = (id, license, extra = {}) => ({
  id, title: `Klik ${id}`, license, license_version: "1.0", creator: "Pembuat", creator_url: "https://example.org/u",
  foreign_landing_url: `https://freesound.org/s/${id}/`, url: `https://cdn.example.org/${id}.mp3`,
  filetype: "mp3", duration: 1200, source: "freesound", ...extra,
});

test("searchSounds asks Openverse for CC0 and CC BY only and maps the results", async () => {
  const fetchFn = fakeFetch({ a: rec("a", "cc0"), b: rec("b", "by") });
  const results = await searchSounds("mouse click", { fetchFn });
  assert.match(fetchFn.calls[0], /license=cc0%2Cby|license=cc0,by/);
  assert.match(fetchFn.calls[0], /q=mouse(\+|%20)click/);
  assert.deepEqual(results.map((r) => [r.id, r.license, r.needsCredit]), [["a", "cc0", false], ["b", "by", true]]);
});

test("searchSounds --cc0 restricts to CC0", async () => {
  const fetchFn = fakeFetch({ a: rec("a", "cc0") });
  await searchSounds("pop", { fetchFn, cc0Only: true });
  assert.match(fetchFn.calls[0], /license=cc0(&|$)/);
});

test("getSound saves the file and records its credit", async () => {
  const root = tmp();
  const r = await getSound("b", "e-blud", { fetchFn: fakeFetch({ b: rec("b", "by") }), root });
  assert.equal(r.file, path.join(root, "projects", "e-blud", "video", "public", "sfx", "klik-b-b.mp3"));
  assert.ok(fs.readFileSync(r.file, "latin1").startsWith("ID3"));
  const credits = JSON.parse(fs.readFileSync(path.join(root, "projects", "e-blud", "video", "public", "sfx", "credits.json"), "utf8"));
  assert.equal(credits.length, 1);
  assert.equal(credits[0].file, "klik-b-b.mp3");
  assert.equal(credits[0].needsCredit, true);
  assert.equal(credits[0].credit, '"Klik b" by Pembuat, CC BY 1.0, via freesound');
  assert.equal(credits[0].source, "https://freesound.org/s/b/");
});

test("getSound refuses licenses that forbid commercial use, editing or require share-alike", async () => {
  for (const lic of ["by-nc", "by-nd", "by-sa", "by-nc-sa", "by-nc-nd", "sampling+"]) {
    await assert.rejects(getSound("x", "e-blud", { fetchFn: fakeFetch({ x: rec("x", lic) }), root: tmp() }), /not allowed/, lic);
  }
});

test("getSound does not duplicate a credit when the same sound is fetched twice", async () => {
  const root = tmp();
  const fetchFn = fakeFetch({ a: rec("a", "cc0") });
  await getSound("a", "e-blud", { fetchFn, root });
  await getSound("a", "e-blud", { fetchFn, root });
  assert.equal(creditsStatus("e-blud", { root }).entries.length, 1);
});

test("creditsStatus says whether the video needs a credits card and which sounds to swap otherwise", async () => {
  const root = tmp();
  const fetchFn = fakeFetch({ a: rec("a", "cc0"), b: rec("b", "by") });
  await getSound("a", "e-blud", { fetchFn, root });
  assert.equal(creditsStatus("e-blud", { root }).needsCredit, false);
  await getSound("b", "e-blud", { fetchFn, root });
  const s = creditsStatus("e-blud", { root });
  assert.equal(s.needsCredit, true);
  assert.deepEqual(s.toSwap, ["klik-b-b.mp3"]);
});

test("creditsStatus on a project with no sounds", () => {
  assert.deepEqual(creditsStatus("e-blud", { root: tmp() }), { entries: [], needsCredit: false, toSwap: [] });
});

test("sfx CLI sends its requests through HTTPS_PROXY when one is set", async () => {
  const http = require("node:http");
  const { spawn } = require("node:child_process");
  const seen = [];
  const proxy = http.createServer();
  proxy.on("connect", (req, socket) => {
    seen.push(req.url);
    socket.end("HTTP/1.1 502 Bad Gateway\r\n\r\n");
  });
  await new Promise((r) => proxy.listen(0, "127.0.0.1", r));
  const { port } = proxy.address();
  const env = { ...process.env, HTTPS_PROXY: `http://127.0.0.1:${port}`, https_proxy: `http://127.0.0.1:${port}`, NO_PROXY: "", no_proxy: "" };
  delete env.NODE_USE_ENV_PROXY;
  const child = spawn(process.execPath, [path.join(__dirname, "sfx.cjs"), "search", "chime"], { env });
  await new Promise((r) => child.on("exit", r));
  proxy.close();
  assert.ok(seen.some((u) => u.startsWith("api.openverse.org:443")), `proxy saw: ${JSON.stringify(seen)}`);
});
