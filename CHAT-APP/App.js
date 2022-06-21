import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import AddChat from './screens/AddChat';
import Chat from './screens/Chat';
import { AuthContext, AuthContextProvider } from './context/AuthContext';
import { useContext } from 'react';
import {dotenv} from "dotenv";


dotenv.config();

const Stack = createStackNavigator();
const globalScreenOptions = {
  headerStyle:{backgroundColor: '#2C6BED'},
  headerTitleStyle: {color:'white'},
  headerTintColor: 'white',
  headerTitleAlign:'center',
 
};

export default function App() {
  const {user} = useContext(AuthContext);
  return (
    <NavigationContainer>
      <AuthContextProvider>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Register' component={Register}/>
        <Stack.Screen name='Home' component={Home}/>
        <Stack.Screen name='AddChat' component={AddChat}/>
        <Stack.Screen name='Chat' component={Chat}/>
      </Stack.Navigator>
      </AuthContextProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
