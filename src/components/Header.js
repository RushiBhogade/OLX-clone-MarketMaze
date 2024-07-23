// components/Header.js

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {COLORS} from '../styles/colors'; // Ensure COLORS contains your color values

const Header = ({navigation}) => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              // Clear AsyncStorage
              await AsyncStorage.clear();
              // Navigate to the login page
              navigation.navigate('Login'); // Replace 'Login' with your actual login screen name
            } catch (error) {
              console.error('Failed to clear AsyncStorage:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Market Maze</Text>
      <TouchableOpacity onPress={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: COLORS.primary, // Set header background color
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // Title color
  },
  menu: {
    color: '#000', // Menu color
    fontSize: 16,
  },
  add: {
    color: '#000', // Add button color
    fontSize: 16,
  },
});

export default Header;
