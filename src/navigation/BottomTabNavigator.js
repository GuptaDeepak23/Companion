import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../utils/colors';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import ChatListScreen from '../screens/main/ChatListScreen';
import ChatDetailScreen from '../screens/main/ChatDetailScreen';
import MeetListScreen from '../screens/main/MeetListScreen';
import CreateMeetScreen from '../screens/main/CreateMeetScreen';
import MeetDetailScreen from '../screens/main/MeetDetailScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Chat Stack
function ChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
}

// Meet Stack
function MeetStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="MeetList"
        component={MeetListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateMeet"
        component={CreateMeetScreen}
        options={{ title: 'Create Meet' }}
      />
      <Stack.Screen
        name="MeetDetail"
        component={MeetDetailScreen}
        options={{ title: 'Meet Details' }}
      />
    </Stack.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ChatStack"
        component={ChatStack}
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="message"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MeetStack"
        component={MeetStack}
        options={{
          title: 'Meet',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
