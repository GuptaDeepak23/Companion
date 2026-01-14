import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { List, Divider, Avatar, Button } from 'react-native-paper';
import { useAuth } from '../../store/AuthContext';
import { StorageService } from '../../utils/storage';
import { Colors } from '../../utils/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserAPI } from '../../api/userApi';

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [kycStatus, setKycStatus] = useState('pending');

  useEffect(() => {
    loadKYCStatus();
  }, []);

  const loadKYCStatus = async () => {
    // Mock: Load from stored user data
    const storedUser = await StorageService.getUser();
    if (storedUser && storedUser.kycStatus) {
      setKycStatus(storedUser.kycStatus);
    }
  };

  const getKYCStatusColor = () => {
    switch (kycStatus) {
      case 'verified':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'rejected':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserAPI.deleteAccount();
              await logout();
              Alert.alert('Account Deleted', 'Your account has been deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Avatar.Text
          size={80}
          label={user?.name?.charAt(0) || 'U'}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>

        <View style={styles.kycBadge}>
          <MaterialCommunityIcons
            name="shield-check"
            size={16}
            color={getKYCStatusColor()}
          />
          <Text style={[styles.kycText, { color: getKYCStatusColor() }]}>
            KYC: {kycStatus.toUpperCase()}
          </Text>
        </View>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.editButton}
        >
          Edit Profile
        </Button>
      </View>

      <Divider />

      {/* Settings Sections */}
      <View style={styles.section}>
        <List.Section>
          <List.Subheader style={styles.subheader}>Account</List.Subheader>

          <List.Item
            title="KYC Verification"
            description={`Status: ${kycStatus}`}
            left={(props) => (
              <List.Icon {...props} icon="shield-check" color={Colors.primary} />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() =>
              Alert.alert('KYC Status', `Your KYC is currently ${kycStatus}`)
            }
          />

          <List.Item
            title="Interests"
            description="Manage your interests"
            left={(props) => (
              <List.Icon {...props} icon="heart" color={Colors.primary} />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Interest management coming soon')}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader style={styles.subheader}>Support</List.Subheader>

          <List.Item
            title="Help & Support"
            description="Get help or contact us"
            left={(props) => (
              <List.Icon {...props} icon="help-circle" color={Colors.primary} />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() =>
              Alert.alert(
                'Help & Support',
                'For support, please email: support@companion.app'
              )
            }
          />

          <List.Item
            title="Privacy Policy"
            description="Read our privacy policy"
            left={(props) => (
              <List.Icon {...props} icon="shield-lock" color={Colors.primary} />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() =>
              Alert.alert(
                'Privacy Policy',
                'Your privacy is important to us. Location data is used only for safety and never shared with other users.'
              )
            }
          />

          <List.Item
            title="Terms of Service"
            description="Read our terms"
            left={(props) => (
              <List.Icon {...props} icon="file-document" color={Colors.primary} />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() =>
              Alert.alert(
                'Terms of Service',
                'This is an 18+ platform. All users must comply with safety guidelines.'
              )
            }
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader style={styles.subheader}>Actions</List.Subheader>

          <List.Item
            title="Logout"
            description="Sign out of your account"
            left={(props) => (
              <List.Icon {...props} icon="logout" color={Colors.error} />
            )}
            onPress={handleLogout}
            titleStyle={{ color: Colors.error }}
          />

          <List.Item
            title="Delete Account"
            description="Permanently delete your account"
            left={(props) => (
              <List.Icon {...props} icon="delete-forever" color={Colors.error} />
            )}
            onPress={handleDeleteAccount}
            titleStyle={{ color: Colors.error }}
          />
        </List.Section>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Companion v1.0.0</Text>
        <Text style={styles.footerText}>Safety-First Platform</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  avatar: {
    backgroundColor: Colors.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 16,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
  },
  kycText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    marginTop: 16,
  },
  section: {
    marginTop: 8,
  },
  subheader: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textDisabled,
    textAlign: 'center',
  },
});
