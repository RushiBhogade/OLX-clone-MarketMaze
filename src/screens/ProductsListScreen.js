import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../styles/colors';

const ProductsListScreen = ({navigation}) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Fetch user email from AsyncStorage
    const fetchUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('user');
        if (email) {
          setUserEmail(email); // Ensure no extra spaces
          console.log(userEmail,"userEmail")
        } else {
          setError('User email not found in AsyncStorage');
        }
      } catch (err) {
        console.error('Failed to fetch user email from AsyncStorage:', err);
        setError('Failed to fetch user email');
      } finally {
        setLoading(false);
      }
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (userEmail) {
      const fetchChats = async () => {
        try {
          const snapshot = await firestore().collection('chats').get();
          const fetchedChats = [];
          snapshot.forEach(doc => {
            const chatData = {...doc.data(), id: doc.id};
            console.log('Firestore Data:', chatData);

            // Check and parse senderEmail if necessary
            let senderEmail = '';
            try {
              senderEmail = JSON.parse(chatData.senderEmail).email;
            } catch (e) {
              senderEmail = chatData.senderEmail; // Fallback if not a JSON string
            }

            console.log('Parsed Sender Email:', senderEmail);

            // Check if receiverEmail matches userEmail
            if (
              chatData.receiverEmail &&
              chatData.receiverEmail.trim() === userEmail
            ) {
              fetchedChats.push(chatData);
            } else {
              console.log(
                `Skipping chat with receiverEmail: ${chatData.receiverEmail} (does not match ${userEmail})`,
              );
            }
          });

          console.log('Fetched Chats:', fetchedChats);
          setChats(fetchedChats);
        } catch (err) {
          setError('Failed to fetch chats');
          console.error('Error fetching chats:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchChats();
    } else if (!loading) {
      setError('User email is not defined');
    }
  }, [userEmail, loading]);

  const renderChatItem = ({item}) => (
    <View style={styles.chatItem}>
      <Text style={styles.chatText}>From: {item.senderEmail}</Text>
      <Text style={styles.chatText}>To: {item.receiverEmail}</Text>
      <Text style={styles.chatText}>Message: {item.text}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  chatItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chatText: {
    marginBottom: 5,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default ProductsListScreen;
