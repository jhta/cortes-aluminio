import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useTheme } from '@/src/hooks/useTheme';

interface SaveModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (description: string) => void;
}

export function SaveModal({ visible, onClose, onSave }: SaveModalProps) {
  const { colors } = useTheme();
  const [description, setDescription] = useState('');

  const handleSave = () => {
    const trimmed = description.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setDescription('');
  };

  const handleClose = () => {
    setDescription('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View
          style={[
            styles.container,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Guardar cálculo
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Agrega una descripción para identificar este cálculo.
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            placeholder="Ej: Ventana cocina"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            autoFocus
            maxLength={80}
          />

          <View style={styles.actions}>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.textSecondary }]}>
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.button,
                styles.saveButton,
                {
                  backgroundColor: colors.tint,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.tintText }]}>
                Guardar
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    width: '88%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {},
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
