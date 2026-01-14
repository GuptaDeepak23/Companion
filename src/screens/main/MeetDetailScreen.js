import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import { format, differenceInSeconds } from 'date-fns';
import { MeetAPI } from '../../api/meetApi';
import { Colors } from '../../utils/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MeetDetailScreen({ route }) {
  const { meetId } = route.params;
  const [meet, setMeet] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMeet();
  }, []);

  useEffect(() => {
    if (meet) {
      const timer = setInterval(() => {
        updateCountdown();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [meet]);

  const loadMeet = async () => {
    try {
      const fetchedMeet = await MeetAPI.getMeetById(meetId);
      setMeet(fetchedMeet);
    } catch (error) {
      console.error('Error loading meet:', error);
      Alert.alert('Error', 'Failed to load meet details');
    }
  };

  const updateCountdown = () => {
    if (!meet) return;

    const now = new Date();
    const meetTime = new Date(meet.dateTime);
    const seconds = differenceInSeconds(meetTime, now);

    if (seconds <= 0) {
      setCountdown('Meet time has passed');
      return;
    }

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    setCountdown(`${days}d ${hours}h ${minutes}m ${secs}s`);
  };

  const handleSOS = () => {
    Alert.alert(
      'Emergency SOS',
      'This will notify emergency services and your emergency contacts. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'TRIGGER SOS',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await MeetAPI.triggerSOS(meetId);
              Alert.alert(
                'SOS Triggered',
                'Emergency services have been notified. Stay safe!'
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to trigger SOS');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancelMeet = () => {
    Alert.alert(
      'Cancel Meet',
      'Are you sure you want to cancel this meet?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await MeetAPI.cancelMeet(meetId);
              Alert.alert('Cancelled', 'Meet has been cancelled');
              loadMeet();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel meet');
            }
          },
        },
      ]
    );
  };

  if (!meet) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <MaterialCommunityIcons
          name="map"
          size={48}
          color={Colors.textDisabled}
        />
        <Text style={styles.mapText}>Map View (Coming Soon)</Text>
        <Text style={styles.mapSubtext}>{meet.location.address}</Text>
      </View>

      {/* Countdown Timer */}
      {meet.status === 'upcoming' && (
        <Card style={styles.countdownCard}>
          <Card.Content>
            <Text style={styles.countdownLabel}>Time until meet</Text>
            <Text style={styles.countdownText}>{countdown}</Text>
          </Card.Content>
        </Card>
      )}

      {/* Meet Details */}
      <View style={styles.content}>
        <Card style={styles.detailCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Meet Details</Text>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="account"
                size={20}
                color={Colors.textSecondary}
              />
              <Text style={styles.detailLabel}>With</Text>
              <Text style={styles.detailValue}>{meet.userName}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={Colors.textSecondary}
              />
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {format(new Date(meet.dateTime), 'MMMM dd, yyyy')}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color={Colors.textSecondary}
              />
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>
                {format(new Date(meet.dateTime), 'HH:mm')}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="timer"
                size={20}
                color={Colors.textSecondary}
              />
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{meet.duration} hour(s)</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color={Colors.textSecondary}
              />
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue} numberOfLines={2}>
                {meet.location.address}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* SOS Button */}
        <Button
          mode="contained"
          onPress={handleSOS}
          disabled={loading}
          style={styles.sosButton}
          buttonColor={Colors.sos}
          icon="alert-octagon"
          contentStyle={styles.sosButtonContent}
        >
          EMERGENCY SOS
        </Button>

        {/* Safety Info */}
        <View style={styles.safetyBox}>
          <MaterialCommunityIcons
            name="shield-check"
            size={24}
            color={Colors.success}
          />
          <View style={styles.safetyTextContainer}>
            <Text style={styles.safetyTitle}>Safety First</Text>
            <Text style={styles.safetyText}>
              Your location is being tracked during this meet for safety. Use
              SOS button in case of emergency.
            </Text>
          </View>
        </View>

        {/* Cancel Meet */}
        {meet.status === 'upcoming' && (
          <Button
            mode="outlined"
            onPress={handleCancelMeet}
            style={styles.cancelButton}
            textColor={Colors.error}
          >
            Cancel Meet
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 200,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  mapText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  mapSubtext: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.textDisabled,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  countdownCard: {
    margin: 16,
    backgroundColor: Colors.primaryLight,
  },
  countdownLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  countdownText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    padding: 16,
  },
  detailCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    width: 80,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  sosButton: {
    paddingVertical: 8,
    marginBottom: 16,
  },
  sosButtonContent: {
    height: 56,
  },
  safetyBox: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  safetyTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
    marginBottom: 4,
  },
  safetyText: {
    fontSize: 13,
    color: '#065F46',
    lineHeight: 18,
  },
  cancelButton: {
    borderColor: Colors.error,
  },
});
