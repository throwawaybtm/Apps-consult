const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createProject } = require("./new-project.cjs");

const tmpRoot = () => fs.mkdtempSync(path.join(os.tmpdir(), "np-"));

test("createProject creates the folder layout", () => {
  const root = tmpRoot();
  const result = createProject("toko-budi", root);
  assert.equal(result, path.join(root, "toko-budi"));
  for (const dir of ["research", "guidebook/assets", "agent-kit/specs"]) {
    assert.ok(fs.statSync(path.join(result, dir)).isDirectory(), dir);
    assert.ok(fs.existsSync(path.join(result, dir, ".gitkeep")), `${dir}/.gitkeep`);
  }
});

test("createProject rejects invalid names", () => {
  const root = tmpRoot();
  for (const name of ["Toko Budi", "toko_budi", "-toko", ""]) {
    assert.throws(() => createProject(name, root), /lowercase letters, digits and single hyphens/, name);
  }
  assert.deepEqual(fs.readdirSync(root), []);
});

test("createProject refuses an existing project", () => {
  const root = tmpRoot();
  const dir = createProject("toko-budi", root);
  const notes = path.join(dir, "research", "notes.md");
  fs.writeFileSync(notes, "catatan penting");
  assert.throws(() => createProject("toko-budi", root), /already exists/);
  assert.equal(fs.readFileSync(notes, "utf8"), "catatan penting");
});

test("new-project CLI creates projects in the repo, whatever folder it runs from", () => {
  const { spawnSync } = require("node:child_process");
  const repoProjects = path.join(__dirname, "..", "projects");
  const name = "zz-cli-cwd-test";
  const target = path.join(repoProjects, name);
  try {
    const r = spawnSync(process.execPath, [path.join(__dirname, "new-project.cjs"), name], { cwd: tmpRoot(), encoding: "utf8" });
    assert.equal(r.status, 0, r.stderr);
    assert.ok(fs.existsSync(path.join(target, "research")));
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});
