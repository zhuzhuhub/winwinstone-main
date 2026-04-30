const http = require("node:http");
const { URL } = require("node:url");
const path = require("node:path");
const fs = require("node:fs/promises");

const PORT = Number(process.env.PORT || 8787);
const CONTENT_API_TOKEN = process.env.CONTENT_API_TOKEN || "";
const DATA_DIR = path.join(__dirname, "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
const MEDIA_FILE = path.join(DATA_DIR, "media.json");

function json(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  response.end(JSON.stringify(payload, null, 2));
}

function inferFilters(product) {
  if (Array.isArray(product.filters) && product.filters.length) {
    return product.filters;
  }

  const filters = new Set();
  const text = `${product.category || ""} ${product.slug || ""}`.toLowerCase();

  if (text.includes("sink")) filters.add("sinks");
  if (text.includes("table")) filters.add("tables");
  if (text.includes("bathtub") || text.includes("bathroom") || text.includes("vanity")) filters.add("bathroom");
  if (
    text.includes("project") ||
    text.includes("fireplace") ||
    text.includes("oem") ||
    text.includes("custom")
  ) {
    filters.add("project");
  }

  return Array.from(filters);
}

function normalizeFaqs(faqs) {
  if (!Array.isArray(faqs)) return [];

  return faqs
    .map((entry) => {
      if (Array.isArray(entry)) {
        const [question = "", answer = ""] = entry;
        return {
          question: String(question).trim(),
          answer: String(answer).trim()
        };
      }

      if (entry && typeof entry === "object") {
        return {
          question: String(entry.question || "").trim(),
          answer: String(entry.answer || "").trim()
        };
      }

      return null;
    })
    .filter((entry) => entry && entry.question && entry.answer);
}

function normalizeArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

function normalizeDate(value, fallback) {
  const input = value || fallback;
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function normalizeProduct(rawProduct, existingProduct) {
  const now = new Date().toISOString();
  const product = rawProduct || {};
  const existing = existingProduct || {};
  const slug = String(product.slug || existing.slug || "").trim();

  if (!slug) {
    throw new Error("Product slug is required.");
  }

  const image = String(product.image || existing.image || "").trim();
  const summary = String(product.summary || existing.summary || product.desc || existing.desc || "").trim();
  const category = String(product.category || existing.category || "").trim();

  return {
    id: String(existing.id || product.id || `prod_${slug.replace(/-/g, "_")}`),
    slug,
    aliasSlugs: normalizeArray(product.aliasSlugs || existing.aliasSlugs),
    status: String(product.status || existing.status || "draft"),
    featured: Boolean(product.featured ?? existing.featured),
    featuredOrder:
      product.featuredOrder === null || product.featuredOrder === ""
        ? null
        : Number(product.featuredOrder ?? existing.featuredOrder ?? 999),
    sortOrder: Number(product.sortOrder ?? existing.sortOrder ?? 999),
    name: String(product.name || existing.name || "").trim(),
    nameZh: String(product.nameZh || existing.nameZh || "").trim(),
    category,
    categoryZh: String(product.categoryZh || existing.categoryZh || "").trim(),
    filters: inferFilters({ ...existing, ...product, category, slug }),
    image,
    gallery: normalizeArray(product.gallery || existing.gallery || (image ? [image] : [])),
    badge: String(product.badge || existing.badge || category).trim(),
    badgeZh: String(product.badgeZh || existing.badgeZh || "").trim(),
    summary,
    summaryZh: String(product.summaryZh || existing.summaryZh || "").trim(),
    desc: String(product.desc || existing.desc || summary).trim(),
    descZh: String(product.descZh || existing.descZh || "").trim(),
    seo: {
      title: String(product.seo?.title || existing.seo?.title || product.name || existing.name || "").trim(),
      description: String(
        product.seo?.description || existing.seo?.description || summary || product.desc || existing.desc || ""
      ).trim(),
      keywords: String(product.seo?.keywords || existing.seo?.keywords || "").trim()
    },
    material: String(product.material || existing.material || "").trim(),
    materialZh: String(product.materialZh || existing.materialZh || "").trim(),
    usage: String(product.usage || existing.usage || "").trim(),
    usageZh: String(product.usageZh || existing.usageZh || "").trim(),
    finish: String(product.finish || existing.finish || "").trim(),
    finishZh: String(product.finishZh || existing.finishZh || "").trim(),
    moq: String(product.moq || existing.moq || "").trim(),
    moqZh: String(product.moqZh || existing.moqZh || "").trim(),
    leadTime: String(product.leadTime || existing.leadTime || "").trim(),
    leadTimeZh: String(product.leadTimeZh || existing.leadTimeZh || "").trim(),
    intro: String(product.intro || existing.intro || summary).trim(),
    introZh: String(product.introZh || existing.introZh || "").trim(),
    options: normalizeArray(product.options || existing.options),
    optionsZh: normalizeArray(product.optionsZh || existing.optionsZh),
    faqs: normalizeFaqs(product.faqs || existing.faqs),
    createdAt: existing.createdAt || now,
    updatedAt: now
  };
}

function normalizePost(rawPost, existingPost) {
  const now = new Date().toISOString();
  const post = rawPost || {};
  const existing = existingPost || {};
  const slug = String(post.slug || existing.slug || "").trim();

  if (!slug) {
    throw new Error("Post slug is required.");
  }

  const title = String(post.title || existing.title || "").trim();
  const excerpt = String(post.excerpt || existing.excerpt || "").trim();

  return {
    id: String(existing.id || post.id || `post_${slug.replace(/-/g, "_")}`),
    slug,
    status: String(post.status || existing.status || "draft"),
    featured: Boolean(post.featured ?? existing.featured),
    featuredOrder:
      post.featuredOrder === null || post.featuredOrder === ""
        ? null
        : Number(post.featuredOrder ?? existing.featuredOrder ?? 999),
    sortOrder: Number(post.sortOrder ?? existing.sortOrder ?? 999),
    title,
    titleZh: String(post.titleZh || existing.titleZh || "").trim(),
    category: String(post.category || existing.category || "").trim(),
    categoryZh: String(post.categoryZh || existing.categoryZh || "").trim(),
    tags: normalizeArray(post.tags || existing.tags),
    tagsZh: normalizeArray(post.tagsZh || existing.tagsZh),
    coverImage: String(post.coverImage || existing.coverImage || "").trim(),
    coverAlt: String(post.coverAlt || existing.coverAlt || "").trim(),
    coverAltZh: String(post.coverAltZh || existing.coverAltZh || "").trim(),
    excerpt,
    excerptZh: String(post.excerptZh || existing.excerptZh || "").trim(),
    body: String(post.body || existing.body || "").trim(),
    bodyZh: String(post.bodyZh || existing.bodyZh || "").trim(),
    faqs: normalizeFaqs(post.faqs || existing.faqs),
    seo: {
      title: String(post.seo?.title || existing.seo?.title || title).trim(),
      description: String(post.seo?.description || existing.seo?.description || excerpt).trim(),
      keywords: String(post.seo?.keywords || existing.seo?.keywords || "").trim()
    },
    relatedProducts: normalizeArray(post.relatedProducts || existing.relatedProducts),
    relatedPosts: normalizeArray(post.relatedPosts || existing.relatedPosts),
    author: String(post.author || existing.author || "").trim(),
    publishedAt: normalizeDate(post.publishedAt, existing.publishedAt || now),
    updatedAt: now
  };
}

function normalizeMedia(rawMedia, existingMedia) {
  const now = new Date().toISOString();
  const media = rawMedia || {};
  const existing = existingMedia || {};
  const id = String(media.id || existing.id || "").trim();

  if (!id) {
    throw new Error("Media id is required.");
  }

  const filePath = String(media.filePath || existing.filePath || "").trim();
  const alt = String(media.alt || existing.alt || "").trim();

  return {
    id,
    status: String(media.status || existing.status || "draft"),
    sortOrder: Number(media.sortOrder ?? existing.sortOrder ?? 999),
    name: String(media.name || existing.name || id).trim(),
    filePath,
    alt,
    altZh: String(media.altZh || existing.altZh || "").trim(),
    category: String(media.category || existing.category || "").trim(),
    tags: normalizeArray(media.tags || existing.tags),
    relatedProducts: normalizeArray(media.relatedProducts || existing.relatedProducts),
    relatedPosts: normalizeArray(media.relatedPosts || existing.relatedPosts),
    notes: String(media.notes || existing.notes || alt).trim(),
    createdAt: existing.createdAt || now,
    updatedAt: now
  };
}

async function readProducts() {
  const raw = await fs.readFile(PRODUCTS_FILE, "utf8");
  const products = JSON.parse(raw);

  return products.map((product) => normalizeProduct(product, product));
}

async function readPosts() {
  const raw = await fs.readFile(POSTS_FILE, "utf8");
  const posts = JSON.parse(raw);

  return posts.map((post) => normalizePost(post, post));
}

async function readMedia() {
  const raw = await fs.readFile(MEDIA_FILE, "utf8");
  const media = JSON.parse(raw);

  return media.map((entry) => normalizeMedia(entry, entry));
}

async function writeProducts(products) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PRODUCTS_FILE, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}

async function writePosts(posts) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(POSTS_FILE, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
}

async function writeMedia(media) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(MEDIA_FILE, `${JSON.stringify(media, null, 2)}\n`, "utf8");
}

async function readBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (!chunks.length) return {};

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function isAuthorized(request) {
  if (!CONTENT_API_TOKEN) return true;

  const authorization = request.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  return token === CONTENT_API_TOKEN;
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    response.end();
    return;
  }

  try {
    if (request.method === "GET" && url.pathname === "/health") {
      json(response, 200, { ok: true, service: "winwinstone-content-api" });
      return;
    }

    if (request.method === "GET" && url.pathname === "/products") {
      const status = url.searchParams.get("status");
      const products = await readProducts();
      const filtered = products
        .filter((product) => (status ? product.status === status : true))
        .sort((left, right) => left.sortOrder - right.sortOrder);

      json(response, 200, filtered);
      return;
    }

    if (request.method === "GET" && url.pathname.startsWith("/products/")) {
      const slug = decodeURIComponent(url.pathname.replace("/products/", ""));
      const products = await readProducts();
      const product = products.find((entry) => entry.slug === slug || entry.aliasSlugs.includes(slug));

      if (!product) {
        json(response, 404, { error: "Product not found." });
        return;
      }

      json(response, 200, product);
      return;
    }

    if (request.method === "POST" && url.pathname === "/products/upsert") {
      if (!isAuthorized(request)) {
        json(response, 401, { error: "Unauthorized." });
        return;
      }

      const payload = await readBody(request);
      const products = await readProducts();
      const existingIndex = products.findIndex((entry) => entry.slug === payload.slug);
      const existing = existingIndex >= 0 ? products[existingIndex] : undefined;
      const normalized = normalizeProduct(payload, existing);

      if (existingIndex >= 0) {
        products[existingIndex] = normalized;
      } else {
        products.push(normalized);
      }

      products.sort((left, right) => left.sortOrder - right.sortOrder);
      await writeProducts(products);

      json(response, 200, {
        ok: true,
        product: normalized
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/posts") {
      const status = url.searchParams.get("status");
      const posts = await readPosts();
      const filtered = posts
        .filter((post) => (status ? post.status === status : true))
        .sort((left, right) => left.sortOrder - right.sortOrder);

      json(response, 200, filtered);
      return;
    }

    if (request.method === "GET" && url.pathname.startsWith("/posts/")) {
      const slug = decodeURIComponent(url.pathname.replace("/posts/", ""));
      const posts = await readPosts();
      const post = posts.find((entry) => entry.slug === slug);

      if (!post) {
        json(response, 404, { error: "Post not found." });
        return;
      }

      json(response, 200, post);
      return;
    }

    if (request.method === "POST" && url.pathname === "/posts/upsert") {
      if (!isAuthorized(request)) {
        json(response, 401, { error: "Unauthorized." });
        return;
      }

      const payload = await readBody(request);
      const posts = await readPosts();
      const existingIndex = posts.findIndex((entry) => entry.slug === payload.slug);
      const existing = existingIndex >= 0 ? posts[existingIndex] : undefined;
      const normalized = normalizePost(payload, existing);

      if (existingIndex >= 0) {
        posts[existingIndex] = normalized;
      } else {
        posts.push(normalized);
      }

      posts.sort((left, right) => left.sortOrder - right.sortOrder);
      await writePosts(posts);

      json(response, 200, {
        ok: true,
        post: normalized
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/media") {
      const status = url.searchParams.get("status");
      const media = await readMedia();
      const filtered = media
        .filter((entry) => (status ? entry.status === status : true))
        .sort((left, right) => left.sortOrder - right.sortOrder);

      json(response, 200, filtered);
      return;
    }

    if (request.method === "GET" && url.pathname.startsWith("/media/")) {
      const id = decodeURIComponent(url.pathname.replace("/media/", ""));
      const media = await readMedia();
      const entry = media.find((item) => item.id === id);

      if (!entry) {
        json(response, 404, { error: "Media not found." });
        return;
      }

      json(response, 200, entry);
      return;
    }

    if (request.method === "POST" && url.pathname === "/media/upsert") {
      if (!isAuthorized(request)) {
        json(response, 401, { error: "Unauthorized." });
        return;
      }

      const payload = await readBody(request);
      const media = await readMedia();
      const existingIndex = media.findIndex((entry) => entry.id === payload.id);
      const existing = existingIndex >= 0 ? media[existingIndex] : undefined;
      const normalized = normalizeMedia(payload, existing);

      if (existingIndex >= 0) {
        media[existingIndex] = normalized;
      } else {
        media.push(normalized);
      }

      media.sort((left, right) => left.sortOrder - right.sortOrder);
      await writeMedia(media);

      json(response, 200, {
        ok: true,
        media: normalized
      });
      return;
    }

    json(response, 404, { error: "Not found." });
  } catch (error) {
    json(response, 500, {
      error: error instanceof Error ? error.message : "Unknown server error."
    });
  }
});

server.listen(PORT, () => {
  console.log(`Win-Win Stone content API listening on http://127.0.0.1:${PORT}`);
});
