import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import UserCard from '../../components/UserCard';
import { UserAPI } from '../../api/userApi';
import { Colors } from '../../utils/colors';
import * as Location from 'expo-location';

export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Location filters
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  
  // Dropdown states
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  
  const locations = UserAPI.getLocations();
  const countries = Object.keys(locations).map(c => ({ label: c, value: c }));
  const states = country ? Object.keys(locations[country] || {}).map(s => ({ label: s, value: s })) : [];
  const cities = (country && state) ? (locations[country][state] || []).map(c => ({ label: c, value: c })) : [];

  useEffect(() => {
    checkLocationPermission();
    loadUsers();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [city, state, country]);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Location Required',
        'Location permission is required to use this app. Please enable it.',
        [
          { text: 'Cancel' },
          { text: 'Enable', onPress: () => Location.requestForegroundPermissionsAsync() },
        ]
      );
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const filters = { country, state, city };
      const fetchedUsers = await UserAPI.getUsers(filters);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleInterest = async (user) => {
    try {
      await UserAPI.sendInterest(user.id);
      Alert.alert('Success', `Interest sent to ${user.name}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to send interest');
    }
  };

  const handleMessage = (user) => {
    Alert.alert(
      'Send Message',
      'You can send one message before mutual interest is accepted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Message',
          onPress: () => navigation.navigate('ChatStack', {
            screen: 'ChatDetail',
            params: { user }
          })
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Find companions near you</Text>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.dropdownRow}>
          <View style={styles.dropdown}>
            <DropDownPicker
              open={countryOpen}
              value={country}
              items={countries}
              setOpen={setCountryOpen}
              setValue={setCountry}
              placeholder="Country"
              style={styles.dropdownStyle}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
        </View>

        <View style={styles.dropdownRow}>
          <View style={styles.dropdown}>
            <DropDownPicker
              open={stateOpen}
              value={state}
              items={states}
              setOpen={setStateOpen}
              setValue={setState}
              placeholder="State"
              style={styles.dropdownStyle}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000}
              zIndexInverse={2000}
            />
          </View>
          <View style={[styles.dropdown, { marginLeft: 8 }]}>
            <DropDownPicker
              open={cityOpen}
              value={city}
              items={cities}
              setOpen={setCityOpen}
              setValue={setCity}
              placeholder="City"
              style={styles.dropdownStyle}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000}
              zIndexInverse={2000}
            />
          </View>
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onInterest={handleInterest}
            onMessage={handleMessage}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No users found in this location
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dropdown: {
    flex: 1,
  },
  dropdownStyle: {
    borderColor: Colors.border,
    minHeight: 40,
  },
  dropdownContainer: {
    borderColor: Colors.border,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
