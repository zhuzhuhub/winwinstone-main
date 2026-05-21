const fs = require("node:fs/promises");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const siteDir = path.join(rootDir, "site");
const dataDir = path.join(rootDir, "content-api", "data");
const productsFile = path.join(dataDir, "products.json");
const postsFile = path.join(dataDir, "posts.json");
const siteDataDir = path.join(siteDir, "assets", "data");
const siteUrl = (process.env.SITE_URL || "https://winwinstonecustom.com").replace(/\/+$/, "");
const whatsappHref = "https://wa.me/8613927192948";
const quoteEmail = "stone2lisa@outlook.com";
const catalogPath = "assets/downloads/win-win-stone-custom-stone-catalog-web.pdf";

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

function normalizeOutput(value) {
  return String(value || "").replace(/[ \t]+$/gm, "");
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

const BLOG_CATEGORY_DEFINITIONS = [
  {
    key: "guide",
    slug: "stone-guide",
    name: "Stone Guide",
    shortName: "Guides",
    description:
      "Material comparisons, finish advice, and practical stone selection notes for sinks, tables, and custom projects.",
    heroTitle: "Stone Material Guides for Custom Natural Stone Projects",
    heroDescription:
      "Compare marble, travertine, quartzite, onyx, and other natural stone options before confirming a sink, table, vanity, or project piece.",
    ctaLabel: "Ask Which Stone Fits Your Project"
  },
  {
    key: "ideas",
    slug: "product-ideas",
    name: "Product Ideas",
    shortName: "Ideas",
    description:
      "Design directions, product styling references, and room-based inspiration for stone sinks, tables, and statement interiors.",
    heroTitle: "Stone Product Ideas for Bathrooms, Tables, and Interior Projects",
    heroDescription:
      "Use product idea articles to shortlist the right sink, dining table, bathtub, or statement stone piece for your target project or collection.",
    ctaLabel: "Send Your Reference Style"
  },
  {
    key: "process",
    slug: "factory-process",
    name: "Factory Process",
    shortName: "Process",
    description:
      "Production workflows, quote preparation, inspection notes, and export packing guidance for OEM/ODM and custom orders.",
    heroTitle: "Custom Stone Production and OEM/ODM Process Guides",
    heroDescription:
      "See how custom stone products move from drawing review and material confirmation to fabrication, inspection, packing, and delivery.",
    ctaLabel: "Send Drawing for Factory Review"
  },
  {
    key: "care",
    slug: "care-maintenance",
    name: "Care & Maintenance",
    shortName: "Care",
    description:
      "Daily cleaning, sealing, maintenance tips, and common mistakes to avoid when using natural stone products.",
    heroTitle: "Natural Stone Care and Maintenance Guides",
    heroDescription:
      "Learn how to clean, seal, and protect marble, travertine, and other natural stone products after installation.",
    ctaLabel: "Ask About Stone Maintenance"
  }
];

const BLOG_INTENT_PRODUCTS = [
  "green-marble-pedestal-sink",
  "custom-marble-vessel-sink",
  "minimalist-travertine-dining-table",
  "natural-marble-bathtub"
];

const PRODUCT_CATEGORY_DEFINITIONS = [
  {
    slug: "stone-sinks",
    aliases: ["marble-sinks"],
    name: "Stone Sinks",
    shortName: "Sinks",
    eyebrow: "Product Category",
    title: "Custom Stone Sinks for bathrooms, villas, hotels, and design collections.",
    description:
      "Browse natural stone sink directions that can be adjusted by size, shape, stone selection, drain position, faucet detail, finish, and export packing.",
    seoTitle: "Custom Stone Sinks | Pedestal and Vessel Stone Sink Manufacturer",
    seoDescription:
      "Browse custom stone sinks including pedestal sinks and vessel sinks for bathrooms, hotels, villas, and OEM/ODM stone product collections.",
    keywords: "custom stone sinks, marble sink manufacturer, pedestal stone sinks, vessel stone sinks",
    image: "assets/images/green-luxury-marble-pedestal-sink.jpg",
    childSlugs: ["pedestal-sinks", "vessel-sinks"],
    options: [
      "Custom sink size, basin depth, and overall proportion",
      "Stone color, veining direction, and slab confirmation before cutting",
      "Drain position, faucet hole, wall clearance, and installation detail",
      "Polished, honed, brushed, fluted, or sealed surface direction",
      "Protective export packing with foam support and reinforced wooden crates"
    ],
    faqs: [
      {
        question: "Can stone sink dimensions be customized?",
        answer:
          "Yes. We can make stone sinks based on your drawing, reference photo, bathroom layout, or target dimensions."
      },
      {
        question: "Can I choose the stone block or slab before production?",
        answer:
          "For custom orders, we can share stone photos or videos before cutting so you can confirm tone and veining direction."
      },
      {
        question: "Are stone sinks suitable for overseas shipping?",
        answer:
          "Yes. We prepare protective inner packing and reinforced export wooden crates for international delivery."
      }
    ]
  },
  {
    slug: "pedestal-sinks",
    parentSlug: "stone-sinks",
    name: "Pedestal Sinks",
    shortName: "Pedestal",
    eyebrow: "Stone Sink Type",
    title: "Custom Stone Pedestal Sinks in sculptural and fluted designs.",
    description:
      "Explore pedestal sink references for luxury bathrooms, boutique hotels, villas, and designer-led interiors. Each design can be adapted before production.",
    seoTitle: "Custom Stone Pedestal Sinks | Marble Pedestal Sink Factory",
    seoDescription:
      "Custom stone pedestal sinks with bespoke size, stone color, basin depth, fluted detail, drain position, finish, and export packing.",
    keywords: "custom stone pedestal sinks, marble pedestal sink manufacturer, stone pedestal sink factory",
    image: "assets/images/fluted-rectangular-white-marble-pedestal-sink.jpg",
    siblingSlugs: ["vessel-sinks"],
    options: [
      "Rectangular, cylindrical, fluted, ribbed, block, or drawing-based pedestal forms",
      "Custom height, width, basin depth, and drain position",
      "White marble, green marble, black marble, Calacatta, or similar selected stone",
      "Single-piece look, assembled construction, or project-specific structure",
      "Export packing prepared for heavy stone sink shipment"
    ],
    faqs: [
      {
        question: "Can the pedestal sink shape be changed?",
        answer:
          "Yes. The overall shape, ribbing, basin depth, and edge detail can be adjusted based on drawings or reference photos."
      },
      {
        question: "Can pedestal sinks be made for hotel projects?",
        answer:
          "Yes. We can support single custom pieces, project quantities, and repeatable OEM/ODM production."
      },
      {
        question: "What information helps you quote faster?",
        answer:
          "Please send target size, quantity, stone preference, finish, drain detail, and any reference image or drawing."
      }
    ]
  },
  {
    slug: "vessel-sinks",
    parentSlug: "stone-sinks",
    name: "Vessel Sinks",
    shortName: "Vessel",
    eyebrow: "Stone Sink Type",
    title: "Custom Stone Vessel Sinks for counters, vanities, and boutique bathrooms.",
    description:
      "Use vessel sink references as a starting point for round, oval, rectangular, sculptural, or drawing-based stone basin production.",
    seoTitle: "Custom Stone Vessel Sinks | Marble Vessel Sink Manufacturer",
    seoDescription:
      "Custom stone vessel sinks for bathroom counters and vanities with bespoke size, shape, material, finish, drain detail, and export packing.",
    keywords: "custom stone vessel sinks, marble vessel sink manufacturer, stone basin factory",
    image: "assets/images/vessel-sink.jpg",
    siblingSlugs: ["pedestal-sinks"],
    options: [
      "Round, oval, rectangular, irregular, or drawing-based vessel sink shapes",
      "Custom rim thickness, basin depth, drain position, and countertop coordination",
      "Natural marble, travertine, onyx, limestone, or selected project stone",
      "Polished, honed, matte, brushed, or sealed finishes",
      "Sample, project, or repeatable collection production"
    ],
    faqs: [
      {
        question: "Can vessel sinks be made from different natural stones?",
        answer:
          "Yes. Marble is common, and we can also discuss travertine, onyx, limestone, or similar available stones."
      },
      {
        question: "Can I customize the drain and countertop fit?",
        answer:
          "Yes. Drain position, basin depth, rim detail, and countertop coordination can be confirmed before production."
      },
      {
        question: "Is one piece accepted for a sample order?",
        answer:
          "Yes. One piece can usually be produced for a sample, custom piece, or project reference."
      }
    ]
  },
  {
    slug: "stone-tables",
    name: "Stone Tables",
    shortName: "Tables",
    eyebrow: "Product Category",
    title: "Custom Stone Tables for dining rooms, living rooms, entrances, and interiors.",
    description:
      "Browse dining tables, coffee tables, and console tables with custom size, stone tone, base structure, edge profile, finish, and packing.",
    seoTitle: "Custom Stone Tables | Marble and Travertine Table Manufacturer",
    seoDescription:
      "Custom stone tables including dining tables, coffee tables, and console tables for homes, villas, showrooms, hotels, and designer interiors.",
    keywords: "custom stone tables, marble table manufacturer, travertine dining table factory, stone coffee table, stone console table",
    image: "assets/images/minimalist-table.jpg",
    childSlugs: ["dining-tables", "coffee-tables", "console-tables"],
    options: [
      "Custom tabletop length, width, thickness, height, and overall proportion",
      "Marble, travertine, limestone, quartzite, onyx, or similar selected stone",
      "Straight, eased, bevelled, rounded, bullnose, or drawing-based edge detail",
      "Pedestal base, block base, slab base, metal support, or custom base structure",
      "Export packing for heavy furniture with reinforced wooden crates"
    ],
    faqs: [
      {
        question: "Can stone table sizes be customized?",
        answer:
          "Yes. Length, width, height, thickness, edge profile, and base proportion can be customized according to your requirement."
      },
      {
        question: "Can the slab pattern be confirmed before cutting?",
        answer:
          "Yes. We can share slab or block photos and videos before production for custom orders."
      },
      {
        question: "Can you make tables for brands or project buyers?",
        answer:
          "Yes. We support samples, project orders, and repeatable OEM/ODM stone table production."
      }
    ]
  },
  {
    slug: "dining-tables",
    parentSlug: "stone-tables",
    name: "Dining Tables",
    shortName: "Dining",
    eyebrow: "Stone Table Type",
    title: "Custom Stone Dining Tables in marble, travertine, and natural stone.",
    description:
      "Explore dining table references for residences, hospitality spaces, showrooms, and interior brands. Each table can be refined by size and structure.",
    seoTitle: "Custom Stone Dining Tables | Travertine and Marble Dining Table Factory",
    seoDescription:
      "Custom stone dining tables in travertine, marble, limestone, and selected natural stone with bespoke size, base structure, finish, and export packing.",
    keywords: "custom stone dining tables, travertine dining table manufacturer, marble dining table factory",
    image: "assets/images/travertine-marble-dining-table-designed-for-modern-interiors.jpg",
    siblingSlugs: ["coffee-tables", "console-tables"],
    options: [
      "Round, oval, rectangular, square, or drawing-based tabletop shapes",
      "Custom tabletop size, thickness, base height, and seating proportion",
      "Travertine, marble, limestone, quartzite, onyx, or selected stone options",
      "Filled, unfilled, honed, polished, brushed, or sealed finish direction",
      "Export packing suitable for heavy tabletop and base components"
    ],
    faqs: [
      {
        question: "Can dining table bases be customized?",
        answer:
          "Yes. We can discuss block bases, pedestal bases, slab bases, or drawing-based structures before production."
      },
      {
        question: "Can travertine tables be filled or unfilled?",
        answer:
          "Yes. Filled, unfilled, honed, polished, and sealed finish directions can be confirmed before production."
      },
      {
        question: "Can large stone tables be shipped internationally?",
        answer:
          "Yes. We prepare protective packing and reinforced crates according to table size, weight, and shipping method."
      }
    ]
  },
  {
    slug: "coffee-tables",
    parentSlug: "stone-tables",
    name: "Coffee Tables",
    shortName: "Coffee",
    eyebrow: "Stone Table Type",
    title: "Custom Stone Coffee Tables for living rooms, villas, hotels, and showrooms.",
    description:
      "Use coffee table references for box forms, block bases, plinth shapes, and drawing-based natural stone furniture pieces.",
    seoTitle: "Custom Stone Coffee Tables | Marble Coffee Table Manufacturer",
    seoDescription:
      "Custom stone coffee tables in marble, travertine, limestone, and luxury stone with bespoke size, finish, base form, and export packing.",
    keywords: "custom stone coffee table, marble coffee table manufacturer, calacatta stone coffee table, stone box coffee table",
    image: "assets/images/products/stone-tables/winwinstone-calacatta-stone-box-coffee-table.webp",
    siblingSlugs: ["dining-tables", "console-tables"],
    options: [
      "Custom length, width, height, thickness, and overall coffee table proportion",
      "Box table, block table, plinth table, low table, or drawing-based form",
      "Calacatta, travertine, limestone, green marble, black marble, or selected stone",
      "Polished, honed, leathered, brushed, or sealed surface finish",
      "Protective export packing for heavy stone furniture components"
    ],
    faqs: [
      {
        question: "Can coffee table shapes be customized?",
        answer:
          "Yes. Box forms, low tables, block bases, rounded forms, and drawing-based stone coffee tables can be discussed before production."
      },
      {
        question: "Can I choose the stone slab before production?",
        answer:
          "Yes. We can share slab or block photos and videos so you can confirm color tone, veining direction, and surface direction."
      },
      {
        question: "Can stone coffee tables be exported safely?",
        answer:
          "Yes. We use foam support, corner protection, and reinforced wooden crates for heavy stone furniture shipments."
      }
    ]
  },
  {
    slug: "console-tables",
    parentSlug: "stone-tables",
    name: "Console Tables",
    shortName: "Console",
    eyebrow: "Stone Table Type",
    title: "Custom Stone Console Tables for entrances, villas, and showrooms.",
    description:
      "Use console table references for entrance halls, designer interiors, retail displays, and hospitality spaces where stone tone and proportion matter.",
    seoTitle: "Custom Stone Console Tables | Marble Entrance Hall Table Manufacturer",
    seoDescription:
      "Custom marble and natural stone console tables for entrance halls, villas, showrooms, and interior projects with bespoke size and finish.",
    keywords: "custom stone console table, marble console table manufacturer, entrance hall table factory",
    image: "assets/images/luxury-green-marble-entrance-hall-table.jpg",
    siblingSlugs: ["dining-tables", "coffee-tables"],
    options: [
      "Custom tabletop length, width, height, thickness, and edge detail",
      "Green marble, black marble, Calacatta, travertine, or selected natural stone",
      "Block base, pedestal base, slab support, or drawing-based structure",
      "Polished, honed, leathered, brushed, or sealed surface direction",
      "Export-ready packing for heavy stone furniture components"
    ],
    faqs: [
      {
        question: "Can console tables be made from green or black marble?",
        answer:
          "Yes. Green marble, black marble, Calacatta, travertine, and similar available stones can be discussed for custom orders."
      },
      {
        question: "Can the table match an interior design reference?",
        answer:
          "Yes. Send the reference image, drawing, target size, and preferred stone tone so we can review the production direction."
      },
      {
        question: "Can console tables be packed for export?",
        answer:
          "Yes. We use protective support and reinforced wooden crates for international heavy stone furniture delivery."
      }
    ]
  },
  {
    slug: "stone-furniture",
    name: "Stone Furniture",
    shortName: "Furniture",
    eyebrow: "Product Category",
    title: "Custom Stone Furniture for irregular home, hotel, and interior projects.",
    description:
      "Group custom stone benches, plinths, shelves, cabinets, display stands, side tables, and designer furniture that does not fit a standard table type.",
    seoTitle: "Custom Stone Furniture | Marble Furniture and Interior Stone Manufacturer",
    seoDescription:
      "Custom stone furniture including marble plinths, benches, side tables, display stands, cabinets, shelves, and irregular designer stone furniture.",
    keywords: "custom stone furniture, marble furniture manufacturer, stone plinth, marble display stand, designer stone furniture",
    image: "assets/images/stone-vanity.jpg",
    options: [
      "Drawing-based stone furniture size, structure, and proportion",
      "Marble, travertine, limestone, quartzite, onyx, or selected project stone",
      "Cabinet, bench, plinth, shelf, side table, or display stand direction",
      "Polished, honed, brushed, leathered, or sealed finish",
      "Project packing plan for irregular or heavy stone furniture"
    ],
    faqs: [
      {
        question: "What products belong in custom stone furniture?",
        answer:
          "Benches, plinths, display stands, shelves, cabinets, side tables, and irregular designer furniture can be grouped here."
      },
      {
        question: "Can you review an unusual furniture drawing?",
        answer:
          "Yes. Send the drawing, target size, reference image, stone preference, and quantity so we can review fabrication feasibility."
      },
      {
        question: "Can stone furniture be made for hotels or villas?",
        answer:
          "Yes. We support one-off custom pieces, project quantities, and repeatable OEM/ODM stone furniture production."
      }
    ]
  },
  {
    slug: "stone-bathtubs",
    name: "Stone Bathtubs",
    shortName: "Bathtubs",
    eyebrow: "Product Category",
    title: "Custom Stone Bathtubs for villas, hotels, spas, and luxury bathrooms.",
    description:
      "Browse natural stone bathtub directions with custom size, inner basin shape, drain detail, stone selection, finish, and export packing.",
    seoTitle: "Custom Stone Bathtubs | Marble Bathtub Manufacturer",
    seoDescription:
      "Custom stone bathtubs for villas, hotels, spas, and luxury bathrooms with bespoke size, stone material, finish, drain detail, and packing.",
    keywords: "custom stone bathtub, marble bathtub manufacturer, luxury stone bathtub, natural stone tub",
    image: "assets/images/marble-bathtub.jpg",
    options: [
      "Custom bathtub length, width, height, wall thickness, and inner basin shape",
      "Marble, travertine, limestone, or selected natural stone",
      "Drain position, overflow detail, edge profile, and installation coordination",
      "Polished, honed, matte, or sealed surface direction",
      "Reinforced export packing and loading plan for heavy stone bathtubs"
    ],
    faqs: [
      {
        question: "Can stone bathtub dimensions be customized?",
        answer:
          "Yes. We can produce stone bathtubs according to drawings, reference photos, target dimensions, or bathroom layouts."
      },
      {
        question: "Are natural stone bathtubs heavy?",
        answer:
          "Yes. Stone bathtubs are heavy, so structure review, packing method, and delivery planning are important before production."
      },
      {
        question: "Can I confirm the material before cutting?",
        answer:
          "Yes. We can share stone photos or videos before production so you can confirm the material direction."
      }
    ]
  },
  {
    slug: "stone-fireplaces",
    name: "Stone Fireplaces",
    shortName: "Fireplaces",
    eyebrow: "Product Category",
    title: "Custom Stone Fireplaces for living rooms, villas, hotels, and interiors.",
    description:
      "Browse marble and natural stone fireplace surrounds with custom size, mantel proportion, side panels, profile detail, finish, and packing.",
    seoTitle: "Custom Stone Fireplaces | Marble Fireplace Surround Manufacturer",
    seoDescription:
      "Custom stone fireplaces and marble fireplace surrounds for villas, hotels, living rooms, and interior projects with bespoke size and profile.",
    keywords: "custom stone fireplace, marble fireplace surround manufacturer, natural stone fireplace, custom fireplace surround",
    image: "assets/images/modern-calacatta-white-marble-fireplace-surround.jpg",
    options: [
      "Custom fireplace surround width, height, depth, mantel, and side panels",
      "Calacatta white marble, pink marble, travertine, limestone, or selected stone",
      "Classic, modern, carved, straight-line, or drawing-based profile detail",
      "Polished, honed, brushed, or sealed surface direction",
      "Separated protective packing for heavy fireplace surround pieces"
    ],
    faqs: [
      {
        question: "Can fireplace surround size be customized?",
        answer:
          "Yes. We can produce surrounds according to wall openings, drawings, reference photos, or project measurements."
      },
      {
        question: "Can I choose another stone material?",
        answer:
          "Yes. Calacatta white marble, pink marble, travertine, limestone, and other natural stones can be discussed."
      },
      {
        question: "How are stone fireplace pieces packed?",
        answer:
          "We separate and protect stone pieces with foam, corner protection, and reinforced wooden crates for international shipping."
      }
    ]
  }
];

function formatIsoDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function formatDisplayDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function estimateReadingTime(value) {
  const wordCount = stripTags(value).split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(wordCount / 180));
}

function getPostCategoryKey(post) {
  const category = String(post.category || "").toLowerCase();
  if (category.includes("guide")) return "guide";
  if (category.includes("idea")) return "ideas";
  if (category.includes("process")) return "process";
  if (category.includes("care")) return "care";
  return "guide";
}

function getBlogCategoryDefinitionByKey(key) {
  return BLOG_CATEGORY_DEFINITIONS.find((entry) => entry.key === key) || BLOG_CATEGORY_DEFINITIONS[0];
}

function getBlogCategoryDefinitionBySlug(slug) {
  return BLOG_CATEGORY_DEFINITIONS.find((entry) => entry.slug === slug) || BLOG_CATEGORY_DEFINITIONS[0];
}

function getBlogCategoryPath(category) {
  return toUrlPath("blog", "category", category.slug);
}

function getLocalizedBlogCategory(category, locale = "en") {
  if (locale !== "zh") return category;

  const zhNames = {
    guide: {
      name: "石材指南",
      shortName: "指南"
    },
    ideas: {
      name: "产品灵感",
      shortName: "灵感"
    },
    process: {
      name: "工厂流程",
      shortName: "流程"
    },
    care: {
      name: "护理维护",
      shortName: "维护"
    }
  };

  return {
    ...category,
    ...(zhNames[category.key] || zhNames.guide)
  };
}

function getRelativeUrl(rootPrefix, relativePath) {
  return `${rootPrefix}${String(relativePath || "").replace(/^\/+/, "")}`;
}

function getLocalizedPost(post, locale = "en") {
  const isZh = locale === "zh";
  const title = isZh ? post.titleZh || post.title : post.title;
  const body = isZh ? post.bodyZh || post.body : post.body;
  const excerpt = isZh ? post.excerptZh || post.excerpt : post.excerpt;
  const seo = isZh ? post.seoZh || post.seo || {} : post.seo || {};
  const faqs = isZh && Array.isArray(post.faqsZh) && post.faqsZh.length ? post.faqsZh : post.faqs || [];

  return {
    title,
    category: isZh ? post.categoryZh || post.category : post.category,
    tags: isZh && Array.isArray(post.tagsZh) && post.tagsZh.length ? post.tagsZh : post.tags || [],
    coverAlt: isZh ? post.coverAltZh || post.coverAlt || title : post.coverAlt || title,
    excerpt,
    body,
    faqs,
    seo: {
      title: seo.title || title,
      description: seo.description || excerpt || stripTags(body || "").slice(0, 180).trim(),
      keywords: seo.keywords || ""
    }
  };
}

function getPostExcerpt(post, locale = "en") {
  const localized = getLocalizedPost(post, locale);
  return localized.excerpt || stripTags(localized.body || "").slice(0, 180).trim();
}

function getPostImageUrl(rootPrefix, post) {
  return getRelativeUrl(rootPrefix, post.coverImage || "assets/images/minimalist-table.jpg");
}

function getProductImageUrl(rootPrefix, product) {
  return getRelativeUrl(rootPrefix, product.image || "assets/images/minimalist-table.jpg");
}

function getPostPath(post, locale = "en") {
  return locale === "zh" ? toUrlPath("zh", "blog", post.slug) : toUrlPath("blog", post.slug);
}

function getPostCanonicalUrl(post, locale = "en") {
  return `${siteUrl}${getPostPath(post, locale)}`;
}

function getProductCanonicalUrl(product) {
  return `${siteUrl}${toUrlPath("products", product.slug)}`;
}

function getPostPageHref(rootPrefix, post, { locale = "en" } = {}) {
  const path = locale === "zh" ? `zh/blog/${encodeURIComponent(post.slug)}/` : `blog/${encodeURIComponent(post.slug)}/`;
  return getRelativeUrl(rootPrefix, path);
}

function getProductPageHref(rootPrefix, product) {
  return getRelativeUrl(rootPrefix, `products/${encodeURIComponent(product.slug)}/`);
}

function getProductCategoryDefinition(slug) {
  return PRODUCT_CATEGORY_DEFINITIONS.find((entry) => entry.slug === slug) || null;
}

function getProductCategoryPath(category) {
  if (!category) return "/products.html";
  if (category.parentSlug) return toUrlPath("products", category.parentSlug, category.slug);
  return toUrlPath("products", category.slug);
}

function getProductCategoryHref(rootPrefix, category) {
  return getRelativeUrl(rootPrefix, getProductCategoryPath(category).replace(/^\/+/, ""));
}

function getProductMainCategorySlug(product) {
  if (product.mainCategory) return product.mainCategory;

  const text = `${product.category || ""} ${product.usage || ""} ${(product.filters || []).join(" ")}`.toLowerCase();
  if (/sink|basin|pedestal|vessel/.test(text)) return "marble-sinks";
  if (/table|console|dining|furniture/.test(text)) return "stone-tables";
  return "";
}

function getProductSubCategorySlug(product) {
  if (product.subCategory) return product.subCategory;

  const text = `${product.name || ""} ${product.category || ""} ${product.usage || ""} ${(product.filters || []).join(" ")}`.toLowerCase();
  if (/vessel/.test(text)) return "vessel-sinks";
  if (/sink|basin|pedestal/.test(text)) return "pedestal-sinks";
  if (/console|entrance/.test(text)) return "console-tables";
  if (/dining|table/.test(text)) return "dining-tables";
  return "";
}

function getProductsForProductCategory(category, products) {
  return products.filter((product) => {
    if (category.parentSlug) {
      return getProductMainCategorySlug(product) === category.parentSlug && getProductSubCategorySlug(product) === category.slug;
    }

    return getProductMainCategorySlug(product) === category.slug;
  });
}

function getProductCategoryChildren(category) {
  return (category.childSlugs || []).map(getProductCategoryDefinition).filter(Boolean);
}

function getProductCategorySiblings(category) {
  return (category.siblingSlugs || []).map(getProductCategoryDefinition).filter(Boolean);
}

function getProductCategoryCrumbs(product) {
  const mainCategory = getProductCategoryDefinition(getProductMainCategorySlug(product));
  const subCategory = getProductCategoryDefinition(getProductSubCategorySlug(product));
  return [mainCategory, subCategory].filter(Boolean);
}

function getPostRelatedPosts(post, posts) {
  const explicit = posts.filter((entry) => (post.relatedPosts || []).includes(entry.slug));
  if (explicit.length) return explicit.slice(0, 3);

  const sameCategory = posts
    .filter((entry) => entry.slug !== post.slug && getPostCategoryKey(entry) === getPostCategoryKey(post))
    .slice(0, 3);

  if (sameCategory.length) return sameCategory;

  return posts.filter((entry) => entry.slug !== post.slug).slice(0, 3);
}

function getPostRelatedProducts(post, products) {
  const explicit = products.filter((product) => (post.relatedProducts || []).includes(product.slug));
  if (explicit.length) return explicit.slice(0, 3);

  return products
    .filter((product) => {
      const category = getPostCategoryKey(post);
      const productCategory = String(product.category || "").toLowerCase();
      if (category === "guide") return productCategory.includes("sink") || productCategory.includes("bath");
      if (category === "ideas") return productCategory.includes("table") || productCategory.includes("sink");
      if (category === "process") return true;
      if (category === "care") return productCategory.includes("bath") || productCategory.includes("table");
      return false;
    })
    .slice(0, 3);
}

function getCategoryProducts(category, products) {
  const recommendedBySlug = {
    guide: ["green-marble-pedestal-sink", "custom-marble-vessel-sink", "calacatta-marble-pedestal-sink"],
    ideas: ["minimalist-travertine-dining-table", "red-travertine-dining-table", "green-marble-pedestal-sink"],
    process: ["custom-marble-vessel-sink", "minimalist-travertine-dining-table", "natural-marble-bathtub"],
    care: ["natural-marble-bathtub", "green-marble-pedestal-sink", "minimalist-travertine-dining-table"]
  };

  const preferred = recommendedBySlug[category.key] || [];
  const matched = preferred
    .map((slug) => products.find((product) => product.slug === slug))
    .filter(Boolean);

  if (matched.length >= 3) return matched.slice(0, 3);

  return [
    ...matched,
    ...products.filter((product) => !matched.some((entry) => entry.slug === product.slug))
  ].slice(0, 3);
}

function renderBreadcrumbs(items, rootPrefix = "") {
  const links = items
    .map((item, index) => {
      const isLast = index === items.length - 1;
      if (isLast) {
        return `<span aria-current="page">${escapeHtml(item.label)}</span>`;
      }
      return `<a href="${escapeHtml(getRelativeUrl(rootPrefix, item.href))}">${escapeHtml(item.label)}</a>`;
    })
    .join("");

  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${links}</nav>`;
}

function renderBlogArticleCard(post, { rootPrefix = "", locale = "en" } = {}) {
  const category = getLocalizedBlogCategory(getBlogCategoryDefinitionByKey(getPostCategoryKey(post)), locale);
  const localizedPost = getLocalizedPost(post, locale);
  const excerpt = getPostExcerpt(post, locale);
  const readingTime = estimateReadingTime(localizedPost.body);

  return `
          <article class="article-card" data-blog-category="${escapeHtml(category.key)}">
            <a href="${escapeHtml(getPostPageHref(rootPrefix, post, { locale }))}">
              <img src="${escapeHtml(getPostImageUrl(rootPrefix, post))}" alt="${escapeHtml(localizedPost.coverAlt)}" loading="lazy">
              <span class="article-body">
                <span class="product-type">${escapeHtml(localizedPost.category || category.name)}</span>
                <strong>${escapeHtml(localizedPost.title)}</strong>
                <span>${escapeHtml(excerpt)}</span>
                <span class="article-meta-line">
                  <span class="article-date">${escapeHtml(formatDisplayDate(post.publishedAt || post.updatedAt))}</span>
                  <span>${readingTime} min read</span>
                </span>
              </span>
            </a>
          </article>`;
}

function renderProductLinkCard(product, { rootPrefix = "" } = {}) {
  return `
            <article class="link-card">
              <a class="link-card-link" href="${escapeHtml(getProductPageHref(rootPrefix, product))}" aria-label="View ${escapeHtml(product.name)} product details">
                <img src="${escapeHtml(getProductImageUrl(rootPrefix, product))}" alt="${escapeHtml(product.name)}" loading="lazy">
                <span class="link-card-body">
                  <span class="product-type">${escapeHtml(product.category || "Product")}</span>
                  <strong>${escapeHtml(product.name)}</strong>
                  <span>${escapeHtml(product.summary || product.desc || "")}</span>
                </span>
              </a>
            </article>`;
}

function renderProductCategoryCard(category, products, { rootPrefix = "" } = {}) {
  const categoryProducts = getProductsForProductCategory(category, products);
  const childCount = getProductCategoryChildren(category).length;
  const countText = childCount
    ? `${childCount} product type${childCount === 1 ? "" : "s"}`
    : `${categoryProducts.length} product${categoryProducts.length === 1 ? "" : "s"}`;

  return `
            <article class="link-card">
              <a class="link-card-link" href="${escapeHtml(getProductCategoryHref(rootPrefix, category))}" aria-label="View ${escapeHtml(category.name)}">
                <img src="${escapeHtml(getRelativeUrl(rootPrefix, category.image || "assets/images/minimalist-table.jpg"))}" alt="${escapeHtml(category.name)} product category" loading="lazy">
                <span class="link-card-body">
                  <span class="product-type">${escapeHtml(countText)}</span>
                  <strong>${escapeHtml(category.name)}</strong>
                  <span>${escapeHtml(category.description)}</span>
                </span>
              </a>
            </article>`;
}

function renderProductCategoryOptions(category) {
  return (category.options || [])
    .map(
      (option) => `
            <div>
              <span>Custom</span>
              <strong>${escapeHtml(option)}</strong>
            </div>`
    )
    .join("");
}

function renderProductCategoryFaqs(category) {
  return (category.faqs || [])
    .map(
      (faq) => `
            <article>
              <h3>${escapeHtml(faq.question)}</h3>
              <p>${escapeHtml(faq.answer)}</p>
            </article>`
    )
    .join("");
}

function renderProductsLandingPage(products) {
  const mainCategories = PRODUCT_CATEGORY_DEFINITIONS.filter((category) => !category.parentSlug);
  const featuredProducts = products.filter((product) => product.featured).slice(0, 8);
  const otherProducts = products.filter((product) => !getProductMainCategorySlug(product)).slice(0, 4);
  const body = `
    <main id="main">
      <section class="page-hero product-hero" aria-labelledby="products-hero-title">
        <picture class="page-hero-media">
          <source srcset="assets/images/minimalist-table.jpg" media="(min-width: 760px)">
          <img src="assets/images/stone-vanity.jpg" alt="Custom natural stone product references">
        </picture>
        <div class="page-hero-overlay"></div>
        <div class="page-hero-content">
          <p class="eyebrow">Products</p>
          <h1 id="products-hero-title">Browse custom stone products by category and product type.</h1>
          <p>Start from Marble Sinks or Stone Tables, then move into the product type that best matches your drawing, reference image, or sourcing plan.</p>
          <div class="hero-actions">
            <a class="button primary" href="#categories">Browse Categories</a>
            <a class="button ghost" href="contact.html">Request Factory Quote</a>
          </div>
          <div class="page-hero-notes" aria-label="Catalog highlights">
            <span>Factory-direct from Yunfu, China</span>
            <span>Custom sizes, finishes, and export packing</span>
            <span>Product pages stay stable as categories expand</span>
          </div>
        </div>
      </section>

      <section class="section-pad" id="categories" aria-labelledby="product-categories-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Product Categories</p>
            <h2 id="product-categories-title">First-phase catalog structure for current product strengths.</h2>
            <p>These category pages group existing product details into clearer sourcing paths for buyers and search engines.</p>
          </div>
          <div class="link-grid">${mainCategories.map((category) => renderProductCategoryCard(category, products)).join("")}</div>
        </div>
      </section>

      <section class="catalog-intro section-pad" aria-label="Product type paths">
        <div class="container catalog-intro-grid">
          <div>
            <p class="eyebrow">Browse by Type</p>
            <h2>Move from broad category to exact product type before choosing a product.</h2>
          </div>
          <div class="product-direction-list">
            ${mainCategories
              .map((category, index) => {
                const children = getProductCategoryChildren(category);
                return `
            <article>
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${escapeHtml(category.name)}</strong>
              <p>${children.map((child) => child.name).join(" / ")}</p>
            </article>`;
              })
              .join("")}
          </div>
        </div>
      </section>

      <section class="section-pad" aria-labelledby="featured-products-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Featured Products</p>
            <h2 id="featured-products-title">Current product detail pages connected to the new category structure.</h2>
          </div>
          <div class="link-grid">${featuredProducts.map((product) => renderProductLinkCard(product)).join("")}</div>
        </div>
      </section>

      ${otherProducts.length ? `
      <section class="section-pad" aria-labelledby="other-products-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Other Product Directions</p>
            <h2 id="other-products-title">Kept in the catalog while future categories are prepared.</h2>
          </div>
          <div class="link-grid">${otherProducts.map((product) => renderProductLinkCard(product)).join("")}</div>
        </div>
      </section>
      ` : ""}

      <section class="cta-band" aria-labelledby="products-cta-title">
        <div class="container cta-band-inner">
          <div>
            <p class="eyebrow">Start Inquiry</p>
            <h2 id="products-cta-title">Send the closest product reference, target size, or drawing for review.</h2>
          </div>
          <a class="button primary" href="contact.html">Request Factory Quote</a>
        </div>
      </section>
    </main>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Products",
        description: "Custom natural stone product catalog with marble sinks and stone tables.",
        url: `${siteUrl}/products.html`
      },
      {
        "@type": "ItemList",
        itemListElement: mainCategories.map((category, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: category.name,
          url: `${siteUrl}${getProductCategoryPath(category)}`
        }))
      }
    ]
  };

  return renderLayout({
    title: "Custom Stone Products | Marble Sinks and Stone Tables",
    description:
      "Browse custom stone product categories including marble sinks, pedestal sinks, vessel sinks, dining tables, and console tables.",
    keywords: "custom stone products, marble sinks, stone tables, pedestal sinks, vessel sinks",
    canonicalPath: "/products.html",
    ogType: "website",
    ogImage: `${siteUrl}/assets/images/stone-vanity.jpg`,
    body,
    schema,
    activeNav: "products",
    bodyAttributes: `data-page="products"`,
    scripts: renderSharedPageScript()
  });
}

function renderProductCategoryPage(category, products) {
  const isSubCategory = Boolean(category.parentSlug);
  const parentCategory = isSubCategory ? getProductCategoryDefinition(category.parentSlug) : null;
  const childCategories = getProductCategoryChildren(category);
  const siblingCategories = getProductCategorySiblings(category);
  const categoryProducts = getProductsForProductCategory(category, products);
  const relatedProducts = categoryProducts.length ? categoryProducts : products.slice(0, 4);
  const relatedCategories = childCategories.length ? childCategories : siblingCategories;
  const rootPrefix = isSubCategory ? "../../../" : "../../";
  const categoryPath = getProductCategoryPath(category);
  const breadcrumbItems = [
    { label: "Home", href: "index.html" },
    { label: "Products", href: "products.html" }
  ];

  if (parentCategory) {
    breadcrumbItems.push({ label: parentCategory.name, href: getProductCategoryPath(parentCategory).replace(/^\/+/, "") });
  }

  breadcrumbItems.push({ label: category.name, href: categoryPath.replace(/^\/+/, "") });

  const body = `
    <main id="main">
      <section class="page-hero article-hero section-pad" aria-labelledby="category-title">
        <div class="container">
          ${renderBreadcrumbs(breadcrumbItems, rootPrefix)}
          <p class="eyebrow">${escapeHtml(category.eyebrow || "Product Category")}</p>
          <h1 id="category-title">${escapeHtml(category.title)}</h1>
          <p>${escapeHtml(category.description)}</p>
          <div class="story-meta">
            <span>${categoryProducts.length} product${categoryProducts.length === 1 ? "" : "s"}</span>
            <span>Factory-direct custom production</span>
          </div>
        </div>
      </section>

      ${relatedCategories.length ? `
      <section class="section-pad" aria-labelledby="category-types-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${isSubCategory ? "Related Type" : "Product Types"}</p>
            <h2 id="category-types-title">${isSubCategory ? "Continue browsing nearby product types." : "Choose a product type before opening detail pages."}</h2>
          </div>
          <div class="link-grid">${relatedCategories.map((entry) => renderProductCategoryCard(entry, products, { rootPrefix })).join("")}</div>
        </div>
      </section>
      ` : ""}

      <section class="section-pad" aria-labelledby="category-products-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Product References</p>
            <h2 id="category-products-title">${categoryProducts.length ? `Available ${category.name} product detail pages.` : "Related product detail pages."}</h2>
            <p>${categoryProducts.length ? "Open a product page, then send the closest reference with your size, finish, and quantity requirements." : "This category is ready for more product references as the catalog grows."}</p>
          </div>
          <div class="link-grid">${relatedProducts.map((product) => renderProductLinkCard(product, { rootPrefix })).join("")}</div>
        </div>
      </section>

      <section class="material-section section-pad" aria-labelledby="category-custom-title">
        <div class="container material-grid">
          <div>
            <p class="eyebrow">Custom Options</p>
            <h2 id="category-custom-title">What buyers usually confirm before production starts.</h2>
          </div>
          <div class="spec-list">${renderProductCategoryOptions(category)}</div>
        </div>
      </section>

      <section class="section-pad" aria-labelledby="category-faq-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Buyer Questions</p>
            <h2 id="category-faq-title">Common questions for custom ${escapeHtml(category.name.toLowerCase())}.</h2>
          </div>
          <div class="product-faq-list">${renderProductCategoryFaqs(category)}</div>
        </div>
      </section>

      <section class="cta-band" aria-labelledby="category-cta-title">
        <div class="container cta-band-inner">
          <div>
            <p class="eyebrow">Next Step</p>
            <h2 id="category-cta-title">Send your drawing, reference image, target size, or quantity for review.</h2>
          </div>
          <a class="button primary" href="${escapeHtml(getRelativeUrl(rootPrefix, "contact.html"))}">Request Factory Quote</a>
        </div>
      </section>
    </main>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: category.name,
        description: category.description,
        url: `${siteUrl}${categoryPath}`
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: `${siteUrl}/${item.href.replace(/^\/+/, "").replace(/index\.html$/, "")}`
        }))
      },
      {
        "@type": "ItemList",
        itemListElement: categoryProducts.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.name,
          url: getProductCanonicalUrl(product)
        }))
      }
    ]
  };

  return renderLayout({
    title: category.seoTitle || `${category.name} | Win-Win Stone`,
    description: category.seoDescription || category.description,
    keywords: category.keywords || "",
    canonicalPath: categoryPath,
    ogType: "website",
    ogImage: `${siteUrl}/${(category.image || "assets/images/minimalist-table.jpg").replace(/^\/+/, "")}`,
    body,
    schema,
    rootPrefix,
    activeNav: "products",
    bodyAttributes: `data-page="product-category"`,
    scripts: renderSharedPageScript()
  });
}

function renderSharedPageScript({ enableBlogFilters = false } = {}) {
  return `
    <script>
      (function () {
        const header = document.querySelector("[data-header]");
        const navToggle = document.querySelector("[data-nav-toggle]");
        const navLinks = document.querySelector("[data-nav-links]");

        function setHeaderState() {
          if (!header) return;
          header.classList.toggle("is-scrolled", window.scrollY > 20);
        }

        setHeaderState();
        window.addEventListener("scroll", setHeaderState, { passive: true });

        if (navToggle && navLinks) {
          navToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            header && header.classList.toggle("nav-open", isOpen);
          });

          navLinks.addEventListener("click", function (event) {
            if (!event.target.closest("a")) return;
            navLinks.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            header && header.classList.remove("nav-open");
          });
        }

        ${enableBlogFilters ? `
        document.querySelectorAll("[data-blog-filter]").forEach(function (button) {
          button.addEventListener("click", function () {
            const filter = button.dataset.blogFilter;
            const group = button.closest("[data-filter-group]") || document;

            group.querySelectorAll("[data-blog-filter]").forEach(function (item) {
              const active = item === button;
              item.classList.toggle("active", active);
              item.setAttribute("aria-selected", String(active));
            });

            document.querySelectorAll("[data-blog-category]").forEach(function (article) {
              const categories = String(article.dataset.blogCategory || "").split(" ");
              article.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
            });
          });
        });
        ` : ""}
      })();
    </script>`;
}

function renderLayout({
  title,
  description,
  keywords = "",
  canonicalPath,
  ogType,
  ogImage,
  body,
  schema,
  headerControls = "",
  rootPrefix = "",
  bodyAttributes = "",
  extraHead = "",
  scripts = "",
  activeNav = "",
  locale = "en"
}) {
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const homeHref = getRelativeUrl(rootPrefix, "index.html");
  const productsHref = getRelativeUrl(rootPrefix, "products.html");
  const blogHref = getRelativeUrl(rootPrefix, "blog.html");
  const serviceHref = getRelativeUrl(rootPrefix, "index.html#service");
  const contactHref = getRelativeUrl(rootPrefix, "index.html#contact");
  const labels =
    locale === "zh"
      ? {
          htmlLang: "zh-CN",
          navProducts: "产品",
          navBlog: "博客",
          navService: "OEM/ODM",
          navContact: "联系",
          skip: "跳到正文",
          footer:
            "工厂支持的天然石材制造服务，提供 OEM/ODM、定制生产和适合出口的交付方案。"
        }
      : {
          htmlLang: "en",
          navProducts: "Products",
          navBlog: "Blog",
          navService: "OEM/ODM",
          navContact: "Contact",
          skip: "Skip to content",
          footer:
            "Factory-backed natural stone manufacturing with OEM/ODM support, custom production, and export-ready delivery."
        };

  return `<!doctype html>
<html lang="${escapeHtml(labels.htmlLang)}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}">` : ""}
    <meta name="robots" content="index,follow,max-image-preview:large">
    <meta name="theme-color" content="#13261d">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:type" content="${escapeHtml(ogType)}">
    <meta property="og:image" content="${escapeHtml(ogImage)}">
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    <link rel="icon" href="${escapeHtml(getRelativeUrl(rootPrefix, "assets/images/favicon.png"))}">
    <link rel="stylesheet" href="${escapeHtml(getRelativeUrl(rootPrefix, "assets/css/styles.css"))}">
    ${extraHead}
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
  </head>
  <body${bodyAttributes ? ` ${bodyAttributes}` : ""}>
    <a class="skip-link" href="#main">${escapeHtml(labels.skip)}</a>
    <header class="site-header is-scrolled" data-header>
      <nav class="nav-shell" aria-label="Primary navigation">
        <a class="brand" href="${escapeHtml(homeHref)}" aria-label="Win-Win Stone">
          <img src="${escapeHtml(getRelativeUrl(rootPrefix, "assets/images/logo.png"))}" alt="" width="36" height="39">
          <span>Win-Win Stone</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" data-nav-toggle>
          <span class="sr-only">Open navigation</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
        <div class="nav-links" id="primary-nav" data-nav-links>
          <div class="nav-item dropdown">
            <a href="${escapeHtml(productsHref)}" class="nav-link">${escapeHtml(labels.navProducts)}</a>
            <div class="dropdown-menu">
              <div class="dropdown-section">
                <h4>By Material</h4>
                <a href="${escapeHtml(getRelativeUrl(rootPrefix, "materials/marble/"))}">Marble</a>
                <a href="${escapeHtml(getRelativeUrl(rootPrefix, "materials/travertine/"))}">Travertine</a>
                <a href="${escapeHtml(getRelativeUrl(rootPrefix, "materials/limestone/"))}">Limestone</a>
              </div>
              <div class="dropdown-section">
                <h4>By Space</h4>
                <a href="${escapeHtml(getRelativeUrl(rootPrefix, "spaces/bathroom/"))}">Bathroom</a>
                <a href="${escapeHtml(getRelativeUrl(rootPrefix, "spaces/living-room/"))}">Living Room</a>
                <a href="${escapeHtml(getRelativeUrl(rootPrefix, "spaces/hotel/"))}">Hotel</a>
              </div>
            </div>
          </div>
          <div class="nav-item dropdown">
            <a href="${escapeHtml(blogHref)}" class="nav-link">${escapeHtml(labels.navBlog)}</a>
            <div class="dropdown-menu">
              <a href="${escapeHtml(getRelativeUrl(rootPrefix, "blog/category/stone-guide/"))}">Stone Guide</a>
              <a href="${escapeHtml(getRelativeUrl(rootPrefix, "blog/category/care-maintenance/"))}">Care & Maintenance</a>
              <a href="${escapeHtml(getRelativeUrl(rootPrefix, "blog/category/factory-process/"))}">Factory Process</a>
              <a href="${escapeHtml(getRelativeUrl(rootPrefix, "blog/category/product-ideas/"))}">Product Ideas</a>
            </div>
          </div>
          <a href="${escapeHtml(getRelativeUrl(rootPrefix, "factory.html"))}">Factory</a>
          <a href="${escapeHtml(getRelativeUrl(rootPrefix, "oem-odm.html"))}">OEM/ODM</a>
          <a href="${escapeHtml(getRelativeUrl(rootPrefix, "why-us.html"))}">Why Us</a>
          <a href="${escapeHtml(getRelativeUrl(rootPrefix, "contact.html"))}">Contact</a>
        </div>
        ${headerControls}
      </nav>
    </header>
    ${body}
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <a class="brand footer-brand" href="${escapeHtml(homeHref)}">
            <img src="${escapeHtml(getRelativeUrl(rootPrefix, "assets/images/logo.png"))}" alt="" width="36" height="39">
            <span>Win-Win Stone</span>
          </a>
          <p>${escapeHtml(labels.footer)}</p>
        </div>
        <div class="footer-links">
          <a href="${escapeHtml(productsHref)}">${escapeHtml(labels.navProducts)}</a>
          <a href="${escapeHtml(blogHref)}">${escapeHtml(labels.navBlog)}</a>
          <a href="${escapeHtml(serviceHref)}">${escapeHtml(labels.navService)}</a>
          <a href="${escapeHtml(contactHref)}">${escapeHtml(labels.navContact)}</a>
        </div>
      </div>
    </footer>
    ${scripts}
  </body>
</html>
`;
}

function renderProductPage(product) {
  const title = product.seo?.title || product.name;
  const description = product.seo?.description || product.summary || product.desc || "";
  const productCategoryCrumbs = getProductCategoryCrumbs(product);
  
  const depth = productCategoryCrumbs.length + 1;
  const rootPrefix = "../".repeat(depth);
  
  const canonicalPath = productCategoryCrumbs.length > 0
    ? toUrlPath("products", ...productCategoryCrumbs.map(c => c.slug), product.slug)
    : toUrlPath("products", product.slug);
  const usageItems = splitUsage(product.usage);
  
  const breadcrumbItems = [
    { label: "Home", href: "index.html" },
    { label: "Products", href: "products.html" },
    ...productCategoryCrumbs.map((category) => ({
      label: category.name,
      href: getProductCategoryPath(category).replace(/^\/+/, "")
    })),
    { label: product.name, href: getProductPageHref("", product) }
  ];
  const galleryItems = (product.gallery || []).length ? product.gallery : [product.image].filter(Boolean);
  const galleryHtml = galleryItems
    .map(
      (image, index) => `
            <button class="product-gallery-thumb${index === 0 ? " is-active" : ""}" type="button" data-gallery-image="${escapeHtml(getRelativeUrl(rootPrefix, image))}" aria-label="View ${escapeHtml(product.name)} image ${index + 1}">
              <img src="${escapeHtml(getRelativeUrl(rootPrefix, image))}" alt="${escapeHtml(product.name)} view ${index + 1}">
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
        <div class="container product-detail-breadcrumbs">
          ${renderBreadcrumbs(breadcrumbItems, rootPrefix)}
        </div>
        <div class="container product-detail-grid">
          <div class="product-detail-media">
            <img id="product-image" src="${escapeHtml(getRelativeUrl(rootPrefix, product.image || galleryItems[0] || ""))}" alt="${escapeHtml(product.name)}">
            <div id="product-gallery" class="product-gallery">${galleryHtml}</div>
          </div>
          <div class="product-detail-copy">
            <a class="text-link product-back-link" href="${escapeHtml(getRelativeUrl(rootPrefix, "products.html"))}">
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
    "@graph": [
      {
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
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products.html` },
          ...productCategoryCrumbs.map((category, index) => ({
            "@type": "ListItem",
            position: index + 3,
            name: category.name,
            item: `${siteUrl}${getProductCategoryPath(category)}`
          })),
          {
            "@type": "ListItem",
            position: productCategoryCrumbs.length + 3,
            name: product.name,
            item: `${siteUrl}${canonicalPath}`
          }
        ]
      }
    ]
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
    headerControls: `<button class="language-toggle" type="button" data-language-toggle aria-label="Switch language"><span data-language-label>中文</span></button>`,
    rootPrefix,
    activeNav: "products",
    scripts: renderSharedPageScript()
  });
}

function renderBlogLandingPage(posts, products) {
  const featuredPost =
    posts
      .filter((post) => post.featured)
      .sort((left, right) => (left.featuredOrder || 999) - (right.featuredOrder || 999))[0] || posts[0];
  const latestPosts = posts.slice(0, 12);
  const intentProducts = BLOG_INTENT_PRODUCTS.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean);
  const popularProducts = products.filter((product) => product.featured).slice(0, 6);
  const categoryCards = BLOG_CATEGORY_DEFINITIONS.map((category) => {
    const count = posts.filter((post) => getPostCategoryKey(post) === category.key).length;
    return `
            <article class="cluster-card">
              <span class="product-type">${escapeHtml(category.shortName)}</span>
              <h2>${escapeHtml(category.name)}</h2>
              <p>${escapeHtml(category.description)}</p>
              <div class="story-meta">
                <span>${count} article${count === 1 ? "" : "s"}</span>
                <span>SEO topic cluster</span>
              </div>
              <a class="text-link" href="${escapeHtml(getRelativeUrl("", `blog/category/${category.slug}/`))}">
                <span>View Articles</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
              </a>
            </article>`;
  }).join("");

  const body = `
    <main id="main">
      <section class="page-hero journal-hero" aria-labelledby="journal-hero-title">
        <picture class="page-hero-media">
          <source srcset="assets/images/green-marble-sink.jpg" media="(min-width: 760px)">
          <img src="assets/images/minimalist-table.jpg" alt="Natural stone sink and table references for editorial guidance">
        </picture>
        <div class="page-hero-overlay"></div>
        <div class="page-hero-content">
          <p class="eyebrow">Stone Journal</p>
          <h1 id="journal-hero-title">Stone Journal for custom natural stone projects.</h1>
          <p>Use these articles to solve material selection, product direction, factory process, packing, and maintenance questions before a quote starts.</p>
          <div class="hero-actions">
            <a class="button primary" href="#articles">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h6"/></svg>
              Browse Articles
            </a>
            <a class="button ghost" href="index.html#contact">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="m4 7 8 6 8-6"/></svg>
              Send Drawing for Quote
            </a>
          </div>
          <div class="page-hero-notes">
            <span>Material comparison guides</span>
            <span>Product idea clusters</span>
            <span>Factory process education</span>
            <span>SEO-ready static pages</span>
          </div>
        </div>
      </section>

      <section class="journal-feature section-pad" aria-labelledby="feature-title">
        <div class="container feature-story">
          <img src="${escapeHtml(getPostImageUrl("", featuredPost))}" alt="${escapeHtml(featuredPost.coverAlt || featuredPost.title)}">
          <div>
            <p class="eyebrow">Featured Article</p>
            <h2 id="feature-title">${escapeHtml(featuredPost.title)}</h2>
            <p>${escapeHtml(getPostExcerpt(featuredPost))}</p>
            <div class="story-meta">
              <span>${escapeHtml(featuredPost.category || "Stone Guide")}</span>
              <span>${escapeHtml(formatDisplayDate(featuredPost.updatedAt || featuredPost.publishedAt))}</span>
              <span>${estimateReadingTime(featuredPost.body)} min read</span>
            </div>
            <a class="text-link" href="${escapeHtml(getPostPageHref("", featuredPost))}">
              <span>Read Article</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
            </a>
          </div>
        </div>
      </section>

      <section class="section-pad" aria-labelledby="cluster-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Topic Clusters</p>
            <h2 id="cluster-title">Four content directions built to match real sourcing intent.</h2>
            <p>Each cluster supports a different search pattern, from stone comparison and design ideas to OEM/ODM process questions and maintenance.</p>
          </div>
          <div class="cluster-grid">${categoryCards}</div>
        </div>
      </section>

      <section class="article-section section-pad" id="articles" aria-labelledby="articles-title">
        <div class="container">
          <div class="catalog-heading-row">
            <div class="section-heading">
              <p class="eyebrow">Latest Articles</p>
              <h2 id="articles-title">Static article cards that search engines and buyers can both understand.</h2>
              <p>Use filters to scan by category, then move into the article, product reference, or inquiry path that fits your project.</p>
            </div>
          </div>
          <div class="filter-bar" role="tablist" aria-label="Article filters" data-filter-group>
            <button class="filter-button active" type="button" data-blog-filter="all" role="tab" aria-selected="true">All</button>
            <button class="filter-button" type="button" data-blog-filter="guide" role="tab" aria-selected="false">Stone Guide</button>
            <button class="filter-button" type="button" data-blog-filter="ideas" role="tab" aria-selected="false">Product Ideas</button>
            <button class="filter-button" type="button" data-blog-filter="process" role="tab" aria-selected="false">Factory Process</button>
            <button class="filter-button" type="button" data-blog-filter="care" role="tab" aria-selected="false">Care</button>
          </div>
          <div class="article-grid">${latestPosts.map((post) => renderBlogArticleCard(post)).join("")}</div>
        </div>
      </section>

      <section class="section-pad blog-intent-section" aria-labelledby="buyer-intent-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Buyer Intent</p>
            <h2 id="buyer-intent-title">What are you trying to source right now?</h2>
          </div>
          <div class="intent-grid">
            <a class="intent-card" href="products/green-marble-pedestal-sink/"><strong>Custom bathroom sinks</strong><span>Stone options, drain details, finishes, and export packing.</span></a>
            <a class="intent-card" href="products/minimalist-travertine-dining-table/"><strong>Travertine tables</strong><span>Dining table ideas, slab direction, and base structure notes.</span></a>
            <a class="intent-card" href="products/natural-marble-bathtub/"><strong>Stone bathtubs</strong><span>Luxury project guidance, maintenance notes, and production scope.</span></a>
            <a class="intent-card" href="index.html#service"><strong>OEM/ODM stone products</strong><span>Quote preparation, repeat-order control, inspection, and delivery.</span></a>
          </div>
        </div>
      </section>

      <section class="section-pad" aria-labelledby="product-reference-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Popular Product References</p>
            <h2 id="product-reference-title">Products that pair naturally with blog traffic and early inquiries.</h2>
          </div>
          <div class="link-grid">${popularProducts.map((product) => renderProductLinkCard(product)).join("")}</div>
        </div>
      </section>

      <section class="cta-band" aria-labelledby="journal-cta-title">
        <div class="container cta-band-inner">
          <div>
            <p class="eyebrow">Start an Inquiry</p>
            <h2 id="journal-cta-title">Send your drawing, target size, or closest product reference.</h2>
          </div>
          <div class="cta-band-actions">
            <a class="button primary" href="index.html#contact">Contact Factory</a>
            <a class="button ghost" href="products.html">Browse Products</a>
          </div>
        </div>
      </section>
    </main>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        name: "Stone Journal",
        description: "Blog articles about natural stone materials, custom product development, factory process, and maintenance.",
        url: `${siteUrl}/blog.html`
      },
      {
        "@type": "ItemList",
        itemListElement: latestPosts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: getPostCanonicalUrl(post),
          name: post.title
        }))
      }
    ]
  };

  return renderLayout({
    title: "Stone Journal | Win-Win Stone",
    description:
      "Read static SEO-ready articles on natural stone materials, product ideas, factory process, packing, care, and OEM/ODM sourcing.",
    keywords:
      "stone journal, natural stone blog, marble sink guide, travertine table guide, OEM ODM stone process",
    canonicalPath: "/blog.html",
    ogType: "website",
    ogImage: `${siteUrl}/${(featuredPost.coverImage || "assets/images/minimalist-table.jpg").replace(/^\/+/, "")}`,
    body,
    schema,
    activeNav: "blog",
    scripts: renderSharedPageScript({ enableBlogFilters: true })
  });
}

function renderBlogCategoryPage(category, posts, products) {
  const featuredPost = posts[0] || null;
  const relatedProducts = getCategoryProducts(category, products);
  const categoryArticles = posts.length
    ? posts.map((post) => renderBlogArticleCard(post, { rootPrefix: "../../../" })).join("")
    : `<article class="article-rail-card">
            <span class="product-type">Coming Next</span>
            <strong>More ${escapeHtml(category.name)} articles are planned.</strong>
            <p>This category page is ready for future posts about ${escapeHtml(category.description.toLowerCase())}</p>
          </article>`;
  const body = `
    <main id="main">
      <section class="page-hero article-hero section-pad" aria-labelledby="category-title">
        <div class="container">
          ${renderBreadcrumbs(
            [
              { label: "Home", href: "index.html" },
              { label: "Blog", href: "blog.html" },
              { label: category.name, href: `blog/category/${category.slug}/` }
            ],
            "../../../"
          )}
          <p class="eyebrow">Blog Category</p>
          <h1 id="category-title">${escapeHtml(category.heroTitle)}</h1>
          <p>${escapeHtml(category.heroDescription)}</p>
          <div class="story-meta">
            <span>${posts.length} article${posts.length === 1 ? "" : "s"}</span>
            <span>Static category landing page</span>
          </div>
        </div>
      </section>

      ${featuredPost ? `
      <section class="journal-feature section-pad" aria-labelledby="category-feature-title">
        <div class="container feature-story">
          <img src="${escapeHtml(getPostImageUrl("../../../", featuredPost))}" alt="${escapeHtml(featuredPost.coverAlt || featuredPost.title)}">
          <div>
            <p class="eyebrow">Featured ${escapeHtml(category.shortName)}</p>
            <h2 id="category-feature-title">${escapeHtml(featuredPost.title)}</h2>
            <p>${escapeHtml(getPostExcerpt(featuredPost))}</p>
            <div class="story-meta">
              <span>${escapeHtml(formatDisplayDate(featuredPost.publishedAt || featuredPost.updatedAt))}</span>
              <span>${estimateReadingTime(featuredPost.body)} min read</span>
            </div>
            <a class="text-link" href="${escapeHtml(getPostPageHref("../../../", featuredPost))}">
              <span>Read Article</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
            </a>
          </div>
        </div>
      </section>
      ` : ""}

      <section class="article-section section-pad" aria-labelledby="category-articles-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${escapeHtml(category.name)}</p>
            <h2 id="category-articles-title">Articles built around one search intent family.</h2>
            <p>${escapeHtml(category.description)}</p>
          </div>
          <div class="article-grid">${categoryArticles}</div>
        </div>
      </section>

      <section class="section-pad" aria-labelledby="category-products-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Related Products</p>
            <h2 id="category-products-title">Product pages that fit this topic cluster.</h2>
          </div>
          <div class="link-grid">${relatedProducts.map((product) => renderProductLinkCard(product, { rootPrefix: "../../../" })).join("")}</div>
        </div>
      </section>

      <section class="cta-band" aria-labelledby="category-cta-title">
        <div class="container cta-band-inner">
          <div>
            <p class="eyebrow">Next Step</p>
            <h2 id="category-cta-title">${escapeHtml(category.ctaLabel)}</h2>
          </div>
          <div class="cta-band-actions">
            <a class="button primary" href="../../../index.html#contact">Contact Factory</a>
            <a class="button ghost" href="../../../blog.html">Back to Blog</a>
          </div>
        </div>
      </section>
    </main>
  `;

  const lastUpdated = posts
    .map((post) => post.updatedAt || post.publishedAt)
    .filter(Boolean)
    .sort()
    .slice(-1)[0];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: category.heroTitle,
        description: category.heroDescription,
        url: `${siteUrl}${getBlogCategoryPath(category)}`
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog.html` },
          { "@type": "ListItem", position: 3, name: category.name, item: `${siteUrl}${getBlogCategoryPath(category)}` }
        ]
      },
      {
        "@type": "ItemList",
        itemListElement: posts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: getPostCanonicalUrl(post),
          name: post.title
        }))
      }
    ]
  };

  return renderLayout({
    title: `${category.name} Articles | Win-Win Stone`,
    description: category.heroDescription,
    keywords: `${category.name.toLowerCase()}, natural stone articles, Win-Win Stone blog`,
    canonicalPath: getBlogCategoryPath(category),
    ogType: "website",
    ogImage: `${siteUrl}/${((featuredPost && featuredPost.coverImage) || "assets/images/minimalist-table.jpg").replace(/^\/+/, "")}`,
    body,
    schema,
    rootPrefix: "../../../",
    activeNav: "blog",
    extraHead: lastUpdated ? `<meta property="article:modified_time" content="${escapeHtml(lastUpdated)}">` : "",
    scripts: renderSharedPageScript()
  });
}

function renderPostPage(post, posts, products, { locale = "en" } = {}) {
  const localizedPost = getLocalizedPost(post, locale);
  const title = localizedPost.seo.title || localizedPost.title;
  const description = localizedPost.seo.description || getPostExcerpt(post, locale);
  const canonicalPath = getPostPath(post, locale);
  const baseCategory = getBlogCategoryDefinitionByKey(getPostCategoryKey(post));
  const category = getLocalizedBlogCategory(baseCategory, locale);
  const relatedPosts = getPostRelatedPosts(post, posts);
  const relatedProducts = getPostRelatedProducts(post, products);
  const rootPrefix = locale === "zh" ? "../../../" : "../../";
  const languageControls =
    locale === "zh"
      ? `<div class="language-switch" aria-label="Language"><a href="${escapeHtml(getPostPageHref(rootPrefix, post))}">English</a><span>中文</span></div>`
      : `<div class="language-switch" aria-label="Language"><span>English</span><a href="${escapeHtml(getPostPageHref(rootPrefix, post, { locale: "zh" }))}">中文</a></div>`;
  const postLabels =
    locale === "zh"
      ? {
          home: "首页",
          blog: "博客",
          author: post.author || "Win-Win Stone",
          minRead: "分钟阅读",
          inArticle: "本文主题",
          factoryLabel: "需要工厂建议？",
          factoryTitle: "发送图纸或目标尺寸。",
          factoryText: "我们可以在报价前帮你评估材料方向、结构、表面工艺和出口包装。",
          factoryCta: "联系工厂",
          faqEyebrow: "FAQ",
          faqTitle: "常见问题",
          relatedProductsEyebrow: "相关产品",
          relatedProductsTitle: "与这篇文章相关的产品参考。",
          relatedArticlesEyebrow: "相关文章",
          relatedArticlesTitle: "继续阅读同一主题的内容。",
          nextStep: "下一步",
          ctaTitle: "需要定制石材台盆方案或产品目录？",
          ctaText: "把图纸、尺寸、数量或参考图片发给我们，我们可以帮你评估材料、结构、工艺和包装方案。",
          ctaPrimary: "WhatsApp 咨询",
          ctaSecondary: "发送邮件",
          ctaCatalog: "下载目录"
        }
      : {
          home: "Home",
          blog: "Blog",
          author: post.author || "Win-Win Stone",
          minRead: "min read",
          inArticle: "In This Article",
          factoryLabel: "Need a Factory Answer?",
          factoryTitle: "Send your drawing or target size.",
          factoryText:
            "We can review the material direction, structure, finish, and export packing before you request a quote.",
          factoryCta: "Contact Factory",
          faqEyebrow: "FAQ",
          faqTitle: "Reader Questions",
          relatedProductsEyebrow: "Related Products",
          relatedProductsTitle: "Product references connected to this article.",
          relatedArticlesEyebrow: "Related Articles",
          relatedArticlesTitle: "Keep moving through the same topic cluster.",
          nextStep: "Next Step",
          ctaTitle: "Need a custom stone sink quote or product catalog?",
          ctaText:
            "Send your drawing, size, quantity, or reference image. Our factory team can review the material, structure, finish, and packing solution.",
          ctaPrimary: "WhatsApp Inquiry",
          ctaSecondary: "Email for Quote",
          ctaCatalog: "Download Catalog"
        };
  const faqHtml = (localizedPost.faqs || [])
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
          ${renderBreadcrumbs(
            [
              { label: postLabels.home, href: "index.html" },
              { label: postLabels.blog, href: "blog.html" },
              { label: category.name, href: `blog/category/${baseCategory.slug}/` },
              { label: localizedPost.title, href: locale === "zh" ? `zh/blog/${post.slug}/` : `blog/${post.slug}/` }
            ],
            rootPrefix
          )}
          <p class="eyebrow">${escapeHtml(localizedPost.category || category.name)}</p>
          <h1 id="post-title">${escapeHtml(localizedPost.title)}</h1>
          <p>${escapeHtml(description)}</p>
          <div class="story-meta">
            <span>${escapeHtml(postLabels.author)}</span>
            <span>${escapeHtml(formatDisplayDate(post.publishedAt || post.updatedAt))}</span>
            <span>${estimateReadingTime(localizedPost.body)} ${escapeHtml(postLabels.minRead)}</span>
          </div>
        </div>
      </section>

      <section class="section-pad">
        <div class="container article-shell">
          <article class="article-content">
            <img src="${escapeHtml(getPostImageUrl(rootPrefix, post))}" alt="${escapeHtml(localizedPost.coverAlt)}">
            <div>${localizedPost.body || ""}</div>
          </article>
          <aside class="article-rail">
            <div class="article-rail-card">
              <span class="product-type">${escapeHtml(postLabels.inArticle)}</span>
              <strong>${escapeHtml(localizedPost.category || category.name)}</strong>
              <p>${escapeHtml(description)}</p>
            </div>
            <div class="article-rail-card">
              <span class="product-type">${escapeHtml(postLabels.factoryLabel)}</span>
              <strong>${escapeHtml(postLabels.factoryTitle)}</strong>
              <p>${escapeHtml(postLabels.factoryText)}</p>
              <a class="text-link" href="${escapeHtml(rootPrefix)}index.html#contact">
                <span>${escapeHtml(postLabels.factoryCta)}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
              </a>
            </div>
          </aside>
        </div>
      </section>

      ${faqHtml ? `
      <section class="section-pad" aria-labelledby="post-faq-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${escapeHtml(postLabels.faqEyebrow)}</p>
            <h2 id="post-faq-title">${escapeHtml(postLabels.faqTitle)}</h2>
          </div>
          <div class="product-faq-list">${faqHtml}</div>
        </div>
      </section>
      ` : ""}

      <section class="section-pad" aria-labelledby="related-products-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${escapeHtml(postLabels.relatedProductsEyebrow)}</p>
            <h2 id="related-products-title">${escapeHtml(postLabels.relatedProductsTitle)}</h2>
          </div>
          <div class="link-grid">${relatedProducts.map((product) => renderProductLinkCard(product, { rootPrefix })).join("")}</div>
        </div>
      </section>

      ${relatedPosts.length ? `
      <section class="section-pad" aria-labelledby="related-articles-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${escapeHtml(postLabels.relatedArticlesEyebrow)}</p>
            <h2 id="related-articles-title">${escapeHtml(postLabels.relatedArticlesTitle)}</h2>
          </div>
          <div class="article-grid">${relatedPosts.map((entry) => renderBlogArticleCard(entry, { rootPrefix, locale })).join("")}</div>
        </div>
      </section>
      ` : ""}

      <section class="cta-band" aria-labelledby="article-cta-title">
        <div class="container cta-band-inner">
          <div>
            <p class="eyebrow">${escapeHtml(postLabels.nextStep)}</p>
            <h2 id="article-cta-title">${escapeHtml(postLabels.ctaTitle)}</h2>
            <p>${escapeHtml(postLabels.ctaText)}</p>
          </div>
          <div class="cta-band-actions">
            <a class="button primary" href="${escapeHtml(whatsappHref)}" target="_blank" rel="noopener">${escapeHtml(postLabels.ctaPrimary)}</a>
            <a class="button ghost" href="mailto:${escapeHtml(quoteEmail)}">${escapeHtml(postLabels.ctaSecondary)}</a>
            <a class="button ghost" href="${escapeHtml(getRelativeUrl(rootPrefix, catalogPath))}" download>${escapeHtml(postLabels.ctaCatalog)}</a>
          </div>
        </div>
      </section>
    </main>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: localizedPost.title,
        description,
        articleSection: localizedPost.category || category.name,
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
        keywords: localizedPost.seo.keywords || localizedPost.tags.join(", "),
        mainEntityOfPage: `${siteUrl}${canonicalPath}`,
        datePublished: post.publishedAt || post.updatedAt,
        dateModified: post.updatedAt || post.publishedAt
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: postLabels.home, item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: postLabels.blog, item: `${siteUrl}/blog.html` },
          { "@type": "ListItem", position: 3, name: category.name, item: `${siteUrl}${getBlogCategoryPath(baseCategory)}` },
          { "@type": "ListItem", position: 4, name: localizedPost.title, item: `${siteUrl}${canonicalPath}` }
        ]
      }
    ]
  };

  return renderLayout({
    title,
    description,
    keywords: localizedPost.seo.keywords || "",
    canonicalPath,
    ogType: "article",
    ogImage: `${siteUrl}/${(post.coverImage || "").replace(/^\/+/, "")}`,
    body,
    schema,
    rootPrefix,
    activeNav: "blog",
    headerControls: languageControls,
    extraHead: `
    <link rel="alternate" hreflang="en" href="${escapeHtml(getPostCanonicalUrl(post))}">
    <link rel="alternate" hreflang="zh-CN" href="${escapeHtml(getPostCanonicalUrl(post, "zh"))}">
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(getPostCanonicalUrl(post))}">`,
    scripts: renderSharedPageScript(),
    locale
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
  await fs.writeFile(path.join(outputDir, "index.html"), normalizeOutput(html), "utf8");
}

async function writeSiteFile(relativePath, html) {
  const outputPath = path.join(siteDir, relativePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, normalizeOutput(html), "utf8");
}

async function writeFallbackDataFile(filename, variableName, payload) {
  await fs.mkdir(siteDataDir, { recursive: true });
  const fileContent = `const ${variableName} = ${JSON.stringify(payload, null, 2)};\nwindow.${variableName} = ${variableName};\n`;
  await fs.writeFile(path.join(siteDataDir, filename), fileContent, "utf8");
}

async function buildSitemap(products, posts) {
  const blogUpdatedAt = posts
    .map((post) => post.updatedAt || post.publishedAt)
    .filter(Boolean)
    .sort()
    .slice(-1)[0];
  const urls = [
    { path: "/", priority: "1.0" },
    { path: "/products.html", priority: "0.9" },
    ...PRODUCT_CATEGORY_DEFINITIONS.map((category) => ({
      path: getProductCategoryPath(category),
      priority: category.parentSlug ? "0.78" : "0.82"
    })),
    { path: "/blog.html", priority: "0.85", lastmod: blogUpdatedAt },
    ...BLOG_CATEGORY_DEFINITIONS.map((category) => {
      const categoryUpdatedAt = posts
        .filter((post) => getPostCategoryKey(post) === category.key)
        .map((post) => post.updatedAt || post.publishedAt)
        .filter(Boolean)
        .sort()
        .slice(-1)[0];

      return {
        path: getBlogCategoryPath(category),
        priority: "0.75",
        lastmod: categoryUpdatedAt
      };
    }),
    ...products.map((product) => ({
      path: toUrlPath("products", product.slug),
      priority: "0.8",
      lastmod: product.updatedAt || product.createdAt
    })),
    ...posts.map((post) => ({
      path: toUrlPath("blog", post.slug),
      priority: "0.7",
      lastmod: post.updatedAt || post.publishedAt
    })),
    ...posts
      .filter((post) => post.titleZh && post.bodyZh)
      .map((post) => ({
        path: getPostPath(post, "zh"),
        priority: "0.65",
        lastmod: post.updatedAt || post.publishedAt
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${xmlEscape(`${siteUrl}${entry.path}`)}</loc>
    ${entry.lastmod ? `<lastmod>${xmlEscape(formatIsoDate(entry.lastmod))}</lastmod>` : ""}
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  await fs.writeFile(path.join(siteDir, "sitemap.xml"), normalizeOutput(xml), "utf8");
}

async function main() {
  const [products, posts] = await Promise.all([readJson(productsFile), readJson(postsFile)]);
  const publishedProducts = products
    .filter((product) => product.status === "published" && product.slug)
    .sort((left, right) => (left.sortOrder || 999) - (right.sortOrder || 999));
  const publishedPosts = posts
    .filter((post) => post.status === "published" && post.slug)
    .sort((left, right) => (left.sortOrder || 999) - (right.sortOrder || 999));

  await Promise.all([
    resetGeneratedDir(path.join(siteDir, "products")),
    resetGeneratedDir(path.join(siteDir, "blog")),
    resetGeneratedDir(path.join(siteDir, "zh", "blog"))
  ]);

  for (const product of publishedProducts) {
    const categoryCrumbs = getProductCategoryCrumbs(product);
    const productDir = categoryCrumbs.length > 0
      ? path.join("products", ...categoryCrumbs.map(c => c.slug), product.slug)
      : path.join("products", product.slug);
    await writeGeneratedPage(productDir, renderProductPage(product));
  }

  for (const category of PRODUCT_CATEGORY_DEFINITIONS) {
    const categoryDir = category.parentSlug
      ? path.join("products", category.parentSlug, category.slug)
      : path.join("products", category.slug);
    await writeGeneratedPage(categoryDir, renderProductCategoryPage(category, publishedProducts));
  }

  for (const post of publishedPosts) {
    await writeGeneratedPage(path.join("blog", post.slug), renderPostPage(post, publishedPosts, publishedProducts));
    if (post.titleZh && post.bodyZh) {
      await writeGeneratedPage(
        path.join("zh", "blog", post.slug),
        renderPostPage(post, publishedPosts, publishedProducts, { locale: "zh" })
      );
    }
  }

  for (const category of BLOG_CATEGORY_DEFINITIONS) {
    const categoryPosts = publishedPosts.filter((post) => getPostCategoryKey(post) === category.key);
    await writeGeneratedPage(path.join("blog", "category", category.slug), renderBlogCategoryPage(category, categoryPosts, publishedProducts));
  }

  await Promise.all([
    writeSiteFile("index.html", renderProductsLandingPage(publishedProducts)),
    writeSiteFile("products.html", renderProductsLandingPage(publishedProducts)),
    writeSiteFile("blog.html", renderBlogLandingPage(publishedPosts, publishedProducts))
  ]);

  await Promise.all([
    writeFallbackDataFile("products.js", "PRODUCTS", publishedProducts),
    writeFallbackDataFile("posts.js", "POSTS", publishedPosts)
  ]);

  await buildSitemap(publishedProducts, publishedPosts);

  console.log(
    `Generated ${publishedProducts.length} product pages, ${PRODUCT_CATEGORY_DEFINITIONS.length} product category pages, ${publishedPosts.length} blog pages, landing pages, sitemap.xml, and fallback data files`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
