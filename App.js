import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView, StyleSheet} from 'react-native';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ProductChatScreen from './src/screens/ProductChatScreen';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen'; // Import the new screen

// Import components
import BottomTabNavigator from './src/navigation/BottomTabNavigator'; // Import the BottomTabNavigator
import ChatsListScreen from './src/screens/ChatsListScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProductsListScreen from './src/screens/ProductsListScreen';

// Define Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <Stack.Navigator
          initialRouteName="AuthLoading" // Set the initial route to AuthLoadingScreen
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FF4C4C', // Primary color
            },
            headerTintColor: '#FFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="AuthLoading"
            component={AuthLoadingScreen}
            options={{headerShown: false}} // Hides header for AuthLoadingScreen
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}} // Hides header for LoginScreen
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{title: 'Register'}}
          />
          <Stack.Screen
            name="BottomTabs"
            component={BottomTabNavigator}
            options={{headerShown: false}} // Hides header for BottomTabNavigator
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProductChat"
            component={ProductChatScreen}
            options={{title: 'Product Chat'}}
          />
          <Stack.Screen
            name="ChatsListScreen"
            component={ChatsListScreen}
            options={{title: 'Chats'}}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="ProductsList" component={ProductsListScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

// Styles for the App container
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

export default App;
