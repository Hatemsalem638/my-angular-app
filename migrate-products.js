const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase
const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://angular-project-fc74.firebaseio.com' // Replace with your project URL
});

const db = admin.firestore();

// Sample products with real image URLs and smart package pricing
const sampleProducts = [
  {
    title: "Coca-Cola Classic",
    price: 199, // Base price for 6-pack
    image: "https://www.coca-colacompany.com/content/dam/journey/us/en/brands/coca-cola/Coca-Cola_Original_glass_bottle_220x220.png"
  },
  {
    title: "Pepsi Cola",
    price: 189,
    image: "https://www.pepsi.com/en-us/uploads/images/can-pepsi.png"
  },
  {
    title: "Sprite Lemon-Lime",
    price: 179,
    image: "https://www.coca-colacompany.com/content/dam/journey/us/en/brands/sprite/Sprite_Original_glass_bottle_220x220.png"
  },
  {
    title: "Fanta Orange",
    price: 169,
    image: "https://www.coca-colacompany.com/content/dam/journey/us/en/brands/fanta/Fanta_Orange_glass_bottle_220x220.png"
  },
  {
    title: "Mountain Dew",
    price: 209,
    image: "https://www.pepsicobeveragefacts.com/Content/Images/mountain-dew.png"
  },
  {
    title: "Dr Pepper",
    price: 219,
    image: "https://www.drpepper.com/sites/drpepper.com/files/2021-03/dr-pepper.png"
  },
  {
    title: "7UP",
    price: 175,
    image: "https://www.7up.com/-/media/Project/7Up/7Up/7up-brand/7up-logo.png"
  },
  {
    title: "A&W Root Beer",
    price: 229,
    image: "https://www.awrestaurants.com/-/media/Project/AW/AW-Restaurants/Images/Menu-Items/aw_root_beer.png"
  },
  {
    title: "Canada Dry Ginger Ale",
    price: 189,
    image: "https://www.canadadry.com/content/dam/nagbrands/us/canadadry/products/ginger-ale/canada-dry-ginger-ale-2L.png"
  },
  {
    title: "Schweppes Tonic Water",
    price: 239,
    image: "https://www.schweppes.com/us/media/2023/05/SCH_US_12oz_Can_0001_Tonic_Water.png"
  }
];

// Create products with smart package pricing
async function createProductsWithPackages() {
  const batch = db.batch();
  
  sampleProducts.forEach((product, index) => {
    const productRef = db.collection('products').doc(`prod-${index + 1}`);
    
    // Calculate package prices with volume discounts
    const basePrice = product.price;
    const packageOptions = [
      {
        name: "6 cans (pack)",
        size: 6,
        priceMultiplier: 1,      // Base price
        totalPrice: basePrice,
        pricePerUnit: (basePrice / 6).toFixed(2),
        discount: 0
      },
      {
        name: "12 cans (box)",
        size: 12,
        priceMultiplier: 1.8,    // 10% discount vs buying 2 packs
        totalPrice: basePrice * 1.8,
        pricePerUnit: (basePrice * 1.8 / 12).toFixed(2),
        discount: 10
      },
      {
        name: "24 cans (case)",
        size: 24,
        priceMultiplier: 3.2,    // 20% discount vs buying 4 packs
        totalPrice: basePrice * 3.2,
        pricePerUnit: (basePrice * 3.2 / 24).toFixed(2),
        discount: 20
      }
    ];

    batch.set(productRef, {
      title: product.title,
      basePrice: basePrice,
      image: product.image,
      packageOptions: packageOptions,
      selectedPackage: packageOptions[0].name, // Default to 6-pack
      quantity: 1,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  await batch.commit();
  console.log('✅ Successfully created 10 products with package pricing!');
}

// Run the creation
createProductsWithPackages()
  .then(() => process.exit())
  .catch(error => {
    console.error('❌ Error creating products:', error);
    process.exit(1);
  });