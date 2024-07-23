// utils/api.js

const API_URL = 'https://fakestoreapi.com/products'; // Replace with actual API URL
import firestore from '@react-native-firebase/firestore';
export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductDetails = async productId => {
  try {
    const productDoc = await firestore()
      .collection('listings')
      .doc(productId)
      .get();
    if (productDoc.exists) {
      return productDoc.data();
    } else {
      console.error('Product not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
};

export const fetchChatHistory = async productId => {
  // Replace with actual API endpoint
  try {
    const response = await fetch(`https://api.example.com/chats/${productId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

export const sendMessage = async (productId, message) => {
  // Replace with actual API endpoint
  try {
    const response = await fetch(`https://api.example.com/chats/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message}),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};
