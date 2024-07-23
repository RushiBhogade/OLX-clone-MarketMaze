// components/Footer.js

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../styles/colors';

const Footer = () => (
  <View style={styles.footer}>
    <Text style={styles.text}>© 2024 OLX Clone</Text>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    // padding: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  text: {
    color: '#FFF',
  },
});

export default Footer;
