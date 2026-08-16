import React, { useState, useRef } from 'react';
import { Camera as CameraIcon, RefreshCw, Upload, Sparkles, AlertCircle, ArrowRight, CheckCircle2, Terminal } from 'lucide-react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { haptics } from '../services/HapticService';

interface ScanScreenProps {
  onScanComplete: (ingredients: string[], capturedImage: string | null) => void;
  onManualSearchClick: () => void;
  isQuickCooking?: boolean;
}

interface ImageFileMeta {
  filename: string;
  mimeType: string;
  fileSize: string;
  width: number | null;
  height: number | null;
  sourceType: 'newly_captured' | 'uploaded_file';
}

interface GeminiTestFailure {
  stage: string;
  errorName: string;
  errorMessage: string;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({
  onScanComplete,
  onManualSearchClick,
  isQuickCooking = false,
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<ImageFileMeta | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [rawGeminiOutput, setRawGeminiOutput] = useState<string | null>(null);

  // Diagnostic Test States for Stage Isolation
  const [stage1Passed, setStage1Passed] = useState<boolean>(false);
  const [stage1Message, setStage1Message] = useState<string | null>(null);

  const [stage2Running, setStage2Running] = useState<boolean>(false);
  const [stage2Passed, setStage2Passed] = useState<boolean>(false);
  const [stage2RawOutput, setStage2RawOutput] = useState<string | null>(null);
  const [stage2Error, setStage2Error] = useState<string | null>(null);
  const [stage2Failure, setStage2Failure] = useState<GeminiTestFailure | null>(null);
  const [stage2StepLogs, setStage2StepLogs] = useState<string[]>([]);

  const [stage3Passed, setStage3Passed] = useState<boolean>(false);
  const [stage3Ingredients, setStage3Ingredients] = useState<string[] | null>(null);
  const [stage3Error, setStage3Error] = useState<string | null>(null);

  const [stage4Passed, setStage4Passed] = useState<boolean>(false);
  const [stage4MatchCount, setStage4MatchCount] = useState<number | null>(null);
  const [stage4Error, setStage4Error] = useState<string | null>(null);

  const [stage5Running, setStage5Running] = useState<boolean>(false);
  const [stage5Passed, setStage5Passed] = useState<boolean>(false);
  const [stage5Message, setStage5Message] = useState<string | null>(null);
  const [stage5Error, setStage5Error] = useState<string | null>(null);

  const scanLockRef = useRef<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clear all diagnostic tests and states
  const clearDiagnostics = () => {
    setStage1Passed(false);
    setStage1Message(null);
    setStage2Running(false);
    setStage2Passed(false);
    setStage2Failure(null);
    setStage2Error(null);
    setStage2RawOutput(null);
    setStage2StepLogs([]);
    setStage3Passed(false);
    setStage3Ingredients(null);
    setStage3Error(null);
    setStage4Passed(false);
    setStage4MatchCount(null);
    setStage4Error(null);
    setStage5Running(false);
    setStage5Passed(false);
    setStage5Message(null);
    setStage5Error(null);
  };

  // Helper to measure image dimensions and record file metadata
  const processImageSpecs = (
    dataUrl: string,
    name = 'captured_photo.jpg',
    mime = 'image/jpeg',
    sizeBytes?: number,
    sourceType: 'newly_captured' | 'uploaded_file' = 'newly_captured'
  ) => {
    try {
      const bytes = sizeBytes || Math.round(dataUrl.length * 0.75);
      const sizeKB = (bytes / 1024).toFixed(1);
      const sizeMB = (bytes / (1024 * 1024)).toFixed(2);

      const initialMeta: ImageFileMeta = {
        filename: name,
        mimeType: mime,
        fileSize: `${sizeKB} KB (${sizeMB} MB)`,
        width: null,
        height: null,
        sourceType,
      };
      setFileMeta(initialMeta);

      const img = new Image();
      img.onload = () => {
        setFileMeta({
          filename: name,
          mimeType: mime,
          fileSize: `${sizeKB} KB (${sizeMB} MB)`,
          width: img.naturalWidth,
          height: img.naturalHeight,
          sourceType,
        });
      };
      img.onerror = () => {
        console.warn('Image dimensions reading error');
      };
      img.src = dataUrl;
    } catch (err: any) {
      console.error('Error processing image specs:', err);
    }
  };

  // Trigger Native Capacitor Camera or Web Camera Stream
  const triggerCamera = async () => {
    setScanError(null);

    if (Capacitor.isNativePlatform()) {
      try {
        const photo = await Camera.getPhoto({
          quality: 85,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
        });

        if (photo.dataUrl) {
          processImageSpecs(photo.dataUrl, 'camera_capture.jpg', 'image/jpeg', undefined, 'newly_captured');
          setCapturedImage(photo.dataUrl);
        }
      } catch (err: any) {
        console.warn('Native camera error or user cancelled:', err);
        if (err?.message !== 'User cancelled photos app') {
          setScanError('Camera permission denied or camera unavailable. You can upload a photo from your gallery.');
        }
      }
    } else {
      // Web browser camera stream fallback
      if (!navigator?.mediaDevices?.getUserMedia) {
        setScanError('Camera API unavailable in this browser context. You can upload a photo from your gallery below.');
        setIsCapturing(false);
        return;
      }

      setIsCapturing(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera access error or denied:', err);
        setScanError('Camera permission denied or camera unavailable. You can upload a photo or search ingredients manually.');
        setIsCapturing(false);
      }
    }
  };

  const stopCamera = () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    } catch (err) {
      console.warn('Error stopping camera stream:', err);
    }
    setIsCapturing(false);
  };

  const captureWebPhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const width = video.videoWidth > 0 ? video.videoWidth : 640;
      const height = video.videoHeight > 0 ? video.videoHeight : 480;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        if (dataUrl && dataUrl.length > 50) {
          processImageSpecs(dataUrl, 'web_camera_frame.jpg', 'image/jpeg', undefined, 'newly_captured');
          setCapturedImage(dataUrl);
          stopCamera();
          return;
        }
      }
      setScanError('Frame capture incomplete. Please upload a photo from your gallery instead.');
    } catch (err: any) {
      console.error('Frame capture error:', err);
      setScanError(`Camera capture error: ${err.message}`);
    }
  };

  const triggerGalleryPicker = () => {
    setScanError(null);
    if (Capacitor.isNativePlatform()) {
      Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      })
        .then((photo) => {
          if (photo?.dataUrl) {
            processImageSpecs(photo.dataUrl, 'gallery_photo.jpg', 'image/jpeg', undefined, 'uploaded_file');
            setCapturedImage(photo.dataUrl);
            stopCamera();
          }
        })
        .catch((err: any) => {
          console.warn('Gallery selection error or user cancelled:', err);
          // Fallback to standard web file input if native plugin failed
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
          }
        });
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setScanError('Please select a valid photo or image file.');
        e.target.value = '';
        return;
      }
      setScanError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          processImageSpecs(dataUrl, file.name, file.type || 'image/jpeg', file.size, 'uploaded_file');
          setCapturedImage(dataUrl);
          stopCamera();
        }
      };
      reader.onerror = (err) => {
        console.error('FileReader error:', err);
        setScanError('Could not load the selected photo. Please try again.');
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // STEP 1: Test Image Button
  const runStage1Test = () => {
    try {
      if (!capturedImage) {
        throw new Error('No image file selected.');
      }
      setStage1Passed(true);
      setStage1Message(`Stage 1 PASS: Image loaded & rendered in browser successfully (${fileMeta?.width || '?'}x${fileMeta?.height || '?'}px).`);
    } catch (err: any) {
      setStage1Passed(false);
      setStage1Message(`Stage 1 FAIL: ${err.message}`);
    }
  };

  // STEP 2: Test Gemini API call separately with strict 8-step isolation & error trapping
  const runStage2Test = async () => {
    // 1. Wrap the ENTIRE Test Gemini handler in a top-level try/catch so NO exception can crash the React app
    try {
      setStage2Running(true);
      setStage2Passed(false);
      setStage2Failure(null);
      setStage2Error(null);
      setStage2RawOutput(null);

      const logs: string[] = [];
      const recordStep = (stepText: string) => {
        console.log(stepText);
        logs.push(stepText);
        setStage2StepLogs([...logs]);
      };

      // STEP 1: Starting Gemini test
      recordStep('STEP 1: Starting Gemini test');
      if (!capturedImage || typeof capturedImage !== 'string' || capturedImage.trim().length === 0) {
        setStage2Failure({
          stage: 'STEP 1: Starting Gemini test',
          errorName: 'MissingImageInputError',
          errorMessage: 'No image is currently selected or captured. Please take a photo or select an image first.',
        });
        setStage2Running(false);
        return;
      }

      // STEP 2: Preparing image
      recordStep('STEP 2: Preparing image');
      let preparedImage: string | null = null;
      try {
        const { IngredientRecognitionService } = await import('../services/IngredientRecognitionService');
        if (!IngredientRecognitionService) {
          throw new Error('IngredientRecognitionService module could not be imported.');
        }
        preparedImage = await IngredientRecognitionService.resizeBase64Image(capturedImage);
      } catch (prepErr: any) {
        setStage2Failure({
          stage: 'STEP 2: Preparing image',
          errorName: prepErr?.name || 'ImagePreparationError',
          errorMessage: prepErr?.message || 'Failed to prepare and encode image payload.',
        });
        setStage2Running(false);
        return;
      }

      if (!preparedImage || typeof preparedImage !== 'string' || preparedImage.trim().length === 0) {
        setStage2Failure({
          stage: 'STEP 2: Preparing image',
          errorName: 'InvalidImageDataError',
          errorMessage: 'Prepared image data is empty or invalid.',
        });
        setStage2Running(false);
        return;
      }

      // STEP 3: Creating Gemini request
      recordStep('STEP 3: Creating Gemini request');
      let requestPayload: any = null;
      try {
        requestPayload = {
          imageBase64: preparedImage,
          mimeType: fileMeta?.mimeType || 'image/jpeg',
          fileMeta: {
            filename: fileMeta?.filename || 'captured_photo.jpg',
            mimeType: fileMeta?.mimeType || 'image/jpeg',
            width: fileMeta?.width || null,
            height: fileMeta?.height || null,
            sourceType: fileMeta?.sourceType || 'newly_captured',
          },
        };
        if (!requestPayload.imageBase64 || typeof requestPayload.imageBase64 !== 'string') {
          throw new Error('Malformed request body: base64 payload is missing.');
        }
      } catch (createErr: any) {
        setStage2Failure({
          stage: 'STEP 3: Creating Gemini request',
          errorName: createErr?.name || 'MalformedRequestError',
          errorMessage: createErr?.message || 'Failed to construct the Gemini request body.',
        });
        setStage2Running(false);
        return;
      }

      // STEP 4: Sending Gemini request
      recordStep('STEP 4: Sending Gemini request');
      let fetchResponse: Response | null = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000);

        fetchResponse = await fetch('/api/scan-ingredients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
      } catch (fetchErr: any) {
        const isAbort = fetchErr?.name === 'AbortError';
        setStage2Failure({
          stage: 'STEP 4: Sending Gemini request',
          errorName: isAbort ? 'TimeoutError' : (fetchErr?.name || 'NetworkError'),
          errorMessage: isAbort
            ? 'Request timed out after 35 seconds. Please check connection.'
            : (fetchErr?.message || 'Failed to connect to backend server.'),
        });
        setStage2Running(false);
        return;
      }

      if (!fetchResponse) {
        setStage2Failure({
          stage: 'STEP 4: Sending Gemini request',
          errorName: 'NullFetchResponseError',
          errorMessage: 'Server returned a null response object.',
        });
        setStage2Running(false);
        return;
      }

      // STEP 5: Gemini response received
      recordStep('STEP 5: Gemini response received');
      let responseData: any = null;
      try {
        responseData = await fetchResponse.json();
      } catch (jsonErr: any) {
        setStage2Failure({
          stage: 'STEP 5: Gemini response received',
          errorName: 'InvalidJSONResponseError',
          errorMessage: `Server returned HTTP ${fetchResponse.status} with non-JSON response body.`,
        });
        setStage2Running(false);
        return;
      }

      if (!responseData || typeof responseData !== 'object') {
        setStage2Failure({
          stage: 'STEP 5: Gemini response received',
          errorName: 'NullResponseBodyError',
          errorMessage: 'API returned null or invalid response body.',
        });
        setStage2Running(false);
        return;
      }

      // STEP 6: Extracting response text
      recordStep('STEP 6: Extracting response text');
      // Do NOT assume the Gemini request succeeded just because the API call returned
      if (
        responseData.success === false ||
        responseData.error ||
        responseData.source === 'no-api-key' ||
        responseData.source === 'gemini-api-error' ||
        responseData.source === 'quota-exceeded' ||
        responseData.source === 'invalid-api-key' ||
        responseData.source === 'invalid-model' ||
        responseData.source === 'blocked-request' ||
        responseData.source === 'network-failure' ||
        responseData.source === 'malformed-json' ||
        responseData.source === 'server-error'
      ) {
        const errName = responseData.errorDetails?.name || responseData.source || 'GeminiApiError';
        const errMsg = responseData.errorDetails?.message || responseData.error || responseData.rawResponse || 'Gemini API call failed.';
        setStage2Failure({
          stage: responseData.errorDetails?.stage || 'STEP 6: Extracting response text',
          errorName: errName,
          errorMessage: errMsg,
        });
        setStage2Running(false);
        return;
      }

      const rawText = typeof responseData.rawResponse === 'string' && responseData.rawResponse.trim().length > 0
        ? responseData.rawResponse
        : JSON.stringify(responseData, null, 2);

      if (!rawText || rawText.trim().length === 0) {
        setStage2Failure({
          stage: 'STEP 6: Extracting response text',
          errorName: 'EmptyResponseTextError',
          errorMessage: 'Gemini candidate content returned empty or undefined text.',
        });
        setStage2Running(false);
        return;
      }

      // STEP 7: Parsing response
      recordStep('STEP 7: Parsing response');
      if (!Array.isArray(responseData.ingredients)) {
        setStage2Failure({
          stage: 'STEP 7: Parsing response',
          errorName: 'MalformedIngredientsArrayError',
          errorMessage: 'Gemini response did not contain a valid ingredients array.',
        });
        setStage2Running(false);
        return;
      }

      // STEP 8: Test complete
      recordStep('STEP 8: Test complete');
      setStage2Passed(true);
      setStage2RawOutput(rawText);
      setRawGeminiOutput(rawText);
    } catch (unexpectedErr: any) {
      // 2. Handle BOTH synchronous exceptions and rejected Promises
      console.error('Unhandled exception caught in runStage2Test:', unexpectedErr);
      setStage2Passed(false);
      setStage2Failure({
        stage: 'Top-Level Execution',
        errorName: unexpectedErr?.name || 'UnhandledException',
        errorMessage: unexpectedErr?.message || String(unexpectedErr) || 'An unexpected error occurred.',
      });
    } finally {
      setStage2Running(false);
    }
  };

  // STEP 3: Test Ingredient Parser
  const runStage3Test = () => {
    try {
      const outputText = stage2RawOutput || rawGeminiOutput;
      if (!outputText) {
        throw new Error('Run Stage 2 Gemini test or scan first to generate output.');
      }
      const parsedObj = JSON.parse(outputText);
      const rawIngs = Array.isArray(parsedObj?.ingredients) ? parsedObj.ingredients : [];
      const ingredients = rawIngs
        .map((i: any) => (typeof i === 'object' && i !== null ? i.name : String(i)))
        .filter((name: string) => Boolean(name) && name.trim().length > 0);

      if (ingredients.length === 0) {
        throw new Error('Parsed ingredients list was empty.');
      }

      setStage3Passed(true);
      setStage3Ingredients(ingredients);
      setStage3Error(null);
    } catch (err: any) {
      setStage3Passed(false);
      setStage3Error(`Stage 3 FAIL (Parser): ${err.message}`);
    }
  };

  // STEP 4: Test Recipe Matching
  const runStage4Test = async () => {
    try {
      const ingredients = stage3Ingredients && stage3Ingredients.length > 0 ? stage3Ingredients : ['Raisins'];
      const { matchAndRankRecipes } = await import('../services/IngredientMatchingEngine');
      const { INITIAL_RECIPES } = await import('../data/recipes');
      const matches = matchAndRankRecipes(INITIAL_RECIPES, ingredients);

      setStage4Passed(true);
      setStage4MatchCount(matches.length);
      setStage4Error(null);
    } catch (err: any) {
      setStage4Passed(false);
      setStage4Error(`Stage 4 FAIL (Recipe Matcher): ${err.message}`);
    }
  };

  // STEP 5: Test Firestore History Write
  const runStage5Test = async () => {
    setStage5Running(true);
    setStage5Error(null);
    try {
      const ingredients = stage3Ingredients && stage3Ingredients.length > 0 ? stage3Ingredients : ['Raisins'];
      const { FirebaseService } = await import('../services/FirebaseService');
      const user = FirebaseService.getCurrentUser();
      if (!user) {
        throw new Error('No active user session (User not signed in yet).');
      }
      await FirebaseService.addScanHistory(user.uid, ingredients, stage4MatchCount || 1, undefined);
      setStage5Passed(true);
      setStage5Message('Stage 5 PASS: Written to Firestore user scan history successfully!');
    } catch (err: any) {
      setStage5Passed(false);
      setStage5Error(`Stage 5 FAIL (Firestore): ${err.message}`);
    } finally {
      setStage5Running(false);
    }
  };

  const handleConfirmAndProcess = async () => {
    // Scan request lock: Ignore if already processing
    if (scanLockRef.current || isProcessing) {
      console.warn('Scan request ignored: a scan is already in progress.');
      return;
    }

    if (!capturedImage || typeof capturedImage !== 'string') {
      setScanError('No image selected or photo data was empty. Please capture or choose a photo to scan.');
      return;
    }

    scanLockRef.current = true;
    setIsProcessing(true);
    setScanError(null);

    const tScanStart = performance.now();
    console.log(`\n=== Scan Performance Timings ===\nScan started: 0.0ms`);

    try {
      const { IngredientRecognitionService } = await import('../services/IngredientRecognitionService');
      const response = await IngredientRecognitionService.recognizeIngredients(capturedImage, fileMeta || undefined);

      const tClientAfter = performance.now();
      const imagePrepTime = response?.clientTimings?.imagePrepMs ?? 0;
      const netTime = response?.clientTimings?.networkMs ?? Math.round(tClientAfter - tScanStart);
      const geminiServerTime = response?.serverTimings?.geminiRequestMs ?? 'N/A';
      const jsonParseServerTime = response?.serverTimings?.jsonParseMs ?? 'N/A';

      console.log(`Image preparation: +${imagePrepTime}ms`);
      console.log(`Gemini request started: +${imagePrepTime}ms`);
      console.log(`Gemini response received: +${imagePrepTime + netTime}ms (Server Gemini API: ${geminiServerTime}ms)`);
      console.log(`JSON parsing: (Server JSON Parse: ${jsonParseServerTime}ms)`);

      if (response?.rawResponse) {
        setRawGeminiOutput(response.rawResponse);
      }

      if (response?.error) {
        haptics.error();
        setScanError(response.error);
        setIsProcessing(false);
        scanLockRef.current = false;
        return;
      }

      const ingredientNames = Array.isArray(response?.ingredients)
        ? response.ingredients.map((ing) => ing.name).filter((name) => Boolean(name) && name.trim().length > 0)
        : [];

      if (ingredientNames.length === 0) {
        haptics.error();
        setScanError("I couldn't confidently identify the ingredients in this image. Try taking a clearer photo.");
        setIsProcessing(false);
        scanLockRef.current = false;
        return;
      }

      const tDisplayed = performance.now();
      console.log(`Ingredients displayed: +${(tDisplayed - tScanStart).toFixed(1)}ms`);

      // Immediately transition to display detected ingredients without blocking
      haptics.success();
      onScanComplete(ingredientNames, capturedImage);
    } catch (err: any) {
      console.error('Scan recognition error:', err);
      haptics.error();
      setScanError("I couldn't confidently identify the ingredients in this image. Try taking a clearer photo.");
    } finally {
      setIsProcessing(false);
      scanLockRef.current = false;
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setFileMeta(null);
    setScanError(null);
    setRawGeminiOutput(null);
    setStage1Passed(false);
    setStage1Message(null);
    setStage2Passed(false);
    setStage2RawOutput(null);
    setStage2Error(null);
    setStage3Passed(false);
    setStage3Ingredients(null);
    setStage3Error(null);
    setStage4Passed(false);
    setStage4MatchCount(null);
    setStage4Error(null);
    setStage5Passed(false);
    setStage5Message(null);
    setStage5Error(null);
    stopCamera();
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-4 pb-20 max-w-md mx-auto w-full box-border">
      {/* Hidden file input for gallery/album picker - permanently mounted */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="Upload photo from gallery"
      />

      {/* Header with Exact Editorial Typography */}
      <header className="mb-5">
        {isQuickCooking ? (
          <>
            <h1 className="font-serif-editorial text-[38px] leading-[1.1] font-normal text-[#153B28] dark:text-[#FAF4E8] tracking-tight">
              Let's see what <br />
              you can <br />
              make.
            </h1>
            <p className="mt-3.5 text-[13.5px] leading-relaxed text-[#153B28]/80 dark:text-[#B6CEBC] font-normal">
              Scan the ingredients you have and we'll find the best matches.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-serif-editorial text-[38px] leading-[1.1] font-normal text-[#153B28] dark:text-[#FAF4E8] tracking-tight">
              Snap what <br />
              you <br />
              already have.
            </h1>
            <p className="mt-3.5 text-[13.5px] leading-relaxed text-[#153B28]/80 dark:text-[#B6CEBC] font-normal">
              Point your camera at the fridge, a shelf or the counter. We read the ingredients, you confirm them, then swipe through recipes built around them.
            </p>
          </>
        )}
      </header>

      {/* Main Camera Area */}
      <div className="flex-1 flex flex-col justify-center my-2">
        {!isCapturing && !capturedImage && (
          <div
            onClick={triggerCamera}
            className="w-full min-h-[290px] rounded-3xl bg-[#FAF5EC] dark:bg-[#183024] border-2 border-[#153B28]/15 dark:border-[#DCE9DA]/20 hover:border-[#153B28]/30 dark:hover:border-[#DCE9DA]/40 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all active-press shadow-xs relative overflow-hidden group"
          >
            {/* Dotted pattern background layer - strictly clipped with soft blur */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-dotted-pattern opacity-30 dark:opacity-10 blur-[0.8px] pointer-events-none rounded-3xl overflow-hidden"
            />

            {/* Radial legibility gradient behind text */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,245,236,0.92)_25%,rgba(250,245,236,0.5)_70%,transparent_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(24,48,36,0.92)_25%,rgba(24,48,36,0.5)_70%,transparent_100%)] pointer-events-none"
            />

            {/* Text & Action Content placed above dots */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {/* Camera icon button */}
              <div className="w-16 h-16 rounded-full bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform shrink-0">
                <CameraIcon className="w-8 h-8 stroke-[1.75]" />
              </div>

              {/* Title */}
              <p className="font-serif-editorial text-xl text-[#153B28] dark:text-[#FAF4E8] font-medium mb-1.5 leading-snug">
                Tap to open camera
              </p>

              {/* Small secondary guidance text */}
              <p className="text-xs text-[#153B28]/75 dark:text-[#B6CEBC] max-w-[240px] leading-relaxed font-normal mb-5">
                Good light, door wide open, nothing hiding behind the milk.
              </p>

              {/* Or upload photo button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerGalleryPicker();
                }}
                className="flex items-center gap-2 text-xs font-semibold text-[#153B28] dark:text-[#FAF4E8] bg-[#EFE8D8] dark:bg-[#1F3C2E] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 px-4 py-2 rounded-full hover:bg-[#E2DAC8] dark:hover:bg-[#284E3C] transition-colors shadow-2xs active-press"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Or upload photo</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Camera Stream View */}
        {isCapturing && !capturedImage && (
          <div className="w-full aspect-[4/3] rounded-3xl bg-black relative overflow-hidden flex flex-col items-center justify-center shadow-md">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 inset-x-0 flex flex-wrap justify-center gap-2.5 px-4">
              <button
                type="button"
                onClick={captureWebPhoto}
                className="bg-[#153B28] text-[#F8F0E2] font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg active-press text-xs"
              >
                <CameraIcon className="w-4 h-4" />
                <span>Take Photo</span>
              </button>
              <button
                type="button"
                onClick={triggerGalleryPicker}
                className="bg-white/90 text-gray-800 font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-1.5 active-press text-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Gallery</span>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="bg-black/60 text-white font-semibold px-4 py-2.5 rounded-full shadow-lg active-press text-xs backdrop-blur-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Captured Image Preview & Step-by-Step Diagnostic Controls */}
        {capturedImage && (
          <div className="w-full rounded-3xl bg-[#EFE8D8] dark:bg-[#183024] p-3.5 border border-[#153B28]/15 dark:border-[#DCE9DA]/15 shadow-sm space-y-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black">
              <img src={capturedImage} alt="Captured fridge" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              {(isProcessing || stage2Running) && (
                <div className="absolute inset-0 bg-[#153B28]/85 backdrop-blur-xs flex flex-col items-center justify-center text-[#F8F0E2] p-4 text-center">
                  <Sparkles className="w-10 h-10 text-[#DCE9DA] animate-spin mb-3" />
                  <p className="font-serif-editorial text-xl font-medium">Analyzing photo with Gemini...</p>
                  <p className="text-xs text-[#DCE9DA]/80 mt-1">Executing AI ingredient recognition</p>
                </div>
              )}
            </div>

            {/* Image File Metadata & Debug Inspector Display */}
            {fileMeta && (
              <div className="bg-[#FAF5EC] dark:bg-[#1F3C2E] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-2xl p-3 text-xs space-y-2">
                <p className="font-bold text-[#153B28] dark:text-[#FAF4E8] flex items-center justify-between border-b border-[#153B28]/10 dark:border-[#DCE9DA]/10 pb-1">
                  <span>Image & Pipeline Specifications</span>
                  <span className="text-[10px] bg-[#153B28]/10 dark:bg-white/10 text-[#153B28] dark:text-[#A7F3D0] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                    Debug Inspector
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[#153B28]/85 dark:text-[#FAF4E8]/90 font-mono text-[11px]">
                  <div><span className="font-semibold text-[#153B28] dark:text-[#FAF4E8]">Filename:</span> {fileMeta.filename}</div>
                  <div><span className="font-semibold text-[#153B28] dark:text-[#FAF4E8]">MIME:</span> {fileMeta.mimeType}</div>
                  <div><span className="font-semibold text-[#153B28] dark:text-[#FAF4E8]">File Size:</span> {fileMeta.fileSize}</div>
                  <div>
                    <span className="font-semibold text-[#153B28] dark:text-[#FAF4E8]">Dimensions:</span>{' '}
                    {fileMeta.width && fileMeta.height ? `${fileMeta.width} x ${fileMeta.height} px` : 'Measuring...'}
                  </div>
                  <div>
                    <span className="font-semibold text-[#153B28] dark:text-[#FAF4E8]">Source:</span>{' '}
                    {fileMeta.sourceType === 'newly_captured' ? 'Newly Captured Photo' : 'Uploaded File'}
                  </div>
                  <div>
                    <span className="font-semibold text-[#153B28] dark:text-[#FAF4E8]">Gemini Payload:</span> 2 parts (1 image + 1 prompt)
                  </div>
                </div>

                <div className="border-t border-[#153B28]/10 dark:border-[#DCE9DA]/10 pt-2 space-y-1">
                  <p className="font-semibold text-[11px] text-[#153B28] dark:text-[#FAF4E8]">Raw Gemini Response:</p>
                  <pre className="whitespace-pre-wrap font-mono text-[10px] text-amber-200 bg-[#153B28] dark:bg-[#12221A] p-2.5 rounded-xl max-h-36 overflow-y-auto">
                    {rawGeminiOutput || stage2RawOutput || '(Scan image or click Test Gemini to inspect raw AI output)'}
                  </pre>
                </div>
              </div>
            )}

            {/* Step-by-Step Isolation Diagnostic Panel */}
            <div className="bg-[#153B28] dark:bg-[#12221A] text-[#F8F0E2] p-3.5 rounded-2xl space-y-2.5 border border-white/5">
              <div className="flex items-center justify-between border-b border-white/15 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Pipeline Diagnostics</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearDiagnostics}
                    className="text-[10px] text-white/75 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-full active-press transition-colors"
                  >
                    Clear Diagnostics
                  </button>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-amber-200 font-mono">
                    Stage Isolation
                  </span>
                </div>
              </div>

              {/* Stage 1: Test Image Button */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">Stage 1: Image Load & Render</span>
                  <button
                    type="button"
                    onClick={runStage1Test}
                    className="px-3 py-1 rounded-xl bg-amber-400 text-[#153B28] font-bold text-xs hover:bg-amber-300 active-press"
                  >
                    Test Image
                  </button>
                </div>
                {stage1Message && (
                  <p className={`text-[11px] p-2 rounded-xl flex items-start gap-1.5 leading-tight ${stage1Passed ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/30' : 'bg-red-950/80 text-red-200 border border-red-500/30'}`}>
                    {stage1Passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />}
                    <span>{stage1Message}</span>
                  </p>
                )}
              </div>

              {/* Stage 2: Test Gemini API */}
              <div className="space-y-2 border-t border-white/10 pt-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">Stage 2: Gemini API Call</span>
                  <button
                    type="button"
                    disabled={stage2Running}
                    onClick={runStage2Test}
                    className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs active-press border border-white/20 disabled:opacity-50"
                  >
                    {stage2Running ? 'Testing...' : 'Test Gemini'}
                  </button>
                </div>

                {/* Step Logs */}
                {stage2StepLogs.length > 0 && (
                  <div className="bg-black/30 p-2 rounded-xl text-[10px] font-mono text-amber-200/90 space-y-0.5 max-h-24 overflow-y-auto border border-white/10">
                    {stage2StepLogs.map((log, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span className="text-amber-400">›</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* GEMINI TEST PASSED */}
                {stage2Passed && stage2RawOutput && (
                  <div className="bg-emerald-950/80 text-emerald-200 p-2.5 rounded-xl border border-emerald-500/30 text-xs space-y-1.5 font-mono">
                    <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>GEMINI TEST PASSED</span>
                    </p>
                    <div className="border-t border-emerald-500/20 pt-1.5">
                      <p className="text-[10px] text-emerald-300 font-sans font-semibold mb-1">Raw Gemini Response:</p>
                      <pre className="whitespace-pre-wrap text-[10px] text-amber-200 bg-black/40 p-2 rounded-lg max-h-36 overflow-y-auto font-mono">
                        {stage2RawOutput}
                      </pre>
                    </div>
                  </div>
                )}

                {/* GEMINI TEST FAILED */}
                {stage2Failure && (
                  <div className="bg-red-950/90 text-red-200 p-2.5 rounded-xl border border-red-500/40 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-red-400 font-bold tracking-wide">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>GEMINI TEST FAILED</span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg space-y-1.5 text-[11px] font-mono border border-red-500/20">
                      <div>
                        <span className="text-red-400 font-bold uppercase text-[10px] block">Stage:</span>
                        <span className="text-amber-200">{stage2Failure.stage}</span>
                      </div>
                      <div>
                        <span className="text-red-400 font-bold uppercase text-[10px] block">Error:</span>
                        <span className="text-red-300 font-semibold">{stage2Failure.errorName}</span>
                      </div>
                      <div>
                        <span className="text-red-400 font-bold uppercase text-[10px] block">Message:</span>
                        <span className="text-white/90 whitespace-pre-wrap">{stage2Failure.errorMessage}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stage 3: Ingredient Parser */}
              <div className="space-y-1 border-t border-white/10 pt-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">Stage 3: Ingredient Parser</span>
                  <button
                    type="button"
                    onClick={runStage3Test}
                    className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs active-press border border-white/20"
                  >
                    Test Parser
                  </button>
                </div>
                {stage3Ingredients && (
                  <div className="bg-emerald-950/80 text-emerald-200 p-2 rounded-xl border border-emerald-500/30 text-[11px] space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Stage 3 PASS ({stage3Ingredients.length} ingredients parsed):</span>
                    </p>
                    <p className="font-mono text-[10px] text-emerald-300">{stage3Ingredients.join(', ')}</p>
                  </div>
                )}
                {stage3Error && (
                  <p className="text-[11px] p-2 rounded-xl bg-red-950/80 text-red-200 border border-red-500/30 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{stage3Error}</span>
                  </p>
                )}
              </div>

              {/* Stage 4: Recipe Matcher */}
              <div className="space-y-1 border-t border-white/10 pt-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">Stage 4: Recipe Matcher</span>
                  <button
                    type="button"
                    onClick={runStage4Test}
                    className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs active-press border border-white/20"
                  >
                    Test Matcher
                  </button>
                </div>
                {stage4MatchCount !== null && (
                  <p className="text-[11px] p-2 rounded-xl bg-emerald-950/80 text-emerald-200 border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Stage 4 PASS: Matched {stage4MatchCount} recipes from pantry dataset.</span>
                  </p>
                )}
                {stage4Error && (
                  <p className="text-[11px] p-2 rounded-xl bg-red-950/80 text-red-200 border border-red-500/30 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{stage4Error}</span>
                  </p>
                )}
              </div>

              {/* Stage 5: Firestore Scan History */}
              <div className="space-y-1 border-t border-white/10 pt-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">Stage 5: Firestore History Write</span>
                  <button
                    type="button"
                    disabled={stage5Running}
                    onClick={runStage5Test}
                    className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs active-press border border-white/20"
                  >
                    {stage5Running ? 'Writing...' : 'Test Firestore'}
                  </button>
                </div>
                {stage5Message && (
                  <p className="text-[11px] p-2 rounded-xl bg-emerald-950/80 text-emerald-200 border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{stage5Message}</span>
                  </p>
                )}
                {stage5Error && (
                  <p className="text-[11px] p-2 rounded-xl bg-red-950/80 text-red-200 border border-red-500/30 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{stage5Error}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center justify-between gap-2.5 px-1 pt-1">
              <button
                type="button"
                disabled={isProcessing}
                onClick={resetCapture}
                className="py-3 px-3.5 rounded-2xl border border-[#153B28]/20 dark:border-[#DCE9DA]/20 bg-[#F8F0E2] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#FAF4E8] font-semibold text-xs flex items-center justify-center gap-1.5 active-press hover:bg-[#EFE8D8] dark:hover:bg-[#284E3C] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={triggerGalleryPicker}
                className="py-3 px-3.5 rounded-2xl border border-[#153B28]/20 dark:border-[#DCE9DA]/20 bg-[#FAF5EC] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#FAF4E8] font-semibold text-xs flex items-center justify-center gap-1.5 active-press hover:bg-[#EFE8D8] dark:hover:bg-[#284E3C] transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Gallery</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmAndProcess}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold text-xs flex items-center justify-center gap-2 shadow-md active-press hover:bg-[#1C4A33] dark:hover:bg-[#347A55] transition-colors"
              >
                <span>Confirm & Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Scan / Camera Notice or Error Alert Banner */}
        {scanError && (
          <div className="mt-4 p-4 bg-[#FAF5EC] dark:bg-[#183024] border-2 border-[#E05345]/30 rounded-2xl flex flex-col gap-3 text-xs text-[#153B28] dark:text-[#FAF4E8] shadow-md">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#E05345] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-[#E05345] dark:text-[#FF6B5C] mb-0.5 text-sm">Scan Alert</p>
                <p className="text-[#153B28]/90 dark:text-[#FAF4E8]/90 font-medium leading-relaxed">{scanError}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#153B28]/10 dark:border-[#DCE9DA]/10">
              <button
                type="button"
                onClick={handleConfirmAndProcess}
                className="px-3.5 py-2 rounded-xl bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold text-xs flex items-center gap-1.5 shadow-2xs hover:bg-[#1C4A33] dark:hover:bg-[#347A55] active-press transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Scan</span>
              </button>

              <button
                type="button"
                onClick={onManualSearchClick}
                className="px-3 py-2 rounded-xl bg-[#EFE8D8] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#FAF4E8] font-semibold text-xs hover:bg-[#E2DAC8] dark:hover:bg-[#284E3C] active-press transition-colors"
              >
                Search Manually
              </button>

              <button
                type="button"
                onClick={triggerGalleryPicker}
                className="px-3 py-2 text-xs font-semibold text-[#153B28] dark:text-[#A7F3D0] underline underline-offset-2"
              >
                Upload Photo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Search Alternative Link */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onManualSearchClick}
          className="text-xs font-semibold text-[#153B28]/80 dark:text-[#A7F3D0] hover:text-[#153B28] dark:hover:text-emerald-300 underline underline-offset-4 py-2"
        >
          Or search ingredients manually without camera →
        </button>
      </div>
    </div>
  );
};

