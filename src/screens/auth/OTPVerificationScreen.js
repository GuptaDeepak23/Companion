import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '../../store/AuthContext';
import { AuthAPI } from '../../api/authApi';
import { Colors } from '../../utils/colors';

export default function OTPVerificationScreen({ route, navigation }) {
  const { email } = route.params;
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      await verifyOTP(email, otp);
      Alert.alert('Success', 'Email verified successfully!');
      // Navigation will be handled by AuthContext state change
    } catch (error) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    try {
      setResending(true);
      await AuthAPI.resendOTP(email);
      Alert.alert('Success', 'OTP sent to your email');
      setCountdown(60);
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to {email}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Enter OTP"
            value={otp}
            onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
            mode="outlined"
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
          />

          <Button
            mode="contained"
            onPress={handleVerifyOTP}
            loading={loading}
            disabled={loading}
            style={styles.button}
            buttonColor={Colors.primary}
          >
            Verify OTP
          </Button>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={countdown > 0 || resending}
            >
              <Text
                style={[
                  styles.resendLink,
                  (countdown > 0 || resending) && styles.resendDisabled,
                ]}
              >
                {resending
                  ? 'Sending...'
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.background,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  resendLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  resendDisabled: {
    color: Colors.textDisabled,
  },
  backButton: {
    marginTop: 32,
    alignItems: 'center',
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
