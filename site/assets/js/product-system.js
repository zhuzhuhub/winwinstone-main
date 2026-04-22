const params = new URLSearchParams(window.location.search);
const slug = params.get("slug") || PRODUCTS[0]?.slug;
const product = PRODUCTS.find((item) => item.slug === slug);

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value) element.textContent = value;
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

function renderProduct(currentProduct) {
  const galleryImages = currentProduct.gallery?.length ? currentProduct.gallery : [currentProduct.image];

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
      .map(([question, answer]) => `<article><h3>${question}</h3><p>${answer}</p></article>`)
      .join("");
  }

  setMailLink("product-email", `Quote request: ${currentProduct.name}`, currentProduct.name);
  setMailLink("product-cta-email", `Quote request: ${currentProduct.name}`, currentProduct.name);
  setWhatsAppLink("product-whatsapp", currentProduct.name);
  setWhatsAppLink("floating-whatsapp", currentProduct.name);
}

function renderProductNotFound() {
  setText("product-title", "Product Not Found");
  setText("product-desc", "The product link may be outdated. Please return to the product catalog and choose another stone product.");

  const intro = document.getElementById("product-intro");
  if (intro) {
    intro.innerHTML = `You can browse all current products from <a href="products.html">the product catalog</a>.`;
  }
}

function renderProductList() {
  const list = document.getElementById("product-list");
  if (!list) return;

  list.innerHTML = PRODUCTS.map((item) => `
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

if (product) {
  renderProduct(product);
} else {
  renderProductNotFound();
}

renderProductList();
