import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {COLORS} from '../styles/colors';

const SellerProductsScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadProducts = async () => {
        try {
          const sellerData = await AsyncStorage.getItem('user');
          const sellerEmail = JSON.parse(sellerData).email;
          console.log('Seller Email from AsyncStorage:', sellerEmail);

          if (!sellerEmail) {
            throw new Error('Seller email not found in AsyncStorage');
          }

          const fetchedProducts = await firestore()
            .collection('listings')
            .get();

          const productsList = fetchedProducts.docs.map(doc => {
            const data = doc.data();
            data.id = doc.id;
            return data;
          });

          console.log('Fetched Products:', productsList);

          const sellerProducts = productsList.filter(
            product => product.sellerEmail === sellerEmail,
          );

          console.log('Seller Products:', sellerProducts);
          setProducts(sellerProducts);
        } catch (error) {
          console.error('Error loading products:', error);
        } finally {
          setLoading(false);
        }
      };

      loadProducts();
    }, []),
  );

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Products</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() =>
              navigation.navigate('ProductsList', {productId: item.id})
            }>
            <Image source={{uri: item.imageUrl}} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>${item.price}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: COLORS.primary,
  },
  productCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    borderColor: '#DDDDDD',
    borderWidth: 1,
  },
  productDetails: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333333',
  },
  price: {
    fontSize: 16,
    color: COLORS.secondary,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
  },
  listContainer: {
    paddingBottom: 16,
  },
});

export default SellerProductsScreen;
