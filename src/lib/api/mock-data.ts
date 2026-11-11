import type {
  Drop,
  Product,
  MediaCard,
  MediaAsset,
  Variant,
  ShopProduct,
  ShopDrop,
  ShopMediaCard,
  ShopInfoPage,
  Order
} from '$lib/types';

const createMedia = (id: string, text: string, url?: string): MediaAsset => ({
  id,
  url: url ?? `https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80`,
  filename: url ?? `https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80`,
  alt: text,
  width: 600,
  height: 800,
  mimeType: 'image/jpeg',
  filesize: 1024,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  sizes: {
    thumbnail: {
      url: url ?? `https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80`,
      width: 300,
      height: 400
    },
    card: {
      url: url ?? `https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80`,
      width: 400,
      height: 533
    }
  }
});

export const mockMediaAssets = {
  dropBanner1: createMedia('m1', 'Genesis Drop Banner', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1400&q=80'),
  dropBanner2: createMedia('m2', 'Neon Monsoons Banner', 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1400&q=80'),
  product1Front: createMedia('m3', 'Cyber Tee Front', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'),
  product1Back: createMedia('m4', 'Cyber Tee Back', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'),
  product2Front: createMedia('m5', 'Neon Hoodie Front', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'),
  product2Back: createMedia('m6', 'Neon Hoodie Back', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'),
  gallery1: createMedia('m7', 'Gallery 1', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'),
  gallery2: createMedia('m8', 'Gallery 2', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'),
  gallery3: createMedia('m9', 'Gallery 3', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'),
};

export const mockVariants: Variant[] = [
  { id: 'v1', sku: 'BP-CT-XS', size: 'XS', stock_count: 5, parent_product: 'p1', updatedAt: '', createdAt: '' },
  { id: 'v2', sku: 'BP-CT-S', size: 'S', stock_count: 12, parent_product: 'p1', updatedAt: '', createdAt: '' },
  { id: 'v3', sku: 'BP-CT-M', size: 'M', stock_count: 8, parent_product: 'p1', updatedAt: '', createdAt: '' },
  { id: 'v4', sku: 'BP-CT-L', size: 'L', stock_count: 0, parent_product: 'p1', updatedAt: '', createdAt: '' },
  { id: 'v5', sku: 'BP-CT-XL', size: 'XL', stock_count: 4, parent_product: 'p1', updatedAt: '', createdAt: '' },
  { id: 'v6', sku: 'BP-NAH-S', size: 'S', stock_count: 6, parent_product: 'p2', updatedAt: '', createdAt: '' },
  { id: 'v7', sku: 'BP-NAH-M', size: 'M', stock_count: 15, parent_product: 'p2', updatedAt: '', createdAt: '' },
  { id: 'v8', sku: 'BP-NAH-L', size: 'L', stock_count: 10, parent_product: 'p2', updatedAt: '', createdAt: '' },
  { id: 'v9', sku: 'BP-NAH-XL', size: 'XL', stock_count: 3, parent_product: 'p2', updatedAt: '', createdAt: '' },
];

export const mockShopProducts: ShopProduct[] = [
  {
    id: 'p1',
    slug: 'cyber-tee',
    name: 'Cyber Tee',
    price: 2400,
    status: 'AVAILABLE',
    featured: true,
    tags: ['T-Shirt', 'Streetwear', 'Cyberpunk'],
    images: {
      front: {
        filename: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        thumbnail: { filename: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80' }
      },
      back: {
        filename: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
      },
      profile: {
        filename: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'
      }
    },
    variants: [
      { id: 'v1', sku: 'BP-CT-XS', size: 'XS', stock_count: 5 },
      { id: 'v2', sku: 'BP-CT-S', size: 'S', stock_count: 12 },
      { id: 'v3', sku: 'BP-CT-M', size: 'M', stock_count: 8 },
      { id: 'v4', sku: 'BP-CT-L', size: 'L', stock_count: 0 },
      { id: 'v5', sku: 'BP-CT-XL', size: 'XL', stock_count: 4 }
    ],
    description: [
      { blockType: 'text_block', content: 'Heavyweight 280 GSM combed cotton. Acid-washed charcoal finish with cybernetic typography screenprinted across the spine. Boxy oversized silhouette designed in Dhaka.' }
    ],
    related_products: [{ id: 'p2' }, { id: 'p3' }]
  },
  {
    id: 'p2',
    slug: 'neon-acid-hoodie',
    name: 'Neon Acid Hoodie',
    price: 4500,
    status: 'AVAILABLE',
    featured: true,
    tags: ['Hoodie', 'Outerwear', 'Reflective'],
    images: {
      front: {
        filename: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        thumbnail: { filename: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80' }
      },
      back: {
        filename: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
      }
    },
    variants: [
      { id: 'v6', sku: 'BP-NAH-S', size: 'S', stock_count: 6 },
      { id: 'v7', sku: 'BP-NAH-M', size: 'M', stock_count: 15 },
      { id: 'v8', sku: 'BP-NAH-L', size: 'L', stock_count: 10 },
      { id: 'v9', sku: 'BP-NAH-XL', size: 'XL', stock_count: 3 }
    ],
    description: [
      { blockType: 'text_block', content: '420 GSM brushback fleece hoodie with 3M reflective safety piping along sleeve seams and custom matte black hardware. Deep cowl hood designed for monsoons.' }
    ],
    related_products: [{ id: 'p1' }, { id: 'p4' }]
  },
  {
    id: 'p3',
    slug: 'piuma-stealth-jacket',
    name: 'Piuma Stealth Jacket',
    price: 6800,
    status: 'AVAILABLE',
    featured: true,
    tags: ['Jacket', 'Techwear', 'Waterproof'],
    images: {
      front: {
        filename: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
        thumbnail: { filename: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=300&q=80' }
      }
    },
    variants: [
      { id: 'v10', sku: 'BP-PSJ-M', size: 'M', stock_count: 7 },
      { id: 'v11', sku: 'BP-PSJ-L', size: 'L', stock_count: 5 },
      { id: 'v12', sku: 'BP-PSJ-XL', size: 'XL', stock_count: 2 }
    ],
    description: [
      { blockType: 'text_block', content: 'Engineered 3-layer weatherproof laminated nylon with taped waterproof zippers. Magnetic quick-release chest compartments and stowaway hood.' }
    ],
    related_products: [{ id: 'p1' }, { id: 'p2' }]
  },
  {
    id: 'p4',
    slug: 'tactical-cargo-pants',
    name: 'Tactical Cargo Pants',
    price: 3600,
    status: 'AVAILABLE',
    featured: false,
    tags: ['Bottoms', 'Cargo', 'Techwear'],
    images: {
      front: {
        filename: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
        thumbnail: { filename: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=300&q=80' }
      }
    },
    variants: [
      { id: 'v13', sku: 'BP-TCP-S', size: 'S', stock_count: 8 },
      { id: 'v14', sku: 'BP-TCP-M', size: 'M', stock_count: 14 },
      { id: 'v15', sku: 'BP-TCP-L', size: 'L', stock_count: 9 }
    ],
    description: [
      { blockType: 'text_block', content: 'Heavy ripstop build with articulated knee darts, dual bellows tactical pockets, and shock-cord adjustable hems.' }
    ],
    related_products: [{ id: 'p2' }, { id: 'p3' }]
  },
  {
    id: 'p5',
    slug: 'glitch-matrix-sweatshirt',
    name: 'Glitch Matrix Sweatshirt',
    price: 3200,
    status: 'AVAILABLE',
    featured: false,
    tags: ['Sweatshirt', 'Graphic', 'Cyberpunk'],
    images: {
      front: {
        filename: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
        thumbnail: { filename: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=300&q=80' }
      }
    },
    variants: [
      { id: 'v16', sku: 'BP-GMS-M', size: 'M', stock_count: 11 },
      { id: 'v17', sku: 'BP-GMS-L', size: 'L', stock_count: 6 }
    ],
    description: [
      { blockType: 'text_block', content: 'Relaxed drop-shoulder crewneck with distorted halftone typography screenprint across the chest and forearms.' }
    ],
    related_products: [{ id: 'p1' }, { id: 'p4' }]
  },
  {
    id: 'p6',
    slug: 'monsoon-tactical-vest',
    name: 'Monsoon Tactical Vest',
    price: 3900,
    status: 'UPCOMING',
    featured: false,
    tags: ['Vest', 'Utility', 'Upcoming'],
    images: {
      front: {
        filename: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
        thumbnail: { filename: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=300&q=80' }
      }
    },
    variants: [
      { id: 'v18', sku: 'BP-MTV-OS', size: 'OS', stock_count: 0 }
    ],
    description: [
      { blockType: 'text_block', content: 'MOLLE-compatible modular harness vest with waterproof D-rings and detachable utility pouch.' }
    ],
    related_products: [{ id: 'p3' }, { id: 'p4' }]
  }
];

export const mockShopDrops: ShopDrop[] = [
  {
    id: 'd1',
    slug: 'genesis-drop',
    name: 'Genesis Drop',
    description: 'The inaugural collection fusing brutalist architecture with monsoon-proof streetwear. Engineered for the neon alleys of Old Dhaka.',
    status: 'ACTIVE',
    release_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    end_date: new Date(Date.now() + 86400000 * 5).toISOString(),
    products: [mockShopProducts[0], mockShopProducts[1], mockShopProducts[2]],
    assets: {
      banners: [
        { filename: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1400&q=80' },
        { filename: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80' }
      ],
      video_embed_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  },
  {
    id: 'd2',
    slug: 'neon-monsoons',
    name: 'Neon Monsoons',
    description: 'Upcoming capsule collection inspired by midnight rainfall over Motijheel and Gulshan flyovers.',
    status: 'SCHEDULED',
    release_date: new Date(Date.now() + 86400000 * 10).toISOString(),
    end_date: new Date(Date.now() + 86400000 * 17).toISOString(),
    products: [mockShopProducts[5]],
    assets: {
      banners: [
        { filename: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1400&q=80' }
      ]
    }
  },
  {
    id: 'd3',
    slug: 'dhaka-underworld-vol-1',
    name: 'Dhaka Underworld Vol. 1',
    description: 'First underground drop. Vaulted.',
    status: 'ARCHIVED',
    release_date: new Date(Date.now() - 86400000 * 45).toISOString(),
    end_date: new Date(Date.now() - 86400000 * 25).toISOString(),
    products: [mockShopProducts[3], mockShopProducts[4]],
    assets: {
      banners: [
        { filename: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80' }
      ]
    }
  },
  {
    id: 'd4',
    slug: 'cyber-rickshaw-legacy',
    name: 'Cyber Rickshaw Legacy',
    description: 'Tribute to heritage rickshaw art reimagined through sub-bass frequencies and neon pigments.',
    status: 'ARCHIVED',
    release_date: new Date(Date.now() - 86400000 * 90).toISOString(),
    end_date: new Date(Date.now() - 86400000 * 70).toISOString(),
    products: [mockShopProducts[0]],
    assets: {
      banners: [
        { filename: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80' }
      ]
    }
  }
];

export const mockShopMediaCards: ShopMediaCard[] = [
  {
    id: 'mc1',
    filename: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    height: 800,
    width: 600,
    tagged_products: [{ id: 'p1', slug: 'cyber-tee' }]
  },
  {
    id: 'mc2',
    filename: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    height: 800,
    width: 600,
    tagged_products: [{ id: 'p2', slug: 'neon-acid-hoodie' }]
  },
  {
    id: 'mc3',
    filename: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    height: 700,
    width: 600,
    tagged_products: [{ id: 'p1', slug: 'cyber-tee' }, { id: 'p3', slug: 'piuma-stealth-jacket' }]
  },
  {
    id: 'mc4',
    filename: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    height: 900,
    width: 600,
    tagged_products: [{ id: 'p4', slug: 'tactical-cargo-pants' }]
  },
  {
    id: 'mc5',
    filename: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    height: 800,
    width: 600,
    tagged_products: [{ id: 'p5', slug: 'glitch-matrix-sweatshirt' }]
  }
];

export const mockShopInfoPage: ShopInfoPage = {
  tabs: [
    {
      label: 'Drops',
      content: [
        {
          type: 'generic',
          sections: [
            {
              title: 'HOW DROPS WORK',
              body: 'Banglapunk operates strictly on limited collections ("Drops").\nEach capsule is produced in finite quantities and never restocked once sold out.'
            },
            {
              title: 'THE TIMER',
              body: 'Active drops feature a live countdown. When the countdown ends, items move to the Vaulted Archive.'
            },
            {
              title: 'AUTHENTICITY',
              body: 'Every item comes with a custom verification tag and serialized order hash verifiable on our receipt portal.'
            }
          ]
        }
      ]
    },
    {
      label: 'About Us',
      content: [
        {
          type: 'generic',
          sections: [
            {
              title: 'THE MANIFESTO',
              body: 'Conceived in the high-humidity, hyper-dense alleys of Dhaka.\nWe blend techwear functionality with brutalist aesthetics and Bengali street poetry.'
            },
            {
              title: 'MATERIALS & CUT',
              body: 'Custom-milled heavyweight combed cottons, ripstops, and weather-proof laminates built for tropical monsoons.'
            }
          ]
        }
      ]
    },
    {
      label: 'Policy',
      content: [
        {
          type: 'policy',
          policies: [
            {
              title: 'RETURNS & EXCHANGES',
              content: 'Exchanges accepted within 48 hours of delivery inside Dhaka for sizing issues. Items must be unwashed with tags intact.'
            },
            {
              title: 'SHIPPING & LOGISTICS',
              content: 'Inside Dhaka: 24 to 48 hours delivery (BDT 80). Nationwide delivery across Bangladesh via Steadfast Courier in 3-5 business days (BDT 150).'
            },
            {
              title: 'PAYMENT METHODS',
              content: 'We accept Cash on Delivery (COD) and bKash Send Money. For bKash, please include your Order ID in the payment reference.'
            }
          ]
        }
      ]
    },
    {
      label: 'Team',
      content: [
        {
          type: 'team',
          members: [
            {
              name: 'Bastok',
              role: 'Founder & Creative Lead',
              avatar: { filename: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
            },
            {
              name: 'Graam',
              role: 'Fullstack & Systems',
              avatar: { filename: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
            },
            {
              name: 'Zuhair',
              role: 'Garment Architect',
              avatar: { filename: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
            }
          ]
        }
      ]
    }
  ]
};

export function createMockOrder(orderId: string, authorized = false): Order {
  return {
    id: orderId,
    client_order_id: orderId,
    pin: '1234',
    customer_info: {
      name: authorized ? 'Rafiqul Islam' : 'R******* I****',
      phone: authorized ? '01712345689' : '017******89',
      address: authorized ? 'House 14, Road 7, Block C, Banani, Dhaka' : 'House **, Road *, Block *, Banani, Dhaka',
      delivery_area: 'Inside Dhaka',
      notes: 'Please ring bell 2B upon arrival.'
    },
    items: [
      {
        item_type: 'existing_product',
        name: 'Cyber Tee',
        price: 2400,
        quantity: 1,
        product: {
          id: 'p1',
          name: 'Cyber Tee',
          price: 2400,
          slug: 'cyber-tee',
          images: {
            front: {
              id: 'm1',
              filename: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
              updatedAt: '',
              createdAt: ''
            }
          },
          updatedAt: '',
          createdAt: ''
        },
        variant: {
          id: 'v2',
          size: 'M',
          stock_count: 8,
          parent_product: 'p1',
          updatedAt: '',
          createdAt: ''
        }
      },
      {
        item_type: 'existing_product',
        name: 'Neon Acid Hoodie',
        price: 4500,
        quantity: 1,
        product: {
          id: 'p2',
          name: 'Neon Acid Hoodie',
          price: 4500,
          slug: 'neon-acid-hoodie',
          images: {
            front: {
              id: 'm2',
              filename: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
              updatedAt: '',
              createdAt: ''
            }
          },
          updatedAt: '',
          createdAt: ''
        },
        variant: {
          id: 'v7',
          size: 'L',
          stock_count: 10,
          parent_product: 'p2',
          updatedAt: '',
          createdAt: ''
        }
      }
    ],
    total_amount: 6900,
    payment_method: 'BKASH',
    status: 'PROCESSING',
    tracking: {
      consignment_id: 98124,
      tracking_code: 'SF-DK-98124',
      current_status: 'Package picked up by Steadfast Courier'
    },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
}

// Backwards-compatible legacy exports
export const mockProducts: Product[] = [
  {
    id: 'p1',
    slug: 'cyber-tee',
    name: 'Cyber Tee',
    price: 2400,
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
      docs: [mockVariants[5], mockVariants[6]],
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
    release_date: new Date(Date.now() - 86400000).toISOString(),
    end_date: new Date(Date.now() + 86400000 * 7).toISOString(),
    products: [mockProducts[0], mockProducts[1]],
    assets: {
      banners: [mockMediaAssets.dropBanner1],
      video_embed_url: null
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
  }
];
