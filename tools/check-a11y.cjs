const path = require("node:path");
const { resolveInput, withLoadedPage } = require("./build-pdf.cjs");

// WCAG 2.0, 2.1 and 2.2 at levels A and AA: the repo's bar is WCAG 2.2 AA.
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function checkA11y(inputHtml) {
  const abs = resolveInput(inputHtml);
  return withLoadedPage(abs, async (page) => {
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    return page.evaluate((tags) => window.axe.run(document, { runOnly: { type: "tag", values: tags } }), WCAG_TAGS);
  });
}

function report(file, result) {
  const lines = [];
  if (result.violations.length === 0) lines.push(`${file}: no violations`);
  for (const v of result.violations) {
    lines.push(`${file}: [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length}x)`);
    for (const n of v.nodes.slice(0, 5)) lines.push(`    at ${n.target.join(" ")}`);
    lines.push(`    ${v.helpUrl}`);
  }
  if (result.incomplete.length) {
    lines.push(`${file}: ${result.incomplete.length} item(s) need a manual check: ${result.incomplete.map((i) => i.id).join(", ")}`);
  }
  return lines.join("\n");
}

module.exports = { checkA11y };

if (require.main === module) {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error("Usage: node tools/check-a11y.cjs <page.html> [more.html ...]");
    process.exit(1);
  }
  (async () => {
    let failed = false;
    for (const file of files) {
      try {
        const result = await checkA11y(file);
        console.log(report(path.basename(file), result));
        if (result.violations.length) failed = true;
      } catch (err) {
        console.error(`${file}: ${err.message}`);
        failed = true;
      }
    }
    process.exit(failed ? 1 : 0);
  })();
}
