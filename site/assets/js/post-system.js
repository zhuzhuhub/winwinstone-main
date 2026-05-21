const POST_CONTENT_API_BASE = window.CONTENT_API_BASE || "http://127.0.0.1:8787";
const postParams = new URLSearchParams(window.location.search);
const postSlug = postParams.get("slug");

function setPostText(id, value) {
  const element = document.getElementById(id);
  if (element && value !== undefined) {
    element.textContent = value;
  }
}

function setPostHtml(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.innerHTML = value || "";
  }
}

function setPostAttr(id, attr, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element.setAttribute(attr, value);
  }
}

function formatPostSystemDate(value, language) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

async function loadPostsForDetail() {
  try {
    const response = await fetch(`${POST_CONTENT_API_BASE}/posts?status=published`);
    if (!response.ok) throw new Error("Failed to load posts");
    return await response.json();
  } catch (error) {
    if (typeof POSTS !== "undefined" && Array.isArray(POSTS)) {
      return POSTS;
    }
    return [];
  }
}

async function loadProductsForDetail() {
  try {
    const response = await fetch(`${POST_CONTENT_API_BASE}/products?status=published`);
    if (!response.ok) throw new Error("Failed to load products");
    return await response.json();
  } catch (error) {
    if (typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)) {
      return PRODUCTS;
    }
    return [];
  }
}

function renderPostDetail(post, products, posts, language) {
  const title = language === "zh" ? post.titleZh || post.title : post.title;
  const category = language === "zh" ? post.categoryZh || post.category : post.category;
  const excerpt = language === "zh" ? post.excerptZh || post.excerpt : post.excerpt;
  const body = language === "zh" ? post.bodyZh || post.body : post.body;
  const coverAlt = language === "zh" ? post.coverAltZh || post.coverAlt : post.coverAlt;

  document.title = post.seo?.title || title;
  setPostText("seo-title", post.seo?.title || title);
  setPostAttr("seo-description", "content", post.seo?.description || excerpt);
  setPostAttr("seo-og-title", "content", post.seo?.title || title);
  setPostAttr("seo-og-description", "content", post.seo?.description || excerpt);
  setPostAttr("seo-og-image", "content", post.coverImage);

  setPostText("post-category", category);
  setPostText("post-title", title);
  setPostText("post-excerpt", excerpt);
  setPostText("post-author", post.author || "Win-Win Stone");
  setPostText("post-date", formatPostSystemDate(post.publishedAt || post.updatedAt, language));
  setPostAttr("post-cover", "src", post.coverImage);
  setPostAttr("post-cover", "alt", coverAlt || title);
  setPostHtml("post-body", body);

  const faqHtml = (post.faqs || [])
    .map((entry) => {
      const question = Array.isArray(entry) ? entry[0] : entry?.question;
      const answer = Array.isArray(entry) ? entry[1] : entry?.answer;
      return question && answer ? `<article><h3>${question}</h3><p>${answer}</p></article>` : "";
    })
    .join("");
  setPostHtml("post-faq", faqHtml);

  const relatedProducts = products.filter((product) => (post.relatedProducts || []).includes(product.slug));
  setPostHtml(
    "post-related-products",
    relatedProducts.length
      ? relatedProducts
          .map((product) => {
            const productTitle = language === "zh" ? product.nameZh || product.name : product.name;
            return `<p><a href="products/${product.slug}/">${productTitle}</a></p>`;
          })
          .join("")
      : `<p>${language === "zh" ? "暂无关联产品" : "No related products yet."}</p>`
  );

  const relatedPosts = posts.filter((entry) => (post.relatedPosts || []).includes(entry.slug));
  setPostHtml(
    "post-related-posts",
    relatedPosts.length
      ? relatedPosts
          .map((entry) => {
            const entryTitle = language === "zh" ? entry.titleZh || entry.title : entry.title;
            return `<p><a href="blog/${entry.slug}/">${entryTitle}</a></p>`;
          })
          .join("")
      : `<p>${language === "zh" ? "暂无关联文章" : "No related articles yet."}</p>`
  );
}

function renderPostNotFound(language) {
  setPostText("post-title", language === "zh" ? "文章未找到" : "Article Not Found");
  setPostText(
    "post-excerpt",
    language === "zh"
      ? "这个文章链接可能已经变更，请返回博客列表查看其他内容。"
      : "This article link may be outdated. Please return to the journal to browse other posts."
  );
  setPostHtml("post-body", "");
  setPostHtml("post-faq", "");
  setPostHtml("post-related-products", "");
  setPostHtml("post-related-posts", "");
}

async function initPostPage() {
  const language = localStorage.getItem("siteLanguage") === "zh" ? "zh" : "en";
  const [posts, products] = await Promise.all([loadPostsForDetail(), loadProductsForDetail()]);
  const currentPost = posts.find((entry) => entry.slug === postSlug) || posts[0];

  if (!currentPost) {
    renderPostNotFound(language);
    return;
  }

  renderPostDetail(currentPost, products, posts, language);
}

document.querySelector("[data-language-toggle]")?.addEventListener("click", () => {
  setTimeout(() => {
    initPostPage();
  }, 0);
});

initPostPage();
