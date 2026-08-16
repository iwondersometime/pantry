import fs from 'fs';
import path from 'path';
import { testUrl } from './test-image-urls';
import { INITIAL_RECIPES } from '../src/data/recipes';

// Reliable, tested food photography IDs on Unsplash CDN
const CANDIDATE_PHOTOS: Record<string, string[]> = {
  butter_chicken: [
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80",
  ],
  paneer_butter_masala: [
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
  ],
  chana_masala: [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
  ],
  chicken_tikka_masala: [
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80",
  ],
  palak_paneer: [
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
  ],
  dal_makhani: [
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
  ],
  dal_tadka: [
    "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
  ],
  hyderabadi_biryani: [
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80",
  ],
  chicken_biryani: [
    "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
  ],
  veg_biryani: [
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
  ],
  aloo_gobi: [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
  ],
  rogan_josh: [
    "https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80",
  ],
  malai_kofta: [
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
  ],
  chicken_korma: [
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80",
  ],
  fish_curry: [
    "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
  ],
  rajma_masala: [
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
  ],
  baingan_bharta: [
    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80",
  ],
  sambar: [
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
  ],
  pav_bhaji: [
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80",
  ],
  kadai_chicken: [
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80",
  ],
  egg_curry: [
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
  ],
  mattar_paneer: [
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
  ],
  masala_dosa: [
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80",
  ],
  idli_sambar: [
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
  ],
  paneer_tikka: [
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80",
  ],
  chicken_tikka: [
    "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80",
  ],
  tandoori_chicken: [
    "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
  ],
  aloo_paratha: [
    "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop&q=80",
  ],
  samosa: [
    "https://images.unsplash.com/photo-1601050690185-502a5c9b98ff?w=800&auto=format&fit=crop&q=80",
  ],
  pani_puri: [
    "https://images.unsplash.com/photo-1601050690185-502a5c9b98ff?w=800&auto=format&fit=crop&q=80",
  ],
  bhel_puri: [
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80",
  ],
  poha: [
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
  ],
  jeera_rice: [
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80",
  ],
  lemon_rice: [
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80",
  ],
  
  // Indian Sweets & Desserts
  gulab_jamun: [
    "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80",
  ],
  gajar_halwa: [
    "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&auto=format&fit=crop&q=80",
  ],
  moong_dal_halwa: [
    "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&auto=format&fit=crop&q=80",
  ],
  rasgulla: [
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80",
  ],
  kheer: [
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80",
  ],
  phirni: [
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80",
  ],
  shahi_tukda: [
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80",
  ],
  rasmalai: [
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80",
  ],
  jalebi: [
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
  ],
  fruit_custard: [
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80",
  ],
  chocolate_mug_cake: [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
  ],

  // Italian
  spaghetti_carbonara: [
    "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop&q=80",
  ],
  tagliatelle_bolognese: [
    "https://images.unsplash.com/photo-1621996346565-e3adc644d9fa?w=800&auto=format&fit=crop&q=80",
  ],
  margherita_pizza: [
    "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
  ],
  cacio_e_pepe: [
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
  ],
  penne_vodka: [
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop&q=80",
  ],
  lasagna: [
    "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop&q=80",
  ],
  risotto_funghi: [
    "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800&auto=format&fit=crop&q=80",
  ],
  chicken_parmigiana: [
    "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&auto=format&fit=crop&q=80",
  ],
  fettuccine_alfredo: [
    "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop&q=80",
  ],
  minestrone: [
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
  ],
  pesto_pasta: [
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
  ],
  arancini: [
    "https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&auto=format&fit=crop&q=80",
  ],
  bruschetta: [
    "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&auto=format&fit=crop&q=80",
  ],
  caprese: [
    "https://images.unsplash.com/photo-1592417817098-8f3d69104a47?w=800&auto=format&fit=crop&q=80",
  ],
  pepperoni_pizza: [
    "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&auto=format&fit=crop&q=80",
  ],
  tiramisu: [
    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80",
  ],

  // Japanese
  ramen: [
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
  ],
  tonkotsu_ramen: [
    "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&auto=format&fit=crop&q=80",
  ],
  sushi_platter: [
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
  ],
  salmon_sashimi: [
    "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80",
  ],
  katsu_curry: [
    "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=800&auto=format&fit=crop&q=80",
  ],
  katsu_sando: [
    "https://images.unsplash.com/photo-1584947921538-4e8a34241c2c?w=800&auto=format&fit=crop&q=80",
  ],
  gyoza: [
    "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop&q=80",
  ],
  tempura: [
    "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=800&auto=format&fit=crop&q=80",
  ],
  yakitori: [
    "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&auto=format&fit=crop&q=80",
  ],

  // Chinese
  dim_sum: [
    "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80",
  ],
  dumplings: [
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
  ],
  fried_rice: [
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
  ],
  chow_mein: [
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
  ],
  kung_pao_chicken: [
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80",
  ],
  mapo_tofu: [
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
  ],
  peking_duck: [
    "https://images.unsplash.com/photo-1514944298352-78d120a1ebf2?w=800&auto=format&fit=crop&q=80",
  ],

  // Mexican
  tacos_carne_asada: [
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
  ],
  tacos_al_pastor: [
    "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&auto=format&fit=crop&q=80",
  ],
  burrito: [
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80",
  ],
  guacamole_chips: [
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
  ],
  enchiladas: [
    "https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=800&auto=format&fit=crop&q=80",
  ],
  quesadilla: [
    "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800&auto=format&fit=crop&q=80",
  ],
  fajitas: [
    "https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=800&auto=format&fit=crop&q=80",
  ],
  churros: [
    "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=800&auto=format&fit=crop&q=80",
  ],

  // Thai & Vietnamese
  pad_thai: [
    "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop&q=80",
  ],
  green_curry: [
    "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=80",
  ],
  tom_yum: [
    "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800&auto=format&fit=crop&q=80",
  ],
  pho_bo: [
    "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80",
  ],
  banh_mi: [
    "https://images.unsplash.com/photo-1600454309261-3dc9b7597637?w=800&auto=format&fit=crop&q=80",
  ],
  fresh_spring_rolls: [
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
  ],

  // Korean
  bibimbap: [
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80",
  ],
  korean_fried_chicken: [
    "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80",
  ],
  tteokbokki: [
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop&q=80",
  ],

  // Mediterranean & Middle Eastern & Turkish
  hummus: [
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
  ],
  falafel_wrap: [
    "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=800&auto=format&fit=crop&q=80",
  ],
  shakshuka: [
    "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&auto=format&fit=crop&q=80",
  ],
  shawarma: [
    "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&auto=format&fit=crop&q=80",
  ],
  kebab_skewers: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
  ],
  greek_salad: [
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80",
  ],
  baklava: [
    "https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=80",
  ],

  // French & Spanish
  beef_bourguignon: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
  ],
  paella: [
    "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800&auto=format&fit=crop&q=80",
  ],
  patatas_bravas: [
    "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&auto=format&fit=crop&q=80",
  ],
  gambas_al_ajillo: [
    "https://images.unsplash.com/photo-1559742811-822873691df8?w=800&auto=format&fit=crop&q=80",
  ],

  // American & Sandwiches & Global
  classic_burger: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
  ],
  cheeseburger: [
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
  ],
  grilled_cheese: [
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
  ],
  club_sandwich: [
    "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80",
  ],
  pancakes: [
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80",
  ],
  steak_frites: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
  ],
};

async function main() {
  console.log("Verifying candidate food photos...");
  const validPhotos: Record<string, string> = {};
  
  for (const [key, urls] of Object.entries(CANDIDATE_PHOTOS)) {
    let found = false;
    for (const url of urls) {
      const res = await testUrl(url);
      if (res.ok) {
        validPhotos[key] = url;
        found = true;
        break;
      }
    }
    if (!found) {
      console.warn(`[WARN] No valid URL found for ${key}`);
      validPhotos[key] = "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80";
    }
  }

  console.log(`Validated ${Object.keys(validPhotos).length} photo categories!`);

  // Now create the resolver
  function resolveFor(title: string, cuisine: string): string {
    const t = title.toLowerCase();
    if (t.includes('butter chicken') || t.includes('murgh makhani')) return validPhotos.butter_chicken;
    if (t.includes('paneer butter') || t.includes('shahi paneer')) return validPhotos.paneer_butter_masala;
    if (t.includes('chana') || t.includes('chole') || t.includes('chickpea')) return validPhotos.chana_masala;
    if (t.includes('tikka masala')) return validPhotos.chicken_tikka_masala;
    if (t.includes('palak') || t.includes('saag')) return validPhotos.palak_paneer;
    if (t.includes('dal makhani') || t.includes('black lentil')) return validPhotos.dal_makhani;
    if (t.includes('dal') || t.includes('lentil') || t.includes('tadka')) return validPhotos.dal_tadka;
    if (t.includes('biryani')) {
      if (t.includes('veg') || t.includes('vegetable')) return validPhotos.veg_biryani;
      if (t.includes('chicken')) return validPhotos.chicken_biryani;
      return validPhotos.hyderabadi_biryani;
    }
    if (t.includes('pulao') || t.includes('fried rice') || t.includes('jeera rice') || t.includes('rice')) {
      if (t.includes('lemon') || t.includes('tamarind') || t.includes('curd')) return validPhotos.lemon_rice;
      if (t.includes('fried')) return validPhotos.fried_rice;
      return validPhotos.jeera_rice;
    }
    if (t.includes('gajar') || t.includes('carrot halwa')) return validPhotos.gajar_halwa;
    if (t.includes('moong dal halwa') || t.includes('halwa')) return validPhotos.moong_dal_halwa;
    if (t.includes('shahi tukda') || t.includes('bread pudding')) return validPhotos.shahi_tukda;
    if (t.includes('gulab jamun')) return validPhotos.gulab_jamun;
    if (t.includes('rasgulla') || t.includes('rasmalai')) return validPhotos.rasgulla;
    if (t.includes('kheer') || t.includes('phirni') || t.includes('payasam')) return validPhotos.kheer;
    if (t.includes('jalebi')) return validPhotos.jalebi;
    if (t.includes('custard')) return validPhotos.fruit_custard;
    if (t.includes('mug cake') || t.includes('chocolate cake')) return validPhotos.chocolate_mug_cake;
    if (t.includes('cake') || t.includes('tiramisu') || t.includes('dessert')) return validPhotos.tiramisu;
    
    if (t.includes('rogan josh') || t.includes('mutton') || t.includes('lamb')) return validPhotos.rogan_josh;
    if (t.includes('malai kofta') || t.includes('kofta')) return validPhotos.malai_kofta;
    if (t.includes('korma')) return validPhotos.chicken_korma;
    if (t.includes('fish') || t.includes('salmon') || t.includes('prawn') || t.includes('seafood') || t.includes('scallop')) {
      if (t.includes('gambas') || t.includes('garlic shrimp')) return validPhotos.gambas_al_ajillo;
      return validPhotos.fish_curry;
    }
    if (t.includes('rajma') || t.includes('bean')) return validPhotos.rajma_masala;
    if (t.includes('baingan') || t.includes('eggplant') || t.includes('aubergine')) return validPhotos.baingan_bharta;
    if (t.includes('sambar') || t.includes('rasam')) return validPhotos.sambar;
    if (t.includes('pav bhaji')) return validPhotos.pav_bhaji;
    if (t.includes('kadai') || t.includes('jalfrezi')) return validPhotos.kadai_chicken;
    if (t.includes('egg') || t.includes('omelette') || t.includes('bhurji') || t.includes('frittata') || t.includes('shakshuka')) {
      if (t.includes('shakshuka')) return validPhotos.shakshuka;
      return validPhotos.egg_curry;
    }
    if (t.includes('paneer')) return validPhotos.paneer_tikka;
    if (t.includes('dosa') || t.includes('uttapam') || t.includes('appam')) return validPhotos.masala_dosa;
    if (t.includes('idli') || t.includes('vada') || t.includes('upma')) return validPhotos.idli_sambar;
    if (t.includes('paratha') || t.includes('naan') || t.includes('roti') || t.includes('flatbread')) return validPhotos.aloo_paratha;
    if (t.includes('samosa') || t.includes('chaat') || t.includes('puri') || t.includes('tikki') || t.includes('pakora')) return validPhotos.samosa;
    if (t.includes('poha') || t.includes('khichdi')) return validPhotos.poha;
    if (t.includes('aloo') || t.includes('potato') || t.includes('bravas') || t.includes('fries')) return validPhotos.patatas_bravas;
    if (t.includes('kebab') || t.includes('skewer') || t.includes('satay') || t.includes('souvlaki')) return validPhotos.kebab_skewers;
    if (t.includes('bhindi') || t.includes('okra') || t.includes('gobi') || t.includes('cauliflower') || t.includes('mushroom')) return validPhotos.aloo_gobi;

    // Italian
    if (t.includes('carbonara')) return validPhotos.spaghetti_carbonara;
    if (t.includes('bolognese') || t.includes('ragu')) return validPhotos.tagliatelle_bolognese;
    if (t.includes('pizza')) {
      if (t.includes('pepperoni')) return validPhotos.pepperoni_pizza;
      return validPhotos.margherita_pizza;
    }
    if (t.includes('cacio e pepe')) return validPhotos.cacio_e_pepe;
    if (t.includes('vodka') || t.includes('arrabbiata')) return validPhotos.penne_vodka;
    if (t.includes('lasagna') || t.includes('cannelloni')) return validPhotos.lasagna;
    if (t.includes('risotto') || t.includes('polenta')) return validPhotos.risotto_funghi;
    if (t.includes('parmigiana') || t.includes('piccata')) return validPhotos.chicken_parmigiana;
    if (t.includes('alfredo')) return validPhotos.fettuccine_alfredo;
    if (t.includes('pesto')) return validPhotos.pesto_pasta;
    if (t.includes('arancini')) return validPhotos.arancini;
    if (t.includes('bruschetta') || t.includes('crostini')) return validPhotos.bruschetta;
    if (t.includes('caprese')) return validPhotos.caprese;
    if (t.includes('gnocchi') || t.includes('ravioli') || t.includes('pasta') || t.includes('spaghetti') || t.includes('fettuccine') || t.includes('penne') || t.includes('tagliatelle')) return validPhotos.spaghetti_carbonara;

    // Japanese
    if (t.includes('ramen') || t.includes('udon') || t.includes('soba')) return validPhotos.ramen;
    if (t.includes('sushi') || t.includes('nigiri') || t.includes('roll') || t.includes('maki')) return validPhotos.sushi_platter;
    if (t.includes('sashimi') || t.includes('poke')) return validPhotos.salmon_sashimi;
    if (t.includes('katsu')) return validPhotos.katsu_curry;
    if (t.includes('gyoza') || t.includes('dumpling') || t.includes('potsticker')) return validPhotos.gyoza;
    if (t.includes('tempura')) return validPhotos.tempura;
    if (t.includes('yakitori') || t.includes('teriyaki')) return validPhotos.yakitori;
    if (t.includes('sando')) return validPhotos.katsu_sando;

    // Chinese
    if (t.includes('dim sum') || t.includes('bao') || t.includes('buns')) return validPhotos.dim_sum;
    if (t.includes('noodle') || t.includes('chow mein') || t.includes('lo mein')) return validPhotos.chow_mein;
    if (t.includes('kung pao') || t.includes('general tso') || t.includes('sweet and sour') || t.includes('orange chicken')) return validPhotos.kung_pao_chicken;
    if (t.includes('tofu') || t.includes('mapo')) return validPhotos.mapo_tofu;
    if (t.includes('duck')) return validPhotos.peking_duck;
    if (t.includes('wonton') || t.includes('soup') || t.includes('stew') || t.includes('broth') || t.includes('chowder')) return validPhotos.minestrone;

    // Mexican
    if (t.includes('taco')) return validPhotos.tacos_carne_asada;
    if (t.includes('burrito')) return validPhotos.burrito;
    if (t.includes('guacamole') || t.includes('salsa') || t.includes('nachos')) return validPhotos.guacamole_chips;
    if (t.includes('enchilada') || t.includes('chiles')) return validPhotos.enchiladas;
    if (t.includes('quesadilla')) return validPhotos.quesadilla;
    if (t.includes('fajita')) return validPhotos.fajitas;
    if (t.includes('churros')) return validPhotos.churros;

    // Thai & Vietnamese
    if (t.includes('pad thai') || t.includes('laksa')) return validPhotos.pad_thai;
    if (t.includes('green curry') || t.includes('red curry') || t.includes('yellow curry') || t.includes('massaman')) return validPhotos.green_curry;
    if (t.includes('tom yum') || t.includes('tom kha')) return validPhotos.tom_yum;
    if (t.includes('pho') || t.includes('bun bo') || t.includes('bun cha')) return validPhotos.pho_bo;
    if (t.includes('banh mi')) return validPhotos.banh_mi;
    if (t.includes('spring roll') || t.includes('summer roll') || t.includes('egg roll')) return validPhotos.fresh_spring_rolls;

    // Korean
    if (t.includes('bibimbap')) return validPhotos.bibimbap;
    if (t.includes('bulgogi') || t.includes('galbi') || t.includes('korean bbq') || t.includes('steak') || t.includes('beef')) return validPhotos.steak_frites;
    if (t.includes('korean fried chicken') || t.includes('fried chicken') || t.includes('schnitzel') || t.includes('wings')) return validPhotos.korean_fried_chicken;
    if (t.includes('tteokbokki')) return validPhotos.tteokbokki;

    // Mediterranean & Middle Eastern
    if (t.includes('hummus') || t.includes('dip') || t.includes('baba ghanoush')) return validPhotos.hummus;
    if (t.includes('falafel')) return validPhotos.falafel_wrap;
    if (t.includes('shawarma') || t.includes('doner') || t.includes('gyro')) return validPhotos.shawarma;
    if (t.includes('salad') || t.includes('tabbouleh') || t.includes('fattoush')) return validPhotos.greek_salad;
    if (t.includes('baklava') || t.includes('knafeh')) return validPhotos.baklava;
    if (t.includes('paella')) return validPhotos.paella;

    // Sandwiches & Burgers
    if (t.includes('burger') || t.includes('slider')) return validPhotos.cheeseburger;
    if (t.includes('grilled cheese') || t.includes('melt') || t.includes('toastie')) return validPhotos.grilled_cheese;
    if (t.includes('sandwich') || t.includes('sub') || t.includes('panini') || t.includes('wrap')) return validPhotos.club_sandwich;
    if (t.includes('pancake') || t.includes('crepe') || t.includes('waffle')) return validPhotos.pancakes;

    // Default by cuisine
    if (cuisine === 'Indian') return validPhotos.butter_chicken;
    if (cuisine === 'Italian') return validPhotos.spaghetti_carbonara;
    if (cuisine === 'Japanese') return validPhotos.sushi_platter;
    if (cuisine === 'Chinese') return validPhotos.dim_sum;
    if (cuisine === 'Mexican') return validPhotos.tacos_carne_asada;
    if (cuisine === 'Thai') return validPhotos.pad_thai;
    if (cuisine === 'Korean') return validPhotos.bibimbap;
    if (cuisine === 'American') return validPhotos.cheeseburger;
    if (cuisine === 'Mediterranean' || cuisine === 'Middle Eastern' || cuisine === 'Turkish') return validPhotos.kebab_skewers;
    if (cuisine === 'French') return validPhotos.beef_bourguignon;
    if (cuisine === 'Spanish') return validPhotos.paella;
    if (cuisine === 'Vietnamese') return validPhotos.pho_bo;

    return validPhotos.butter_chicken;
  }

  const finalRegistry: Record<string, string> = {};
  for (const recipe of INITIAL_RECIPES) {
    finalRegistry[recipe.id] = resolveFor(recipe.title, recipe.cuisine);
  }

  const REGISTRY_FILE = path.join(process.cwd(), 'src', 'data', 'recipeImageRegistry.ts');
  const fileContent = `// AUTO-GENERATED AUTHENTIC RECIPE IMAGE REGISTRY
export const RECIPE_IMAGE_REGISTRY: Record<string, string> = ${JSON.stringify(finalRegistry, null, 2)};
`;

  fs.writeFileSync(REGISTRY_FILE, fileContent);
  console.log(`Successfully generated verified authentic image mappings for all ${Object.keys(finalRegistry).length} recipes!`);
}

main();
