import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, IconButton, Button } from 'react-native-paper';
import { format } from 'date-fns';
import { ChatAPI } from '../../api/chatApi';
import { Colors } from '../../utils/colors';

export default function ChatDetailScreen({ route, navigation }) {
  const { chatId, userName, userId, interestAccepted: initialInterestAccepted, user } = route.params;
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [interestAccepted, setInterestAccepted] = useState(initialInterestAccepted || false);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    if (chatId) {
      loadMessages();
    }
    navigation.setOptions({ title: userName });
  }, []);

  const loadMessages = async () => {
    try {
      const fetchedMessages = await ChatAPI.getMessages(chatId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Check if this is an initial message and interest not accepted
    if (!chatId && !interestAccepted) {
      try {
        setLoading(true);
        await ChatAPI.sendInitialMessage(userId, inputText);
        setMessageSent(true);
        Alert.alert(
          'Message Sent',
          'Your message has been sent. You can send more messages once they accept your interest.'
        );
        setInputText('');
      } catch (error) {
        Alert.alert('Error', 'Failed to send message');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!interestAccepted) {
      Alert.alert(
        'Limited Messaging',
        'You can only send one message before mutual interest is accepted.'
      );
      return;
    }

    try {
      setLoading(true);
      const newMessage = await ChatAPI.sendMessage(chatId, inputText);
      setMessages([...messages, newMessage]);
      setInputText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeMeet = () => {
    navigation.navigate('MeetStack', {
      screen: 'CreateMeet',
      params: { userId, userName },
    });
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.isOwn ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>
        {format(new Date(item.timestamp), 'HH:mm')}
      </Text>
    </View>
  );

  const canSendMessage = interestAccepted || (!chatId && !messageSent);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        inverted={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {!chatId
                ? 'Start the conversation'
                : 'No messages yet'}
            </Text>
          </View>
        }
      />

      {!interestAccepted && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            {messageSent || chatId
              ? 'You can send more messages once interest is accepted'
              : 'You can send one message before mutual interest'}
          </Text>
        </View>
      )}

      {interestAccepted && (
        <View style={styles.finalizeMeetBanner}>
          <Text style={styles.finalizeMeetText}>Interest accepted!</Text>
          <Button
            mode="contained"
            onPress={handleFinalizeMeet}
            style={styles.finalizeMeetButton}
            buttonColor={Colors.success}
          >
            Finalize Meet
          </Button>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          style={styles.input}
          mode="outlined"
          disabled={!canSendMessage || loading}
          outlineColor={Colors.border}
          activeOutlineColor={Colors.primary}
          multiline
          maxLength={500}
        />
        <IconButton
          icon="send"
          size={24}
          iconColor={Colors.primary}
          onPress={handleSend}
          disabled={!canSendMessage || !inputText.trim() || loading}
          style={styles.sendButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.cardBackground,
  },
  messageText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    alignSelf: 'flex-end',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  warningBanner: {
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  warningText: {
    fontSize: 13,
    color: Colors.primary,
    textAlign: 'center',
  },
  finalizeMeetBanner: {
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  finalizeMeetText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
  },
  finalizeMeetButton: {
    paddingHorizontal: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: Colors.background,
  },
  sendButton: {
    margin: 0,
  },
});
