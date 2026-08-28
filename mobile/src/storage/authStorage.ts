import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'devpulse_jwt_token';

export class AuthStorage {
  static async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  static async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  }

  static async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}
