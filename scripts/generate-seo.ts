import { writeFileSync } from "fs";
import { resolve } from "path";

const SITE_URL = "https://cosyloops.com";
const locales = ["en", "zh-hk"];

interface SitemapRoute {
  path: string;
  changefreq: string;
  priority: string;
}

const routes: SitemapRoute[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/account/login/", changefreq: "monthly", priority: "0.3" },
];

function generateSitemap(): string {
  const urls = locales.flatMap((locale) =>
    routes.map((route) => {
      const hreflangs = locales
        .map(
          (l) =>
            `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}${route.path}" />`
        )
        .join("\n");

      return `  <url>
    <loc>${SITE_URL}/${locale}${route.path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
${hreflangs}
  </url>`;
    })
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;
}

function generateRobots(): string {
  return `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /checkout/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

const publicDir = resolve(process.cwd(), "public");
writeFileSync(resolve(publicDir, "sitemap.xml"), generateSitemap());
writeFileSync(resolve(publicDir, "robots.txt"), generateRobots());

console.log("Generated sitemap.xml and robots.txt in public/");
