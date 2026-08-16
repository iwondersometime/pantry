import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  deleteUser as firebaseDeleteUser,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, SavedRecipeItem, ScanHistoryItem, Recipe, AuthState } from '../types';

export { firebaseConfig };

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    try {
      db = initializeFirestore(
        app,
        {
          experimentalAutoDetectLongPolling: true,
        },
        firebaseConfig.firestoreDatabaseId || undefined
      );
    } catch {
      db = firebaseConfig.firestoreDatabaseId
        ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
        : getFirestore(app);
    }

    if (db) {
      (async () => {
        try {
          await getDocFromServer(doc(db, 'test', 'connection'));
        } catch (error: any) {
          if (
            error instanceof Error &&
            (error.message.includes('the client is offline') ||
              error.message.includes('unavailable') ||
              (error as any).code === 'unavailable')
          ) {
            // Gracefully acknowledge offline / long-polling negotiation without noisy console breaks
          }
        }
      })();
    }
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Format raw Firebase Auth errors into clear, friendly messages
 */
export function formatAuthError(err: any): string {
  if (!err) return 'An unexpected error occurred.';
  const code = typeof err === 'string' ? err : err.code || err.message || '';

  if (code.includes('auth/popup-closed-by-user')) {
    return 'Sign-in was cancelled (popup closed before completing).';
  }
  if (code.includes('auth/popup-blocked')) {
    return 'Sign-in pop-up was blocked by your browser. Please allow pop-ups for this site and try again.';
  }
  if (code.includes('auth/unauthorized-domain')) {
    return 'This domain is not authorized for Google Sign-In in Firebase Console. Please add this domain under Firebase Authentication > Settings > Authorized domains.';
  }
  if (code.includes('auth/account-exists-with-different-credential')) {
    return 'An account already exists with the same email address using a different sign-in method.';
  }
  if (code.includes('auth/network-request-failed')) {
    return 'Network request failed. Please check your internet connection.';
  }
  if (
    code.includes('auth/user-not-found') ||
    code.includes('auth/wrong-password') ||
    code.includes('auth/invalid-credential')
  ) {
    return 'Invalid email or password.';
  }
  if (code.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Please log in instead.';
  }
  if (code.includes('auth/weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code.includes('auth/requires-recent-login')) {
    return 'For security reasons, please log out and log back in before deleting your account.';
  }
  if (code.includes('auth/too-many-requests')) {
    return 'Too many unsuccessful attempts. Access disabled temporarily. Please try again later or reset your password.';
  }

  return err.message || 'Authentication failed. Please try again.';
}

export class FirebaseService {
  static getCurrentUser(): FirebaseUser | null {
    return auth?.currentUser || null;
  }

  /**
   * Listen to Firebase auth state changes (Single source of truth)
   */
  static onAuthChange(callback: (user: User | null, state: AuthState) => void): () => void {
    if (!auth) {
      callback(null, 'unauthenticated');
      return () => {};
    }

    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // Extract Google / Provider photo URL if available
        const googlePhotoURL =
          fbUser.photoURL ||
          fbUser.providerData.find((p) => p.photoURL)?.photoURL ||
          null;

        const user: User = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Gourmet Chef',
          email: fbUser.email || '',
          googlePhotoURL,
          customPhotoURL: null,
          photoSource: googlePhotoURL ? 'google' : 'fallback',
          createdAt: fbUser.metadata.creationTime
            ? new Date(fbUser.metadata.creationTime).getTime()
            : Date.now(),
        };

        // Ensure user document exists in Firestore under users/{uid} and read custom profile picture
        if (db) {
          try {
            const userRef = doc(db, 'users', fbUser.uid);
            const snap = await getDoc(userRef);
            if (!snap.exists()) {
              await setDoc(userRef, {
                name: user.name,
                email: user.email,
                googlePhotoURL: user.googlePhotoURL || null,
                customPhotoURL: null,
                photoSource: user.photoSource,
                onboardingCompleted: false,
                createdAt: user.createdAt,
                updatedAt: Date.now(),
              });
              user.onboardingCompleted = false;
            } else {
              const existing = snap.data();
              if (existing.name) {
                user.name = existing.name;
              }
              if (Array.isArray(existing.allergies)) {
                user.allergies = existing.allergies;
              }
              user.onboardingCompleted = existing.onboardingCompleted === true;
              if (existing.theme) {
                user.theme = existing.theme;
              }
              if (existing.cookingPreference) {
                user.cookingPreference = existing.cookingPreference;
              }
              if (existing.recipeIntent) {
                user.recipeIntent = existing.recipeIntent;
              }
              // Respect existing custom photo if user has uploaded one
              if (existing.customPhotoURL && (existing.photoSource === 'custom' || !existing.photoSource)) {
                user.customPhotoURL = existing.customPhotoURL;
                user.photoSource = 'custom';
              } else if (existing.photoSource === 'google') {
                user.customPhotoURL = null;
                user.photoSource = googlePhotoURL ? 'google' : 'fallback';
              }

              // Update Google photo & email without wiping customPhotoURL
              await setDoc(
                userRef,
                {
                  email: user.email,
                  googlePhotoURL: googlePhotoURL || existing.googlePhotoURL || null,
                  updatedAt: Date.now(),
                },
                { merge: true }
              );
            }
          } catch (e) {
            console.warn('Firestore user doc sync notice:', e);
          }
        }

        callback(user, 'authenticated');
      } else {
        callback(null, 'unauthenticated');
      }
    });
  }

  /**
   * Register new user with Firebase Auth (createUserWithEmailAndPassword)
   */
  static async signUp(name: string, email: string, password: string): Promise<User> {
    if (!auth) {
      throw new Error('Firebase Authentication is not initialized.');
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = credential.user;

      await firebaseUpdateProfile(fbUser, { displayName: name.trim() });

      const now = Date.now();
      const user: User = {
        id: fbUser.uid,
        name: name.trim(),
        email: fbUser.email || email.trim(),
        createdAt: now,
      };

      if (db) {
        await setDoc(doc(db, 'users', fbUser.uid), {
          name: user.name,
          email: user.email,
          createdAt: now,
          updatedAt: now,
        });
      }

      return user;
    } catch (err: any) {
      throw new Error(formatAuthError(err));
    }
  }

  /**
   * Log in user with Firebase Auth (signInWithEmailAndPassword)
   */
  static async login(email: string, password: string): Promise<User> {
    if (!auth) {
      throw new Error('Firebase Authentication is not initialized.');
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = credential.user;

      const user: User = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Gourmet Chef',
        email: fbUser.email || email.trim(),
        createdAt: fbUser.metadata.creationTime
          ? new Date(fbUser.metadata.creationTime).getTime()
          : Date.now(),
      };

      if (db) {
        await setDoc(
          doc(db, 'users', fbUser.uid),
          {
            name: user.name,
            email: user.email,
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      }

      return user;
    } catch (err: any) {
      throw new Error(formatAuthError(err));
    }
  }

  /**
   * Real Google Authentication via Firebase GoogleAuthProvider & signInWithPopup
   */
  static async loginWithGoogle(): Promise<User> {
    if (!auth) {
      throw new Error('Firebase Authentication is not initialized.');
    }

    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const fbUser = credential.user;

      const user: User = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Gourmet Chef',
        email: fbUser.email || '',
        createdAt: fbUser.metadata.creationTime
          ? new Date(fbUser.metadata.creationTime).getTime()
          : Date.now(),
      };

      if (db) {
        await setDoc(
          doc(db, 'users', fbUser.uid),
          {
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      }

      return user;
    } catch (err: any) {
      throw new Error(formatAuthError(err));
    }
  }

  /**
   * Request password reset email via Firebase Auth (sendPasswordResetEmail)
   */
  static async requestPasswordReset(email: string): Promise<void> {
    if (!auth) {
      throw new Error('Firebase Authentication is not initialized.');
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      throw new Error(formatAuthError(err));
    }
  }

  /**
   * Update Profile Name in Firebase Auth & Firestore
   */
  static async updateProfile(name: string): Promise<User> {
    if (!auth || !auth.currentUser) {
      throw new Error('No authenticated user found.');
    }

    try {
      const fbUser = auth.currentUser;
      const trimmedName = name.trim();
      await firebaseUpdateProfile(fbUser, { displayName: trimmedName });

      let currentDocData: Record<string, any> = {};
      if (db) {
        const userRef = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          currentDocData = snap.data();
        }
        await setDoc(
          userRef,
          { name: trimmedName, updatedAt: Date.now() },
          { merge: true }
        );
      }

      const googlePhotoURL =
        fbUser.photoURL ||
        fbUser.providerData.find((p) => p.photoURL)?.photoURL ||
        currentDocData.googlePhotoURL ||
        null;
      const customPhotoURL = currentDocData.customPhotoURL || null;
      const photoSource = (customPhotoURL && (currentDocData.photoSource === 'custom' || !currentDocData.photoSource))
        ? 'custom'
        : googlePhotoURL
        ? 'google'
        : 'fallback';

      return {
        id: fbUser.uid,
        name: trimmedName,
        email: fbUser.email || '',
        googlePhotoURL,
        customPhotoURL,
        photoSource,
        createdAt: fbUser.metadata.creationTime
          ? new Date(fbUser.metadata.creationTime).getTime()
          : Date.now(),
      };
    } catch (err: any) {
      throw new Error(formatAuthError(err));
    }
  }

  /**
   * Update User Allergies in Firestore
   */
  static async updateUserAllergies(allergies: string[]): Promise<User> {
    if (!auth || !auth.currentUser) {
      throw new Error('No authenticated user found.');
    }

    try {
      const fbUser = auth.currentUser;
      let currentDocData: Record<string, any> = {};

      if (db) {
        const userRef = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          currentDocData = snap.data();
        }
        await setDoc(
          userRef,
          { allergies, updatedAt: Date.now() },
          { merge: true }
        );
      }

      const googlePhotoURL =
        fbUser.photoURL ||
        fbUser.providerData.find((p) => p.photoURL)?.photoURL ||
        currentDocData.googlePhotoURL ||
        null;
      const customPhotoURL = currentDocData.customPhotoURL || null;
      const photoSource = (customPhotoURL && (currentDocData.photoSource === 'custom' || !currentDocData.photoSource))
        ? 'custom'
        : googlePhotoURL
        ? 'google'
        : 'fallback';

      return {
        id: fbUser.uid,
        name: fbUser.displayName || currentDocData.name || 'Gourmet Chef',
        email: fbUser.email || '',
        allergies,
        googlePhotoURL,
        customPhotoURL,
        photoSource,
        createdAt: fbUser.metadata.creationTime
          ? new Date(fbUser.metadata.creationTime).getTime()
          : Date.now(),
      };
    } catch (err: any) {
      throw new Error(formatAuthError(err));
    }
  }

  /**
   * Complete onboarding and save preferences in Firestore
   */
  static async completeOnboarding(
    userId: string,
    allergies: string[],
    theme: string,
    cookingPreference: string
  ): Promise<void> {
    if (!db) return;
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(
        userRef,
        {
          onboardingCompleted: true,
          allergies,
          theme,
          cookingPreference,
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Error completing onboarding in Firestore:', err);
      throw err;
    }
  }

  /**
   * Update User Recipe Intent in Firestore
   */
  static async updateRecipeIntent(userId: string, recipeIntent: string): Promise<void> {
    if (!db) return;
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(
        userRef,
        {
          recipeIntent,
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Error saving recipeIntent in Firestore:', err);
    }
  }

  /**
   * Update Custom Profile Photo in Firestore and Firebase Auth
   */
  static async updateProfilePhoto(customPhotoURL: string): Promise<User> {
    if (!auth || !auth.currentUser) {
      throw new Error('No authenticated user found.');
    }

    try {
      const fbUser = auth.currentUser;
      const googlePhotoURL =
        fbUser.providerData.find((p) => p.photoURL)?.photoURL ||
        fbUser.photoURL ||
        null;

      if (db) {
        await setDoc(
          doc(db, 'users', fbUser.uid),
          {
            customPhotoURL,
            photoSource: 'custom',
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      }

      return {
        id: fbUser.uid,
        name: fbUser.displayName || 'Gourmet Chef',
        email: fbUser.email || '',
        googlePhotoURL,
        customPhotoURL,
        photoSource: 'custom',
        createdAt: fbUser.metadata.creationTime
          ? new Date(fbUser.metadata.creationTime).getTime()
          : Date.now(),
      };
    } catch (err: any) {
      throw new Error(formatAuthError(err));
    }
  }

  /**
   * Reset profile picture to Google profile photo (clears custom photo)
   */
  static async resetToGooglePhoto(): Promise<User> {
    if (!auth || !auth.currentUser) {
      throw new Error('No authenticated user found.');
    }

    try {
      const fbUser = auth.currentUser;
      const googlePhotoURL =
        fbUser.providerData.find((p) => p.photoURL)?.photoURL ||
        fbUser.photoURL ||
        null;

      if (db) {
        await setDoc(
          doc(db, 'users', fbUser.uid),
          {
            customPhotoURL: null,
            photoSource: 'google',
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      }

      return {
        id: fbUser.uid,
        name: fbUser.displayName || 'Gourmet Chef',
        email: fbUser.email || '',
        googlePhotoURL,
        customPhotoURL: null,
        photoSource: googlePhotoURL ? 'google' : 'fallback',
        createdAt: fbUser.metadata.creationTime
          ? new Date(fbUser.metadata.creationTime).getTime()
          : Date.now(),
      };
    } catch (err: any) {
      throw new Error(formatAuthError(err));
    }
  }

  /**
   * Delete account in Firebase Auth & user Firestore data
   */
  static async deleteAccount(): Promise<void> {
    if (!auth || !auth.currentUser) {
      throw new Error('No authenticated user.');
    }

    const uid = auth.currentUser.uid;

    try {
      // Clean up Firestore documents under users/{uid}/...
      if (db) {
        try {
          const savedSnap = await getDocs(collection(db, 'users', uid, 'savedRecipes'));
          for (const d of savedSnap.docs) {
            await deleteDoc(d.ref);
          }

          const historySnap = await getDocs(collection(db, 'users', uid, 'scanHistory'));
          for (const d of historySnap.docs) {
            await deleteDoc(d.ref);
          }

          await deleteDoc(doc(db, 'users', uid));
        } catch (e) {
          console.warn('Notice deleting Firestore documents:', e);
        }
      }

      // Delete Firebase Auth user
      await firebaseDeleteUser(auth.currentUser);
    } catch (err: any) {
      throw new Error(formatAuthError(err));
    }
  }

  /**
   * Logout from Firebase
   */
  static async logout(): Promise<void> {
    if (auth) {
      await firebaseSignOut(auth);
    }
  }

  // --- FIRESTORE DATA ACCESS METHODS ---

  static async getSavedRecipes(uid: string): Promise<SavedRecipeItem[]> {
    if (!db) return [];
    try {
      const snap = await getDocs(collection(db, 'users', uid, 'savedRecipes'));
      return snap.docs.map((d) => d.data() as SavedRecipeItem);
    } catch (e) {
      console.warn('Error fetching Firestore saved recipes:', e);
      return [];
    }
  }

  static async saveRecipe(uid: string, recipe: Recipe): Promise<SavedRecipeItem[]> {
    if (!db) return [];
    try {
      const item: SavedRecipeItem = {
        id: `save_${recipe.id}`,
        recipeId: recipe.id,
        recipe,
        savedAt: Date.now(),
      };
      await setDoc(doc(db, 'users', uid, 'savedRecipes', recipe.id), item);
    } catch (e) {
      console.warn('Error saving recipe to Firestore:', e);
    }
    return this.getSavedRecipes(uid);
  }

  static async removeSavedRecipe(uid: string, recipeId: string): Promise<SavedRecipeItem[]> {
    if (!db) return [];
    try {
      await deleteDoc(doc(db, 'users', uid, 'savedRecipes', recipeId));
    } catch (e) {
      console.warn('Error removing saved recipe from Firestore:', e);
    }
    return this.getSavedRecipes(uid);
  }

  static async getScanHistory(uid: string): Promise<ScanHistoryItem[]> {
    if (!db) return [];
    try {
      const q = query(
        collection(db, 'users', uid, 'scanHistory'),
        orderBy('rawDate', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as ScanHistoryItem);
    } catch (e) {
      console.warn('Error fetching scan history from Firestore:', e);
      return [];
    }
  }

  static async addScanHistory(
    uid: string,
    ingredients: string[],
    matchCount: number,
    image?: string
  ): Promise<ScanHistoryItem[]> {
    if (!db) return [];
    try {
      const id = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date();
      const formattedDate =
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase() +
        `, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const item: Record<string, any> = {
        id,
        ingredients: Array.isArray(ingredients) ? ingredients : [],
        ideasCount: typeof matchCount === 'number' ? matchCount : 0,
        timestamp: formattedDate,
        rawDate: now.getTime(),
      };
      if (image && typeof image === 'string') {
        item.imageUrl = image;
      }
      await setDoc(doc(db, 'users', uid, 'scanHistory', id), item as ScanHistoryItem);
    } catch (e) {
      console.warn('Error adding scan history to Firestore:', e);
    }
    return this.getScanHistory(uid);
  }

  static async deleteScanHistoryItem(uid: string, historyId: string): Promise<ScanHistoryItem[]> {
    if (!db) return [];
    try {
      await deleteDoc(doc(db, 'users', uid, 'scanHistory', historyId));
    } catch (e) {
      console.warn('Error deleting scan history item from Firestore:', e);
    }
    return this.getScanHistory(uid);
  }

  // --- CLOUD RECIPE CACHING ---
  static async getCachedRecipes(uid: string): Promise<Recipe[]> {
    if (!db) return [];
    try {
      const snap = await getDocs(collection(db, 'users', uid, 'cachedRecipes'));
      return snap.docs.map((d) => d.data() as Recipe);
    } catch (e) {
      console.warn('Error fetching Firestore cached recipes:', e);
      return [];
    }
  }

  static async cacheRecipes(uid: string, recipes: Recipe[]): Promise<void> {
    if (!db) return;
    try {
      for (const recipe of recipes) {
        await setDoc(doc(db, 'users', uid, 'cachedRecipes', recipe.id), recipe);
      }
    } catch (e) {
      console.warn('Error caching recipes in Firestore:', e);
    }
  }
}
