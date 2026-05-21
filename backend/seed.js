import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/product.model.js';

// Load env
dotenv.config();

const productsData = [
  {
    name: 'ShopVault Phone 15 Pro',
    sku: 'SV-PH-15PRO',
    description: 'Experience the ultimate flagship smartphone with an aerospace-grade titanium design, A17 Pro chip, custom Action button, and a powerful 3-camera system with 5x optical zoom. Designed with durability and sustainability in mind.',
    price: 999.99,
    category: 'Electronics',
    stock: 12,
    status: 'active'
  },
  {
    name: 'AcousticFlow Wireless Headphones',
    sku: 'AF-WH-001',
    description: 'Premium over-ear headphones featuring industry-leading active noise cancellation (ANC), custom high-excursion drivers, up to 40 hours of playback, and luxurious memory foam earcups for all-day comfort.',
    price: 299.99,
    category: 'Electronics',
    stock: 3,
    status: 'active'
  },
  {
    name: 'UltraWide Curved Gaming Monitor 34"',
    sku: 'UW-CM-340',
    description: 'Immerse yourself with a 1500R curved 34-inch screen featuring WQHD resolution, a rapid 144Hz refresh rate, AMD FreeSync Premium, and HDR10 support. Perfect for gaming, programming, and multitasking.',
    price: 449.99,
    category: 'Electronics',
    stock: 0,
    status: 'out_of_stock'
  },
  {
    name: 'Classic Legacy Leather Jacket',
    sku: 'CL-LJ-BLK-M',
    description: 'Handcrafted from 100% genuine full-grain leather, this timeless double-rider style jacket features heavy-duty metal zippers, quilted satin lining, and multiple utility pockets. Matures beautifully with wear.',
    price: 189.99,
    category: 'Clothing',
    stock: 15,
    status: 'active'
  },
  {
    name: 'AeroComfort Knit Running Shoes',
    sku: 'AC-RS-BLU-10',
    description: 'Engineered breathable knit upper combined with our responsive cloud-foam midsole provides ultimate energy return. Lightweight, durable, and designed for long-distance runs or casual daily wear.',
    price: 89.99,
    category: 'Clothing',
    stock: 5,
    status: 'active'
  },
  {
    name: 'Barista Pro Espresso Machine',
    sku: 'BP-EM-PRO',
    description: 'Bring the cafe experience home. Features a built-in conical burr grinder, precise digital temperature control (PID), 15-bar Italian pump, and a commercial-grade steam wand for microfoam microfoam microfoam.',
    price: 699.99,
    category: 'Home & Kitchen',
    stock: 4,
    status: 'active'
  },
  {
    name: 'AirFryer XL Max 6-in-1',
    sku: 'AF-XL-MAX',
    description: 'Cook up to 5.5 quarts of your favorite foods with up to 75% less fat than traditional frying. Features 6 programmable cooking functions: Max Crisp, Air Fry, Air Roast, Bake, Reheat, and Dehydrate.',
    price: 129.99,
    category: 'Home & Kitchen',
    stock: 22,
    status: 'active'
  },
  {
    name: 'Designing Data-Intensive Applications',
    sku: 'BK-DDIA-01',
    description: 'The definitive guide to the system design principles behind distributed computing, database storage engines, data serialization formats, stream processing, and architectural trade-offs.',
    price: 49.99,
    category: 'Books',
    stock: 35,
    status: 'active'
  },
  {
    name: 'EcoFit Natural Cork Yoga Mat',
    sku: 'EF-YM-CRK',
    description: 'Eco-friendly premium yoga mat made from organic cork and natural tree rubber. Superior non-slip grip, naturally antimicrobial, self-cleaning, and completely free from PVC, TPE, and toxic chemicals.',
    price: 59.99,
    category: 'Sports',
    stock: 2,
    status: 'inactive'
  },
  {
    name: 'Hydrating Botanical Facial Serum',
    sku: 'HB-FS-01',
    description: 'Enriched with pure hyaluronic acid, organic green tea extract, and vitamin E. Deeply hydrates, reduces fine lines, and restores skin luminosity. Cruelty-free, vegan formula for all skin types.',
    price: 34.99,
    category: 'Beauty',
    stock: 40,
    status: 'active'
  },
  {
    name: 'Car Dashcam 4K Ultra HD',
    sku: 'CD-4K-UHD',
    description: 'High-precision dashboard camera featuring a Sony STARVIS sensor, 170-degree wide-angle lens, built-in GPS, Wi-Fi, G-sensor collision detection, loop recording, and active 24/7 parking monitor mode.',
    price: 119.99,
    category: 'Automotive',
    stock: 0,
    status: 'out_of_stock'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected! Clearing existing data...');

    await Product.deleteMany({});
    console.log('Deleted existing products.');

    await Product.insertMany(productsData);
    console.log(`Successfully seeded ${productsData.length} products!`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
