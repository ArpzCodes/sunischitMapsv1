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
  import React, { useEffect, useState } from "react";
  import { useNavigation } from "@react-navigation/native";
  import { firebase, firebaseConfig } from "../config";
//   import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold  } from '@expo-google-fonts/josefin-sans';
  
  // firebase.initializeApp(firebaseConfig);
  const Login = () => {
    
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
  
    
  
    // let [fontsLoaded] = useFonts({
    //   JosefinSans_400Regular,
    //   JosefinSans_700Bold,
    // });
  
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
  
    // if (!fontsLoaded) {
    //   return null; // Render a loading screen or fallback component
    // }
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
    const LoginUser = async (email, password) => {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
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
          source={require("../assets/schoolLogo.png")}
          style={{ height: Dimensions.get("window").width-100, width: Dimensions.get("window").width-90, marginTop:10, marginBottom:-25 }}
          resizeMode="contain"
        /> */}
  
         <Text style={{  fontSize:35 }}>Login</Text>    
         {/* <Text style={{ fontFamily:"JosefinSans_700Bold", fontSize:35 }}>Login</Text>     */}
        
        <Text style={{  fontSize: 26, marginTop: 10 }}>
        {/* <Text style={{ fontFamily:"JosefinSans_400Regular", fontSize: 26, marginTop: 10 }}> */}
    Test <Text style={{ color: "#FFAD7F" }}>Sunischit</Text> App   
        {/* Kanjirowa <Text style={{ fontFamily:"JosefinSans_400Regular",color: "#FFAD7F" }}>Sunischit</Text> App    */}
        </Text>
  
        <View style={{ marginTop: 20 }}>
          <View style={{display:"flex", flexDirection:"row", alignContent:'center', alignItems:"center", }}>
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
         
          <View style={{display:"flex", flexDirection:"row", alignContent:'center', alignItems:"center", }}>
  
  
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
          <Text style={{  color:"#FFFFFF", fontSize: 22 }}>Login</Text>
          {/* <Text style={{ fontFamily:"JosefinSans_400Regular", color:"#FFFFFF", fontSize: 22 }}>Login</Text> */}
        </TouchableOpacity>
  
        <TouchableOpacity
          onPress={() => {
            forgetPassword();
          }}
          style={{ marginTop: 10 }}
        >
          <Text style={{  textDecorationLine:"underline", fontSize: 14, textAlign: "center" }}>
          {/* <Text style={{  fontFamily:"JosefinSans_400Regular", textDecorationLine:"underline", fontSize: 14, textAlign: "center" }}> */}
            Forgot Password 
          </Text> 
          
        </TouchableOpacity>
        <Text style={{ paddingTop: 30, fontSize: 17 }}>
        {/* <Text style={{ paddingTop: 30, fontFamily:"JosefinSans_400Regular", fontSize: 17 }}> */}
          Assuring your child's saftey.
        </Text>
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
       
    },
    textInput: {
      height: 60,
      paddingTop: 20,
      paddingBottom: 20,
      width: 230,
      color: "#FFFFFF",
    //   fontFamily:"JosefinSans_400Regular",
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
      width: 250,
      backgroundColor: "#ed1c24",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
    },
  });
  