import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
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
}) => {
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    if (!value.trim()) return options.slice(0, 4);
    const query = value.toLowerCase();
    return options
      .filter((o) => o.label.toLowerCase().includes(query))
      .slice(0, 4);
  }, [value, options]);

  const exactMatch = useMemo(
    () => options.find((o) => o.label.toLowerCase() === value.toLowerCase()),
    [value, options],
  );

  const showSuggestions = focused && (filtered.length > 0 || (multiSelect && value.trim().length > 0));

  const handleSelect = (option: SelectOption) => {
    if (multiSelect && onToggle) {
      onToggle(option.value);
      onChangeText('');
    } else {
      onChangeText(option.label);
      setFocused(false);
    }
  };

  const handleAddCustom = () => {
    const trimmed = value.trim();
    if (!trimmed || !onAddCustom) return;
    if (exactMatch) {
      onToggle?.(exactMatch.value);
    } else {
      onAddCustom(trimmed);
    }
    onChangeText('');
  };

  const handleSubmitEditing = () => {
    if (multiSelect) {
      handleAddCustom();
    } else {
      setFocused(false);
    }
  };

  const renderSuggestion = ({ item }: { item: SelectOption }) => {
    const isSelected = multiSelect && selectedValues.includes(item.value);
    return (
      <Pressable
        style={styles.suggestionRow}
        onPress={() => handleSelect(item)}
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
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onSubmitEditing={handleSubmitEditing}
            returnKeyType={multiSelect ? 'done' : 'done'}
          />
        </View>
        {multiSelect && value.trim().length > 0 && (
          <Pressable style={styles.addButton} onPress={handleAddCustom}>
            <Plus size={20} color={Colors.white} />
          </Pressable>
        )}
      </View>

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            renderItem={renderSuggestion}
            scrollEnabled={filtered.length > 2}
            nestedScrollEnabled
          />
          {multiSelect && value.trim().length > 0 && !exactMatch && (
            <Pressable style={styles.customRow} onPress={handleAddCustom}>
              <AppText variant="bodySm" weight="semiBold" color={Colors.primary}>
                Add "{value.trim()}" as custom
              </AppText>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
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
  suggestionsContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    maxHeight: 180,
    overflow: 'hidden',
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
