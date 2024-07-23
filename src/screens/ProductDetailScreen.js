import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import {fetchProductDetails} from '../utils/api';
import {COLORS} from '../styles/colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faStar,
  faStarHalfAlt,
  faStarOutline,
  faMapMarkerAlt,
  faCommentDots,
  faChat,
  faShoppingCart,
  faComments,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';

const ProductDetailScreen = ({route, navigation}) => {
  const {productId} = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const fetchedProduct = await fetchProductDetails(productId);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Product not found</Text>
      </View>
    );
  }

  const {location} = product;

  const openMap = () => {
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location,
      )}`;
      Linking.openURL(url);
    } else {
      console.warn('Location is not defined');
    }
  };

  const renderStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`full-${i}`}
          icon={faStar}
          size={20}
          color={COLORS.primary}
        />,
      );
    }

    if (halfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half"
          icon={faStarHalfAlt}
          size={20}
          color={COLORS.primary}
        />,
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={faStarOutline}
          size={20}
          color={COLORS.primary}
        />,
      );
    }

    return stars;
  };

  const rating = product.rating ? product.rating.rate : 0;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground
        source={{uri: product.imageUrl || 'https://via.placeholder.com/300'}}
        style={styles.imageBackground}
        resizeMode="cover">
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}>
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.ratingContainer}>
            {renderStars(rating)}
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
      <View style={styles.details}>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <TouchableOpacity style={styles.mapButton} onPress={openMap}>
          <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color="#FFF" />
          <Text style={styles.mapButtonText}>
            {location || 'Location not available'}
          </Text>
        </TouchableOpacity>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => {
              const sellerEmail = product.sellerEmail;

              // Log the data being sent
              console.log('Navigating to Chat with data:', {
                sellerEmail,
              });

              // Navigate to Chat screen with sellerEmail
              navigation.navigate('Chat', {sellerEmail});
            }}>
            <FontAwesomeIcon icon={faComments} size={20} color="#FFF" />
            <Text style={styles.buttonText}>Contact Seller</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => console.log('Buy Now pressed')}>
            <FontAwesomeIcon icon={faShoppingCart} size={20} color="#FFF" />
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  imageBackground: {
    width: '100%',
    height: 400,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  details: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -10},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 20,
    color: '#FFF',
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 30,
    lineHeight: 26,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 15,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  buyButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 15,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  mapButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    margin:3
  },
  mapButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});

export default ProductDetailScreen;
