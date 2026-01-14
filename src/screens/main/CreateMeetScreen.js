import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MeetAPI } from '../../api/meetApi';
import { Colors } from '../../utils/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';

export default function CreateMeetScreen({ route, navigation }) {
  const { userId, userName } = route.params || {};
  
  const [location, setLocation] = useState({
    lat: 19.0760,
    lng: 72.8777,
    address: 'Select location on map',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [meetDate, setMeetDate] = useState(new Date());
  const [duration, setDuration] = useState('2');
  const [loading, setLoading] = useState(false);

  const handleSelectLocation = () => {
    // Mock map selection
    Alert.alert(
      'Select Location',
      'Map integration coming soon. Using default location.',
      [
        {
          text: 'OK',
          onPress: () =>
            setLocation({
              lat: 19.0760,
              lng: 72.8777,
              address: 'Cafe Coffee Day, Bandra West, Mumbai',
            }),
        },
      ]
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setMeetDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(meetDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setMeetDate(newDate);
    }
  };

  const handleCreateMeet = async () => {
    if (!userId) {
      Alert.alert('Error', 'User information is missing');
      return;
    }

    if (meetDate < new Date()) {
      Alert.alert('Invalid Date', 'Please select a future date and time');
      return;
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum < 1) {
      Alert.alert('Invalid Duration', 'Please enter a valid duration (minimum 1 hour)');
      return;
    }

    try {
      setLoading(true);
      await MeetAPI.createMeet({
        userId,
        userName,
        location,
        dateTime: meetDate,
        duration: durationNum,
      });

      Alert.alert('Success', 'Meet scheduled successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MeetList'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create meet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Schedule Meet</Text>
        <Text style={styles.subtitle}>with {userName}</Text>

        {/* Location Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meet Location</Text>
          <TouchableOpacity
            style={styles.locationCard}
            onPress={handleSelectLocation}
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color={Colors.primary}
            />
            <View style={styles.locationInfo}>
              <Text style={styles.locationAddress}>{location.address}</Text>
              <Text style={styles.locationHint}>Tap to select on map</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.dateTimeText}>
                {format(meetDate, 'MMM dd, yyyy')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.dateTimeText}>
                {format(meetDate, 'HH:mm')}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={meetDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={meetDate}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration (hours)</Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            keyboardType="number-pad"
            mode="outlined"
            placeholder="Enter duration in hours"
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
          />
        </View>

        {/* Important Note */}
        <View style={styles.noteBox}>
          <MaterialCommunityIcons
            name="information"
            size={20}
            color={Colors.warning}
          />
          <Text style={styles.noteText}>
            Payment and final confirmation will be processed by backend. This
            creates a meet request.
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleCreateMeet}
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor={Colors.primary}
        >
          Schedule Meet
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationAddress: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  locationHint: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.background,
  },
  noteBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  noteText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  button: {
    paddingVertical: 6,
  },
});
