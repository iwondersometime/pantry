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
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  Firestore,
} from 'firebase/firestore';
import { User, SavedRecipeItem, ScanHistoryItem, Recipe } from '../types';

// Check if Firebase configuration is available
const env = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

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
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization error:', err);
  }
}

export class FirebaseService {
  /**
   * Listen to Firebase auth state changes
   */
  static onAuthChange(callback: (user: User | null) => void): () => void {
    if (!auth) {
      callback(null);
      return () => {};
    }

    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const user: User = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Gourmet Chef',
          email: fbUser.email || '',
          createdAt: fbUser.metadata.creationTime
            ? new Date(fbUser.metadata.creationTime).getTime()
            : Date.now(),
        };
        // Ensure user document exists in Firestore
        if (db) {
          try {
            const userRef = doc(db, 'users', fbUser.uid);
            const snap = await getDoc(userRef);
            if (!snap.exists()) {
              await setDoc(userRef, {
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
              });
            }
          } catch (e) {
            console.warn('Firestore user doc sync error:', e);
          }
        }
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Register new user with Firebase Auth
   */
  static async signUp(name: string, email: string, password: string): Promise<User> {
    if (!auth) {
      throw new Error('Firebase Auth is not configured. Please check environment variables.');
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = credential.user;

    await firebaseUpdateProfile(fbUser, { displayName: name });

    const user: User = {
      id: fbUser.uid,
      name,
      email,
      createdAt: Date.now(),
    };

    if (db) {
      await setDoc(doc(db, 'users', fbUser.uid), {
        name,
        email,
        createdAt: user.createdAt,
      });
    }

    return user;
  }

  /**
   * Log in user with Firebase Auth
   */
  static async login(email: string, password: string): Promise<User> {
    if (!auth) {
      throw new Error('Firebase Auth is not configured. Please check environment variables.');
    }

    const credential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = credential.user;

    return {
      id: fbUser.uid,
      name: fbUser.displayName || 'Gourmet Chef',
      email: fbUser.email || email,
      createdAt: fbUser.metadata.creationTime
        ? new Date(fbUser.metadata.creationTime).getTime()
        : Date.now(),
    };
  }

  /**
   * Real Google Authentication via Firebase GoogleAuthProvider
   */
  static async loginWithGoogle(): Promise<User> {
    if (!auth) {
      throw new Error('Firebase Auth is not configured. Please check environment variables.');
    }

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
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    }

    return user;
  }

  /**
   * Request real password reset email via Firebase Auth
   */
  static async requestPasswordReset(email: string): Promise<void> {
    if (!auth) {
      throw new Error('Firebase Auth is not configured.');
    }
    await sendPasswordResetEmail(auth, email);
  }

  /**
   * Update Profile Name in Firebase
   */
  static async updateProfile(name: string): Promise<User> {
    if (!auth || !auth.currentUser) {
      throw new Error('No authenticated user found.');
    }

    const fbUser = auth.currentUser;
    await firebaseUpdateProfile(fbUser, { displayName: name });

    if (db) {
      await setDoc(
        doc(db, 'users', fbUser.uid),
        { name, updatedAt: Date.now() },
        { merge: true }
      );
    }

    return {
      id: fbUser.uid,
      name,
      email: fbUser.email || '',
      createdAt: fbUser.metadata.creationTime
        ? new Date(fbUser.metadata.creationTime).getTime()
        : Date.now(),
    };
  }

  /**
   * Delete account in Firebase Auth & Firestore data
   */
  static async deleteAccount(): Promise<void> {
    if (!auth || !auth.currentUser) {
      throw new Error('No authenticated user.');
    }

    const uid = auth.currentUser.uid;

    // Remove user doc and subcollections in Firestore
    if (db) {
      try {
        await deleteDoc(doc(db, 'users', uid));
      } catch (e) {
        console.warn('Error deleting Firestore user document:', e);
      }
    }

    // Delete user from Firebase Auth
    await firebaseDeleteUser(auth.currentUser);
  }

  /**
   * Logout from Firebase
   */
  static async logout(): Promise<void> {
    if (auth) {
      await firebaseSignOut(auth);
    }
  }

  // --- FIRESTORE USER DATA ACCESS METHODS ---

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
    const item: SavedRecipeItem = {
      id: `save_${recipe.id}`,
      recipeId: recipe.id,
      recipe,
      savedAt: Date.now(),
    };
    await setDoc(doc(db, 'users', uid, 'savedRecipes', recipe.id), item);
    return this.getSavedRecipes(uid);
  }

  static async removeSavedRecipe(uid: string, recipeId: string): Promise<SavedRecipeItem[]> {
    if (!db) return [];
    await deleteDoc(doc(db, 'users', uid, 'savedRecipes', recipeId));
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
    const id = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const formattedDate =
      now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase() +
      `, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const item: ScanHistoryItem = {
      id,
      ingredients,
      ideasCount: matchCount,
      imageUrl: image,
      timestamp: formattedDate,
      rawDate: now.getTime(),
    };
    await setDoc(doc(db, 'users', uid, 'scanHistory', id), item);
    return this.getScanHistory(uid);
  }

  static async deleteScanHistoryItem(uid: string, historyId: string): Promise<ScanHistoryItem[]> {
    if (!db) return [];
    await deleteDoc(doc(db, 'users', uid, 'scanHistory', historyId));
    return this.getScanHistory(uid);
  }
}
