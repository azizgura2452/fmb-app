import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import Login from '../(auth)/login';
import { getThaaliData } from '@/services/thaali.api';
import { setUser, loadUserSession } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';

const AuthGuard = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const { refetch } = useSelector((state: RootState) => state.common);
  const [isKitchen, setIsKitchen] = useState(false);

  // Load session on mount
  useEffect(() => {
    dispatch(loadUserSession());
  }, [dispatch]);

  // Refresh thaali data if refetch triggered
  useEffect(() => {
    if (isAuthenticated) {
      fetchAndUpdateStore();
    }
  }, [refetch, isAuthenticated]);

  const fetchAndUpdateStore = async () => {
    try {
      const response = await getThaaliData(user?.id);
      if (response.data?.status === 'success') {
        dispatch(setUser(response.data.data));
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Check kitchen access
  useEffect(() => {
    if (user?.txtEjamaat_ID === "22222222" && user?.txtSabeelNo === "22222222") {
      setIsKitchen(true);
    }
  }, [user]);

  // Route navigation
  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (isKitchen) {
        router.replace('/(guard)/(kitchendrawer)');
      } else {
        router.replace('/(guard)/(drawer)');
      }
    }
  }, [loading, isAuthenticated, isKitchen]);

  const stackNav = () => (
    <Stack
      screenOptions={{
        animation: "default",
        headerShown: false,
      }}
    >
      {isKitchen ? (
        <Stack.Screen name="(kitchendrawer)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      )}
    </Stack>
  );

  // Render loader while loading AsyncStorage session check
  if (loading) {
    return <ActivityIndicator animating={true} size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  // Render based on authentication status
  return isAuthenticated ? stackNav() : <Login />;
};

export default AuthGuard;
