import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Modal, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/buttons/Button';
import { TextInput } from '../../components/inputs/TextInput';
import { theme } from '../../theme';
import { useDraftStore } from '../../store/useDraftStore';
import { ArrowLeft, X, Wrench, Droplets, Zap, Paintbrush, MapPin, Navigation, Camera, Mic, Settings, Info, Sparkles, Monitor, Fan, Shovel, Calendar, Clock, ChevronDown, Circle, CheckCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

const CATEGORIES = [
  { id: '1', name: 'Plumbing', icon: Droplets },
  { id: '2', name: 'Electrical', icon: Zap },
  { id: '3', name: 'Carpentry', icon: Wrench },
  { id: '4', name: 'Cleaning', icon: Sparkles },
  { id: '5', name: 'Appliance', icon: Monitor },
  { id: '6', name: 'AC Repair', icon: Fan },
  { id: '7', name: 'Painting', icon: Paintbrush },
  { id: '8', name: 'Gardening', icon: Shovel },
];

export default function CreateRequestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const currentDraft = useDraftStore(state => state.currentDraft);
  const updateCurrentDraft = useDraftStore(state => state.updateCurrentDraft);
  
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const {
    categoryId: selectedCategory,
    address,
    description,
    cameraPhoto,
    voiceRecord,
    schedule,
    budget,
    notes
  } = currentDraft;

  const setSelectedCategory = (val: string) => updateCurrentDraft({ categoryId: val });
  const setAddress = (val: string) => updateCurrentDraft({ address: val });
  const setDescription = (val: string) => updateCurrentDraft({ description: val });
  const setCameraPhoto = (val: string | null) => updateCurrentDraft({ cameraPhoto: val });
  const setVoiceRecord = (val: string | null) => updateCurrentDraft({ voiceRecord: val });
  const setSchedule = (val: string) => updateCurrentDraft({ schedule: val });
  const setBudget = (val: string) => updateCurrentDraft({ budget: val });
  const setNotes = (val: string) => updateCurrentDraft({ notes: val });

  const handleNext = () => {
    if (!selectedCategory || !description || !address) {
      alert('Please select a service, specify a location, and describe the issue.');
      return;
    }
    router.push('/new-request/issue-summary');
  };

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeTarget, setTimeTarget] = useState<'start' | 'end'>('start');
  const [amPm, setAmPm] = useState<'AM' | 'PM'>('AM');

  const isAllDay = schedule === 'All day';
  const isRange = schedule && schedule !== 'All day' && schedule.includes(' - ');
  const startTimeStr = schedule ? (isAllDay ? '' : (isRange ? schedule.split(' - ')[0] : schedule)) : '';
  const endTimeStr = schedule ? (isAllDay ? '' : (isRange ? schedule.split(' - ')[1] : '')) : '';

  const handleStartTimeSelect = (val: string) => {
    setSchedule(endTimeStr ? `${val} - ${endTimeStr}` : val);
  };
  
  const handleEndTimeSelect = (val: string) => {
    setSchedule(startTimeStr ? `${startTimeStr} - ${val}` : val);
  };
  
  const handleToggleAllDay = () => {
    setSchedule(!isAllDay ? 'All day' : '');
  };

  const handleTimeSelect = (time: string) => {
    const formattedTime = `${time} ${amPm}`;
    if (timeTarget === 'start') {
      handleStartTimeSelect(formattedTime);
    } else {
      handleEndTimeSelect(formattedTime);
    }
    setShowTimeModal(false);
  };

  const handleCameraClick = () => {
    setPermissionError(null);
    Alert.alert(
      "Camera Permission Required",
      "A-yos AI needs access to your camera to take photos of the issue.",
      [
        { text: "Deny", style: "cancel", onPress: () => setPermissionError("Camera access was denied. Cannot take photos.") },
        { text: "Allow", onPress: () => setCameraPhoto('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop') }
      ]
    );
  };

  const handleVoiceClick = () => {
    setPermissionError(null);
    Alert.alert(
      "Microphone Permission Required",
      "A-yos AI needs access to your microphone to record voice descriptions.",
      [
        { text: "Deny", style: "cancel", onPress: () => setPermissionError("Microphone access was denied. Cannot record voice.") },
        { text: "Allow", onPress: () => setVoiceRecord('https://images.unsplash.com/photo-1614227361719-75a8de789243?q=80&w=400&auto=format&fit=crop') }
      ]
    );
  };

  const handleLocationClick = () => {
    setPermissionError(null);
    Alert.alert(
      "Location Permission Required",
      "A-yos AI needs access to your location to find nearby services.",
      [
        { text: "Deny", style: "cancel", onPress: () => setPermissionError("Location access was denied. Cannot fetch current location.") },
        { text: "Allow", onPress: () => setAddress('321 BGC High Street, Taguig City') }
      ]
    );
  };

  return (
    <Screen safeArea scrollable>
      <View style={[styles.header, { paddingHorizontal: theme.layout.screenPadding }]}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>A-yos AI</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={[theme.typography.h2, styles.title]}>What do you need help with?</Text>
        
        {/* Categories */}
        <Text style={[theme.typography.label, styles.sectionTitle]}>Select Service</Text>
        <View style={styles.categoriesRow}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.categoryItemRow, isSelected && styles.categoryItemSelected]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Icon color={isSelected ? theme.colors.primary : theme.colors.textSecondary} size={24} />
                <Text style={[theme.typography.caption, { color: isSelected ? theme.colors.primary : theme.colors.textSecondary, marginTop: theme.spacing.xs, fontSize: 10, textAlign: 'center' }]} numberOfLines={1}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Camera */}
        <Text style={[theme.typography.label, styles.sectionTitle]}>Camera</Text>
        {cameraPhoto ? (
          <View style={styles.mediaPreview}>
            <Image source={cameraPhoto} style={styles.mediaImg} contentFit="cover" />
            <TouchableOpacity style={styles.removeMediaBtn} onPress={() => setCameraPhoto(null)}>
              <X color={theme.colors.surface} size={16} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.mediaUploadBtn} onPress={handleCameraClick}>
            <Camera color={theme.colors.primary} size={32} />
            <Text style={[theme.typography.caption, { color: theme.colors.primary, marginTop: theme.spacing.xs }]}>Take Photo</Text>
          </TouchableOpacity>
        )}

        {/* Voice */}
        <Text style={[theme.typography.label, styles.sectionTitle, { marginTop: theme.spacing.lg }]}>Voice</Text>
        {voiceRecord ? (
          <View style={styles.mediaPreview}>
            <Image source={voiceRecord} style={styles.mediaImg} contentFit="cover" />
            <View style={styles.voiceLabelOverlay}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Voice Content: 0:14s</Text>
            </View>
            <TouchableOpacity style={styles.removeMediaBtn} onPress={() => setVoiceRecord(null)}>
              <X color={theme.colors.surface} size={16} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.mediaUploadBtn} onPress={handleVoiceClick}>
            <Mic color={theme.colors.primary} size={32} />
            <Text style={[theme.typography.caption, { color: theme.colors.primary, marginTop: theme.spacing.xs }]}>Record Voice</Text>
          </TouchableOpacity>
        )}

        {/* Permission Error Display */}
        {permissionError && (
          <View style={styles.errorBox}>
            <Text style={[theme.typography.caption, { color: theme.colors.error }]}>{permissionError}</Text>
          </View>
        )}

        {/* Description */}
        <Text style={[theme.typography.label, styles.sectionTitle, { marginTop: theme.spacing.lg }]}>Describe the problem</Text>
        <TextInput
          placeholder="e.g. The sink is leaking under the cabinet..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          style={styles.textArea}
          textAlignVertical="top"
        />

        {/* Custom Schedule Picker */}
        <Text style={[theme.typography.label, styles.sectionTitle]}>Preferred Schedule</Text>


        {/* Time Pickers Row */}
        {!isAllDay && (
          <View style={styles.timePickersRow}>
            <TouchableOpacity 
              style={[styles.customSelectBtn, styles.timeSelectBtn, timeTarget === 'start' && styles.customSelectBtnActive]} 
              onPress={() => { setTimeTarget('start'); setShowTimeModal(true); }}
            >
              <View style={styles.customSelectLeft}>
                <Clock color={timeTarget === 'start' ? theme.colors.primary : theme.colors.textSecondary} size={16} />
                <View style={{ marginLeft: theme.spacing.xs }}>
                  <Text style={[theme.typography.caption, { color: timeTarget === 'start' ? theme.colors.primary : theme.colors.textTertiary, fontSize: 10 }]}>Start with</Text>
                  <Text style={[theme.typography.body2, { color: startTimeStr ? theme.colors.textPrimary : theme.colors.textSecondary }]}>
                    {startTimeStr || '00:00 AM'}
                  </Text>
                </View>
              </View>
              <ChevronDown color={theme.colors.textSecondary} size={16} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.customSelectBtn, styles.timeSelectBtn, timeTarget === 'end' && styles.customSelectBtnActive]} 
              onPress={() => { setTimeTarget('end'); setShowTimeModal(true); }}
            >
              <View style={styles.customSelectLeft}>
                <Clock color={timeTarget === 'end' ? theme.colors.primary : theme.colors.textSecondary} size={16} />
                <View style={{ marginLeft: theme.spacing.xs }}>
                  <Text style={[theme.typography.caption, { color: timeTarget === 'end' ? theme.colors.primary : theme.colors.textTertiary, fontSize: 10 }]}>End with</Text>
                  <Text style={[theme.typography.body2, { color: endTimeStr ? theme.colors.textPrimary : theme.colors.textSecondary }]}>
                    {endTimeStr || '00:00 AM'}
                  </Text>
                </View>
              </View>
              <ChevronDown color={theme.colors.textSecondary} size={16} />
            </TouchableOpacity>
          </View>
        )}

        {/* All Day Toggle */}
        <TouchableOpacity style={styles.allDayRow} onPress={handleToggleAllDay}>
          {isAllDay ? (
            <CheckCircle2 color={theme.colors.primary} size={20} />
          ) : (
            <Circle color={theme.colors.textTertiary} size={20} />
          )}
          <Text style={[theme.typography.body2, { color: isAllDay ? theme.colors.textPrimary : theme.colors.textSecondary, marginLeft: 8 }]}>All day</Text>
        </TouchableOpacity>

        {/* Custom Time Picker Modal */}
        <Modal visible={showTimeModal} transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowTimeModal(false)}>
            <View style={styles.timeDropdown}>
              <View style={styles.amPmToggle}>
                <TouchableOpacity 
                  style={[styles.amPmBtn, amPm === 'AM' && styles.amPmBtnActive]} 
                  onPress={() => setAmPm('AM')}
                >
                  <Text style={[theme.typography.caption, { color: amPm === 'AM' ? theme.colors.surface : theme.colors.textSecondary }]}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.amPmBtn, amPm === 'PM' && styles.amPmBtnActive]} 
                  onPress={() => setAmPm('PM')}
                >
                  <Text style={[theme.typography.caption, { color: amPm === 'PM' ? theme.colors.surface : theme.colors.textSecondary }]}>PM</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '01:00', '02:00', '03:00', '04:00', '05:00']}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.timeSlotBtn} onPress={() => handleTimeSelect(item)}>
                    <Text style={[theme.typography.body2, { color: theme.colors.primary, textAlign: 'center', fontWeight: '600' }]}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={{ maxHeight: 250 }}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Budget */}
        <Text style={[theme.typography.label, styles.sectionTitle]}>Budget (Optional)</Text>
        <TextInput
          placeholder="e.g. 1500"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          style={styles.inputField}
        />

        {/* Notes */}
        <Text style={[theme.typography.label, styles.sectionTitle]}>Additional Notes (Optional)</Text>
        <TextInput
          placeholder="e.g. Please bring your own ladder..."
          multiline
          numberOfLines={2}
          value={notes}
          onChangeText={setNotes}
          style={[styles.textArea, { minHeight: 60 }]}
          textAlignVertical="top"
        />

        {/* Location Picker */}
        <View style={styles.locationHeaderRow}>
          <Text style={[theme.typography.label, styles.sectionTitle, { marginBottom: 0 }]}>Service Location</Text>
          <View style={styles.locationControls}>
            <TouchableOpacity style={styles.currentLocationBtn} onPress={handleLocationClick}>
              <Navigation color={theme.colors.primary} size={14} />
              <Text style={[theme.typography.caption, { color: theme.colors.primary, marginLeft: 4, fontWeight: '600' }]}>Use Current</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gearBtn} onPress={() => router.push('/new-request/radius-config')}>
              <Settings color={theme.colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mockMiniMap}>
          <View style={styles.mapGridPattern} />
          <MapPin color={theme.colors.error} size={32} style={styles.mapPin} />
          <View style={styles.mapOverlay} />
        </View>
        <TextInput
          placeholder="Enter complete address"
          value={address}
          onChangeText={setAddress}
          style={styles.addressInput}
        />

        {/* AI Workflow Info */}
        <View style={styles.infoCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
            <Info color={theme.colors.primary} size={16} />
            <Text style={[theme.typography.label, { marginLeft: 8, color: theme.colors.primary }]}>How A-yos AI Works</Text>
          </View>
          <View style={{ marginLeft: 24 }}>
            <Text style={[theme.typography.caption, styles.infoBullet]}>• Customer uploads a photo of the problem</Text>
            <Text style={[theme.typography.caption, styles.infoBullet]}>• Customer records or enters a spoken or written description</Text>
            <Text style={[theme.typography.caption, styles.infoBullet]}>• AI identifies the likely issue</Text>
            <Text style={[theme.typography.caption, styles.infoBullet]}>• AI shows urgency, possible cause, suggested service category, estimated cost, and safety advice</Text>
            <Text style={[theme.typography.caption, styles.infoBullet]}>• AI creates an editable request draft</Text>
            <Text style={[theme.typography.caption, styles.infoBullet]}>• Customer can save the draft and continue later</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleNext} 
          disabled={!selectedCategory || description.length < 5 || address.length < 5}
          fullWidth 
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, paddingVertical: theme.spacing.xl },
  title: { marginBottom: theme.spacing.xl, color: theme.colors.textPrimary },
  sectionTitle: { marginBottom: theme.spacing.sm, color: theme.colors.textPrimary },
  
  categoriesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: theme.spacing.xl },
  categoryItemRow: { width: '23%', height: 80, backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.sm },
  categoryItemSelected: { borderColor: theme.colors.primary, backgroundColor: theme.colors.infoBackground },

  errorBox: { backgroundColor: `${theme.colors.error}15`, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.md },
  inputField: { backgroundColor: theme.colors.surface, marginBottom: theme.spacing.xl },
  
  // Custom Schedule Styles
  customSelectBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.md, marginBottom: theme.spacing.sm },
  customSelectBtnActive: { borderColor: theme.colors.primary },
  customSelectLeft: { flexDirection: 'row', alignItems: 'center' },
  timePickersRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
  timeSelectBtn: { width: '48%', padding: theme.spacing.sm },
  allDayRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xl, paddingVertical: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  timeDropdown: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.sm, width: 220, ...theme.shadows.lg },
  amPmToggle: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: theme.spacing.sm, paddingRight: theme.spacing.sm },
  amPmBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: theme.radius.sm, borderWidth: 1, borderColor: theme.colors.borderLight, marginLeft: 8 },
  amPmBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  timeSlotBtn: { paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },

  mediaUploadBtn: { width: '100%', height: 80, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.primary, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.infoBackground, marginBottom: theme.spacing.sm },
  mediaPreview: { width: '100%', height: 120, borderRadius: theme.radius.md, position: 'relative', overflow: 'hidden', marginBottom: theme.spacing.sm },
  mediaImg: { width: '100%', height: '100%', backgroundColor: theme.colors.border },
  voiceLabelOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, backgroundColor: 'rgba(0,0,0,0.5)' },
  removeMediaBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.error, justifyContent: 'center', alignItems: 'center' },

  textArea: { minHeight: 100, backgroundColor: theme.colors.surface, marginBottom: theme.spacing.xl },

  locationHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm },
  locationControls: { flexDirection: 'row', alignItems: 'center' },
  currentLocationBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.infoBackground, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: theme.spacing.sm },
  gearBtn: { padding: 4 },
  
  mockMiniMap: { height: 140, backgroundColor: '#e2e8f0', borderRadius: theme.radius.lg, marginBottom: theme.spacing.md, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  mapGridPattern: { position: 'absolute', width: '150%', height: '150%', borderWidth: 1, borderColor: '#cbd5e1', opacity: 0.5, borderRadius: 20 },
  mapPin: { zIndex: 2 },
  mapOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, backgroundColor: 'rgba(255,255,255,0.4)' },
  addressInput: { backgroundColor: theme.colors.surface, marginBottom: theme.spacing.xl },

  infoCard: { backgroundColor: theme.colors.infoBackground, borderRadius: theme.radius.lg, padding: theme.spacing.md, marginBottom: theme.spacing.md },
  infoBullet: { color: theme.colors.textSecondary, marginBottom: 4, lineHeight: 18 },

  footer: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
});
