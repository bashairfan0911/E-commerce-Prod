import mongoose from 'mongoose';
import 'dotenv/config';
import productModel from './Models/productModel.js';

// Connect to MongoDB
mongoose.connect(process.env.DBURI)
  .then(() => console.log('✅ Database connected'))
  .catch((error) => console.error('❌ Database connection error:', error));

const categories = ['Fruits & Vegetables', 'Dairy & Eggs', 'Snacks & Beverages', 'Bakery & Bread', 'Meat & Seafood', 'Frozen Foods'];
const brands = ['FreshMart', 'DairyFresh', 'SnackTime', 'BakeryFresh', 'MeatMart', 'SeaFresh', 'QuickMeal', 'IceCreamCo', 'TeaTime', 'FarmFresh'];
const types = ['featuredGrocery', 'weeklyBestSellingGroceries', 'topTrendingProducts', 'productWithDiscount'];

const productsData = [
  // Fruits & Vegetables
  { name: 'Organic Spinach', images: ['photo-1576045057995-568f588f82fb', 'photo-1576045057995-568f588f82fb'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Fresh Lettuce', images: ['photo-1622206151226-18ca2c9ab4a1', 'photo-1556801712-76c8eb07bbc9'], category: 'Fruits & Vegetables', weight: '1 piece' },
  { name: 'Red Bell Peppers', images: ['photo-1563565375-f3fdfdbefa83', 'photo-1525607551316-4a8e16d1f9ba'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Green Cucumbers', images: ['photo-1604977042946-1eecc30f269e', 'photo-1449300079323-02e209d9d3a6'], category: 'Fruits & Vegetables', weight: '1 kg' },
  { name: 'Sweet Potatoes', images: ['photo-1589927986089-35812388d1f4', 'photo-1601493700631-2b16ec4b4716'], category: 'Fruits & Vegetables', weight: '1 kg' },
  { name: 'Red Onions', images: ['photo-1618512496248-a07fe83aa8cb', 'photo-1587735243615-c03f25aaff15'], category: 'Fruits & Vegetables', weight: '1 kg' },
  { name: 'Fresh Garlic', images: ['photo-1580910051074-3eb694886505', 'photo-1612171653806-2f5b0c6b6e1a'], category: 'Fruits & Vegetables', weight: '250g' },
  { name: 'Ginger Root', images: ['photo-1599639957043-f3aa5c986398', 'photo-1615485500834-bc10199bc727'], category: 'Fruits & Vegetables', weight: '250g' },
  { name: 'Fresh Mushrooms', images: ['photo-1565688534245-05d6b5be184a', 'photo-1595613812551-e5e2e4e3e5b0'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Cherry Tomatoes', images: ['photo-1592841200221-a6898f307baa', 'photo-1561136594-7f68413baa99'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Baby Carrots', images: ['photo-1598170845058-32b9d6a5da37', 'photo-1447175008436-054170c2e979'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Fresh Celery', images: ['photo-1607305387299-a3d9611cd469', 'photo-1615485290382-441e4d049cb5'], category: 'Fruits & Vegetables', weight: '1 bunch' },
  { name: 'Green Beans', images: ['photo-1599119252851-de0e8f8c5b0e', 'photo-1603048588665-791ca8aea617'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Cauliflower', images: ['photo-1568584711271-e88a6c7d6d3e', 'photo-1510627489930-0c1b0bfb6785'], category: 'Fruits & Vegetables', weight: '1 piece' },
  { name: 'Fresh Cabbage', images: ['photo-1594282486552-05b4d80fbb9f', 'photo-1553621042-f6e147245754'], category: 'Fruits & Vegetables', weight: '1 piece' },
  { name: 'Butternut Squash', images: ['photo-1570586437263-ab629fccc818', 'photo-1477506350614-fcdc29a3b157'], category: 'Fruits & Vegetables', weight: '1 kg' },
  { name: 'Zucchini', images: ['photo-1597362925123-77861d3fbac7', 'photo-1566385101042-1a0aa0c1268c'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Eggplant', images: ['photo-1617347454431-f49d7ff5c3b1', 'photo-1615485290382-441e4d049cb5'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Fresh Corn', images: ['photo-1551754655-cd27e38d2076', 'photo-1603048588665-791ca8aea617'], category: 'Fruits & Vegetables', weight: '6 pieces' },
  { name: 'Sweet Peas', images: ['photo-1587735243615-c03f25aaff15', 'photo-1615485290382-441e4d049cb5'], category: 'Fruits & Vegetables', weight: '500g' },
  
  // Fruits
  { name: 'Fresh Blueberries', images: ['photo-1498557850523-fd3d118b962e', 'photo-1606800052052-f2c18c5c6a2f'], category: 'Fruits & Vegetables', weight: '250g' },
  { name: 'Fresh Raspberries', images: ['photo-1577069861033-55d04cec4ef5', 'photo-1577069861033-55d04cec4ef5'], category: 'Fruits & Vegetables', weight: '250g' },
  { name: 'Fresh Blackberries', images: ['photo-1588165171080-c89acfa5ee83', 'photo-1553621042-f6e147245754'], category: 'Fruits & Vegetables', weight: '250g' },
  { name: 'Fresh Grapes', images: ['photo-1599819177331-c8795c7f0c8e', 'photo-1601275868399-45bec4f4cd9d'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Fresh Watermelon', images: ['photo-1587049352846-4a222e784169', 'photo-1563114773-84221bd62daa'], category: 'Fruits & Vegetables', weight: '1 piece' },
  { name: 'Fresh Cantaloupe', images: ['photo-1621583441131-ec2f8d0e9c0c', 'photo-1600271886742-f049cd451bba'], category: 'Fruits & Vegetables', weight: '1 piece' },
  { name: 'Honeydew Melon', images: ['photo-1571575173700-afb9492e6a50', 'photo-1600271886742-f049cd451bba'], category: 'Fruits & Vegetables', weight: '1 piece' },
  { name: 'Fresh Pineapple', images: ['photo-1550258987-190a2d41a8ba', 'photo-1589820296156-2454bb8a6ad1'], category: 'Fruits & Vegetables', weight: '1 piece' },
  { name: 'Fresh Mangoes', images: ['photo-1553279768-865429fa0078', 'photo-1601493700631-2b16ec4b4716'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Fresh Kiwi', images: ['photo-1585059895524-72359e06133a', 'photo-1612528443702-f6741f70a049'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Fresh Oranges', images: ['photo-1582979512210-99b6a53386f9', 'photo-1611080626919-7cf5a9dbab5b'], category: 'Fruits & Vegetables', weight: '1 kg' },
  { name: 'Fresh Lemons', images: ['photo-1590502593747-42a996133562', 'photo-1587486937736-e7c6e5f06e7c'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Fresh Limes', images: ['photo-1582281298055-e25b95e0c2c3', 'photo-1600271886742-f049cd451bba'], category: 'Fruits & Vegetables', weight: '500g' },
  { name: 'Fresh Grapefruit', images: ['photo-1600271886742-f049cd451bba', 'photo-1611080626919-7cf5a9dbab5b'], category: 'Fruits & Vegetables', weight: '1 kg' },
  { name: 'Fresh Peaches', images: ['photo-1629828874514-944d8c5e8f37', 'photo-1587049352846-4a222e784169'], category: 'Fruits & Vegetables', weight: '500g' },
  
  // Dairy & Eggs
  { name: 'Whole Milk', images: ['photo-1563636619-e9143da7973b', 'photo-1550583724-b2692b85b150'], category: 'Dairy & Eggs', weight: '1 liter' },
  { name: 'Skim Milk', images: ['photo-1550583724-b2692b85b150', 'photo-1563636619-e9143da7973b'], category: 'Dairy & Eggs', weight: '1 liter' },
  { name: 'Almond Milk', images: ['photo-1600788907416-456578634209', 'photo-1628088062854-d1870b4553da'], category: 'Dairy & Eggs', weight: '1 liter' },
  { name: 'Soy Milk', images: ['photo-1628088062854-d1870b4553da', 'photo-1600788907416-456578634209'], category: 'Dairy & Eggs', weight: '1 liter' },
  { name: 'Coconut Milk', images: ['photo-1585238341710-7e93e2b4db5e', 'photo-1628088062854-d1870b4553da'], category: 'Dairy & Eggs', weight: '400ml' },
  { name: 'Fresh Butter', images: ['photo-1589985270826-4b7bb135bc9d', 'photo-1628088062854-d1870b4553da'], category: 'Dairy & Eggs', weight: '250g' },
  { name: 'Cream Cheese', images: ['photo-1452195100486-9cc805987862', 'photo-1486297678162-eb2a19b0a32d'], category: 'Dairy & Eggs', weight: '200g' },
  { name: 'Mozzarella Cheese', images: ['photo-1486297678162-eb2a19b0a32d', 'photo-1452195100486-9cc805987862'], category: 'Dairy & Eggs', weight: '250g' },
  { name: 'Parmesan Cheese', images: ['photo-1452195100486-9cc805987862', 'photo-1486297678162-eb2a19b0a32d'], category: 'Dairy & Eggs', weight: '200g' },
  { name: 'Swiss Cheese', images: ['photo-1486297678162-eb2a19b0a32d', 'photo-1452195100486-9cc805987862'], category: 'Dairy & Eggs', weight: '250g' },
  { name: 'Feta Cheese', images: ['photo-1452195100486-9cc805987862', 'photo-1486297678162-eb2a19b0a32d'], category: 'Dairy & Eggs', weight: '200g' },
  { name: 'Greek Yogurt', images: ['photo-1488477181946-6428a0291777', 'photo-1571212515416-fca2ce42e1b7'], category: 'Dairy & Eggs', weight: '500g' },
  { name: 'Vanilla Yogurt', images: ['photo-1571212515416-fca2ce42e1b7', 'photo-1488477181946-6428a0291777'], category: 'Dairy & Eggs', weight: '500g' },
  { name: 'Farm Eggs', images: ['photo-1582722872445-44dc5f7e3c8f', 'photo-1506976785307-8732e854ad03'], category: 'Dairy & Eggs', weight: '12 pieces' },
  { name: 'Organic Eggs', images: ['photo-1506976785307-8732e854ad03', 'photo-1582722872445-44dc5f7e3c8f'], category: 'Dairy & Eggs', weight: '12 pieces' },
  
  // Snacks & Beverages
  { name: 'Potato Chips', images: ['photo-1566478989037-eec170784d0b', 'photo-1613919113640-25732ec5e61f'], category: 'Snacks & Beverages', weight: '200g' },
  { name: 'Tortilla Chips', images: ['photo-1613919113640-25732ec5e61f', 'photo-1566478989037-eec170784d0b'], category: 'Snacks & Beverages', weight: '200g' },
  { name: 'Pretzels', images: ['photo-1599490659213-e2b9527bd087', 'photo-1566478989037-eec170784d0b'], category: 'Snacks & Beverages', weight: '250g' },
  { name: 'Popcorn', images: ['photo-1578849278619-e73505e9610f', 'photo-1505686994434-e3cc5abf1330'], category: 'Snacks & Beverages', weight: '300g' },
  { name: 'Mixed Nuts', images: ['photo-1599599810769-bcde5a160d32', 'photo-1508747703725-719777637510'], category: 'Snacks & Beverages', weight: '250g' },
  { name: 'Trail Mix', images: ['photo-1508747703725-719777637510', 'photo-1599599810769-bcde5a160d32'], category: 'Snacks & Beverages', weight: '300g' },
  { name: 'Granola Bars', images: ['photo-1606312619070-d48b4cda8e6f', 'photo-1560788190-eca468f3e2d8'], category: 'Snacks & Beverages', weight: '6 pieces' },
  { name: 'Protein Bars', images: ['photo-1560788190-eca468f3e2d8', 'photo-1606312619070-d48b4cda8e6f'], category: 'Snacks & Beverages', weight: '6 pieces' },
  { name: 'Chocolate Cookies', images: ['photo-1499636136210-6f4ee915583e', 'photo-1558961363-fa8fdf82db35'], category: 'Snacks & Beverages', weight: '300g' },
  { name: 'Crackers', images: ['photo-1601513445506-2ab0d4fb4229', 'photo-1599490659213-e2b9527bd087'], category: 'Snacks & Beverages', weight: '250g' },
  { name: 'Orange Juice', images: ['photo-1600271886742-f049cd451bba', 'photo-1621506289937-a8e4df240d0b'], category: 'Snacks & Beverages', weight: '1 liter' },
  { name: 'Apple Juice', images: ['photo-1621506289937-a8e4df240d0b', 'photo-1600271886742-f049cd451bba'], category: 'Snacks & Beverages', weight: '1 liter' },
  { name: 'Cranberry Juice', images: ['photo-1610889556528-9a770e32642f', 'photo-1600271886742-f049cd451bba'], category: 'Snacks & Beverages', weight: '1 liter' },
  { name: 'Green Tea', images: ['photo-1564890369478-c89ca6d9cde9', 'photo-1556679343-c7306c1976bc'], category: 'Snacks & Beverages', weight: '100g' },
  { name: 'Coffee Beans', images: ['photo-1559056199-641a0ac8b55e', 'photo-1447933601403-0c6688de566e'], category: 'Snacks & Beverages', weight: '500g' },
  
  // Bakery & Bread
  { name: 'Whole Wheat Bread', images: ['photo-1509440159596-0249088772ff', 'photo-1549931319-a545dcf3bc73'], category: 'Bakery & Bread', weight: '400g' },
  { name: 'Sourdough Bread', images: ['photo-1549931319-a545dcf3bc73', 'photo-1509440159596-0249088772ff'], category: 'Bakery & Bread', weight: '500g' },
  { name: 'Baguette', images: ['photo-1549931319-a545dcf3bc73', 'photo-1586444248902-2f64eddc13df'], category: 'Bakery & Bread', weight: '300g' },
  { name: 'Croissants', images: ['photo-1555507036-ab1f4038808a', 'photo-1623334044303-241021148842'], category: 'Bakery & Bread', weight: '6 pieces' },
  { name: 'Bagels', images: ['photo-1551106652-a5bcf4b29e84', 'photo-1509440159596-0249088772ff'], category: 'Bakery & Bread', weight: '6 pieces' },
  { name: 'Donuts', images: ['photo-1551024506-0bccd828d307', 'photo-1527515637462-cff94eecc1ac'], category: 'Bakery & Bread', weight: '6 pieces' },
  { name: 'Muffins', images: ['photo-1607958996333-41aef7caefaa', 'photo-1426869884541-df7117556757'], category: 'Bakery & Bread', weight: '4 pieces' },
  { name: 'Dinner Rolls', images: ['photo-1509440159596-0249088772ff', 'photo-1549931319-a545dcf3bc73'], category: 'Bakery & Bread', weight: '12 pieces' },
  
  // Meat & Seafood
  { name: 'Chicken Breast', images: ['photo-1604503468506-a8da13d82791', 'photo-1587593810167-a84920ea0781'], category: 'Meat & Seafood', weight: '1 kg' },
  { name: 'Ground Beef', images: ['photo-1603048588665-791ca8aea617', 'photo-1607623814075-e51df1bdc82f'], category: 'Meat & Seafood', weight: '500g' },
  { name: 'Pork Chops', images: ['photo-1607623814075-e51df1bdc82f', 'photo-1603048588665-791ca8aea617'], category: 'Meat & Seafood', weight: '500g' },
  { name: 'Fresh Salmon', images: ['photo-1519708227418-c8fd9a32b7a2', 'photo-1580476262798-bddd9f4b7369'], category: 'Meat & Seafood', weight: '500g' },
  { name: 'Fresh Shrimp', images: ['photo-1565680018434-b513d5e5fd47', 'photo-1599084993091-1cb5c0721cc6'], category: 'Meat & Seafood', weight: '500g' },
  { name: 'Fresh Tuna', images: ['photo-1580476262798-bddd9f4b7369', 'photo-1519708227418-c8fd9a32b7a2'], category: 'Meat & Seafood', weight: '500g' },
  
  // Frozen Foods
  { name: 'Frozen Pizza', images: ['photo-1513104890138-7c749659a591', 'photo-1574071318508-1cdbab80d002'], category: 'Frozen Foods', weight: '400g' },
  { name: 'Ice Cream', images: ['photo-1563805042-7684c019e1cb', 'photo-1497034825429-c343d7c6a68f'], category: 'Frozen Foods', weight: '1 liter' },
  { name: 'Frozen Vegetables', images: ['photo-1590779033100-9f60a05a013d', 'photo-1610348725531-843dff563e2c'], category: 'Frozen Foods', weight: '1 kg' },
  { name: 'Frozen Berries', images: ['photo-1498557850523-fd3d118b962e', 'photo-1577069861033-55d04cec4ef5'], category: 'Frozen Foods', weight: '500g' },
  { name: 'Frozen French Fries', images: ['photo-1573080496219-bb080dd4f877', 'photo-1576107232684-1279f390859f'], category: 'Frozen Foods', weight: '1 kg' },
  { name: 'Frozen Chicken Nuggets', images: ['photo-1562967914-608f82629710', 'photo-1604503468506-a8da13d82791'], category: 'Frozen Foods', weight: '500g' }
];

function generateProducts(count) {
  const products = [];
  
  for (let i = 0; i < count; i++) {
    const productData = productsData[i % productsData.length];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const originalPrice = Math.floor(Math.random() * 400) + 50;
    const discount = [5, 10, 15, 20, 25][Math.floor(Math.random() * 5)];
    const sellingPrice = Math.floor(originalPrice * (1 - discount / 100));
    
    products.push({
      title: `${productData.name} Premium ${i + 1}`,
      images: [
        {
          url: `https://images.unsplash.com/${productData.images[0]}?w=1920&h=1920&fit=crop&q=90`,
          public_id: `product_${i}_1`
        },
        {
          url: `https://images.unsplash.com/${productData.images[1]}?w=1920&h=1920&fit=crop&q=90`,
          public_id: `product_${i}_2`
        }
      ],
      description: `Premium ${productData.name.toLowerCase()}. High quality product from ${brand}. Perfect for daily use and cooking. Rich in nutrients and carefully selected for freshness. Sourced from trusted suppliers and delivered fresh to your doorstep.`,
      originalprice: originalPrice,
      sellingprice: sellingPrice,
      discount: discount,
      category: productData.category,
      brandname: brand,
      weight: productData.weight,
      type: type
    });
  }
  
  return products;
}

async function seed100Products() {
  try {
    console.log('🛍️  Generating 100 new products...');
    const products = generateProducts(100);
    
    console.log('📦 Adding products to database...');
    const addedProducts = await productModel.insertMany(products);
    console.log(`✅ Successfully added ${addedProducts.length} products to the database!`);
    
    console.log('\n📊 Summary:');
    console.log(`- Total products added: ${addedProducts.length}`);
    console.log(`- Categories used: ${categories.join(', ')}`);
    console.log(`- Brands used: ${brands.join(', ')}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
}

seed100Products();
