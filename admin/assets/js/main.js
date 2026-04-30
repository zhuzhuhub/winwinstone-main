const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const studioTabs = document.querySelectorAll("[data-studio-tab]");
const studioPanels = document.querySelectorAll("[data-studio-panel]");
const studioTopNav = document.querySelectorAll("[data-studio-nav]");
const CONTENT_API_BASE = window.CONTENT_API_BASE || "http://127.0.0.1:8787";
const CONTENT_API_TOKEN = window.CONTENT_API_TOKEN || "";
const productForm = document.querySelector("[data-product-form]");
const productLibrary = document.querySelector("[data-product-library]");
const newProductButton = document.querySelector("[data-new-product]");
const postLibrary = document.querySelector("[data-post-library]");
const newPostButton = document.querySelector("[data-new-post]");
const mediaLibrary = document.querySelector("[data-media-library]");
const newMediaButton = document.querySelector("[data-new-media]");

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    header?.classList.toggle("nav-open", isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      header?.classList.remove("nav-open");
    }
  });
}

function setStudioTab(target) {
  if (!target) return;

  let matched = false;
  studioTabs.forEach((item) => {
    const active = item.dataset.studioTab === target;
    matched = matched || active;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
  });

  if (!matched) return;

  studioPanels.forEach((panel) => {
    panel.hidden = panel.dataset.studioPanel !== target;
  });

  studioTopNav.forEach((link) => {
    const active = link.dataset.studioNav === target;
    link.classList.toggle("is-active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

studioTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setStudioTab(button.dataset.studioTab);
  });
});

studioTopNav.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    setStudioTab(link.dataset.studioNav);
  });
});

document.querySelectorAll("[data-studio-static]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});

const initialTab = document.querySelector("[data-studio-tab].active")?.dataset.studioTab;
setStudioTab(initialTab || "products");

function toLineArray(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toCsvArray(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseFaqLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [question = "", answer = ""] = line.split("||").map((item) => item.trim());
      return { question, answer };
    })
    .filter((item) => item.question && item.answer);
}

function serializeLineArray(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function serializeFaqLines(value) {
  if (!Array.isArray(value)) return "";

  return value
    .map((item) => {
      const question = Array.isArray(item) ? item[0] : item?.question;
      const answer = Array.isArray(item) ? item[1] : item?.answer;
      return question && answer ? `${question} || ${answer}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function createEmptyProductDraft() {
  return {
    slug: "",
    status: "draft",
    featured: false,
    featuredOrder: "",
    sortOrder: 999,
    name: "",
    nameZh: "",
    category: "Marble Sinks",
    categoryZh: "",
    filters: ["sinks"],
    image: "",
    gallery: [],
    badge: "",
    badgeZh: "",
    summary: "",
    summaryZh: "",
    desc: "",
    descZh: "",
    material: "",
    materialZh: "",
    usage: "",
    usageZh: "",
    finish: "",
    finishZh: "",
    moq: "",
    moqZh: "",
    leadTime: "",
    leadTimeZh: "",
    intro: "",
    introZh: "",
    options: [],
    optionsZh: [],
    faqs: []
  };
}

function createEmptyPostDraft() {
  return {
    slug: "",
    status: "draft",
    featured: false,
    featuredOrder: "",
    sortOrder: 999,
    title: "",
    titleZh: "",
    category: "Stone Guide",
    categoryZh: "",
    tags: [],
    tagsZh: [],
    coverImage: "",
    coverAlt: "",
    coverAltZh: "",
    excerpt: "",
    excerptZh: "",
    body: "",
    bodyZh: "",
    faqs: [],
    seo: {
      title: "",
      description: "",
      keywords: ""
    },
    relatedProducts: [],
    relatedPosts: [],
    author: "Win-Win Stone"
  };
}

function createEmptyMediaDraft() {
  return {
    id: "",
    status: "draft",
    sortOrder: 999,
    name: "",
    filePath: "",
    alt: "",
    altZh: "",
    category: "Product Images",
    tags: [],
    relatedProducts: [],
    relatedPosts: [],
    notes: ""
  };
}

function populateProductForm(form, product) {
  if (!form || !product) return;

  const values = {
    title: product.name || "",
    titleZh: product.nameZh || "",
    category: product.category || "Marble Sinks",
    categoryZh: product.categoryZh || "",
    material: product.material || "",
    materialZh: product.materialZh || "",
    filters: (product.filters || []).join(", "),
    image: product.image || "",
    slug: product.slug || "",
    status: product.status || "draft",
    sortOrder: product.sortOrder ?? 999,
    featuredOrder: product.featuredOrder ?? "",
    summary: product.summary || "",
    summaryZh: product.summaryZh || "",
    badge: product.badge || "",
    badgeZh: product.badgeZh || "",
    desc: product.desc || "",
    descZh: product.descZh || "",
    intro: product.intro || "",
    introZh: product.introZh || "",
    usage: product.usage || "",
    usageZh: product.usageZh || "",
    finish: product.finish || "",
    finishZh: product.finishZh || "",
    moq: product.moq || "",
    moqZh: product.moqZh || "",
    leadTime: product.leadTime || "",
    leadTimeZh: product.leadTimeZh || "",
    gallery: serializeLineArray(product.gallery),
    options: serializeLineArray(product.options),
    optionsZh: serializeLineArray(product.optionsZh),
    faqs: serializeFaqLines(product.faqs)
  };

  Object.entries(values).forEach(([name, value]) => {
    const field = form.elements[name];
    if (!field) return;
    field.value = value;
  });

  if (form.elements.featured) {
    form.elements.featured.checked = Boolean(product.featured);
  }

  form.dispatchEvent(new Event("input", { bubbles: true }));
}

function populatePostForm(form, post) {
  if (!form || !post) return;

  const values = {
    title: post.title || "",
    titleZh: post.titleZh || "",
    category: post.category || "Stone Guide",
    categoryZh: post.categoryZh || "",
    author: post.author || "Win-Win Stone",
    status: post.status || "draft",
    sortOrder: post.sortOrder ?? 999,
    featuredOrder: post.featuredOrder ?? "",
    coverImage: post.coverImage || "",
    coverAlt: post.coverAlt || "",
    coverAltZh: post.coverAltZh || "",
    slug: post.slug || "",
    excerpt: post.excerpt || "",
    excerptZh: post.excerptZh || "",
    tags: (post.tags || []).join(", "),
    tagsZh: (post.tagsZh || []).join(", "),
    body: post.body || "",
    bodyZh: post.bodyZh || "",
    seoTitle: post.seo?.title || "",
    seoDescription: post.seo?.description || "",
    seoKeywords: post.seo?.keywords || "",
    relatedProducts: serializeLineArray(post.relatedProducts),
    relatedPosts: serializeLineArray(post.relatedPosts),
    faqs: serializeFaqLines(post.faqs)
  };

  Object.entries(values).forEach(([name, value]) => {
    const field = form.elements[name];
    if (!field) return;
    field.value = value;
  });

  if (form.elements.featured) {
    form.elements.featured.checked = Boolean(post.featured);
  }

  form.dispatchEvent(new Event("input", { bubbles: true }));
}

function populateMediaForm(form, media) {
  if (!form || !media) return;

  const values = {
    name: media.name || "",
    id: media.id || "",
    status: media.status || "draft",
    sortOrder: media.sortOrder ?? 999,
    filePath: media.filePath || "",
    alt: media.alt || "",
    altZh: media.altZh || "",
    category: media.category || "Product Images",
    tags: (media.tags || []).join(", "),
    relatedProducts: serializeLineArray(media.relatedProducts),
    relatedPosts: serializeLineArray(media.relatedPosts),
    notes: media.notes || ""
  };

  Object.entries(values).forEach(([name, value]) => {
    const field = form.elements[name];
    if (!field) return;
    field.value = value;
  });

  form.dispatchEvent(new Event("input", { bubbles: true }));
}

function formatProductOptionLabel(product) {
  const title = product.nameZh || product.name || product.slug;
  const status = product.status === "draft" ? "Draft" : "Published";
  return `${title} (${status})`;
}

function upsertProductLibraryOption(product) {
  if (!productLibrary || !product?.slug) return;

  let option = productLibrary.querySelector(`option[value="${product.slug}"]`);

  if (!option) {
    option = document.createElement("option");
    option.value = product.slug;
    productLibrary.append(option);
  }

  option.textContent = formatProductOptionLabel(product);
}

function formatPostOptionLabel(post) {
  const title = post.titleZh || post.title || post.slug;
  const status = post.status === "draft" ? "Draft" : "Published";
  return `${title} (${status})`;
}

function upsertPostLibraryOption(post) {
  if (!postLibrary || !post?.slug) return;

  let option = postLibrary.querySelector(`option[value="${post.slug}"]`);

  if (!option) {
    option = document.createElement("option");
    option.value = post.slug;
    postLibrary.append(option);
  }

  option.textContent = formatPostOptionLabel(post);
}

function formatMediaOptionLabel(media) {
  const title = media.name || media.id;
  const status = media.status === "draft" ? "草稿" : "已发布";
  return `${title} (${status})`;
}

function upsertMediaLibraryOption(media) {
  if (!mediaLibrary || !media?.id) return;

  let option = mediaLibrary.querySelector(`option[value="${media.id}"]`);

  if (!option) {
    option = document.createElement("option");
    option.value = media.id;
    mediaLibrary.append(option);
  }

  option.textContent = formatMediaOptionLabel(media);
}

async function fetchProducts() {
  const response = await fetch(`${CONTENT_API_BASE}/products`);

  if (!response.ok) {
    throw new Error(`鍔犺浇浜у搧澶辫触: ${response.status}`);
  }

  return response.json();
}

async function fetchProductBySlug(slug) {
  const response = await fetch(`${CONTENT_API_BASE}/products/${encodeURIComponent(slug)}`);

  if (!response.ok) {
    throw new Error(`璇诲彇浜у搧澶辫触: ${response.status}`);
  }

  return response.json();
}

async function fetchPosts() {
  const response = await fetch(`${CONTENT_API_BASE}/posts`);

  if (!response.ok) {
    throw new Error(`鍔犺浇鏂囩珷澶辫触: ${response.status}`);
  }

  return response.json();
}

async function fetchPostBySlug(slug) {
  const response = await fetch(`${CONTENT_API_BASE}/posts/${encodeURIComponent(slug)}`);

  if (!response.ok) {
    throw new Error(`璇诲彇鏂囩珷澶辫触: ${response.status}`);
  }

  return response.json();
}

async function fetchMedia() {
  const response = await fetch(`${CONTENT_API_BASE}/media`);

  if (!response.ok) {
    throw new Error(`閸旂姾娴囩槐鐘虫綏婢惰精瑙? ${response.status}`);
  }

  return response.json();
}

async function fetchMediaById(id) {
  const response = await fetch(`${CONTENT_API_BASE}/media/${encodeURIComponent(id)}`);

  if (!response.ok) {
    throw new Error(`鐠囪褰囩槐鐘虫綏婢惰精瑙? ${response.status}`);
  }

  return response.json();
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeStatusCopy(mode) {
  return mode === "draft"
    ? { label: "草稿已保存", feed: "内容草稿已保存到内容库" }
    : { label: "已发布", feed: "内容已发布到内容库" };
}

function buildProductPayload(form, mode) {
  const title = form.elements.title?.value?.trim() || "";
  const titleZh = form.elements.titleZh?.value?.trim() || "";
  const category = form.elements.category?.value?.trim() || "";
  const categoryZh = form.elements.categoryZh?.value?.trim() || "";
  const material = form.elements.material?.value?.trim() || "";
  const materialZh = form.elements.materialZh?.value?.trim() || "";
  const image = form.elements.image?.value?.trim() || "";
  const slug = form.elements.slug?.value?.trim() || "";
  const summary = form.elements.summary?.value?.trim() || "";
  const summaryZh = form.elements.summaryZh?.value?.trim() || "";
  const badge = form.elements.badge?.value?.trim() || category;
  const badgeZh = form.elements.badgeZh?.value?.trim() || categoryZh;
  const desc = form.elements.desc?.value?.trim() || summary;
  const descZh = form.elements.descZh?.value?.trim() || summaryZh;
  const intro = form.elements.intro?.value?.trim() || desc;
  const introZh = form.elements.introZh?.value?.trim() || descZh;
  const usage = form.elements.usage?.value?.trim() || "";
  const usageZh = form.elements.usageZh?.value?.trim() || "";
  const finish = form.elements.finish?.value?.trim() || "";
  const finishZh = form.elements.finishZh?.value?.trim() || "";
  const moq = form.elements.moq?.value?.trim() || "";
  const moqZh = form.elements.moqZh?.value?.trim() || "";
  const leadTime = form.elements.leadTime?.value?.trim() || "";
  const leadTimeZh = form.elements.leadTimeZh?.value?.trim() || "";
  const filters = toCsvArray(form.elements.filters?.value || "");
  const gallery = toLineArray(form.elements.gallery?.value || "");
  const options = toLineArray(form.elements.options?.value || "");
  const optionsZh = toLineArray(form.elements.optionsZh?.value || "");
  const faqs = parseFaqLines(form.elements.faqs?.value || "");
  const status = mode === "draft" ? "draft" : "published";

  return {
    slug,
    status,
    featured: Boolean(form.elements.featured?.checked),
    featuredOrder: form.elements.featured?.checked ? toNumber(form.elements.featuredOrder?.value, 999) : null,
    sortOrder: toNumber(form.elements.sortOrder?.value, 999),
    name: title,
    nameZh: titleZh,
    category,
    categoryZh,
    filters,
    image,
    gallery: gallery.length ? gallery : [image].filter(Boolean),
    badge,
    badgeZh,
    summary,
    summaryZh,
    desc,
    descZh,
    seo: {
      title,
      description: summary || desc,
      keywords: `${slug.replaceAll("-", " ")}, ${category}`.trim()
    },
    material,
    materialZh,
    usage,
    usageZh,
    finish,
    finishZh,
    moq,
    moqZh,
    leadTime,
    leadTimeZh,
    intro,
    introZh,
    options,
    optionsZh,
    faqs
  };
}

function buildPostPayload(form, mode) {
  const title = form.elements.title?.value?.trim() || "";
  const titleZh = form.elements.titleZh?.value?.trim() || "";
  const category = form.elements.category?.value?.trim() || "";
  const categoryZh = form.elements.categoryZh?.value?.trim() || "";
  const slug = form.elements.slug?.value?.trim() || "";
  const excerpt = form.elements.excerpt?.value?.trim() || "";
  const excerptZh = form.elements.excerptZh?.value?.trim() || "";
  const body = form.elements.body?.value?.trim() || "";
  const bodyZh = form.elements.bodyZh?.value?.trim() || "";
  const status = mode === "draft" ? "draft" : "published";

  return {
    slug,
    status,
    featured: Boolean(form.elements.featured?.checked),
    featuredOrder: form.elements.featured?.checked ? toNumber(form.elements.featuredOrder?.value, 999) : null,
    sortOrder: toNumber(form.elements.sortOrder?.value, 999),
    title,
    titleZh,
    category,
    categoryZh,
    tags: toCsvArray(form.elements.tags?.value || ""),
    tagsZh: toCsvArray(form.elements.tagsZh?.value || ""),
    coverImage: form.elements.coverImage?.value?.trim() || "",
    coverAlt: form.elements.coverAlt?.value?.trim() || "",
    coverAltZh: form.elements.coverAltZh?.value?.trim() || "",
    excerpt,
    excerptZh,
    body,
    bodyZh,
    faqs: parseFaqLines(form.elements.faqs?.value || ""),
    seo: {
      title: form.elements.seoTitle?.value?.trim() || title,
      description: form.elements.seoDescription?.value?.trim() || excerpt,
      keywords: form.elements.seoKeywords?.value?.trim() || ""
    },
    relatedProducts: toLineArray(form.elements.relatedProducts?.value || ""),
    relatedPosts: toLineArray(form.elements.relatedPosts?.value || ""),
    author: form.elements.author?.value?.trim() || "Win-Win Stone",
    publishedAt: new Date().toISOString()
  };
}

function buildMediaPayload(form, mode) {
  return {
    id: form.elements.id?.value?.trim() || "",
    status: mode === "draft" ? "draft" : "published",
    sortOrder: toNumber(form.elements.sortOrder?.value, 999),
    name: form.elements.name?.value?.trim() || "",
    filePath: form.elements.filePath?.value?.trim() || "",
    alt: form.elements.alt?.value?.trim() || "",
    altZh: form.elements.altZh?.value?.trim() || "",
    category: form.elements.category?.value?.trim() || "",
    tags: toCsvArray(form.elements.tags?.value || ""),
    relatedProducts: toLineArray(form.elements.relatedProducts?.value || ""),
    relatedPosts: toLineArray(form.elements.relatedPosts?.value || ""),
    notes: form.elements.notes?.value?.trim() || ""
  };
}

async function submitProduct(form, mode) {
  const payload = buildProductPayload(form, mode);
  const headers = {
    "Content-Type": "application/json"
  };

  if (CONTENT_API_TOKEN) {
    headers.Authorization = `Bearer ${CONTENT_API_TOKEN}`;
  }

  const response = await fetch(`${CONTENT_API_BASE}/products/upsert`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to save content: ${response.status}`);
  }

  return response.json();
}

async function submitPost(form, mode) {
  const payload = buildPostPayload(form, mode);
  const headers = {
    "Content-Type": "application/json"
  };

  if (CONTENT_API_TOKEN) {
    headers.Authorization = `Bearer ${CONTENT_API_TOKEN}`;
  }

  const response = await fetch(`${CONTENT_API_BASE}/posts/upsert`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`鍐呭淇濆瓨澶辫触: ${response.status}`);
  }

  return response.json();
}

async function submitMedia(form, mode) {
  const payload = buildMediaPayload(form, mode);
  const headers = {
    "Content-Type": "application/json"
  };

  if (CONTENT_API_TOKEN) {
    headers.Authorization = `Bearer ${CONTENT_API_TOKEN}`;
  }

  const response = await fetch(`${CONTENT_API_BASE}/media/upsert`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`閸愬懎顔愭穱婵嗙摠婢惰精瑙? ${response.status}`);
  }

  return response.json();
}

async function initializeProductLibrary(form, status) {
  if (!form || !productLibrary) return;

  try {
    const products = await fetchProducts();

    products.forEach((product) => {
      upsertProductLibraryOption(product);
    });

    const currentSlug = form.elements.slug?.value?.trim();
    if (currentSlug) {
      productLibrary.value = currentSlug;
    }
  } catch (error) {
    if (status) {
      status.textContent = error instanceof Error ? error.message : "浜у搧鍒楄〃鍔犺浇澶辫触";
      status.classList.remove("is-live");
    }
  }

  productLibrary.addEventListener("change", async () => {
    const slug = productLibrary.value;

    if (!slug) return;

    try {
      const product = await fetchProductBySlug(slug);
      populateProductForm(form, product);

      if (status) {
        status.textContent = product.status === "draft" ? "Draft" : "Published";
        status.classList.toggle("is-live", product.status === "published");
      }
    } catch (error) {
      if (status) {
        status.textContent = error instanceof Error ? error.message : "璇诲彇浜у搧澶辫触";
        status.classList.remove("is-live");
      }
    }
  });

  newProductButton?.addEventListener("click", () => {
    populateProductForm(form, createEmptyProductDraft());

    if (productLibrary) {
      productLibrary.value = "";
    }

    if (status) {
      status.textContent = "New Draft";
      status.classList.remove("is-live");
    }
  });
}

async function initializePostLibrary(form, status) {
  if (!form || !postLibrary) return;

  try {
    const posts = await fetchPosts();

    posts.forEach((post) => {
      upsertPostLibraryOption(post);
    });

    const currentSlug = form.elements.slug?.value?.trim();
    if (currentSlug) {
      postLibrary.value = currentSlug;
    }
  } catch (error) {
    if (status) {
      status.textContent = error instanceof Error ? error.message : "鏂囩珷鍒楄〃鍔犺浇澶辫触";
      status.classList.remove("is-live");
    }
  }

  postLibrary.addEventListener("change", async () => {
    const slug = postLibrary.value;

    if (!slug) return;

    try {
      const post = await fetchPostBySlug(slug);
      populatePostForm(form, post);

      if (status) {
        status.textContent = post.status === "draft" ? "Draft" : "Published";
        status.classList.toggle("is-live", post.status === "published");
      }
    } catch (error) {
      if (status) {
        status.textContent = error instanceof Error ? error.message : "璇诲彇鏂囩珷澶辫触";
        status.classList.remove("is-live");
      }
    }
  });

  newPostButton?.addEventListener("click", () => {
    populatePostForm(form, createEmptyPostDraft());

    if (postLibrary) {
      postLibrary.value = "";
    }

    if (status) {
      status.textContent = "New Draft";
      status.classList.remove("is-live");
    }
  });
}

async function initializeMediaLibrary(form, status) {
  if (!form || !mediaLibrary) return;

  try {
    const mediaItems = await fetchMedia();

    mediaItems.forEach((media) => {
      upsertMediaLibraryOption(media);
    });

    const currentId = form.elements.id?.value?.trim();
    if (currentId) {
      mediaLibrary.value = currentId;
    }
  } catch (error) {
    if (status) {
      status.textContent = error instanceof Error ? error.message : "Failed to load media library";
      status.classList.remove("is-live");
    }
  }

  mediaLibrary.addEventListener("change", async () => {
    const id = mediaLibrary.value;

    if (!id) return;

    try {
      const media = await fetchMediaById(id);
      populateMediaForm(form, media);

      if (status) {
        status.textContent = media.status === "draft" ? "Draft" : "Published";
        status.classList.toggle("is-live", media.status === "published");
      }
    } catch (error) {
      if (status) {
        status.textContent = error instanceof Error ? error.message : "Failed to load media item";
        status.classList.remove("is-live");
      }
    }
  });

  newMediaButton?.addEventListener("click", () => {
    populateMediaForm(form, createEmptyMediaDraft());

    if (mediaLibrary) {
      mediaLibrary.value = "";
    }

    if (status) {
      status.textContent = "閺傛媽宕忕粙?";
      status.classList.remove("is-live");
    }
  });
}

document.querySelectorAll("[data-preview-form]").forEach((form) => {
  const scope = form.closest("[data-studio-panel]") || document;
  const previewTitle = scope.querySelector("[data-preview-title]");
  const previewMeta = scope.querySelector("[data-preview-meta]");
  const previewText = scope.querySelector("[data-preview-text]");
  const previewImage = scope.querySelector("[data-preview-image]");
  const status = scope.querySelector("[data-preview-status]");
  const feed = document.querySelector("[data-studio-feed]");

  function updatePreview() {
    const title =
      form.elements.title?.value ||
      form.elements.name?.value ||
      form.dataset.fallbackTitle ||
      "Untitled Draft";
    const category = form.elements.category?.value || "Draft";
    const material =
      form.elements.material?.value ||
      form.elements.author?.value ||
      form.elements.id?.value ||
      "Editor";
    const summary =
      form.elements.summary?.value ||
      form.elements.excerpt?.value ||
      form.elements.notes?.value ||
      form.elements.alt?.value ||
      form.dataset.fallbackSummary ||
      "Add a short summary for the preview card.";
    const image =
      form.elements.image?.value ||
      form.elements.coverImage?.value ||
      form.elements.filePath?.value;

    if (previewTitle) previewTitle.textContent = title;
    if (previewMeta) previewMeta.textContent = `${category} / ${material}`;
    if (previewText) previewText.textContent = summary;
    if (previewImage && image) previewImage.src = image;
  }

  form.addEventListener("input", updatePreview);
  updatePreview();

  if (form.hasAttribute("data-product-form")) {
    initializeProductLibrary(form, status);
  }

  if (form.hasAttribute("data-post-form")) {
    initializePostLibrary(form, status);
  }

  if (form.hasAttribute("data-media-form")) {
    initializeMediaLibrary(form, status);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitter = event.submitter;
    const mode = submitter?.dataset.submitMode || "published";
    const copy = normalizeStatusCopy(mode);

    if (
      !form.hasAttribute("data-product-form") &&
      !form.hasAttribute("data-post-form") &&
      !form.hasAttribute("data-media-form")
    ) {
      if (status) {
        status.textContent = "Published";
        status.classList.add("is-live");
      }

      if (feed) {
        const item = document.createElement("li");
        const title = form.elements.title?.value || form.elements.name?.value || form.dataset.fallbackTitle || "Untitled Draft";
        item.innerHTML = `<strong>${title}</strong><span>宸蹭粠鍚庡彴棰勮鍙戝竷</span>`;
        feed.prepend(item);
      }
      return;
    }

    submitter?.setAttribute("disabled", "disabled");

    try {
      const result = form.hasAttribute("data-post-form")
        ? await submitPost(form, mode)
        : form.hasAttribute("data-media-form")
          ? await submitMedia(form, mode)
          : await submitProduct(form, mode);
      if (form.elements.status) {
        form.elements.status.value = mode === "draft" ? "draft" : "published";
      }

      if (result?.product) {
        upsertProductLibraryOption(result.product);
        if (productLibrary) {
          productLibrary.value = result.product.slug;
        }
      }

      if (result?.post) {
        upsertPostLibraryOption(result.post);
        if (postLibrary) {
          postLibrary.value = result.post.slug;
        }
      }

      if (result?.media) {
        upsertMediaLibraryOption(result.media);
        if (mediaLibrary) {
          mediaLibrary.value = result.media.id;
        }
      }

      if (status) {
        status.textContent = copy.label;
        status.classList.toggle("is-live", mode === "published");
      }

      if (feed) {
        const item = document.createElement("li");
        const title = form.elements.title?.value || form.elements.name?.value || form.dataset.fallbackTitle || "Untitled Draft";
        item.innerHTML = `<strong>${title}</strong><span>${copy.feed}</span>`;
        feed.prepend(item);
      }
    } catch (error) {
      if (status) {
        status.textContent = error instanceof Error ? error.message : "淇濆瓨澶辫触";
        status.classList.remove("is-live");
      }
    } finally {
      submitter?.removeAttribute("disabled");
    }
  });
});

