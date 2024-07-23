import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../styles/colors';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

const ChatsListScreen = ({navigation}) => {
  const [chats, setChats] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  const fetchUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('user');
      if (email) {
        setUserEmail(email);
      }
    } catch (error) {
      console.error('Failed to fetch user email from AsyncStorage:', error);
    }
  };

  const fetchChats = useCallback(() => {
    if (userEmail) {
      const unsubscribe = firestore()
        .collection('chats')
        .where('users', 'array-contains', userEmail)
        .onSnapshot(snapshot => {
          const fetchedChats = [];
          snapshot.forEach(doc => {
            const chatData = doc.data();
            fetchedChats.push({...chatData, id: doc.id});
          });
          setChats(fetchedChats);
        });

      return () => {
        console.log('Unsubscribing from Firestore updates');
        unsubscribe();
      };
    }
  }, [userEmail]);

  useFocusEffect(
    useCallback(() => {
      fetchUserEmail(); // Fetch user email whenever the screen gains focus
      return fetchChats(); // Fetch chats and set up Firestore listener whenever the screen gains focus
    }, [fetchUserEmail, fetchChats]),
  );

  const handleChatPress = chat => {
    // Parse senderEmail if it's a JSON string
    let sellerEmail;
    try {
      const senderEmailObj = JSON.parse(chat.senderEmail);
      sellerEmail = senderEmailObj.email; // Access the 'email' field
    } catch (error) {
      console.error('Error parsing senderEmail:', error);
      sellerEmail = null; // Set a default value if parsing fails
    }

    // Log the data to be sent to the next screen
    console.log('Navigating to ChatScreen with data:', {
      sellerEmail: sellerEmail,
    });

    // Navigate to ChatScreen with chat details
    navigation.navigate('Chat', {
      sellerEmail: sellerEmail, // Pass the extracted email
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => handleChatPress(item)}>
            <View style={styles.avatarContainer}>
              <Image
                source={{uri: 'https://via.placeholder.com/50'}}
                style={styles.avatar}
              />
            </View>
            <View style={styles.chatContent}>
              <Text style={styles.chatTitle}>{item.receiverEmail}</Text>
              <Text style={styles.chatLastMessage}>{item.text}</Text>
              <Text style={styles.chatTimestamp}>
                {moment(item.timestamp?.toDate()).fromNow()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.chatsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0', // Light background color for the whole screen
  },
  chatsContainer: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#FFF', // White background for each chat item
    borderRadius: 10, // Rounded corners for each chat item
    marginBottom: 10, // Space between chat items
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0', // Placeholder color
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#999',
  },
});

export default ChatsListScreen;
