import { StyleSheet, Text, Image,View, TextInput,Button} from 'react-native'
import React ,{useState} from 'react'
import { firebase, firebaseConfig } from "../config";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

const ForgetPass = () => {
    const [email, setEmail] = useState("");
    const [fontsLoaded] = useFonts({
      'JosefinSans_400Regular': require('../assets/fonts/JosefinSans-Regular.ttf'),
      'JosefinSans_700Bold': require('../assets/fonts/JosefinSans-Bold.ttf')
    });

    const forgetPassword = () => {

        firebase
          .auth()
          .sendPasswordResetEmail(email)
          .then(() => {
            alert("Password reset email sent");
          })
          .catch((error) => {
            alert(error);
          });

          alert("Email Sent")
      };
    //   if (!fontsLoaded) {
    //     return null; // Render a loading screen or fallback component
    //   }
  return (
    <View style={styles.container}>
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
        style={{ width: 35, height: 30, }}
      />
        </View>

        </View>
<TouchableOpacity style={styles.button} onPress={() => {
          forgetPassword();
        }} >
       
          <Text style={{color:"#FFFFFF", fontFamily:"JosefinSans_400Regular"}}>Send Password Reset Mail </Text>
  
</TouchableOpacity>
     
    </View>
  )
}

export default ForgetPass


const styles = StyleSheet.create({
    container: {
      backgroundColor: "#FFFFFF",
      flex: 1,
      alignItems: "center",
      alignContent:"center",
      justifyContent:"center"
    },
    textInput: {
      height: 60,
      paddingTop: 20,
      paddingBottom: 20,
      width: 230,
      fontFamily:"JosefinSans_400Regular",
      color: "#FFFFFF",
      fontSize: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#0000",
      backgroundColor: "#379CDF",
      marginBottom: 10,
      textAlign: "center",
      textAlignVertical:"center",
      borderRadius: 8,
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
      backgroundColor: "#558968",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },
  });