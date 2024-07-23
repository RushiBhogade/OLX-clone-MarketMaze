import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../styles/colors';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password');
      return;
    }

    try {
      // Fetch user document from Firestore by email
      const userSnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();

      if (userSnapshot.empty) {
        throw new Error('Email or password is incorrect');
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      // Check if the password matches
      if (userData.password !== password) {
        throw new Error('Email or password is incorrect');
      }

      // Authenticate user with Firebase
      await auth().signInWithEmailAndPassword(email, password);

      // Store user data in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify({email}));

      // Navigate to Home screen upon successful login
      navigation.navigate('BottomTabs');
    } catch (error) {
      // Display an alert if login fails
      console.error(error);
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../utils/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Please login to continue</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter your email"
        placeholderTextColor="#AAA"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your password"
        placeholderTextColor="#AAA"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAA',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#FFF',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#222',
    color: '#FFF',
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
