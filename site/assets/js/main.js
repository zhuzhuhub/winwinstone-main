const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const filterButtons = document.querySelectorAll("[data-filter]");
const productGrid = document.querySelector("[data-product-grid]");
const dialog = document.querySelector("[data-product-dialog]");
const dialogImage = document.querySelector("[data-dialog-image]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogDescription = document.querySelector("[data-dialog-description]");
const dialogClose = document.querySelector("[data-dialog-close]");
const dialogQuote = document.querySelector("[data-dialog-quote]");
const quoteForm = document.querySelector("[data-quote-form]");
const quoteSubmitButton = quoteForm?.querySelector("button[type='submit']");
const quoteFormStatus = document.querySelector("[data-quote-form-status]");
const languageToggle = document.querySelector("[data-language-toggle]");
const languageLabel = document.querySelector("[data-language-label]");
const featuredProductsContainer = document.querySelector("[data-featured-products]");
const featuredPostContainer = document.querySelector("[data-featured-post]");
const articleGrid = document.querySelector("[data-article-grid]");
const CONTENT_API_BASE = window.CONTENT_API_BASE || "http://127.0.0.1:8787";
let activeProductFilter = "all";

function getProductPageUrl(slug) {
  return `products/${encodeURIComponent(slug)}/`;
}

function getPostPageUrl(slug) {
  return `blog/${encodeURIComponent(slug)}/`;
}

const translations = {
  en: {
    metaTitle: "Custom Natural Stone Manufacturer | OEM/ODM Marble Sinks, Tables & Vanities",
    metaDescription: "Factory-direct custom natural stone manufacturer in China. OEM/ODM marble sinks, travertine dining tables, stone vanities, bathtubs and bespoke furniture for brands, wholesalers and designers.",
    switchLabel: "中文",
    switchAria: "Switch to Chinese",
    text: [
      [".skip-link", "Skip to content"],
      [".site-header .brand span", "Win-Win Stone"],
      [".site-footer .brand span", "Win-Win Stone"],
      [".nav-toggle .sr-only", "Open navigation"],
      [".nav-links a:nth-child(1)", "Products"],
      [".nav-links a:nth-child(2)", "Blog"],
      [".nav-links a:nth-child(3)", "OEM/ODM"],
      [".nav-links a:nth-child(4)", "Why Us"],
      [".nav-links a:nth-child(5)", "Contact"],
      [".hero .eyebrow", "Factory-Direct Natural Stone Manufacturer in Yunfu, China"],
      ["#hero-title", "Custom Marble Sinks, Tables, Vanities and Stone Furniture for Brands, Designers, Projects and Private Clients"],
      [".hero-copy", "We help brands, wholesalers, designers, project buyers, and private clients develop custom natural stone products with stable production, flexible customization, and export-ready delivery."],
      [".hero-trust span:nth-child(1)", "15+ Years of Factory Experience"],
      [".hero-trust span:nth-child(2)", "OEM/ODM for Brands and Wholesalers"],
      [".hero-trust span:nth-child(3)", "Custom Sizes, Finishes and Packaging"],
      [".hero-trust span:nth-child(4)", "Global Delivery with Secure Export Packing"],
      [".hero-actions .primary", "Get a Free Quote"],
      [".hero-actions .ghost", "Browse Products"],
      [".hero-bottom span:nth-child(1)", "100% Natural Stone"],
      [".hero-bottom span:nth-child(2)", "Custom Design Support"],
      [".hero-bottom span:nth-child(3)", "Worldwide Shipping"],
      [".intro .eyebrow", "Why Buyers Contact Us"],
      ["#intro-title", "Factory-backed custom stone production for real orders, real projects, and real homes."],
      [".intro-right p:nth-child(1)", "From marble sinks and travertine tables to vanities, bathtubs, and bespoke stone furniture, we turn ideas, drawings, and references into production-ready pieces with practical export support."],
      [".intro-right p:nth-child(2)", "Our work is built around customization, material clarity, repeatable production, and secure packing for international delivery."],
      [".intro-points span:nth-child(1)", "Custom Size and Design"],
      [".intro-points span:nth-child(2)", "Factory-Direct Production"],
      [".intro-points span:nth-child(3)", "Export-Safe Packing"],
      [".intro-points span:nth-child(4)", "Support for Trade and Private Clients"],
      [".products .eyebrow", "Featured Products"],
      ["#products-title", "Stone product directions that can be adapted for your market, project, or home."],
      [".products .section-heading > p:last-child", "Use these featured references as a starting point for custom dimensions, material selection, finish options, and packing requirements."],
      [".filter-button[data-filter='all']", "All"],
      [".filter-button[data-filter='sinks']", "Sinks"],
      [".filter-button[data-filter='tables']", "Tables"],
      [".filter-button[data-filter='bathroom']", "Bathroom"],
      [".video-band .eyebrow", "Production Proof"],
      ["#factory-title", "How custom stone orders move from reference to delivery."],
      [".video-grid p:last-child", "From material sourcing and fabrication to inspection and shipment coordination, we keep the production process clear for brands, projects, and private custom orders."],
      [".service .eyebrow", "OEM / ODM Process"],
      ["#service-title", "A clear production path from reference to delivery."],
      [".why .eyebrow", "Production Strength"],
      ["#why-title", "The production details that help custom stone orders move forward with less uncertainty."],
      [".why-copy p:nth-of-type(2)", "We focus on the practical details that matter most before shipment: drawing confirmation, material review, fabrication control, inspection, and export-safe packing."],
      [".why-copy p:nth-of-type(3)", "Whether the order is for a wholesale line, a design project, or a private home, our goal is to make custom stone production easier to review, approve, and deliver."],
      [".contact .eyebrow", "Contact"],
      ["#contact-title", "Send your drawing, dimensions, stone preference, or product idea."],
      [".contact-grid > div > p:nth-of-type(2)", "Share the closest product reference, target size, quantity, finish preference, and delivery country. We will help you review the material direction and the next production step for your inquiry."],
      [".quote-form label:nth-child(1)", "Your Name"],
      [".quote-form label:nth-child(2)", "Your Email"],
      [".quote-form label:nth-child(3)", "Company / Studio / Project"],
      [".quote-form label:nth-child(4)", "Message"],
      [".quote-form .button", "Send Inquiry"],
      [".quote-response-note", "We typically reply within 24 hours."],
      [".site-footer p", "Factory-backed natural stone manufacturing for OEM/ODM orders, project production, and private custom pieces."],
      [".footer-links a:nth-child(1)", "Products"],
      [".footer-links a:nth-child(2)", "Blog"],
      [".footer-links a:nth-child(3)", "OEM/ODM"],
      [".footer-links a:nth-child(4)", "Why Us"],
      [".footer-links a:nth-child(5)", "Contact"],
      [".audience .eyebrow", "Who We Work With"],
      [".audience-heading h2", "Built for trade buyers, designers, and private clients who need more than a catalog product."],
      [".audience-heading > p:last-child", "We support custom sizing, repeatable production, and material-led development for buyers who need natural stone products aligned to their business, project, or home."],
      [".audience-item:nth-child(1) p", "Stable supply, repeatable specifications, and export-safe packing for distribution and bulk orders."],
      [".audience-item:nth-child(2) p", "Custom development support for private-label collections, sample refinement, and repeatable OEM product lines."],
      [".audience-item:nth-child(3) p", "Material-led production for residential and commercial interiors that require exact dimensions, finishes, and visual consistency."],
      [".audience-item:nth-child(4) p", "Coordinated stone production for villas, hotels, retail interiors, and custom installations."],
      [".audience-item:nth-child(5) strong", "Homeowners / Private Clients"],
      [".audience-item:nth-child(5) p", "Custom sinks, tables, bathtubs, and statement stone pieces for distinctive homes and design-led living spaces."],
      [".latest-products h3", "Featured Products"],
      [".product-categories h3", "Browse by Category"],
      [".dialog-content .eyebrow", "Product Detail"],
      ["[data-dialog-quote]", "Ask for This Product"]
    ],
    process: [
      "Send Your Drawing or Reference",
      "Confirm Product Direction",
      "Approve Material and Finish",
      "Review Quote and Order Terms",
      "Production and Inspection",
      "Secure Packing and Delivery"
    ],
    products: [
      ["Sinks", "Green luxury marble pedestal sink", "Custom size, finish, and export packing for luxury bathroom projects."],
      ["Sinks", "Fluted rectangular white marble pedestal sink", "Adaptable dimensions and ribbed details for residential or hospitality use."],
      ["Sinks", "Hand-crafted vessel sink", "A flexible starting point for private residences and boutique bathroom collections."],
      ["Tables", "Travertine marble dining table", "A strong starting point for custom dining collections and interior projects."],
      ["Tables", "Graceful travertine dining table", "OEM/ODM orders and global delivery."],
      ["Tables", "Simple travertine dining table", "Minimal design, made to measure."],
      ["Bathroom", "Natural marble bathtub", "Statement bathtub direction for villa, hotel, and private home projects."],
      ["Tables", "Red travertine marble dining table", "Designed for living room interiors."],
      ["Sinks", "Calacatta Viola marble pedestal sink", "Dramatic natural marble sink for high-end bathrooms."]
    ],
    proof: [
      ["Drawing Confirmation Before Production", "Dimensions, structure, and visible details are reviewed before fabrication begins."],
      ["Material and Finish Review", "Stone direction, finish expectations, and key visual details are aligned in advance."],
      ["Inspection Before Packing", "Products are checked before final wrapping and export preparation."],
      ["Export-Safe Crating for Overseas Delivery", "Packing is prepared for international handling, protection, and shipment safety."]
    ],
    formStatus: {
      submit: "Send Inquiry",
      sending: "Sending...",
      success: "Thank you. Your inquiry has been sent. We will reply within 24 hours.",
      error: "Something went wrong. Please try again or contact us by email / WhatsApp."
    },
    placeholders: {
      company: "Sink, table, vanity, bathtub, custom project...",
      message: "Size, stone type, quantity, finish, delivery country, reference link or drawing..."
    },
    mail: {
      defaultSubject: "OEM/ODM stone inquiry",
      quotePrefix: "Quote request"
    },
    pages: {
      products: {
        metaTitle: "Custom Stone Product Catalog | Marble Sinks, Tables & Vanities",
        metaDescription: "Browse custom marble sinks, travertine dining tables, stone vanities, bathtubs, fireplace surrounds, and OEM/ODM product references for brands, wholesalers, designers, and project buyers.",
        ogTitle: "Custom Stone Product Catalog | Win-Win Stone",
        ogDescription: "Factory-direct catalog of custom marble sinks, travertine tables, stone vanities, bathtubs, and OEM/ODM product references from Yunfu, China.",
        text: [
          [".page-hero .eyebrow", "Custom Stone Product Catalog"],
          ["#products-hero-title", "Browse custom stone products by category, material, and production direction."],
          [".page-hero-content > p:not(.eyebrow)", "Each product direction can be adjusted by size, finish, structural detail, and export packing requirements."],
          [".page-hero .button.primary", "Browse Catalog"],
          [".page-hero .button.ghost", "Request Factory Quote"],
          [".page-hero-notes span:nth-child(1)", "Factory-direct from Yunfu, China"],
          [".page-hero-notes span:nth-child(2)", "OEM/ODM-ready product references"],
          [".page-hero-notes span:nth-child(3)", "Custom sizes, finishes, and export packing"],
          [".catalog-intro .eyebrow", "Catalog Overview"],
          [".catalog-intro h2", "Three main product directions for custom stone inquiries."],
          [".product-direction-list article:nth-child(1) strong", "Bathroom Stone Products"],
          [".product-direction-list article:nth-child(1) p", "Pedestal sinks, vessel sinks, vanities, bathtubs, and coordinated bathroom pieces for residential, hospitality, and private custom spaces."],
          [".product-direction-list article:nth-child(2) strong", "Stone Furniture"],
          [".product-direction-list article:nth-child(2) p", "Dining tables, coffee tables, side tables, plinths, consoles, and sculptural stone furniture built around exact dimensions."],
          [".product-direction-list article:nth-child(3) strong", "Project Custom"],
          [".product-direction-list article:nth-child(3) p", "Hotel, villa, retail, and designer project pieces produced from drawings, references, or sample direction."],
          [".buyer-fit .eyebrow", "Who Commonly Uses This Catalog"],
          ["#buyer-fit-title", "Built for buyers who need faster product direction before quoting."],
          [".buyer-fit-card:nth-child(1) strong", "Wholesalers"],
          [".buyer-fit-card:nth-child(1) p", "Review repeatable formats, material directions, and export packing before placing seasonal or bulk orders."],
          [".buyer-fit-card:nth-child(2) strong", "Interior Brands"],
          [".buyer-fit-card:nth-child(2) p", "Use the catalog as a starting point for private-label collections, sample refinement, and repeatable OEM product lines."],
          [".buyer-fit-card:nth-child(3) strong", "Designers"],
          [".buyer-fit-card:nth-child(3) p", "Shortlist forms, finishes, and stone types before confirming fabrication details for client spaces."],
          [".buyer-fit-card:nth-child(4) strong", "Project Buyers"],
          [".buyer-fit-card:nth-child(4) p", "Identify bathroom, furniture, and decorative stone references that can be adapted for villas, hospitality, or retail spaces."],
          [".buyer-fit-card:nth-child(5) strong", "Homeowners / Private Clients"],
          [".buyer-fit-card:nth-child(5) p", "Use the catalog to shortlist sinks, tables, bathtubs, and custom stone pieces for distinctive homes and personal interior projects."],
          [".product-catalog .eyebrow", "Browse Products"],
          ["#catalog-title", "Category-led references for custom inquiries."],
          [".product-catalog .section-heading > p:last-child", "Use the filters to narrow by sink, table, bathroom, or project direction, then send the closest reference for dimensions, material options, and quotation."],
          [".filter-button[data-filter='all']", "All"],
          [".filter-button[data-filter='sinks']", "Sinks"],
          [".filter-button[data-filter='tables']", "Tables"],
          [".filter-button[data-filter='bathroom']", "Bathroom"],
          [".filter-button[data-filter='project']", "Project"],
          [".material-section .eyebrow", "Before Inquiry"],
          ["#material-title", "What buyers usually confirm before production starts."],
          [".spec-list div:nth-child(1) span", "Material"],
          [".spec-list div:nth-child(1) strong", "Marble, travertine, quartzite, onyx, limestone, and other available natural stone options"],
          [".spec-list div:nth-child(2) span", "Finish"],
          [".spec-list div:nth-child(2) strong", "Polished, honed, brushed, leathered, filled, or unfilled depending on product direction"],
          [".spec-list div:nth-child(3) span", "Detail"],
          [".spec-list div:nth-child(3) strong", "CAD confirmation, slab matching, edge profile, drain position, hand finishing, and export packing"],
          [".spec-list div:nth-child(4) span", "Order Type"],
          [".spec-list div:nth-child(4) strong", "Single custom piece, project order, or repeatable OEM/ODM product line"],
          [".spec-list div:nth-child(5) span", "MOQ"],
          [".spec-list div:nth-child(5) strong", "1 piece allowed, usually based on sample, custom piece, or project quantity"],
          [".spec-list div:nth-child(6) span", "Lead Time"],
          [".spec-list div:nth-child(6) strong", "Typically confirmed after drawing, material, and quantity review"],
          [".cta-band .eyebrow", "Start Inquiry"],
          ["#products-cta-title", "Send the closest product reference, your target size, or a drawing for review."],
          [".cta-band .button", "Request Factory Quote"]
        ],
        products: [
          ["Sinks / Marble", "Green luxury marble pedestal sink", "Dramatic natural green marble sink for luxury bathroom interiors."],
          ["Sinks / White Marble", "Fluted rectangular white marble pedestal sink", "Ribbed natural stone sink with custom size, finish, drain detail, and export packing."],
          ["Sinks / Vessel", "Hand-crafted vessel sink", "Compact production reference for designer collections and project sets."],
          ["Tables / Travertine", "Travertine marble dining table for modern interiors", "Warm natural stone texture with custom size, base, finish, and export packing."],
          ["Tables / Dining", "Graceful travertine dining table", "Elegant leg geometry with repeatable production detailing."],
          ["Tables / Minimal", "Simple travertine dining table", "Simple silhouette, customized slab size, warm natural surface."],
          ["Bathroom / Bathtub", "Natural marble bathtub", "Statement stone bathtub with drawing confirmation and factory inspection."],
          ["Tables / Red Travertine", "Red travertine marble dining table for living room", "Warm natural red travertine texture with custom size, base, finish, and export packing."],
          ["Bathroom / Sinks", "Calacatta Viola marble pedestal sink", "Dramatic natural marble sink for high-end bathroom interiors."]
        ]
      },
      blog: {
        metaTitle: "Stone Journal | Win-Win Stone",
        metaDescription: "Read Win-Win Stone articles on natural stone materials, custom product design, factory process, packing, care, and OEM/ODM stone projects.",
        ogTitle: "Stone Journal | Win-Win Stone",
        ogDescription: "Material guides, product ideas, project notes, and factory process articles from Win-Win Stone.",
        text: [
          [".page-hero .eyebrow", "Stone Journal"],
          ["#journal-hero-title", "Material knowledge for custom stone decisions."],
          [".page-hero-content > p:not(.eyebrow)", "Guides, product ideas, project notes, and factory process articles for designers, homeowners, and product teams sourcing natural stone."],
          [".page-hero .button.primary", "Read Articles"],
          [".page-hero .button.ghost", "Product Catalog"],
          [".journal-feature .eyebrow", "Featured Guide"],
          ["#feature-title", "How to choose the right stone for a custom bathroom sink."],
          [".feature-story p:not(.eyebrow)", "Marble, travertine, quartzite, and onyx each behave differently in daily use. A strong article helps buyers understand surface finish, maintenance, thickness, drain details, and packing before they request a quote."],
          [".story-meta span:nth-child(1)", "Stone Guide"],
          [".story-meta span:nth-child(2)", "6 min read"],
          [".story-meta span:nth-child(3)", "Updated Apr 2026"],
          [".feature-story .text-link span", "Browse related posts"],
          [".article-section .eyebrow", "Article Library"],
          ["#articles-title", "Content that supports sourcing, design, and production."],
          [".article-section .section-heading > p:last-child", "Use guides, product ideas, process notes, and care articles to answer buyer questions before an inquiry starts."],
          [".filter-button[data-blog-filter='all']", "All"],
          [".filter-button[data-blog-filter='guide']", "Stone Guide"],
          [".filter-button[data-blog-filter='ideas']", "Product Ideas"],
          [".filter-button[data-blog-filter='process']", "Factory Process"],
          [".filter-button[data-blog-filter='care']", "Care"],
          [".cta-band .eyebrow", "Need a Stone Answer?"],
          ["#journal-cta-title", "Send a material question or product reference."],
          [".cta-band .button", "Contact Factory"]
        ],
        articles: [
          ["Stone Guide", "Green marble sinks: where bold color works best", "Design notes on veining, lighting, faucet pairing, and finish options for statement bathrooms.", "Apr 18, 2026"],
          ["Product Ideas", "Travertine dining tables for quiet luxury interiors", "How to brief table proportions, base structure, slab selection, and export packing.", "Apr 15, 2026"],
          ["Factory Process", "What happens after drawing confirmation", "A production timeline from material purchase and cutting to inspection, packing, and delivery.", "Apr 12, 2026"],
          ["Care", "Daily care for natural marble bathtubs", "Cleaning products, sealing cadence, and habits that protect the stone surface.", "Apr 9, 2026"],
          ["Product Ideas", "When to specify red travertine instead of beige stone", "Color direction, room tone, and production notes for a stronger interior signature.", "Apr 5, 2026"],
          ["Factory Process", "How OEM/ODM stone furniture orders are standardized", "Repeatable sizes, tolerances, drawings, labels, and packing details for product lines.", "Apr 1, 2026"]
        ]
      }
    }
  },
  zh: {
    metaTitle: "稳胜石材 | 天然石材 OEM/ODM 定制",
    metaDescription: "中国云浮天然石材源头工厂，提供大理石台盆、洞石餐桌、浴室柜、浴缸与石材家具 OEM/ODM 定制服务。",
    switchLabel: "EN",
    switchAria: "Switch to English",
    text: [
      [".skip-link", "跳到主要内容"],
      [".site-header .brand span", "稳胜石材"],
      [".site-footer .brand span", "稳胜石材"],
      [".nav-toggle .sr-only", "打开导航"],
      [".nav-links a:nth-child(1)", "产品"],
      [".nav-links a:nth-child(2)", "博客"],
      [".nav-links a:nth-child(3)", "OEM/ODM"],
      [".nav-links a:nth-child(4)", "生产实力"],
      [".nav-links a:nth-child(5)", "联系我们"],
      [".hero .eyebrow", "中国云浮天然石材源头工厂"],
      ["#hero-title", "面向品牌、设计师、工程项目与私人客户的定制大理石台盆、餐桌、浴室柜和石材家具"],
      [".hero-copy", "我们为品牌方、批发商、设计师、项目采购和私人客户提供天然石材定制开发，支持稳定生产、灵活定制和出口交付。"],
      [".hero-trust span:nth-child(1)", "15 年以上工厂生产经验"],
      [".hero-trust span:nth-child(2)", "服务品牌方与批发商的 OEM/ODM"],
      [".hero-trust span:nth-child(3)", "支持尺寸、表面与包装定制"],
      [".hero-trust span:nth-child(4)", "安全出口包装与全球交付"],
      [".hero-actions .primary", "获取免费报价"],
      [".hero-actions .ghost", "浏览产品"],
      [".hero-bottom span:nth-child(1)", "100% 天然石材"],
      [".hero-bottom span:nth-child(2)", "支持定制设计"],
      [".hero-bottom span:nth-child(3)", "支持全球运输"],
      [".intro .eyebrow", "为什么客户会联系稳胜石材"],
      ["#intro-title", "面向真实订单、真实项目和真实住宅的工厂型石材定制。"],
      [".intro-right p:nth-child(1)", "从大理石台盆、洞石餐桌到浴室柜、浴缸和定制石材家具，我们把想法、图纸和参考图转化为可生产、可出口的成品方案。"],
      [".intro-right p:nth-child(2)", "我们的工作围绕定制能力、材料确认、稳定复产和安全包装展开，帮助国际客户更顺畅地下单与交付。"],
      [".intro-points span:nth-child(1)", "支持尺寸与设计定制"],
      [".intro-points span:nth-child(2)", "源头工厂直接生产"],
      [".intro-points span:nth-child(3)", "安全出口包装"],
      [".intro-points span:nth-child(4)", "服务贸易客户与私人定制"],
      [".audience .eyebrow", "我们服务的客户"],
      [".audience-heading h2", "为需要超越目录款的贸易买家、设计师和私人客户而打造。"],
      [".audience-heading > p:last-child", "我们支持按尺寸定制、稳定复产和以材料为核心的开发方式，帮助不同客户把天然石材产品更准确地落到业务、项目或住宅空间中。"],
      [".audience-item:nth-child(1) strong", "批发商"],
      [".audience-item:nth-child(1) p", "适合需要稳定供货、规格统一和出口安全包装的分销与批量订单。"],
      [".audience-item:nth-child(2) strong", "家居品牌"],
      [".audience-item:nth-child(2) p", "支持贴牌系列开发、样品优化和可持续复购的 OEM 产品线。"],
      [".audience-item:nth-child(3) strong", "设计师"],
      [".audience-item:nth-child(3) p", "适用于住宅和商业空间，支持严格尺寸、表面工艺与整体视觉一致性要求。"],
      [".audience-item:nth-child(4) strong", "项目采购"],
      [".audience-item:nth-child(4) p", "适合别墅、酒店、零售空间和定制装置项目的石材产品配套生产。"],
      [".audience-item:nth-child(5) strong", "业主 / 私人客户"],
      [".audience-item:nth-child(5) p", "适合有审美要求的住宅空间，支持定制台盆、餐桌、浴缸和石材焦点单品。"],
      [".products .eyebrow", "精选产品"],
      ["#products-title", "可按市场、项目或住宅需求继续深化的石材产品方向。"],
      [".products .section-heading > p:last-child", "把这些参考款当作起点，再继续确认尺寸、材料、表面工艺和包装要求。"],
      [".latest-products h3", "精选产品"],
      [".latest-product-card:nth-child(1) strong", "奢华绿色大理石立柱盆"],
      [".latest-product-card:nth-child(1) .latest-product-body span:last-child", "适合高端浴室项目，支持尺寸、表面与出口包装定制。"],
      [".latest-product-card:nth-child(2) strong", "竖纹长方形白色大理石立柱盆"],
      [".latest-product-card:nth-child(2) .latest-product-body span:last-child", "适合住宅或酒店空间，可调整尺寸与竖纹细节。"],
      [".latest-product-card:nth-child(3) strong", "手工石材台上盆"],
      [".latest-product-card:nth-child(3) .latest-product-body span:last-child", "适合作为私人住宅和精品浴室系列的灵活起点。"],
      [".latest-product-card:nth-child(4) strong", "洞石大理石餐桌"],
      [".latest-product-card:nth-child(4) .latest-product-body span:last-child", "适合作为餐桌系列和室内项目定制的基础参考。"],
      [".latest-product-card:nth-child(5) strong", "天然大理石浴缸"],
      [".latest-product-card:nth-child(5) .latest-product-body span:last-child", "适用于别墅、酒店与私人住宅的标志性浴缸方向。"],
      [".product-categories h3", "按分类浏览"],
      [".category-card:nth-child(1) h4", "餐桌"],
      [".category-card:nth-child(1) p", "适合家居品牌和定制项目的餐桌、茶几与视觉焦点单品。"],
      [".category-card:nth-child(2) h4", "台盆"],
      [".category-card:nth-child(2) p", "提供大理石、洞石等天然石材的立柱盆与台上盆形式。"],
      [".category-card:nth-child(3) h4", "壁炉框"],
      [".category-card:nth-child(3) p", "适用于住宅、精品酒店和设计师项目的定制壁炉石材产品。"],
      [".category-card:nth-child(4) h4", "定制项目"],
      [".category-card:nth-child(4) p", "支持图纸开发、市场系列和项目专属产品的 OEM/ODM 生产。"],
      [".filter-button[data-filter='all']", "全部"],
      [".filter-button[data-filter='sinks']", "台盆"],
      [".filter-button[data-filter='tables']", "餐桌"],
      [".filter-button[data-filter='bathroom']", "浴室"],
      [".customization .eyebrow", "定制选项"],
      ["#customization-title", "生产开始前可以确认和调整的内容。"],
      [".customization-copy p:last-child", "我们的 OEM/ODM 服务围绕买家在生产前最常确认的细节展开。"],
      [".customization-item:nth-child(1) strong", "石材材料"],
      [".customization-item:nth-child(1) p", "可选择大理石、洞石、石英岩、缟玛瑙、石灰石等天然石材。"],
      [".customization-item:nth-child(2) strong", "尺寸规格"],
      [".customization-item:nth-child(2) p", "可根据图纸、市场或空间需求调整宽度、高度、厚度和比例。"],
      [".customization-item:nth-child(3) strong", "表面工艺"],
      [".customization-item:nth-child(3) p", "抛光、哑光、拉丝、皮革面等效果都可以提前确认。"],
      [".customization-item:nth-child(4) strong", "结构与细节"],
      [".customization-item:nth-child(4) p", "可确认边型、排水位、竖纹肌理、底座结构和外露工艺细节。"],
      [".customization-item:nth-child(5) strong", "包装方式"],
      [".customization-item:nth-child(5) p", "支持防护包裹、木箱加固、标签和外包装要求的确认。"],
      [".customization-item:nth-child(6) strong", "订单类型"],
      [".customization-item:nth-child(6) p", "适合样品开发、可复购 OEM SKU、工程订单和私人定制单品。"],
      [".video-band .eyebrow", "生产证明"],
      ["#factory-title", "定制石材订单如何从参考图走到交付。"],
      [".video-grid p:last-child", "从选材、加工到检验与发货协同，我们让品牌客户、项目采购和私人定制订单都能更清楚地推进。"],
      [".service .eyebrow", "OEM / ODM 流程"],
      ["#service-title", "从参考图到交付的清晰生产路径。"],
      [".why .eyebrow", "生产实力"],
      ["#why-title", "让定制石材订单减少不确定性的关键生产细节。"],
      [".why-copy p:nth-of-type(2)", "我们把发货前最重要的细节放在前面确认，包括图纸审核、材料与表面复核、生产控制、检验和出口安全包装。"],
      [".why-copy p:nth-of-type(3)", "无论是批发产品线、设计项目还是私人住宅定制，我们的目标都是让石材订单更容易评估、确认和交付。"],
      [".contact .eyebrow", "联系"],
      ["#contact-title", "发送您的图纸、尺寸、石材偏好或产品想法。"],
      [".contact-grid > div > p:nth-of-type(2)", "请提供最接近的产品参考、目标尺寸、数量、表面需求和交付国家，我们会协助您判断材料方向和下一步生产安排。"],
      [".quote-form label:nth-child(1)", "您的姓名"],
      [".quote-form label:nth-child(2)", "您的邮箱"],
      [".quote-form label:nth-child(3)", "公司 / 工作室 / 项目"],
      [".quote-form label:nth-child(4)", "留言"],
      [".quote-form .button", "发送询盘"],
      [".quote-response-note", "我们通常会在 24 小时内回复。"],
      [".site-footer p", "面向 OEM/ODM 订单、项目生产和私人定制的工厂型天然石材制造。"],
      [".footer-links a:nth-child(1)", "产品"],
      [".footer-links a:nth-child(2)", "博客"],
      [".footer-links a:nth-child(3)", "OEM/ODM"],
      [".footer-links a:nth-child(4)", "生产实力"],
      [".footer-links a:nth-child(5)", "联系我们"],
      [".dialog-content .eyebrow", "产品详情"],
      ["[data-dialog-quote]", "咨询此产品"]
    ],
    process: [
      "发送图纸或参考图",
      "确认产品方向",
      "确认材料与表面处理",
      "审核报价与订单条款",
      "生产与检验",
      "安全包装与交付"
    ],
    products: [
      ["台盆", "奢华绿色大理石立柱盆", "适合高端浴室项目，支持尺寸、表面和出口包装定制。"],
      ["台盆", "竖纹长方形白色大理石立柱盆", "可调整尺寸与竖纹细节，适用于住宅或酒店项目。"],
      ["台盆", "手工石材台上盆", "适合作为私人住宅和精品浴室系列的灵活起点。"],
      ["餐桌", "洞石大理石餐桌", "适合作为餐桌系列和室内项目定制的基础参考。"],
      ["餐桌", "优雅洞石餐桌", "适合 OEM/ODM 产品线与出口交付。"],
      ["餐桌", "简约洞石餐桌", "极简设计，可按尺寸定制。"],
      ["浴室", "天然大理石浴缸", "适用于别墅、酒店与私人住宅的标志性浴缸方向。"],
      ["餐桌", "红洞石大理石餐桌", "适用于客厅和设计感室内空间。"],
      ["台盆", "紫罗兰大理石立柱盆", "适合高端浴室的天然石材视觉焦点单品。"]
    ],
    proof: [
      ["生产前图纸确认", "在加工开始前先审核尺寸、结构和所有外露细节。"],
      ["材料与表面复核", "提前确认石材方向、表面效果和关键视觉要求。"],
      ["包装前检验", "产品在最终包裹和出口准备前会完成检查。"],
      ["出口安全木箱包装", "包装会考虑国际运输、防护和整体发货安全。"]
    ],
    formStatus: {
      submit: "发送询盘",
      sending: "正在发送...",
      success: "感谢您的咨询，信息已发送成功。我们通常会在 24 小时内回复。",
      error: "发送失败，请重试，或直接通过邮箱 / WhatsApp 联系我们。"
    },
    placeholders: {
      company: "台盆、餐桌、浴室柜、浴缸、定制项目...",
      message: "尺寸、石材类型、数量、表面工艺、交付国家、参考链接或图纸..."
    },
    mail: {
      defaultSubject: "OEM/ODM 石材询盘",
      quotePrefix: "报价请求"
    },
    pages: {
      products: {
        metaTitle: "石材产品目录 | 台盆、餐桌与浴室石材定制",
        metaDescription: "浏览大理石台盆、洞石餐桌、石材浴室柜、浴缸、壁炉框及 OEM/ODM 产品参考，适合品牌商、批发商、设计师与项目采购。",
        ogTitle: "石材产品目录 | 稳胜石材",
        ogDescription: "来自云浮源头工厂的定制石材产品目录，涵盖台盆、餐桌、浴室石材、浴缸和项目定制参考。",
        text: [
          [".page-hero .eyebrow", "石材产品目录"],
          ["#products-hero-title", "按品类、材料和生产方向浏览定制石材产品。"],
          [".page-hero-content > p:not(.eyebrow)", "每个产品方向都可根据尺寸、表面、结构细节和出口包装要求进行调整。"],
          [".page-hero .button.primary", "浏览目录"],
          [".page-hero .button.ghost", "获取工厂报价"],
          [".page-hero-notes span:nth-child(1)", "中国云浮源头工厂"],
          [".page-hero-notes span:nth-child(2)", "适合 OEM/ODM 询盘参考"],
          [".page-hero-notes span:nth-child(3)", "支持尺寸、表面与出口包装定制"],
          [".catalog-intro .eyebrow", "目录概览"],
          [".catalog-intro h2", "三大定制石材产品方向。"],
          [".product-direction-list article:nth-child(1) strong", "浴室石材产品"],
          [".product-direction-list article:nth-child(1) p", "立柱盆、台上盆、浴室柜、浴缸及适用于住宅、酒店和私人定制空间的配套浴室石材产品。"],
          [".product-direction-list article:nth-child(2) strong", "石材家具"],
          [".product-direction-list article:nth-child(2) p", "餐桌、茶几、边几、底座、玄关台和按尺寸定制的雕塑感石材家具。"],
          [".product-direction-list article:nth-child(3) strong", "工程项目定制"],
          [".product-direction-list article:nth-child(3) p", "酒店、别墅、零售空间和设计师项目，可按图纸、参考图或样品方向生产。"],
          [".buyer-fit .eyebrow", "哪些客户常用这个目录"],
          ["#buyer-fit-title", "为希望在报价前更快确认产品方向的买家而设。"],
          [".buyer-fit-card:nth-child(1) strong", "批发商"],
          [".buyer-fit-card:nth-child(1) p", "先确认可复购款式、材料方向和出口包装方式，再推进季度或批量订单。"],
          [".buyer-fit-card:nth-child(2) strong", "品牌方"],
          [".buyer-fit-card:nth-child(2) p", "把目录当作贴牌系列、样品优化和可复购 OEM 产品线的起点。"],
          [".buyer-fit-card:nth-child(3) strong", "设计师"],
          [".buyer-fit-card:nth-child(3) p", "在确认客户空间的制作细节前，先筛选造型、表面和石材类型。"],
          [".buyer-fit-card:nth-child(4) strong", "项目采购"],
          [".buyer-fit-card:nth-child(4) p", "为别墅、酒店和零售空间筛选可继续深化的浴室、家具和装饰石材参考。"],
          [".buyer-fit-card:nth-child(5) strong", "业主 / 私人客户"],
          [".buyer-fit-card:nth-child(5) p", "可用于筛选适合个性住宅和私人室内项目的台盆、餐桌、浴缸和定制石材单品。"],
          [".product-catalog .eyebrow", "浏览产品"],
          ["#catalog-title", "按品类整理的定制产品参考。"],
          [".product-catalog .section-heading > p:last-child", "按台盆、餐桌、浴室或工程方向筛选，再把最接近的参考款发给我们确认尺寸、材料选项和报价。"],
          [".filter-button[data-filter='all']", "全部"],
          [".filter-button[data-filter='sinks']", "台盆"],
          [".filter-button[data-filter='tables']", "餐桌"],
          [".filter-button[data-filter='bathroom']", "浴室"],
          [".filter-button[data-filter='project']", "工程"],
          [".material-section .eyebrow", "询盘前确认"],
          ["#material-title", "买家通常会在下单前确认这些信息。"],
          [".spec-list div:nth-child(1) span", "材料"],
          [".spec-list div:nth-child(1) strong", "大理石、洞石、石英岩、缟玛瑙、石灰石及其他可选天然石材"],
          [".spec-list div:nth-child(2) span", "表面"],
          [".spec-list div:nth-child(2) strong", "抛光、哑光、拉丝、皮革面、填孔或不填孔，视产品方向而定"],
          [".spec-list div:nth-child(3) span", "细节"],
          [".spec-list div:nth-child(3) strong", "CAD 确认、选板配纹、边型、排水位、手工处理和出口包装"],
          [".spec-list div:nth-child(4) span", "订单类型"],
          [".spec-list div:nth-child(4) strong", "单件定制、项目订单或可复购的 OEM/ODM 产品线"],
          [".spec-list div:nth-child(5) span", "起订量"],
          [".spec-list div:nth-child(5) strong", "支持 1 件起订，通常根据样品、定制单件或项目数量确认。"],
          [".spec-list div:nth-child(6) span", "交期"],
          [".spec-list div:nth-child(6) strong", "通常在确认图纸、材料和数量后给出。"],
          [".cta-band .eyebrow", "开始询盘"],
          ["#products-cta-title", "把最接近的参考款、目标尺寸或图纸发给我们评估。"],
          [".cta-band .button", "获取工厂报价"]
        ],
        products: [
          ["台盆 / 大理石", "奢华绿色大理石立柱盆", "适合高端浴室的绿色天然大理石立柱盆。"],
          ["台盆 / 白色大理石", "竖纹长方形白色大理石立柱盆", "带竖纹细节的天然石材台盆，支持尺寸、表面和排水定制。"],
          ["台盆 / 台上盆", "手工石材台上盆", "适合设计师系列和项目成套产品的小型生产参考。"],
          ["餐桌 / 洞石", "现代室内洞石大理石餐桌", "温润天然石材纹理，支持尺寸、底座、表面和出口包装定制。"],
          ["餐桌 / 餐厅", "优雅洞石餐桌", "优雅桌脚结构，适合标准化重复生产。"],
          ["餐桌 / 极简", "简约洞石餐桌", "简洁轮廓、按需尺寸和温润天然表面。"],
          ["浴室 / 浴缸", "天然大理石浴缸", "标志性石材浴缸，支持图纸确认和工厂验货。"],
          ["餐桌 / 红洞石", "客厅红洞石大理石餐桌", "温暖红洞石纹理，支持尺寸、底座、表面和出口包装定制。"],
          ["浴室 / 台盆", "紫罗兰大理石立柱盆", "适合高端浴室的戏剧性天然大理石台盆。"]
        ]
      },
      blog: {
        metaTitle: "石材博客 | 稳胜石材",
        metaDescription: "阅读稳胜石材关于天然石材材料、定制产品设计、工厂流程、包装、保养和 OEM/ODM 项目的文章。",
        ogTitle: "石材博客 | 稳胜石材",
        ogDescription: "稳胜石材的材料指南、产品灵感、项目笔记和工厂流程文章。",
        text: [
          [".page-hero .eyebrow", "石材博客"],
          ["#journal-hero-title", "帮助客户做石材定制决策的内容。"],
          [".page-hero-content > p:not(.eyebrow)", "面向设计师、业主和产品团队，提供材料指南、产品灵感、项目笔记和工厂流程文章。"],
          [".page-hero .button.primary", "阅读文章"],
          [".page-hero .button.ghost", "产品目录"],
          [".journal-feature .eyebrow", "精选指南"],
          ["#feature-title", "如何为定制浴室台盆选择合适石材。"],
          [".feature-story p:not(.eyebrow)", "大理石、洞石、石英岩和缟玛瑙在日常使用中的表现各不相同。好的文章能帮助客户在询盘前了解表面、保养、厚度、排水和包装要求。"],
          [".story-meta span:nth-child(1)", "石材指南"],
          [".story-meta span:nth-child(2)", "约 6 分钟阅读"],
          [".story-meta span:nth-child(3)", "更新于 2026 年 4 月"],
          [".feature-story .text-link span", "浏览相关文章"],
          [".article-section .eyebrow", "文章库"],
          ["#articles-title", "服务于选材、设计和生产的内容。"],
          [".article-section .section-heading > p:last-child", "用指南、产品灵感、流程说明和保养文章，在询盘前回答客户问题。"],
          [".filter-button[data-blog-filter='all']", "全部"],
          [".filter-button[data-blog-filter='guide']", "石材指南"],
          [".filter-button[data-blog-filter='ideas']", "产品灵感"],
          [".filter-button[data-blog-filter='process']", "工厂流程"],
          [".filter-button[data-blog-filter='care']", "保养"],
          [".cta-band .eyebrow", "需要石材建议？"],
          ["#journal-cta-title", "发送材料问题或产品参考。"],
          [".cta-band .button", "联系工厂"]
        ],
        articles: [
          ["石材指南", "绿色大理石台盆适合哪些空间", "关于纹理、灯光、水龙头搭配和表面工艺的设计建议。", "2026 年 4 月 18 日"],
          ["产品灵感", "适合静奢空间的洞石餐桌", "如何确认餐桌比例、底座结构、配板方式和出口包装。", "2026 年 4 月 15 日"],
          ["工厂流程", "图纸确认后会发生什么", "从采购、切割到检验、包装和交付的生产时间线。", "2026 年 4 月 12 日"],
          ["保养", "天然大理石浴缸的日常保养", "清洁用品、密封周期和保护石材表面的使用习惯。", "2026 年 4 月 9 日"],
          ["产品灵感", "什么时候选择红洞石而不是米色石材", "关于色彩方向、空间气质和生产要点的说明。", "2026 年 4 月 5 日"],
          ["工厂流程", "石材家具 OEM/ODM 订单如何标准化", "产品线生产中的尺寸、容差、图纸、标签和包装细节。", "2026 年 4 月 1 日"]
        ]
      }
    }
  }
};

const pageKey = document.body.dataset.page || "home";
let currentLanguage = localStorage.getItem("siteLanguage") === "zh" ? "zh" : "en";

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

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    applyProductFilter(filter);
  });
});

getProductCards().forEach((card) => {
  const opener = card.querySelector("button.product-open");
  const image = card.querySelector("img");

  if (!opener || !image || !dialog || !dialogImage || !dialogTitle || !dialogDescription) return;

  opener.addEventListener("click", () => {
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialogTitle.textContent = currentLanguage === "zh" ? card.dataset.titleZh : card.dataset.title;
    dialogDescription.textContent = currentLanguage === "zh" ? card.dataset.descriptionZh : card.dataset.description;
    if (dialogQuote) {
      dialogQuote.dataset.product = dialogTitle.textContent;
    }
    dialog.showModal();
    document.body.classList.add("dialog-open");
  });
});

function closeDialog() {
  if (!dialog) return;
  dialog.close();
  document.body.classList.remove("dialog-open");
}

dialogClose?.addEventListener("click", closeDialog);
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) {
    closeDialog();
  }
});

dialogQuote?.addEventListener("click", closeDialog);

function setElementText(element, value) {
  if (element.matches("label")) {
    const field = element.querySelector("input, textarea");
    element.textContent = value;
    if (field) {
      element.append(field);
    }
    return;
  }

  const svg = element.querySelector(":scope > svg");
  element.textContent = "";

  if (svg) {
    element.append(svg);
    element.append(` ${value}`);
    return;
  }

  element.textContent = value;
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (!element) return;

  setElementText(element, value);
}

function setTextAll(selector, value) {
  document.querySelectorAll(selector).forEach((element) => setElementText(element, value));
}

function setQuoteSubmitLabel(value) {
  if (!quoteSubmitButton) return;
  setElementText(quoteSubmitButton, value);
}

function setQuoteFormStatus(state) {
  if (!quoteFormStatus) return;

  quoteFormStatus.dataset.state = state || "";
  quoteFormStatus.classList.remove("is-success", "is-error");

  if (!state) {
    quoteFormStatus.textContent = "";
    return;
  }

  const message = translations[currentLanguage].formStatus?.[state] || "";
  quoteFormStatus.textContent = message;

  if (state === "success" || state === "error") {
    quoteFormStatus.classList.add(`is-${state}`);
  }
}

quoteForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const copy = translations[currentLanguage];
  const form = new FormData(quoteForm);
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const company = String(form.get("company") || "").trim();

  form.set("subject", company ? `${copy.mail.quotePrefix}: ${company}` : copy.mail.defaultSubject);
  form.set("from_name", name ? `Win-Win Stone Website - ${name}` : "Win-Win Stone Website");
  form.set("replyto", email);

  quoteSubmitButton?.setAttribute("disabled", "disabled");
  setQuoteSubmitLabel(copy.formStatus.sending);
  setQuoteFormStatus("");

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        Accept: "application/json"
      },
      body: form
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Submission failed.");
    }

    quoteForm.reset();
    setQuoteFormStatus("success");
  } catch (error) {
    setQuoteFormStatus("error");
  } finally {
    quoteSubmitButton?.removeAttribute("disabled");
    setQuoteSubmitLabel(translations[currentLanguage].formStatus.submit);
  }
});

async function loadPublishedProducts() {
  try {
    const response = await fetch(`${CONTENT_API_BASE}/products?status=published`);

    if (!response.ok) {
      throw new Error("Failed to load products.");
    }

    return await response.json();
  } catch (error) {
    if (typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)) {
      return PRODUCTS.map((product, index) => ({
        ...product,
        status: "published",
        featured: [
          "green-marble-pedestal-sink",
          "calacatta-marble-pedestal-sink",
          "custom-marble-vessel-sink",
          "minimalist-travertine-dining-table",
          "natural-marble-bathtub"
        ].includes(product.slug),
        featuredOrder:
          ({
            "green-marble-pedestal-sink": 1,
            "calacatta-marble-pedestal-sink": 2,
            "custom-marble-vessel-sink": 3,
            "minimalist-travertine-dining-table": 4,
            "natural-marble-bathtub": 5
          })[product.slug] || null,
        summary: product.summary || product.desc || "",
        summaryZh: product.summaryZh || "",
        sortOrder: (index + 1) * 10
      }));
    }

    return [];
  }
}

function getFeaturedProductCopy(product, language) {
  const title =
    language === "zh"
      ? product.nameZh || product.titleZh || product.name
      : product.name || product.title || "";
  const summary =
    language === "zh"
      ? product.summaryZh || product.descZh || product.summary || product.desc || ""
      : product.summary || product.desc || "";

  return { title, summary };
}

function getPostCategoryFilter(post) {
  const text = `${post.category || ""} ${(post.tags || []).join(" ")}`.toLowerCase();

  if (text.includes("guide")) return "guide";
  if (text.includes("idea")) return "ideas";
  if (text.includes("process")) return "process";
  if (text.includes("care")) return "care";
  return "all";
}

async function loadPublishedPosts() {
  try {
    const response = await fetch(`${CONTENT_API_BASE}/posts?status=published`);

    if (!response.ok) {
      throw new Error("Failed to load posts.");
    }

    return await response.json();
  } catch (error) {
    if (typeof POSTS !== "undefined" && Array.isArray(POSTS)) {
      return POSTS;
    }

    return [];
  }
}

function getPostCopy(post, language) {
  return {
    title: language === "zh" ? post.titleZh || post.title : post.title,
    category: language === "zh" ? post.categoryZh || post.category : post.category,
    excerpt: language === "zh" ? post.excerptZh || post.excerpt : post.excerpt,
    coverAlt: language === "zh" ? post.coverAltZh || post.coverAlt : post.coverAlt
  };
}

function formatPostDate(dateString, language) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

async function renderBlogPage(language = currentLanguage) {
  if (!featuredPostContainer && !articleGrid) return;

  const posts = (await loadPublishedPosts())
    .filter((post) => post.status === "published")
    .sort((left, right) => (left.sortOrder || 999) - (right.sortOrder || 999));

  const featuredPost =
    posts
      .filter((post) => post.featured)
      .sort((left, right) => (left.featuredOrder || 999) - (right.featuredOrder || 999))[0] || posts[0];

  if (featuredPostContainer && featuredPost) {
    const copy = getPostCopy(featuredPost, language);
    featuredPostContainer.innerHTML = `
      <img src="${featuredPost.coverImage}" alt="${copy.coverAlt || copy.title}">
      <div>
        <p class="eyebrow">${language === "zh" ? "精选指南" : "Featured Guide"}</p>
        <h2 id="feature-title">${copy.title}</h2>
        <p>${copy.excerpt || ""}</p>
        <div class="story-meta">
          <span>${copy.category || ""}</span>
          <span>${featuredPost.author || "Win-Win Stone"}</span>
          <span>${formatPostDate(featuredPost.updatedAt || featuredPost.publishedAt, language)}</span>
        </div>
        <a class="text-link" href="${getPostPageUrl(featuredPost.slug)}">
          <span>${language === "zh" ? "阅读文章" : "Read article"}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
        </a>
      </div>
    `;
  }

  if (articleGrid) {
    articleGrid.innerHTML = posts
      .map((post) => {
        const copy = getPostCopy(post, language);
        const filter = getPostCategoryFilter(post);

        return `
          <article class="article-card" data-blog-category="${filter}">
            <a href="${getPostPageUrl(post.slug)}">
              <img src="${post.coverImage}" alt="${copy.coverAlt || copy.title}">
              <span class="article-body">
                <span class="product-type">${copy.category || ""}</span>
                <strong>${copy.title}</strong>
                <span>${copy.excerpt || ""}</span>
                <span class="article-date">${formatPostDate(post.publishedAt, language)}</span>
              </span>
            </a>
          </article>
        `;
      })
      .join("");
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getCatalogProductCopy(product, language) {
  const title =
    language === "zh"
      ? product.nameZh || product.titleZh || product.name
      : product.name || product.title || "";
  const type =
    language === "zh"
      ? product.categoryZh || product.category || ""
      : product.category || "";
  const description =
    language === "zh"
      ? product.summaryZh || product.descZh || product.summary || product.desc || ""
      : product.summary || product.desc || "";

  return { title, type, description };
}

function getCatalogCardClasses(product) {
  const classes = ["product-card"];

  if (product.featured) {
    classes.push("product-card-featured");
  }

  if ((product.filters || []).includes("tables")) {
    classes.push("product-card-wide");
  }

  return classes.join(" ");
}

function getProductCards() {
  return document.querySelectorAll(".product-card");
}

function applyProductFilter(filter = activeProductFilter) {
  activeProductFilter = filter;

  getProductCards().forEach((card) => {
    const categories = (card.dataset.category || "").split(" ").filter(Boolean);
    card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
  });
}

async function renderProductCatalog(language = currentLanguage) {
  if (!productGrid) return;

  const products = await loadPublishedProducts();
  const publishedProducts = products
    .filter((product) => product.status === "published")
    .sort((left, right) => (left.sortOrder || 999) - (right.sortOrder || 999));

  productGrid.innerHTML = publishedProducts
    .map((product) => {
      const copy = getCatalogProductCopy(product, language);
      const categories = (product.filters || []).join(" ");
      const image = product.image || product.gallery?.[0] || "";

      return `
        <article
          class="${getCatalogCardClasses(product)}"
          data-category="${escapeHtml(categories)}"
          data-title="${escapeHtml(product.name || "")}"
          data-title-zh="${escapeHtml(product.nameZh || "")}"
          data-description="${escapeHtml(product.desc || product.summary || "")}"
          data-description-zh="${escapeHtml(product.descZh || product.summaryZh || "")}"
        >
          <a class="product-open" href="${getProductPageUrl(product.slug)}">
            <img src="${escapeHtml(image)}" alt="${escapeHtml(copy.title)}">
            <span class="product-body">
              <span class="product-type">${escapeHtml(copy.type)}</span>
              <strong>${escapeHtml(copy.title)}</strong>
              <span>${escapeHtml(copy.description)}</span>
            </span>
          </a>
        </article>
      `;
    })
    .join("");

  applyProductFilter(activeProductFilter);
}

async function renderFeaturedProducts(language = currentLanguage) {
  if (!featuredProductsContainer) return;

  const products = await loadPublishedProducts();
  const featuredProducts = products
    .filter((product) => product.status === "published" && product.featured)
    .sort((left, right) => (left.featuredOrder || 999) - (right.featuredOrder || 999))
    .slice(0, 5);

  const finalProducts = featuredProducts.length
    ? featuredProducts
    : products.slice(0, 5).map((product, index) => ({
        ...product,
        featuredOrder: index + 1
      }));

  featuredProductsContainer.innerHTML = finalProducts
    .map((product) => {
      const copy = getFeaturedProductCopy(product, language);

      return `
        <article class="latest-product-card">
          <a href="${getProductPageUrl(product.slug)}">
            <img src="${product.image}" alt="${copy.title}">
            <span class="latest-product-body">
              <strong>${copy.title}</strong>
              <span>${copy.summary}</span>
            </span>
          </a>
        </article>
      `;
    })
    .join("");
}

function applyLanguage(language) {
  if (!languageToggle || !languageLabel) return;

  const copy = translations[language];
  const pageCopy = copy.pages?.[pageKey];
  const metaTitle = pageCopy?.metaTitle || copy.metaTitle;
  const metaDescription = pageCopy?.metaDescription || copy.metaDescription;
  const ogTitle = pageCopy?.ogTitle || (language === "zh" ? "稳胜石材 | 天然石材定制" : "Win-Win Stone");
  const ogDescription = pageCopy?.ogDescription || metaDescription;

  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = metaTitle;
  document.querySelector("meta[name='description']").setAttribute("content", metaDescription);
  document.querySelector("meta[property='og:title']").setAttribute("content", ogTitle);
  document.querySelector("meta[property='og:description']").setAttribute("content", ogDescription);
  document.querySelectorAll(".brand").forEach((brand) => {
    brand.setAttribute("aria-label", language === "zh" ? "稳胜石材" : "Win-Win Stone");
  });
  languageLabel.textContent = copy.switchLabel;
  languageToggle.setAttribute("aria-label", copy.switchAria);

  [
    [".skip-link", language === "zh" ? "跳到主要内容" : "Skip to content"],
    [".site-header .brand span, .site-footer .brand span", language === "zh" ? "稳胜石材" : "Win-Win Stone"],
    [".nav-toggle .sr-only", language === "zh" ? "打开导航" : "Open navigation"],
    [".nav-links a[href='products.html'], .footer-links a[href='products.html']", language === "zh" ? "产品" : "Products"],
    [".nav-links a[href='blog.html'], .footer-links a[href='blog.html']", language === "zh" ? "博客" : "Blog"],
    [".nav-links a[href='#service'], .nav-links a[href='index.html#service'], .footer-links a[href='#service'], .footer-links a[href='index.html#service']", "OEM/ODM"],
    [".nav-links a[href='#why-us'], .footer-links a[href='#why-us']", language === "zh" ? "生产实力" : "Why Us"],
    [".nav-links a[href='#contact'], .nav-links a[href='index.html#contact'], .footer-links a[href='#contact'], .footer-links a[href='index.html#contact']", language === "zh" ? "联系我们" : "Contact"],
    [".site-footer p", language === "zh" ? "面向 OEM/ODM 订单、项目生产和私人定制的工厂型天然石材制造。" : "Factory-backed natural stone manufacturing for OEM/ODM orders, project production, and private custom pieces."]
  ].forEach(([selector, value]) => setTextAll(selector, value));

  if (pageKey === "home") {
    copy.text.forEach(([selector, value]) => setText(selector, value));
  }

  pageCopy?.text.forEach(([selector, value]) => setText(selector, value));

  if (pageKey === "home") {
    document.querySelectorAll(".process-list li").forEach((item, index) => {
      const number = item.querySelector("span").textContent;
      item.textContent = "";
      const numberElement = document.createElement("span");
      numberElement.textContent = number;
      item.append(numberElement, copy.process[index]);
    });
  }

  if (pageKey === "home") {
    document.querySelectorAll(".product-card").forEach((card, index) => {
      const products = pageCopy?.products || copy.products;
      const product = products[index];
      if (!product) return;

      const [type, title, description] = product;
      card.querySelector(".product-type").textContent = type;
      card.querySelector("strong").textContent = title;
      card.querySelector(".product-body span:last-child").textContent = description;
    });
  }

  if (pageKey === "home") {
    document.querySelectorAll(".proof-item").forEach((item, index) => {
      const [title, description] = copy.proof[index];
      item.querySelector("strong").textContent = title;
      item.querySelector("span").textContent = description;
    });
  }

  if (pageKey !== "blog") {
    pageCopy?.articles?.forEach(([category, title, description, date], index) => {
      const card = document.querySelectorAll(".article-card")[index];
      if (!card) return;

      card.querySelector(".product-type").textContent = category;
      card.querySelector("strong").textContent = title;
      card.querySelector(".article-body span:not(.product-type):not(.article-date)").textContent = description;
      card.querySelector(".article-date").textContent = date;
    });
  }

  if (quoteForm?.elements.company) {
    quoteForm.elements.company.placeholder = copy.placeholders.company;
  }

  if (quoteForm?.elements.message) {
    quoteForm.elements.message.placeholder = copy.placeholders.message;
  }

  if (quoteSubmitButton && !quoteSubmitButton.hasAttribute("disabled")) {
    setQuoteSubmitLabel(copy.formStatus.submit);
  }

  if (quoteFormStatus?.dataset.state) {
    setQuoteFormStatus(quoteFormStatus.dataset.state);
  }
}

languageToggle?.addEventListener("click", async () => {
  currentLanguage = currentLanguage === "en" ? "zh" : "en";
  localStorage.setItem("siteLanguage", currentLanguage);
  applyLanguage(currentLanguage);

  if (pageKey === "home") {
    await renderFeaturedProducts(currentLanguage);
  }

  if (pageKey === "products") {
    await renderProductCatalog(currentLanguage);
  }

  if (pageKey === "blog") {
    await renderBlogPage(currentLanguage);
  }
});

applyLanguage(currentLanguage);

if (pageKey === "home") {
  renderFeaturedProducts(currentLanguage);
}

if (pageKey === "products") {
  renderProductCatalog(currentLanguage);
}

if (pageKey === "blog") {
  renderBlogPage(currentLanguage);
}

document.querySelectorAll("[data-blog-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.blogFilter;
    const group = button.closest("[data-filter-group]") || document;

    group.querySelectorAll("[data-blog-filter]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });

    document.querySelectorAll("[data-blog-category]").forEach((article) => {
      const categories = article.dataset.blogCategory.split(" ");
      article.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

document.querySelectorAll("[data-studio-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.studioTab;

    document.querySelectorAll("[data-studio-tab]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });

    document.querySelectorAll("[data-studio-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.studioPanel !== target;
    });
  });
});

document.querySelectorAll("[data-preview-form]").forEach((form) => {
  const scope = form.closest("[data-studio-panel]") || document;
  const previewTitle = scope.querySelector("[data-preview-title]");
  const previewMeta = scope.querySelector("[data-preview-meta]");
  const previewText = scope.querySelector("[data-preview-text]");
  const previewImage = scope.querySelector("[data-preview-image]");
  const status = scope.querySelector("[data-preview-status]");
  const feed = document.querySelector("[data-studio-feed]");

  function updatePreview() {
    const title = form.elements.title?.value || form.dataset.fallbackTitle || "Untitled draft";
    const category = form.elements.category?.value || "Draft";
    const material = form.elements.material?.value || form.elements.author?.value || "Editor";
    const summary = form.elements.summary?.value || form.dataset.fallbackSummary || "Add a short description for the preview.";
    const image = form.elements.image?.value;

    if (previewTitle) previewTitle.textContent = title;
    if (previewMeta) previewMeta.textContent = `${category} / ${material}`;
    if (previewText) previewText.textContent = summary;
    if (previewImage && image) previewImage.src = image;
  }

  form.addEventListener("input", updatePreview);
  updatePreview();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (status) {
      status.textContent = "Published";
      status.classList.add("is-live");
    }

    if (feed) {
      const item = document.createElement("li");
      const title = form.elements.title?.value || form.dataset.fallbackTitle || "Untitled draft";
      item.innerHTML = `<strong>${title}</strong><span>Published from studio preview</span>`;
      feed.prepend(item);
    }
  });
});
