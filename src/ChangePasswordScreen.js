import React, { useState } from 'react';
import { View, TextInput, Text, Alert ,StyleSheet} from 'react-native';
import { firebase } from "../config";
// import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from '@expo-google-fonts/josefin-sans';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

//   let [fontsLoaded] = useFonts({
//     JosefinSans_400Regular,
//     JosefinSans_700Bold,
//   });
  const handlePasswordChange = () => {
    const user = firebase.auth().currentUser;

    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      oldPassword
    );

    // Reauthenticate the user with their current password
    user.reauthenticateWithCredential(credential)
      .then(() => {
        // Password reauthentication successful
        if (newPassword === confirmPassword) {
          // Update the user's password
          user.updatePassword(newPassword)
            .then(() => {
              Alert.alert('Success', 'Password updated successfully.');
              setOldPassword('');
              setNewPassword('');
              setConfirmPassword('');
            })
            .catch((error) => {
              Alert.alert('Error', error.message);
            });
        } else {
          Alert.alert('Error', 'New password and confirm password do not match.');
        }
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };
//   if (!fontsLoaded) {
//     return null; // Render a loading screen or fallback component
//   }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Old Password"
        placeholderTextColor={"#FFFFFF"}
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        style={styles.textInput}
        placeholder="New Password"
        placeholderTextColor={"#FFFFFF"}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Confirm New Password"
        placeholderTextColor={"#FFFFFF"}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button}   onPress={handlePasswordChange}><Text style={{textAlign:"center", textAlignVertical:"center", color:"#FFFFFF",  fontSize:20}}>Change Password</Text></TouchableOpacity> 
      {/* <TouchableOpacity style={styles.button}   onPress={handlePasswordChange}><Text style={{textAlign:"center", textAlignVertical:"center", color:"#FFFFFF",  fontFamily:"JosefinSans_400Regular", fontSize:20}}>Change Password</Text></TouchableOpacity>  */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    flex: 1,
    alignItems: "center",
    alignContent:"center"
  },
  textInput: {
    height: 60,
    paddingTop: 20,
    paddingBottom: 20,
    width: 280,
    color: "#FFFFFF",
    fontSize: 20,
    // fontFamily:"JosefinSans_400Regular",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    backgroundColor: "#379CDF",
    marginBottom: 10,
    textAlign: "center",
    borderRadius: 16,
  },
  button: {
    marginTop: 15,
    height: 80,
    width: 250,
    backgroundColor: "#558968",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
   
  },
});

export default ChangePasswordScreen;