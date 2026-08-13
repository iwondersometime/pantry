export interface RecognitionResponse {
  ingredients: string[];
  confidence: number;
  source: string;
}

export class IngredientRecognitionService {
  /**
   * Send captured image to backend service for AI recognition
   */
  static async recognizeIngredients(imageBase64: string): Promise<RecognitionResponse> {
    const res = await fetch('/api/scan-ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType: 'image/jpeg' }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Server AI scan returned status ${res.status}`);
    }

    if (!data.ingredients || !Array.isArray(data.ingredients) || data.ingredients.length === 0) {
      throw new Error('No ingredients identified in photo. Please try again with better lighting.');
    }

    return {
      ingredients: data.ingredients,
      confidence: data.confidence || 0.95,
      source: data.source || 'server-gemini-ai',
    };
  }
}

