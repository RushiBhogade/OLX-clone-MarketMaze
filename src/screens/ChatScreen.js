import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../styles/colors';
import {useFocusEffect} from '@react-navigation/native';

const ChatScreen = ({route, navigation}) => {
  const {sellerEmail, sellerName} = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Fetch user email from AsyncStorage
  const fetchUserEmail = useCallback(async () => {
    try {
      const email = await AsyncStorage.getItem('user');
      if (email) {
        setUserEmail(email);
        console.log('User email fetched from AsyncStorage:', email);
      }
    } catch (error) {
      console.error('Failed to fetch user email from AsyncStorage:', error);
    }
  }, []);

  // Subscribe to messages when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchUserEmail(); // Fetch user email on screen focus

      let unsubscribe;
      if (userEmail && sellerEmail) {
        unsubscribe = firestore()
          .collection('chats')
          .where('users', 'array-contains-any', [sellerEmail, userEmail])
          .orderBy('timestamp', 'desc') // Order messages by timestamp
          .onSnapshot(
            snapshot => {
              const fetchedMessages = [];
              if (snapshot && snapshot.docs) {
                snapshot.docs.forEach(doc => {
                  const messageData = {...doc.data(), id: doc.id};

                  // Filter messages to show only those between the user and seller
                  if (
                    (messageData.senderEmail === userEmail &&
                      messageData.receiverEmail === sellerEmail) ||
                    (messageData.senderEmail === sellerEmail &&
                      messageData.receiverEmail === userEmail)
                  ) {
                    fetchedMessages.push(messageData);
                  }
                });
                setMessages(fetchedMessages);
              }
            },
            error => {
              console.error('Error fetching messages from Firestore:', error);
            },
          );
      }

      // Cleanup on unmount
      return () => {
        console.log('Unsubscribing from Firestore updates');
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [fetchUserEmail, userEmail, sellerEmail]),
  );

  // Fetch user email when component mounts
  useEffect(() => {
    fetchUserEmail();
  }, [fetchUserEmail]);

  const handleSend = async () => {
    if (newMessage.trim() && userEmail) {
      try {
        await firestore()
          .collection('chats')
          .add({
            text: newMessage,
            senderEmail: userEmail,
            receiverEmail: sellerEmail,
            timestamp: firestore.FieldValue.serverTimestamp(),
            users: [sellerEmail, userEmail], // Added for query filtering
          });
        console.log('Message sent:', {
          text: newMessage,
          senderEmail: userEmail,
          receiverEmail: sellerEmail,
        });

        setNewMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat with {sellerName}</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={[
              styles.message,
              item.senderEmail === userEmail
                ? styles.userMessage
                : styles.sellerMessage,
            ]}>
            <Text>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
        inverted // To show the latest messages at the bottom
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={handleSend} color={COLORS.primary} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    padding: 16,
  },
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.secondary,
    color: '#FFF',
  },
  sellerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
