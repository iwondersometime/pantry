import fs from 'fs';
import path from 'path';
import { INITIAL_RECIPES } from '../src/data/recipes';
import { Recipe } from '../src/types';

// Helper to generate precise culinary visual details for any recipe
function getDishVisualPrompt(recipe: Recipe): string {
  const title = recipe.title.trim();
  const lower = title.toLowerCase();
  const cuisine = recipe.cuisine || 'Gourmet';
  
  // Specific detailed dish visual characteristics dictionary
  const specificDetails: Record<string, string> = {
    // --- Indian Sweets & Desserts ---
    "gulab jamun": "round golden-brown milk-solid dumplings soaked in glossy cardamom rose sugar syrup, served in a small traditional ceramic bowl, garnished with crushed pistachio and saffron strands",
    "kheer": "creamy rich Indian rice pudding cooked with whole milk and fragrant basmati rice, visible tender rice grains, garnished with sliced almonds, pistachios and golden saffron in a clay kulhad bowl",
    "moong dal halwa": "rich golden-yellow roasted moong dal lentil pudding cooked in pure ghee, cardamom and caramelized sugar, garnished with slivered almonds and pistachios in a traditional bowl",
    "gajar ka halwa": "vibrant orange-red grated carrot pudding cooked in whole milk, ghee, and khoya, garnished with roasted cashews and raisins",
    "gajar halwa": "vibrant orange-red grated carrot pudding cooked in whole milk, ghee, and khoya, garnished with roasted cashews and raisins",
    "carrot halwa": "vibrant orange-red grated carrot pudding cooked in whole milk, ghee, and khoya, garnished with roasted cashews and raisins",
    "sooji halwa": "soft aromatic semolina pudding roasted in pure ghee with cardamom, golden raisins and roasted cashews",
    "sheera": "soft aromatic semolina pudding roasted in pure ghee with cardamom, golden raisins and roasted cashews",
    "shahi tukda": "crispy golden fried bread slices soaked in fragrant saffron cardamom rabri syrup, topped with rich clotted cream and pistachios",
    "rasgulla": "soft spongy white chenna cottage cheese balls floating in light clear sugar syrup in a glass dessert bowl",
    "rasmalai": "flattened soft chenna patties soaked in chilled thick saffron-flavored clotted milk rabri garnished with sliced pistachios and almonds",
    "jalebi": "crispy bright orange spiral funnel cakes soaked in glossy sugar syrup, garnished with saffron threads",
    "kaju katli": "diamond-shaped smooth silver-foiled cashew nut fudge pieces arranged neatly on a festive brass platter",
    "besan ladoo": "golden roasted chickpea flour round sweet dessert balls with ghee and cardamom, garnished with slivered pistachios",
    "phirni": "chilled ground rice pudding cooked in creamy milk and set in traditional terracotta earthen bowls, topped with saffron and pistachios",
    "payasam": "creamy South Indian vermicelli and milk pudding simmered with jaggery, cardamom, golden fried cashews and raisins",

    // --- Indian Mains, Curries & Dals ---
    "butter chicken (murgh makhani)": "succulent tandoori chicken pieces simmered in a silky, velvety tomato-butter gravy with a swirl of fresh cream and crushed fenugreek leaves",
    "butter chicken": "succulent tandoori chicken pieces simmered in a silky, velvety tomato-butter gravy with a swirl of fresh cream and crushed fenugreek leaves",
    "murgh makhani": "succulent tandoori chicken pieces simmered in a silky, velvety tomato-butter gravy with a swirl of fresh cream and crushed fenugreek leaves",
    "paneer butter masala": "soft cubes of fresh paneer cottage cheese simmered in a rich, creamy tomato and cashew nut butter sauce, garnished with fresh cream and chopped cilantro",
    "paneer makhani": "soft cubes of fresh paneer cottage cheese simmered in a rich, creamy tomato and cashew nut butter sauce, garnished with fresh cream and chopped cilantro",
    "shahi paneer": "fresh paneer cubes cooked in a thick royal golden-white cashew, onion and saffron gravy with aromatic whole spices",
    "kadai paneer": "paneer cubes stir-fried with crunchy green bell peppers, diced onions, and freshly ground roasted coriander-cumin spices in a spicy tomato base",
    "mattar paneer": "fresh paneer cubes and tender sweet green peas simmered in a homestyle spiced onion-tomato curry, garnished with cilantro",
    "matar paneer": "fresh paneer cubes and tender sweet green peas simmered in a homestyle spiced onion-tomato curry, garnished with cilantro",
    "punjabi chana masala": "plump chickpeas cooked in a dark, aromatic onion-tomato gravy with freshly roasted ground spices, ginger juliennes and a lemon wedge",
    "chana masala": "plump chickpeas cooked in a dark, aromatic onion-tomato gravy with freshly roasted ground spices, ginger juliennes and a lemon wedge",
    "chole": "spicy Punjabi chickpea curry simmered in a dark tangy gravy with whole spices and green chilies",
    "chicken tikka masala": "charred tandoori roasted chicken pieces simmered in a vibrant spiced tomato-cream curry sauce with sautéed bell peppers and onions",
    "chicken tikka": "succulent marinated chicken skewers charred over tandoor coals with grilled bell pepper and onion wedges, served with green mint chutney",
    "paneer tikka": "golden charred marinated paneer cubes skewered with colorful bell peppers and red onions, grilled with spices, served with lemon wedges and mint dip",
    "palak paneer": "smooth, vibrant green spinach gravy blended with fragrant garlic, ginger and garam masala, with soft white cubes of paneer centered in the bowl",
    "saag paneer": "hearty mustard greens and spinach puree with tender paneer cubes and a dollop of fresh butter on top",
    "dal makhani": "slow-cooked creamy black lentils and red kidney beans simmered with butter and tomato puree, garnished with a generous dollop of white butter and fresh cream",
    "dal tadka": "yellow toor lentils cooked until soft and tempered with sizzling ghee, cumin seeds, garlic, dried red chilies, and fresh coriander",
    "dal fry": "hearty yellow lentils cooked with sautéed onions, tomatoes, green chilies, and fragrant curry leaves",
    "aloo gobi": "dry spiced curry of tender roasted cauliflower florets and golden potatoes with turmeric, ginger, cumin and fresh cilantro leaves",
    "aloo matar": "homestyle spiced potato and green pea curry in a light cumin-scented tomato sauce",
    "baingan bharta": "smoky roasted mashed eggplant cooked with sautéed onions, tomatoes, garlic, ginger and green peas",
    "bhindi masala": "crispy tender okra slices pan-fried with caramelized onions, tangy amchur mango powder, and ground spices",
    "malai kofta": "crisp melt-in-the-mouth potato and paneer dumplings served in a luxurious creamy golden-cashew and tomato gravy",
    "rogan josh": "tender braised Kashmiri lamb chunks in an intensely aromatic deep red gravy flavored with Kashmiri chilies, fennel, and ginger",
    "chicken korma": "tender bone-in chicken braised in a mild, fragrant yogurt, cashew and cardamom creamy gravy",
    "lamb korma": "slow-cooked tender lamb in a rich, creamy cashew nut and yogurt curry flavored with cardamom and saffron",
    "kadai chicken": "chicken pieces cooked in a wok with crushed coriander seeds, bell peppers, tomatoes, and spicy red chilies",
    "goan fish curry": "fresh fish fillets simmered in a vibrant tangy orange-red coconut curry sauce flavored with tamarind, kokum and curry leaves",
    "egg curry": "boiled eggs with light golden pan-fried crust simmered in a rich, spicy onion-tomato masala gravy",
    "rajma masala": "tender red kidney beans slow-cooked in a thick, hearty spiced tomato-onion gravy garnished with fresh ginger slivers",

    // --- Indian Biryanis, Rice & Breads ---
    "hyderabadi biryani": "long-grain aromatic basmati rice layered with richly spiced chicken, visible golden saffron-tinted rice, caramelized fried onions, mint and fresh coriander, served in a traditional handi",
    "chicken biryani": "fragrant basmati rice layered with tender spiced marinated chicken, whole spices, fried onions and fresh herbs, served with boiled egg slice",
    "mutton biryani": "royal slow-cooked dum biryani with tender bone-in mutton pieces and fluffy saffron basmati rice garnished with fried cashews and raisins",
    "veg biryani": "colorful layered basmati rice with spiced carrots, green beans, peas, potatoes, fried paneer cubes, saffron and mint leaves",
    "jeera rice": "fragrant fluffy long-grain basmati rice tempered with roasted cumin seeds and fresh ghee, garnished with cilantro",
    "pulao": "fluffy aromatic rice cooked with mixed vegetables, whole cardamom, cloves and cinnamon in ghee",
    "pav bhaji": "thick spicy mashed vegetable curry topped with a melting cube of butter, served with toasted buttered soft pav bread rolls and chopped red onions",
    "chole bhature": "spicy dark chickpea curry served with hot puffed golden fried bhatura bread, pickled carrots and sliced onion",
    "samosa": "crisp golden-brown flaky pastry triangles filled with spiced potato and pea filling, served with tamarind and green mint chutneys",
    "pani puri": "crispy hollow semolina puris filled with spicy tangy mint water, sweet tamarind chutney, and potato chickpea stuffing",
    "masala dosa": "crispy golden-brown rolled rice crepe stuffed with spiced mashed potato filling, served with coconut chutney and hot sambar in small bowls",
    "idli": "steaming hot soft fluffy white fermented rice cakes served with spicy lentil sambar and freshly grated coconut chutney",
    "vada": "crispy golden deep-fried savory lentil donuts with crunchy exterior and soft interior, served with sambar and chutney",
    "sambar": "flavorful South Indian lentil and vegetable stew with drumsticks, shallots, tamarind and freshly roasted sambar masala",

    // --- Italian Pastas, Pizzas & Mains ---
    "spaghetti carbonara": "al dente spaghetti tossed with crispy guanciale, creamy egg yolks, freshly grated Pecorino Romano cheese, and cracked black pepper",
    "margherita pizza": "wood-fired artisan pizza with charred bubbly crust, San Marzano tomato sauce, melted fresh mozzarella slices, and fresh basil leaves",
    "lasagna": "layered baked pasta with rich slow-cooked beef bolognese, creamy béchamel sauce, melted parmesan and bubbling golden mozzarella top",
    "tagliatelle bolognese": "ribbons of fresh egg tagliatelle pasta coated in slow-simmered rich beef and pork ragù, topped with shaved Parmigiano-Reggiano",
    "penne arrabbiata": "penne pasta tossed in a spicy garlic and crushed red pepper tomato sauce with fresh Italian parsley",
    "fettuccine alfredo": "ribbon fettuccine pasta swirled in a silky rich sauce of melted butter, heavy cream, and freshly grated parmesan cheese",
    "cacio e pepe": "spaghetti pasta tossed with creamy emulsion of freshly grated Pecorino Romano cheese and toasted crushed black peppercorns",
    "risotto ai funghi": "creamy slow-stirred Arborio rice with sautéed porcini and wild mushrooms, white wine, butter, and parmesan",
    "mushroom risotto": "creamy slow-stirred Arborio rice with sautéed porcini and wild mushrooms, white wine, butter, and parmesan",
    "chicken parmigiana": "crispy breaded chicken cutlet topped with rich marinara tomato sauce, melted fresh mozzarella and parmesan cheese",
    "eggplant parmigiana": "baked layers of golden fried eggplant slices, basil tomato sauce, fresh mozzarella and melted parmesan",
    "osso buco": "tender braised veal shanks cooked with white wine and vegetables, topped with fresh zesty lemon-garlic gremolata",
    "caprese salad": "thick slices of ripe red heirloom tomatoes layered with fresh creamy buffalo mozzarella, sweet basil leaves and aged balsamic glaze",
    "tiramisu": "classic Italian dessert layers of espresso-soaked ladyfingers and whipped mascarpone cream, dusted generously with dark cocoa powder",
    "panna cotta": "silky smooth vanilla bean panna cotta custard topped with glossy fresh strawberry-raspberry coulis and fresh mint",
    "cannoli": "crispy golden fried pastry shells filled with sweet whipped ricotta cream, miniature chocolate chips, and crushed pistachios",
    "bruschetta": "toasted rustic sourdough bread slices rubbed with garlic and topped with diced ripe tomatoes, fresh basil, extra virgin olive oil, and sea salt",
    "focaccia": "fluffy olive-oil rich Italian flatbread dimpled with rosemary sprigs, sea salt flakes, and cherry tomatoes",

    // --- Japanese Classics ---
    "tonkotsu ramen": "steaming bowl of rich creamy 12-hour pork bone broth ramen with tender chashu pork belly slices, a marinated soft-boiled ramen egg, nori seaweed, and green scallions",
    "shoyu ramen": "clear savory soy sauce broth ramen topped with tender pork slices, bamboo shoots, narutomaki fish cake, and scallions",
    "miso ramen": "hearty savory miso broth ramen noodles topped with buttered sweet corn, ground pork, bean sprouts, and seasoned egg",
    "sushi platter": "fresh assorted nigiri sushi with glossy salmon, tuna, yellowtail, and California rolls neatly arranged on a dark slate board with wasabi and pickled ginger",
    "salmon nigiri": "delicate slices of fresh glistening raw salmon draped over seasoned sushi rice balls, served with wasabi",
    "tuna sashimi": "thick slices of fresh sashimi-grade ruby-red tuna arranged elegantly with shredded daikon radish and shiso leaf",
    "california roll": "inside-out sushi roll with crab meat, avocado, cucumber, and orange tobiko flying fish roe",
    "chicken katsu": "crispy golden panko-breaded fried chicken cutlet sliced into strips, served with shredded cabbage and savory bulldog katsu sauce",
    "katsu curry": "crispy panko chicken cutlet served over steaming white rice with rich, velvety Japanese dark curry sauce",
    "teriyaki chicken": "pan-seared chicken thighs glazed in glossy sweet soy teriyaki sauce, garnished with toasted sesame seeds and sliced green onions",
    "gyoza": "pan-fried Japanese dumplings with a crispy golden bottom crust and steamed tender top, served with soy dipping sauce",
    "tempura": "light and airy crispy battered jumbo shrimp, sweet potato and lotus root tempura served with savory tentsuyu dipping sauce and grated daikon",
    "unadon": "tender grilled freshwater eel fillet brushed with sweet caramelized tare sauce, served over a bed of steaming white rice in a lacquer bowl",
    "yakitori": "skewers of juicy grilled chicken and scallions glazed in sweet savory tare sauce, charred over binchotan charcoal",
    "takoyaki": "piping hot round octopus balls drizzled with sweet takoyaki sauce, Japanese mayonnaise, and dancing bonito fish flakes",
    "miso soup": "warm cloudy dashi broth with silken tofu cubes, wakame seaweed, and thinly sliced scallions in a black lacquer bowl",
    "sesame ice cream": "two creamy scoops of artisanal roasted black and white sesame ice cream served in a ceramic bowl, garnished with toasted sesame seeds",
    "matcha ice cream": "vibrant green Japanese matcha green tea ice cream scoops served in a minimalist bowl with sweet red azuki beans",

    // --- Chinese Classics ---
    "kung pao chicken": "glossy stir-fried chicken cubes with roasted crunchy peanuts, diced bell peppers, zucchini, and dried red chili peppers in spicy Sichuan kung pao sauce",
    "mapo tofu": "silken tofu cubes and minced pork simmered in a fiery, numbing Sichuan chili bean paste sauce topped with ground Sichuan peppercorns and scallions",
    "peking duck": "crispy roasted duck skin and tender meat served with thin steamed pancakes, sliced cucumbers, scallions, and hoisin sauce",
    "sweet and sour pork": "crispy deep-fried pork pieces tossed with pineapple chunks, red bell peppers, and onions in a vibrant glossy sweet and sour sauce",
    "dim sum": "steamed bamboo basket filled with translucent shrimp har gow dumplings and pork siu mai topped with orange roe",
    "har gow": "translucent steamed shrimp dumplings with delicate pleated wheat starch skin in a bamboo steamer",
    "siu mai": "open-topped steamed pork and shrimp dumplings wrapped in yellow pastry and garnished with crab roe",
    "baozi": "fluffy steamed white buns filled with savory seasoned ground pork and aromatics",
    "char siu": "cantonese roasted pork belly with a glossy sweet honey-glazed caramelized exterior, sliced neatly over white rice",
    "scallion pancakes": "crispy, flaky, layered Chinese pan-fried flatbread studded with fresh green scallions and sesame seeds, cut into wedges",
    "wonton soup": "delicate pork and shrimp wontons floating in a clear savory chicken broth with bok choy and scallions",
    "chow mein": "crispy pan-fried egg noodles stir-fried with shredded chicken, cabbage, carrots, bean sprouts, and dark soy sauce",
    "dan dan noodles": "spicy Sichuan noodles topped with seasoned crispy ground pork, chili oil, sesame paste, and chopped peanuts",
    "fried rice": "wok-tossed fragrant jasmine rice with scrambled egg ribbons, green peas, carrots, diced char siu pork, and scallions",
    "mango sago pudding": "chilled tropical dessert of smooth sweet mango puree with coconut cream and translucent sago pearls, topped with diced ripe mango",
    "egg tart": "flaky buttery pastry cups filled with silky smooth baked golden egg custard with a glossy surface",

    // --- Thai & Vietnamese Classics ---
    "thai banana pancakes": "crispy golden flaky roti pancake folded over warm sliced bananas, drizzled with sweetened condensed milk and rich chocolate syrup",
    "pad thai": "stir-fried rice noodles with plump shrimp, scrambled egg, bean sprouts, crushed roasted peanuts, and a lime wedge in a savory tamarind sauce",
    "green curry": "creamy aromatic green curry with tender chicken, thai eggplants, bamboo shoots and fresh thai basil leaves in coconut broth",
    "red curry": "rich red coconut curry with tender beef slices, red bell peppers, bamboo shoots, and kaffir lime leaves",
    "massaman curry": "mild aromatic Thai curry with tender slow-cooked beef chunks, potatoes, whole peanuts, and star anise in rich coconut gravy",
    "tom yum goong": "hot and sour clear lemongrass soup with jumbo prawns, button mushrooms, galangal, kaffir lime leaves, and fresh chili",
    "tom kha gai": "creamy coconut milk soup with tender chicken, mushrooms, lemongrass, galangal, and fresh lime juice",
    "mango sticky rice": "sweet glutinous sticky rice cooked in coconut milk, paired with freshly sliced ripe sweet yellow mango and a drizzle of salted coconut cream",
    "som tum": "crisp shredded green papaya salad tossed with cherry tomatoes, green beans, crushed peanuts, lime juice, fish sauce, and bird's eye chili",
    "thai basil chicken": "spicy stir-fried minced chicken with garlic, fiery Thai bird's eye chilies, and fragrant holy basil leaves, served over jasmine rice with a crispy fried egg",
    "pho bo": "aromatic Vietnamese beef noodle soup with flat rice noodles, rare beef slices, brisket, fresh bean sprouts, basil, lime, and jalapeños in rich clear bone broth",
    "banh mi": "crispy Vietnamese baguette filled with savory pork pâté, roasted pork, pickled daikon and carrots, cucumber, fresh cilantro, and jalapeños",
    "vietnamese spring rolls": "translucent rice paper rolls filled with pink shrimp, fresh mint, cilantro, cucumber, and vermicelli noodles, served with peanut hoisin dipping sauce",

    // --- Mexican & Spanish Classics ---
    "churros with chocolate": "golden-crispy ridged Spanish churros dusted in cinnamon sugar, served with a cup of warm thick melted dark chocolate dipping sauce",
    "tres leches cake": "moist sponge cake soaked in three sweet milks, topped with a cloud of whipped cream, fresh sliced strawberries, and a dust of cinnamon",
    "tacos al pastor": "warm corn tortillas filled with marinated roasted pork, charred pineapple slices, finely chopped onions, cilantro, and spicy salsa verde",
    "carne asada tacos": "grilled seasoned flank steak in warm corn tortillas with diced onions, cilantro, avocado slices, and lime wedges",
    "guacamole": "freshly mashed vibrant green avocados with diced tomatoes, jalapeños, onions, lime juice and crispy corn tortilla chips",
    "chicken enchiladas": "rolled corn tortillas stuffed with shredded chicken, smothered in red enchilada chili sauce, and melted Monterey Jack cheese with sour cream drizzle",
    "burrito": "large flour tortilla rolled tightly with seasoned grilled meat, cilantro lime rice, black beans, pico de gallo, guacamole, and cheese",
    "quesadilla": "golden pan-toasted flour tortilla filled with melted Oaxaca cheese, grilled peppers, and seasoned chicken, cut into wedges with guacamole and salsa",
    "chiles rellenos": "roasted poblano peppers stuffed with melted cheese, dipped in fluffy egg batter and fried golden, served in light tomato broth",
    "ceviche": "fresh raw fish and shrimp cured in tangy lime juice with diced red onion, tomatoes, cilantro, and creamy avocado chunks with tortilla chips",
    "paella": "saffron-infused golden rice cooked with jumbo prawns, mussels, calamari, chicken, and green beans in a large traditional shallow paella pan",
    "seafood paella": "golden saffron rice brimming with king prawns, black mussels, clams, squid rings, and lemon wedges in a wide Spanish paella pan",
    "tortilla espanola": "thick Spanish omelet with tender caramelized potatoes and onions, cut into a generous wedge",
    "patatas bravas": "crispy golden roasted potato cubes topped with spicy smoky bravas tomato sauce and creamy garlic aioli",
    "gazpacho": "chilled Andalusian tomato soup blended with cucumber, bell pepper, garlic, and olive oil, garnished with diced vegetables in a white bowl",

    // --- American & Burgers & Sandwiches ---
    "classic beef burger": "thick juicy grilled beef patty with melted cheddar cheese, crisp lettuce, ripe tomato slice, pickles, and house sauce on a toasted brioche bun",
    "cheeseburger": "grilled beef patty topped with melted American cheddar cheese, caramelized onions, lettuce, tomato and burger sauce on a sesame bun",
    "bacon burger": "thick grilled beef burger with crispy smoked bacon strips, melted cheddar, lettuce, and barbecue sauce on a toasted bun",
    "club sandwich": "triple-decker toasted sandwich with roasted turkey, crispy bacon, lettuce, tomato, and mayonnaise, cut into diagonal quarters with toothpicks",
    "reuben sandwich": "grilled rye bread sandwich packed with warm corned beef, melted Swiss cheese, tangy sauerkraut, and Russian dressing",
    "blt sandwich": "toasted sourdough sandwich filled with thick-cut crispy bacon, crisp iceberg lettuce leaves, and juicy ripe red tomato slices with mayo",
    "grilled cheese sandwich": "golden-brown pan-toasted sourdough bread with gooey stretchy melted cheddar and gruyere cheeses oozing from the cut center",
    "pulled pork sandwich": "tender slow-smoked shredded pulled pork tossed in tangy barbecue sauce, piled high on a brioche bun with creamy coleslaw",
    "mac and cheese": "baked macaroni pasta baked in a creamy cheddar and gruyere cheese sauce with a golden crunchy breadcrumb crust",
    "bbq ribs": "rack of tender slow-cooked pork ribs with a sticky caramelized smoky barbecue glaze, served with corn on the cob",
    "clam chowder": "rich creamy New England clam chowder with tender potatoes, clams, and bacon in a sourdough bread bowl with oyster crackers",
    "pancake stack": "fluffy golden buttermilk pancakes stacked high, topped with a melting pat of butter and maple syrup dripping down the sides",
    "waffles": "crispy Belgian waffles with deep square pockets filled with fresh strawberries, blueberries, and whipped cream with maple syrup",
    "french toast": "thick golden slices of brioche French toast dusted with powdered sugar, served with fresh berries and warm maple syrup",
    "apple pie": "freshly baked American apple pie with a golden flaky lattice crust and cinnamon-spiced tender apple filling, with a scoop of vanilla ice cream",
    "chocolate chip cookies": "warm freshly baked chocolate chip cookies with golden edges, soft centers, and gooey melted dark chocolate pools",
    "brownies": "rich fudgy dark chocolate brownies with shiny crinkly tops, cut into clean squares with chopped walnuts and sea salt flakes",
    "cheesecake": "creamy New York style cheesecake with a golden graham cracker crust, topped with glossy strawberry compote",
    "chocolate lava cake": "warm individual chocolate molten lava cake with rich liquid chocolate flowing from the center, dusted with powdered sugar and vanilla ice cream"
  };

  // Check direct specific match
  for (const [key, desc] of Object.entries(specificDetails)) {
    if (lower.includes(key) || key.includes(lower)) {
      return `Photorealistic professional food photography of authentic ${title}: ${desc}. Warm natural restaurant lighting, delicious gourmet presentation, close-up food photography, no text, no people, no unrelated objects, dish centered in frame.`;
    }
  }

  // Generate tailored description from recipe data
  const mainIngs = recipe.ingredients
    ?.map(i => i.name)
    .filter(n => !n.toLowerCase().includes('primary') && !n.toLowerCase().includes('main') && !n.toLowerCase().includes('spices') && !n.toLowerCase().includes('blend'))
    .slice(0, 4)
    .join(', ');

  const ingClause = mainIngs ? `featuring fresh ${mainIngs}` : '';
  const descClause = recipe.description ? ` (${recipe.description})` : '';

  return `Photorealistic professional food photography of authentic ${cuisine} ${title}${descClause}: ${ingClause}, beautifully prepared and plated in authentic traditional tableware, warm soft restaurant lighting, appetizing culinary presentation, close-up food photography, no text, no people, no watermarks, dish centered in frame.`;
}

// Generate deterministic seed for every recipe
function getRecipeSeed(recipeId: string): number {
  let hash = 0;
  for (let i = 0; i < recipeId.length; i++) {
    hash = (hash << 5) - hash + recipeId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 100000 + 1000;
}

export function generateAllRecipeImages(): Record<string, string> {
  const registry: Record<string, string> = {};

  for (const recipe of INITIAL_RECIPES) {
    const prompt = getDishVisualPrompt(recipe);
    const seed = getRecipeSeed(recipe.id);
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Construct unique, per-recipe-ID CDN URL
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${seed}`;
    registry[recipe.id] = url;
  }

  return registry;
}

// Execute and write output
const registry = generateAllRecipeImages();
const outPath = path.join(process.cwd(), 'src', 'data', 'recipeImageRegistry.ts');
const code = `// AUTOGENERATED CENTRAL AUTHORITATIVE RECIPE IMAGE REGISTRY
// Every single recipe ID maps 1-to-1 to its own unique, authentic food photography asset.
// Strictly NO generic photos, NO random selection, NO shared URLs, NO placeholder text.

export const RECIPE_IMAGE_REGISTRY: Record<string, string> = ${JSON.stringify(registry, null, 2)};
`;

fs.writeFileSync(outPath, code, 'utf-8');
console.log(`Successfully generated unique, authentic image URLs for all ${Object.keys(registry).length} recipes!`);
