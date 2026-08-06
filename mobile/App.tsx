import { registerRootComponent } from 'expo';
import { View, Text } from 'react-native';

function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0B0F1A', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>PLAIN VIEW TEST</Text>
    </View>
  );
}

registerRootComponent(App);
