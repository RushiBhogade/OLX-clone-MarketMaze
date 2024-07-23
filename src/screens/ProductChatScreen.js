// screens/ProductChatScreen.js

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {fetchChatHistory, sendMessage} from '../utils/api'; 
import {COLORS} from '../styles/colors';

const ProductChatScreen = ({route, navigation}) => {
  const {productId} = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChatHistory = async () => {
      // Fetch chat history related to the productId
      const chatHistory = await fetchChatHistory(productId);
      setMessages(chatHistory);
      setLoading(false);
    };

    loadChatHistory();
  }, [productId]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      // Send new message
      await sendMessage(productId, newMessage);
      setMessages([
        ...messages,
        {id: messages.length + 1, text: newMessage, sender: 'user'},
      ]);
      setNewMessage('');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat for Product {productId}</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View
            style={[
              styles.message,
              item.sender === 'user'
                ? styles.userMessage
                : styles.sellerMessage,
            ]}>
            <Text>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
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

export default ProductChatScreen;
