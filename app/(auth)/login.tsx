import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Surface,
  TextInput,
  HelperText,
  Text,
  Card,
  Divider,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { styles } from '@/lib/ui';
import { login } from '@/services/thaali.api';
import SnackbarWidget from '@/lib/ui/components/SnackbarWidget';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/store/slices/authSlice';
import {
  BackHandler,
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      if (response.data?.status === 'success') {
        setSnackbarOpen(true);
        setSnackbarMessage(response.data?.message);
        dispatch(setAuth(response.data.data));
        setIsLoading(false);
        console.log(response.data?.data)
        if (response.data.data?.id) {
          router.push('/(guard)');
        }
      } else {
        setIsLoading(false);
        setSnackbarOpen(true);
        setSnackbarMessage(response.data?.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error', error);
      console.error('Login error:', error.response?.data);
    }
  };

  return (
    <ImageBackground source={require('@/assets/images/fmb-bg.png')} resizeMode="repeat" style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Surface
            style={{
              ...styles.screen,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 0,
              flex: 1,
            }}
          >
            <Image
              alt="Logo"
              source={require('@/assets/images/h2k-logo.png')}
              style={{
                width: 150,
                height: 150,
                marginHorizontal: 'auto',
              }}
            />

            <Card style={[styles.cardContainer, styles2.card]}>
              <Card.Content style={{ paddingRight: 0 }}>
                <Image
                  alt="Logo"
                  source={require('@/assets/images/fmb-logo.png')}
                  style={{
                    width: 250,
                    height: 120,
                    marginBottom: 10,
                    marginHorizontal: 'auto',
                  }}
                />
                <Divider style={styles2.divider} />

                <Controller
                  control={control}
                  name="txtSabeelNo"
                  rules={{
                    required: 'Please enter your Sabeel no.',
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Surface elevation={0}>
                      <TextInput
                        maxLength={64}
                        mode="outlined"
                        label="Sabeel No."
                        value={value}
                        error={!!errors.txtSabeelNo}
                        onBlur={onBlur}
                        placeholder="Enter your sabeel no."
                        onChangeText={onChange}
                      />
                      <HelperText type="error" visible={!!errors.txtSabeelNo}>
                        {errors.txtSabeelNo?.message}
                      </HelperText>
                    </Surface>
                  )}
                />

                <Controller
                  control={control}
                  name="txtEjamaat_ID"
                  rules={{
                    required: 'Please enter your ITS No.',
                    minLength: {
                      value: 8,
                      message: 'Invalid input! Should be 8 characters.',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Surface elevation={0}>
                      <TextInput
                        maxLength={64}
                        mode="outlined"
                        label="ITS No."
                        value={value}
                        error={!!errors.txtEjamaat_ID}
                        onBlur={onBlur}
                        placeholder="Enter your ITS No."
                        onChangeText={onChange}
                        secureTextEntry
                      />
                      <HelperText type="error" visible={!!errors.txtEjamaat_ID}>
                        {errors.txtEjamaat_ID?.message}
                      </HelperText>
                    </Surface>
                  )}
                />

                <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{ marginTop: 8 }}>
                  {isLoading ? 'Logging you in...' : 'Login'}
                </Button>
              </Card.Content>
            </Card>
            <SnackbarWidget
              message={snackbarMessage}
              open={snackbarOpen}
              onDismiss={() => setSnackbarOpen(false)}
            />
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles2 = StyleSheet.create({
  card: {
    maxWidth: screenWidth * 0.89,
    minWidth: screenWidth * 0.89,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#e0d4c3',
  },
});

export default Login;
