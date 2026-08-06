import React from 'react';
import { View, Text } from 'react-native';

export default function RootNavigator() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0B0F1A', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>NAV MINIMAL</Text>
    </View>
  );
}
