import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

async function test() {
  if (!process.env.GEMINI_API_KEY) {
    console.log("No GEMINI_API_KEY");
    return;
  }
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: 'A delicious bowl of Hyderabadi Biryani',
        config: {
            numberOfImages: 1,
            outputMimeType: "image/jpeg",
        }
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64Image = response.generatedImages[0].image.imageBytes;
        fs.writeFileSync('test-biryani.jpg', Buffer.from(base64Image, 'base64'));
        console.log("Success! Saved test-biryani.jpg");
    } else {
        console.log("No images returned.");
    }
  } catch (e) {
    console.error(e);
  }
}
test();
