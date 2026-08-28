import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

interface DashboardScreenProps {
  user: any;
  onLogout: () => void;
}

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  onLogout,
}) => {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: '1', title: 'Deploy backend to AWS EC2', completed: false },
    { id: '2', title: 'Review Prisma Database schema', completed: true },
    { id: '3', title: 'Connect Slack OAuth endpoint', completed: false },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [aiPrompt, setAiPrompt] = useState('Can you review the PR for the auth service?');
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now().toString(), title: newTaskTitle, completed: false },
    ]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const generateAiReply = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setAiReply(
        `Hi! Sure, I have analyzed the Auth Service changes. The JWT secret validation and bcrypt hashing look clean and ready to merge! 🚀`
      );
      setIsGenerating(false);
    }, 1000);
  };

  const uncompletedCount = tasks.filter((task) => !task.completed).length;
  const [alertBefore, alertAfter] = t('dashAlertBanner').split('{count}');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
      ]}
    >
      {/* HEADER BAR */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('dashWelcomeBack')}</Text>
          <Text style={styles.userName}>{user.name || 'Engineer'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <View style={styles.headerActions}>
          <LanguageSelector />
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>{t('dashSignOut')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ALERT BANNER */}
      {uncompletedCount > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>🔔</Text>
          <Text style={styles.alertText}>
            {alertBefore}
            <Text style={styles.alertHighlight}>{uncompletedCount}</Text>
            {alertAfter}
          </Text>
        </View>
      )}

      {/* GRID WIDGETS */}

      {/* WIDGET 1: WEATHER */}
      <View style={styles.widgetCard}>
        <View style={styles.widgetHeader}>
          <Text style={styles.widgetTitle}>🌤️ {t('dashWeatherTitle')}</Text>
          <Text style={styles.widgetBadge}>{t('dashLive')}</Text>
        </View>
        <View style={styles.weatherRow}>
          <Text style={styles.tempText}>24°C</Text>
          <View>
            <Text style={styles.weatherDesc}>Clear Sky / Pleasant</Text>
            <Text style={styles.weatherDetail}>Humidity: 55% | Wind: 8 km/h</Text>
          </View>
        </View>
      </View>

      {/* WIDGET 2: FOREX & RATES */}
      <View style={styles.widgetCard}>
        <View style={styles.widgetHeader}>
          <Text style={styles.widgetTitle}>💱 {t('dashForexTitle')}</Text>
        </View>
        <View style={styles.fxGrid}>
          <View style={styles.fxItem}>
            <Text style={styles.fxLabel}>USD / JPY</Text>
            <Text style={styles.fxValue}>¥154.20</Text>
          </View>
          <View style={styles.fxItem}>
            <Text style={styles.fxLabel}>EUR / JPY</Text>
            <Text style={styles.fxValue}>¥167.50</Text>
          </View>
        </View>
      </View>

      {/* WIDGET 3: TECH & AI NEWS */}
      <View style={styles.widgetCard}>
        <View style={styles.widgetHeader}>
          <Text style={styles.widgetTitle}>📰 {t('dashNewsTitle')}</Text>
        </View>
        <Text style={styles.newsItem}>• Node.js 22 LTS released with native WebSocket support</Text>
        <Text style={styles.newsItem}>• React Native 0.74 New Architecture enabled by default</Text>
        <Text style={styles.newsItem}>• AWS EC2 launches new Graviton4 instances for high efficiency</Text>
      </View>

      {/* WIDGET 4: TASK MANAGER */}
      <View style={styles.widgetCard}>
        <View style={styles.widgetHeader}>
          <Text style={styles.widgetTitle}>📝 {t('dashTaskManagerTitle')}</Text>
          <Text style={styles.taskCount}>{tasks.length} {t('dashTotal')}</Text>
        </View>

        <View style={styles.addTaskRow}>
          <TextInput
            style={styles.taskInput}
            placeholder={t('dashAddTaskPlaceholder')}
            placeholderTextColor="#64748b"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>{t('dashAddButton')}</Text>
          </TouchableOpacity>
        </View>

        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskRow}
            onPress={() => toggleTask(task.id)}
          >
            <Text style={styles.checkbox}>
              {task.completed ? '✅' : '⬜'}
            </Text>
            <Text
              style={[
                styles.taskText,
                task.completed && styles.taskCompleted,
              ]}
            >
              {task.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* WIDGET 5: AI SMART REPLY ASSISTANT */}
      <View style={styles.widgetCard}>
        <View style={styles.widgetHeader}>
          <Text style={styles.widgetTitle}>🤖 {t('dashAiAssistantTitle')}</Text>
          <Text style={styles.aiBadge}>{t('dashAiPowered')}</Text>
        </View>

        <Text style={styles.aiLabel}>{t('dashIncomingMessageLabel')}</Text>
        <TextInput
          style={styles.aiInput}
          multiline
          value={aiPrompt}
          onChangeText={setAiPrompt}
        />

        <TouchableOpacity
          style={styles.aiButton}
          onPress={generateAiReply}
          disabled={isGenerating}
        >
          <Text style={styles.aiButtonText}>
            {isGenerating ? t('dashGeneratingReply') : `✨ ${t('dashGenerateReply')}`}
          </Text>
        </TouchableOpacity>

        {aiReply && (
          <View style={styles.aiBox}>
            <Text style={styles.aiBoxTitle}>{t('dashSuggestedReply')}</Text>
            <Text style={styles.aiBoxText}>{aiReply}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  greeting: {
    color: '#94a3b8',
    fontSize: 12,
  },
  userName: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '800',
  },
  userEmail: {
    color: '#818cf8',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '600',
  },
  alertBanner: {
    backgroundColor: '#451a1a',
    borderColor: '#991b1b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  alertText: {
    color: '#fca5a5',
    fontSize: 13,
    flex: 1,
  },
  alertHighlight: {
    fontWeight: '800',
    color: '#ffffff',
  },
  widgetCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  widgetBadge: {
    backgroundColor: '#059669',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  taskCount: {
    color: '#94a3b8',
    fontSize: 12,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempText: {
    color: '#38bdf8',
    fontSize: 32,
    fontWeight: '800',
    marginRight: 16,
  },
  weatherDesc: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
  weatherDetail: {
    color: '#94a3b8',
    fontSize: 12,
  },
  fxGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fxItem: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  fxLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  fxValue: {
    color: '#34d399',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  newsItem: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 8,
  },
  addTaskRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  taskInput: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    color: '#f8fafc',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  checkbox: {
    fontSize: 16,
    marginRight: 10,
  },
  taskText: {
    color: '#f8fafc',
    fontSize: 14,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  aiBadge: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  aiLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 6,
  },
  aiInput: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    color: '#f8fafc',
    marginBottom: 12,
    minHeight: 60,
  },
  aiButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  aiBox: {
    marginTop: 12,
    backgroundColor: '#2e1065',
    borderColor: '#6d28d9',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  aiBoxTitle: {
    color: '#c4b5fd',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  aiBoxText: {
    color: '#f5f3ff',
    fontSize: 13,
  },
});
