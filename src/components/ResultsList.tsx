import { View, Text, StyleSheet, Pressable, Share, Linking, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/src/hooks/useTheme';
import {
  capitalize,
  formatMeasure,
  type SystemResult,
} from '@/src/utils/calculations';

const WHATSAPP_GREEN = '#25D366';

interface ResultsListProps {
  results: SystemResult;
  width: string;
  height: string;
  systemName: string;
}

export function ResultsList({ results, width, height, systemName }: ResultsListProps) {
  const { colors } = useTheme();

  const buildMessage = () => {
    const lines = Object.entries(results).map(
      ([key, value]) => `  ${capitalize(key)}: ${formatMeasure(value)} cm`,
    );

    return [
      `*Cortes Aluminio*`,
      `*${systemName}*`,
      `Ventana: ${width} x ${height} cm`,
      ``,
      `*Medidas:*`,
      ...lines,
    ].join('\n');
  };

  const handleShareWhatsApp = async () => {
    const message = buildMessage();
    const encoded = encodeURIComponent(message);
    const url = `whatsapp://send?text=${encoded}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Share.share({ message });
      }
    } catch {
      await Share.share({ message });
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

      <Pressable
        onPress={handleShareWhatsApp}
        style={({ pressed }) => [
          styles.whatsappButton,
          { opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Ionicons name="logo-whatsapp" size={22} color="#fff" />
        <Text style={styles.whatsappButtonText}>Compartir en WhatsApp</Text>
      </Pressable>
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
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: WHATSAPP_GREEN,
  },
  whatsappButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
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
