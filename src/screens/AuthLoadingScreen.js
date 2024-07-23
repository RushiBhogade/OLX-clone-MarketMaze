// screens/AuthLoadingScreen.js

import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthLoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          navigation.navigate('BottomTabs');
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Failed to check authentication status:', error);
        navigation.navigate('Login');
      }
    };

    checkAuth();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF4C4C" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});

export default AuthLoadingScreen;
