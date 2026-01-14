import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Card, Chip, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../utils/colors';

export default function UserCard({ user, onInterest, onMessage }) {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {user.profilePhoto ? (
            <Image
              source={{ uri: user.profilePhoto }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons
                name="account"
                size={60}
                color={Colors.textDisabled}
              />
            </View>
          )}
          {user.kycStatus === 'verified' && (
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={20}
                color={Colors.success}
              />
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.details}>
            {user.age} years • {user.gender}
          </Text>
          <Text style={styles.location}>
            {user.location.city}, {user.location.state}
          </Text>

          <View style={styles.interestsContainer}>
            {user.interests.slice(0, 3).map((interest, index) => (
              <Chip
                key={index}
                style={styles.interestChip}
                textStyle={styles.interestText}
              >
                {interest}
              </Chip>
            ))}
            {user.interests.length > 3 && (
              <Text style={styles.moreInterests}>
                +{user.interests.length - 3} more
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          mode="contained-tonal"
          onPress={() => onInterest(user)}
          style={styles.actionButton}
          buttonColor={Colors.primaryLight}
          textColor={Colors.primary}
          icon="heart"
        >
          Interested
        </Button>
        <Button
          mode="outlined"
          onPress={() => onMessage(user)}
          style={styles.actionButton}
          textColor={Colors.primary}
          icon="message"
        >
          Message
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: Colors.background,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
  },
  interestChip: {
    height: 24,
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: Colors.cardBackground,
  },
  interestText: {
    fontSize: 11,
    marginVertical: 0,
  },
  moreInterests: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 0,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
});
