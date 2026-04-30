const fs = require("node:fs/promises");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const siteDir = path.join(rootDir, "site");
const dataDir = path.join(rootDir, "content-api", "data");
const productsFile = path.join(dataDir, "products.json");
const postsFile = path.join(dataDir, "posts.json");
const siteDataDir = path.join(siteDir, "assets", "data");
const siteUrl = (process.env.SITE_URL || "https://winwinstonecustom.com").replace(/\/+$/, "");

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hasChineseText(value) {
  return /[\u3400-\u9fff]/.test(String(value || ""));
}

function getLocalizedText(zhValue, enValue) {
  return hasChineseText(zhValue) ? String(zhValue) : String(enValue || "");
}

function getLocalizedList(zhList, enList) {
  return Array.isArray(zhList) && zhList.length ? zhList : enList;
}

function splitLocalizedUsage(value, fallbackItems) {
  const usageItems = String(value || "")
    .split(/[,\uFF0C\u3001]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return usageItems.length ? usageItems : fallbackItems;
}

function serializeForInlineScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
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

function renderLayout({ title, description, keywords = "", canonicalPath, ogType, ogImage, body, schema, headerControls = "" }) {
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
        ${headerControls}
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
      (image, index) => `
            <button class="product-gallery-thumb${index === 0 ? " is-active" : ""}" type="button" data-gallery-image="../../${escapeHtml(image)}" aria-label="View ${escapeHtml(product.name)} image ${index + 1}">
              <img src="../../${escapeHtml(image)}" alt="${escapeHtml(product.name)} view ${index + 1}">
            </button>`
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
  const localizedPageContent = {
    en: {
      browserTitle: title,
      navProducts: "Products",
      navBlog: "Blog",
      navOem: "OEM/ODM",
      navContact: "Contact",
      languageLabel: "中文",
      backToProducts: "Back to products",
      badge: product.badge || product.category || "Custom Natural Stone",
      title: product.name,
      lede: product.desc || product.summary || "",
      whatsappLabel: "Send Drawing on WhatsApp",
      emailLabel: "Request Quote by Email",
      actionNote: "Send your target size, quantity, finish, and reference photo or drawing for factory review.",
      quickFactsLabel: "Quick product facts",
      labels: {
        material: "Material",
        finish: "Finish",
        moq: "MOQ",
        leadTime: "Lead Time",
        usage: "Usage"
      },
      values: {
        material: product.material || "Natural stone",
        finish: product.finish || "Polished or honed",
        moq: product.moq || "1 piece",
        leadTime: product.leadTime || "20-45 days",
        usage: product.usage || ""
      },
      sections: {
        overviewEyebrow: "Product Overview",
        overviewTitle: "Built around your drawing, material, and market requirement.",
        overviewText: product.intro || product.summary || "",
        applicationsEyebrow: "Applications",
        applicationsTitle: "Where buyers typically use this product.",
        applicationsText:
          "Use these directions to match the product to your collection, project type, or target market before requesting a quote.",
        customEyebrow: "Custom Options",
        customTitle: "Tell us what you need to change before production starts.",
        customText:
          "Most buyers confirm size, finish, structure, and packing first. Use this section to identify the details you want quoted or adjusted.",
        faqEyebrow: "Buyer Questions",
        faqTitle: "Common questions before ordering custom stone products.",
        faqText:
          "These are the questions buyers usually ask before moving from reference stage to quote confirmation and production review."
      },
      usageItems,
      optionItems: product.options || [],
      faqItems: (product.faqs || []).map((faq) => ({
        question: faq.question,
        answer: faq.answer
      })),
      footerText:
        "Factory-backed natural stone manufacturing with OEM/ODM support, custom production, and export-ready delivery."
    },
    zh: {
      browserTitle: `${getLocalizedText(product.nameZh, product.name)} | Win-Win Stone`,
      navProducts: "产品",
      navBlog: "博客",
      navOem: "定制服务",
      navContact: "联系",
      languageLabel: "EN",
      backToProducts: "返回产品目录",
      badge: getLocalizedText(product.badgeZh, product.badge || product.category || "定制天然石材"),
      title: getLocalizedText(product.nameZh, product.name),
      lede: getLocalizedText(product.descZh, product.desc || product.summary || ""),
      whatsappLabel: "WhatsApp 发图询价",
      emailLabel: "邮件获取报价",
      actionNote: "发送目标尺寸、数量、表面工艺和参考图纸，我们会先做工厂评估。",
      quickFactsLabel: "产品要点",
      labels: {
        material: "材料",
        finish: "表面",
        moq: "起订量",
        leadTime: "交期",
        usage: "用途"
      },
      values: {
        material: getLocalizedText(product.materialZh, product.material || "天然石材"),
        finish: getLocalizedText(product.finishZh, product.finish || "抛光或哑光"),
        moq: getLocalizedText(product.moqZh, product.moq || "1 件起订"),
        leadTime: getLocalizedText(product.leadTimeZh, product.leadTime || "20-45 天"),
        usage: getLocalizedText(product.usageZh, product.usage || "")
      },
      sections: {
        overviewEyebrow: "产品概览",
        overviewTitle: "围绕图纸、材料和市场需求定制生产。",
        overviewText: getLocalizedText(product.introZh, product.intro || product.summary || ""),
        applicationsEyebrow: "适用场景",
        applicationsTitle: "买家通常会把这款产品用在哪里。",
        applicationsText: "先用这些应用方向判断它是否适合你的系列、项目类型或目标市场，再决定是否询价。",
        customEyebrow: "可定制项",
        customTitle: "生产前可确认和调整的内容。",
        customText: "多数买家会先确认尺寸、表面、结构和包装，再推进报价和打样。",
        faqEyebrow: "常见问题",
        faqTitle: "下单前买家最常问的几个问题。",
        faqText: "这些问题通常会在参考款确认之后、报价和生产前被先行确认。"
      },
      usageItems: splitLocalizedUsage(product.usageZh, usageItems),
      optionItems: getLocalizedList(product.optionsZh, product.options || []),
      faqItems: (product.faqs || []).map((faq) => ({
        question: getLocalizedText(faq.questionZh, faq.question),
        answer: getLocalizedText(faq.answerZh, faq.answer)
      })),
      footerText: "依托工厂的天然石材生产能力，支持 OEM/ODM、定制加工和出口交付。"
    }
  };

  const body = `
    <main id="main">
      <section class="product-detail-hero" aria-labelledby="product-title">
        <div class="container product-detail-grid">
          <div class="product-detail-media">
            <img id="product-image" src="../../${escapeHtml(product.image || galleryItems[0] || "")}" alt="${escapeHtml(product.name)}">
            <div id="product-gallery" class="product-gallery">${galleryHtml}</div>
          </div>
          <div class="product-detail-copy">
            <a class="text-link product-back-link" href="../../products.html">
              <span id="product-back-link-text">Back to products</span>
            </a>
            <p class="eyebrow" id="product-badge">${escapeHtml(product.badge || product.category || "Custom Natural Stone")}</p>
            <h1 id="product-title">${escapeHtml(product.name)}</h1>
            <p class="product-detail-lede" id="product-lede">${escapeHtml(product.desc || product.summary || "")}</p>
            <div class="product-detail-actions">
              <a class="button primary" id="product-whatsapp" href="https://wa.me/13927192948" target="_blank" rel="noopener">Send Drawing on WhatsApp</a>
              <a class="button ghost" id="product-email" href="mailto:stone2lisa@outlook.com">Request Quote by Email</a>
            </div>
            <p class="product-action-note" id="product-action-note">Send your target size, quantity, finish, and reference photo or drawing for factory review.</p>
            <div class="product-quick-grid" id="product-quick-grid" aria-label="Quick product facts">
              <article><span id="label-material">Material</span><strong id="value-material">${escapeHtml(product.material || "Natural stone")}</strong></article>
              <article><span id="label-finish">Finish</span><strong id="value-finish">${escapeHtml(product.finish || "Polished or honed")}</strong></article>
              <article><span id="label-moq">MOQ</span><strong id="value-moq">${escapeHtml(product.moq || "1 piece")}</strong></article>
              <article><span id="label-leadTime">Lead Time</span><strong id="value-leadTime">${escapeHtml(product.leadTime || "20-45 days")}</strong></article>
            </div>
          </div>
        </div>
      </section>

      <section class="product-detail-section section-pad">
        <div class="container product-detail-columns">
          <div>
            <p class="eyebrow" id="overview-eyebrow">Product Overview</p>
            <h2 id="overview-title">Built around your drawing, material, and market requirement.</h2>
            <p id="overview-text">${escapeHtml(product.intro || product.summary || "")}</p>
          </div>
          <div class="product-spec-panel" id="product-spec-panel" aria-label="Product specifications">
            <div><span id="spec-label-material">Material</span><strong id="spec-value-material">${escapeHtml(product.material || "")}</strong></div>
            <div><span id="spec-label-usage">Usage</span><strong id="spec-value-usage">${escapeHtml(product.usage || "")}</strong></div>
            <div><span id="spec-label-finish">Finish</span><strong id="spec-value-finish">${escapeHtml(product.finish || "")}</strong></div>
            <div><span id="spec-label-moq">MOQ</span><strong id="spec-value-moq">${escapeHtml(product.moq || "")}</strong></div>
            <div><span id="spec-label-leadTime">Lead Time</span><strong id="spec-value-leadTime">${escapeHtml(product.leadTime || "")}</strong></div>
          </div>
        </div>
      </section>

      <section class="product-detail-section section-pad">
        <div class="container product-detail-columns">
          <div>
            <p class="eyebrow" id="applications-eyebrow">Applications</p>
            <h2 id="applications-title">Where buyers typically use this product.</h2>
            <p id="applications-text">Use these directions to match the product to your collection, project type, or target market before requesting a quote.</p>
          </div>
          <div class="product-usage-grid" id="product-usage-grid" aria-label="Product use cases">${usageHtml}</div>
        </div>
      </section>

      <section class="product-detail-section product-custom-section section-pad">
        <div class="container product-detail-columns">
          <div>
            <p class="eyebrow" id="custom-eyebrow">Custom Options</p>
            <h2 id="custom-title">Tell us what you need to change before production starts.</h2>
            <p id="custom-text">Most buyers confirm size, finish, structure, and packing first. Use this section to identify the details you want quoted or adjusted.</p>
          </div>
          <ul class="product-option-list" id="product-option-list">${(product.options || []).map((option) => `<li>${escapeHtml(option)}</li>`).join("")}</ul>
        </div>
      </section>

      <section class="product-detail-section section-pad">
        <div class="container product-detail-columns">
          <div>
            <p class="eyebrow" id="faq-eyebrow">Buyer Questions</p>
            <h2 id="faq-title">Common questions before ordering custom stone products.</h2>
            <p id="faq-text">These are the questions buyers usually ask before moving from reference stage to quote confirmation and production review.</p>
          </div>
          <div class="product-faq-list" id="product-faq-list">${(product.faqs || [])
            .map(
              (faq) => `
            <article>
              <h3>${escapeHtml(faq.question)}</h3>
              <p>${escapeHtml(faq.answer)}</p>
            </article>`
            )
            .join("")}</div>
        </div>
      </section>
    </main>
    <script>
      window.addEventListener("DOMContentLoaded", function () {
        const pageContent = ${serializeForInlineScript(localizedPageContent)};
        const image = document.getElementById("product-image");
        const gallery = document.getElementById("product-gallery");
        const languageToggle = document.querySelector("[data-language-toggle]");
        const languageLabel = document.querySelector("[data-language-label]");
        if (!image || !gallery) return;

        function setText(id, value) {
          const element = document.getElementById(id);
          if (element && value !== undefined) {
            element.textContent = value;
          }
        }

        function setHtml(id, value) {
          const element = document.getElementById(id);
          if (element) {
            element.innerHTML = value;
          }
        }

        function renderUsage(items) {
          return items
            .map((item, index) => \`
              <article>
                <span>\${String(index + 1).padStart(2, "0")}</span>
                <strong>\${item}</strong>
              </article>\`)
            .join("");
        }

        function renderOptions(items) {
          return items.map((item) => \`<li>\${item}</li>\`).join("");
        }

        function renderFaqs(items) {
          return items
            .map((item) => \`
              <article>
                <h3>\${item.question}</h3>
                <p>\${item.answer}</p>
              </article>\`)
            .join("");
        }

        function applyLanguage(language) {
          const copy = pageContent[language] || pageContent.en;
          const alternateLanguage = language === "zh" ? "en" : "zh";

          document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
          document.title = copy.browserTitle || pageContent.en.browserTitle;
          if (languageLabel) {
            languageLabel.textContent = pageContent[alternateLanguage]?.languageLabel || "中文";
          }

          setText("product-back-link-text", copy.backToProducts);
          setText("product-badge", copy.badge);
          setText("product-title", copy.title);
          setText("product-lede", copy.lede);
          setText("product-whatsapp", copy.whatsappLabel);
          setText("product-email", copy.emailLabel);
          setText("product-action-note", copy.actionNote);

          setText("label-material", copy.labels.material);
          setText("label-finish", copy.labels.finish);
          setText("label-moq", copy.labels.moq);
          setText("label-leadTime", copy.labels.leadTime);
          setText("value-material", copy.values.material);
          setText("value-finish", copy.values.finish);
          setText("value-moq", copy.values.moq);
          setText("value-leadTime", copy.values.leadTime);

          setText("overview-eyebrow", copy.sections.overviewEyebrow);
          setText("overview-title", copy.sections.overviewTitle);
          setText("overview-text", copy.sections.overviewText);
          setText("spec-label-material", copy.labels.material);
          setText("spec-label-usage", copy.labels.usage);
          setText("spec-label-finish", copy.labels.finish);
          setText("spec-label-moq", copy.labels.moq);
          setText("spec-label-leadTime", copy.labels.leadTime);
          setText("spec-value-material", copy.values.material);
          setText("spec-value-usage", copy.values.usage);
          setText("spec-value-finish", copy.values.finish);
          setText("spec-value-moq", copy.values.moq);
          setText("spec-value-leadTime", copy.values.leadTime);

          setText("applications-eyebrow", copy.sections.applicationsEyebrow);
          setText("applications-title", copy.sections.applicationsTitle);
          setText("applications-text", copy.sections.applicationsText);
          setHtml("product-usage-grid", renderUsage(copy.usageItems || []));

          setText("custom-eyebrow", copy.sections.customEyebrow);
          setText("custom-title", copy.sections.customTitle);
          setText("custom-text", copy.sections.customText);
          setHtml("product-option-list", renderOptions(copy.optionItems || []));

          setText("faq-eyebrow", copy.sections.faqEyebrow);
          setText("faq-title", copy.sections.faqTitle);
          setText("faq-text", copy.sections.faqText);
          setHtml("product-faq-list", renderFaqs(copy.faqItems || []));

          document.querySelectorAll(".nav-links a")[0].textContent = copy.navProducts;
          document.querySelectorAll(".nav-links a")[1].textContent = copy.navBlog;
          document.querySelectorAll(".nav-links a")[2].textContent = copy.navOem;
          document.querySelectorAll(".nav-links a")[3].textContent = copy.navContact;
          document.querySelectorAll(".footer-links a")[0].textContent = copy.navProducts;
          document.querySelectorAll(".footer-links a")[1].textContent = copy.navBlog;
          document.querySelectorAll(".footer-links a")[2].textContent = copy.navOem;
          document.querySelectorAll(".footer-links a")[3].textContent = copy.navContact;

          const footerCopy = document.querySelector(".site-footer p");
          if (footerCopy) {
            footerCopy.textContent = copy.footerText;
          }

          localStorage.setItem("siteLanguage", language);
        }

        gallery.querySelectorAll("[data-gallery-image]").forEach((button) => {
          button.addEventListener("click", () => {
            image.src = button.dataset.galleryImage;
            image.alt = button.querySelector("img")?.alt || ${JSON.stringify(product.name)};

            gallery.querySelectorAll("[data-gallery-image]").forEach((item) => {
              item.classList.toggle("is-active", item === button);
            });
          });
        });

        const initialLanguage = localStorage.getItem("siteLanguage") === "zh" ? "zh" : "en";
        applyLanguage(initialLanguage);

        languageToggle?.addEventListener("click", () => {
          const nextLanguage = localStorage.getItem("siteLanguage") === "zh" ? "en" : "zh";
          applyLanguage(nextLanguage);
        });
      });
    </script>
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
    schema,
    headerControls: `<button class="language-toggle" type="button" data-language-toggle aria-label="Switch language"><span data-language-label>中文</span></button>`
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

async function writeFallbackDataFile(filename, variableName, payload) {
  await fs.mkdir(siteDataDir, { recursive: true });
  const fileContent = `const ${variableName} = ${JSON.stringify(payload, null, 2)};\nwindow.${variableName} = ${variableName};\n`;
  await fs.writeFile(path.join(siteDataDir, filename), fileContent, "utf8");
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

  await Promise.all([
    writeFallbackDataFile("products.js", "PRODUCTS", publishedProducts),
    writeFallbackDataFile("posts.js", "POSTS", publishedPosts)
  ]);

  await buildSitemap(publishedProducts, publishedPosts);

  console.log(
    `Generated ${publishedProducts.length} product pages, ${publishedPosts.length} blog pages, sitemap.xml, and fallback data files`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
