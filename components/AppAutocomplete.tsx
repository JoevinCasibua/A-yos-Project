import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Keyboard,
  ViewStyle,
} from 'react-native';
import { Check, Plus } from 'lucide-react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { AppText } from './AppText';
import { AppInput } from './AppInput';
import type { SelectOption } from './AppSelect';

interface AppAutocompleteProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  containerStyle?: ViewStyle;
  /** Multi-select mode: shows Add button, selected checkmarks */
  multiSelect?: boolean;
  /** Currently selected values (multiSelect mode) */
  selectedValues?: string[];
  /** Toggle a value in multiSelect mode */
  onToggle?: (value: string) => void;
  /** Called when user submits custom text via Enter or Add button (multiSelect) */
  onAddCustom?: (text: string) => void;
  /** Single-select mode: fires when user taps a suggestion, passes the full option */
  onSelect?: (option: SelectOption) => void;
}

export const AppAutocomplete: React.FC<AppAutocompleteProps> = ({
  label,
  value,
  onChangeText,
  options,
  placeholder = 'Type to search...',
  error,
  containerStyle,
  multiSelect = false,
  selectedValues = [],
  onToggle,
  onAddCustom,
  onSelect,
}) => {
  const [focused, setFocused] = useState(false);
  const [blurredOnce, setBlurredOnce] = useState(false);
  const pressingRef = useRef(false);

  const filtered = useMemo(() => {
    const source = multiSelect
      ? options.filter(o => !selectedValues.includes(o.value))
      : options;
    if (!value.trim()) return source.slice(0, 5);
    const query = value.toLowerCase();
    return source
      .filter((o) => o.label.toLowerCase().includes(query))
      .slice(0, 5);
  }, [value, options, selectedValues, multiSelect]);

  const exactMatch = useMemo(
    () => options.find((o) => o.label.toLowerCase() === value.toLowerCase()),
    [value, options],
  );

  const showSuggestions = focused && (filtered.length > 0 || (value.trim().length > 0 && !exactMatch));

  const handleSelect = useCallback((option: SelectOption) => {
    pressingRef.current = true;
    if (multiSelect && onToggle) {
      onToggle(option.value);
      onChangeText('');
      setTimeout(() => { pressingRef.current = false; }, 100);
    } else {
      onChangeText(option.label);
      onSelect?.(option);
      setFocused(false);
      setBlurredOnce(false);
      pressingRef.current = false;
    }
  }, [multiSelect, onToggle, onChangeText, onSelect]);

  const handleAddCustom = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    pressingRef.current = true;
    if (multiSelect) {
      if (!onAddCustom) return;
      if (exactMatch) {
        onToggle?.(exactMatch.value);
      } else {
        onAddCustom(trimmed);
      }
      onChangeText('');
      pressingRef.current = false;
    } else {
      const customOption: SelectOption = { label: trimmed, value: trimmed.toLowerCase().replace(/\s+/g, '_') };
      onSelect?.(customOption);
      onChangeText(trimmed);
      setFocused(false);
      setBlurredOnce(false);
      pressingRef.current = false;
    }
  }, [value, multiSelect, onAddCustom, exactMatch, onToggle, onSelect, onChangeText]);

  const handleFocus = useCallback(() => {
    setBlurredOnce(false);
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setBlurredOnce(true);
    Keyboard.dismiss();
  }, []);

  const handleSubmitEditing = () => {
    if (multiSelect) {
      handleAddCustom();
    } else if (filtered.length === 1) {
      setFocused(false);
      setBlurredOnce(false);
    } else if (value.trim().length > 0 && !exactMatch) {
      handleAddCustom();
    } else {
      setFocused(false);
      setBlurredOnce(false);
    }
  };

  const renderSuggestion = ({ item }: { item: SelectOption }) => {
    const isSelected = multiSelect && selectedValues.includes(item.value);
    return (
      <Pressable
        key={item.value}
        style={styles.suggestionRow}
        onPress={() => handleSelect(item)}
        onPressIn={() => { pressingRef.current = true; }}
      >
        <AppText
          variant="body"
          weight={isSelected ? 'bold' : 'regular'}
          color={isSelected ? Colors.primary : Colors.textPrimary}
          style={{ flex: 1 }}
        >
          {item.label}
        </AppText>
        {isSelected && <Check size={18} color={Colors.primary} />}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputRow}>
        <View style={styles.inputFlex}>
          <AppInput
            label={label}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            error={error}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmitEditing}
            returnKeyType="done"
          />
        </View>
        {multiSelect && value.trim().length > 0 && (
          <Pressable style={styles.addButton} onPress={handleAddCustom}>
            <Plus size={20} color={Colors.white} />
          </Pressable>
        )}
      </View>

      {showSuggestions && (
        <>
          {blurredOnce && (
            <Pressable
              style={styles.dismissOverlay}
              onPress={() => {
                setFocused(false);
                setBlurredOnce(false);
              }}
            />
          )}
          <View style={styles.suggestionsDropdown} pointerEvents="box-none">
            <View style={styles.suggestionsInner}>
              {filtered.map((item) => renderSuggestion({ item }))}
              {value.trim().length > 0 && !exactMatch && (
                <Pressable
                  style={styles.customRow}
                  onPress={handleAddCustom}
                  onPressIn={() => { pressingRef.current = true; }}
                >
                  <AppText variant="bodySm" weight="semiBold" color={Colors.primary}>
                    {multiSelect ? `Add "${value.trim()}" as custom` : `Use "${value.trim()}" as custom`}
                  </AppText>
                </Pressable>
              )}
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 100,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing['2'],
  },
  inputFlex: {
    flex: 1,
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  dismissOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  suggestionsDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
  },
  suggestionsInner: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    marginTop: 4,
    maxHeight: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing['4'],
    paddingVertical: Spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  customRow: {
    paddingHorizontal: Spacing['4'],
    paddingVertical: Spacing['3'],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
});
