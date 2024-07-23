import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../styles/colors';

const ProductCard = ({product, onPress}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{uri: product.imageUrl}}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
   
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  color:'black'
  },
  price: {
    fontSize: 14,
    color: 'blue',
  },
});

export default ProductCard;
