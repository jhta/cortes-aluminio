import { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTheme } from '@/src/hooks/useTheme';
import { historyStorage, type HistoryEntry } from '@/src/storage/history';
import { formatMeasure } from '@/src/utils/calculations';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryScreen() {
  const { colors } = useTheme();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      historyStorage.getAll().then(setEntries);
    }, []),
  );

  const handleDelete = (entry: HistoryEntry) => {
    Alert.alert(
      'Eliminar',
      `¿Eliminar "${entry.description}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await historyStorage.remove(entry.id);
            const updated = await historyStorage.getAll();
            setEntries(updated);
          },
        },
      ],
    );
  };

  const handlePress = (entry: HistoryEntry) => {
    router.push({
      pathname: '/calculator',
      params: {
        system: entry.systemId,
        width: entry.width.toString(),
        height: entry.height.toString(),
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {entries.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="time-outline" size={48} color={colors.icon} style={{ marginBottom: 12 }} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Sin historial
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Los cálculos que guardes aparecerán aquí.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {entries.map((entry) => (
              <Pressable
                key={entry.id}
                onPress={() => handlePress(entry)}
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                      {entry.description}
                    </Text>
                    <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
                      {entry.systemName} · {formatMeasure(entry.width)} x {formatMeasure(entry.height)} cm
                    </Text>
                    <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
                      {formatDate(entry.date)}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handleDelete(entry)}
                    hitSlop={12}
                    style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.icon} />
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 24,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 14,
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    marginTop: 4,
  },
});
