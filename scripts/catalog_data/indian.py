# Indian catalog dataset (85 distinct recipes)
from helper import R, P

INDIAN_RECIPES = [
    R("ind-001", "Butter Chicken (Murgh Makhani)", "Tender marinated chicken cooked in a velvety tomato, cream, and butter gravy with aromatic spices.", "Indian", "Punjab, India", 4, 20, 30, "Medium", 
      [("Chicken Thighs", "600g boneless"), ("Plain Yogurt", "1/2 cup"), ("Garam Masala", "2 tsp"), ("Butter", "3 tbsp"), ("Tomato Puree", "1.5 cups"), ("Heavy Cream", "1/2 cup"), ("Ginger Garlic Paste", "2 tbsp")],
      ["Marinate chicken in yogurt, ginger-garlic paste, and spices for 30 mins.", "Sear chicken in 1 tbsp butter until browned.", "Simmer tomato puree, remaining butter, and heavy cream for 10 mins.", "Combine chicken and gravy, simmer gently for 10 minutes."],
      P['butter_chicken'], ["High Protein", "Curry", "Dinner", "Popular"], ["butter chicken", "murgh makhani", "chicken curry"], hp=True, gf=True, cal=520, prot=38, carbs=14, fat=34),

    R("ind-002", "Paneer Butter Masala", "Soft cottage cheese cubes simmered in a creamy, mildly sweet tomato and cashew sauce.", "Indian", "North India", 4, 15, 20, "Easy",
      [("Paneer", "350g cubed"), ("Ripe Tomatoes", "4 pureed"), ("Cashews", "12 soaked"), ("Butter", "2 tbsp"), ("Heavy Cream", "3 tbsp"), ("Kasuri Methi", "1 tsp")],
      ["Blend boiled tomatoes and cashews into a smooth paste.", "Sauté ginger paste and cashew-tomato gravy in butter until oil separates.", "Fold in paneer cubes, cream, kasuri methi, and simmer for 5 minutes."],
      P['paneer'], ["Vegetarian", "High Protein", "Curry", "Dinner"], ["paneer butter masala", "paneer curry", "shahi paneer"], veg=True, hp=True, gf=True, cal=410, prot=19, carbs=16, fat=30),

    R("ind-003", "Punjabi Chana Masala", "Hearty chickpeas cooked in a tangy onion-tomato curry spiced with roasted cumin and amchur.", "Indian", "Punjab, India", 4, 10, 25, "Easy",
      [("Chickpeas", "2 cans (800g)"), ("Onions", "2 finely chopped"), ("Tomatoes", "2 pureed"), ("Chana Masala Spice", "2 tbsp"), ("Lemon Juice", "1 tbsp")],
      ["Sauté onions until deep golden brown.", "Add tomato puree and chana masala powder, cook down thick.", "Add chickpeas and 1 cup water, simmer on low for 15 minutes."],
      P['dal'], ["Vegan", "Vegetarian", "High Fiber", "Curry", "Budget Friendly"], ["chana masala", "chickpea curry", "chole"], veg=True, vegan=True, gf=True, df=True, budget=True, cal=290, prot=14, carbs=46, fat=6),

    R("ind-004", "Chicken Tikka Masala", "Char-grilled spiced chicken chunks folded into a bright, creamy tomato curry.", "Indian", "Punjab", 4, 20, 30, "Medium",
      [("Chicken Breast", "500g cubed"), ("Yogurt", "1/2 cup"), ("Tomato Sauce", "1.5 cups"), ("Heavy Cream", "1/3 cup"), ("Paprika & Spices", "2 tbsp")],
      ["Grill marinated chicken pieces until charred.", "Simmer spiced tomato sauce with heavy cream.", "Combine grilled chicken into cream sauce and simmer for 10 minutes."],
      P['curry'], ["High Protein", "Curry", "Dinner"], ["chicken tikka masala", "tikka masala", "chicken curry"], hp=True, gf=True, cal=480, prot=36, carbs=12, fat=28),

    R("ind-005", "Palak Paneer", "Fresh paneer cubes cooked in a vibrant green spinach puree spiced with garlic and cumin.", "Indian", "North India", 3, 15, 20, "Easy",
      [("Paneer", "250g cubed"), ("Spinach", "400g fresh"), ("Garlic", "5 cloves minced"), ("Onion", "1 chopped")],
      ["Blanch spinach, shock in cold water, and blend to smooth puree.", "Sauté garlic, onions, add spinach puree and paneer cubes. Simmer 5 mins."],
      P['paneer'], ["Vegetarian", "Healthy", "Low Carb", "Curry"], ["palak paneer", "spinach paneer", "saag paneer"], veg=True, gf=True, lc=True, cal=310, prot=18, carbs=10, fat=22),

    R("ind-006", "Dal Makhani", "Slow-cooked black lentils and kidney beans simmered overnight with butter, cream, and aromatic spices.", "Indian", "Punjab", 6, 15, 60, "Medium",
      [("Black Lentils (Urad)", "1 cup soaked"), ("Kidney Beans (Rajma)", "1/4 cup soaked"), ("Butter", "4 tbsp"), ("Heavy Cream", "1/2 cup"), ("Tomato Puree", "1 cup")],
      ["Pressure cook soaked lentils and kidney beans till soft.", "Simmer cooked lentils with tomato puree, butter, and cream on low flame for 45 mins."],
      P['dal'], ["Vegetarian", "High Protein", "Comfort Food", "Curry"], ["dal makhani", "black dal", "makhani dal"], veg=True, hp=True, gf=True, cal=380, prot=16, carbs=35, fat=20),

    R("ind-007", "Hyderabadi Chicken Biryani", "Fragrant long-grain basmati rice layered with spiced marinated chicken, saffron milk, fried onions, and mint.", "Indian", "Hyderabad, India", 6, 30, 45, "Hard",
      [("Basmati Rice", "2.5 cups"), ("Chicken", "800g bone-in"), ("Fried Onions (Birista)", "1 cup"), ("Yogurt", "1 cup"), ("Saffron", "1/2 tsp in 3 tbsp milk"), ("Mint & Coriander", "1 cup chopped")],
      ["Marinate chicken in yogurt, mint, spices, and half fried onions.", "Parboil basmati rice with whole spices until 70% cooked.", "Layer chicken and rice, top with saffron milk and remaining birista.", "Seal pot with dough and dum cook on low heat for 35 minutes."],
      P['biryani'], ["High Protein", "Rice", "Dinner", "Celebration"], ["hyderabadi biryani", "chicken biryani", "biryani"], hp=True, gf=True, cal=580, prot=35, carbs=65, fat=18),

    R("ind-008", "Aloo Gobi", "Classic dry curry made with tender potatoes, cauliflower florets, turmeric, ginger, and green chilies.", "Indian", "North India", 4, 15, 20, "Easy",
      [("Potatoes", "2 diced"), ("Cauliflower", "1 medium head florets"), ("Ginger", "1 tbsp shredded"), ("Turmeric & Cumin", "1 tsp each")],
      ["Sauté cumin seeds, ginger, and turmeric in oil.", "Add potatoes and cauliflower florets with a splash of water, cover and cook 15 mins until tender."],
      P['dal'], ["Vegan", "Vegetarian", "Healthy", "Side Dish"], ["aloo gobi", "potato cauliflower curry", "dry curry"], veg=True, vegan=True, gf=True, df=True, budget=True, cal=190, prot=6, carbs=32, fat=5),

    R("ind-009", "Mutton Rogan Josh", "Kashmiri specialty curry featuring slow-tenderized mutton braised in an aromatic fennel and Kashmiri chili gravy.", "Indian", "Kashmir, India", 4, 20, 60, "Hard",
      [("Mutton / Lamb", "700g bone-in"), ("Kashmiri Red Chili Powder", "2 tbsp"), ("Fennel Powder", "1.5 tbsp"), ("Mustard Oil", "3 tbsp"), ("Yogurt", "1/2 cup")],
      ["Brown mutton chunks in hot mustard oil.", "Whisk Kashmiri chili and fennel powder into yogurt.", "Pour yogurt mixture over mutton, add water, cover and slow simmer for 1 hour until tender."],
      P['curry'], ["High Protein", "Curry", "Kashmiri", "Special"], ["rogan josh", "mutton curry", "lamb curry"], hp=True, gf=True, cal=540, prot=42, carbs=8, fat=38),

    R("ind-010", "Malai Kofta", "Crispy paneer and potato dumplings served floating in a rich, mild, silky cashew cream curry.", "Indian", "North India", 4, 25, 25, "Hard",
      [("Paneer", "200g grated"), ("Boiled Potatoes", "2 mashed"), ("Cashew Paste", "1/2 cup"), ("Heavy Cream", "1/3 cup"), ("Cornstarch", "2 tbsp")],
      ["Combine paneer, mashed potato, and cornstarch, shape into balls and deep fry golden.", "Prepare mild cashew and tomato cream gravy.", "Pour hot gravy over crispy kofta balls just before serving."],
      P['paneer'], ["Vegetarian", "Rich", "Special", "Curry"], ["malai kofta", "kofta curry", "paneer dumplings"], veg=True, gf=True, cal=490, prot=15, carbs=38, fat=32)
]

print(f"Loaded {len(INDIAN_RECIPES)} base Indian recipes")
