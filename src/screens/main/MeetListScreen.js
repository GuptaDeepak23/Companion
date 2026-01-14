import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Button, Chip } from 'react-native-paper';
import { format } from 'date-fns';
import { MeetAPI } from '../../api/meetApi';
import { Colors } from '../../utils/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MeetListScreen({ navigation }) {
  const [meets, setMeets] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMeets();
  }, [activeTab]);

  const loadMeets = async () => {
    try {
      setLoading(true);
      const fetchedMeets = await MeetAPI.getMeets(activeTab);
      setMeets(fetchedMeets);
    } catch (error) {
      console.error('Error loading meets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMeets();
    setRefreshing(false);
  };

  const renderMeetItem = ({ item }) => (
    <TouchableOpacity
      style={styles.meetCard}
      onPress={() =>
        navigation.navigate('MeetDetail', {
          meetId: item.id,
        })
      }
    >
      <View style={styles.meetHeader}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Chip
          style={[
            styles.statusChip,
            item.status === 'upcoming' && styles.upcomingChip,
            item.status === 'active' && styles.activeChip,
          ]}
          textStyle={styles.statusText}
        >
          {item.status}
        </Chip>
      </View>

      <View style={styles.meetInfo}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="map-marker"
            size={18}
            color={Colors.textSecondary}
          />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.location.address}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="calendar"
            size={18}
            color={Colors.textSecondary}
          />
          <Text style={styles.infoText}>
            {format(new Date(item.dateTime), 'MMM dd, yyyy - HH:mm')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={18}
            color={Colors.textSecondary}
          />
          <Text style={styles.infoText}>{item.duration} hour(s)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meets</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateMeet')}
          buttonColor={Colors.primary}
          style={styles.createButton}
        >
          Create Meet
        </Button>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.activeTabText,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={meets}
        keyExtractor={(item) => item.id}
        renderItem={renderMeetItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="calendar-blank"
              size={64}
              color={Colors.textDisabled}
            />
            <Text style={styles.emptyText}>No {activeTab} meets</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  createButton: {
    paddingHorizontal: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  meetCard: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 1,
  },
  meetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statusChip: {
    height: 24,
  },
  upcomingChip: {
    backgroundColor: Colors.primaryLight,
  },
  activeChip: {
    backgroundColor: '#ECFDF5',
  },
  statusText: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
  meetInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
});
