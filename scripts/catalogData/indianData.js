module.exports = [
  {
    id: 'ind-001',
    title: 'Butter Chicken (Murgh Makhani)',
    description: 'Tender marinated chicken cooked in a velvety tomato, cream, and butter gravy with aromatic spices.',
    cuisine: 'Indian',
    countryOrRegion: 'Punjab, India',
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    totalTimeMinutes: 50,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken Thighs', amount: '600g boneless' },
      { name: 'Plain Yogurt', amount: '1/2 cup' },
      { name: 'Garam Masala', amount: '2 tsp' },
      { name: 'Butter', amount: '3 tbsp' },
      { name: 'Tomato Puree', amount: '1.5 cups' },
      { name: 'Heavy Cream', amount: '1/2 cup' },
      { name: 'Ginger Garlic Paste', amount: '2 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Marinate chicken in yogurt, ginger-garlic paste, and spices for 30 mins.', timerMinutes: 30 },
      { stepNumber: 2, instruction: 'Sear chicken in 1 tbsp butter until browned.', timerMinutes: 8 },
      { stepNumber: 3, instruction: 'Simmer tomato puree, remaining butter, and heavy cream for 10 mins.', timerMinutes: 10 },
      { stepNumber: 4, instruction: 'Combine chicken and gravy, simmer gently for 10 minutes.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Curry', 'Dinner', 'Comfort Food'],
    searchKeywords: ['butter chicken', 'murgh makhani', 'chicken curry', 'indian chicken', 'creamy curry'],
    isHighProtein: true,
    isGlutenFree: true,
    nutrition: { calories: 520, proteinGrams: 38, carbsGrams: 14, fatGrams: 34 }
  },
  {
    id: 'ind-002',
    title: 'Paneer Butter Masala',
    description: 'Soft cottage cheese cubes simmered in a creamy, mildly sweet tomato and cashew sauce.',
    cuisine: 'Indian',
    countryOrRegion: 'North India',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    totalTimeMinutes: 35,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Paneer', amount: '350g cubed' },
      { name: 'Ripe Tomatoes', amount: '4 pureed' },
      { name: 'Cashews', amount: '12 soaked' },
      { name: 'Butter', amount: '2 tbsp' },
      { name: 'Heavy Cream', amount: '3 tbsp' },
      { name: 'Kasuri Methi', amount: '1 tsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Blend boiled tomatoes and cashews into a smooth paste.' },
      { stepNumber: 2, instruction: 'Sauté ginger paste and cashew-tomato gravy in butter until oil separates.', timerMinutes: 10 },
      { stepNumber: 3, instruction: 'Fold in paneer cubes, cream, kasuri methi, and simmer for 5 minutes.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'High Protein', 'Curry', 'Dinner'],
    searchKeywords: ['paneer butter masala', 'paneer curry', 'cottage cheese', 'shahi paneer', 'vegetarian curry'],
    isVegetarian: true,
    isHighProtein: true,
    isGlutenFree: true,
    nutrition: { calories: 410, proteinGrams: 19, carbsGrams: 16, fatGrams: 30 }
  },
  {
    id: 'ind-003',
    title: 'Punjabi Chana Masala',
    description: 'Hearty chickpeas cooked in a tangy onion-tomato curry spiced with roasted cumin and amchur.',
    cuisine: 'Indian',
    countryOrRegion: 'Punjab, India',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    totalTimeMinutes: 35,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chickpeas', amount: '2 cans (800g)' },
      { name: 'Onions', amount: '2 finely chopped' },
      { name: 'Tomatoes', amount: '2 pureed' },
      { name: 'Chana Masala Spice', amount: '2 tbsp' },
      { name: 'Lemon Juice', amount: '1 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Sauté onions until deep golden brown.', timerMinutes: 7 },
      { stepNumber: 2, instruction: 'Add tomato puree and chana masala powder, cook down thick.', timerMinutes: 6 },
      { stepNumber: 3, instruction: 'Add chickpeas and 1 cup water, simmer on low for 15 minutes.', timerMinutes: 15 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    tags: ['Vegan', 'Vegetarian', 'High Fiber', 'Curry', 'Budget Friendly'],
    searchKeywords: ['chana masala', 'chickpea curry', 'chole', 'punjabi chole', 'vegan indian'],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isDairyFree: true,
    isBudgetFriendly: true,
    nutrition: { calories: 290, proteinGrams: 14, carbsGrams: 46, fatGrams: 6 }
  },
  {
    id: 'ind-004',
    title: 'Chicken Tikka Masala',
    description: 'Char-grilled spiced chicken chunks folded into a bright, creamy, orange-hued tomato curry.',
    cuisine: 'Indian',
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    totalTimeMinutes: 50,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken Breast', amount: '500g cubed' },
      { name: 'Plain Yogurt', amount: '1/2 cup' },
      { name: 'Tomato Sauce', amount: '1.5 cups' },
      { name: 'Heavy Cream', amount: '1/3 cup' },
      { name: 'Paprika & Garam Masala', amount: '1 tbsp each' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Broil yogurt-marinated chicken under oven grill for 12 mins until charred.', timerMinutes: 12 },
      { stepNumber: 2, instruction: 'Simmer tomato sauce with spices and cream, then fold in chicken.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Curry', 'Dinner', 'Popular'],
    searchKeywords: ['chicken tikka masala', 'tikka masala', 'grilled chicken curry'],
    isHighProtein: true,
    isGlutenFree: true,
    nutrition: { calories: 480, proteinGrams: 36, carbsGrams: 12, fatGrams: 28 }
  },
  {
    id: 'ind-005',
    title: 'Palak Paneer',
    description: 'Fresh paneer cubes cooked in a vibrant green spinach puree spiced with garlic and cumin.',
    cuisine: 'Indian',
    servings: 3,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    totalTimeMinutes: 35,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Paneer', amount: '250g cubed' },
      { name: 'Fresh Spinach', amount: '400g' },
      { name: 'Garlic', amount: '5 cloves minced' },
      { name: 'Onion', amount: '1 chopped' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Blanch spinach in boiling water 2 mins, shock in ice water, blend into smooth puree.' },
      { stepNumber: 2, instruction: 'Sauté garlic and onions, add spinach puree, spices, and paneer cubes. Simmer 5 mins.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'High Protein', 'Healthy', 'Curry'],
    searchKeywords: ['palak paneer', 'spinach paneer', 'saag paneer', 'green curry'],
    isVegetarian: true,
    isHighProtein: true,
    isGlutenFree: true,
    isLowCarb: true,
    nutrition: { calories: 310, proteinGrams: 18, carbsGrams: 10, fatGrams: 22 }
  }
];
