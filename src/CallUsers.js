import { StyleSheet, Text, View , Image, Pressable,TouchableOpacity,Linking} from 'react-native'
import React, { useEffect, useState } from 'react'
import {firebase} from "../config"
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import { firebaseConfig } from '../config';
// import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from '@expo-google-fonts/josefin-sans';


const CallUsers = ({route}) => {
   
   
   
    // let [fontsLoaded] = useFonts({
    //     JosefinSans_400Regular,
    //     JosefinSans_700Bold,
    //   });


      const { route: driverRoute } = route.params;
   
      const navigation = useNavigation();
      const[users,setUsers]=useState([]);
  
  
      const makePhonecall=(number)=>{
          
          Linking.openURL("tel: "+number)
        
        }
        useEffect(() => {
        
        
          firebase
            .firestore()
            .collection('users')
            .where('route', '==', driverRoute) // Filter users based on the driver's route
            .onSnapshot(querySnapshot => {
              const users = [];
              querySnapshot.forEach(doc => {
                const { firstName, lastName, number, route } = doc.data();
                users.push({
                  id: doc.id,
                  firstName,
                  lastName,
                  number,
                  route,
                });
              });
              setUsers(users);
            });
        }, []);

// if (!fontsLoaded) {
//     return null; // Render a loading screen or fallback component
//   }




  return (
    <View style={{flex:1,marginTop:10}}>
       
   <FlatList
   style={{height:'100%'}}
   data={users}
   numColumns={1}
   renderItem={({item})=>(
    <Pressable
    style={styles.container}>

        <View style={styles.innerContainer}>
            <Text style={styles.itemHeading}> First Name: {item.firstName}</Text>
            <Text style={styles.itemHeading}> Last Name: {item.lastName}</Text>
           
    
            <View style={{display:"flex",flexDirection:"column"}}>
            <Text style={styles.itemText}> Contact: {item.number}</Text>
            <TouchableOpacity style={styles.button }  onPress={()=>makePhonecall(item.number)} >
           
            <Image
          source={require("../assets/call.png")}
          style={{ width: 30,  alignSelf:"center",  height: 25, }}
        />
    </TouchableOpacity>
            
            </View>
           
           
          
        
        </View>
    </Pressable>
   )}
   />
    </View>
  )
}

export default CallUsers

const styles= StyleSheet.create({
    container:{
         backgroundColor:"#0F5288",
                 padding:15,
         borderRadius:15,
         margin:5,
         marginHorizontal:10
    },
    innerContainer:{
        
        alignItems:'center',
        flexDirection:'column'
    },
    itemHeading:{
        color:"white",
        fontSize:20,
        // fontFamily:"JosefinSans_400Regular"
    },
    itemText:{
        color:"white",
        // fontFamily:"JosefinSans_400Regular",
        fontSize:20
    },
    button:{
        marginTop:10,
        alignSelf:"center",
        width:50,
        height:45,
        alignItems:"center",
        alignContent:"center",
        paddingTop:7,
      
       backgroundColor:"#429368",
        borderRadius:6,
        
    },
    buttonEdit: {
        marginTop: 15,
        height: 40,
        width: 100,
        backgroundColor: "#558968",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
      },
       buttonDelete: {
        marginTop: 5,
        height: 40,
        width: 100,
        backgroundColor: "#A52A2A",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
      },
})