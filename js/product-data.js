/* ============================================================
   ANISO — Product Data Store
   All products in a structured array, ready for Shopify migration
   ============================================================ */

const PRODUCTS = [
  {
    id: '1',
    handle: 'ivory-reverie-set',
    title: 'Ivory Reverie Set',
    description: 'Whisper-soft satin that moves with you. Our signature sleep set in warm ivory — crafted for slow mornings and beautiful evenings alike.',
    price: 1799,
    compareAtPrice: null,
    category: 'Satin Set',
    categorySlug: 'satin',
    tags: ['new-arrival', 'bestseller', 'luxe'],
    material: '100% Premium Charmeuse Satin',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableForSale: true,
    images: [
      { src: 'https://images.pexels.com/photos/920385/pexels-photo-920385.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop', alt: 'Ivory Reverie Set' }
    ],
    colors: [
      { name: 'Ivory', hex: '#F5EDD8', image: 'https://images.pexels.com/photos/920385/pexels-photo-920385.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop' },
      { name: 'Champagne', hex: '#D4B896', image: 'https://images.pexels.com/photos/3807543/pexels-photo-3807543.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop' }
    ]
  },
  {
    id: '2',
    handle: 'blush-hour-set',
    title: 'Blush Hour Set',
    description: 'A warm, rosy satin set that wraps you in softness. The Blush Hour Set is for evenings that feel like a gentle exhale.',
    price: 1999,
    compareAtPrice: null,
    category: 'Satin Set',
    categorySlug: 'satin',
    tags: ['bestseller', 'luxe'],
    material: '100% Premium Charmeuse Satin',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableForSale: true,
    images: [
      { src: 'https://images.unsplash.com/photo-1750064139819-da3bf362e7b3?w=600&h=800&fit=crop&crop=faces,entropy&q=85', alt: 'Blush Hour Set' }
    ],
    colors: [
      { name: 'Blush', hex: '#F5DDD3' },
      { name: 'Rose', hex: '#E8B4A0' }
    ]
  },
  {
    id: '7',
    handle: 'star-dreamer-nightsuit',
    title: 'Star Dreamer Nightsuit',
    description: 'Playful prints meet cloud-soft cotton. The Star Dreamer is for nights that end with a smile.',
    price: 1199,
    compareAtPrice: null,
    category: 'Cute Nightsuit',
    categorySlug: 'nightsuit',
    tags: ['new-arrival', 'bestseller', '100-cotton'],
    material: '100% Premium Pima Cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableForSale: true,
    images: [
      { src: 'https://images.unsplash.com/photo-1755456785148-e567dbb6a034?w=600&h=800&fit=crop&crop=faces,entropy&q=85', alt: 'Star Dreamer Nightsuit' }
    ],
    colors: [
      { name: 'Lavender', hex: '#E8D5F0', image: 'https://images.unsplash.com/photo-1755456785148-e567dbb6a034?w=600&h=800&fit=crop&q=85' },
      { name: 'Blush', hex: '#F5DDD3', image: 'https://images.pexels.com/photos/6963182/pexels-photo-6963182.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop' }
    ]
  },
  {
    id: '8',
    handle: 'cloud-soft-nightsuit',
    title: 'Cloud Soft Nightsuit',
    description: 'Named for how it feels. The Cloud Soft nightsuit in breathable cotton is the definition of cozy.',
    price: 1099,
    compareAtPrice: null,
    category: 'Cute Nightsuit',
    categorySlug: 'nightsuit',
    tags: ['bestseller', '100-cotton'],
    material: '100% Premium Pima Cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableForSale: true,
    images: [
      { src: 'https://plus.unsplash.com/premium_photo-1663040451691-0c89005ce5cc?w=600&h=800&fit=crop&crop=faces,entropy&q=85', alt: 'Cloud Soft Nightsuit' }
    ],
    colors: [
      { name: 'Cream', hex: '#FAF0E6', image: 'https://plus.unsplash.com/premium_photo-1663040451691-0c89005ce5cc?w=600&h=800&fit=crop&q=85' },
      { name: 'Stone', hex: '#C8BFB6', image: 'https://images.pexels.com/photos/3807982/pexels-photo-3807982.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop' }
    ]
  },
  {
    id: '9',
    handle: 'blush-floral-nightsuit',
    title: 'Blush Floral Nightsuit',
    description: 'Delicate florals on the softest cotton. The Blush Floral is for the romantic at heart.',
    price: 999,
    compareAtPrice: null,
    category: 'Cute Nightsuit',
    categorySlug: 'nightsuit',
    tags: ['bestseller', '100-cotton'],
    material: '100% Premium Pima Cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableForSale: true,
    images: [
      { src: 'https://plus.unsplash.com/premium_photo-1664302034933-69eeafba6e18?w=600&h=800&fit=crop&crop=faces,entropy&q=85', alt: 'Blush Floral Nightsuit' }
    ],
    colors: [
      { name: 'Blush', hex: '#F5DDD3', image: 'https://plus.unsplash.com/premium_photo-1664302034933-69eeafba6e18?w=600&h=800&fit=crop&q=85' },
      { name: 'Peach', hex: '#E8B4A0', image: 'https://images.unsplash.com/photo-1755456785148-e567dbb6a034?w=600&h=800&fit=crop&q=85' }
    ]
  },
  {
    id: '10',
    handle: 'cotton-candy-stripe-nightsuit',
    title: 'Cotton Candy Stripe Nightsuit',
    description: 'Sweet stripes in candy-soft cotton. This nightsuit is playful, comfy, and effortlessly cute.',
    price: 1149,
    compareAtPrice: null,
    category: 'Cute Nightsuit',
    categorySlug: 'nightsuit',
    tags: ['new-arrival', 'bestseller', '100-cotton'],
    material: '100% Premium Pima Cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableForSale: true,
    images: [
      { src: 'https://images.pexels.com/photos/6963170/pexels-photo-6963170.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop', alt: 'Cotton Candy Stripe Nightsuit' }
    ],
    colors: [
      { name: 'Cream Stripe', hex: '#FAF0E6' },
      { name: 'Lavender Stripe', hex: '#E8D5F0' }
    ]
  },
  {
    id: '11',
    handle: 'moonlit-dreams-nightsuit',
    title: 'Moonlit Dreams Nightsuit',
    description: 'Dreamy prints under moonlight. This nightsuit is soft, flowy, and made for beautiful sleep.',
    price: 1249,
    compareAtPrice: null,
    category: 'Cute Nightsuit',
    categorySlug: 'nightsuit',
    tags: ['new-arrival', '100-cotton'],
    material: '100% Premium Pima Cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableForSale: true,
    images: [
      { src: 'https://images.pexels.com/photos/4473880/pexels-photo-4473880.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop', alt: 'Moonlit Dreams Nightsuit' }
    ],
    colors: [
      { name: 'Sky', hex: '#D5E8F0' },
      { name: 'Lavender', hex: '#E8D5F0' }
    ]
  },
  {
    id: '4',
    handle: 'cocoa-lounge-co-ord',
    title: 'Cocoa Lounge Co-ord',
    description: 'Rich, warm, and endlessly comfortable. The Cocoa Lounge Co-ord is your at-home uniform, elevated.',
    price: 1499,
    compareAtPrice: null,
    category: 'Lounge Set',
    categorySlug: 'lounge',
    tags: ['bestseller'],
    material: 'Premium Cotton Blend',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableForSale: true,
    images: [
      { src: 'https://images.unsplash.com/photo-1759229874709-a8d0de083b91?w=600&h=800&fit=crop&crop=faces,entropy&q=85', alt: 'Cocoa Lounge Co-ord' }
    ],
    colors: [
      { name: 'Cocoa', hex: '#D4B896', image: 'https://images.unsplash.com/photo-1759229874709-a8d0de083b91?w=600&h=800&fit=crop&q=85' },
      { name: 'Mocha', hex: '#8B6147', image: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=600&h=800&fit=crop&q=85' }
    ]
  },
  {
    id: '5',
    handle: 'dreamy-lounge-set',
    title: 'Dreamy Lounge Set',
    description: 'Light, airy, and impossibly soft. The Dreamy Lounge Set is for slow weekends and cozy evenings.',
    price: 1349,
    compareAtPrice: null,
    category: 'Lounge Set',
    categorySlug: 'lounge',
    tags: ['new-arrival'],
    material: 'Premium Cotton Blend',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableForSale: true,
    images: [
      { src: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=600&h=800&fit=crop&crop=faces,entropy&q=85', alt: 'Dreamy Lounge Set' }
    ],
    colors: [
      { name: 'Ivory', hex: '#E8E2DC' },
      { name: 'Stone', hex: '#C8BFB6' }
    ]
  }
];

// Helper functions
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getProductByHandle(handle) {
  return PRODUCTS.find(p => p.handle === handle);
}

function getProductsByCategory(slug) {
  if (slug === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.categorySlug === slug);
}

function getProductsByTag(tag) {
  return PRODUCTS.filter(p => p.tags.includes(tag));
}

function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.replace(/-/g, ' ').includes(q)) ||
    p.material.toLowerCase().includes(q)
  );
}
