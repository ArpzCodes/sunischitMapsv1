import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
} from "react-native";
import { firebase } from "../config";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  AnimatedRegion,
} from "react-native-maps";

import { ref, onValue } from "firebase/database";
import { db } from "../config";

// import {
//   useFonts,
//   JosefinSans_400Regular,
//   JosefinSans_700Bold,
// } from "@expo-google-fonts/josefin-sans";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState(" ");

//   let [fontsLoaded] = useFonts({
//     JosefinSans_400Regular,
//     JosefinSans_700Bold,
//   });

  const [newData, setDataa] = useState([]);

  const [containerVisible, setContainerVisible] = useState(true);
  const [isMapHeld, setIsMapHeld] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 27.7172,
    longitude: 85.324,
    latitudeDelta: 0.07,
    longitudeDelta: 0.07,
  });

  const [driverLocation, setDriverLocation] = useState({
    latitude: 27.7119,
    longitude: 85.341,
  });

  const [callNumber, setCallnumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [busNo, setBusNo] = useState("");

  const makePhonecall = (number) => {
    Linking.openURL("tel:" + number);
  };

  const handleRegionChangeComplete = (region) => {
    setMapRegion(region);
  };

  const driverLocationAnimation = useRef(
    new AnimatedRegion({
      latitude: 27.7119,
      longitude: 85.341,
    })
  ).current;
  const markerRef = useRef(null);

  const handleMapPanDrag = () => {
    setIsMapHeld(true);
    setContainerVisible(false);
  };

  const handleBringBackButtonPress = () => {
    setIsMapHeld(false);
    setContainerVisible(true);
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
          const starCountRef = ref(db, "driver-route/" + snapshot.data().route);
          onValue(starCountRef, (new_snapshot) => {
            const data = new_snapshot.val();
            setDataa(data);
            setDriverLocation({
              latitude: new_snapshot.val().latitude,
              longitude: new_snapshot.val().longitude,
            });
            driverLocationAnimation
              .timing(
                {
                  latitude: new_snapshot.val().latitude,
                  longitude: new_snapshot.val().longitude,
                },
                { duration: 4000 } // Adjust the duration value for slower/faster animation
              )
              .start();
          });
        } else {
          console.log("User does not exist");
        }

        firebase
          .firestore()
          .collection("drivers")
          .onSnapshot((querySnapshot) => {
            const updatedUsers = [];
            querySnapshot.forEach((doc) => {
              const { busNo, firstName, lastName, number, route } = doc.data();
              if (route === snapshot.data().route) {
                setCallnumber(number);
                setDriverName(firstName + " " + lastName);
              }
              updatedUsers.push({
                id: doc.id,
                busNo,
                firstName,
                lastName,
                number,
                route,
              });
            });
            setUsers(updatedUsers);
          });
      });
  }, []);

  const getMarkerSize = (latitudeDelta) => {
    const baseSize = 100;
    const maxLatitudeDelta = 400;
    const minMarkerSize = 50;
    const size = baseSize * (latitudeDelta / maxLatitudeDelta);
    return Math.max(size, minMarkerSize);
  };

//   if (!fontsLoaded) {
//     return null; // Render a loading screen or fallback component
//   }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={handleRegionChangeComplete}
        onPanDrag={handleMapPanDrag}
      >
        <Marker.Animated coordinate={driverLocationAnimation} ref={markerRef}>
          <Image
            source={require("../assets/bus.png")}
            style={{
              width: getMarkerSize(mapRegion.latitudeDelta),
              height: getMarkerSize(mapRegion.latitudeDelta),
              resizeMode: "contain",
            }}
          />
        </Marker.Animated>
        {/* ... */}
      </MapView>
      {containerVisible && !isMapHeld && (
        <Animated.View style={{ display: "flex", flexDirection: "column" }}>
          <View style={styles.driverInfo}>
            <Image
              source={require("../assets/driver.png")}
              style={{ height: 30, width: 30 }}
            ></Image>
            <Text
              style={{
                color: "#000000",
                // fontFamily: "JosefinSans_400Regular",
                marginLeft: 11,
              }}
            >
              {" "}
              {driverName}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View style={styles.busInfoContainer}>
              <Image
                source={require("../assets/2ndbus.png")}
                style={{ height: 40, width: 30 }}
              ></Image>
              <Text
                style={{
                  color: "#000000",
                //   fontFamily: "JosefinSans_400Regular",
                  marginLeft: 11,
                }}
              >
                {" "}
                {busNo}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.call}
              onPress={() => makePhonecall(callNumber)}
            >
              <Image
                source={require("../assets/call.png")}
                style={{ height: 25, width: 25 }}
              ></Image>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      {isMapHeld && (
        /* Small button to bring back the initial container */
        <TouchableOpacity
          style={styles.bringBackButton}
          onPress={handleBringBackButtonPress}
        >
          <Text
            style={{ color: "#ffffff" }}
            // style={{ fontFamily: "JosefinSans_400Regular", color: "#ffffff" }}
          >
            Back
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  driverInfo: {
    position: "absolute",
    bottom: Dimensions.get("window").height - 560,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#EA5C0E",
    height: 50,
    paddingHorizontal: 20,

    justifyContent: "center",
    marginLeft: 40,
    marginBottom: 20,
    width: Dimensions.get("window").width - 80,
    borderRadius: 7,

    backgroundColor: "#FFFFFF",
    elevation: 5, // For Android shadow
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  busInfoContainer: {
    position: "absolute",
    bottom: Dimensions.get("window").height - 620,
    left: 0,
    right: 0,
    backgroundColor: "#EA5C0E",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 20,
    justifyContent: "center",
    marginLeft: 39,
    marginBottom: 20,
    width: Dimensions.get("window").width - 136,
    borderRadius: 7,

    elevation: 5, // For Android shadow
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  call: {
    position: "absolute",
    bottom: Dimensions.get("window").height - 620,
    right: 0,
    marginRight: Dimensions.get("window").width - 323,

    height: 50,
    paddingHorizontal: 20,
    borderRadius: 7,

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",

    alignSelf: "flex-end",
    alignItems: "center",

    marginBottom: 20,
    width: 50,
    borderRadius: 6,

    backgroundColor: "#276FF0",
    elevation: 5, // For Android shadow
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  bottomContainer: {
    position: "absolute",
    // bottom: 0,
    bottom: Dimensions.get("window").height - 630,
    left: 0,
    right: 0,
    backgroundColor: "#4384F4",
    height: 65,
    paddingHorizontal: 20,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    justifyContent: "center",
    // fontFamily: "JosefinSans_400Regular",
  },

  driverName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  bringBackButton: {
    position: "absolute",
    bottom: Dimensions.get("window").height - 630,
    alignSelf: "center",
    width: 70,
    padding: 8,
    alignContent: "center",
    textAlign: "center",
    alignItems: "center",
    backgroundColor: "rgb(67,132,244)",
    borderRadius: 4,
    // fontFamily: "JosefinSans_400Regular",
  },

  driverNumber: {
    color: "#FFFF",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  callButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  callButton: {
    backgroundColor: "#558968",
    width: 50,
    height: 50,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  callIcon: {
    width: 20,
    height: 20,
  },
});
