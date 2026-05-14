const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../content-api/data');
const SITE_DIR = path.join(__dirname, '../site');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

async function readJsonFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
}

async function buildSite() {
  console.log('Building static site...');
  
  try {
    // 读取产品数据
    const products = await readJsonFile(PRODUCTS_FILE);
    console.log(`Loaded ${products.length} products`);
    
    // 读取博客数据
    const posts = await readJsonFile(POSTS_FILE);
    console.log(`Loaded ${posts.length} posts`);
    
    // 步骤1：同步数据到前端 data 文件
    await syncDataFiles(products, posts);
    
    // 步骤2：生成产品详情页
    await generateProductPages(products);
    
    // 步骤3：生成博客详情页
    await generatePostPages(posts);
    
    // 步骤4：生成 sitemap.xml
    await generateSitemap(products, posts);
    
    console.log('\n✅ Static site build completed!');
    
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

async function syncDataFiles(products, posts) {
  // 生成产品轻量索引（仅包含列表展示所需字段）
  const lightIndex = products
    .filter(p => p.status === 'published')
    .map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      nameZh: p.nameZh,
      category: p.mainCategory,
      thumbnail: p.thumbnail || p.image,
      coverAlt: p.coverAlt || p.imageAlt || p.name,
      summary: p.summary,
      summaryZh: p.summaryZh,
      featured: p.featured || false,
      featuredOrder: p.featuredOrder || 999,
      sortOrder: p.sortOrder || 999,
      updatedAt: p.updatedAt
    }));
  
  // 更新前端产品数据文件（轻量索引）
  const productsJsContent = `export const products = ${JSON.stringify(lightIndex, null, 2)};`;
  await fs.writeFile(path.join(SITE_DIR, 'assets/data/products.js'), productsJsContent, 'utf8');
  console.log('Updated: site/assets/data/products.js (light index)');
  
  // 生成博客轻量索引
  const lightPosts = posts
    .filter(post => post.status === 'published')
    .map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      titleZh: post.titleZh,
      category: post.category,
      categoryZh: post.categoryZh,
      coverImage: post.coverImage,
      coverAlt: post.coverAlt || post.title,
      excerpt: post.excerpt,
      excerptZh: post.excerptZh,
      featured: post.featured || false,
      sortOrder: post.sortOrder || 999,
      updatedAt: post.updatedAt
    }));
  
  // 更新前端博客数据文件（轻量索引）
  const postsJsContent = `export const posts = ${JSON.stringify(lightPosts, null, 2)};`;
  await fs.writeFile(path.join(SITE_DIR, 'assets/data/posts.js'), postsJsContent, 'utf8');
  console.log('Updated: site/assets/data/posts.js (light index)');
}

async function generateProductPages(products) {
  const publishedProducts = products.filter(p => p.status === 'published');
  
  for (const product of publishedProducts) {
    if (product.slug) {
      const productDir = path.join(SITE_DIR, 'products', product.slug);
      await fs.mkdir(productDir, { recursive: true });
      
      const html = generateProductHtml(product);
      await fs.writeFile(path.join(productDir, 'index.html'), html, 'utf8');
      console.log(`Generated: /products/${product.slug}/`);
    }
  }
}

async function generatePostPages(posts) {
  const publishedPosts = posts.filter(p => p.status === 'published');
  
  for (const post of publishedPosts) {
    if (post.slug) {
      const postDir = path.join(SITE_DIR, 'blog', post.slug);
      await fs.mkdir(postDir, { recursive: true });
      
      const html = generatePostHtml(post);
      await fs.writeFile(path.join(postDir, 'index.html'), html, 'utf8');
      console.log(`Generated: /blog/${post.slug}/`);
    }
  }
}

function generateProductHtml(product) {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${product.nameZh || product.name} | 稳胜石材</title>
    <meta name="description" content="${product.summaryZh || product.summary}">
    <meta property="og:title" content="${product.nameZh || product.name}">
    <meta property="og:description" content="${product.summaryZh || product.summary}">
    <meta property="og:image" content="${product.image}">
    <link rel="icon" href="/assets/images/favicon.png">
    <link rel="stylesheet" href="/assets/css/styles.css">
  </head>
  <body>
    <main>
      <article class="product-detail">
        <div class="product-header">
          <span class="product-category">${product.categoryZh || product.category}</span>
          <h1>${product.nameZh || product.name}</h1>
          ${product.badgeZh || product.badge ? `<span class="product-badge">${product.badgeZh || product.badge}</span>` : ''}
        </div>
        
        <div class="product-gallery">
          ${product.gallery?.map(img => `<img src="${img}" alt="${product.nameZh || product.name}">`).join('\n')}
        </div>
        
        <div class="product-content">
          <section class="product-summary">
            <p>${product.summaryZh || product.summary}</p>
          </section>
          
          <section class="product-description">
            <h2>产品介绍</h2>
            <p>${product.introZh || product.intro}</p>
          </section>
          
          <section class="product-specs">
            <h2>规格参数</h2>
            <dl>
              ${product.materialZh || product.material ? `<dt>材料</dt><dd>${product.materialZh || product.material}</dd>` : ''}
              ${product.usageZh || product.usage ? `<dt>适用场景</dt><dd>${product.usageZh || product.usage}</dd>` : ''}
              ${product.finishZh || product.finish ? `<dt>表面工艺</dt><dd>${product.finishZh || product.finish}</dd>` : ''}
              ${product.moqZh || product.moq ? `<dt>最小起订量</dt><dd>${product.moqZh || product.moq}</dd>` : ''}
              ${product.leadTimeZh || product.leadTime ? `<dt>交期</dt><dd>${product.leadTimeZh || product.leadTime}</dd>` : ''}
            </dl>
          </section>
          
          ${product.options?.length ? `
          <section class="product-options">
            <h2>可定制选项</h2>
            <ul>
              ${product.optionsZh?.length ? product.optionsZh.map(opt => `<li>${opt}</li>`).join('\n') : product.options.map(opt => `<li>${opt}</li>`).join('\n')}
            </ul>
          </section>
          ` : ''}
          
          ${product.faqs?.length ? `
          <section class="product-faqs">
            <h2>常见问题</h2>
            <dl>
              ${product.faqs.map(faq => `<dt>${faq.question}</dt><dd>${faq.answer}</dd>`).join('\n')}
            </dl>
          </section>
          ` : ''}
        </div>
      </article>
    </main>
    <script src="/assets/js/product-system.js"></script>
  </body>
</html>`;
}

function generatePostHtml(post) {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${post.titleZh || post.title} | 稳胜石材</title>
    <meta name="description" content="${post.excerptZh || post.excerpt}">
    <meta property="og:title" content="${post.titleZh || post.title}">
    <meta property="og:description" content="${post.excerptZh || post.excerpt}">
    <meta property="og:image" content="${post.coverImage}">
    <link rel="icon" href="/assets/images/favicon.png">
    <link rel="stylesheet" href="/assets/css/styles.css">
  </head>
  <body>
    <main>
      <article class="post-detail">
        <header class="post-header">
          <span class="post-category">${post.categoryZh || post.category}</span>
          <h1>${post.titleZh || post.title}</h1>
          <p class="post-excerpt">${post.excerptZh || post.excerpt}</p>
          ${post.coverImage ? `<img src="${post.coverImage}" alt="${post.coverAltZh || post.coverAlt || post.title}" class="post-cover">` : ''}
        </header>
        
        <div class="post-content">
          ${post.bodyZh || post.body}
        </div>
        
        ${post.faqs?.length ? `
        <section class="post-faqs">
          <h2>常见问题</h2>
          <dl>
            ${post.faqs.map(faq => `<dt>${faq.question}</dt><dd>${faq.answer}</dd>`).join('\n')}
          </dl>
        </section>
        ` : ''}
      </article>
    </main>
    <script src="/assets/js/post-system.js"></script>
  </body>
</html>`;
}

async function generateSitemap(products, posts) {
  const publishedProducts = products.filter(p => p.status === 'published');
  const publishedPosts = posts.filter(p => p.status === 'published');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.winwinstonecustom.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.winwinstonecustom.com/products.html</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.winwinstonecustom.com/blog.html</loc>
    <priority>0.9</priority>
  </url>
  ${publishedProducts.map(product => `
  <url>
    <loc>https://www.winwinstonecustom.com/products/${product.slug}/</loc>
    <priority>0.8</priority>
    <lastmod>${product.updatedAt || new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
  ${publishedPosts.map(post => `
  <url>
    <loc>https://www.winwinstonecustom.com/blog/${post.slug}/</loc>
    <priority>0.8</priority>
    <lastmod>${post.updatedAt || new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  await fs.writeFile(path.join(SITE_DIR, 'sitemap.xml'), sitemap, 'utf8');
  console.log('Generated: /sitemap.xml');
}

// 运行构建
buildSite();
