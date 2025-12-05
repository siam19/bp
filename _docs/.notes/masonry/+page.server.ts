    import type { PageServerLoad } from './$types';
import type { ProductCardProps, MediaCardProps, MasonryItem } from '$lib/types';

export const load: PageServerLoad = async () => {
    const products: ProductCardProps[] = [
        {
            productName: 'Handua Shirt',
            productImages: ['https://assets.banglapunk.com/test/335343bd734b4dcae1ed6add302287c4.jpg'],
            price: 5999,
            availableSizes: ['S', 'M', 'L', 'XL'],
            productId: 'handua-shirt'
        },
        {
            productName: 'Vintage Denim Jacket',
            productImages: ['https://i.pinimg.com/1200x/40/7e/81/407e813a6392d327f68dab9c96973090.jpg'],
            price: 8499,
            availableSizes: ['M', 'L', 'XL', 'XXL'],
            productId: 'vintage-denim-jacket'
        },
        {
            productName: 'Classic Bonkres Tee',
            productImages: ['https://i.pinimg.com/736x/f1/58/b0/f158b078fbcfaf08db01d0557486e254.jpg'],
            price: 2499,
            availableSizes: ['S', 'M', 'L'],
            productId: 'classic-white-tee'
        },
        {
            productName: 'Cargo Pants',
            productImages: ['https://i.pinimg.com/736x/fa/75/13/fa7513f5fab8fec460e8bcc24b10785e.jpg'],
            price: 6999,
            availableSizes: ['28', '30', '32', '34'],
            productId: 'cargo-pants'
        },
        {
            productName: 'Leather Boots',
            productImages: ['https://i.pinimg.com/736x/aa/a2/74/aaa274b69063041def05ea7c45950b4f.jpg'],
            price: 12999,
            availableSizes: ['7', '8', '9', '10'],
            productId: 'leather-boots'
        },
        {
            productName: 'Black Washed Shirt',
            productImages: ['https://i.pinimg.com/736x/12/aa/cb/12aacbfbdbc45057f50a0bd1dce9e46a.jpg'],
            price: 4999,
            availableSizes: ['S', 'M', 'L', 'XL'],
            productId: 'hoodie-black'
        },
        {
            productName: 'Chumki Pants',
            productImages: ['https://i.pinimg.com/736x/99/ba/92/99ba92603eaa7d85d0e39787f896a0b9.jpg'],
            price: 3499,
            availableSizes: ['S', 'M', 'L'],
            productId: 'chino-shorts'
        },
        {
            productName: 'Flannel Shirt Red',
            productImages: ['https://assets.banglapunk.com/test/335343bd734b4dcae1ed6add302287c4.jpg'],
            price: 4599,
            availableSizes: ['M', 'L', 'XL'],
            productId: 'flannel-shirt-red'
        }
    ];

    const mediaItems: MediaCardProps[] = [
        {
            mediaURL: 'https://media.banglapunk.com/bpboot-AHLELE.mp4',
            title: 'BP Boots Collection',
            taggedProducts: ['leather-boots', 'cargo-pants']
        },
        {
            mediaURL: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            title: 'Street Style Lookbook',
            taggedProducts: []
        },
        {
            mediaURL: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            title: 'Winter Collection 2025',
            taggedProducts: ['vintage-denim-jacket', 'hoodie-black']
        },
        {
            mediaURL: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            title: 'Urban Essentials',
            taggedProducts: ['classic-white-tee', 'chino-shorts']
        },
        {
            mediaURL: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            title: 'Casual Friday',
            taggedProducts: ['flannel-shirt-red']
        },
        {
            mediaURL: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            title: 'Autumn Vibes',
            taggedProducts: ['handua-shirt', 'cargo-pants']
        },
        {
            mediaURL: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            title: 'Summer Essentials',
            taggedProducts: ['classic-white-tee']
        },
        {
            mediaURL: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            title: 'Night Out Style',
            taggedProducts: ['leather-boots', 'vintage-denim-jacket']
        }
    ];

    // Shuffle utility for better visual distribution
    function shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Mix products and media items with better distribution
    // Strategy: alternate between product and media, then shuffle for variation
    const masonryItems: MasonryItem[] = [];
    
    // Interleave products and media
    const maxLength = Math.max(products.length, mediaItems.length);
    for (let i = 0; i < maxLength; i++) {
        if (i < products.length) {
            masonryItems.push({ 
                id: `p-${i + 1}`, 
                type: 'product', 
                product: products[i] 
            });
        }
        if (i < mediaItems.length) {
            masonryItems.push({ 
                id: `m-${i + 1}`, 
                type: 'media', 
                media: mediaItems[i] 
            });
        }
    }

    // Shuffle to prevent same-type stacking
    const shuffledItems = shuffle(masonryItems);

    return {
        items: shuffledItems
    };
};