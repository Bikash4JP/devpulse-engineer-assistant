import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthScreen } from './src/screens/AuthScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AuthStorage } from './src/storage/authStorage';
import { ApiService } from './src/services/api';
import { LanguageProvider, useLanguage } from './src/i18n/LanguageContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // App Initialization: Check for saved JWT token in phone locker
  useEffect(() => {
    const bootstrapApp = async () => {
      try {
        const storedToken = await AuthStorage.getToken();
        if (storedToken) {
          // Verify token against Express Backend API
          const profile = await ApiService.getProfile(storedToken);
          setCurrentUser(profile);
          setAuthToken(storedToken);
        }
      } catch (e) {
        console.log('Token bootstrap check completed (No valid session)');
        await AuthStorage.removeToken();
      } finally {
        setIsInitializing(false);
      }
    };

    bootstrapApp();
  }, []);

  const handleLoginSuccess = (user: any, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
  };

  const handleLogout = async () => {
    await AuthStorage.removeToken();
    setCurrentUser(null);
    setAuthToken(null);
  };

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>{t('appInitializing')}</Text>
        <StatusBar style="light" translucent />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent />
      {currentUser && authToken ? (
        <DashboardScreen user={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 14,
  },
});
