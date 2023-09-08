import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
// import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from "@expo-google-fonts/josefin-sans";
import { useAttendance } from "./AttendanceContext";
import { firebase } from "../config";
import { useFonts } from 'expo-font';

const Attendance = ({ route }) => {
  const [fontsLoaded] = useFonts({
    'JosefinSans_400Regular': require('../assets/fonts/JosefinSans-Regular.ttf'),
    'JosefinSans_700Bold': require('../assets/fonts/JosefinSans-Bold.ttf')
  });

  const { route: driverRoute } = route.params;
  const { attendanceData, updateAttendance } = useAttendance();

  const [users, setUsers] = useState(attendanceData || []); // Initialize with attendanceData or an empty array

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .where("route", "==", driverRoute)
      .onSnapshot((querySnapshot) => {
        const updatedUsers = querySnapshot.docs.map((doc) => {
          const { firstName, lastName } = doc.data();
          const userFromContext = users.find((user) => user.id === doc.id);
          return {
            id: doc.id,
            firstName,
            lastName,
            attendanceStatus: userFromContext
              ? userFromContext.attendanceStatus
              : "Present",
          };
        });
        setUsers(updatedUsers);
        updateAttendance(updatedUsers);
      });

    return () => unsubscribe();
  }, [driverRoute]);

  const handleAttendanceStatusChange = (userId, value) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          attendanceStatus: value,
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    updateAttendance(updatedUsers);
  };

  const handleAttendanceSubmit = async () => {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in "YYYY-MM-DD" format
  
    // Reference to the specific route's attendance document
    const routeAttendanceDocRef = firebase
      .firestore()
      .collection("Attendance")
      .doc(driverRoute);
  
    try {
      const routeAttendanceDoc = await routeAttendanceDocRef.get();
  
      if (routeAttendanceDoc.exists) {
        // If the document exists, update the attendance for the current date
        const attendanceData = routeAttendanceDoc.data();
  
        users.forEach((user) => {
          if (!attendanceData[currentDate]) {
            attendanceData[currentDate] = {};
          }
          attendanceData[currentDate][user.id] = user.attendanceStatus;
        });
  
        await routeAttendanceDocRef.update(attendanceData);
        console.log("Attendance updated for the day");
        alert("Attendance updated for the day");
      } else {
        // If the document doesn't exist, create a new document for the route
        const attendanceData = {
          [currentDate]: {},
        };
  
        users.forEach((user) => {
          attendanceData[currentDate][user.id] = user.attendanceStatus;
        });
  
        await routeAttendanceDocRef.set(attendanceData);
        console.log("Attendance recorded for the route");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };
  
  
  
  

//   if (!fontsLoaded) {
//     return null;
//   }

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAttendanceSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Attendance</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ height: "100%" }}
        data={users}
        numColumns={1}
        renderItem={({ item }) => (
          <Pressable style={styles.container}>
            <View style={styles.innerContainer}>
              <Text style={styles.itemHeading}>
                Name: {item.firstName + " " + item.lastName}
              </Text>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={item.attendanceStatus || "Present"}
                  style={styles.picker}
                  onValueChange={(value) =>
                    handleAttendanceStatusChange(item.id, value)
                  }
                >
                  <Picker.Item label="Present" value="Present" />
                  <Picker.Item label="Absent" value="Absent" />
                </Picker>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F5288",
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
  },
  innerContainer: {
    alignItems: "center",
    flexDirection: "column",
  },
  itemHeading: {
    color: "white",
    fontSize: 20,
    fontFamily: "JosefinSans_400Regular",
  },
  itemText: {
    color: "white",
    fontFamily: "JosefinSans_400Regular",
    fontSize: 20,
  },
  button: {
    marginTop: 10,
    alignSelf: "center",
    width: 50,
    height: 45,
    alignItems: "center",
    alignContent: "center",
    paddingTop: 7,

    backgroundColor: "#429368",
    borderRadius: 6,
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

  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },
  picker: {
    flex: 1, // Allow the picker to take up available space
    color: "white",
    fontFamily: "JosefinSans_400Regular",
    fontSize: 18,
  },

  submitButtonContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#429368",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  submitButtonText: {
    color: "white",
    fontFamily: "JosefinSans_400Regular",
    fontSize: 18,
  },
});
