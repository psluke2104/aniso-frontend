/* ───────────────────────────────────────────────────
   shopify-client.js — Headless Shopify Storefront API
   ─────────────────────────────────────────────────── */

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────
  // Replace these with your real Shopify store values
  const SHOPIFY_DOMAIN = 'your-store.myshopify.com'; // e.g. aniso-nightwear.myshopify.com
  const STOREFRONT_TOKEN = 'your-storefront-access-token'; // public token (safe for client-side)
  const API_VERSION = '2024-01';
  const GRAPHQL_URL = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // ── Helpers ─────────────────────────────────────

  function cacheGet(key) {
    try {
      const raw = sessionStorage.getItem('shopify_' + key);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem('shopify_' + key); return null; }
      return data;
    } catch { return null; }
  }

  function cacheSet(key, data) {
    try { sessionStorage.setItem('shopify_' + key, JSON.stringify({ data, ts: Date.now() })); } catch {}
  }

  async function shopifyFetch(query, variables = {}) {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`Shopify API ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);
    return json.data;
  }

  // ── Transform Shopify → internal schema ─────────

  function transformProduct(node) {
    const images = node.images.edges.map(e => ({ src: e.node.url, alt: e.node.altText || node.title }));
    const variants = node.variants.edges.map(e => ({
      id: e.node.id,
      title: e.node.title,
      price: parseFloat(e.node.price.amount),
      compareAtPrice: e.node.compareAtPrice ? parseFloat(e.node.compareAtPrice.amount) : null,
      available: e.node.availableForSale,
    }));
    const tags = node.tags || [];
    const price = variants.length ? variants[0].price : 0;
    const compareAtPrice = variants.length ? variants[0].compareAtPrice : null;

    return {
      id: node.id,
      handle: node.handle,
      title: node.title,
      description: node.description,
      descriptionHtml: node.descriptionHtml,
      price,
      compareAtPrice,
      images,
      variants,
      tags,
      category: node.productType || '',
      categorySlug: (node.productType || '').toLowerCase().replace(/\s+/g, '-'),
      availableForSale: node.availableForSale,
      sizes: variants.map(v => v.title).filter(t => ['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(t)),
      material: node.metafield ? node.metafield.value : '',
      colors: [],
    };
  }

  // ── GraphQL Fragments ──────────────────────────

  const PRODUCT_FRAGMENT = `
    fragment ProductFields on Product {
      id
      handle
      title
      description
      descriptionHtml
      productType
      tags
      availableForSale
      metafield(namespace: "custom", key: "material") { value }
      images(first: 10) {
        edges { node { url altText } }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
          }
        }
      }
    }
  `;

  // ── Public API ─────────────────────────────────

  /** Fetch all products (paginated, up to 100) */
  async function fetchAllProducts() {
    const cached = cacheGet('all_products');
    if (cached) return cached;

    const query = `
      ${PRODUCT_FRAGMENT}
      query AllProducts($first: Int!) {
        products(first: $first) {
          edges { node { ...ProductFields } }
        }
      }
    `;
    const data = await shopifyFetch(query, { first: 100 });
    const products = data.products.edges.map(e => transformProduct(e.node));
    cacheSet('all_products', products);
    return products;
  }

  /** Fetch a single product by handle */
  async function fetchProductByHandle(handle) {
    const cached = cacheGet('product_' + handle);
    if (cached) return cached;

    const query = `
      ${PRODUCT_FRAGMENT}
      query ProductByHandle($handle: String!) {
        productByHandle(handle: $handle) { ...ProductFields }
      }
    `;
    const data = await shopifyFetch(query, { handle });
    if (!data.productByHandle) return null;
    const product = transformProduct(data.productByHandle);
    cacheSet('product_' + handle, product);
    return product;
  }

  /** Fetch products in a collection by handle */
  async function fetchCollection(collectionHandle) {
    const cached = cacheGet('collection_' + collectionHandle);
    if (cached) return cached;

    const query = `
      ${PRODUCT_FRAGMENT}
      query Collection($handle: String!, $first: Int!) {
        collectionByHandle(handle: $handle) {
          title
          products(first: $first) {
            edges { node { ...ProductFields } }
          }
        }
      }
    `;
    const data = await shopifyFetch(query, { handle: collectionHandle, first: 50 });
    if (!data.collectionByHandle) return [];
    const products = data.collectionByHandle.products.edges.map(e => transformProduct(e.node));
    cacheSet('collection_' + collectionHandle, products);
    return products;
  }

  /** Search products by query string */
  async function shopifySearchProducts(queryStr) {
    const cached = cacheGet('search_' + queryStr);
    if (cached) return cached;

    const query = `
      ${PRODUCT_FRAGMENT}
      query Search($query: String!, $first: Int!) {
        products(first: $first, query: $query) {
          edges { node { ...ProductFields } }
        }
      }
    `;
    const data = await shopifyFetch(query, { query: queryStr, first: 20 });
    const products = data.products.edges.map(e => transformProduct(e.node));
    cacheSet('search_' + queryStr, products);
    return products;
  }

  // ── Fallback wrapper ───────────────────────────
  // Uses local PRODUCTS array (from product-data.js) if Shopify API is not configured or fails

  function isConfigured() {
    return SHOPIFY_DOMAIN !== 'your-store.myshopify.com' && STOREFRONT_TOKEN !== 'your-storefront-access-token';
  }

  async function withFallback(apiFn, localFn) {
    if (!isConfigured()) return localFn();
    try {
      return await apiFn();
    } catch (err) {
      console.warn('[Shopify] API call failed, using local data:', err.message);
      return localFn();
    }
  }

  // ── Exposed interface ──────────────────────────

  window.ShopifyClient = {
    isConfigured,

    getAllProducts() {
      return withFallback(
        () => fetchAllProducts(),
        () => (typeof PRODUCTS !== 'undefined' ? PRODUCTS : [])
      );
    },

    getProductByHandle(handle) {
      return withFallback(
        () => fetchProductByHandle(handle),
        () => (typeof getProductByHandle === 'function' ? getProductByHandle(handle) : null)
      );
    },

    getCollection(handle) {
      return withFallback(
        () => fetchCollection(handle),
        () => {
          if (typeof getProductsByCategory !== 'function') return [];
          return getProductsByCategory(handle);
        }
      );
    },

    searchProducts(query) {
      return withFallback(
        () => shopifySearchProducts(query),
        () => (typeof searchProducts === 'function' ? searchProducts(query) : [])
      );
    },

    getProductsByTag(tag) {
      return withFallback(
        () => fetchAllProducts().then(all => all.filter(p => p.tags.includes(tag))),
        () => (typeof getProductsByTag === 'function' ? getProductsByTag(tag) : [])
      );
    },
  };
})();
