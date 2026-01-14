import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Button } from 'react-native-paper';
import * as Location from 'expo-location';
import { Colors } from '../../utils/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LocationPermissionScreen({ navigation }) {
  const [requesting, setRequesting] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestLocationPermission = async () => {
    try {
      setRequesting(true);
      
      // Request foreground permissions first
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        setPermissionDenied(true);
        Alert.alert(
          'Permission Required',
          'Location access is mandatory for safety and meet coordination. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.enableNetworkProviderAsync() },
          ]
        );
        return;
      }

      // On Android, also request background location
      if (Platform.OS === 'android') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        
        if (backgroundStatus !== 'granted') {
          Alert.alert(
            'Background Location',
            'For your safety during meets, we need "Allow all the time" permission.',
            [
              { text: 'Skip for now', onPress: () => navigation.navigate('ProfilePhoto') },
              { text: 'Grant Permission', onPress: requestLocationPermission },
            ]
          );
          return;
        }
      }

      // Permission granted, move to next step
      Alert.alert('Success', 'Location permission granted');
      navigation.navigate('ProfilePhoto');
    } catch (error) {
      console.error('Location permission error:', error);
      Alert.alert('Error', 'Failed to request location permission');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={100}
            color={Colors.primary}
          />
        </View>

        <Text style={styles.title}>Location Permission</Text>
        <Text style={styles.subtitle}>Required for Your Safety</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="shield-check" size={24} color={Colors.success} />
            <Text style={styles.infoText}>
              Location is used for safety and meet coordination
            </Text>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="eye-off" size={24} color={Colors.info} />
            <Text style={styles.infoText}>
              Your location is never visible to other users
            </Text>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="alert" size={24} color={Colors.warning} />
            <Text style={styles.infoText}>
              "Allow all the time" is required for emergency features
            </Text>
          </View>
        </View>

        {permissionDenied && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Without location permission, you cannot use this app. This is a
              safety requirement.
            </Text>
          </View>
        )}

        <Button
          mode="contained"
          onPress={requestLocationPermission}
          loading={requesting}
          disabled={requesting}
          style={styles.button}
          buttonColor={Colors.primary}
        >
          Grant Location Permission
        </Button>

        <Text style={styles.disclaimer}>
          Step 1 of 4 - This step cannot be skipped
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  warningText: {
    color: Colors.error,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 6,
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
