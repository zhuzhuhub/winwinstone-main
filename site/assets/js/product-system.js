const PRODUCT_CONTENT_API_BASE = window.CONTENT_API_BASE || "http://127.0.0.1:8787";
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value) element.textContent = value;
}

function setTextForAll(field, value) {
  if (!value) return;

  document.querySelectorAll(`[data-product-field="${field}"]`).forEach((element) => {
    element.textContent = value;
  });
}

function setAttribute(id, attribute, value) {
  const element = document.getElementById(id);
  if (element && value) element.setAttribute(attribute, value);
}

function setMailLink(id, subject, productName) {
  const element = document.getElementById(id);
  if (!element) return;

  const mail = new URL("mailto:stone2lisa@outlook.com");
  mail.searchParams.set("subject", subject);
  mail.searchParams.set(
    "body",
    [
      `Product: ${productName}`,
      "",
      "Please share your size, quantity, material preference, finish, delivery country, and reference photo or drawing."
    ].join("\n")
  );
  element.href = mail.toString();
}

function setWhatsAppLink(id, productName) {
  const element = document.getElementById(id);
  if (!element) return;

  const message = encodeURIComponent(`Hello, I want a quote for ${productName}. I can send size, quantity, material idea, or reference photo.`);
  element.href = `https://wa.me/13927192948?text=${message}`;
}

function renderUsageGrid(id, usage) {
  const element = document.getElementById(id);
  if (!element) return;

  const usageItems = (usage || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  element.innerHTML = usageItems
    .map((item) => `<article>${item}</article>`)
    .join("");
}

function renderProductSchema(currentProduct, galleryImages) {
  const schema = document.getElementById("product-schema");
  if (!schema) return;

  schema.textContent = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: currentProduct.name,
      description: currentProduct.seo.description,
      category: currentProduct.category,
      sku: currentProduct.slug,
      image: galleryImages.map((src) => new URL(src, window.location.href).href),
      url: window.location.href,
      brand: {
        "@type": "Brand",
        name: "Win-Win Stone"
      },
      manufacturer: {
        "@type": "Organization",
        name: "Win-Win Stone",
        url: new URL("index.html", window.location.href).href,
        email: "mailto:stone2lisa@outlook.com"
      },
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Material",
          value: currentProduct.material
        },
        {
          "@type": "PropertyValue",
          name: "Finish",
          value: currentProduct.finish
        },
        {
          "@type": "PropertyValue",
          name: "MOQ",
          value: currentProduct.moq
        },
        {
          "@type": "PropertyValue",
          name: "Lead Time",
          value: currentProduct.leadTime
        }
      ]
    },
    null,
    2
  );
}

function renderProduct(currentProduct) {
  const galleryImages = currentProduct.gallery?.length ? currentProduct.gallery : [currentProduct.image];
  const productReference = (currentProduct.badge || currentProduct.category || "custom stone product").toLowerCase();

  document.title = currentProduct.seo.title;
  setText("seo-title", currentProduct.seo.title);
  setAttribute("seo-description", "content", currentProduct.seo.description);
  setAttribute("seo-keywords", "content", currentProduct.seo.keywords);
  setAttribute("seo-og-title", "content", currentProduct.seo.title);
  setAttribute("seo-og-description", "content", currentProduct.seo.description);
  setAttribute("seo-og-image", "content", galleryImages[0]);

  setText("product-badge", currentProduct.badge);
  setText("product-title", currentProduct.name);
  setText("product-desc", currentProduct.desc);
  setText("product-intro", currentProduct.intro);
  setText("product-material", currentProduct.material);
  setText("product-usage", currentProduct.usage);
  setText("product-finish", currentProduct.finish);
  setText("product-moq", currentProduct.moq);
  setText("product-lead-time", currentProduct.leadTime);
  setTextForAll("material", currentProduct.material);
  setTextForAll("finish", currentProduct.finish);
  setTextForAll("moq", currentProduct.moq);
  setTextForAll("leadTime", currentProduct.leadTime);
  renderUsageGrid("product-usage-grid-hero", currentProduct.usage);
  renderUsageGrid("product-usage-grid", currentProduct.usage);
  setText("product-action-note", `Send your target size, quantity, finish, and reference photo or drawing for this ${productReference} quote review.`);
  setText("product-cta-copy", `We will review your ${productReference} requirement, confirm the production direction, and reply with the next step for quotation.`);

  const image = document.getElementById("product-image");
  if (image) {
    image.src = galleryImages[0];
    image.alt = currentProduct.name;
  }

  const gallery = document.getElementById("product-gallery");
  if (gallery) {
    gallery.innerHTML = galleryImages
      .map((src, index) => `
        <button class="product-gallery-thumb${index === 0 ? " is-active" : ""}" type="button" data-gallery-image="${src}" aria-label="View ${currentProduct.name} image ${index + 1}">
          <img src="${src}" alt="${currentProduct.name} view ${index + 1}">
        </button>
      `)
      .join("");

    gallery.querySelectorAll("[data-gallery-image]").forEach((button) => {
      button.addEventListener("click", () => {
        if (image) {
          image.src = button.dataset.galleryImage;
          image.alt = button.querySelector("img")?.alt || currentProduct.name;
        }

        gallery.querySelectorAll("[data-gallery-image]").forEach((item) => {
          item.classList.toggle("is-active", item === button);
        });
      });
    });
  }

  const optionList = document.getElementById("product-options");
  if (optionList) {
    optionList.innerHTML = currentProduct.options.map((option) => `<li>${option}</li>`).join("");
  }

  const faqList = document.getElementById("product-faq");
  if (faqList) {
    faqList.innerHTML = currentProduct.faqs
      .map((entry) => {
        const question = Array.isArray(entry) ? entry[0] : entry?.question;
        const answer = Array.isArray(entry) ? entry[1] : entry?.answer;
        return question && answer ? `<article><h3>${question}</h3><p>${answer}</p></article>` : "";
      })
      .join("");
  }

  setMailLink("product-email", `Quote request: ${currentProduct.name}`, currentProduct.name);
  setMailLink("product-cta-email", `Quote request: ${currentProduct.name}`, currentProduct.name);
  setWhatsAppLink("product-whatsapp", currentProduct.name);
  setWhatsAppLink("product-cta-whatsapp", currentProduct.name);
  setWhatsAppLink("floating-whatsapp", currentProduct.name);
  renderProductSchema(currentProduct, galleryImages);
}

function renderProductNotFound() {
  setText("product-title", "Product Not Found");
  setText("product-desc", "The product link may be outdated. Please return to the product catalog and choose another stone product.");

  const intro = document.getElementById("product-intro");
  if (intro) {
    intro.innerHTML = `You can browse all current products from <a href="products.html">the product catalog</a>.`;
  }

  const options = document.getElementById("product-options");
  if (options) {
    options.innerHTML = "<li>Browse the current product catalog or contact us with the closest reference product for support.</li>";
  }

  const faq = document.getElementById("product-faq");
  if (faq) {
    faq.innerHTML = `
      <article>
        <h3>How can I find the right product?</h3>
        <p>Return to the product catalog and choose the closest sink, table, vanity, bathtub, or fireplace piece, then send us your reference and requirements.</p>
      </article>
    `;
  }
}

function renderProductList(products) {
  const list = document.getElementById("product-list");
  if (!list) return;

  list.innerHTML = products.map((item) => `
    <article class="product-card" data-category="${item.category.toLowerCase().replaceAll(" ", "-")}">
      <a class="product-open" href="product.html?slug=${item.slug}">
        <img src="${item.image}" alt="${item.name}">
        <span class="product-body">
          <span class="product-type">${item.category}</span>
          <strong>${item.name}</strong>
          <span>${item.desc}</span>
        </span>
      </a>
    </article>
  `).join("");
}

async function loadProducts() {
  try {
    const response = await fetch(`${PRODUCT_CONTENT_API_BASE}/products?status=published`);

    if (!response.ok) {
      throw new Error("Failed to load products.");
    }

    return await response.json();
  } catch (error) {
    if (typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)) {
      return PRODUCTS;
    }

    return [];
  }
}

async function initProductPage() {
  const products = await loadProducts();
  const defaultSlug = products[0]?.slug;
  const currentSlug = slug || defaultSlug;
  const product = products.find((item) => item.slug === currentSlug || item.aliasSlugs?.includes(currentSlug));

  if (product) {
    renderProduct(product);
  } else {
    renderProductNotFound();
  }

  renderProductList(products);
}

initProductPage();
