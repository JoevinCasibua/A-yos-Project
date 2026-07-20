import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/session';
import { colors } from '@/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { loading, account } = useSession();
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(
        () =>
          router.replace(
            account?.role === 'WORKER'
              ? '/(worker)'
              : account?.role === 'USER'
                ? '/(user)'
                : '/landing',
          ),
        900,
      );
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [loading, account, router]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 22,
          backgroundColor: colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 34, fontWeight: '900', color: colors.accentText }}>A</Text>
      </View>
      <Text style={{ color: colors.text, fontSize: 27, fontWeight: '800' }}>A-YOS</Text>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}
