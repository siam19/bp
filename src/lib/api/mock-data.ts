import type { Drop, Product, MediaCard, MediaAsset, Variant } from '$lib/types';

const createMedia = (id: string, text: string): MediaAsset => ({
  id,
  url: `https://placehold.co/600x800?text=${encodeURIComponent(text)}`,
  alt: text,
  width: 600,
  height: 800,
  mimeType: 'image/jpeg',
  filesize: 1024,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  sizes: {
    thumbnail: {
      url: `https://placehold.co/300x400?text=${encodeURIComponent(text)}`,
      width: 300,
      height: 400
    },
    card: {
      url: `https://placehold.co/400x533?text=${encodeURIComponent(text)}`,
      width: 400,
      height: 533
    }
  }
});

export const mockMediaAssets = {
  dropBanner1: createMedia('m1', 'Drop 1 Banner'),
  dropBanner2: createMedia('m2', 'Drop 2 Banner'),
  product1Front: createMedia('m3', 'T-Shirt Front'),
  product1Back: createMedia('m4', 'T-Shirt Back'),
  product2Front: createMedia('m5', 'Hoodie Front'),
  product2Back: createMedia('m6', 'Hoodie Back'),
  gallery1: createMedia('m7', 'Gallery 1'),
  gallery2: createMedia('m8', 'Gallery 2'),
  gallery3: createMedia('m9', 'Gallery 3'),
};

export const mockVariants: Variant[] = [
  { id: 'v1', size: 'S', stock_count: 10, parent_product: 'p1', updatedAt: '', createdAt: '' },
  { id: 'v2', size: 'M', stock_count: 5, parent_product: 'p1', updatedAt: '', createdAt: '' },
  { id: 'v3', size: 'L', stock_count: 0, parent_product: 'p1', updatedAt: '', createdAt: '' },
  { id: 'v4', size: 'M', stock_count: 20, parent_product: 'p2', updatedAt: '', createdAt: '' },
  { id: 'v5', size: 'L', stock_count: 15, parent_product: 'p2', updatedAt: '', createdAt: '' },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    slug: 'cyber-tee',
    name: 'Cyber Tee',
    price: 2500,
    status: 'AVAILABLE',
    images: {
      front: mockMediaAssets.product1Front,
      back: mockMediaAssets.product1Back,
    },
    variants: {
      docs: [mockVariants[0], mockVariants[1], mockVariants[2]],
      totalDocs: 3
    },
    description: [
      { blockType: 'text_block', content: 'A futuristic cyberpunk t-shirt.' }
    ],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    slug: 'neon-hoodie',
    name: 'Neon Hoodie',
    price: 4500,
    status: 'AVAILABLE',
    images: {
      front: mockMediaAssets.product2Front,
      back: mockMediaAssets.product2Back,
    },
    variants: {
      docs: [mockVariants[3], mockVariants[4]],
      totalDocs: 2
    },
    description: [
      { blockType: 'text_block', content: 'Glow in the dark hoodie.' }
    ],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
];

export const mockDrops: Drop[] = [
  {
    id: 'd1',
    slug: 'genesis-drop',
    name: 'Genesis Drop',
    status: 'ACTIVE',
    release_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    end_date: new Date(Date.now() + 86400000 * 7).toISOString(), // Next week
    products: [mockProducts[0], mockProducts[1]],
    assets: {
      banners: [mockMediaAssets.dropBanner1],
      video_embed_url: null
    },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'd2',
    slug: 'future-echoes',
    name: 'Future Echoes',
    status: 'SCHEDULED',
    release_date: new Date(Date.now() + 86400000 * 14).toISOString(), // 2 weeks
    products: [],
    assets: {
      banners: [mockMediaAssets.dropBanner2],
    },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'd3',
    slug: 'legacy-archive',
    name: 'Legacy Archive',
    status: 'ARCHIVED',
    release_date: new Date(Date.now() - 86400000 * 30).toISOString(), // Month ago
    products: [],
    assets: {
      banners: [mockMediaAssets.dropBanner1],
    },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
];

export const mockMediaCards: MediaCard[] = [
  {
    id: 'mc1',
    name: 'Vibe Check',
    media: mockMediaAssets.gallery1,
    tagged_products: [mockProducts[0]],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mc2',
    name: 'Night City',
    media: mockMediaAssets.gallery2,
    tagged_products: [mockProducts[1]],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mc3',
    name: 'Glitch',
    media: mockMediaAssets.gallery3,
    tagged_products: [],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
];
