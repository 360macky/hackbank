import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Form from './src/screens/Form';
import Prediction from './src/screens/Prediction';
import About from './src/screens/About';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Hackbank"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Hackbank" component={Form} />
          <Stack.Screen name="Prediction" component={Prediction} />
          <Stack.Screen name="Acerca de" component={About} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar
        backgroundColor="#006C4B"
        style="light"
        barStyle="dark-content"
      />
    </SafeAreaProvider>
  );
}
