import React from "react";
import { View, Dimensions,Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { firebase } from "../config";
import { useNavigation } from "@react-navigation/native";

const CallHeader = () => {
  const navigation = useNavigation();
  const signOutUser = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("successfully signed out");
        navigation.replace("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

 

  const handleChangePassword = () => {
    navigation.navigate("ChangePasswordScreen");
  };

  return (
    <View style={styles.headerContainer}>
   
      <View>
      
      </View>
    </View>
  );
};

export default CallHeader;

const styles = StyleSheet.create({
  headerContainer: {
    padding:5,
    display:"flex",
    flexDirection: "row",
    alignItems:"center",
    width: Dimensions.get("window").width-30,
    justifyContent:"space-between"
    
   

  },
  leftButton: {
    height: 33,
    width: 60,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
   
    borderRadius: 10,
   
  },
  rightButton: {
    height: 40,

  
  },
  // buttonText: {
  //   fontSize: 15,
  //   fontWeight: "bold",
  //   color:"#000000",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
});
