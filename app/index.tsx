import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { router } from 'expo-router';

import { useTheme } from '@/src/hooks/useTheme';
import { SystemCard } from '@/src/components/SystemCard';
import { systemDefinitions } from '@/src/constants/systems';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: colors.text }]}>
          Selecciona el sistema
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Elige el sistema de aluminio para calcular los cortes necesarios.
        </Text>

        <View style={styles.cards}>
          {systemDefinitions.map((system) => (
            <SystemCard
              key={system.id}
              name={system.name}
              available={system.available}
              onPress={() =>
                router.push({
                  pathname: '/calculator',
                  params: { system: system.id },
                })
              }
            />
          ))}
        </View>
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
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
  },
  cards: {
    gap: 12,
  },
});
