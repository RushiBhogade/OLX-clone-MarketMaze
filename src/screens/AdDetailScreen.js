import React from 'react';
import {View, Text, Image} from 'react-native';

const AdDetailScreen = ({route}) => {
  const {ad} = route.params;

  return (
    <View>
      <Text>{ad.title}</Text>
      <Text>{ad.description}</Text>
      <Text>{ad.price}</Text>
      <Image source={{uri: ad.imageUrl}} style={{width: 200, height: 200}} />
    </View>
  );
};

export default AdDetailScreen;
