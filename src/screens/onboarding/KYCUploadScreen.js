import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '../../utils/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserAPI } from '../../api/userApi';

export default function KYCUploadScreen({ navigation }) {
  const [document, setDocument] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your files');
        return;
      }

      const result = await ImagePicker.launchImagePickerAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64Doc = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setDocument({
          uri: result.assets[0].uri,
          base64: base64Doc,
          name: 'aadhaar.jpg',
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64Doc = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setDocument({
          uri: result.assets[0].uri,
          base64: base64Doc,
          name: 'aadhaar.jpg',
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleUpload = async () => {
    if (!document) {
      Alert.alert('Document Required', 'Please upload your Aadhaar card');
      return;
    }

    try {
      setUploading(true);
      const response = await UserAPI.uploadKYC(document.base64);
      
      Alert.alert(
        'Success',
        'KYC document uploaded. Verification is pending.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('InterestSelection'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to upload KYC document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>KYC Verification</Text>
        <Text style={styles.subtitle}>Upload your Aadhaar card for verification</Text>

        <View style={styles.documentContainer}>
          {document ? (
            <View style={styles.documentPreview}>
              <Image source={{ uri: document.uri }} style={styles.documentImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setDocument(null)}
              >
                <MaterialCommunityIcons name="close-circle" size={24} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.documentPlaceholder}>
              <MaterialCommunityIcons
                name="file-document"
                size={60}
                color={Colors.textDisabled}
              />
              <Text style={styles.placeholderText}>No document selected</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
            <MaterialCommunityIcons name="camera" size={24} color={Colors.primary} />
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={pickDocument}>
            <MaterialCommunityIcons name="folder-image" size={24} color={Colors.primary} />
            <Text style={styles.optionText}>Choose File</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Important Information:</Text>
          <Text style={styles.infoText}>• Upload a clear photo of your Aadhaar card</Text>
          <Text style={styles.infoText}>• All details should be clearly visible</Text>
          <Text style={styles.infoText}>• Verification typically takes 24-48 hours</Text>
          <Text style={styles.infoText}>• You can browse but cannot finalize meets until verified</Text>
        </View>

        <View style={styles.statusBox}>
          <MaterialCommunityIcons name="information" size={20} color={Colors.warning} />
          <Text style={styles.statusText}>
            KYC verification is mandatory for finalizing meets. This ensures safety for all users.
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleUpload}
          loading={uploading}
          disabled={!document || uploading}
          style={styles.button}
          buttonColor={Colors.primary}
        >
          Upload & Continue
        </Button>

        <Text style={styles.disclaimer}>Step 3 of 4</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
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
    marginBottom: 24,
  },
  documentContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  documentPreview: {
    position: 'relative',
  },
  documentImage: {
    width: 300,
    height: 200,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.background,
    borderRadius: 12,
  },
  documentPlaceholder: {
    width: 300,
    height: 200,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  optionButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '45%',
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  infoBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  statusBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  statusText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
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
