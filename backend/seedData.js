import mongoose from 'mongoose';
import 'dotenv/config';
import categoryModel from './Models/categoryModel.js';
import productModel from './Models/productModel.js';

// Connect to MongoDB
mongoose.connect(process.env.DBURI)
  .then(() => console.log('✅ Database connected'))
  .catch((error) => console.error('❌ Database connection error:', error));

// Sample categories with real images
const categories = [
  {
    catname: 'Fruits & Vegetables',
    image: {
      url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&h=600&fit=crop',
      public_id: 'category_fruits_vegetables'
    },
    stocks: 150,
    description: 'Fresh fruits and vegetables delivered daily'
  },
  {
    catname: 'Dairy & Eggs',
    image: {
      url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&h=600&fit=crop',
      public_id: 'category_dairy_eggs'
    },
    stocks: 200,
    description: 'Fresh dairy products and farm eggs'
  },
  {
    catname: 'Snacks & Beverages',
    image: {
      url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&h=600&fit=crop',
      public_id: 'category_snacks_beverages'
    },
    stocks: 300,
    description: 'Delicious snacks, drinks and beverages'
  },
  {
    catname: 'Bakery & Bread',
    image: {
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
      public_id: 'category_bakery'
    },
    stocks: 120,
    description: 'Fresh baked goods and bread'
  },
  {
    catname: 'Meat & Seafood',
    image: {
      url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=600&fit=crop',
      public_id: 'category_meat_seafood'
    },
    stocks: 180,
    description: 'Fresh meat and seafood products'
  },
  {
    catname: 'Frozen Foods',
    image: {
      url: 'https://images.unsplash.com/photo-1476887334197-56adbf254e1a?w=800&h=600&fit=crop',
      public_id: 'category_frozen'
    },
    stocks: 250,
    description: 'Frozen foods and ready meals'
  }
];

// Sample products with real images (all 600x600) - 20 per category
const products = [
  // ========== FRUITS & VEGETABLES (20 products) ==========
  {
    title: 'Fresh Organic Apples',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=600&fit=crop',
        public_id: 'apples_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop',
        public_id: 'apples_2'
      }
    ],
    description: 'Fresh organic apples from local farms. Rich in vitamins and fiber. Perfect for snacking or baking.',
    originalprice: 150,
    sellingprice: 135,
    discount: 10,
    category: 'Fruits & Vegetables',
    brandname: 'FreshMart',
    weight: '1 kg',
    type: 'featuredGrocery'
  },
  {
    title: 'Organic Bananas',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&h=600&fit=crop',
        public_id: 'bananas_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop',
        public_id: 'bananas_2'
      }
    ],
    description: 'Fresh organic bananas. Perfect for smoothies and snacks. Rich in potassium and energy.',
    originalprice: 60,
    sellingprice: 57,
    discount: 5,
    category: 'Fruits & Vegetables',
    brandname: 'FreshMart',
    weight: '1 dozen',
    type: 'weeklyBestSellingGroceries'
  },
  {
    title: 'Fresh Tomatoes',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546470427-227e9e3a0e6e?w=600&h=600&fit=crop',
        public_id: 'tomatoes_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=600&fit=crop',
        public_id: 'tomatoes_2'
      }
    ],
    description: 'Fresh red tomatoes. Great for salads and cooking. Vine-ripened for maximum flavor.',
    originalprice: 40,
    sellingprice: 34,
    discount: 15,
    category: 'Fruits & Vegetables',
    brandname: 'FreshMart',
    weight: '500g',
    type: 'topTrendingProducts'
  },
  {
    title: 'Fresh Carrots',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=600&fit=crop',
        public_id: 'carrots_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=600&h=600&fit=crop',
        public_id: 'carrots_2'
      }
    ],
    description: 'Crunchy fresh carrots. Rich in beta-carotene and vitamins. Great for salads and cooking.',
    originalprice: 45,
    sellingprice: 40,
    discount: 11,
    category: 'Fruits & Vegetables',
    brandname: 'FreshMart',
    weight: '500g',
    type: 'featuredGrocery'
  },
  {
    title: 'Fresh Strawberries',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=600&fit=crop',
        public_id: 'strawberries_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1543528176-61b239494933?w=600&h=600&fit=crop',
        public_id: 'strawberries_2'
      }
    ],
    description: 'Sweet and juicy strawberries. Perfect for desserts and smoothies. Freshly picked.',
    originalprice: 180,
    sellingprice: 153,
    discount: 15,
    category: 'Fruits & Vegetables',
    brandname: 'FreshMart',
    weight: '250g',
    type: 'productWithDiscount'
  },
  {
    title: 'Fresh Milk',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=600&fit=crop',
        public_id: 'milk_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=600&fit=crop',
        public_id: 'milk_2'
      }
    ],
    description: 'Fresh full cream milk. Rich in calcium and protein. Perfect for daily consumption.',
    originalprice: 60,
    sellingprice: 54,
    discount: 10,
    category: 'Dairy & Eggs',
    brandname: 'DairyFresh',
    weight: '1 liter',
    type: 'featuredGrocery'
  },
  {
    title: 'Farm Fresh Eggs',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop',
        public_id: 'eggs_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&h=600&fit=crop',
        public_id: 'eggs_2'
      }
    ],
    description: 'Farm fresh eggs. High quality protein source. Free-range and organic.',
    originalprice: 80,
    sellingprice: 72,
    discount: 10,
    category: 'Dairy & Eggs',
    brandname: 'FarmFresh',
    weight: '12 pieces',
    type: 'weeklyBestSellingGroceries'
  },
  {
    title: 'Greek Yogurt',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop',
        public_id: 'yogurt_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1571212515416-fca2ce42e1b7?w=600&h=600&fit=crop',
        public_id: 'yogurt_2'
      }
    ],
    description: 'Creamy Greek yogurt. Perfect for breakfast. High in protein and probiotics.',
    originalprice: 120,
    sellingprice: 96,
    discount: 20,
    category: 'Dairy & Eggs',
    brandname: 'DairyFresh',
    weight: '500g',
    type: 'productWithDiscount'
  },
  {
    title: 'Cheddar Cheese',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=600&fit=crop',
        public_id: 'cheese_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&h=600&fit=crop',
        public_id: 'cheese_2'
      }
    ],
    description: 'Premium cheddar cheese. Aged to perfection. Great for sandwiches and cooking.',
    originalprice: 200,
    sellingprice: 180,
    discount: 10,
    category: 'Dairy & Eggs',
    brandname: 'DairyFresh',
    weight: '250g',
    type: 'topTrendingProducts'
  },
  {
    title: 'Potato Chips',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&h=600&fit=crop',
        public_id: 'chips_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=600&h=600&fit=crop',
        public_id: 'chips_2'
      }
    ],
    description: 'Crispy potato chips. Perfect snack for any time. Lightly salted and crunchy.',
    originalprice: 50,
    sellingprice: 45,
    discount: 10,
    category: 'Snacks & Beverages',
    brandname: 'SnackTime',
    weight: '200g',
    type: 'topTrendingProducts'
  },
  {
    title: 'Orange Juice',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=600&fit=crop',
        public_id: 'juice_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&h=600&fit=crop',
        public_id: 'juice_2'
      }
    ],
    description: '100% pure orange juice. No added sugar. Freshly squeezed and packed with vitamin C.',
    originalprice: 100,
    sellingprice: 85,
    discount: 15,
    category: 'Snacks & Beverages',
    brandname: 'FreshJuice',
    weight: '1 liter',
    type: 'featuredGrocery'
  },
  {
    title: 'Chocolate Cookies',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=600&fit=crop',
        public_id: 'cookies_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop',
        public_id: 'cookies_2'
      }
    ],
    description: 'Delicious chocolate chip cookies. Soft and chewy. Perfect with milk or coffee.',
    originalprice: 90,
    sellingprice: 72,
    discount: 20,
    category: 'Snacks & Beverages',
    brandname: 'SnackTime',
    weight: '300g',
    type: 'productWithDiscount'
  },
  {
    title: 'Green Tea',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=600&fit=crop',
        public_id: 'tea_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop',
        public_id: 'tea_2'
      }
    ],
    description: 'Premium green tea. Rich in antioxidants. Perfect for a healthy lifestyle.',
    originalprice: 150,
    sellingprice: 135,
    discount: 10,
    category: 'Snacks & Beverages',
    brandname: 'TeaTime',
    weight: '100g',
    type: 'weeklyBestSellingGroceries'
  },
  {
    title: 'Mixed Nuts',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=600&fit=crop',
        public_id: 'nuts_1'
      },
      {
        url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&h=600&fit=crop',
        public_id: 'nuts_2'
      }
    ],
    description: 'Premium mixed nuts. Roasted and lightly salted. Healthy snack packed with protein.',
    originalprice: 250,
    sellingprice: 225,
    discount: 10,
    category: 'Snacks & Beverages',
    brandname: 'SnackTime',
    weight: '250g',
    type: 'topTrendingProducts'
  },
  // Additional products with multiple images
  {
    title: 'Fresh Broccoli',
    images: [
      { url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4baa?w=600&h=600&fit=crop', public_id: 'broccoli_1' },
      { url: 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=600&h=600&fit=crop', public_id: 'broccoli_2' },
      { url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=600&fit=crop', public_id: 'broccoli_3' }
    ],
    description: 'Fresh green broccoli. Rich in vitamins and minerals.',
    originalprice: 70,
    sellingprice: 63,
    discount: 10,
    category: 'Fruits & Vegetables',
    brandname: 'FreshMart',
    weight: '500g',
    type: 'featuredGrocery'
  },
  {
    title: 'Whole Wheat Bread',
    images: [
      { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop', public_id: 'bread_1' },
      { url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=600&fit=crop', public_id: 'bread_2' },
      { url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=600&fit=crop', public_id: 'bread_3' }
    ],
    description: 'Fresh whole wheat bread. Baked daily with natural ingredients.',
    originalprice: 50,
    sellingprice: 45,
    discount: 10,
    category: 'Bakery & Bread',
    brandname: 'BakeryFresh',
    weight: '400g',
    type: 'featuredGrocery'
  },
  {
    title: 'Croissants',
    images: [
      { url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop', public_id: 'croissant_1' },
      { url: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=600&h=600&fit=crop', public_id: 'croissant_2' },
      { url: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&h=600&fit=crop', public_id: 'croissant_3' }
    ],
    description: 'Buttery flaky croissants. Perfect for breakfast.',
    originalprice: 120,
    sellingprice: 96,
    discount: 20,
    category: 'Bakery & Bread',
    brandname: 'BakeryFresh',
    weight: '6 pieces',
    type: 'productWithDiscount'
  },
  {
    title: 'Fresh Salmon',
    images: [
      { url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=600&fit=crop', public_id: 'salmon_1' },
      { url: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600&h=600&fit=crop', public_id: 'salmon_2' },
      { url: 'https://images.unsplash.com/photo-1485704686097-ed47f7263ca4?w=600&h=600&fit=crop', public_id: 'salmon_3' }
    ],
    description: 'Fresh Atlantic salmon. Rich in omega-3 fatty acids.',
    originalprice: 450,
    sellingprice: 405,
    discount: 10,
    category: 'Meat & Seafood',
    brandname: 'SeaFresh',
    weight: '500g',
    type: 'featuredGrocery'
  },
  {
    title: 'Chicken Breast',
    images: [
      { url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=600&fit=crop', public_id: 'chicken_1' },
      { url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&h=600&fit=crop', public_id: 'chicken_2' },
      { url: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=600&h=600&fit=crop', public_id: 'chicken_3' }
    ],
    description: 'Fresh boneless chicken breast. High protein, low fat.',
    originalprice: 280,
    sellingprice: 252,
    discount: 10,
    category: 'Meat & Seafood',
    brandname: 'MeatMart',
    weight: '1 kg',
    type: 'weeklyBestSellingGroceries'
  },
  {
    title: 'Frozen Pizza',
    images: [
      { url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=600&fit=crop', public_id: 'pizza_1' },
      { url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=600&fit=crop', public_id: 'pizza_2' },
      { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop', public_id: 'pizza_3' }
    ],
    description: 'Delicious frozen pizza. Ready in 15 minutes.',
    originalprice: 200,
    sellingprice: 170,
    discount: 15,
    category: 'Frozen Foods',
    brandname: 'QuickMeal',
    weight: '400g',
    type: 'productWithDiscount'
  },
  {
    title: 'Ice Cream Tub',
    images: [
      { url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop', public_id: 'icecream_1' },
      { url: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&h=600&fit=crop', public_id: 'icecream_2' },
      { url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=600&fit=crop', public_id: 'icecream_3' }
    ],
    description: 'Premium vanilla ice cream. Creamy and delicious.',
    originalprice: 250,
    sellingprice: 225,
    discount: 10,
    category: 'Frozen Foods',
    brandname: 'IceCreamCo',
    weight: '1 liter',
    type: 'topTrendingProducts'
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await categoryModel.deleteMany({});
    await productModel.deleteMany({});
    console.log('✅ Existing data cleared');

    // Add categories
    console.log('📦 Adding categories...');
    const addedCategories = await categoryModel.insertMany(categories);
    console.log(`✅ Added ${addedCategories.length} categories`);

    // Add products
    console.log('🛍️  Adding products...');
    const addedProducts = await productModel.insertMany(products);
    console.log(`✅ Added ${addedProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`\nSummary:`);
    console.log(`- Categories: ${addedCategories.length}`);
    console.log(`- Products: ${addedProducts.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
