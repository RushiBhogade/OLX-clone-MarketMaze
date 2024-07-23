// navigation/BottomTabNavigator.js

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CreateListingScreen from '../screens/CreateListingScreen';
import ChatScreen from '../screens/ChatScreen';
import SellerProductsScreen from '../screens/SellerProductsScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faHome,
  faPlusCircle,
  faComments,
  faBox,
} from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons
import {COLORS} from '../styles/colors';
import ChatsListScreen from '../screens/ChatsListScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let icon;

          switch (route.name) {
            case 'Home':
              icon = faHome;
              break;
            case 'CreateListing':
              icon = faPlusCircle;
              break;
            case 'ChatsListScreen':
              icon = faComments;
              break;
            case 'SellerProducts':
              icon = faBox;
              break;
            default:
              icon = faBox; // Default icon if needed
          }

          return <FontAwesomeIcon icon={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary, // Set active tint color
        tabBarInactiveTintColor: 'white', // Set inactive tint color
        tabBarStyle: {
          backgroundColor: 'black', // Set tab bar background color
          borderTopWidth: 0, // Optionally remove border
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="CreateListing"
        component={CreateListingScreen}
        options={{headerShown: false}}
      />
   
      <Tab.Screen
        name="SellerProducts"
        component={SellerProductsScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="ChatsListScreen"
        component={ChatsListScreen}
        options={{title: 'Chats'}}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  // Add styles if needed
});

export default BottomTabNavigator;
