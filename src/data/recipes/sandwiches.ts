import { Recipe } from '../../types';

export const SANDWICH_RECIPES: Recipe[] = [
  // --- INDIAN SANDWICHES ---
  {
    id: "snd-001",
    title: "Bombay Sandwich",
    description: "A classic street-style sandwich loaded with raw sliced vegetables and green chutney.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    totalTimeMinutes: 10,
    difficulty: "Easy",
    ingredients: [
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Butter", amount: "1 tbsp" },
      { name: "Mint coriander chutney", amount: "1.5 tbsp" },
      { name: "Cucumber", amount: "4 slices" },
      { name: "Tomato", amount: "4 slices" },
      { name: "Boiled potato", amount: "4 slices" },
      { name: "Chaat masala", amount: "0.5 tsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Spread butter and mint coriander chutney on both bread slices." },
      { stepNumber: 2, instruction: "Layer cucumber, potato, and tomato slices on one bread piece." },
      { stepNumber: 3, instruction: "Sprinkle chaat masala over the veggies, top with the other slice, and grill or toast." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Street Food", "Vegetarian", "Quick"],
    searchKeywords: ["bombay sandwich", "vegetable sandwich", "chutney sandwich"]
  },
  {
    id: "snd-002",
    title: "Bombay Masala Sandwich",
    description: "Warm street sandwich layered with spicy mashed potato filling and crunchy veggies.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 10,
    cookTimeMinutes: 5,
    totalTimeMinutes: 15,
    difficulty: "Easy",
    ingredients: [
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Boiled mashed potato", amount: "0.5 cup" },
      { name: "Green chilies", amount: "1 piece (chopped)" },
      { name: "Turmeric powder", amount: "0.25 tsp" },
      { name: "Mustard seeds", amount: "0.25 tsp" },
      { name: "Butter", amount: "1 tbsp" },
      { name: "Green chutney", amount: "1 tbsp" },
      { name: "Onion", amount: "4 slices" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Tempering: Heat mustard seeds in a pan, add green chilies, turmeric, and mashed potato. Mix well and set aside." },
      { stepNumber: 2, instruction: "Assemble: Butter the bread, spread green chutney, lay potato mixture and onion slices." },
      { stepNumber: 3, instruction: "Toast the sandwich on a pan with butter until golden and crisp." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Potato", "Spicy", "Vegetarian"],
    searchKeywords: ["bombay masala", "masala toast", "aloo toast"]
  },
  {
    id: "snd-003",
    title: "Aloo Sandwich",
    description: "Simple comforting toasted sandwich stuffed with savory spiced potato mash.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    totalTimeMinutes: 10,
    difficulty: "Easy",
    ingredients: [
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Boiled potato", amount: "1 medium" },
      { name: "Cumin powder", amount: "0.5 tsp" },
      { name: "Chili powder", amount: "0.25 tsp" },
      { name: "Salt", amount: "0.5 tsp" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Mash the boiled potato thoroughly with cumin powder, chili powder, and salt." },
      { stepNumber: 2, instruction: "Spread the mixture evenly on one bread slice and cover with the other." },
      { stepNumber: 3, instruction: "Grill on a skillet with butter on both sides until crispy brown." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Potato", "Vegetarian", "Budget Friendly"],
    searchKeywords: ["aloo sandwich", "potato sandwich", "easy aloo"]
  },
  {
    id: "snd-004",
    title: "Aloo Tikki Sandwich",
    description: "Fusion sandwich with a crispy spiced potato patty and cool yogurt chutney spread.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    totalTimeMinutes: 20,
    difficulty: "Medium",
    ingredients: [
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Aloo tikki", amount: "1 patty" },
      { name: "Onion", amount: "3 slices" },
      { name: "Tomato", amount: "3 slices" },
      { name: "Sweet tamarind chutney", amount: "1 tbsp" },
      { name: "Green chutney", amount: "1 tbsp" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Pan-fry the aloo tikki on a skillet with a little oil until both sides are perfectly crisp." },
      { stepNumber: 2, instruction: "Butter the bread slices, spread green chutney on one side and tamarind chutney on the other." },
      { stepNumber: 3, instruction: "Place the tikki, onion, and tomato slices in between, then grill the sandwich." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Fusion", "Spicy", "Vegetarian"],
    searchKeywords: ["aloo tikki sandwich", "tikka burger", "patty sandwich"]
  },
  {
    id: "snd-005",
    title: "Paneer Tikka Sandwich",
    description: "Tandoori-spiced paneer cubes grilled inside bread for a rich smoky experience.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    totalTimeMinutes: 20,
    difficulty: "Medium",
    ingredients: [
      { name: "Paneer", amount: "80g (cubed)" },
      { name: "Yogurt", amount: "2 tbsp" },
      { name: "Tandoori masala", amount: "1 tsp" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Onion", amount: "0.25 cup (sliced)" },
      { name: "Bell pepper", amount: "0.25 cup (sliced)" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Marinate: Mix yogurt, tandoori masala, and a pinch of salt. Coat the paneer cubes thoroughly." },
      { stepNumber: 2, instruction: "Sauté: Cook marinated paneer, onion, and bell pepper in a pan for 5 minutes until lightly charred." },
      { stepNumber: 3, instruction: "Toast: Put paneer mixture inside buttered bread and toast on a skillet until golden." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Paneer", "Spicy", "Vegetarian", "High Protein"],
    searchKeywords: ["paneer tikka sandwich", "tandoori paneer", "cheese tikka"]
  },
  {
    id: "snd-006",
    title: "Paneer Bhurji Sandwich",
    description: "Savory scrambled paneer cooked with mild spices and folded into a crispy sandwich.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 8,
    cookTimeMinutes: 7,
    totalTimeMinutes: 15,
    difficulty: "Easy",
    ingredients: [
      { name: "Paneer", amount: "80g (crumbled)" },
      { name: "Onion", amount: "0.25 cup (chopped)" },
      { name: "Tomato", amount: "0.25 cup (chopped)" },
      { name: "Green chilies", amount: "1 piece (chopped)" },
      { name: "Turmeric powder", amount: "0.25 tsp" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Bhurji filling: Sauté onions, green chilies, and tomatoes. Add turmeric, salt, and crumbled paneer. Cook for 3 minutes." },
      { stepNumber: 2, instruction: "Assemble: Butter bread slices and spread the warm paneer bhurji inside." },
      { stepNumber: 3, instruction: "Toast: Griddle both sides of the sandwich with butter until crisp and hot." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Paneer", "Vegetarian", "High Protein"],
    searchKeywords: ["paneer bhurji", "paneer scrambled", "bhurji sandwich"]
  },
  {
    id: "snd-007",
    title: "Masala Cheese Toast",
    description: "Quick griddled bread topped with spicy coriander spread and melted cheese.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 3,
    cookTimeMinutes: 5,
    totalTimeMinutes: 8,
    difficulty: "Easy",
    ingredients: [
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Butter", amount: "1 tbsp" },
      { name: "Green chutney", amount: "1 tbsp" },
      { name: "Cheddar cheese", amount: "0.5 cup (grated)" },
      { name: "Chaat masala", amount: "0.25 tsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Lightly toast one side of the bread slices on a skillet." },
      { stepNumber: 2, instruction: "Spread green chutney, generous cheese, and chaat masala on the toasted sides." },
      { stepNumber: 3, instruction: "Cover, place back on low heat, cover with a lid for 3 minutes until cheese is fully melted." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Cheese", "Vegetarian", "Quick"],
    searchKeywords: ["masala cheese toast", "cheese toast", "chutney cheese"]
  },
  {
    id: "snd-008",
    title: "Chutney Cheese Sandwich",
    description: "Simple cold or toasted sandwich pairing rich cheddar cheese with spicy mint chutney.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 3,
    cookTimeMinutes: 3,
    totalTimeMinutes: 6,
    difficulty: "Easy",
    ingredients: [
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Green chutney", amount: "1.5 tbsp" },
      { name: "Cheese slices", amount: "2 pieces" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Spread butter and green chutney evenly across both slices of bread." },
      { stepNumber: 2, instruction: "Lay down cheese slices, cover, and optionally toast with butter on a pan." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Cheese", "Vegetarian", "Quick", "Budget Friendly"],
    searchKeywords: ["chutney cheese", "cheese sandwich", "coriander cheese"]
  },
  {
    id: "snd-009",
    title: "Corn Cheese Sandwich",
    description: "Sweet golden corn kernels mixed with melted cheese and Italian seasoning inside golden toast.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    totalTimeMinutes: 10,
    difficulty: "Easy",
    ingredients: [
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Sweet corn", amount: "0.33 cup (boiled)" },
      { name: "Mozzarella cheese", amount: "0.33 cup (shredded)" },
      { name: "Black pepper", amount: "0.25 tsp" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "In a bowl, combine boiled sweet corn, mozzarella cheese, black pepper, and a pinch of salt." },
      { stepNumber: 2, instruction: "Spread the cheesy corn mixture over buttered bread slice and close with second slice." },
      { stepNumber: 3, instruction: "Toast on a skillet using butter until golden brown and the cheese starts oozing." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Cheese", "Corn", "Vegetarian", "Quick"],
    searchKeywords: ["corn cheese", "sweet corn toast", "cheesy corn"]
  },
  {
    id: "snd-010",
    title: "Vegetable Masala Sandwich",
    description: "Triple-layer sandwich packed with cucumbers, onions, beets, and potato with special spice.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 8,
    cookTimeMinutes: 5,
    totalTimeMinutes: 13,
    difficulty: "Easy",
    ingredients: [
      { name: "Bread slices", amount: "3 pieces" },
      { name: "Butter", amount: "1.5 tbsp" },
      { name: "Green chutney", amount: "2 tbsp" },
      { name: "Tomato", amount: "3 slices" },
      { name: "Cucumber", amount: "3 slices" },
      { name: "Onion", amount: "3 slices" },
      { name: "Boiled beetroot", amount: "3 slices" },
      { name: "Chaat masala", amount: "0.5 tsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Butter all three slices. Spread green chutney on two of them." },
      { stepNumber: 2, instruction: "Layer potato and cucumber slices on first bread slice, sprinkle chaat masala, place second slice on top." },
      { stepNumber: 3, instruction: "Layer tomato, onion, and beetroot slices on the second bread, sprinkle masala, close with third slice. Press gently and grill." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Vegetarian", "Healthy", "Street Food"],
    searchKeywords: ["vegetable masala", "veg toast", "club veg"]
  },
  {
    id: "snd-011",
    title: "Schezwan Paneer Sandwich",
    description: "Fiery Indo-Chinese fusion sandwich featuring scrambled paneer in pungent Schezwan sauce.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    totalTimeMinutes: 10,
    difficulty: "Easy",
    ingredients: [
      { name: "Paneer", amount: "80g (crumbled)" },
      { name: "Schezwan sauce", amount: "1.5 tbsp" },
      { name: "Onion", amount: "2 tbsp (chopped)" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "In a bowl, mix crumbled paneer, chopped onions, and Schezwan sauce thoroughly." },
      { stepNumber: 2, instruction: "Fill the mixture between two slices of buttered bread." },
      { stepNumber: 3, instruction: "Grill on a skillet with butter until the bread gets crisp and spicy edges turn golden." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Paneer", "Spicy", "Fusion", "Vegetarian"],
    searchKeywords: ["schezwan paneer", "chinese paneer", "spicy paneer"]
  },
  {
    id: "snd-012",
    title: "Samosa Sandwich",
    description: "The ultimate student comfort food: crushed hot samosa layered with cheese and chutneys in bread.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    totalTimeMinutes: 10,
    difficulty: "Easy",
    ingredients: [
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Samosa", amount: "1 piece" },
      { name: "Sweet tamarind chutney", amount: "1 tbsp" },
      { name: "Green chutney", amount: "1 tbsp" },
      { name: "Onion", amount: "2 tbsp (sliced)" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Butter the bread slices. Spread green chutney on one slice and tamarind chutney on the other." },
      { stepNumber: 2, instruction: "Place the samosa on one slice and flatten it gently with a spoon. Scatter onion slices on top." },
      { stepNumber: 3, instruction: "Close the sandwich, press down, and grill with butter until crispy golden." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Samosa", "Street Food", "Vegetarian", "Budget Friendly"],
    searchKeywords: ["samosa sandwich", "samosa toast", "street samosa"]
  },
  {
    id: "snd-013",
    title: "Maggi Sandwich",
    description: "Quirky hostel specialty stuff: masala Maggi noodles griddled with butter between crisp bread.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 8,
    totalTimeMinutes: 13,
    difficulty: "Easy",
    ingredients: [
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Maggi noodles", amount: "0.5 pack (cooked dry)" },
      { name: "Maggi taste maker", amount: "0.5 packet" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Cook Maggi noodles with very little water and tastemaker so it turns out dry and thick." },
      { stepNumber: 2, instruction: "Spoon the dry masala noodles onto a buttered bread slice, then close the sandwich." },
      { stepNumber: 3, instruction: "Toast on a hot griddle with plenty of butter until crisp." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Maggi", "Noodles", "Vegetarian", "Budget Friendly"],
    searchKeywords: ["maggi sandwich", "noodles sandwich", "hostel maggi"]
  },
  {
    id: "snd-014",
    title: "Egg Bhurji Sandwich",
    description: "Spicy Indian-style scrambled eggs loaded with onions and green chilies inside crispy toast.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 7,
    totalTimeMinutes: 12,
    difficulty: "Easy",
    ingredients: [
      { name: "Eggs", amount: "2 pieces" },
      { name: "Onion", amount: "0.25 cup (chopped)" },
      { name: "Tomato", amount: "0.25 cup (chopped)" },
      { name: "Green chilies", amount: "1 piece (chopped)" },
      { name: "Coriander powder", amount: "0.5 tsp" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Scramble: Sauté onion, tomato, and chili. Crack eggs in, add coriander powder and salt, scramble until dry." },
      { stepNumber: 2, instruction: "Assemble: Place egg bhurji between two buttered slices of bread." },
      { stepNumber: 3, instruction: "Toast: Griddle with butter on medium heat until golden brown on both sides." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Egg", "Spicy", "High Protein"],
    searchKeywords: ["egg bhurji sandwich", "scrambled egg toast", "spicy egg sandwich"]
  },
  {
    id: "snd-015",
    title: "Masala Egg Sandwich",
    description: "Pan-grilled omelette seasoned with turmeric and chilies wrapped neatly in warm buttered bread.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 3,
    cookTimeMinutes: 5,
    totalTimeMinutes: 8,
    difficulty: "Easy",
    ingredients: [
      { name: "Eggs", amount: "2 pieces" },
      { name: "Onion", amount: "2 tbsp (chopped)" },
      { name: "Turmeric powder", amount: "0.25 tsp" },
      { name: "Chili powder", amount: "0.25 tsp" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Whisk eggs with chopped onion, turmeric, chili powder, and salt." },
      { stepNumber: 2, instruction: "Make a quick round omelette on a buttered pan. Fold it to match the shape of the bread." },
      { stepNumber: 3, instruction: "Butter the bread, place the omelette inside, and toast for 1 minute." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Egg", "Spicy", "Quick", "High Protein"],
    searchKeywords: ["masala egg sandwich", "bread omelette", "omelette toast"]
  },
  {
    id: "snd-016",
    title: "Chicken Tikka Sandwich",
    description: "Smoked tandoori chicken tikka pieces layered with green chutney and onion rings in soft white bread.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 8,
    cookTimeMinutes: 7,
    totalTimeMinutes: 15,
    difficulty: "Medium",
    ingredients: [
      { name: "Boneless chicken breast", amount: "100g (shredded or cubed)" },
      { name: "Yogurt", amount: "1.5 tbsp" },
      { name: "Tandoori masala", amount: "1 tsp" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Onion", amount: "0.25 cup (sliced)" },
      { name: "Green chutney", amount: "1 tbsp" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Mix shredded chicken with yogurt, tandoori masala, and salt. Sauté in a pan until cooked and slightly charred." },
      { stepNumber: 2, instruction: "Butter the bread, spread green chutney on one slice, and add the warm chicken tikka and onion slices." },
      { stepNumber: 3, instruction: "Close the sandwich and toast on a skillet with butter." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Chicken", "Spicy", "High Protein"],
    searchKeywords: ["chicken tikka sandwich", "tandoori chicken", "tikka sandwich"]
  },
  {
    id: "snd-017",
    title: "Tandoori Chicken Sandwich",
    description: "Robust sandwich loaded with smoky tandoori chicken chunks and cooled mint-garlic aioli.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    totalTimeMinutes: 20,
    difficulty: "Medium",
    ingredients: [
      { name: "Boneless chicken breast", amount: "100g" },
      { name: "Tandoori spice blend", amount: "1 tbsp" },
      { name: "Yogurt", amount: "1 tbsp" },
      { name: "Mayonnaise", amount: "2 tbsp" },
      { name: "Garlic paste", amount: "0.25 tsp" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Lettuce", amount: "1 leaf" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Marinate chicken in yogurt and tandoori spices. Pan-sear for 8 minutes until tender and cooked. Slice into strips." },
      { stepNumber: 2, instruction: "In a small cup, mix mayo and garlic paste. Spread onto the bread slices." },
      { stepNumber: 3, instruction: "Assemble with lettuce, tandoori chicken strips, and toast lightly." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Chicken", "Spicy", "High Protein"],
    searchKeywords: ["tandoori chicken sandwich", "smoky chicken sandwich", "mayo chicken"]
  },
  {
    id: "snd-018",
    title: "Chicken Keema Sandwich",
    description: "Zesty minced chicken sautéed with warm spices, stuffed inside a grilled toasted bun or bread slice.",
    cuisine: "Indian",
    countryOrRegion: "India",
    servings: 1,
    prepTimeMinutes: 8,
    cookTimeMinutes: 12,
    totalTimeMinutes: 20,
    difficulty: "Medium",
    ingredients: [
      { name: "Minced chicken", amount: "100g" },
      { name: "Onion", amount: "0.25 cup (chopped)" },
      { name: "Tomato", amount: "0.25 cup (chopped)" },
      { name: "Garam masala", amount: "0.5 tsp" },
      { name: "Ginger garlic paste", amount: "0.5 tsp" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Heat oil, sauté onion and ginger garlic paste. Add tomatoes and ground spices (garam masala, salt)." },
      { stepNumber: 2, instruction: "Add minced chicken (keema) and cook on medium heat for 8 minutes until dry and fully cooked." },
      { stepNumber: 3, instruction: "Spread the thick chicken keema filling on toasted bread, top with butter, and grill." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&auto=format&fit=crop&q=80",
    tags: ["Indian", "Chicken", "Minced Meat", "High Protein"],
    searchKeywords: ["chicken keema", "keema sandwich", "keema toast"]
  },

  // --- INTERNATIONAL SANDWICHES ---
  {
    id: "snd-019",
    title: "Grilled Cheese",
    description: "Golden griddled sourdough with a perfectly melted, gooey stringy cheese center.",
    cuisine: "American",
    countryOrRegion: "USA",
    servings: 1,
    prepTimeMinutes: 2,
    cookTimeMinutes: 6,
    totalTimeMinutes: 8,
    difficulty: "Easy",
    ingredients: [
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Cheddar cheese", amount: "0.5 cup (grated)" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Butter the outer sides of both bread slices." },
      { stepNumber: 2, instruction: "Place cheese generously between the unbuttered sides." },
      { stepNumber: 3, instruction: "Cook on a skillet over medium-low heat until bread is golden brown and cheese is fully melted." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
    tags: ["American", "Cheese", "Vegetarian", "Quick", "Budget Friendly"],
    searchKeywords: ["grilled cheese", "melted cheese", "toastie"]
  },
  {
    id: "snd-020",
    title: "BLT",
    description: "Classic combination of crispy bacon, crisp lettuce, and ripe tomato slices with rich mayo.",
    cuisine: "American",
    countryOrRegion: "USA",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    totalTimeMinutes: 10,
    difficulty: "Easy",
    ingredients: [
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Bacon", amount: "3 strips" },
      { name: "Lettuce", amount: "2 leaves" },
      { name: "Tomato", amount: "3 slices" },
      { name: "Mayonnaise", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Cook bacon in a pan until crispy, then drain on a paper towel." },
      { stepNumber: 2, instruction: "Toast bread slices and spread mayonnaise on both inward-facing sides." },
      { stepNumber: 3, instruction: "Layer crispy bacon, lettuce, and tomato slices. Slice diagonally and serve." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&auto=format&fit=crop&q=80",
    tags: ["American", "Bacon", "Classic", "Quick"],
    searchKeywords: ["blt", "bacon lettuce tomato", "classic sandwich"]
  },
  {
    id: "snd-021",
    title: "Club Sandwich",
    description: "Double-decker diner classic loaded with turkey, bacon, crisp lettuce, tomato, and creamy mayonnaise.",
    cuisine: "American",
    countryOrRegion: "USA",
    servings: 1,
    prepTimeMinutes: 7,
    cookTimeMinutes: 8,
    totalTimeMinutes: 15,
    difficulty: "Medium",
    ingredients: [
      { name: "Bread slices", amount: "3 pieces" },
      { name: "Turkey slices", amount: "3 pieces" },
      { name: "Bacon", amount: "2 strips" },
      { name: "Lettuce", amount: "2 leaves" },
      { name: "Tomato", amount: "4 slices" },
      { name: "Mayonnaise", amount: "1.5 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Toast all three slices of bread. Cook bacon until perfectly crisp." },
      { stepNumber: 2, instruction: "Build first deck: Spread mayo on bread, lay lettuce, tomato, and crispy bacon, cover with second slice." },
      { stepNumber: 3, instruction: "Build second deck: Spread mayo on second slice, lay turkey slices and lettuce, top with final slice. Secure with toothpicks and cut into triangles." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&auto=format&fit=crop&q=80",
    tags: ["American", "Classic", "Double Decker", "High Protein"],
    searchKeywords: ["club sandwich", "diner sandwich", "turkey club"]
  },
  {
    id: "snd-022",
    title: "Tuna Melt",
    description: "Classic comforting tuna salad mixture toasted on bread with cheddar cheese melted over top.",
    cuisine: "American",
    countryOrRegion: "USA",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    totalTimeMinutes: 10,
    difficulty: "Easy",
    ingredients: [
      { name: "Canned tuna", amount: "100g (drained)" },
      { name: "Mayonnaise", amount: "1.5 tbsp" },
      { name: "Cheddar cheese", amount: "2 slices" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Onion", amount: "1 tbsp (chopped)" },
      { name: "Butter", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "In a bowl, flake the tuna and mix thoroughly with mayo, chopped onion, and a pinch of salt." },
      { stepNumber: 2, instruction: "Spread tuna mixture onto one slice of bread, lay cheddar cheese on top, and close." },
      { stepNumber: 3, instruction: "Griddle with butter until bread is golden and the cheese has melted beautifully." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
    tags: ["American", "Seafood", "Tuna", "Cheese", "Quick"],
    searchKeywords: ["tuna melt", "tuna sandwich", "fish cheese toast"]
  },
  {
    id: "snd-023",
    title: "Chicken Sandwich",
    description: "Simple pan-fried chicken breast fillet served with fresh lettuce and dynamic mayo spread.",
    cuisine: "American",
    countryOrRegion: "USA",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    totalTimeMinutes: 15,
    difficulty: "Easy",
    ingredients: [
      { name: "Boneless chicken breast", amount: "120g" },
      { name: "Mayonnaise", amount: "1 tbsp" },
      { name: "Lettuce", amount: "1 leaf" },
      { name: "Tomato", amount: "2 slices" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Salt and pepper", amount: "1 pinch" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Season chicken breast with salt and black pepper. Pan-fry in oil for 5 minutes per side until fully cooked." },
      { stepNumber: 2, instruction: "Lightly toast bread, spread mayonnaise on both interior surfaces." },
      { stepNumber: 3, instruction: "Assemble with lettuce, tomato slices, and the warm cooked chicken breast." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&auto=format&fit=crop&q=80",
    tags: ["American", "Chicken", "High Protein", "Easy"],
    searchKeywords: ["chicken sandwich", "classic chicken burger", "poultry sandwich"]
  },
  {
    id: "snd-024",
    title: "Caprese Sandwich",
    description: "Elegant Italian combination of thick fresh mozzarella, ripe tomatoes, basil, and balsamic reduction.",
    cuisine: "Italian",
    countryOrRegion: "Italy",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    totalTimeMinutes: 5,
    difficulty: "Easy",
    ingredients: [
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Mozzarella cheese", amount: "80g (sliced)" },
      { name: "Tomato", amount: "4 slices" },
      { name: "Fresh basil leaves", amount: "4 pieces" },
      { name: "Olive oil", amount: "1 tsp" },
      { name: "Balsamic glaze", amount: "1 tsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Drizzle olive oil onto the inner side of both bread slices." },
      { stepNumber: 2, instruction: "Layer fresh mozzarella slices, tomato slices, and fresh basil leaves neatly." },
      { stepNumber: 3, instruction: "Drizzle with balsamic glaze, close the sandwich, and enjoy cold or warm." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80",
    tags: ["Italian", "Mozzarella", "Basil", "Vegetarian", "Quick"],
    searchKeywords: ["caprese sandwich", "mozzarella basil", "tomato cheese"]
  },
  {
    id: "snd-025",
    title: "Japanese Egg Sandwich",
    description: "Incredibly soft, creamy, and pillowy egg salad sandwich with seasoned Japanese mayo.",
    cuisine: "Japanese",
    countryOrRegion: "Japan",
    servings: 1,
    prepTimeMinutes: 7,
    cookTimeMinutes: 8,
    totalTimeMinutes: 15,
    difficulty: "Easy",
    ingredients: [
      { name: "Eggs", amount: "2 pieces" },
      { name: "Mayonnaise", amount: "1.5 tbsp (Kewpie style)" },
      { name: "Sugar", amount: "0.25 tsp" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Butter", amount: "1 tsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Boil: Place eggs in boiling water for 8.5 minutes. Cool in ice, peel, and separate whites and yolks." },
      { stepNumber: 2, instruction: "Mash: Mash yolks with mayo, sugar, a pinch of salt. Finely chop egg whites and fold into the yolk mix." },
      { stepNumber: 3, instruction: "Butter bread slices, pile the rich egg salad mixture thickly in the middle, and close." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80",
    tags: ["Japanese", "Egg", "Quick", "Creamy", "High Protein"],
    searchKeywords: ["japanese egg sandwich", "tamago sando", "egg salad sandwich"]
  },
  {
    id: "snd-026",
    title: "Katsu Sando",
    description: "Crispy fried breaded chicken cutlet drenched in sweet Tonkatsu sauce inside soft white bread.",
    cuisine: "Japanese",
    countryOrRegion: "Japan",
    servings: 1,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    totalTimeMinutes: 20,
    difficulty: "Medium",
    ingredients: [
      { name: "Boneless chicken breast", amount: "120g" },
      { name: "Breadcrumbs", amount: "0.25 cup" },
      { name: "Eggs", amount: "1 piece (beaten)" },
      { name: "Tonkatsu sauce", amount: "2 tbsp" },
      { name: "Cabbage", amount: "0.25 cup (shredded)" },
      { name: "Bread slices", amount: "2 pieces" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Bread: Flatten chicken breast slightly, coat with beaten egg, and press firmly into breadcrumbs." },
      { stepNumber: 2, instruction: "Fry: Pan-fry the chicken in thin oil until deep golden and cooked through. Dip into Tonkatsu sauce." },
      { stepNumber: 3, instruction: "Assemble: Place shredded cabbage, chicken katsu, and sweet sauce between two bread slices. Trim edges and slice." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&auto=format&fit=crop&q=80",
    tags: ["Japanese", "Chicken", "Crispy", "High Protein"],
    searchKeywords: ["katsu sando", "chicken katsu sandwich", "sando"]
  },
  {
    id: "snd-027",
    title: "Korean Egg Toast",
    description: "Popular street toast with soft fluffy folded egg, sweet jam, sugar sprinkle, and melting cheddar.",
    cuisine: "Korean",
    countryOrRegion: "South Korea",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    totalTimeMinutes: 10,
    difficulty: "Easy",
    ingredients: [
      { name: "Eggs", amount: "2 pieces" },
      { name: "Cheddar cheese", amount: "1 slice" },
      { name: "Sugar", amount: "1 tsp" },
      { name: "Fruit jam", amount: "1 tbsp" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Butter", amount: "1.5 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Pan-fry both bread slices with plenty of butter until crispy brown. Spread jam on one toasted slice." },
      { stepNumber: 2, instruction: "Whisk eggs with a splash of milk and salt. Fry in a pan, folding it into a neat square." },
      { stepNumber: 3, instruction: "Assemble: Put the egg square, cheddar slice, sugar sprinkle, and jam slice together while piping hot." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80",
    tags: ["Korean", "Egg", "Sweet and Savory", "Quick"],
    searchKeywords: ["korean egg toast", "street toast", "gilgeori toast"]
  },
  {
    id: "snd-028",
    title: "Teriyaki Chicken Sandwich",
    description: "Pan-seared chicken breast glazed in glossy sweet teriyaki sauce, topped with green onion.",
    cuisine: "Japanese",
    countryOrRegion: "Japan",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    totalTimeMinutes: 15,
    difficulty: "Easy",
    ingredients: [
      { name: "Boneless chicken breast", amount: "120g" },
      { name: "Soy sauce", amount: "1.5 tbsp" },
      { name: "Sugar", amount: "1 tbsp" },
      { name: "Bread slices", amount: "2 pieces" },
      { name: "Mayonnaise", amount: "1 tbsp" },
      { name: "Lettuce", amount: "1 leaf" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Sear: Cook chicken in a hot oiled skillet for 4 minutes on each side." },
      { stepNumber: 2, instruction: "Glaze: Add soy sauce, sugar, and 1 tbsp water to the pan. Simmer until it thickens into a sticky glaze coating the chicken." },
      { stepNumber: 3, instruction: "Assemble: Butter bread, spread mayo, lay down lettuce, teriyaki chicken breast, and secure." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    tags: ["Japanese", "Chicken", "Sweet", "High Protein"],
    searchKeywords: ["teriyaki chicken sandwich", "teriyaki breast", "japanese chicken"]
  }
];
