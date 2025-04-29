import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Text } from 'react-native-paper';
import Login from '../(auth)/login';
import { getThaaliData } from '@/services/thaali.api';
import { setUser } from '@/store/slices/authSlice';

const AuthGuard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { refetch } = useSelector((state) => state.common);
  const [isMounted, setIsMounted] = useState(false); // Track whether the component is mounted
  const [isKitchen, setIsKitchen] = useState(false); // Initialize as false
  const dispatch = useDispatch();

  useEffect(() => {
    setIsMounted(true); // Set mounted to true when the component mounts
    console.log('Starting up the app!');
  }, []);

  useEffect(() => {
    fetchAndUpdateStore();
  }, [refetch]);

  const fetchAndUpdateStore = async () => {
    try {
      const response = await getThaaliData(user?.id);
      if (response.data?.status === 'success') {
        // console.log('Updating store..', response.data.data);
        dispatch(setUser(response.data.data));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (user?.txtEjamaat_ID === "22222222" && user?.txtSabeelNo === "22222222") {
      setIsKitchen(true); // Set isKitchen to true if conditions are met
    }
  }, [user]); // Run this effect only when user changes

  useEffect(() => {
    if (isMounted && isAuthenticated) {
      // Navigate based on isKitchen
      if (isKitchen) {
        router.replace('/(guard)/(kitchendrawer)'); // Use replace to avoid adding to history
      } else {
        router.replace('/(guard)/(drawer)'); // Use replace to avoid adding to history
      }
    }
  }, [isMounted, isAuthenticated, isKitchen]); // Add isKitchen to dependency array

  const stackNav = () => {
    return (
      <Stack
        screenOptions={{
          animation: "default",
          headerShown: false,
        }}
      >
        {isKitchen ? (
          <Stack.Screen
            name="(kitchendrawer)"
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="(drawer)"
            options={{ headerShown: false }}
          />
        )}
      </Stack>
    );
  };

  return isAuthenticated ? stackNav() : <Login />;
};

export default AuthGuard;