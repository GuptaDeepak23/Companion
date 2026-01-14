import React from 'react';
import { useAuth } from '../store/AuthContext';
import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';

export default function RootNavigator() {
  const { isAuthenticated, onboardingComplete, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : !onboardingComplete ? (
        <OnboardingNavigator />
      ) : (
        <BottomTabNavigator />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
