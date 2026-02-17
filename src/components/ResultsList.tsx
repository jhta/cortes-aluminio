import { View, Text, StyleSheet } from 'react-native';
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
}

export function ResultsList({ results, width, height }: ResultsListProps) {
  const { colors } = useTheme();

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
      <Text style={[styles.title, { color: colors.text }]}>Medidas</Text>
      <Text style={[styles.summary, { color: colors.textSecondary }]}>
        Ventana {width} x {height} cm
      </Text>

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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summary: {
    fontSize: 14,
    marginBottom: 16,
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
