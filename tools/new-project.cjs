const fs = require("node:fs");
const path = require("node:path");

const NAME_RULE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DIRS = ["research", "guidebook/assets", "agent-kit/specs"];

function createProject(name, rootDir = "projects") {
  if (typeof name !== "string" || !NAME_RULE.test(name)) {
    throw new Error(
      `Invalid project name "${name}": use lowercase letters, digits and single hyphens (e.g. toko-budi).`
    );
  }
  const projectDir = path.join(rootDir, name);
  if (fs.existsSync(projectDir)) {
    throw new Error(`Project "${name}" already exists at ${projectDir}; nothing was changed.`);
  }
  for (const dir of DIRS) {
    const full = path.join(projectDir, dir);
    fs.mkdirSync(full, { recursive: true });
    fs.writeFileSync(path.join(full, ".gitkeep"), "");
  }
  return projectDir;
}

module.exports = { createProject };

if (require.main === module) {
  try {
    console.log(createProject(process.argv[2], path.join(__dirname, "..", "projects")));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
