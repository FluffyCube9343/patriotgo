import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// --- SCREEN IMPORTS ---
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen'; // Added this
import FeedScreen from './screens/FeedScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.floatingIsland,
        tabBarActiveTintColor: '#FFCC33', 
        tabBarInactiveTintColor: 'rgba(255, 204, 51, 0.4)',
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let label;

          if (route.name === 'Home') {
            iconName = focused ? 'car-sport' : 'car-sport-outline';
            label = 'RIDE';
          } else if (route.name === 'ChatList') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
            label = 'CHAT';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'leaf' : 'leaf-outline';
            label = 'ECO';
          }

          return (
            <View style={[styles.pill, focused && styles.activePill]}>
              <Ionicons name={iconName} size={24} color={focused ? '#004D26' : color} />
              {focused && <Text style={styles.pillLabel}>{label}</Text>}
            </View>
          );
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={FeedScreen} 
        listeners={{ tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) }}
      />
      <Tab.Screen 
        name="ChatList" 
        component={ChatScreen} 
        listeners={{ tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        listeners={{ tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Added SignUp Screen here */}
        <Stack.Screen name="SignUp" component={SignUpScreen} /> 
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  floatingIsland: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 80,
    backgroundColor: '#004D26', 
    borderRadius: 40,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
    paddingBottom: 0,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    minWidth: 50,
  },
  activePill: {
    backgroundColor: '#FFCC33', 
  },
  pillLabel: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '900',
    color: '#004D26',
    letterSpacing: 1,
  }
});
