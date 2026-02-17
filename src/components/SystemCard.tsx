import { Pressable, View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/src/hooks/useTheme';

interface SystemCardProps {
  name: string;
  available: boolean;
  onPress: () => void;
}

export function SystemCard({ name, available, onPress }: SystemCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: pressed && available ? colors.tint : colors.border,
          opacity: available ? (pressed ? 0.92 : 1) : 0.5,
        },
      ]}
      onPress={onPress}
      disabled={!available}
    >
      <Ionicons
        name="construct-outline"
        size={28}
        color={available ? colors.tint : colors.textSecondary}
      />
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]}>{name}</Text>
        {!available && (
          <Text style={[styles.comingSoon, { color: colors.textSecondary }]}>
            Próximamente
          </Text>
        )}
      </View>
      {available && (
        <Ionicons name="chevron-forward" size={20} color={colors.icon} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  body: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  comingSoon: {
    fontSize: 13,
    marginTop: 2,
  },
});
