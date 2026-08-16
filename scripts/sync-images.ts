import fs from 'fs';
import path from 'path';
import { INITIAL_RECIPES } from '../src/data/recipes.js';

const DEST_DIR = path.join(process.cwd(), 'public', 'images', 'recipes');
const REGISTRY_FILE = path.join(process.cwd(), 'src', 'data', 'recipeImageRegistry.ts');

if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });

let registry: Record<string, string> = {};
try {
    const existingCode = fs.readFileSync(REGISTRY_FILE, 'utf8');
    const match = existingCode.match(/export const RECIPE_IMAGE_REGISTRY: Record<string, string> = ({[\s\S]*?});/);
    if (match && match[1]) registry = JSON.parse(match[1]);
} catch (e) {}

const saveRegistry = () => {
    const outputCode = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.\nexport const RECIPE_IMAGE_REGISTRY: Record<string, string> = ${JSON.stringify(registry, null, 2)};\n`;
    fs.writeFileSync(REGISTRY_FILE, outputCode);
};

function getPrompt(recipe: any) {
    const title = recipe.title;
    const ingredients = recipe.ingredients?.slice(0, 5).join(', ') || '';
    const desc = recipe.description || '';
    return `Professional macro food photography of authentic ${title}. ${desc}. Key ingredients: ${ingredients}. High resolution, appetizing, beautifully plated, top-down view.`;
}

async function downloadImage(url: string, destPath: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
            clearTimeout(timeout);
            return false;
        }
        const buffer = await res.arrayBuffer();
        clearTimeout(timeout);
        if (buffer.byteLength < 5000) return false;
        fs.writeFileSync(destPath, Buffer.from(buffer));
        return true;
    } catch (e) {
        clearTimeout(timeout);
        return false;
    }
}

async function run() {
    let missing = [];
    for (const recipe of INITIAL_RECIPES) {
        const destPath = path.join(DEST_DIR, `${recipe.id}.jpg`);
        const pubUrl = `/images/recipes/${recipe.id}.jpg`;
        if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
            registry[recipe.id] = pubUrl;
        } else {
            missing.push(recipe);
        }
    }
    
    console.log(`Missing ${missing.length} images. Syncing slowly in background to avoid rate limits...`);
    
    for (let i = 0; i < missing.length; i++) {
        const recipe = missing[i];
        const destPath = path.join(DEST_DIR, `${recipe.id}.jpg`);
        const pubUrl = `/images/recipes/${recipe.id}.jpg`;
        
        const prompt = getPrompt(recipe);
        let seed = 0;
        for (let i = 0; i < recipe.id.length; i++) seed = (seed << 5) - seed + recipe.id.charCodeAt(i);
        seed = Math.abs(seed) % 10000;
        
        const aiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${seed}`;
        
        let success = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
            success = await downloadImage(aiUrl, destPath);
            if (success) break;
            await new Promise(r => setTimeout(r, 2000));
        }
        
        if (success) {
            registry[recipe.id] = pubUrl;
            saveRegistry();
            console.log(`[${i+1}/${missing.length}] Saved: ${recipe.title}`);
        } else {
            console.log(`[${i+1}/${missing.length}] Failed: ${recipe.title}`);
        }
        
        // Wait 2 seconds between requests to avoid 429 Too Many Requests
        await new Promise(r => setTimeout(r, 2000));
    }
    
    console.log('Background sync complete!');
}

run();
