import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MoreVertical, Flag, XCircle } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, IconSize } from '@/constants/theme';
import { AppText } from '@/components/AppText';

interface ThreeDotMenuProps {
  onReportUser: () => void;
  onCancelService: () => void;
  showCancel?: boolean;
}

export const ThreeDotMenu = React.memo(function ThreeDotMenu({
  onReportUser,
  onCancelService,
  showCancel = true,
}: ThreeDotMenuProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleReportUser = () => {
    setIsVisible(false);
    onReportUser();
  };

  const handleCancelService = () => {
    setIsVisible(false);
    onCancelService();
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="More options"
        style={styles.trigger}
        onPress={() => setIsVisible(true)}
        hitSlop={12}
      >
        <MoreVertical size={IconSize.lg} color={Colors.textPrimary} />
      </Pressable>

      {isVisible && (
        <>
          <Pressable 
            accessibilityRole="button"
            accessibilityLabel="Close menu"
            style={styles.backdrop} 
            onPress={() => setIsVisible(false)} 
          />
          <View style={styles.menu}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Report User"
              style={styles.menuItem}
              onPress={handleReportUser}
            >
              <Flag size={18} color={Colors.textSecondary} />
              <AppText variant="body" color={Colors.textPrimary}>
                Report User
              </AppText>
            </Pressable>
            {showCancel && (
              <>
                <View style={styles.divider} />
                <Pressable
                  style={styles.menuItem}
                  onPress={handleCancelService}
                >
                  <XCircle size={18} color={Colors.error} />
                  <AppText variant="body" color={Colors.error}>
                    Cancel Service
                  </AppText>
                </Pressable>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 1,
  },
  trigger: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: Radius.full,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  menu: {
    position: 'absolute',
    top: 48,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['2'],
    minWidth: 180,
    zIndex: 100,
    ...Elevation.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
    paddingVertical: Spacing['3'],
    paddingHorizontal: Spacing['4'],
    borderRadius: Radius.lg,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing['4'],
  },
});
