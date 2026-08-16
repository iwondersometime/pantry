import { FirebaseService } from './FirebaseService';
import { User, AuthState } from '../types';

type AuthListener = (user: User | null, state: AuthState) => void;

class AuthServiceClass {
  public async signUp(name: string, email: string, password: string): Promise<User> {
    return FirebaseService.signUp(name, email, password);
  }

  public async login(email: string, password: string): Promise<User> {
    return FirebaseService.login(email, password);
  }

  public async loginWithGoogle(): Promise<User> {
    return FirebaseService.loginWithGoogle();
  }

  public async requestPasswordReset(email: string): Promise<void> {
    return FirebaseService.requestPasswordReset(email);
  }

  public async updateProfile(name: string): Promise<User> {
    return FirebaseService.updateProfile(name);
  }

  public async updateUserAllergies(allergies: string[]): Promise<User> {
    return FirebaseService.updateUserAllergies(allergies);
  }

  public async completeOnboarding(
    userId: string,
    allergies: string[],
    theme: string,
    cookingPreference: string
  ): Promise<void> {
    return FirebaseService.completeOnboarding(userId, allergies, theme, cookingPreference);
  }

  public async updateProfilePhoto(customPhotoURL: string): Promise<User> {
    return FirebaseService.updateProfilePhoto(customPhotoURL);
  }

  public async resetToGooglePhoto(): Promise<User> {
    return FirebaseService.resetToGooglePhoto();
  }

  public async logout(): Promise<void> {
    return FirebaseService.logout();
  }

  public async deleteAccount(): Promise<void> {
    return FirebaseService.deleteAccount();
  }

  public onAuthStateChanged(callback: AuthListener): () => void {
    return FirebaseService.onAuthChange(callback);
  }
}

export const AuthService = new AuthServiceClass();
