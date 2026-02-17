import { useState, useMemo } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

import { useTheme } from '@/src/hooks/useTheme';
import { InputField } from '@/src/components/InputField';
import { PanelSelector } from '@/src/components/PanelSelector';
import { ResultsList } from '@/src/components/ResultsList';
import { systemDefinitions } from '@/src/constants/systems';
import { calculate } from '@/src/utils/calculations';

const ALAS_OPTIONS = [2, 3, 4];

export default function CalculatorScreen() {
  const { system } = useLocalSearchParams<{ system: string }>();
  const { colors } = useTheme();

  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [alas, setAlas] = useState(2);

  const systemDef = systemDefinitions.find((s) => s.id === system);

  const results = useMemo(() => {
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    return calculate(system ?? '', w, h);
  }, [width, height, system]);

  return (
    <>
      <Stack.Screen options={{ title: systemDef?.name ?? 'Calculadora' }} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={[styles.flex, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <InputField
              label="Ancho (cm)"
              value={width}
              onChangeText={setWidth}
              placeholder="Ej: 120"
            />

            <InputField
              label="Alto (cm)"
              value={height}
              onChangeText={setHeight}
              placeholder="Ej: 100"
            />

            <PanelSelector
              options={ALAS_OPTIONS}
              value={alas}
              onChange={setAlas}
            />

            {results ? (
              <ResultsList results={results} width={width} height={height} />
            ) : (
              <View
                style={[
                  styles.emptyState,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
                  Ingresa el ancho y alto para ver los cortes.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    marginTop: 8,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
});
