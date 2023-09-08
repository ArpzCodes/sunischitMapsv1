import React, {useState} from "react";
import { View, Dimensions,Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { firebase } from "../config";

import { useNavigation } from "@react-navigation/native";
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation();
  const signOutUser = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        const removeCredentials = async () => {
          try {
            await AsyncStorage.removeItem('userEmail');
            await AsyncStorage.removeItem('userPassword');
            console.log('Credentials removed from AsyncStorage');
          } catch (error) {
            console.error('Error removing credentials:', error);
          }
        };
        
        // Call the function when you want to remove the credentials
        // For example, when the user logs out
        removeCredentials();

        console.log("successfully signed out");
        navigation.replace("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [fontsLoaded] = useFonts({
    'JosefinSans_400Regular': require('../assets/fonts/JosefinSans-Regular.ttf'),
    'JosefinSans_700Bold': require('../assets/fonts/JosefinSans-Bold.ttf')
  });
 

  const handleChangePassword = () => {
    navigation.navigate("ChangePasswordScreen");
  };
  if (!fontsLoaded) {
    return null; // Render a loading screen or fallback component
  }

  return (
    <View style={styles.headerContainer}>
    <View style={styles.menu}>
      <View style={styles.menuItems}>
      <TouchableOpacity style={styles.menuItem} onPress={toggleMenu}>
        <Image
          style={{ height: 30, width: 30 }}
          source={require('../assets/hamburger.png')}
        />
      </TouchableOpacity>
        {menuOpen && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleChangePassword}
          >
            <Image
              style={{ height: 15, width: 28 }}
              source={require('../assets/key.png')}
            />
            <Text style={styles.menuText}>Change Password</Text>
          </TouchableOpacity>
        )}
        {menuOpen && (
          <TouchableOpacity style={styles.menuItem} onPress={signOutUser}>
            <Image
              style={{ height: 30, width: 30 }}
              source={require('../assets/logout.png')}
            />
            <Text style={styles.menuText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>
     
    </View>
  </View>
);
};
export default Header;

const styles = {
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  menuItems: {
    flexDirection: 'row',
    position: 'absolute',
    
    right: 10, // Adjust this value as needed
   
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuText: {
    marginLeft: 10,
    color:"#FFFFFF",
    fontFamily:"JosefinSans_400Regular"
  },
};