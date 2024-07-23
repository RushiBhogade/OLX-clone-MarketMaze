import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft, faImage, faCheck} from '@fortawesome/free-solid-svg-icons';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {COLORS} from '../styles/colors';

const OPENSTREETMAP_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';
const FORMAT = 'json';

const CreateListingScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [fetchingLocation, setFetchingLocation] = useState(true);

  useEffect(() => {
    fetchSellerEmail();
    requestLocationPermission();
  }, []);

  const fetchSellerEmail = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      if (user && user.email) {
        setSellerEmail(user.email);
      } else {
        console.error('No user email found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching user data from AsyncStorage:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const status = await Geolocation.requestAuthorization();
        if (status === 'granted') {
          getLocation();
        } else {
          handleLocationError(new Error('Location permission denied'));
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to function properly.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          handleLocationError(new Error('Location permission denied'));
        }
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      handleLocationError(error);
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        setLocation(position.coords);
        const locationName = await reverseGeocode(
          position.coords.latitude,
          position.coords.longitude,
        );
        setLocationName(locationName);
        setFetchingLocation(false);
      },
      error => {
        console.error('Error fetching location:', error);
        handleLocationError(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const apiUrl = `${OPENSTREETMAP_ENDPOINT}?format=${FORMAT}&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(apiUrl);
      const jsonResponse = await response.json();
      return jsonResponse.display_name || 'Unknown';
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return 'Unknown';
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        console.error('Image Picker Error:', response.errorCode);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const {uri, fileName} = response.assets[0];
        setImageUri(uri);

        // Upload image to Firebase Storage
        const reference = storage().ref(`images/${fileName}`);
        await reference.putFile(uri);
        const imageUrl = await reference.getDownloadURL();

        // Save image URL to Firestore
        await saveListing(imageUrl);
      }
    });
  };

  const saveListing = async imageUrl => {
    if (!title || !price || !description || !imageUri) {
      Alert.alert('Error', 'Please fill in all fields and select an image');
      return;
    }

    try {
      const listingData = {
        title,
        price,
        description,
        imageUrl, // Use the image URL string
        sellerEmail,
        location: locationName,
      };

      console.log('Saving listing data:', listingData);

      await firestore().collection('listings').add(listingData);
      Alert.alert('Success', 'Listing created successfully');

      // Clear fields after successful submission
      setTitle('');
      setPrice('');
      setDescription('');
      setImageUri('');
      setLocation(null);
      setLocationName('');

      navigation.goBack();
    } catch (error) {
      console.error('Error saving listing:', error);
      Alert.alert('Error', 'Failed to create listing: ' + error.message);
    }
  };

  const handleLocationError = error => {
    setFetchingLocation(false);
    setLocationName('Location unavailable');
    console.error('Location error:', error);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing</Text>
        <View style={{width: 24}} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          placeholderTextColor="#999"
        />
        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="Enter price"
          placeholderTextColor="#999"
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Enter description"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.button} onPress={handleImagePick}>
          <FontAwesomeIcon icon={faImage} size={20} color="black" />
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>
        {imageUri ? (
          <Text style={styles.imageSelected}>Image selected</Text>
        ) : null}
        <Text style={styles.label}>Location: {locationName}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => saveListing(imageUri)}
          disabled={fetchingLocation}>
          <FontAwesomeIcon icon={faCheck} size={20} color="black" />
          <Text style={styles.buttonText}>
            {fetchingLocation ? 'Fetching Location...' : 'Submit Listing'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    color: '#FFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: '#FFF',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
  },
  imageSelected: {
    fontSize: 16,
    color: '#FFF',
    marginVertical: 8,
  },
});

export default CreateListingScreen;
