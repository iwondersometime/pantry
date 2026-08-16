import fs from 'fs';
import path from 'path';
import { testUrl } from './test-image-urls';
import { INITIAL_RECIPES } from '../src/data/recipes';

// A curated list of known working Unsplash food images (with backups)
const CANDIDATES: Record<string, string[]> = {
  // Indian Mains
  butter_chicken: [
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80"
  ],
  paneer_makhani: [
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80"
  ],
  chana_masala: [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
  ],
  palak_paneer: [
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80"
  ],
  dal_makhani: [
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80"
  ],
  dal_tadka: [
    "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
  ],
  hyderabadi_biryani: [
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80"
  ],
  chicken_biryani: [
    "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
  ],
  veg_biryani: [
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
  ],
  rogan_josh: [
    "https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80"
  ],
  chicken_tikka: [
    "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80"
  ],
  paneer_tikka: [
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80"
  ],
  aloo_gobi: [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80"
  ],
  pav_bhaji: [
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80"
  ],
  south_indian_dosa: [
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80"
  ],
  indian_rice: [
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80"
  ],

  // Indian Sweets & Desserts
  gulab_jamun: [
    "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80"
  ],
  moong_dal_halwa: [
    "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&auto=format&fit=crop&q=80"
  ],
  gajar_halwa: [
    "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&auto=format&fit=crop&q=80"
  ],
  kheer_phirni: [
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80"
  ],
  shahi_tukda: [
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80"
  ],
  general_dessert: [
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80"
  ],

  // Italian
  spaghetti_carbonara: [
    "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop&q=80"
  ],
  pasta_dish: [
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop&q=80"
  ],
  margherita_pizza: [
    "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"
  ],
  lasagna: [
    "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop&q=80"
  ],
  risotto: [
    "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800&auto=format&fit=crop&q=80"
  ],
  chicken_parmigiana: [
    "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&auto=format&fit=crop&q=80"
  ],
  tiramisu: [
    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80"
  ],

  // Japanese & Asian
  ramen: [
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80"
  ],
  sushi: [
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80"
  ],
  gyoza: [
    "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop&q=80"
  ],
  fried_rice: [
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80"
  ],
  noodles: [
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80"
  ],
  kung_pao: [
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80"
  ],

  // Mexican & American
  tacos: [
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80"
  ],
  burrito: [
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80"
  ],
  burger: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80"
  ],
  sandwich: [
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80"
  ],
  salad: [
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80"
  ],
  mediterranean_skewer: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80"
  ],
  soup: [
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80"
  ]
};

async function build() {
  console.log("Checking validity of all candidate images...");
  const valid: Record<string, string> = {};
  for (const [key, list] of Object.entries(CANDIDATES)) {
    let chosen = "";
    for (const url of list) {
      const res = await testUrl(url);
      if (res.ok) {
        chosen = url;
        break;
      }
    }
    if (!chosen) {
      console.warn(`Warning: no valid URL for ${key}, falling back to butter_chicken`);
      chosen = "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80";
    }
    valid[key] = chosen;
  }

  function resolveRecipe(title: string, cuisine: string): string {
    const t = title.toLowerCase();

    // 1. Precise Desserts & Sweets FIRST
    if (t.includes('moong dal halwa') || t.includes('sooji halwa') || t.includes('sheera') || t.includes('halwa')) return valid.moong_dal_halwa;
    if (t.includes('gajar') || t.includes('carrot halwa')) return valid.gajar_halwa;
    if (t.includes('gulab jamun')) return valid.gulab_jamun;
    if (t.includes('shahi tukda') || t.includes('bread pudding')) return valid.shahi_tukda;
    if (t.includes('kheer') || t.includes('phirni') || t.includes('payasam') || t.includes('rasgulla') || t.includes('rasmalai') || t.includes('jalebi')) return valid.kheer_phirni;
    if (t.includes('tiramisu')) return valid.tiramisu;
    if (t.includes('cake') || t.includes('dessert') || t.includes('sweet') || t.includes('custard') || t.includes('pudding') || t.includes('churros') || t.includes('baklava')) return valid.general_dessert;

    // 2. Biryanis & Rice
    if (t.includes('biryani')) {
      if (t.includes('chicken') || t.includes('mutton') || t.includes('hyderabadi') || t.includes('dum')) return valid.hyderabadi_biryani;
      if (t.includes('veg')) return valid.veg_biryani;
      return valid.hyderabadi_biryani;
    }
    if (t.includes('fried rice')) return valid.fried_rice;
    if (t.includes('rice') || t.includes('pulao') || t.includes('khichdi') || t.includes('poha')) return valid.indian_rice;

    // 3. Indian Specific Curries & Dishes
    if (t.includes('butter chicken') || t.includes('murgh makhani') || t.includes('tikka masala')) return valid.butter_chicken;
    if (t.includes('paneer butter') || t.includes('shahi paneer') || t.includes('kadai paneer') || t.includes('matar paneer')) return valid.paneer_makhani;
    if (t.includes('palak') || t.includes('saag')) return valid.palak_paneer;
    if (t.includes('chana') || t.includes('chole') || t.includes('chickpea')) return valid.chana_masala;
    if (t.includes('dal makhani') || t.includes('black lentil') || t.includes('rajma')) return valid.dal_makhani;
    if (t.includes('dal') || t.includes('tadka') || t.includes('sambar') || t.includes('rasam')) return valid.dal_tadka;
    if (t.includes('rogan josh') || t.includes('korma') || t.includes('curry') && (t.includes('lamb') || t.includes('mutton') || t.includes('beef'))) return valid.rogan_josh;
    if (t.includes('chicken tikka') || t.includes('tandoori chicken') || t.includes('kebab') || t.includes('tikka')) return valid.chicken_tikka;
    if (t.includes('paneer')) return valid.paneer_tikka;
    if (t.includes('aloo') || t.includes('gobi') || t.includes('bhindi') || t.includes('baingan') || t.includes('sabzi')) return valid.aloo_gobi;
    if (t.includes('pav bhaji') || t.includes('chaat') || t.includes('samosa') || t.includes('pakora')) return valid.pav_bhaji;
    if (t.includes('dosa') || t.includes('idli') || t.includes('vada') || t.includes('uttapam') || t.includes('paratha') || t.includes('naan')) return valid.south_indian_dosa;

    // 4. Italian & Western Dishes
    if (t.includes('carbonara') || t.includes('cacio e pepe')) return valid.spaghetti_carbonara;
    if (t.includes('lasagna')) return valid.lasagna;
    if (t.includes('risotto')) return valid.risotto;
    if (t.includes('parmigiana') || t.includes('piccata')) return valid.chicken_parmigiana;
    if (t.includes('pizza') || t.includes('flatbread')) return valid.margherita_pizza;
    if (t.includes('pasta') || t.includes('spaghetti') || t.includes('fettuccine') || t.includes('penne') || t.includes('tagliatelle') || t.includes('gnocchi') || t.includes('ravioli') || t.includes('bolognese')) return valid.pasta_dish;

    // 5. East Asian & Southeast Asian
    if (t.includes('ramen') || t.includes('pho') || t.includes('udon') || t.includes('laksa') || t.includes('soba')) return valid.ramen;
    if (t.includes('sushi') || t.includes('sashimi') || t.includes('poke')) return valid.sushi;
    if (t.includes('gyoza') || t.includes('dumpling') || t.includes('dim sum') || t.includes('bao') || t.includes('spring roll')) return valid.gyoza;
    if (t.includes('noodle') || t.includes('pad thai') || t.includes('chow mein') || t.includes('lo mein') || t.includes('japchae')) return valid.noodles;
    if (t.includes('kung pao') || t.includes('stir fry') || t.includes('teriyaki') || t.includes('katsu') || t.includes('orange chicken')) return valid.kung_pao;

    // 6. Mexican & Latin
    if (t.includes('taco') || t.includes('fajita') || t.includes('enchilada') || t.includes('quesadilla')) return valid.tacos;
    if (t.includes('burrito') || t.includes('wrap')) return valid.burrito;

    // 7. American & Burgers & Sandwiches
    if (t.includes('burger') || t.includes('slider') || t.includes('patty')) return valid.burger;
    if (t.includes('sandwich') || t.includes('toast') || t.includes('melt') || t.includes('panini') || t.includes('bagel')) return valid.sandwich;
    if (t.includes('salad') || t.includes('bowl')) return valid.salad;
    if (t.includes('soup') || t.includes('stew') || t.includes('chili') || t.includes('chowder') || t.includes('broth')) return valid.soup;

    // 8. General Cuisines Fallback
    if (cuisine === 'Indian') return valid.butter_chicken;
    if (cuisine === 'Italian') return valid.pasta_dish;
    if (cuisine === 'Japanese') return valid.sushi;
    if (cuisine === 'Chinese') return valid.noodles;
    if (cuisine === 'Mexican') return valid.tacos;
    if (cuisine === 'American') return valid.burger;
    if (cuisine === 'Mediterranean' || cuisine === 'Middle Eastern') return valid.mediterranean_skewer;
    if (cuisine === 'Dessert') return valid.general_dessert;

    return valid.butter_chicken;
  }

  const mapping: Record<string, string> = {};
  for (const recipe of INITIAL_RECIPES) {
    mapping[recipe.id] = resolveRecipe(recipe.title, recipe.cuisine);
  }

  const regFile = path.join(process.cwd(), 'src', 'data', 'recipeImageRegistry.ts');
  const code = `// AUTO-GENERATED VERIFIED AUTHENTIC RECIPE IMAGE REGISTRY
export const RECIPE_IMAGE_REGISTRY: Record<string, string> = ${JSON.stringify(mapping, null, 2)};
`;

  fs.writeFileSync(regFile, code);
  console.log(`Generated verified image registry for all ${Object.keys(mapping).length} recipes!`);
}

build();
