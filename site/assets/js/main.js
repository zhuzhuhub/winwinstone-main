const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const filterButtons = document.querySelectorAll("[data-filter]");
const productCards = document.querySelectorAll(".product-card");
const dialog = document.querySelector("[data-product-dialog]");
const dialogImage = document.querySelector("[data-dialog-image]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogDescription = document.querySelector("[data-dialog-description]");
const dialogClose = document.querySelector("[data-dialog-close]");
const dialogQuote = document.querySelector("[data-dialog-quote]");
const quoteForm = document.querySelector("[data-quote-form]");
const languageToggle = document.querySelector("[data-language-toggle]");
const languageLabel = document.querySelector("[data-language-label]");

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
    placeholders: {
      subject: "Sink, table, vanity, bathtub, custom project...",
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
          [".page-hero-content > p:not(.eyebrow)", "Use this catalog to review sink, table, bathroom, and project references before you request a quote. Each product direction can be adjusted by stone selection, size, finish, edge detail, structure, and export packing requirement."],
          [".page-hero .button.primary", "Browse Catalog"],
          [".page-hero .button.ghost", "Request Quote"],
          [".page-hero-notes span:nth-child(1)", "Factory-direct from Yunfu, China"],
          [".page-hero-notes span:nth-child(2)", "OEM/ODM-ready product references"],
          [".page-hero-notes span:nth-child(3)", "Custom sizes, finishes, and export packing"],
          [".catalog-intro .eyebrow", "Catalog Overview"],
          [".catalog-intro h2", "From sample development to repeatable OEM/ODM product lines."],
          [".product-direction-list article:nth-child(1) strong", "Bathroom Stone Products"],
          [".product-direction-list article:nth-child(1) p", "Pedestal sinks, vessel sinks, vanities, bathtubs, and coordinated bathroom pieces for residential or hospitality use."],
          [".product-direction-list article:nth-child(2) strong", "Stone Furniture"],
          [".product-direction-list article:nth-child(2) p", "Dining tables, coffee tables, side tables, plinths, consoles, and sculptural stone furniture built around exact dimensions."],
          [".product-direction-list article:nth-child(3) strong", "Project Custom"],
          [".product-direction-list article:nth-child(3) p", "Hotel, villa, retail, and designer project pieces produced from drawings, samples, or reference images."],
          [".buyer-fit .eyebrow", "Best Fit"],
          ["#buyer-fit-title", "Who this catalog is built for."],
          [".buyer-fit .section-heading > p:last-child", "These product references are designed to help buyers qualify direction fast before moving into sampling, drawing confirmation, or quote review."],
          [".buyer-fit-card:nth-child(1) strong", "Wholesalers"],
          [".buyer-fit-card:nth-child(1) p", "Review repeatable formats, material directions, and export packing before placing bulk or seasonal orders."],
          [".buyer-fit-card:nth-child(2) strong", "Interior Brands"],
          [".buyer-fit-card:nth-child(2) p", "Use the catalog as a starting point for custom collections, private-label product development, or sample-based refinement."],
          [".buyer-fit-card:nth-child(3) strong", "Designers"],
          [".buyer-fit-card:nth-child(3) p", "Shortlist forms, finishes, and stone types before confirming dimensions and fabrication details for client projects."],
          [".buyer-fit-card:nth-child(4) strong", "Project Buyers"],
          [".buyer-fit-card:nth-child(4) p", "Identify bathroom, furniture, and decorative stone references that can be adapted for villas, hospitality, or retail spaces."],
          [".product-catalog .eyebrow", "Browse Products"],
          ["#catalog-title", "Category-led references for custom inquiries."],
          [".product-catalog .section-heading > p:last-child", "Use the filters to narrow by sink, table, bathroom, or project custom work, then send the closest reference when you request dimensions, material options, or pricing."],
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
          [".spec-list div:nth-child(3) span", "Build Detail"],
          [".spec-list div:nth-child(3) strong", "CAD confirmation, slab matching, edge profile, drain position, hand finishing, and export packing"],
          [".spec-list div:nth-child(4) span", "Order Type"],
          [".spec-list div:nth-child(4) strong", "Single custom sample, project batch, or repeatable OEM/ODM product line"],
          [".cta-band .eyebrow", "Start Inquiry"],
          ["#products-cta-title", "Send the closest product reference, your target size, or a drawing for review."],
          [".cta-band .button", "Start Inquiry"]
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
    placeholders: {
      subject: "台盆、餐桌、浴室柜、浴缸、定制项目...",
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
          [".page-hero-content > p:not(.eyebrow)", "在询盘前先查看台盆、餐桌、浴室石材和项目定制参考。每个产品方向都可根据石材、尺寸、表面、结构细节和出口包装要求调整。"],
          [".page-hero .button.primary", "浏览目录"],
          [".page-hero .button.ghost", "获取报价"],
          [".page-hero-notes span:nth-child(1)", "中国云浮源头工厂"],
          [".page-hero-notes span:nth-child(2)", "适合 OEM/ODM 询盘参考"],
          [".page-hero-notes span:nth-child(3)", "支持尺寸、表面与出口包装定制"],
          [".catalog-intro .eyebrow", "目录概览"],
          [".catalog-intro h2", "从样品开发到可复购的 OEM/ODM 产品线。"],
          [".product-direction-list article:nth-child(1) strong", "浴室石材产品"],
          [".product-direction-list article:nth-child(1) p", "立柱盆、台上盆、浴室柜、浴缸及适用于住宅和酒店项目的配套浴室石材产品。"],
          [".product-direction-list article:nth-child(2) strong", "石材家具"],
          [".product-direction-list article:nth-child(2) p", "餐桌、茶几、边几、底座、玄关台和按尺寸定制的雕塑感石材家具。"],
          [".product-direction-list article:nth-child(3) strong", "工程项目定制"],
          [".product-direction-list article:nth-child(3) p", "酒店、别墅、零售空间和设计师项目，可按图纸、样品或参考图片生产。"],
          [".buyer-fit .eyebrow", "适用客户"],
          ["#buyer-fit-title", "这个目录更适合哪些买家。"],
          [".buyer-fit .section-heading > p:last-child", "这些产品参考页用于帮助买家先快速确认方向，再进入打样、图纸确认或报价阶段。"],
          [".buyer-fit-card:nth-child(1) strong", "批发商"],
          [".buyer-fit-card:nth-child(1) p", "先确认可复购款式、材料方向和出口包装方式，再推进批量或季度订单。"],
          [".buyer-fit-card:nth-child(2) strong", "品牌方"],
          [".buyer-fit-card:nth-child(2) p", "把目录当作定制系列、贴牌开发或样品优化的起点。"],
          [".buyer-fit-card:nth-child(3) strong", "设计师"],
          [".buyer-fit-card:nth-child(3) p", "在确定客户项目尺寸和工艺前，先筛选造型、表面和石材类型。"],
          [".buyer-fit-card:nth-child(4) strong", "项目采购"],
          [".buyer-fit-card:nth-child(4) p", "为别墅、酒店和零售空间筛选可继续深化的浴室、家具和装饰石材参考。"],
          [".product-catalog .eyebrow", "浏览产品"],
          ["#catalog-title", "按品类整理的定制产品参考。"],
          [".product-catalog .section-heading > p:last-child", "按台盆、餐桌、浴室或工程定制筛选，再把最接近的参考款发给我们确认尺寸、材料和报价。"],
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
          [".spec-list div:nth-child(3) span", "结构细节"],
          [".spec-list div:nth-child(3) strong", "CAD 确认、选板配纹、边型、排水位、手工处理和出口包装"],
          [".spec-list div:nth-child(4) span", "订单类型"],
          [".spec-list div:nth-child(4) strong", "单件样品、项目批量或可复购的 OEM/ODM 产品线"],
          [".cta-band .eyebrow", "开始询盘"],
          ["#products-cta-title", "把最接近的参考款、目标尺寸或图纸发给我们评估。"],
          [".cta-band .button", "开始询盘"]
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

    productCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

productCards.forEach((card) => {
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

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const copy = translations[currentLanguage];
  const form = new FormData(quoteForm);
  const name = form.get("name") || "";
  const email = form.get("email") || "";
  const subject = form.get("subject") || copy.mail.defaultSubject;
  const message = form.get("message") || "";
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Project: ${subject}`,
    "",
    message
  ].join("\n");

  const mailto = new URL("mailto:stone2lisa@outlook.com");
  mailto.searchParams.set("subject", `${copy.mail.quotePrefix}: ${subject}`);
  mailto.searchParams.set("body", body);
  window.location.href = mailto.toString();
});

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

  document.querySelectorAll(".product-card").forEach((card, index) => {
    const products = pageCopy?.products || copy.products;
    const product = products[index];
    if (!product) return;

    const [type, title, description] = product;
    card.querySelector(".product-type").textContent = type;
    card.querySelector("strong").textContent = title;
    card.querySelector(".product-body span:last-child").textContent = description;
  });

  if (pageKey === "home") {
    document.querySelectorAll(".proof-item").forEach((item, index) => {
      const [title, description] = copy.proof[index];
      item.querySelector("strong").textContent = title;
      item.querySelector("span").textContent = description;
    });
  }

  pageCopy?.articles?.forEach(([category, title, description, date], index) => {
    const card = document.querySelectorAll(".article-card")[index];
    if (!card) return;

    card.querySelector(".product-type").textContent = category;
    card.querySelector("strong").textContent = title;
    card.querySelector(".article-body span:not(.product-type):not(.article-date)").textContent = description;
    card.querySelector(".article-date").textContent = date;
  });

  if (quoteForm?.elements.subject) {
    quoteForm.elements.subject.placeholder = copy.placeholders.subject;
  }

  if (quoteForm?.elements.message) {
    quoteForm.elements.message.placeholder = copy.placeholders.message;
  }
}

languageToggle?.addEventListener("click", () => {
  currentLanguage = currentLanguage === "en" ? "zh" : "en";
  localStorage.setItem("siteLanguage", currentLanguage);
  applyLanguage(currentLanguage);
});

applyLanguage(currentLanguage);

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
