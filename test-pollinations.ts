import fs from 'fs';

const title = "Hyderabadi Biryani";
const ingredients = "basmati rice, chicken, yogurt, onions, tomatoes, ginger, garlic, spices, saffron, ghee, mint, coriander";
const desc = "Authentic Hyderabadi Biryani with layered saffron rice, tender marinated chicken, and fried onions on top.";

const prompt = `Professional macro food photography of authentic ${title}. ${desc} Key ingredients visible: ${ingredients}. High resolution, appetizing, beautifully plated, top-down view.`;

console.log(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=12345`);
