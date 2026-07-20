import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type TextInputProps,
} from 'react-native';
import { colors } from './theme';

export function Screen({ children }: { children: React.ReactNode }) {
  return <View style={styles.screen}>{children}</View>;
}
export function Heading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <View style={styles.heading}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}
export function Button({
  title,
  variant = 'primary',
  ...props
}: PressableProps & { title: string; variant?: 'primary' | 'secondary' | 'danger' }) {
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        pressed && { opacity: 0.75 },
        props.disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.buttonText, variant !== 'primary' && { color: colors.text }]}>
        {title}
      </Text>
    </Pressable>
  );
}
export function Field({
  label,
  accessibilityLabel = label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={accessibilityLabel}
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
    </View>
  );
}
export function FeatureCard({
  icon,
  title,
  body,
  onPress,
}: {
  icon: string;
  title: string;
  body: string;
  onPress?: (() => void) | undefined;
}) {
  const content = (
    <>
      <Text style={styles.icon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
      {onPress ? <Text style={styles.chevron}>›</Text> : null}
    </>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      {content}
    </Pressable>
  ) : (
    <View style={styles.card}>{content}</View>
  );
}
export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.body, { textAlign: 'center' }]}>{body}</Text>
    </View>
  );
}

export function DataState({ loading, error }: { loading: boolean; error?: string | undefined }) {
  if (loading) return <EmptyState title="Loading…" body="Retrieving current platform data." />;
  if (error) return <EmptyState title="Unable to load" body={error} />;
  return null;
}

export function StatusBadge({
  label,
  tone = 'info',
}: {
  label: string;
  tone?: 'info' | 'success' | 'warning' | 'danger';
}) {
  return (
    <View style={[styles.badge, styles[`${tone}Badge`]]}>
      <Text style={[styles.badgeText, styles[`${tone}BadgeText`]]}>
        {label.replaceAll('_', ' ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 22, gap: 16 },
  heading: { gap: 7, marginTop: 20, marginBottom: 10 },
  eyebrow: {
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '700',
    fontSize: 11,
  },
  title: { color: colors.text, fontWeight: '800', fontSize: 32, letterSpacing: -1 },
  body: { color: colors.muted, lineHeight: 20, fontSize: 14 },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  secondary: { backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: '#642d35' },
  disabled: { opacity: 0.5 },
  buttonText: { color: colors.accentText, fontWeight: '800', fontSize: 15 },
  field: { gap: 7 },
  label: { color: colors.muted, fontSize: 12 },
  input: {
    color: colors.text,
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  icon: { fontSize: 24 },
  cardTitle: { color: colors.text, fontWeight: '700', fontSize: 16, marginBottom: 4 },
  chevron: { color: colors.accent, fontSize: 28 },
  empty: {
    borderColor: colors.border,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 36,
    gap: 8,
    alignItems: 'center',
  },
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5 },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  infoBadge: { backgroundColor: '#dbeafe' },
  infoBadgeText: { color: colors.info },
  successBadge: { backgroundColor: '#d1fae5' },
  successBadgeText: { color: colors.success },
  warningBadge: { backgroundColor: '#fef3c7' },
  warningBadgeText: { color: colors.warning },
  dangerBadge: { backgroundColor: '#fee2e2' },
  dangerBadgeText: { color: colors.danger },
});
