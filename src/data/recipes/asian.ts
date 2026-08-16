import { Recipe } from '../../types';

export const ASIAN_RECIPES: Recipe[] = [
  // --- JAPANESE (25) ---
  {
    id: 'jpn-oyakodon',
    title: 'Oyakodon (Chicken and Egg Rice Bowl)',
    description: 'Classic Japanese soul food with tender chicken and fluffy eggs simmered in a dashi-soy broth over hot rice.',
    cuisine: 'Japanese',
    servings: 2,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chicken Thigh', amount: '250g' },
      { name: 'Eggs', amount: '3' },
      { name: 'Onion', amount: '1/2' },
      { name: 'Dashi Stock & Soy Sauce', amount: '1/2 cup' },
      { name: 'Steamed Rice', amount: '2 cups' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Simmer chicken and onion in dashi and soy sauce for 5 minutes.' },
      { stepNumber: 2, instruction: 'Pour lightly beaten eggs over top, cover 1 minute until runny-golden, slide over rice.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Quick', 'Japanese'],
    isHighProtein: true,
    nutrition: { calories: 430, proteinGrams: 30, carbsGrams: 48, fatGrams: 14 }
  },
  {
    id: 'jpn-ramen-tonkotsu',
    title: 'Rich Pork Chashu Ramen',
    description: 'Springy ramen noodles in a savory pork bone broth topped with tender braised chashu pork belly and ajitama soft-boiled egg.',
    cuisine: 'Japanese',
    servings: 2,
    cookTimeMinutes: 30,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Ramen Noodles', amount: '2 portions' },
      { name: 'Pork Belly Chashu', amount: '6 slices' },
      { name: 'Ramen Broth', amount: '4 cups' },
      { name: 'Ramen Soft Egg (Ajitama)', amount: '2' },
      { name: 'Green Onions & Nori', amount: '1/4 cup' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Heat broth and sear chashu pork slices till golden.' },
      { stepNumber: 2, instruction: 'Boil ramen noodles for 2 mins, pour broth, top with chashu, soft egg, and nori.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Comfort Food'],
    isHighProtein: true,
    nutrition: { calories: 610, proteinGrams: 32, carbsGrams: 64, fatGrams: 24 }
  },
  {
    id: 'jpn-chicken-katsu-curry',
    title: 'Japanese Chicken Katsu Curry',
    description: 'Crispy panko-crusted fried chicken cutlet served with rich, aromatic Japanese curry sauce over steamed rice.',
    cuisine: 'Japanese',
    servings: 3,
    cookTimeMinutes: 25,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chicken Breast Cutlets', amount: '3' },
      { name: 'Panko Breadcrumbs', amount: '1 cup' },
      { name: 'Japanese Curry Roux', amount: '3 cubes' },
      { name: 'Carrots & Potatoes', amount: '1 cup diced' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Simmer carrots and potatoes with curry roux until thick.' },
      { stepNumber: 2, instruction: 'Bread chicken in flour, egg, panko, fry golden 6 mins. Slice over rice and pour hot curry.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Popular'],
    isHighProtein: true,
    nutrition: { calories: 590, proteinGrams: 36, carbsGrams: 68, fatGrams: 20 }
  },
  {
    id: 'jpn-teriyaki-salmon',
    title: 'Pan-Seared Teriyaki Salmon Bowl',
    description: 'Crispy salmon fillets glazed in a sweet soy mirin reduction served over rice with steamed edamame.',
    cuisine: 'Japanese',
    servings: 2,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Salmon Fillets', amount: '2 (300g)' },
      { name: 'Soy Sauce & Mirin', amount: '2 tbsp each' },
      { name: 'Edamame Beans', amount: '1/2 cup' },
      { name: 'Steamed Rice', amount: '2 cups' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Sear salmon skin-side down for 4 mins, flip 2 mins.' },
      { stepNumber: 2, instruction: 'Pour soy mirin glaze, let bubble into thick shiny coating. Serve over rice with edamame.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Quick', 'Healthy'],
    isHighProtein: true,
    isGlutenFree: true,
    nutrition: { calories: 480, proteinGrams: 34, carbsGrams: 42, fatGrams: 18 }
  },
  {
    id: 'jpn-beef-gyudon',
    title: 'Quick Gyudon (Japanese Beef Bowl)',
    description: 'Paper-thin beef slices and tender onions simmered in a sweet soy dashi broth served over rice.',
    cuisine: 'Japanese',
    servings: 2,
    cookTimeMinutes: 12,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Thinly Sliced Ribeye Beef', amount: '250g' },
      { name: 'Onion', amount: '1 sliced' },
      { name: 'Dashi, Soy Sauce, Mirin', amount: '1/2 cup total' },
      { name: 'Pickled Red Ginger (Beni Shoga)', amount: '1 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Simmer onion in broth 3 mins, add beef slices and cook 3 mins until tender.' },
      { stepNumber: 2, instruction: 'Spoon beef and sweet broth over hot rice. Garnish with red ginger.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Quick', 'Comfort Food'],
    isHighProtein: true,
    nutrition: { calories: 510, proteinGrams: 28, carbsGrams: 52, fatGrams: 20 }
  },
  {
    id: 'jpn-chicken-yakitori',
    title: 'Char-Grilled Chicken Yakitori Skewers',
    description: 'Juicy chicken thigh and scallion skewers grilled and brushed with sweet tare glaze.',
    cuisine: 'Japanese',
    servings: 3,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chicken Thighs', amount: '400g cubed' },
      { name: 'Scallions / Green Onions', amount: '6 cut into lengths' },
      { name: 'Soy Sauce, Mirin, Sugar', amount: '3 tbsp tare sauce' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Thread chicken and scallion pieces alternately onto skewers.' },
      { stepNumber: 2, instruction: 'Grill or pan-sear 8 mins, brushing continuously with tare glaze until caramelized.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Quick', 'Low Carb'],
    isHighProtein: true,
    isLowCarb: true,
    nutrition: { calories: 320, proteinGrams: 30, carbsGrams: 10, fatGrams: 16 }
  },
  {
    id: 'jpn-miso-soup',
    title: 'Classic Miso Soup with Tofu & Wakame',
    description: 'Comforting dashi broth stirred with fermented white miso paste, silken tofu, and wakame seaweed.',
    cuisine: 'Japanese',
    servings: 2,
    cookTimeMinutes: 8,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Silken Tofu', amount: '150g cubed' },
      { name: 'Miso Paste', amount: '2 tbsp' },
      { name: 'Dashi Stock', amount: '2.5 cups' },
      { name: 'Dried Wakame Seaweed', amount: '1 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Bring dashi broth to gentle simmer, add tofu cubes and rehydrated wakame.' },
      { stepNumber: 2, instruction: 'Turn off heat, dissolve miso paste using a strainer strainer. Do not boil.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'Quick', 'Low Calorie', 'Vegan Option'],
    isVegetarian: true,
    isLowCarb: true,
    isGlutenFree: true,
    nutrition: { calories: 85, proteinGrams: 6, carbsGrams: 7, fatGrams: 3 }
  },
  {
    id: 'jpn-tempura-shrimp',
    title: 'Crispy Shrimp Tempura',
    description: 'Light and airy ice-batter dipped shrimp fried crisp, served with warm tentsuyu dipping sauce.',
    cuisine: 'Japanese',
    servings: 3,
    cookTimeMinutes: 15,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Large Shrimp', amount: '12 peeled & deveined' },
      { name: 'Tempura Flour & Ice Water', amount: '1 cup' },
      { name: 'Dipping Sauce (Dashi + Mirin)', amount: '1/2 cup' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Mix ice water and tempura flour lightly (keep lumpy).' },
      { stepNumber: 2, instruction: 'Dip shrimp and fry in hot oil (180°C) for 2.5 minutes until golden crisp.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Appetizer'],
    isHighProtein: true,
    nutrition: { calories: 310, proteinGrams: 22, carbsGrams: 24, fatGrams: 14 }
  },
  {
    id: 'jpn-agedashi-tofu',
    title: 'Agedashi Tofu in Warm Dashi Broth',
    description: 'Crispy potato-starch coated fried tofu block served in a savory dashi sauce topped with grated daikon and bonito flakes.',
    cuisine: 'Japanese',
    servings: 2,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Medium Firm Tofu', amount: '300g' },
      { name: 'Potato Starch', amount: '1/3 cup' },
      { name: 'Tsuyu Dashi Broth', amount: '1 cup' },
      { name: 'Grated Daikon & Bonito Flakes', amount: '2 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Press tofu dry, dust in potato starch, and deep fry until crisp white shell forms.' },
      { stepNumber: 2, instruction: 'Place in bowl, pour warm dashi broth around, top with grated daikon and scallions.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'Quick', 'Appetizer'],
    isVegetarian: true,
    nutrition: { calories: 220, proteinGrams: 14, carbsGrams: 18, fatGrams: 10 }
  },
  {
    id: 'jpn-nasu-dengaku',
    title: 'Sweet Miso Glazed Eggplant (Nasu Dengaku)',
    description: 'Broiled Japanese eggplant halves slathered with caramelized sweet white miso glaze and sesame seeds.',
    cuisine: 'Japanese',
    servings: 2,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Japanese Eggplants', amount: '2 split lengthwise' },
      { name: 'White Miso Paste', amount: '2 tbsp' },
      { name: 'Mirin & Sugar', amount: '1 tbsp each' },
      { name: 'Toasted Sesame Seeds', amount: '1 tsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Score eggplant flesh, pan-fry flesh side down 5 mins until soft.' },
      { stepNumber: 2, instruction: 'Spread sweet miso glaze on top, broil under oven flame 3 mins until bubbling caramelized.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80',
    tags: ['Vegan', 'Vegetarian', 'Quick', 'Low Carb'],
    isVegetarian: true,
    isVegan: true,
    isLowCarb: true,
    isGlutenFree: true,
    isDairyFree: true,
    nutrition: { calories: 170, proteinGrams: 4, carbsGrams: 26, fatGrams: 5 }
  },

  // --- CHINESE (25) ---
  {
    id: 'chn-claypot-rice',
    title: 'Claypot Chicken & Mushroom Rice',
    description: 'Crispy bottom Jasmine rice topped with marinated chicken, shiitake mushrooms, soy drizzle, and fried egg.',
    cuisine: 'Chinese',
    servings: 2,
    cookTimeMinutes: 25,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken Thighs', amount: '300g' },
      { name: 'Shiitake Mushrooms', amount: '6' },
      { name: 'Jasmine Rice', amount: '1 cup' },
      { name: 'Dark & Light Soy Sauce', amount: '2 tbsp' },
      { name: 'Sesame Oil', amount: '1 tsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Marinate sliced chicken with soy sauce, sesame oil, and cornstarch.' },
      { stepNumber: 2, instruction: 'Cook rice in pot until water reduces, top with chicken & mushrooms, cover low heat 15 mins till bottom forms crispy crust.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'One Pot', 'Comfort Food'],
    isHighProtein: true,
    nutrition: { calories: 480, proteinGrams: 32, carbsGrams: 54, fatGrams: 14 }
  },
  {
    id: 'chn-mapo-tofu',
    title: 'Sichuan Mapo Tofu',
    description: 'Silken tofu cubes and minced pork simmered in a fiery chili bean paste broth tinged with numbing Sichuan peppercorn.',
    cuisine: 'Chinese',
    countryOrRegion: 'Sichuan, China',
    servings: 3,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Silken / Soft Tofu', amount: '400g' },
      { name: 'Ground Pork / Beef', amount: '150g' },
      { name: 'Sichuan Pixian Doubanjiang', amount: '2 tbsp' },
      { name: 'Sichuan Peppercorn Powder', amount: '1 tsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Stir fry ground pork with garlic and spicy doubanjiang until red oil forms.' },
      { stepNumber: 2, instruction: 'Add broth and tofu cubes, simmer 5 mins, thicken with cornstarch slurry, dust with ground peppercorn.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Spicy', 'Quick'],
    isHighProtein: true,
    nutrition: { calories: 340, proteinGrams: 22, carbsGrams: 12, fatGrams: 22 }
  },
  {
    id: 'chn-kung-pao-chicken',
    title: 'Sichuan Kung Pao Chicken',
    description: 'Diced chicken stir-fried with crunchy roasted peanuts, dried red chilies, scallions, and tangy sweet-savory glaze.',
    cuisine: 'Chinese',
    servings: 3,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chicken Breast', amount: '400g diced' },
      { name: 'Roasted Peanuts', amount: '1/2 cup' },
      { name: 'Dried Red Chilies', amount: '10' },
      { name: 'Soy Sauce & Black Vinegar', amount: '2 tbsp each' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Sear chicken cubes in wok until cooked, set aside.' },
      { stepNumber: 2, instruction: 'Stir fry chilies and garlic, toss chicken back with soy vinegar sauce and peanuts over high flame.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Quick', 'Spicy'],
    isHighProtein: true,
    nutrition: { calories: 410, proteinGrams: 35, carbsGrams: 14, fatGrams: 24 }
  },
  {
    id: 'chn-beef-broccoli',
    title: 'Classic Beef & Broccoli Stir-Fry',
    description: 'Tender velvety beef slices stir-fried with fresh broccoli florets in a savory garlic soy sauce.',
    cuisine: 'Chinese',
    servings: 3,
    cookTimeMinutes: 12,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Flank Steak', amount: '350g thinly sliced' },
      { name: 'Broccoli Florets', amount: '3 cups' },
      { name: 'Oyster Sauce & Soy Sauce', amount: '2 tbsp each' },
      { name: 'Garlic & Ginger', amount: '1 tbsp minced' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Marinate beef in baking soda, soy sauce, and cornstarch for 10 mins (velveting).' },
      { stepNumber: 2, instruction: 'Blanch broccoli 1 min. Flash fry beef 2 mins, toss with broccoli and garlic oyster sauce.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Quick', 'Low Carb'],
    isHighProtein: true,
    isLowCarb: true,
    nutrition: { calories: 350, proteinGrams: 32, carbsGrams: 12, fatGrams: 18 }
  },
  {
    id: 'chn-yangzhou-fried-rice',
    title: 'Yangzhou Special Fried Rice',
    description: 'Classic wok-tossed fried rice loaded with sweet char siu pork, shrimp, egg, green peas, and scallions.',
    cuisine: 'Chinese',
    servings: 4,
    cookTimeMinutes: 12,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Day-Old Jasmine Rice', amount: '4 cups' },
      { name: 'Small Shrimp', amount: '150g' },
      { name: 'Diced BBQ Pork (Char Siu)', amount: '100g' },
      { name: 'Eggs', amount: '3' },
      { name: 'Green Peas', amount: '1/2 cup' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Scramble eggs in hot wok, toss cold rice breaking up grains.' },
      { stepNumber: 2, instruction: 'Add shrimp, char siu pork, green peas, season with light soy sauce and white pepper.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Quick', 'Popular'],
    isHighProtein: true,
    nutrition: { calories: 460, proteinGrams: 24, carbsGrams: 58, fatGrams: 14 }
  },

  // --- KOREAN (20) ---
  {
    id: 'kor-bibimbap',
    title: 'Classic Korean Beef Bibimbap',
    description: 'Hot rice topped with seasoned sautéed vegetables, marinated beef bulgogi, fried egg, and gochujang sauce.',
    cuisine: 'Korean',
    servings: 2,
    cookTimeMinutes: 20,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Cooked Short Grain Rice', amount: '2 cups' },
      { name: 'Beef Bulgogi / Ribeye', amount: '150g' },
      { name: 'Spinach, Carrots, Bean Sprouts', amount: '1 cup each' },
      { name: 'Eggs', amount: '2 sunny side' },
      { name: 'Gochujang Paste', amount: '2 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Sauté each vegetable individually with sesame oil and salt.' },
      { stepNumber: 2, instruction: 'Arrange warm rice in bowl, top neatly with colorful veggies, beef, egg, and spicy gochujang sauce.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Healthy', 'Popular'],
    isHighProtein: true,
    nutrition: { calories: 520, proteinGrams: 28, carbsGrams: 64, fatGrams: 16 }
  },
  {
    id: 'kor-bulgogi',
    title: 'Sweet Soy Marinated Beef Bulgogi',
    description: 'Thinly sliced tender beef marinated in grated pear, soy sauce, garlic, and sesame oil, seared over high heat.',
    cuisine: 'Korean',
    servings: 3,
    cookTimeMinutes: 10,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Thin Ribeye Beef', amount: '400g' },
      { name: 'Grated Asian Pear', amount: '3 tbsp' },
      { name: 'Soy Sauce & Brown Sugar', amount: '3 tbsp each' },
      { name: 'Sesame Oil & Garlic', amount: '1 tbsp each' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Marinate sliced beef in pear-soy sauce mixture for 20 minutes.' },
      { stepNumber: 2, instruction: 'Flash fry in single layers on smoking hot cast iron skillet for 3 mins until caramelized.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Quick', 'Gluten Free Option'],
    isHighProtein: true,
    nutrition: { calories: 430, proteinGrams: 34, carbsGrams: 18, fatGrams: 24 }
  },
  {
    id: 'kor-kimchi-jjigae',
    title: 'Spicy Kimchi Jjigae (Kimchi Stew)',
    description: 'Aged spicy kimchi simmered with pork belly, tofu, and scallions in a rich gochugaru chili broth.',
    cuisine: 'Korean',
    servings: 3,
    cookTimeMinutes: 20,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Well-Aged Kimchi', amount: '2 cups chopped' },
      { name: 'Pork Belly', amount: '150g sliced' },
      { name: 'Firm Tofu', amount: '200g sliced' },
      { name: 'Gochugaru (Korean Chili Powder)', amount: '1 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Sauté pork belly and sour kimchi in pot until fragrant.' },
      { stepNumber: 2, instruction: 'Add water or anchovy broth, gochugaru, and tofu. Simmer low 15 minutes.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Spicy', 'Comfort Food'],
    isHighProtein: true,
    nutrition: { calories: 310, proteinGrams: 20, carbsGrams: 14, fatGrams: 19 }
  },
  {
    id: 'kor-tteokbokki',
    title: 'Spicy Korean Tteokbokki (Rice Cakes)',
    description: 'Chewy Korean rice cakes and fish cakes simmered in a sweet and spicy gochujang kelp broth.',
    cuisine: 'Korean',
    servings: 2,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Korean Rice Cakes (Tteok)', amount: '350g' },
      { name: 'Fish Cakes', amount: '100g sliced' },
      { name: 'Gochujang & Gochugaru', amount: '2 tbsp each' },
      { name: 'Hard Boiled Egg', amount: '2' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Boil water with kelp, stir in gochujang, gochugaru, and sugar.' },
      { stepNumber: 2, instruction: 'Add rice cakes and fish cakes, simmer 10 mins until sauce thickens and rice cakes are pillow soft.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600&auto=format&fit=crop&q=80',
    tags: ['Street Food', 'Quick', 'Spicy'],
    nutrition: { calories: 420, proteinGrams: 12, carbsGrams: 76, fatGrams: 6 }
  },

  // --- THAI (20) ---
  {
    id: 'tha-pad-thai',
    title: 'Authentic Street Pad Thai with Shrimp',
    description: 'Stir-fried rice noodles with succulent shrimp, tofu, eggs, bean sprouts, peanuts, and tangy tamarind sauce.',
    cuisine: 'Thai',
    servings: 2,
    cookTimeMinutes: 15,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Rice Noodles', amount: '200g soaked' },
      { name: 'Shrimp', amount: '150g peeled' },
      { name: 'Tamarind Paste & Fish Sauce', amount: '2 tbsp each' },
      { name: 'Crushed Peanuts', amount: '3 tbsp' },
      { name: 'Eggs', amount: '2' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Sear shrimp and tofu in wok, scramble eggs to side.' },
      { stepNumber: 2, instruction: 'Toss in rice noodles, tamarind sauce, bean sprouts over high flame. Serve with peanuts and lime.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Quick', 'Classic'],
    isHighProtein: true,
    isDairyFree: true,
    nutrition: { calories: 490, proteinGrams: 26, carbsGrams: 62, fatGrams: 16 }
  },
  {
    id: 'tha-green-curry',
    title: 'Aromatic Thai Green Chicken Curry',
    description: 'Tender chicken and Thai eggplants simmered in rich coconut milk infused with fresh green curry paste and kaffir lime.',
    cuisine: 'Thai',
    servings: 4,
    cookTimeMinutes: 20,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chicken Thighs', amount: '500g' },
      { name: 'Thai Green Curry Paste', amount: '3 tbsp' },
      { name: 'Coconut Milk', amount: '1.5 cups' },
      { name: 'Thai Basil & Lime Leaves', amount: '1/2 cup' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Fry green curry paste in coconut cream until fragrant oil splits.' },
      { stepNumber: 2, instruction: 'Add chicken, remaining coconut milk, and simmer 12 mins. Stir in fresh Thai basil.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Spicy', 'Gluten Free'],
    isHighProtein: true,
    isGlutenFree: true,
    isDairyFree: true,
    nutrition: { calories: 450, proteinGrams: 32, carbsGrams: 12, fatGrams: 30 }
  },
  {
    id: 'tha-tom-yum',
    title: 'Spicy Thai Tom Yum Goong (Shrimp Soup)',
    description: 'Hot and sour lemongrass soup infused with galangal, kaffir lime leaves, chili paste, and juicy jumbo prawns.',
    cuisine: 'Thai',
    servings: 3,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Jumbo Shrimp', amount: '300g' },
      { name: 'Lemongrass, Galangal, Lime Leaves', amount: '1 cup fresh' },
      { name: 'Thai Chili Paste (Nam Prik Pao)', amount: '2 tbsp' },
      { name: 'Lime Juice & Fish Sauce', amount: '3 tbsp each' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Simmer aromatics (lemongrass, galangal, lime leaves) in stock 5 minutes.' },
      { stepNumber: 2, instruction: 'Add mushrooms, shrimp, chili paste, fish sauce, and fresh lime juice off heat.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Spicy', 'Low Calorie'],
    isHighProtein: true,
    isLowCarb: true,
    isGlutenFree: true,
    isDairyFree: true,
    nutrition: { calories: 190, proteinGrams: 24, carbsGrams: 8, fatGrams: 6 }
  },

  // --- VIETNAMESE (10) ---
  {
    id: 'vnm-beef-pho',
    title: 'Traditional Vietnamese Beef Pho',
    description: 'Aromatic star anise broth poured scalding hot over flat rice noodles and thinly sliced raw beef eye round.',
    cuisine: 'Vietnamese',
    servings: 3,
    cookTimeMinutes: 30,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Thin Beef Eye Round', amount: '250g' },
      { name: 'Pho Rice Noodles', amount: '300g' },
      { name: 'Spiced Pho Beef Broth', amount: '6 cups' },
      { name: 'Fresh Thai Basil & Bean Sprouts', amount: '2 cups' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Boil pho noodles, place in bowl, arrange raw paper-thin beef slices on top.' },
      { stepNumber: 2, instruction: 'Ladle boiling spiced broth over beef to cook instantly. Serve with herbs, lime, and chili.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Gluten Free', 'Comfort Food'],
    isHighProtein: true,
    isGlutenFree: true,
    isDairyFree: true,
    nutrition: { calories: 420, proteinGrams: 30, carbsGrams: 52, fatGrams: 10 }
  },
  {
    id: 'vnm-banh-mi',
    title: 'Crispy Pork Banh Mi Sandwich',
    description: 'Crisp French baguette stuffed with savory lemongrass pork, pate, pickled daikon carrots, cucumber, and cilantro.',
    cuisine: 'Vietnamese',
    servings: 2,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Crispy Baguettes', amount: '2 individual' },
      { name: 'Grilled Lemongrass Pork', amount: '200g' },
      { name: 'Pickled Daikon & Carrots', amount: '1/2 cup' },
      { name: 'Cucumber Slices & Cilantro', amount: '1/2 cup' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Toast baguette until crackly crisp.' },
      { stepNumber: 2, instruction: 'Spread mayo/pate, fill with warm pork, pickled veggies, cucumber strips, and cilantro.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Street Food'],
    isHighProtein: true,
    nutrition: { calories: 480, proteinGrams: 28, carbsGrams: 52, fatGrams: 18 }
  }
];
