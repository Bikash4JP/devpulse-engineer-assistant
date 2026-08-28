import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiService } from '../services/api';
import { AuthStorage } from '../storage/authStorage';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

interface AuthScreenProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isLoginMode) {
        // Login Flow
        const data = await ApiService.login(email, password);
        await AuthStorage.saveToken(data.token);
        onLoginSuccess(data.user, data.token);
      } else {
        // Register Flow
        if (!name.trim()) {
          throw new Error(t('authNameRequired'));
        }
        const data = await ApiService.register(name, email, password);
        await AuthStorage.saveToken(data.token);
        onLoginSuccess(data.user, data.token);
      }
    } catch (err: any) {
      setErrorMsg(err.message || t('authGenericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>DEVPULSE MOBILE</Text>
          <LanguageSelector />
        </View>
        <Text style={styles.title}>
          {isLoginMode ? t('authTitleLogin') : t('authTitleRegister')}
        </Text>
        <Text style={styles.subtitle}>
          {isLoginMode ? t('authSubtitleLogin') : t('authSubtitleRegister')}
        </Text>

        {errorMsg ? <Text style={styles.errorText}>⚠️ {errorMsg}</Text> : null}

        {!isLoginMode && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('authFullNameLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Bikas"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('authEmailLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('authPasswordLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#64748b"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>
              {isLoginMode ? t('authSignInButton') : t('authRegisterButton')}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleContainer}
          onPress={() => setIsLoginMode(!isLoginMode)}
        >
          <Text style={styles.toggleText}>
            {isLoginMode ? t('authNoAccount') : t('authHasAccount')}
            <Text style={styles.toggleHighlight}>
              {isLoginMode ? t('authSignUp') : t('authSignIn')}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 20,
  },
  errorText: {
    backgroundColor: '#451a1a',
    color: '#f87171',
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 12,
    color: '#f8fafc',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  toggleHighlight: {
    color: '#818cf8',
    fontWeight: '700',
  },
});
