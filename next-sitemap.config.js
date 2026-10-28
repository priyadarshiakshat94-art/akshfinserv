const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

// Pages whose frontmatter sets seo.noIndex: true stay out of the sitemap.
function noIndexPaths() {
  const sets = [
    ["insights", "/insights"],
    ["offerings", "/offerings"],
  ];
  const out = [];
  for (const [folder, prefix] of sets) {
    const dir = path.join(__dirname, "content", folder);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      if (data.seo && data.seo.noIndex) out.push(`${prefix}/${file.replace(/\.mdx?$/, "")}`);
    }
  }
  return out;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://akshfinserv.com",
  generateRobotsTxt: true,
  exclude: ["/api/*", ...noIndexPaths()],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
  },
};
