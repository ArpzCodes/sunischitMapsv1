import 'react-native-gesture-handler';
import React from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import 'expo-dev-client';
import { StyleSheet, View } from 'react-native';
import { AttendanceProvider } from "./src/AttendanceContext";
import Attendance from "./src/Attendance";
// import { GOOGLE_API_KEY } from 'react-native-dotenv'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import 'expo-dev-client';
import Login from "./src/Login";
import Dashboard from "./src/Dashboard";
import DriverDashboard from "./src/DriverDashboard";
import CallUsers from "./src/CallUsers";
import ForgetPass from './src/ForgetPass';
import Header from './components/Header';
import CallHeader from "./components/CallHeader";
import ChangePasswordScreen from './src/ChangePasswordScreen';
const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <AttendanceProvider>
<Stack.Navigator>
  
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

<Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerTitle: () => <Header name="Dashboard" />,
            headerStyle: {
              height: 80,
                            backgroundColor: "#379CDF",
              shadowColor: "#000",
            },
          }}
        />
<Stack.Screen
          name="DriverDashboard"
          component={DriverDashboard}
          options={{
            headerTitle: () => <Header name="DriverDashboard" />,
            headerStyle: {
              height: 80,
                            backgroundColor: "#379CDF",
              shadowColor: "#000",
            },
          }}
        />
        
        <Stack.Screen name="CallUsers" component={CallUsers}  
        options={{
            headerTitle: () => <CallHeader name="CallUsers" />,
            headerStyle: {
              height: 80,
                            backgroundColor: "#379CDF",
              shadowColor: "#000",
            },
          }} 
          />
<Stack.Screen
          name="Attendance"
          component={Attendance}
          options={{
            headerTitle: () => <CallHeader name="CallUsers" />,
            headerStyle: {
              height: 80,
                            backgroundColor: "#379CDF",
              shadowColor: "#000",
            },
          }} 
        />
         <Stack.Screen name="Forget Password" component={ForgetPass}></Stack.Screen>
         <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{
            headerTitle: () => <CallHeader name="Forget Password" />,
            headerStyle: {
              height: 80,
                            backgroundColor: "#379CDF",
              shadowColor: "#000",
            },
          }} 
        />
</Stack.Navigator>
</AttendanceProvider>

    </NavigationContainer>
);
}