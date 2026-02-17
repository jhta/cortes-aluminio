import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/src/hooks/useTheme';
import {
  capitalize,
  formatMeasure,
  type SystemResult,
} from '@/src/utils/calculations';

interface ResultsListProps {
  results: SystemResult;
  width: string;
  height: string;
  systemName: string;
}

export function ResultsList({ results, width, height, systemName }: ResultsListProps) {
  const { colors } = useTheme();

  const handleShare = async () => {
    const lines = Object.entries(results).map(
      ([key, value]) => `  ${capitalize(key)}: ${formatMeasure(value)} cm`,
    );

    const message = [
      `*Cortes Aluminio*`,
      `*${systemName}*`,
      `Ventana: ${width} x ${height} cm`,
      ``,
      `*Medidas:*`,
      ...lines,
    ].join('\n');

    try {
      await Share.share({ message });
    } catch {
      // user cancelled
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.resultBackground,
          borderColor: colors.resultBorder,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Medidas</Text>
          <Text style={[styles.summary, { color: colors.textSecondary }]}>
            Ventana {width} x {height} cm
          </Text>
        </View>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            styles.shareButton,
            {
              backgroundColor: pressed ? colors.border : 'transparent',
            },
          ]}
        >
          <Ionicons name="share-outline" size={22} color={colors.tint} />
        </Pressable>
      </View>

      <View>
        {Object.entries(results).map(([key, value]) => (
          <View
            key={key}
            style={[styles.row, { borderBottomColor: colors.resultBorder }]}
          >
            <Text style={[styles.label, { color: colors.text }]}>
              {capitalize(key)}
            </Text>
            <Text style={[styles.value, { color: colors.tint }]}>
              {formatMeasure(value)} cm
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summary: {
    fontSize: 14,
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 15,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
});
