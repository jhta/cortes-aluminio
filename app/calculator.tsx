import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { InputField } from '@/src/components/InputField';
import { PanelSelector } from '@/src/components/PanelSelector';
import { ResultsList } from '@/src/components/ResultsList';
import { SaveModal } from '@/src/components/SaveModal';
import { WindowDiagram } from '@/src/components/WindowDiagram';
import { systemDefinitions } from '@/src/constants/systems';
import { useTheme } from '@/src/hooks/useTheme';
import { historyStorage } from '@/src/storage/history';
import { calculate } from '@/src/utils/calculations';

const ALAS_OPTIONS = [2, 3, 4];

export default function CalculatorScreen() {
  const { system, width: paramWidth, height: paramHeight } =
    useLocalSearchParams<{ system: string; width?: string; height?: string }>();
  const { colors } = useTheme();

  const [width, setWidth] = useState(paramWidth ?? '');
  const [height, setHeight] = useState(paramHeight ?? '');
  const [alas, setAlas] = useState(2);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const systemDef = systemDefinitions.find((s) => s.id === system);

  const results = useMemo(() => {
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    return calculate(system ?? '', w, h);
  }, [width, height, system]);

  const handleSave = async (description: string) => {
    if (!results || !system || !systemDef) return;
    await historyStorage.save({
      description,
      systemId: system,
      systemName: systemDef.name,
      width: parseFloat(width) || 0,
      height: parseFloat(height) || 0,
      results,
    });
    setShowSaveModal(false);
    router.back();
    setTimeout(() => router.push('/(tabs)/history'), 100);
  };

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
              <>
                <WindowDiagram
                  results={results}
                  windowWidth={parseFloat(width) || 0}
                  windowHeight={parseFloat(height) || 0}
                  alas={alas}
                />
                <ResultsList
                  results={results}
                  width={width}
                  height={height}
                  systemName={systemDef?.name ?? ''}
                />
              </>
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

        {results && (
          <View style={[styles.saveBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
            <Pressable
              onPress={() => setShowSaveModal(true)}
              style={({ pressed }) => [
                styles.saveButton,
                {
                  backgroundColor: colors.tint,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Ionicons name="save-outline" size={22} color={colors.tintText} />
              <Text style={[styles.saveButtonText, { color: colors.tintText }]}>
                Guardar
              </Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>

      <SaveModal
        visible={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSave}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
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
  saveBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
