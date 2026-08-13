import { Recipe } from '../types';

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-claypot-rice',
    title: 'Simple Chicken Claypot Rice',
    description: 'A rustic, fragrant rice dish topped with seasoned chicken, fragrant mushrooms, and a rich egg yolk.',
    cuisine: 'Chinese',
    servings: 2,
    cookTimeMinutes: 35,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken', amount: '300g boneless thighs' },
      { name: 'Rice', amount: '1 cup Jasmine rice' },
      { name: 'Eggs', amount: '2 fresh eggs' },
      { name: 'Soy Sauce', amount: '2 tbsp' },
      { name: 'Oyster Sauce', amount: '1 tbsp' },
      { name: 'Sesame Oil', amount: '1 tsp' },
      { name: 'Garlic', amount: '3 cloves minced' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Marinate sliced chicken with soy sauce, oyster sauce, sesame oil, and minced garlic for 15 minutes.', timerMinutes: 15 },
      { stepNumber: 2, instruction: 'Rinse rice thoroughly and place in a claypot or heavy skillet with 1.25 cups of water over medium heat.', timerMinutes: 10 },
      { stepNumber: 3, instruction: 'Once rice water is simmered down, arrange marinated chicken on top, cover tightly and simmer on low heat for 15 minutes.', timerMinutes: 15 },
      { stepNumber: 4, instruction: 'Crack fresh eggs on top, drizzle extra soy sauce, cover for 2 minutes until whites are set, then serve hot.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80',
    tags: ['Comfort Food', 'High Protein', 'One Pot'],
    isGlutenFree: false,
    isLowCarb: false
  },
  {
    id: 'rec-oyakodon',
    title: 'Oyakodon (Chicken and Egg Bowl)',
    description: 'Classic Japanese soul food with tender chicken and fluffy eggs simmered in a dashi-dashi broth over hot rice.',
    cuisine: 'Japanese',
    servings: 2,
    cookTimeMinutes: 20,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chicken', amount: '250g chicken thigh, bite-sized' },
      { name: 'Eggs', amount: '3 large eggs' },
      { name: 'Onion', amount: '1/2 medium onion, sliced' },
      { name: 'Rice', amount: '2 cups cooked Japanese rice' },
      { name: 'Soy Sauce', amount: '2 tbsp' },
      { name: 'Dashi Stock', amount: '1/2 cup (or chicken broth)' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'In a small pan, combine dashi stock, soy sauce, and sugar. Bring to a gentle simmer.' },
      { stepNumber: 2, instruction: 'Add sliced onions and chicken pieces. Cover and cook over medium heat for 6 minutes until chicken is cooked through.', timerMinutes: 6 },
      { stepNumber: 3, instruction: 'Lightly beat eggs (do not overmix). Pour 2/3 over chicken, cover for 1 minute.', timerMinutes: 1 },
      { stepNumber: 4, instruction: 'Pour remaining egg, turn off heat, and cover for 30 seconds for a runny, golden texture. Slide over steamed rice.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    tags: ['Quick', 'Japanese', 'Comfort Food'],
    isHighProtein: true
  },
  {
    id: 'rec-paneer-tikka',
    title: 'Quick Tawa Paneer Masala',
    description: 'Juicy paneer cubes tossed with crisp bell peppers, onions, and aromatic Indian spices on a hot skillet.',
    cuisine: 'Indian',
    servings: 3,
    cookTimeMinutes: 22,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Paneer', amount: '250g cubed' },
      { name: 'Onion', amount: '1 large chopped' },
      { name: 'Tomatoes', amount: '2 medium diced' },
      { name: 'Garlic', amount: '4 cloves minced' },
      { name: 'Spinach', amount: '1 cup fresh leaves' },
      { name: 'Butter', amount: '2 tbsp' },
      { name: 'Garam Masala', amount: '1 tsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Melt butter on a wide skillet or tawa. Sear paneer cubes until lightly golden on edges, then set aside.' },
      { stepNumber: 2, instruction: 'Sauté minced garlic and onions in the remaining butter until golden brown.', timerMinutes: 4 },
      { stepNumber: 3, instruction: 'Add diced tomatoes and spices. Cook until tomatoes soften into a fragrant masala paste.', timerMinutes: 5 },
      { stepNumber: 4, instruction: 'Fold in spinach leaves and seared paneer cubes. Stir well for 2 minutes and serve hot with naan or rice.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'Gluten-Free', 'Indian'],
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    id: 'rec-pasta-carbonara',
    title: 'Classic Creamy Egg Pasta',
    description: 'Silky Roman pasta coated in rich egg yolks, aged cheese, and cracked black pepper.',
    cuisine: 'Italian',
    servings: 2,
    cookTimeMinutes: 18,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Pasta', amount: '200g Spaghetti or Rigatoni' },
      { name: 'Eggs', amount: '3 egg yolks + 1 whole egg' },
      { name: 'Parmesan Cheese', amount: '50g finely grated' },
      { name: 'Garlic', amount: '2 cloves whole' },
      { name: 'Olive Oil', amount: '1 tbsp' },
      { name: 'Black Pepper', amount: '1 tsp freshly cracked' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Bring a pot of salted water to boil. Cook pasta until al dente (about 8-9 minutes).', timerMinutes: 9 },
      { stepNumber: 2, instruction: 'Whisk egg yolks, whole egg, grated parmesan, and plenty of black pepper in a bowl until smooth.' },
      { stepNumber: 3, instruction: 'Sauté smashed garlic cloves in olive oil until aromatic, then remove garlic.' },
      { stepNumber: 4, instruction: 'Drain pasta reserving 1/2 cup pasta water. Toss pasta in pan off heat, quickly stir in egg mixture and splash of pasta water until a creamy glaze coats the noodles.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop&q=80',
    tags: ['Italian', 'Quick', 'Comfort Food'],
    isVegetarian: true
  },
  {
    id: 'rec-chicken-fried-rice',
    title: 'Golden Egg & Chicken Fried Rice',
    description: 'A classic high-heat stir-fry featuring fluffy jasmine rice, juicy diced chicken, and golden scrambled eggs.',
    cuisine: 'Chinese',
    servings: 3,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Rice', amount: '3 cups day-old cooked rice' },
      { name: 'Chicken', amount: '200g diced cooked chicken' },
      { name: 'Eggs', amount: '3 eggs' },
      { name: 'Onion', amount: '1/2 finely chopped' },
      { name: 'Garlic', amount: '2 cloves minced' },
      { name: 'Soy Sauce', amount: '2 tbsp' },
      { name: 'Sesame Oil', amount: '1 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Heat oil in a large wok over high heat. Scramble beaten eggs quickly for 45 seconds until soft, then remove.' },
      { stepNumber: 2, instruction: 'Sauté onions and garlic for 1 minute until fragrant.' },
      { stepNumber: 3, instruction: 'Add cold cooked rice, break up clumps with a spatula, and stir-fry vigorously for 3 minutes.', timerMinutes: 3 },
      { stepNumber: 4, instruction: 'Toss in chicken, cooked eggs, soy sauce, and sesame oil. Stir for 2 minutes until screaming hot.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80',
    tags: ['Quick', 'High Protein', 'Family Favorite']
  },
  {
    id: 'rec-mexican-shakshuka',
    title: 'Huevos Rancheros Skillet',
    description: 'Warm fried eggs nestled in a zesty tomato, garlic, and spiced chili sauce with crispy tortillas.',
    cuisine: 'Mexican',
    servings: 2,
    cookTimeMinutes: 20,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Eggs', amount: '4 large eggs' },
      { name: 'Tomatoes', amount: '1 can (400g) crushed tomatoes' },
      { name: 'Onion', amount: '1 medium diced' },
      { name: 'Garlic', amount: '3 cloves minced' },
      { name: 'Spinach', amount: '1 cup fresh' },
      { name: 'Olive Oil', amount: '2 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Heat olive oil in a skillet. Cook diced onions and minced garlic until soft and translucent.', timerMinutes: 4 },
      { stepNumber: 2, instruction: 'Pour in crushed tomatoes and spinach. Simmer for 8 minutes until sauce thickens.', timerMinutes: 8 },
      { stepNumber: 3, instruction: 'Make 4 small wells in sauce with a spoon. Crack an egg into each well.' },
      { stepNumber: 4, instruction: 'Cover pan with lid and cook for 5 minutes until egg whites are set but yolks remain runny.', timerMinutes: 5 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'Gluten-Free', 'Breakfast'],
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    id: 'rec-korean-bibimbap',
    title: 'Rustic Chicken & Spinach Bibimbap',
    description: 'Korean rice bowl loaded with sautéed vegetables, savory sliced chicken, and a fried egg on top.',
    cuisine: 'Korean',
    servings: 2,
    cookTimeMinutes: 25,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Rice', amount: '2 cups cooked rice' },
      { name: 'Chicken', amount: '200g thinly sliced' },
      { name: 'Eggs', amount: '2 eggs' },
      { name: 'Spinach', amount: '2 cups fresh' },
      { name: 'Garlic', amount: '2 cloves minced' },
      { name: 'Soy Sauce', amount: '2 tbsp' },
      { name: 'Sesame Oil', amount: '1 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Sauté chicken slices with soy sauce and garlic until fully cooked and caramelized.', timerMinutes: 6 },
      { stepNumber: 2, instruction: 'Blanch spinach in boiling water for 30 seconds, drain, squeeze dry, and season with sesame oil and salt.' },
      { stepNumber: 3, instruction: 'Fry eggs sunny-side up in a small nonstick pan until edges are crisp.' },
      { stepNumber: 4, instruction: 'Assemble warm rice bowls topped with seasoned chicken, garlic spinach, and crispy fried egg.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800&auto=format&fit=crop&q=80',
    tags: ['Korean', 'Balanced', 'High Protein']
  },
  {
    id: 'rec-caprese-spinach-pasta',
    title: 'Garlic Tomato Spinach Pasta',
    description: 'Light Mediterranean pasta tossed with burst cherry tomatoes, wilted spinach, garlic, and olive oil.',
    cuisine: 'Mediterranean',
    servings: 2,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Pasta', amount: '200g Penne or Fusilli' },
      { name: 'Tomatoes', amount: '1.5 cups cherry tomatoes' },
      { name: 'Spinach', amount: '3 cups fresh baby spinach' },
      { name: 'Garlic', amount: '4 cloves sliced' },
      { name: 'Olive Oil', amount: '3 tbsp' },
      { name: 'Parmesan Cheese', amount: '3 tbsp grated' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Cook pasta in salted water for 9 minutes until al dente.', timerMinutes: 9 },
      { stepNumber: 2, instruction: 'Sauté sliced garlic in generous olive oil over medium-low heat until light golden.' },
      { stepNumber: 3, instruction: 'Add cherry tomatoes, cover pan, and let them blister and burst for 5 minutes.', timerMinutes: 5 },
      { stepNumber: 4, instruction: 'Toss drained pasta and fresh baby spinach into the warm pan. Stir until spinach wilts into a glossy garlic sauce.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281293?w=800&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'Quick', 'Mediterranean'],
    isVegetarian: true
  },
  {
    id: 'rec-butter-chicken-lite',
    title: '20-Minute Creamy Tomato Butter Chicken',
    description: 'A quick simplified butter chicken curry with silky tomato gravy and aromatic spices.',
    cuisine: 'Indian',
    servings: 3,
    cookTimeMinutes: 20,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chicken', amount: '400g boneless cubes' },
      { name: 'Tomatoes', amount: '1 cup tomato puree' },
      { name: 'Onion', amount: '1 finely chopped' },
      { name: 'Garlic', amount: '3 cloves minced' },
      { name: 'Butter', amount: '2 tbsp' },
      { name: 'Heavy Cream', amount: '3 tbsp (or milk)' },
      { name: 'Garam Masala', amount: '1 tsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Melt butter in a pan. Brown chicken cubes on high heat for 4 minutes, then set aside.', timerMinutes: 4 },
      { stepNumber: 2, instruction: 'Sauté onions and garlic in pan until translucent.' },
      { stepNumber: 3, instruction: 'Pour tomato puree and spices into pan. Simmer gently for 6 minutes until rich and thick.', timerMinutes: 6 },
      { stepNumber: 4, instruction: 'Return chicken to gravy, stir in cream, and simmer for 4 minutes until succulent.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    tags: ['Indian', 'Comfort Food', 'Popular']
  },
  {
    id: 'rec-pad-krapow',
    title: 'Thai Basil Chicken & Fried Egg',
    description: 'Spicy Thai stir-fried minced chicken with garlic, chili, and fragrant basil topped with a crispy edge egg.',
    cuisine: 'Thai',
    servings: 2,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chicken', amount: '300g minced or finely chopped' },
      { name: 'Eggs', amount: '2 eggs' },
      { name: 'Garlic', amount: '4 cloves minced' },
      { name: 'Rice', amount: '2 cups cooked jasmine rice' },
      { name: 'Soy Sauce', amount: '2 tbsp' },
      { name: 'Oyster Sauce', amount: '1 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Fry eggs in 2 tbsp oil over medium-high heat until whites are bubbly and crisp at edges.' },
      { stepNumber: 2, instruction: 'Sauté minced garlic in a wok over high heat for 30 seconds.' },
      { stepNumber: 3, instruction: 'Add minced chicken, stirring rapidly to break up meat. Cook for 4 minutes.', timerMinutes: 4 },
      { stepNumber: 4, instruction: 'Season with soy sauce and oyster sauce. Serve hot over steamed rice with crispy egg.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80',
    tags: ['Thai', 'Spicy', 'Quick']
  },
  {
    id: 'rec-french-omurice',
    title: 'Creamy Spinach French Omelette',
    description: 'Soft-curd French omelette folded around buttery spinach and melted cheese.',
    cuisine: 'French',
    servings: 1,
    cookTimeMinutes: 10,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Eggs', amount: '3 large eggs' },
      { name: 'Spinach', amount: '1 cup fresh' },
      { name: 'Butter', amount: '1.5 tbsp' },
      { name: 'Garlic', amount: '1 clove minced' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Sauté spinach and garlic in 1/2 tbsp butter until wilted, then set aside.' },
      { stepNumber: 2, instruction: 'Vigorously whisk 3 eggs with a pinch of salt until uniform.' },
      { stepNumber: 3, instruction: 'Melt remaining butter in nonstick pan over medium-low heat. Add eggs and agitate pan continuously for silky curds.', timerMinutes: 3 },
      { stepNumber: 4, instruction: 'Place spinach filling across center, roll eggs tightly into a crescent, and slide onto plate.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'Low Carb', 'Quick', 'French'],
    isVegetarian: true,
    isLowCarb: true
  },
  {
    id: 'rec-chicken-fajita',
    title: 'Sizzling Chicken Fajita Bowl',
    description: 'Zesty chili-marinated chicken strips served with charred bell peppers, onions, and fluffy rice.',
    cuisine: 'Mexican',
    servings: 3,
    cookTimeMinutes: 20,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chicken', amount: '350g breast strips' },
      { name: 'Onion', amount: '1 large sliced' },
      { name: 'Rice', amount: '2 cups cooked rice' },
      { name: 'Garlic', amount: '2 cloves minced' },
      { name: 'Olive Oil', amount: '2 tbsp' },
      { name: 'Tomatoes', amount: '1 diced' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Toss chicken strips with olive oil, garlic, cumin, and paprika.' },
      { stepNumber: 2, instruction: 'Sear chicken on a smoking hot cast iron skillet for 6 minutes until charred and cooked through.', timerMinutes: 6 },
      { stepNumber: 3, instruction: 'Sauté sliced onions and tomatoes in skillet drippings until caramelized.', timerMinutes: 4 },
      { stepNumber: 4, instruction: 'Serve chicken and seared onions over warm rice with fresh salsa.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    tags: ['Mexican', 'Gluten-Free', 'High Protein'],
    isGlutenFree: true
  },
  {
    id: 'rec-egg-curry',
    title: 'Dhaba-Style Spiced Egg Curry',
    description: 'Golden shallow-fried boiled eggs in a rich caramelized onion and tomato gravy.',
    cuisine: 'Indian',
    servings: 2,
    cookTimeMinutes: 25,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Eggs', amount: '4 hard-boiled eggs' },
      { name: 'Onion', amount: '2 medium chopped' },
      { name: 'Tomatoes', amount: '2 ripe diced' },
      { name: 'Garlic', amount: '4 cloves minced' },
      { name: 'Rice', amount: '2 cups cooked rice' },
      { name: 'Butter', amount: '1 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Prick hard-boiled eggs with a fork and shallow fry in butter until exterior is golden crisp.', timerMinutes: 3 },
      { stepNumber: 2, instruction: 'In same pan, cook chopped onions and garlic until deep reddish brown.', timerMinutes: 6 },
      { stepNumber: 3, instruction: 'Add diced tomatoes and 1/2 cup water. Simmer until gravy glistens with oil.', timerMinutes: 5 },
      { stepNumber: 4, instruction: 'Add crisp eggs into simmering sauce for 5 minutes. Pair with rice or flatbread.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    tags: ['Indian', 'Vegetarian', 'High Protein'],
    isVegetarian: true
  },
  {
    id: 'rec-teriyaki-chicken',
    title: 'Japanese Teriyaki Chicken Skillet',
    description: 'Glazed chicken thighs coated in sweet soy mirin reduction over steamed jasmine rice.',
    cuisine: 'Japanese',
    servings: 2,
    cookTimeMinutes: 20,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chicken', amount: '350g boneless thighs' },
      { name: 'Soy Sauce', amount: '3 tbsp' },
      { name: 'Rice', amount: '2 cups cooked' },
      { name: 'Garlic', amount: '2 cloves minced' },
      { name: 'Sesame Oil', amount: '1 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Sear chicken thighs skin-side down in a hot skillet for 6 minutes until crispy.', timerMinutes: 6 },
      { stepNumber: 2, instruction: 'Flip chicken and cook another 4 minutes until done.' },
      { stepNumber: 3, instruction: 'Pour soy sauce, minced garlic, and 1 tbsp sugar into pan. Let sauce bubble and thicken into a shiny glaze.', timerMinutes: 3 },
      { stepNumber: 4, instruction: 'Slice chicken into strips, coat generously in glaze, and serve over rice.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&auto=format&fit=crop&q=80',
    tags: ['Japanese', 'Kid-Friendly', 'High Protein']
  },
  {
    id: 'rec-spinach-ricotta-pasta',
    title: 'Garlic Spinach & Cheese Pasta Bake',
    description: 'Comforting pasta tossed with rich creamy cheese, garlic, wilted spinach, and sweet tomatoes.',
    cuisine: 'Italian',
    servings: 4,
    cookTimeMinutes: 30,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Pasta', amount: '300g Penne or Rigatoni' },
      { name: 'Spinach', amount: '3 cups fresh' },
      { name: 'Tomatoes', amount: '1 can crushed tomatoes' },
      { name: 'Garlic', amount: '4 cloves minced' },
      { name: 'Parmesan Cheese', amount: '1/2 cup grated' },
      { name: 'Olive Oil', amount: '2 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Boil pasta in salted water for 8 minutes until slightly underdone.', timerMinutes: 8 },
      { stepNumber: 2, instruction: 'Sauté garlic and spinach in olive oil until wilted, then add crushed tomatoes and simmer 5 mins.', timerMinutes: 5 },
      { stepNumber: 3, instruction: 'Mix pasta with sauce, transfer to baking dish, top with grated cheese.' },
      { stepNumber: 4, instruction: 'Bake at 200°C (400°F) for 12 minutes until cheese is bubbly and golden.', timerMinutes: 12 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'Italian', 'Comfort Food'],
    isVegetarian: true
  },
  {
    id: 'rec-spinach-egg-drop-soup',
    title: 'Velvety Tomato Egg Drop Soup',
    description: 'Warming Chinese diner soup made with sweet stewed tomatoes, garlic, and golden ribbons of beaten egg.',
    cuisine: 'Chinese',
    servings: 2,
    cookTimeMinutes: 12,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Tomatoes', amount: '2 large ripe diced' },
      { name: 'Eggs', amount: '2 eggs' },
      { name: 'Garlic', amount: '2 cloves minced' },
      { name: 'Sesame Oil', amount: '1 tsp' },
      { name: 'Spinach', amount: '1 cup fresh' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Sauté minced garlic and diced tomatoes in 1 tbsp oil until soft and juicy.', timerMinutes: 3 },
      { stepNumber: 2, instruction: 'Add 2.5 cups water or broth, bring to a rolling boil, and drop in spinach.' },
      { stepNumber: 3, instruction: 'Turn off heat. Slowly drizzle beaten eggs in a gentle circle while stirring gently to form egg ribbons.' },
      { stepNumber: 4, instruction: 'Drizzle sesame oil on top and serve steaming hot.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'Quick', 'Soup', 'Low Carb'],
    isVegetarian: true,
    isLowCarb: true
  },
  {
    id: 'rec-garlic-butter-rice',
    title: 'Aromatic Garlic Butter Fried Rice',
    description: 'Crispy fried rice with golden toasted garlic chips, sweet butter, and scrambled eggs.',
    cuisine: 'American',
    servings: 2,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Rice', amount: '2 cups cooked rice' },
      { name: 'Garlic', amount: '6 cloves thinly sliced' },
      { name: 'Butter', amount: '2 tbsp' },
      { name: 'Eggs', amount: '2 eggs' },
      { name: 'Soy Sauce', amount: '1 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Fry sliced garlic in butter over low heat until crisp and golden brown, then set half aside for garnish.', timerMinutes: 4 },
      { stepNumber: 2, instruction: 'Push garlic to side, scramble eggs until set.' },
      { stepNumber: 3, instruction: 'Add cooked rice and soy sauce, stir-fry on high heat for 3 minutes.', timerMinutes: 3 },
      { stepNumber: 4, instruction: 'Garnish with reserved crisp garlic chips.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'Quick', 'Comfort Food'],
    isVegetarian: true
  },
  {
    id: 'rec-chicken-curry-classic',
    title: 'Home-Style Chicken & Potato Curry',
    description: 'Hearty home-cooked curry with tender chicken, potatoes, and garlic in a rich spiced broth.',
    cuisine: 'Indian',
    servings: 4,
    cookTimeMinutes: 35,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken', amount: '500g bone-in or boneless' },
      { name: 'Onion', amount: '2 large finely chopped' },
      { name: 'Tomatoes', amount: '2 pureed' },
      { name: 'Garlic', amount: '5 cloves minced' },
      { name: 'Rice', amount: '3 cups cooked' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Sauté chopped onions and garlic in oil until deep golden.', timerMinutes: 8 },
      { stepNumber: 2, instruction: 'Add tomato puree, cumin, coriander, and turmeric spices. Cook until oil separates.', timerMinutes: 5 },
      { stepNumber: 3, instruction: 'Add chicken pieces and 1 cup water. Cover tightly and simmer on low for 20 minutes.', timerMinutes: 20 },
      { stepNumber: 4, instruction: 'Serve steaming hot with fragrant basmati rice.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80',
    tags: ['Indian', 'Gluten-Free', 'Hearty'],
    isGlutenFree: true
  },
  {
    id: 'rec-cream-spinach-chicken',
    title: 'Tuscan Creamy Garlic Spinach Chicken',
    description: 'Pan-seared chicken breasts smothered in a luxurious garlic, sun-dried tomato, and spinach cream sauce.',
    cuisine: 'Mediterranean',
    servings: 3,
    cookTimeMinutes: 22,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken', amount: '3 chicken breasts' },
      { name: 'Spinach', amount: '3 cups fresh' },
      { name: 'Garlic', amount: '4 cloves minced' },
      { name: 'Heavy Cream', amount: '3/4 cup' },
      { name: 'Parmesan Cheese', amount: '1/3 cup grated' },
      { name: 'Butter', amount: '2 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Season chicken breasts with salt and pepper. Sear in butter for 6 minutes per side until golden.', timerMinutes: 12 },
      { stepNumber: 2, instruction: 'Remove chicken. In same pan, sauté garlic and fresh spinach for 2 minutes.' },
      { stepNumber: 3, instruction: 'Pour heavy cream and grated parmesan into pan. Bring to gentle simmer.', timerMinutes: 3 },
      { stepNumber: 4, instruction: 'Return seared chicken to cream sauce and simmer for 3 minutes until rich and thick.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80',
    tags: ['Low Carb', 'Keto', 'Mediterranean', 'Gluten-Free'],
    isLowCarb: true,
    isGlutenFree: true
  },
  {
    id: 'rec-spinach-egg-frittata',
    title: 'Garlic Spinach & Tomato Frittata',
    description: 'Fluffy baked skillet omelette packed with wilted spinach, juicy tomatoes, and melted cheese.',
    cuisine: 'Italian',
    servings: 3,
    cookTimeMinutes: 20,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Eggs', amount: '6 large eggs' },
      { name: 'Spinach', amount: '2 cups fresh' },
      { name: 'Tomatoes', amount: '1 cup cherry tomatoes halved' },
      { name: 'Garlic', amount: '2 cloves minced' },
      { name: 'Parmesan Cheese', amount: '1/2 cup grated' },
      { name: 'Olive Oil', amount: '1 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Preheat oven to 190°C (375°F).' },
      { stepNumber: 2, instruction: 'Sauté garlic, spinach, and cherry tomatoes in an oven-safe skillet until spinach wilts.', timerMinutes: 3 },
      { stepNumber: 3, instruction: 'Whisk eggs with parmesan, salt, and pepper. Pour egg mixture over skillet vegetables.' },
      { stepNumber: 4, instruction: 'Transfer skillet to oven and bake for 14 minutes until center is puffed and set.', timerMinutes: 14 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584177188002-2d129fa75727?w=800&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'Low Carb', 'Gluten-Free', 'Breakfast'],
    isVegetarian: true,
    isLowCarb: true,
    isGlutenFree: true
  }
];
