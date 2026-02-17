import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

interface PanelSelectorProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
}

export function PanelSelector({ options, value, onChange }: PanelSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Alas</Text>
      <View style={styles.row}>
        {options.map((num) => {
          const isSelected = value === num;
          return (
            <Pressable
              key={num}
              style={[
                styles.button,
                {
                  backgroundColor: isSelected ? colors.tint : colors.surface,
                  borderColor: isSelected ? colors.tint : colors.border,
                },
              ]}
              onPress={() => onChange(num)}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: isSelected ? colors.tintText : colors.text },
                ]}
              >
                {num}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
