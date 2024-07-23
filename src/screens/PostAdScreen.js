import React, {useState} from 'react';
import {View, Text, TextInput, Button, Image} from 'react-native';
import {db, storageRef, authRef} from '../services/firebase';
import * as ImagePicker from 'react-native-image-picker';

const PostAdScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleChooseImage = () => {
    ImagePicker.launchImageLibrary({}, response => {
      if (response.uri) {
        setImage(response);
      }
    });
  };

  const handlePostAd = async () => {
    const currentUser = authRef.currentUser;
    if (currentUser) {
      try {
        const imageUrl = await uploadImage();
        await db.collection('ads').add({
          title,
          description,
          price,
          imageUrl,
          userId: currentUser.uid,
        });
        navigation.navigate('Home');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const uploadImage = async () => {
    if (image) {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const ref = storageRef.ref().child(`images/${image.fileName}`);
      await ref.put(blob);
      return ref.getDownloadURL();
    }
    return null;
  };

  return (
    <View>
      <Text>Title:</Text>
      <TextInput value={title} onChangeText={setTitle} />
      <Text>Description:</Text>
      <TextInput value={description} onChangeText={setDescription} />
      <Text>Price:</Text>
      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Button title="Choose Image" onPress={handleChooseImage} />
      {image && (
        <Image source={{uri: image.uri}} style={{width: 100, height: 100}} />
      )}
      <Button title="Post Ad" onPress={handlePostAd} />
    </View>
  );
};

export default PostAdScreen;
