import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const ProfileScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Button
        title="Edit Profile"
        onPress={() => {
          /* Navigate to edit profile */
        }}
      />
      <Button
        title="Log Out"
        onPress={() => {
          /* Handle log out */
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
