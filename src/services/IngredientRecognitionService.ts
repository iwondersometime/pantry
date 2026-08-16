export interface RecognizedIngredient {
  name: string;
  confidence: number;
}

export interface RecognitionResponse {
  success?: boolean;
  ingredients: RecognizedIngredient[];
  confidence: number;
  source: string;
  error?: string;
  errorDetails?: {
    name: string;
    message: string;
    stage?: string;
  };
  rawResponse?: string;
  debugMeta?: {
    filename: string;
    mimeType: string;
    dimensions: string;
    sourceType: string;
    partsCount: number;
  };
  serverTimings?: {
    geminiRequestMs: number;
    jsonParseMs: number;
    totalServerMs: number;
  };
  clientTimings?: {
    imagePrepMs: number;
    networkMs: number;
    totalClientMs: number;
  };
}

export class IngredientRecognitionService {
  public static resizeBase64Image(base64Str: string, maxWidth = 1000): Promise<string> {
    // If the image base64 is already reasonably sized (< 800KB string length), send directly without canvas redraw overhead
    if (!base64Str || typeof base64Str !== 'string') {
      return Promise.resolve(base64Str || '');
    }
    if (base64Str.length < 800000) {
      return Promise.resolve(base64Str);
    }

    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
          try {
            if (img.width <= maxWidth && img.height <= maxWidth) {
              return resolve(base64Str);
            }
            const scale = maxWidth / Math.max(img.width, img.height);
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale) || 640;
            canvas.height = Math.round(img.height * scale) || 480;
            const ctx = canvas.getContext('2d');
            if (ctx && canvas.width > 0 && canvas.height > 0) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL('image/jpeg', 0.85));
            } else {
              resolve(base64Str);
            }
          } catch {
            resolve(base64Str);
          }
        };
        img.onerror = () => resolve(base64Str);
      } catch {
        resolve(base64Str);
      }
    });
  }

  /**
   * Produce a small thumbnail for local storage and scan history to avoid quota limits
   */
  public static createThumbnail(base64Str: string, maxWidth = 280): Promise<string> {
    return new Promise((resolve) => {
      try {
        if (!base64Str || typeof base64Str !== 'string') return resolve('');
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
          try {
            const scale = maxWidth / Math.max(img.width, img.height, 1);
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(Math.round(img.width * scale), 50);
            canvas.height = Math.max(Math.round(img.height * scale), 50);
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL('image/jpeg', 0.65));
            } else {
              resolve('');
            }
          } catch {
            resolve('');
          }
        };
        img.onerror = () => resolve('');
      } catch {
        resolve('');
      }
    });
  }

  /**
   * Send captured image to backend service for AI recognition
   */
  static async recognizeIngredients(
    imageBase64: string,
    fileMeta?: {
      filename?: string;
      mimeType?: string;
      width?: number | null;
      height?: number | null;
      sourceType?: 'newly_captured' | 'uploaded_file';
    }
  ): Promise<RecognitionResponse> {
    const tClientStart = performance.now();
    try {
      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return {
          success: false,
          ingredients: [],
          confidence: 0,
          source: 'invalid-input',
          error: 'No image data provided for scanning.',
          errorDetails: {
            name: 'InvalidInputError',
            message: 'No image data provided for scanning.',
            stage: 'STEP 1: Starting Gemini test',
          },
        };
      }

      const tPrepStart = performance.now();
      const resizedImage = await this.resizeBase64Image(imageBase64);
      const tPrepEnd = performance.now();

      const tNetStart = performance.now();
      const res = await fetch('/api/scan-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: resizedImage,
          mimeType: fileMeta?.mimeType || 'image/jpeg',
          fileMeta: {
            filename: fileMeta?.filename || 'captured_photo.jpg',
            mimeType: fileMeta?.mimeType || 'image/jpeg',
            width: fileMeta?.width,
            height: fileMeta?.height,
            sourceType: fileMeta?.sourceType || 'newly_captured',
          },
        }),
      });

      const data = await res.json().catch(() => ({}));
      const tNetEnd = performance.now();

      if (!res.ok) {
        console.warn('Scan API response not ok:', res.status, data);
      }

      const rawIngredients = Array.isArray(data?.ingredients) ? data.ingredients : [];
      const normalizedIngredients: RecognizedIngredient[] = rawIngredients
        .map((item: any) => {
          if (typeof item === 'object' && item !== null) {
            return {
              name: typeof item.name === 'string' ? item.name : String(item),
              confidence: typeof item.confidence === 'number' ? item.confidence : 0.9,
            };
          }
          return {
            name: String(item),
            confidence: 0.9,
          };
        })
        .filter((ing) => ing.name && ing.name.trim().length > 0);

      const tClientEnd = performance.now();

      return {
        success: data?.success ?? (normalizedIngredients.length > 0 && !data?.error),
        ingredients: normalizedIngredients,
        confidence: typeof data?.confidence === 'number' ? data.confidence : 0.9,
        source: data?.source || 'gemini-vision',
        error: data?.error,
        errorDetails: data?.errorDetails,
        rawResponse: data?.rawResponse,
        debugMeta: data?.debugMeta,
        serverTimings: data?.serverTimings,
        clientTimings: {
          imagePrepMs: Math.round(tPrepEnd - tPrepStart),
          networkMs: Math.round(tNetEnd - tNetStart),
          totalClientMs: Math.round(tClientEnd - tClientStart),
        },
      };
    } catch (err: any) {
      console.warn('IngredientRecognitionService error caught:', err);
      return {
        success: false,
        ingredients: [],
        confidence: 0,
        source: 'client-error',
        error: err?.message || 'Network request failed. Please check connection.',
        errorDetails: {
          name: err?.name || 'NetworkError',
          message: err?.message || String(err),
          stage: 'STEP 4: Sending Gemini request',
        },
      };
    }
  }
}

