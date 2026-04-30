const fs = require("node:fs/promises");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const siteDir = path.join(rootDir, "site");
const dataDir = path.join(rootDir, "content-api", "data");
const productsFile = path.join(dataDir, "products.json");
const postsFile = path.join(dataDir, "posts.json");
const siteUrl = (process.env.SITE_URL || "https://winwinstonecustom.com").replace(/\/+$/, "");

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripTags(value) {
  return String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function xmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toUrlPath(...segments) {
  return `/${segments.map((segment) => String(segment || "").replace(/^\/+|\/+$/g, "")).join("/")}/`;
}

function splitUsage(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderLayout({ title, description, keywords = "", canonicalPath, ogType, ogImage, body, schema }) {
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}">` : ""}
    <meta name="theme-color" content="#13261d">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:type" content="${escapeHtml(ogType)}">
    <meta property="og:image" content="${escapeHtml(ogImage)}">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    <link rel="icon" href="../../assets/images/favicon.png">
    <link rel="stylesheet" href="../../assets/css/styles.css">
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header is-scrolled">
      <nav class="nav-shell" aria-label="Primary navigation">
        <a class="brand" href="../../index.html" aria-label="Win-Win Stone">
          <img src="../../assets/images/logo.png" alt="" width="36" height="39">
          <span>Win-Win Stone</span>
        </a>
        <div class="nav-links">
          <a href="../../products.html">Products</a>
          <a href="../../blog.html">Blog</a>
          <a href="../../index.html#service">OEM/ODM</a>
          <a href="../../index.html#contact">Contact</a>
        </div>
      </nav>
    </header>
    ${body}
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <a class="brand footer-brand" href="../../index.html">
            <img src="../../assets/images/logo.png" alt="" width="36" height="39">
            <span>Win-Win Stone</span>
          </a>
          <p>Factory-backed natural stone manufacturing with OEM/ODM support, custom production, and export-ready delivery.</p>
        </div>
        <div class="footer-links">
          <a href="../../products.html">Products</a>
          <a href="../../blog.html">Blog</a>
          <a href="../../index.html#service">OEM/ODM</a>
          <a href="../../index.html#contact">Contact</a>
        </div>
      </div>
    </footer>
  </body>
</html>
`;
}

function renderProductPage(product) {
  const title = product.seo?.title || product.name;
  const description = product.seo?.description || product.summary || product.desc || "";
  const canonicalPath = toUrlPath("products", product.slug);
  const usageItems = splitUsage(product.usage);
  const galleryItems = (product.gallery || []).length ? product.gallery : [product.image].filter(Boolean);
  const galleryHtml = galleryItems
    .map(
      (image) => `
            <figure class="product-gallery-card">
              <img src="../../${escapeHtml(image)}" alt="${escapeHtml(product.name)}">
            </figure>`
    )
    .join("");
  const optionHtml = (product.options || []).map((option) => `<li>${escapeHtml(option)}</li>`).join("");
  const faqHtml = (product.faqs || [])
    .map(
      (faq) => `
            <article>
              <h3>${escapeHtml(faq.question)}</h3>
              <p>${escapeHtml(faq.answer)}</p>
            </article>`
    )
    .join("");
  const usageHtml = usageItems
    .map(
      (item, index) => `
            <article>
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${escapeHtml(item)}</strong>
            </article>`
    )
    .join("");

  const body = `
    <main id="main">
      <section class="product-detail-hero" aria-labelledby="product-title">
        <div class="container product-detail-grid">
          <div class="product-detail-media">
            <img src="../../${escapeHtml(product.image || galleryItems[0] || "")}" alt="${escapeHtml(product.name)}">
            <div class="product-gallery">${galleryHtml}</div>
          </div>
          <div class="product-detail-copy">
            <a class="text-link product-back-link" href="../../products.html">
              <span>Back to products</span>
            </a>
            <p class="eyebrow">${escapeHtml(product.badge || product.category || "Custom Natural Stone")}</p>
            <h1 id="product-title">${escapeHtml(product.name)}</h1>
            <p class="product-detail-lede">${escapeHtml(product.desc || product.summary || "")}</p>
            <div class="product-detail-actions">
              <a class="button primary" href="https://wa.me/13927192948" target="_blank" rel="noopener">Send Drawing on WhatsApp</a>
              <a class="button ghost" href="mailto:stone2lisa@outlook.com">Request Quote by Email</a>
            </div>
            <p class="product-action-note">Send your target size, quantity, finish, and reference photo or drawing for factory review.</p>
            <div class="product-quick-grid" aria-label="Quick product facts">
              <article><span>Material</span><strong>${escapeHtml(product.material || "Natural stone")}</strong></article>
              <article><span>Finish</span><strong>${escapeHtml(product.finish || "Polished or honed")}</strong></article>
              <article><span>MOQ</span><strong>${escapeHtml(product.moq || "1 piece")}</strong></article>
              <article><span>Lead Time</span><strong>${escapeHtml(product.leadTime || "20-45 days")}</strong></article>
            </div>
          </div>
        </div>
      </section>

      <section class="product-detail-section section-pad">
        <div class="container product-detail-columns">
          <div>
            <p class="eyebrow">Product Overview</p>
            <h2>Built around your drawing, material, and market requirement.</h2>
            <p>${escapeHtml(product.intro || product.summary || "")}</p>
          </div>
          <div class="product-spec-panel" aria-label="Product specifications">
            <div><span>Material</span><strong>${escapeHtml(product.material || "")}</strong></div>
            <div><span>Usage</span><strong>${escapeHtml(product.usage || "")}</strong></div>
            <div><span>Finish</span><strong>${escapeHtml(product.finish || "")}</strong></div>
            <div><span>MOQ</span><strong>${escapeHtml(product.moq || "")}</strong></div>
            <div><span>Lead Time</span><strong>${escapeHtml(product.leadTime || "")}</strong></div>
          </div>
        </div>
      </section>

      <section class="product-detail-section section-pad">
        <div class="container product-detail-columns">
          <div>
            <p class="eyebrow">Applications</p>
            <h2>Where buyers typically use this product.</h2>
            <p>Use these directions to match the product to your collection, project type, or target market before requesting a quote.</p>
          </div>
          <div class="product-usage-grid" aria-label="Product use cases">${usageHtml}</div>
        </div>
      </section>

      <section class="product-detail-section product-custom-section section-pad">
        <div class="container product-detail-columns">
          <div>
            <p class="eyebrow">Custom Options</p>
            <h2>Tell us what you need to change before production starts.</h2>
            <p>Most buyers confirm size, finish, structure, and packing first. Use this section to identify the details you want quoted or adjusted.</p>
          </div>
          <ul class="product-option-list">${optionHtml}</ul>
        </div>
      </section>

      <section class="product-detail-section section-pad">
        <div class="container product-detail-columns">
          <div>
            <p class="eyebrow">Buyer Questions</p>
            <h2>Common questions before ordering custom stone products.</h2>
            <p>These are the questions buyers usually ask before moving from reference stage to quote confirmation and production review.</p>
          </div>
          <div class="product-faq-list">${faqHtml}</div>
        </div>
      </section>
    </main>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    image: galleryItems.map((item) => `${siteUrl}/${item.replace(/^\/+/, "")}`),
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "Win-Win Stone"
    },
    manufacturer: {
      "@type": "Organization",
      name: "Win-Win Stone"
    }
  };

  return renderLayout({
    title,
    description,
    keywords: product.seo?.keywords || "",
    canonicalPath,
    ogType: "product",
    ogImage: `${siteUrl}/${(product.image || "").replace(/^\/+/, "")}`,
    body,
    schema
  });
}

function renderPostPage(post) {
  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.excerpt || "";
  const canonicalPath = toUrlPath("blog", post.slug);
  const faqHtml = (post.faqs || [])
    .map(
      (faq) => `
            <article>
              <h3>${escapeHtml(faq.question)}</h3>
              <p>${escapeHtml(faq.answer)}</p>
            </article>`
    )
    .join("");

  const body = `
    <main id="main">
      <section class="page-hero article-hero section-pad" aria-labelledby="post-title">
        <div class="container">
          <p class="eyebrow">${escapeHtml(post.category || "Stone Guide")}</p>
          <h1 id="post-title">${escapeHtml(post.title)}</h1>
          <p>${escapeHtml(post.excerpt || "")}</p>
          <div class="story-meta">
            <span>${escapeHtml(post.author || "Win-Win Stone")}</span>
            <span>${escapeHtml(String(post.publishedAt || post.updatedAt || "").slice(0, 10))}</span>
          </div>
        </div>
      </section>

      <section class="section-pad">
        <div class="container" style="display:grid;gap:2rem;">
          <article class="article-content">
            <img src="../../${escapeHtml(post.coverImage || "")}" alt="${escapeHtml(post.coverAlt || post.title)}">
            <div>${post.body || ""}</div>
          </article>
        </div>
      </section>

      <section class="section-pad" aria-labelledby="post-faq-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">FAQ</p>
            <h2 id="post-faq-title">Reader Questions</h2>
          </div>
          <div class="product-faq-list">${faqHtml}</div>
        </div>
      </section>
    </main>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    image: [`${siteUrl}/${(post.coverImage || "").replace(/^\/+/, "")}`],
    author: {
      "@type": "Organization",
      name: post.author || "Win-Win Stone"
    },
    publisher: {
      "@type": "Organization",
      name: "Win-Win Stone",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/images/logo.png`
      }
    },
    datePublished: post.publishedAt || post.updatedAt,
    dateModified: post.updatedAt || post.publishedAt
  };

  return renderLayout({
    title,
    description,
    keywords: post.seo?.keywords || "",
    canonicalPath,
    ogType: "article",
    ogImage: `${siteUrl}/${(post.coverImage || "").replace(/^\/+/, "")}`,
    body,
    schema
  });
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function resetGeneratedDir(dirPath) {
  await fs.rm(dirPath, { recursive: true, force: true });
  await fs.mkdir(dirPath, { recursive: true });
}

async function writeGeneratedPage(relativeDir, html) {
  const outputDir = path.join(siteDir, relativeDir);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "index.html"), html, "utf8");
}

async function buildSitemap(products, posts) {
  const urls = [
    { path: "/", priority: "1.0" },
    { path: "/products.html", priority: "0.9" },
    { path: "/blog.html", priority: "0.8" },
    ...products.map((product) => ({ path: toUrlPath("products", product.slug), priority: "0.8" })),
    ...posts.map((post) => ({ path: toUrlPath("blog", post.slug), priority: "0.7" }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${xmlEscape(`${siteUrl}${entry.path}`)}</loc>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  await fs.writeFile(path.join(siteDir, "sitemap.xml"), xml, "utf8");
}

async function main() {
  const [products, posts] = await Promise.all([readJson(productsFile), readJson(postsFile)]);
  const publishedProducts = products
    .filter((product) => product.status === "published" && product.slug)
    .sort((left, right) => (left.sortOrder || 999) - (right.sortOrder || 999));
  const publishedPosts = posts
    .filter((post) => post.status === "published" && post.slug)
    .sort((left, right) => (left.sortOrder || 999) - (right.sortOrder || 999));

  await Promise.all([resetGeneratedDir(path.join(siteDir, "products")), resetGeneratedDir(path.join(siteDir, "blog"))]);

  for (const product of publishedProducts) {
    await writeGeneratedPage(path.join("products", product.slug), renderProductPage(product));
  }

  for (const post of publishedPosts) {
    await writeGeneratedPage(path.join("blog", post.slug), renderPostPage(post));
  }

  await buildSitemap(publishedProducts, publishedPosts);

  console.log(`Generated ${publishedProducts.length} product pages, ${publishedPosts.length} blog pages, and sitemap.xml`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
