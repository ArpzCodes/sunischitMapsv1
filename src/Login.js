import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  Dimensions
} from "react-native";
import React, { useEffect, useState,useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase, firebaseConfig } from "../config";

import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';


// SplashScreen.preventAutoHideAsync();
// firebase.initializeApp(firebaseConfig);
const Login = () => {
  
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [fontsLoaded] = useFonts({
    'JosefinSans_400Regular': require('../assets/fonts/JosefinSans-Regular.ttf'),
    'JosefinSans_700Bold': require('../assets/fonts/JosefinSans-Bold.ttf')
  });
  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        // Check if there are saved credentials
        const userEmail = await AsyncStorage.getItem('userEmail');
        const userPassword = await AsyncStorage.getItem('userPassword');

        if (userEmail && userPassword) {
          // Attempt automatic login with saved credentials
          await firebase.auth().signInWithEmailAndPassword(userEmail, userPassword);
          // Proceed with navigation to the dashboard
        }
      } catch (error) {
        console.error('Error checking auto-login:', error);
      }
    };

    checkAutoLogin();
  }, []);
 

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged((authUser) => {
      console.log(authUser);
      if (authUser) {
        firebase
          .firestore()
          .collection("drivers")
          .doc(firebase.auth().currentUser.uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
           
              navigation.replace("DriverDashboard");
            } else {
              firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .get()
                .then((snapshot) => {
                  if (snapshot.exists) {
                    navigation.replace("Dashboard");
                  }
                });
            }
          });
      }
    });

    return subscriber;
  }, []);

  if (!fontsLoaded) {
    return null; // Render a loading screen or fallback component
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const LoginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPassword', password);
    } catch (error) {
      alert(error);
    }
  };
  //forget password

  const forgetPassword = () => {
    navigation.navigate("Forget Password");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      {/* <Image
        source={require("../assets/logo.png")}
        style={{  width: Dimensions.get("window").width-80, marginTop:15 }}
        resizeMode="contain"
      /> */}
<View style={styles.container}>
       <Text style={{ fontFamily:"JosefinSans_700Bold", fontWeight:"100", fontSize:40, marginTop:60 }}>Sign In</Text>    
      
  <View style={{marginTop:10}}>
  <Text style={{ fontFamily:"JosefinSans_400Regular", fontSize: 28, marginTop: 15, }}>
    
    The <Text style={{ fontFamily:"JosefinSans_400Regular",color: "#FFAD7F",fontSize: 28,   }}>Sunischit</Text> App   
    </Text>

  </View>
      

      <View style={{ marginTop: 15 }}>
        <View style={{display:"flex", marginTop:15, flexDirection:"row", alignContent:'center', alignItems:"center", }}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor={"#ffffff"}
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.mail}>
        <Image
        source={require("../assets/mail.png")}
        style={{ width: 31, height: 26, }}
      />
        </View>

        </View>
       
        <View style={{display:"flex", flexDirection:"row", marginTop:8, alignContent:'center', alignItems:"center", }}>


        <TextInput
        style={styles.textInput}
        placeholder="Password"
        onChangeText={password => setPassword(password)}
        placeholderTextColor="#ffffff"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={!showPassword}
      />
<View style={styles.mail}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={togglePasswordVisibility}
      >
         
        <Image
        style={{height:21,width:34}}
        source={require("../assets/eye.png")}
          name={showPassword ? 'visibility-off' : 'visibility'}
          size={24}
          color="#ffffff"
        />
      </TouchableOpacity>
      </View>
      </View>
      </View>

      <TouchableOpacity
        onPress={() => LoginUser(email, password)}
        style={styles.button}
      >
      
        <Text style={{ fontFamily:"JosefinSans_400Regular", color:"#FFFFFF", fontSize: 22 }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          forgetPassword();
        }}
        style={{ marginTop: 17 }}
      >
        
        <Text style={{  fontFamily:"JosefinSans_400Regular", textDecorationLine:"underline", fontSize: 14, textAlign: "center" }}>
          Forgot Password 
        </Text> 
        
      </TouchableOpacity>
      
      <Text style={{ marginTop:18, fontFamily:"JosefinSans_400Regular", fontSize: 17 }}>
        Assuring your child's saftey.
      </Text>
      <View style={styles.bottomContainer}>
      <Image
        source={require("../assets/filler.png")}
        style={{ width:100 , height: 80, }}
      />
      

      </View>
      </View>
        
   
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: "#FFFFFF",
    flex: 1,
    alignItems: "center",
    alignContent:"center",
    justifyContent:"center",
     height: Dimensions.get("window").height,
     width:Dimensions.get("window").width
     
  },
 
  realContainer:{

    marginTop:10,
      backgroundColor: "#FFFFFF",
      flex: 1,
      alignItems: "center",
      alignContent:"center",
      justifyContent:"center",
       height: Dimensions.get("window").height,
       

  },
  textInput: {
    height: 60,
    marginTop:10,
    paddingTop: 20,
    paddingBottom: 20,
    width: 230,
    color: "#FFFFFF",
    fontFamily:"JosefinSans_400Regular",
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#0000",
    backgroundColor: "#379CDF",
    marginBottom: 10,
    textAlign: "center",
    borderRadius: 8,
    textDecorationLine:"none"
  },
  mail:{
    marginTop:10,
    height:60,
    backgroundColor: "#379CDF",
    width: 70,
    borderRadius: 8,
    marginBottom: 10,
    marginLeft:-15,
    alignItems:"center",
    justifyContent:"center"

  },
  button: {
    marginTop: 15,
    height: 60,
    width: 180,
    backgroundColor: "#558968",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
  },
  
  bottomContainer:{
    paddingTop: 20,

  }
});
