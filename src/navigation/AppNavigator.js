import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AdDetailScreen from '../screens/AdDetailScreen';
import PostAdScreen from '../screens/PostAdScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AdDetail" component={AdDetailScreen} />
      <Stack.Screen name="PostAd" component={PostAdScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
