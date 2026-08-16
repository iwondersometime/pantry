import json
import os

out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'recipes'))
os.makedirs(out_dir, exist_ok=True)

P = {
    'butter_chicken': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    'paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
    'dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    'biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    'curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
    'dosa': 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80',
    'samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    'kebab': 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop&q=80',
    'carbonara': 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop&q=80',
    'pasta_red': 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?w=800&auto=format&fit=crop&q=80',
    'pasta_pesto': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
    'pizza_margherita': 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80',
    'pizza_pepperoni': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    'risotto': 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800&auto=format&fit=crop&q=80',
    'bruschetta': 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&auto=format&fit=crop&q=80',
    'lasagna': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop&q=80',
    'ramen': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    'sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    'dumplings': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop&q=80',
    'rice_bowl': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80',
    'pad_thai': 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80',
    'fried_rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80',
    'pho': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80',
    'tacos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
    'burrito': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80',
    'guacamole': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    'mac_cheese': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&auto=format&fit=crop&q=80',
    'steak': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    'pancakes': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80',
    'shakshuka': 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&auto=format&fit=crop&q=80',
    'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
    'greek_salad': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    'salmon': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
    'roast_chicken': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80',
    'soup': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80',
    'dessert': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
    'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
}

def R(id, title, desc, cuisine, region, servings, prep, cook, diff, ingredients, steps, img, tags, keywords, veg=False, vegan=False, gf=False, df=False, lc=False, hp=False, budget=False, cal=400, prot=20, carbs=40, fat=15):
    return {
        "id": id,
        "title": title,
        "description": desc,
        "cuisine": cuisine,
        "countryOrRegion": region,
        "servings": servings,
        "prepTimeMinutes": prep,
        "cookTimeMinutes": cook,
        "totalTimeMinutes": prep + cook,
        "difficulty": diff,
        "ingredients": [{"name": i[0], "amount": i[1]} for i in ingredients],
        "instructions": [{"stepNumber": idx + 1, "instruction": s} for idx, s in enumerate(steps)],
        "imageUrl": img,
        "tags": tags,
        "searchKeywords": keywords,
        "isVegetarian": veg,
        "isVegan": vegan,
        "isGlutenFree": gf,
        "isDairyFree": df,
        "isLowCarb": lc,
        "isHighProtein": hp,
        "isBudgetFriendly": budget,
        "nutrition": {
            "calories": cal,
            "proteinGrams": prot,
            "carbsGrams": carbs,
            "fatGrams": fat
        }
    }

def write_ts(filename, export_name, recipes):
    filepath = os.path.join(out_dir, filename)
    content = f"import {{ Recipe }} from '../../types';\n\nexport const {export_name}: Recipe[] = {json.dumps(recipes, indent=2)};\n"
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Generated {filename} with {len(recipes)} recipes")

all_bindings = {}

# 1. INDIAN (85)
ind_list = []
indian_dishes = [
    ("Butter Chicken (Murgh Makhani)", "Tender chicken cooked in rich tomato butter sauce.", P['butter_chicken'], ["Chicken", "Butter", "Tomato"], False, False, True, False, False, True, False, 520, 38, 14, 34),
    ("Paneer Butter Masala", "Paneer in creamy cashew tomato sauce.", P['paneer'], ["Paneer", "Tomato", "Cream"], True, False, True, False, False, True, False, 410, 19, 16, 30),
    ("Punjabi Chana Masala", "Spiced chickpea curry with ginger and lemon.", P['dal'], ["Chickpeas", "Tomato", "Onion"], True, True, True, True, False, False, True, 290, 14, 46, 6),
    ("Chicken Tikka Masala", "Grilled spiced chicken in orange cream curry.", P['curry'], ["Chicken", "Yogurt", "Cream"], False, False, True, False, False, True, False, 480, 36, 12, 28),
    ("Palak Paneer", "Paneer cubes in garlic spinach puree.", P['paneer'], ["Paneer", "Spinach", "Garlic"], True, False, True, False, True, True, False, 310, 18, 10, 22),
    ("Dal Makhani", "Slow cooked black lentils with butter and cream.", P['dal'], ["Black Lentils", "Butter", "Cream"], True, False, True, False, False, True, False, 380, 16, 35, 20),
    ("Hyderabadi Biryani", "Fragrant saffron rice layered with spiced chicken.", P['biryani'], ["Basmati Rice", "Chicken", "Saffron"], False, False, True, True, False, True, False, 580, 35, 65, 18),
    ("Aloo Gobi", "Dry potato and cauliflower curry.", P['dal'], ["Potato", "Cauliflower", "Turmeric"], True, True, True, True, False, False, True, 190, 6, 32, 5),
    ("Rogan Josh", "Slow cooked lamb in Kashmiri red chili curry.", P['curry'], ["Mutton", "Yogurt", "Spices"], False, False, True, False, False, True, False, 540, 42, 8, 38),
    ("Malai Kofta", "Crispy paneer dumplings in rich cashew sauce.", P['paneer'], ["Paneer", "Potato", "Cashew"], True, False, False, False, False, False, False, 490, 15, 38, 32),
]
ind_names = [
    "Chicken Korma", "Goan Fish Curry", "Rajma Masala", "Baingan Bharta", "Sambar", "Pav Bhaji", "Kadai Chicken", "Egg Curry", "Mattar Paneer", "Dal Tadka",
    "Gobi Manchurian", "Jeera Rice", "Masala Dosa", "Bhindi Masala", "Paneer Tikka", "Chettinad Chicken", "Veg Pulao", "Methi Malai Matar", "Seekh Kebab", "Mushroom Masala",
    "Kadhi Pakora", "Chicken Jalfrezi", "Dum Aloo", "Puri Bhaji", "Rava Upma", "Egg Biryani", "Lauki Chana Dal", "Chicken Saag", "Idli Sambar", "Medu Vada",
    "Fish Amritsari", "Aloo Paratha", "Gobi Paratha", "Chicken 65", "Mysore Masala Dosa", "Lemon Rice", "Tamarind Rice", "Curd Rice", "Chicken Sukka", "Keema Matar",
    "Mutton Sukka", "Fish Tikka", "Paneer Bhurji", "Egg Bhurji", "Aloo Tikki", "Samosa Ragda", "Bhel Puri", "Pani Puri", "Sev Puri", "Dahi Vada",
    "Paneer Do Pyaza", "Kadai Paneer", "Paneer Pasanda", "Navratan Korma", "Veg Kolhapuri", "Chicken Kolhapuri", "Laal Maas", "Malabar Fish Curry", "Prawn Balchao", "Coconut Chicken Curry",
    "Vegetable Kurma", "Appam with Stew", "Uttapam", "Poha", "Sabudana Khichdi", "Tomato Rice", "Capsicum Masala", "Arhar Dal", "Panchmel Dal", "Moong Dal Halwa",
    "Gulab Jamun", "Rasgulla", "Kheer", "Phirni", "Gajar Ka Halwa"
]

for idx, item in enumerate(indian_dishes):
    rec_id = f"ind-{idx+1:03d}"
    rec = R(rec_id, item[0], item[1], "Indian", "India", 4, 15, 25, "Easy" if idx%2==0 else "Medium", 
            [("Main Ingredient", "400g"), ("Spices", "2 tbsp"), ("Onion Tomato Gravy", "1 cup")],
            ["Sauté aromatics and spices.", "Add main ingredients and simmer till tender.", "Garnish with fresh cilantro and serve hot."],
            item[2], ["Indian", "Curry"], [item[0].lower()], item[4], item[5], item[6], item[7], item[8], item[9], item[10], item[11], item[12], item[13], item[14])
    ind_list.append(rec)
    all_bindings[rec_id] = item[2]

for idx, name in enumerate(ind_names):
    rec_id = f"ind-{idx+11:03d}"
    photo = P['curry'] if 'Chicken' in name or 'Curry' in name or 'Fish' in name else (P['paneer'] if 'Paneer' in name else (P['dosa'] if 'Dosa' in name or 'Puri' in name else P['dal']))
    is_veg = not any(w in name for w in ['Chicken', 'Fish', 'Mutton', 'Lamb', 'Egg', 'Keema', 'Prawn'])
    rec = R(rec_id, name, f"Authentic Indian dish {name} cooked with regional spices.", "Indian", "India", 4, 15, 20, "Medium",
            [("Primary Ingredients", "300g"), ("Indian Spice Blend", "1.5 tbsp"), ("Ghee / Oil", "2 tbsp")],
            [f"Prepare fresh ingredients for {name}.", "Sauté ground spices in ghee until fragrant.", "Cook on simmer until rich and flavor-infused."],
            photo, ["Indian", "Regional"], [name.lower()], veg=is_veg, gf=True, hp=not is_veg)
    ind_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('indian.ts', 'INDIAN_RECIPES', ind_list)

# 2. ITALIAN (55)
ita_list = []
ita_names = [
    ("Spaghetti Carbonara", P['carbonara'], False), ("Tagliatelle Ragù Bolognese", P['pasta_pesto'], False), ("Neapolitan Margherita Pizza", P['pizza_margherita'], True),
    ("Cacio e Pepe", P['carbonara'], True), ("Penne alla Vodka", P['pasta_red'], True), ("Baked Lasagna Bolognese", P['lasagna'], False),
    ("Risotto ai Funghi", P['risotto'], True), ("Chicken Piccata", P['pasta_pesto'], False), ("Chicken Parmigiana", P['pasta_red'], False),
    ("Fettuccine Alfredo", P['carbonara'], True), ("Minestrone Soup", P['soup'], True), ("Trofie with Pesto Genovese", P['pasta_pesto'], True),
    ("Sicilian Arancini", P['risotto'], True), ("Tomato Bruschetta", P['bruschetta'], True), ("Eggplant Parmigiana", P['lasagna'], True),
    ("Spaghetti Aglio e Olio", P['carbonara'], True), ("Creamy Tuscan Garlic Chicken", P['pasta_pesto'], False), ("Gnocchi alla Sorrentina", P['pasta_red'], True),
    ("Caprese Salad", P['salad'], True), ("Spaghetti ai Frutti di Mare", P['carbonara'], False), ("Truffle Wild Mushroom Tagliatelle", P['pasta_pesto'], True),
    ("Orecchiette with Sausage", P['pasta_pesto'], False), ("Lemon Ricotta Spinach Pasta", P['pasta_pesto'], True), ("Osso Buco with Gremolata", P['steak'], False),
    ("Pasta e Fagioli", P['soup'], True), ("Veal Cotoletta alla Milanese", P['steak'], False), ("Tuscan Ribollita Stew", P['soup'], True),
    ("Spinach & Ricotta Cannelloni", P['lasagna'], True), ("Roman Braised Artichokes", P['salad'], True), ("Veal Saltimbocca", P['steak'], False),
    ("Bucatini all'Amatriciana", P['pasta_red'], False), ("Pasta alla Norma", P['pasta_red'], True), ("Pepperoni Pizza", P['pizza_pepperoni'], False),
    ("Four Cheese Pizza", P['pizza_margherita'], True), ("Prosciutto e Funghi Pizza", P['pizza_pepperoni'], False), ("Calzone", P['pizza_margherita'], False),
    ("Lobster Ravioli", P['pasta_red'], False), ("Seared Scallops Risotto", P['risotto'], False), ("Swordfish alla Siciliana", P['salmon'], False),
    ("Chicken Cacciatore", P['pasta_red'], False), ("Beef Braciole", P['steak'], False), ("Porchetta Roast", P['steak'], False),
    ("Tuscan White Bean Soup", P['soup'], True), ("Panzanella Salad", P['salad'], True), ("Spaghetti con le Vongole", P['carbonara'], False),
    ("Farfalle with Creamy Salmon", P['salmon'], False), ("Penne Arrabbiata", P['pasta_red'], True), ("Polenta with Wild Mushroom Ragù", P['risotto'], True),
    ("Gorgonzola Gnocchi", P['pasta_pesto'], True), ("Italian Meatballs (Polpette)", P['pasta_red'], False), ("Tiramisu", P['dessert'], True),
    ("Cannoli Siciliani", P['dessert'], True), ("Panna Cotta", P['dessert'], True), ("Affogato al Caffè", P['dessert'], True), ("Tortellini in Brodo", P['soup'], False)
]

for idx, (name, photo, is_veg) in enumerate(ita_names):
    rec_id = f"ita-{idx+1:03d}"
    rec = R(rec_id, name, f"Traditional Italian recipe for {name}.", "Italian", "Italy", 4, 15, 20, "Medium",
            [("Semolina Pasta / Base", "350g"), ("Olive Oil & Garlic", "2 tbsp"), ("Parmigiano-Reggiano", "1/2 cup")],
            ["Boil water or prepare base.", "Sauté main ingredients in olive oil.", "Combine pasta or bake until golden and aromatic."],
            photo, ["Italian", "Classic"], [name.lower()], veg=is_veg, hp=not is_veg)
    ita_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('italian.ts', 'ITALIAN_RECIPES', ita_list)

# 3. JAPANESE (42)
jpn_list = []
jpn_names = [
    "Tonkotsu Ramen", "Shoyu Ramen", "Miso Ramen", "Oyakodon", "Katsudon", "Gyudon", "Chicken Teriyaki Bowl", "Salmon Teriyaki", "Beef Sukiyaki", "Shabu Shabu",
    "Pork Gyoza", "Chicken Karaage", "Vegetable Tempura", "Ebi Tempura", "Takoyaki", "Yakitori Skewers", "Salmon Nigiri", "Tuna Sashimi", "California Roll", "Spicy Tuna Roll",
    "Dragon Roll", "Unadon (Eel Bowl)", "Zaru Soba", "Tempura Udon", "Kitsune Udon", "Yaki Udon", "Yakisoba", "Japanese Katsu Curry", "Hayashi Rice", "Agedashi Tofu",
    "Chawanmushi", "Miso Soup", "Nasu Dengaku", "Okonomiyaki", "Hiroshima Okonomiyaki", "Hamachi Kama", "Salmon Miso Soup", "Tonkatsu Cutlet", "Chicken Katsu", "Tamagoyaki",
    "Matcha Parfait", "Sesame Ice Cream"
]

for idx, name in enumerate(jpn_names):
    rec_id = f"jpn-{idx+1:03d}"
    photo = P['ramen'] if 'Ramen' in name or 'Udon' in name or 'Soba' in name or 'Soup' in name else (P['sushi'] if 'Sashimi' in name or 'Nigiri' in name or 'Roll' in name else (P['dumplings'] if 'Gyoza' in name or 'Tempura' in name or 'Takoyaki' in name else P['rice_bowl']))
    is_veg = 'Vegetable' in name or 'Miso Soup' in name or 'Tofu' in name or 'Matcha' in name or 'Sesame' in name or 'Tamagoyaki' in name
    rec = R(rec_id, name, f"Authentic Japanese dish {name}.", "Japanese", "Japan", 2, 15, 15, "Medium",
            [("Primary Ingredients", "300g"), ("Soy Sauce & Mirin", "2 tbsp each"), ("Dashi Stock", "1 cup")],
            [f"Prepare fresh ingredients for {name}.", "Cook with precision in dashi and mirin.", "Serve beautifully presented."],
            photo, ["Japanese", "Asian"], [name.lower()], veg=is_veg, hp=not is_veg)
    jpn_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('japanese.ts', 'JAPANESE_RECIPES', jpn_list)

# 4. CHINESE (42)
chn_list = []
chn_names = [
    "Chicken Claypot Rice", "Kung Pao Chicken", "Mapo Tofu", "Sweet and Sour Pork", "Peking Duck", "Dan Dan Noodles", "Beef and Broccoli", "Chow Mein", "Yang Zhou Fried Rice", "Dim Sum Siu Mai",
    "Har Gow Shrimp Dumplings", "Xiao Long Bao Soup Dumplings", "Wonton Soup", "Hot and Sour Soup", "Egg Drop Soup", "Mongolian Beef", "General Tso Chicken", "Orange Chicken", "Sesame Chicken", "Stir-Fried Morning Glory",
    "Garlic Bok Choy", "Tomato and Egg Stir-Fry", "Char Siu BBQ Pork", "Hainanese Chicken Rice", "Salt and Pepper Squid", "Crispy Spring Rolls", "Scallion Pancakes", "Ma Po Eggplant", "Cantonese Steamed Fish", "Honey Walnut Shrimp",
    "Moo Shu Pork", "Beef Chow Fun", "Singapore Mei Fun", "Dry Fried Green Beans", "Black Bean Chicken", "Spicy Hunan Beef", "Sichuan Boiled Fish", "Crispy Roast Pork Belly", "Braised Pork Belly (Hong Shao Rou)", "Egg Tart",
    "Mango Sago Pudding", "Sesame Balls"
]

for idx, name in enumerate(chn_names):
    rec_id = f"chn-{idx+1:03d}"
    photo = P['dumplings'] if 'Dumpling' in name or 'Siu Mai' in name or 'Wonton' in name or 'Spring Roll' in name or 'Pancake' in name else (P['fried_rice'] if 'Rice' in name or 'Chow Fun' in name or 'Mei Fun' in name else P['rice_bowl'])
    is_veg = any(w in name for w in ['Tofu', 'Morning Glory', 'Bok Choy', 'Eggplant', 'Green Beans', 'Egg Tart', 'Sago', 'Sesame Balls'])
    rec = R(rec_id, name, f"Classic Chinese dish {name}.", "Chinese", "China", 4, 15, 15, "Medium",
            [("Main Ingredient", "400g"), ("Garlic & Ginger", "1 tbsp each"), ("Soy Sauce & Shaoxing Wine", "2 tbsp")],
            [f"Stir fry or steam ingredients for {name}.", "Toss in wok over high flame with aromatics.", "Serve hot with steamed jasmine rice."],
            photo, ["Chinese", "Asian"], [name.lower()], veg=is_veg, hp=not is_veg)
    chn_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('chinese.ts', 'CHINESE_RECIPES', chn_list)

# 5. MEXICAN (36)
mex_list = []
mex_names = [
    "Tacos al Pastor", "Carne Asada Tacos", "Fish Tacos Baja", "Chicken Tinga Tacos", "Carnitas Tacos", "Birria Tacos with Consomé", "Chicken Enchiladas Mole", "Cheese Enchiladas Red Sauce", "Beef Burrito Supreme", "Grilled Chicken Quesadilla",
    "Fresh Guacamole and Chips", "Pico de Gallo Salsa", "Chilaquiles Rojos", "Huevos Rancheros", "Elote Mexican Street Corn", "Tamales de Pollo", "Pozole Rojo", "Sopa de Lima", "Caldo de Res", "Fajitas de Res y Pollo",
    "Arroz con Pollo", "Mexican Rice (Arroz Rojo)", "Refried Beans (Frijoles)", "Chile Relleno", "Chimichanga", "Tostadas de Ceviche", "Taquitos Dorados", "Queso Fundido with Chorizo", "Tortilla Soup", "Carne Asada Platter",
    "Cochinita Pibil", "Camarones al Ajillo", "Churros with Chocolate", "Tres Leches Cake", "Flan Casero", "Mexican Hot Chocolate"
]

for idx, name in enumerate(mex_names):
    rec_id = f"mex-{idx+1:03d}"
    photo = P['tacos'] if 'Tacos' in name or 'Taquitos' in name or 'Tostadas' in name else (P['burrito'] if 'Burrito' in name or 'Quesadilla' in name or 'Enchiladas' in name or 'Chimichanga' in name else (P['guacamole'] if 'Guacamole' in name or 'Elote' in name or 'Salsa' in name else P['tacos']))
    is_veg = any(w in name for w in ['Cheese', 'Guacamole', 'Pico de Gallo', 'Elote', 'Rice', 'Beans', 'Churros', 'Cake', 'Flan', 'Chocolate'])
    rec = R(rec_id, name, f"Flavorful Mexican dish {name}.", "Mexican", "Mexico", 4, 15, 20, "Easy" if idx%2==0 else "Medium",
            [("Tortillas / Base", "8 count"), ("Main Filling", "400g"), ("Cilantro & Lime", "1/2 cup")],
            [f"Prepare fresh filling and salsas for {name}.", "Warm tortillas or tortillas base.", "Assemble with fresh cilantro, onions, and lime juice."],
            photo, ["Mexican", "Latin"], [name.lower()], veg=is_veg, hp=not is_veg)
    mex_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('mexican.ts', 'MEXICAN_RECIPES', mex_list)

# 6. THAI (32)
tha_list = []
tha_names = [
    "Pad Thai Shrimp", "Tom Yum Goong", "Tom Kha Gai", "Thai Green Curry Chicken", "Thai Red Curry Beef", "Massaman Curry Beef", "Panang Curry Pork", "Pad Kra Pao Basil Chicken", "Pad See Ew", "Drunken Noodles",
    "Som Tum Papaya Salad", "Larb Gai Chicken Salad", "Thai Mango Sticky Rice", "Khao Soi Noodle Soup", "Pineapple Fried Rice", "Thai Crab Omelet", "Chicken Satay Skewers", "Thai Fried Fish with Chili", "Weeping Tiger Beef", "Thai Cashew Chicken",
    "Pad Prik Gaeng Pork", "Thai Pumpkin Curry", "Tom Yum Fried Rice", "Steamed Sea Bass Garlic", "Thai Spicy Calamari", "Thai Pork Ribs", "Thai Eggplant Stir Fry", "Morning Glory Stir Fry", "Thai Banana Pancakes", "Thai Tea Boba",
    "Mango Sorbet", "Coconut Ice Cream"
]

for idx, name in enumerate(tha_names):
    rec_id = f"tha-{idx+1:03d}"
    photo = P['pad_thai'] if 'Pad' in name or 'Noodle' in name else (P['curry'] if 'Curry' in name or 'Tom Yum' in name or 'Kha' in name else P['fried_rice'])
    is_veg = any(w in name for w in ['Papaya', 'Mango', 'Pumpkin', 'Eggplant', 'Morning Glory', 'Pancakes', 'Tea', 'Sorbet', 'Ice Cream'])
    rec = R(rec_id, name, f"Vibrant Thai dish {name}.", "Thai", "Thailand", 3, 15, 15, "Medium",
            [("Main Ingredient", "350g"), ("Fish Sauce & Lime", "2 tbsp each"), ("Thai Chili & Basil", "1/4 cup")],
            [f"Sauté aromatics, chilies, and herbs for {name}.", "Combine main ingredients and balance sweet, sour, and spicy notes.", "Garnish with fresh Thai basil and crushed peanuts."],
            photo, ["Thai", "Asian"], [name.lower()], veg=is_veg, hp=not is_veg)
    tha_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('thai.ts', 'THAI_RECIPES', tha_list)

# 7. KOREAN (32)
kor_list = []
kor_names = [
    "Beef Bulgogi", "Japchae Glass Noodles", "Kimchi Fried Rice", "Bibimbap Rice Bowl", "Tteokbokki Spicy Rice Cakes", "Galbi Grilled Beef Short Ribs", "Korean Fried Chicken", "Kimchi Jjigae Stew", "Sundubu Jjigae Soft Tofu", "Samgyeopsal Grilled Pork",
    "Bossam Boiled Pork Wrap", "Haemul Pajeon Seafood Pancake", "Kimchi Pajeon Pancake", "Dakgalbi Spicy Stir Chicken", "Gamjatang Pork Bone Stew", "Doenjang Jjigae Stew", "Cold Naengmyeon Noodles", "Spicy Bibim Nengmyeon", "Kimbap Rice Roll", "Soy Garlic Wings",
    "Spicy Pork Stir Fry", "Army Stew (Budae Jjigae)", "Mandu Korean Dumplings", "Mulhoe Cold Fish Soup", "Galbitang Beef Rib Soup", "Potato Pancake (Gamjajeon)", "Soy Sauce Crab", "Tteokguk Rice Cake Soup", "Samgyetang Ginseng Chicken", "Hotteok Sweet Pancake",
    "Bingsu Shaved Ice", "Yakgwa Honey Cookies"
]

for idx, name in enumerate(kor_names):
    rec_id = f"kor-{idx+1:03d}"
    photo = P['rice_bowl'] if 'Bibimbap' in name or 'Rice' in name or 'Bulgogi' in name or 'Galbi' in name else (P['soup'] if 'Stew' in name or 'Jjigae' in name or 'Soup' in name else P['dumplings'])
    is_veg = any(w in name for w in ['Tteokbokki', 'Pancake', 'Gamjajeon', 'Hotteok', 'Bingsu', 'Yakgwa'])
    rec = R(rec_id, name, f"Savoury Korean dish {name}.", "Korean", "Korea", 3, 15, 20, "Medium",
            [("Main Protein / Veg", "400g"), ("Gochujang / Sesame Oil", "2 tbsp"), ("Garlic & Green Onion", "3 cloves")],
            [f"Marinate or stir-fry main ingredients for {name}.", "Cook until savory, caramelized, or piping hot.", "Serve with kimchi and steamed rice."],
            photo, ["Korean", "Asian"], [name.lower()], veg=is_veg, hp=not is_veg)
    kor_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('korean.ts', 'KOREAN_RECIPES', kor_list)

# 8. AMERICAN (32)
usa_list = []
usa_names = [
    "Classic Cheeseburger", "BBQ Bacon Smash Burger", "Macaroni and Cheese", "Buffalo Chicken Wings", "New York Strip Steak", "Southern Fried Chicken", "BBQ Baby Back Ribs", "New England Clam Chowder", "Texas Chili Con Carne", "Pulled Pork Sandwich",
    "Grilled Cheese Sandwich", "BLT Sandwich", "Cobb Salad", "Caesar Salad with Chicken", "Buttermilk Pancakes", "Belgian Waffles", "French Toast with Syrup", "Maine Lobster Roll", "Meatloaf with Mashed Potatoes", "Chicken Pot Pie",
    "Skillet Cornbread", "Biscuits and Gravy", "Sloppy Joes", "Philly Cheesesteak", "Maryland Crab Cakes", "Mississippi Pot Roast", "Smoked Beef Brisket", "Classic Apple Pie", "Chocolate Chip Cookies", "Fudge Brownies",
    "New York Cheesecake", "Southern Pecan Pie"
]

for idx, name in enumerate(usa_names):
    rec_id = f"usa-{idx+1:03d}"
    photo = P['burger'] if 'Burger' in name or 'Sandwich' in name or 'Sloppy' in name or 'Cheesesteak' in name else (P['mac_cheese'] if 'Macaroni' in name or 'Cheese' in name or 'Pie' in name else (P['steak'] if 'Steak' in name or 'Ribs' in name or 'Roast' in name else P['pancakes']))
    is_veg = any(w in name for w in ['Macaroni', 'Grilled Cheese', 'Pancakes', 'Waffles', 'French Toast', 'Cornbread', 'Pie', 'Cookies', 'Brownies', 'Cheesecake'])
    rec = R(rec_id, name, f"Classic American favorite {name}.", "American", "United States", 4, 15, 25, "Easy" if idx%2==0 else "Medium",
            [("Main Base", "400g"), ("Butter & Seasonings", "2 tbsp"), ("Cheese / Sauces", "1/2 cup")],
            [f"Prepare fresh ingredients for {name}.", "Cook, grill, or bake to golden perfection.", "Serve warm with side dishes."],
            photo, ["American", "Comfort Food"], [name.lower()], veg=is_veg, hp=not is_veg)
    usa_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('american.ts', 'AMERICAN_RECIPES', usa_list)

# 9. MEDITERRANEAN (26)
med_list = []
med_names = [
    "Greek Salad (Horiatiki)", "Souvlaki Chicken Skewers", "Moussaka", "Gyros Lamb Wrap", "Spanikopita (Spinach Pie)", "Tzatziki with Warm Pita", "Greek Lemon Roasted Potatoes", "Spanakorizo Spinach Rice", "Pastitsio Baked Pasta", "Keftedes Greek Meatballs",
    "Greek Lemon Chicken Soup", "Grilled Octopus", "Calamari Fritti", "Greek Stuffed Peppers", "Tiropita Cheese Pie", "Saganaki Fried Cheese", "Fassolada White Bean Soup", "Stuffed Grape Leaves (Dolmades)", "Greek Baked Fish Plaki", "Cretan Dakos Salad",
    "Greek Lamb Chops", "Briam Roasted Veggies", "Gigantes Plaki Giant Beans", "Baklava", "Galaktoboureko Custard Pie", "Greek Yogurt with Honey"
]

for idx, name in enumerate(med_names):
    rec_id = f"med-{idx+1:03d}"
    photo = P['salad'] if 'Salad' in name or 'Tzatziki' in name or 'Dakos' in name else (P['shakshuka'] if 'Moussaka' in name or 'Pastitsio' in name or 'Peppers' in name else P['kebab'])
    is_veg = any(w in name for w in ['Salad', 'Spanikopita', 'Tzatziki', 'Potatoes', 'Spanakorizo', 'Pie', 'Cheese', 'Soup', 'Grape Leaves', 'Veggies', 'Beans', 'Baklava', 'Yogurt'])
    rec = R(rec_id, name, f"Hearty Mediterranean dish {name}.", "Mediterranean", "Greece", 4, 15, 25, "Easy" if idx%2==0 else "Medium",
            [("Main Produce / Protein", "400g"), ("Extra Virgin Olive Oil", "3 tbsp"), ("Lemon & Oregano", "2 tbsp")],
            [f"Assemble or roast ingredients for {name}.", "Season with olive oil, oregano, and lemon juice.", "Serve with fresh crusty bread."],
            photo, ["Mediterranean", "Healthy"], [name.lower()], veg=is_veg, hp=not is_veg)
    med_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('mediterranean.ts', 'MEDITERRANEAN_RECIPES', med_list)

# 10. MIDDLE EASTERN (26)
mde_list = []
mde_names = [
    "Shakshuka", "Hummus with Warm Chickpeas", "Falafel Pita Wrap", "Chicken Shawarma Plate", "Beef Kofta Skewers", "Tabouleh Salad", "Fattoush Salad", "Baba Ghanoush Eggplant Dip", "Mujadara Lentils & Rice", "Kibbeh Spiced Meat Croquettes",
    "Mansaf Jordanian Lamb", "Kabsa Spiced Chicken Rice", "Knafeh Cheese Dessert", "Labneh with Za'atar", "Sheikh al-Mahshi Stuffed Eggplant", "Musakhan Sumac Chicken", "Arabian Chicken Mandi", "Batata Harra Spicy Potatoes", "Manakish Za'atar Flatbread", "Lamb Tagine with Apricots",
    "Harira Moroccan Soup", "Warak Enab Vine Leaves", "Arayes Meat Stuffed Pita", "Umm Ali Dessert", "Basbousa Semolina Cake", "Halva"
]

for idx, name in enumerate(mde_names):
    rec_id = f"mde-{idx+1:03d}"
    photo = P['shakshuka'] if 'Shakshuka' in name or 'Hummus' in name or 'Falafel' in name or 'Dip' in name else (P['kebab'] if 'Shawarma' in name or 'Kofta' in name or 'Kabsa' in name or 'Tagine' in name else P['salad'])
    is_veg = any(w in name for w in ['Shakshuka', 'Hummus', 'Falafel', 'Tabouleh', 'Fattoush', 'Baba Ghanoush', 'Mujadara', 'Knafeh', 'Labneh', 'Potatoes', 'Flatbread', 'Soup', 'Dessert', 'Cake', 'Halva'])
    rec = R(rec_id, name, f"Aromatic Middle Eastern dish {name}.", "Middle Eastern", "Middle East", 4, 15, 25, "Easy" if idx%2==0 else "Medium",
            [("Base Ingredient", "400g"), ("Olive Oil & Za'atar", "2 tbsp"), ("Warm Pita", "4 count")],
            [f"Prepare spiced ingredients for {name}.", "Cook slowly with sumac, cumin, and garlic.", "Serve warm with pita and labneh."],
            photo, ["Middle Eastern", "Aromatic"], [name.lower()], veg=is_veg, hp=not is_veg)
    mde_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('middleeastern.ts', 'MIDDLEEASTERN_RECIPES', mde_list)

# 11. FRENCH (22)
fre_list = []
fre_names = [
    "Beef Bourguignon", "Coq au Vin", "Ratatouille", "French Onion Soup", "Quiche Lorraine", "Steak Frites with Herb Butter", "Duck Confit", "Bouillabaisse Fish Stew", "Cassoulet Bean Stew", "Sole Meunière",
    "Poulet à l'Estragon", "Chicken Cordon Bleu", "Salade Niçoise", "Croque Monsieur", "Croque Madame", "French Herb Omelette", "Beef Tartare", "Soufflé au Fromage", "Crêpes Suzette", "Chocolate Mousse",
    "Crème Brûlée", "Tarte Tatin"
]

for idx, name in enumerate(fre_names):
    rec_id = f"fre-{idx+1:03d}"
    photo = P['soup'] if 'Soup' in name or 'Stew' in name or 'Bourguignon' in name or 'Coq' in name else (P['steak'] if 'Steak' in name or 'Tartare' in name or 'Duck' in name else P['dessert'])
    is_veg = any(w in name for w in ['Ratatouille', 'Omelette', 'Soufflé', 'Crêpes', 'Mousse', 'Crème Brûlée', 'Tarte Tatin'])
    rec = R(rec_id, name, f"Classic French dish {name}.", "French", "France", 4, 20, 30, "Hard" if idx%3==0 else "Medium",
            [("Main Ingredient", "400g"), ("Butter & Wine", "3 tbsp"), ("Fresh Herbs", "2 tbsp")],
            [f"Sauté aromatics in butter for {name}.", "Slow simmer in wine or bake delicately.", "Serve warm with French baguette."],
            photo, ["French", "Fine Dining"], [name.lower()], veg=is_veg, hp=not is_veg)
    fre_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('french.ts', 'FRENCH_RECIPES', fre_list)

# 12. TURKISH (22)
tur_list = []
tur_names = [
    "Adana Kebab", "Doner Kebab Plate", "Iskender Kebab", "Lahmacun Turkish Pizza", "Pide with Minced Meat", "Menemen Turkish Eggs", "Mercimek Çorbası Lentil Soup", "Karnıyarık Stuffed Eggplant", "Imam Bayıldı", "Köfte Meatballs",
    "Mantı Turkish Dumplings", "Ali Nazik Kebab", "Su Böreği Cheese Borek", "Çılbır Eggs in Garlic Yogurt", "Hünkar Beğendi Sultan's Delight", "Barbunya Pilaki Bean Stew", "Zeytinyağlı Enginar Artichokes", "Tavuk Göğsü", "Baklava Pistachio", "Kunefe Cheese Dessert",
    "Turkish Delight (Lokum)", "Revani Cake"
]

for idx, name in enumerate(tur_names):
    rec_id = f"tur-{idx+1:03d}"
    photo = P['kebab'] if 'Kebab' in name or 'Doner' in name or 'Köfte' in name else (P['pizza_margherita'] if 'Pide' in name or 'Lahmacun' in name else P['soup'])
    is_veg = any(w in name for w in ['Menemen', 'Lentil', 'Imam', 'Borek', 'Çılbır', 'Bean', 'Artichokes', 'Baklava', 'Kunefe', 'Delight', 'Cake'])
    rec = R(rec_id, name, f"Traditional Turkish dish {name}.", "Turkish", "Turkey", 4, 15, 20, "Medium",
            [("Main Protein / Veg", "400g"), ("Olive Oil & Pepper Paste", "2 tbsp"), ("Garlic Yogurt", "1/2 cup")],
            [f"Prepare fresh ingredients for {name}.", "Grill or bake until aromatic and charred.", "Serve with garlic yogurt and freshly baked pide bread."],
            photo, ["Turkish", "Eurasian"], [name.lower()], veg=is_veg, hp=not is_veg)
    tur_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('turkish.ts', 'TURKISH_RECIPES', tur_list)

# 13. VIETNAMESE (16)
vtn_list = []
vtn_names = [
    "Pho Bo Beef Noodle Soup", "Pho Ga Chicken Noodle Soup", "Banh Mi Pork Pate Sandwich", "Bun Cha Hanoi Grilled Pork Noodles", "Fresh Spring Rolls (Goi Cuon)", "Fried Egg Rolls (Cha Gio)", "Bun Bo Hue Spicy Beef Soup", "Com Tam Broken Rice Pork Chop",
    "Banh Xeo Crispy Pancake", "Bo Luc Lac Shaking Beef", "Ca Kho To Caramelized Claypot Fish", "Ga Kho Gung Ginger Chicken", "Goi Ga Vietnamese Chicken Salad", "Vietnamese Iced Coffee (Ca Phe)", "Che Ba Mau Dessert", "Coconut Pandan Jelly"
]

for idx, name in enumerate(vtn_names):
    rec_id = f"vtn-{idx+1:03d}"
    photo = P['pho'] if 'Pho' in name or 'Soup' in name or 'Bun' in name else (P['dumplings'] if 'Rolls' in name or 'Banh Xeo' in name else P['rice_bowl'])
    is_veg = any(w in name for w in ['Spring Rolls', 'Coffee', 'Dessert', 'Jelly'])
    rec = R(rec_id, name, f"Fresh Vietnamese dish {name}.", "Vietnamese", "Vietnam", 3, 15, 20, "Medium",
            [("Noodles / Bread / Rice", "300g"), ("Fresh Herbs (Mint, Cilantro)", "1 cup"), ("Fish Sauce & Lime", "2 tbsp")],
            [f"Prepare fragrant broth or assemble ingredients for {name}.", "Garnish with bean sprouts, fresh herbs, and chili.", "Serve immediately while fresh."],
            photo, ["Vietnamese", "Asian"], [name.lower()], veg=is_veg, hp=not is_veg)
    vtn_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('vietnamese.ts', 'VIETNAMESE_RECIPES', vtn_list)

# 14. SPANISH (16)
esp_list = []
esp_names = [
    "Paella Valenciana", "Tortilla Española Potato Omelette", "Gazpacho Andaluz Cold Soup", "Gambas al Ajillo Garlic Shrimp", "Patatas Bravas", "Croquetas de Jamón", "Albóndigas Meatballs in Sauce", "Pulpo a la Gallega Octopus",
    "Salmorejo Cordobés Tomato Soup", "Empanada Gallega", "Bacalao al Pil-Pil Cod", "Fabada Asturiana Bean Stew", "Pimientos de Padrón Peppers", "Churros con Chocolate", "Crema Catalana", "Sangria Fresh Fruit"
]

for idx, name in enumerate(esp_names):
    rec_id = f"esp-{idx+1:03d}"
    photo = P['rice_bowl'] if 'Paella' in name else (P['soup'] if 'Gazpacho' in name or 'Salmorejo' in name or 'Stew' in name else P['bruschetta'])
    is_veg = any(w in name for w in ['Tortilla', 'Gazpacho', 'Patatas', 'Salmorejo', 'Peppers', 'Churros', 'Crema', 'Sangria'])
    rec = R(rec_id, name, f"Authentic Spanish dish {name}.", "Spanish", "Spain", 4, 15, 25, "Medium",
            [("Main Ingredient", "400g"), ("Olive Oil & Garlic", "3 tbsp"), ("Smoked Paprika", "1 tbsp")],
            [f"Cook main ingredients with paprika and garlic for {name}.", "Sauté or simmer until golden and rich.", "Serve as tapas or main course."],
            photo, ["Spanish", "European"], [name.lower()], veg=is_veg, hp=not is_veg)
    esp_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('spanish.ts', 'SPANISH_RECIPES', esp_list)

# 15. GLOBAL (58)
glo_list = []
glo_names = [
    ("Brazilian Feijoada", P['soup'], False), ("Jamaican Jerk Chicken", P['roast_chicken'], False), ("Ethiopian Doro Wat with Injera", P['curry'], False), ("German Bratwurst with Sauerkraut", P['burger'], False),
    ("German Pork Schnitzel", P['steak'], False), ("Peruvian Ceviche", P['salmon'], False), ("Polish Pierogi", P['dumplings'], True), ("British Beef Wellington", P['steak'], False),
    ("British Fish and Chips", P['salmon'], False), ("Shepherd's Pie", P['lasagna'], False), ("Moroccan Lamb Tagine", P['curry'], False), ("Indonesian Beef Rendang", P['curry'], False),
    ("Indonesian Nasi Goreng", P['fried_rice'], False), ("Indonesian Mie Goreng", P['pad_thai'], False), ("Indonesian Gado Gado Salad", P['salad'], True), ("Satay Ayam Skewers", P['kebab'], False),
    ("Swiss Cheese Fondue", P['bread'], True), ("Swedish Meatballs with Gravy", P['pasta_red'], False), ("Hungarian Beef Goulash", P['soup'], False), ("Russian Beef Stroganoff", P['pasta_pesto'], False),
    ("Borscht Beet Soup", P['soup'], True), ("Ukrainian Vareniki Pierogi", P['dumplings'], True), ("Canadian Poutine", P['burger'], True), ("Mexican Chiles en Nogada", P['shakshuka'], False),
    ("Venezuelan Arepas Reina Pepiada", P['bread'], False), ("Colombian Bandeja Paisa", P['rice_bowl'], False), ("Argentine Beef Empanadas", P['dumplings'], False), ("Argentine Asado Ribeye", P['steak'], False),
    ("Chilean Pastel de Choclo", P['lasagna'], False), ("Cuban Ropa Vieja Shredded Beef", P['rice_bowl'], False), ("Cuban Mojo Pork Roast", P['steak'], False), ("Puerto Rican Mofongo", P['rice_bowl'], False),
    ("Hawaiian Tuna Poke Bowl", P['rice_bowl'], False), ("Filipino Chicken Adobo", P['rice_bowl'], False), ("Filipino Lumpia Shanghai", P['dumplings'], False), ("Filipino Sinigang Sour Soup", P['soup'], False),
    ("Filipino Pancit Canton Noodles", P['pad_thai'], False), ("Malaysian Nasi Lemak", P['rice_bowl'], False), ("Malaysian Curry Laksa", P['ramen'], False), ("Singapore Hainanese Chicken Rice", P['rice_bowl'], False),
    ("Singapore Chili Crab", P['salmon'], False), ("South African Bobotie", P['lasagna'], False), ("Moroccan Couscous Vegetable", P['rice_bowl'], True), ("Portuguese Egg Tarts (Pastéis)", P['dessert'], True),
    ("Portuguese Peri Peri Chicken", P['roast_chicken'], False), ("Austrian Apple Strudel", P['dessert'], True), ("Belgian Waffles Liege", P['pancakes'], True), ("Irish Beef & Stout Stew", P['soup'], False),
    ("Irish Soda Bread", P['bread'], True), ("Georgian Khachapuri Cheese Bread", P['pizza_margherita'], True), ("Georgian Khinkali Dumplings", P['dumplings'], False), ("Lebanese Shawarma Wrap", P['kebab'], False),
    ("Egyptian Koshari Rice & Lentils", P['rice_bowl'], True), ("Thai Banana Roti", P['pancakes'], True), ("Japanese Mochi Ice Cream", P['dessert'], True), ("Mexican Horchata Drink", P['dessert'], True),
    ("Indian Masala Chai", P['dessert'], True), ("Caribbean Goat Curry", P['curry'], False)
]

for idx, (name, photo, is_veg) in enumerate(glo_names):
    rec_id = f"glo-{idx+1:03d}"
    rec = R(rec_id, name, f"Global culinary favorite {name}.", "Other", "International", 4, 15, 25, "Medium",
            [("Primary Ingredients", "400g"), ("Regional Spices", "2 tbsp"), ("Cooking Oil / Sauce", "2 tbsp")],
            [f"Prepare classic regional ingredients for {name}.", "Cook according to traditional country recipe.", "Serve warm with appropriate garnishes."],
            photo, ["Global", "International"], [name.lower()], veg=is_veg, hp=not is_veg)
    glo_list.append(rec)
    all_bindings[rec_id] = photo

write_ts('global.ts', 'GLOBAL_RECIPES', glo_list)

# GENERATE src/data/recipeImages.ts
recipe_images_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'recipeImages.ts'))
images_ts_content = f"// Automatically generated recipe image binding map\nexport const RECIPE_IMAGE_BINDINGS: Record<string, string> = {json.dumps(all_bindings, indent=2)};\n"
with open(recipe_images_path, 'w', encoding='utf-8') as f:
    f.write(images_ts_content)
print(f"Generated recipeImages.ts with {len(all_bindings)} bound images.")

# UPDATE src/data/recipes.ts
recipes_agg_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'recipes.ts'))
recipes_agg_content = """import { Recipe } from '../types';
import { INDIAN_RECIPES } from './recipes/indian';
import { ITALIAN_RECIPES } from './recipes/italian';
import { JAPANESE_RECIPES } from './recipes/japanese';
import { CHINESE_RECIPES } from './recipes/chinese';
import { MEXICAN_RECIPES } from './recipes/mexican';
import { THAI_RECIPES } from './recipes/thai';
import { KOREAN_RECIPES } from './recipes/korean';
import { AMERICAN_RECIPES } from './recipes/american';
import { MEDITERRANEAN_RECIPES } from './recipes/mediterranean';
import { MIDDLEEASTERN_RECIPES } from './recipes/middleeastern';
import { FRENCH_RECIPES } from './recipes/french';
import { TURKISH_RECIPES } from './recipes/turkish';
import { VIETNAMESE_RECIPES } from './recipes/vietnamese';
import { SPANISH_RECIPES } from './recipes/spanish';
import { GLOBAL_RECIPES } from './recipes/global';

const ALL_UNFILTERED: Recipe[] = [
  ...INDIAN_RECIPES,
  ...ITALIAN_RECIPES,
  ...JAPANESE_RECIPES,
  ...CHINESE_RECIPES,
  ...MEXICAN_RECIPES,
  ...THAI_RECIPES,
  ...KOREAN_RECIPES,
  ...AMERICAN_RECIPES,
  ...MEDITERRANEAN_RECIPES,
  ...MIDDLEEASTERN_RECIPES,
  ...FRENCH_RECIPES,
  ...TURKISH_RECIPES,
  ...VIETNAMESE_RECIPES,
  ...SPANISH_RECIPES,
  ...GLOBAL_RECIPES,
];

// Ensure unique IDs
const seen = new Set<string>();
export const INITIAL_RECIPES: Recipe[] = ALL_UNFILTERED.filter((recipe) => {
  if (!recipe.id || seen.has(recipe.id)) return false;
  seen.add(recipe.id);
  return true;
});

export function getRecipeById(id: string): Recipe | undefined {
  return INITIAL_RECIPES.find((r) => r.id === id);
}

export function searchCatalogRecipes(query: string, cuisineFilter?: string): Recipe[] {
  const q = query.trim().toLowerCase();
  return INITIAL_RECIPES.filter((r) => {
    const matchesCuisine = !cuisineFilter || cuisineFilter === 'All' || r.cuisine.toLowerCase() === cuisineFilter.toLowerCase();
    if (!matchesCuisine) return false;
    if (!q) return true;
    
    const titleMatch = r.title.toLowerCase().includes(q);
    const descMatch = r.description.toLowerCase().includes(q);
    const ingMatch = r.ingredients.some((ing) => ing.name.toLowerCase().includes(q));
    const kwMatch = r.searchKeywords.some((kw) => kw.toLowerCase().includes(q));
    const tagMatch = r.tags.some((t) => t.toLowerCase().includes(q));
    
    return titleMatch || descMatch || ingMatch || kwMatch || tagMatch;
  });
}
"""

with open(recipes_agg_path, 'w', encoding='utf-8') as f:
    f.write(recipes_agg_content)

print(f"Successfully updated src/data/recipes.ts aggregating {len(all_bindings)} total recipes!")
