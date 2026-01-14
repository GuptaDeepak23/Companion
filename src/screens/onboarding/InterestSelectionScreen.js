import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button, Chip } from 'react-native-paper';
import { Colors } from '../../utils/colors';
import { MOCK_INTERESTS } from '../../api/mockData';
import { UserAPI } from '../../api/userApi';
import { useAuth } from '../../store/AuthContext';

export default function InterestSelectionScreen() {
  const { completeOnboarding } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [saving, setSaving] = useState(false);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleComplete = async () => {
    if (selectedInterests.length === 0) {
      Alert.alert('Select Interests', 'Please select at least one interest');
      return;
    }

    try {
      setSaving(true);
      await UserAPI.updateInterests(selectedInterests);
      await completeOnboarding();
      
      Alert.alert(
        'Welcome to Companion!',
        'Your profile is now set up. Start connecting safely!'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save interests');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Select Your Interests</Text>
        <Text style={styles.subtitle}>
          Choose topics you're interested in. This helps with discovery.
        </Text>

        <View style={styles.chipsContainer}>
          {MOCK_INTERESTS.map((interest) => (
            <Chip
              key={interest}
              selected={selectedInterests.includes(interest)}
              onPress={() => toggleInterest(interest)}
              style={[
                styles.chip,
                selectedInterests.includes(interest) && styles.chipSelected,
              ]}
              selectedColor={Colors.primary}
              textStyle={[
                styles.chipText,
                selectedInterests.includes(interest) && styles.chipTextSelected,
              ]}
            >
              {interest}
            </Chip>
          ))}
        </View>

        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            {selectedInterests.length} interest(s) selected
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleComplete}
          loading={saving}
          disabled={selectedInterests.length === 0 || saving}
          style={styles.button}
          buttonColor={Colors.primary}
        >
          Complete Setup
        </Button>
        <Text style={styles.disclaimer}>Step 4 of 4 - Almost done!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    margin: 4,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textPrimary,
  },
  chipTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  selectionInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footer: {
    padding: 24,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
    paddingVertical: 6,
    marginBottom: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
