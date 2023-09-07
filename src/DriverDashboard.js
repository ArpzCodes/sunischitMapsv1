
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,

  ActivityIndicator,
  RefreshControl,

  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase, firebaseConfig } from "../config";

import { useNavigation } from "@react-navigation/native";

import { Marker } from "react-native-maps";
import MapView from "react-native-maps";

import { ref, set, update } from "firebase/database";
import { db } from "../config";

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';



const LOCATION_TASK_NAME = 'background-location-task';
import "../config";

function DriverDashboard() {

  const [tracking, setTracking] = useState(false);

  const [name, setName] = useState("");
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 27.712306057181987,
    longitude: 85.34216968305361,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      navigation.replace('DriverDashboard')
    }, 500);
  }, []);
  const signOutUser = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        stopLocationTracking();
        
        console.log("successfully signed out");
        navigation.replace("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(name.route)

  useEffect(() => {
    firebase
      .firestore()
      .collection("drivers")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
          
        } else {
          console.log("User does not exist");
        }
      });
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }
  
      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 10000, // Adjust the interval as per your needs
          distanceInterval: 0.1,
        });
  
        setLocation(location);
        setMapRegion((prevRegion) => ({
          ...prevRegion,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));
        setLoading(false);
      } catch (error) {
        console.log(error);
        setErrorMsg("Error fetching location");
        setLoading(false);
      }
    };
  
    const handleAuthChange = (user) => {
      if (user) {
        fetchLocation();
        checkAndStopLocationTask(); // Check and stop the task when the app opens
      } else {
        setLocation(null);
        setLoading(false);
      }
    };
  
    const unsubscribeAuthChange = firebase.auth().onAuthStateChanged(handleAuthChange);
  
    return () => {
      unsubscribeAuthChange();
    };
  }, []);


  const checkAndStopLocationTask = async () => {
    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    if (isTaskRegistered && !tracking) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);

      console.log('yo kaam vayo')
    }
  };



  const handleChangePassword = () => {

    
    navigation.navigate("ChangePasswordScreen");
  };


  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 5000, // 5 seconds (adjust as needed)
      distanceInterval: 0, // meters (adjust as needed)
      foregroundService: {
        notificationTitle: 'Location Tracking',
        notificationBody: 'Tracking your location...',
        notificationColor: '#3498db', // Notification color
      },
    });
    setTracking(true);
  };

  const stopLocationTracking = async () => {
    // Check if the task is registered before attempting to stop it
    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
  
    if (isTaskRegistered) {
      // The task is registered, so we can safely stop it
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      setTracking(false);
    }
  };
  

  const getMarkerSize = (latitudeDelta) => {
    const baseSize = 100;
    const maxLatitudeDelta = 400;
    const minMarkerSize = 50;
    const size = baseSize * (latitudeDelta / maxLatitudeDelta);
    return Math.max(size, minMarkerSize);
  };

  useEffect(() => {
    const checkLocationTask = async () => {
      const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (!isTaskRegistered) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000,
          distanceInterval: 0,
          foregroundService: {
            notificationTitle: 'Location Tracking',
            notificationBody: 'Tracking your location...',
            notificationColor: '#3498db',
          },
        });
      }
    };

    // Check if the task should start when the component mounts
    if (tracking) {
      checkLocationTask();
    }
  }, [tracking]);

  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      console.error('Background location error:', error);
      return;
    }
    if (data) {
      const { locations } = data;
      const latestLocation = locations[0]; // Get the latest location
  
      console.log(
        `${new Date(Date.now()).toLocaleString()}: ${latestLocation.coords.latitude},${latestLocation.coords.longitude}`
      );
  
      // Update the location in Firebase here using `latestLocation`
      update(ref(db, "driver-route/" + name.route), {
        latitude: latestLocation.coords.latitude,
        longitude: latestLocation.coords.longitude,
      })
        .then(() => {
          console.log(name.route);
          console.log("Real-time update successful.");
        })
        .catch((updateError) => {
          console.error("Real-time update error:", updateError);
        });
    }
  });
  


  if (loading) {
    return (
      <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#379CDF" />
        <Text style={styles.loadingText}>Fetching location...</Text>
      </View>
      </ScrollView>
    );
  }

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
     
     <TouchableOpacity
       style={styles.leftButton}
       onPress={handleChangePassword}
     >
        <Image  style={{height:15,width:28}}
       source={require("../assets/key.png")}></Image>
     </TouchableOpacity>

     <TouchableOpacity onPress={signOutUser}>
       <Image  style={{height:30,width:30, alignSelf:"flex-end",marginLeft:15,marginBottom:10}}
       source={require("../assets/logout.png")}></Image>
     </TouchableOpacity>
   </View>
      <MapView style={styles.map} region={mapRegion}>
        <Marker
          coordinate={mapRegion}
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={999}
        >
          <Image
            source={require("../assets/bus.png")}
            style={{  width: getMarkerSize(mapRegion.latitudeDelta),
              height: getMarkerSize(mapRegion.latitudeDelta),resizeMode: "contain",}}
            
          />
        </Marker>
      </MapView>
     
             {tracking ? (
        <TouchableOpacity onPress={stopLocationTracking} style={[styles.start,{backgroundColor:"#C24644"}]}>
          <Text style={styles.buttonText}>Stop Tracking</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={startLocationTracking} style={[styles.start,{backgroundColor:"#558968"}]}>
          <Text style={styles.buttonText}>Start Tracking</Text>
        </TouchableOpacity>
)}
       
        
        <TouchableOpacity
            style={styles.callParents}
            onPress={() => navigation.navigate("CallUsers",{ route: name.route })}
          >
            <Image
              source={require("../assets/call.png")}
              style={{height:25,width:25}}
             
            />
       
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.attendance}
            onPress={() => navigation.navigate("Attendance",{ route: name.route })}
          >
           <Text style={styles.buttonText}>Attendance</Text>
       
          </TouchableOpacity>
       
    
      

       
       
       
       
      
     
    </SafeAreaView>
  );
};





const styles = StyleSheet.create({
  headerContainer: {
    marginTop:40,
    padding:5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
   
    

  },
  leftButton: {
    height: 33,
    width: 60,
    marginRight: 200,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom:10,
    
    borderRadius: 10,
  },
  rightButton: {
    height: 40,
 
    
  
  },
  container: {
    backgroundColor: "#379CDF",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
   
  },
  start: {
    position: "absolute",
    bottom: Dimensions.get("window").height-620,
    left: 0,
    right: 0,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    height: 50,
    paddingHorizontal: 20,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    justifyContent: "center",
    marginLeft:40,
    marginBottom:20,
    width: Dimensions.get("window").width-80,
    borderRadius:7,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,    
    backgroundColor: '#FFFFFF',
    elevation: 5, // For Android shadow
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  attendance: {
    position: "absolute",
    bottom: Dimensions.get("window").height-740,
    left: 0,
    right: 0,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
  
    height: 50,
    paddingHorizontal: 20,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    justifyContent: "center",
    marginLeft:40,
    marginBottom:20,
    width: Dimensions.get("window").width-80,
    borderRadius:7,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,    
    backgroundColor: '#2775A9',
    elevation: 5, // For Android shadow
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  
  callParents: {
    position: "absolute",
    bottom: Dimensions.get("window").height-680,
    left: 0,
    right: 0,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
   
   
    height: 50,
    paddingHorizontal: 20,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    justifyContent: "center",
    marginLeft:40,
    marginBottom:20,
    width: Dimensions.get("window").width-80,
    borderRadius:7,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,    
    backgroundColor: '#2775A9',
    elevation: 5, // For Android shadow
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily:"JosefinSans_400Regular"
  },
  

  map: {
    width: "100%",
    height: "100%",
  },
  buttonText: {
   
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily:"JosefinSans_700Bold"
  },
  button: {
    marginTop: 15,
    height: 60,
    width: 250,
    backgroundColor: "#558968",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
 
});

export default DriverDashboard;
