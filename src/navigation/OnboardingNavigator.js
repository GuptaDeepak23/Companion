import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LocationPermissionScreen from '../screens/onboarding/LocationPermissionScreen';
import ProfilePhotoScreen from '../screens/onboarding/ProfilePhotoScreen';
import KYCUploadScreen from '../screens/onboarding/KYCUploadScreen';
import InterestSelectionScreen from '../screens/onboarding/InterestSelectionScreen';
import { Colors } from '../utils/colors';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => null, // Prevent going back during onboarding
      }}
    >
      <Stack.Screen
        name="LocationPermission"
        component={LocationPermissionScreen}
        options={{ title: 'Location Permission' }}
      />
      <Stack.Screen
        name="ProfilePhoto"
        component={ProfilePhotoScreen}
        options={{ title: 'Profile Photo' }}
      />
      <Stack.Screen
        name="KYCUpload"
        component={KYCUploadScreen}
        options={{ title: 'KYC Verification' }}
      />
      <Stack.Screen
        name="InterestSelection"
        component={InterestSelectionScreen}
        options={{ title: 'Your Interests' }}
      />
    </Stack.Navigator>
  );
}
