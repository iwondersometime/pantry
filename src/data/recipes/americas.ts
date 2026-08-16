import { Recipe } from '../../types';

export const AMERICAS_RECIPES: Recipe[] = [
  // --- MEXICAN ---
  {
    id: 'mex-street-tacos',
    title: 'Carne Asada Street Tacos',
    description: 'Char-grilled citrus marinated steak stuffed into warm corn tortillas with diced onions, cilantro, and fresh salsa verde.',
    cuisine: 'Mexican',
    servings: 3,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Flank / Skirt Steak', amount: '400g' },
      { name: 'Small Corn Tortillas', amount: '6' },
      { name: 'Lime Juice & Cilantro', amount: '3 tbsp each' },
      { name: 'Salsa Verde', amount: '1/2 cup' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Grill citrus-marinated steak over high heat 4 mins per side, rest and dice small.' },
      { stepNumber: 2, instruction: 'Warm corn tortillas, pile high with steak, raw diced onions, cilantro, and spoon salsa verde.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Quick', 'Street Food'],
    isHighProtein: true,
    isGlutenFree: true,
    isDairyFree: true,
    nutrition: { calories: 420, proteinGrams: 32, carbsGrams: 38, fatGrams: 16 }
  },
  {
    id: 'mex-guacamole-nachos',
    title: 'Loaded Fresh Guacamole & Corn Chips',
    description: 'Creamy smashed Hass avocados with lime, jalapeno, cilantro, tomato, served with warm crispy tortilla chips.',
    cuisine: 'Mexican',
    servings: 4,
    cookTimeMinutes: 10,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Ripe Hass Avocados', amount: '3' },
      { name: 'Fresh Lime Juice', amount: '2 tbsp' },
      { name: 'Roma Tomato & Jalapeno', amount: '1 each diced' },
      { name: 'Tortilla Chips', amount: '1 bag' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Coarsely mash avocado with lime juice and salt in molcajete or bowl.' },
      { stepNumber: 2, instruction: 'Fold in diced tomato, jalapeno, red onion, cilantro. Serve immediately with chips.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    tags: ['Vegan', 'Vegetarian', 'Quick', 'Appetizer'],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isDairyFree: true,
    nutrition: { calories: 310, proteinGrams: 4, carbsGrams: 28, fatGrams: 22 }
  },

  // --- AMERICAN ---
  {
    id: 'usa-smash-burger',
    title: 'Double Crispy Smash Burger',
    description: 'Crispy lacework edge beef patties topped with melted American cheese, pickles, and secret sauce on toasted brioche.',
    cuisine: 'American',
    servings: 2,
    cookTimeMinutes: 10,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Ground Beef (80/20)', amount: '300g balls' },
      { name: 'American Cheese Slices', amount: '4' },
      { name: 'Brioche Buns', amount: '2' },
      { name: 'Burger Sauce', amount: '2 tbsp' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Smash beef balls flat on screaming hot cast iron skillet until edges char crispy.' },
      { stepNumber: 2, instruction: 'Flip after 2 mins, immediately place cheese, stack double patties in toasted brioche bun with sauce and pickles.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    tags: ['High Protein', 'Comfort Food', 'Quick'],
    isHighProtein: true,
    nutrition: { calories: 650, proteinGrams: 38, carbsGrams: 36, fatGrams: 38 }
  },
  {
    id: 'usa-mac-and-cheese',
    title: 'Baked Three-Cheese Macaroni & Cheese',
    description: 'Elbow macaroni tossed in a velvety sharp cheddar, Gruyère, and Monterey Jack cheese sauce topped with crispy panko.',
    cuisine: 'American',
    servings: 4,
    cookTimeMinutes: 25,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Elbow Macaroni', amount: '300g' },
      { name: 'Sharp Cheddar & Gruyère', amount: '2.5 cups grated' },
      { name: 'Whole Milk & Butter', amount: '2 cups + 3 tbsp' },
      { name: 'Butter Panko', amount: '1/2 cup' }
    ],
    instructions: [
      { stepNumber: 1, instruction: 'Make roux with butter, flour, and milk. Whisk in grated cheeses until smooth sauce forms.' },
      { stepNumber: 2, instruction: 'Fold in boiled macaroni, transfer to baking dish, top with buttered panko, bake 15 mins at 200°C.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80',
    tags: ['Vegetarian', 'Comfort Food'],
    isVegetarian: true,
    nutrition: { calories: 540, proteinGrams: 22, carbsGrams: 52, fatGrams: 28 }
  }
];
