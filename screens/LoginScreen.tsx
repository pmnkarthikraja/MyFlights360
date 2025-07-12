import { findLocalUser } from '@/persistents';
import { User } from '@/utils/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { FunctionComponent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Dimensions, Image, ImageBackground, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

const Login: FunctionComponent = () => {
  const [forgotModal, setForgotModal] = useState(false);
  const { handleSubmit, watch, formState: { errors }, control } = useForm<User>();

  const [request, _response, promptAsync] = Google.useAuthRequest({
    webClientId:process.env.WEB_CLIENT_ID||"",
    androidClientId: process.env.ANDROID_CLIENT_ID||"",
    iosClientId: process.env.IOS_CLIENT_ID||"",
    scopes: [
      "profile",
      "email"
    ],
    responseType: 'code',
     redirectUri: makeRedirectUri({
      native: 'com.anonymous.myFlight360:/login',
    })
  })

  const image = Asset.fromModule(require('../assets/images/login-image.png')).uri;

  const signInQuery = async (data: User) => {
    try {
      const { email, password } = data;
      console.log('Attempting login with:', { email });

      // checkingg local storage
      const localUser = await findLocalUser(email, password,true);
      if (localUser) {
        console.log('Local user found:', localUser.uid);
        await AsyncStorage.setItem('currentUserEmail', email); //keep login session
        Alert.alert('Success', `Logged in as ${localUser.userName}`);
        router.navigate('/home');
        return;
      }

      // If no local user, inform user to sign up
      throw new Error('No account found. Please sign up first.');
    } catch (error: any) {
      console.error('Login error:', JSON.stringify(error, null, 2));
      let errorMessage = 'Failed to log in. Please try again.';
      if (error.message.includes('No account found')) {
        errorMessage = 'No account found. Please sign up first.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const handleForgotPassword = async (email?: string) => {
    try {
      if (!email) {
        const data = watch();
        if (!data.email) {
          throw new Error('Please enter your email in the login form.');
        }
        email = data.email;
      }
      // since Firebase is unavailable, inform user to sign up again
      Alert.alert('Info', 'Password reset is unavailable due to network issues. Please sign up with a new account.');
    } catch (error: any) {
      console.error('Password reset error:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error.message || 'Failed to process password reset.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync()
      if (!request) {
        console.error('Auth request not initialized');
        Alert.alert('Error', 'Google sign-in is not ready. Please try again.');
        return;
      }
      Alert.alert('Info', 'Google sign-in is unavailable due to network issues. Please use local signup/login.');
    } catch (error: any) {
      console.error('Google sign-in error:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error.message || 'Failed to sign in with Google.');
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <ImageBackground source={{ uri: image }} style={styles.backgroundImage}>
      <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <View style={styles.container}>
          <Modal
            transparent={true}
            animationType="fade"
            visible={forgotModal}
            onRequestClose={() => setForgotModal(false)}
          >
            <View style={stylesModal.overlay}>
              <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']} style={stylesModal.container}>
                <Text style={stylesModal.title}>Reset Password</Text>
                <Text style={stylesModal.subtitle}>Enter your email to receive a password reset link.</Text>
                <TextInput
                  style={stylesModal.input}
                  placeholder="Email"
                  placeholderTextColor="#777777"
                  onChangeText={(text) => watch('email', text)}
                />
                <TouchableOpacity onPress={() => handleForgotPassword()} style={stylesModal.button}>
                  <Text style={stylesModal.buttonText}>Send Reset Link</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setForgotModal(false)} style={stylesModal.closeButton}>
                  <Text style={stylesModal.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Modal>

          <Image source={{ uri: image }} style={styles.image} onError={e => console.log(e.nativeEvent.error)} />
          <Text style={styles.title}>Login</Text>
          <Controller
            control={control}
            name="email"
            rules={{ required: 'Email is required', pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#777777"
                onBlur={onBlur}
                onChangeText={e => onChange(e.toLowerCase())}
                value={value}
                textContentType="emailAddress"
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message || (errors.email.type === 'pattern' && 'Please enter a valid Email Address!')}</Text>}

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Password is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#777777"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <TouchableOpacity onPress={() => setForgotModal(true)} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSubmit(signInQuery)}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          <View style={styles.signInOptionsContainer}>
            <Text style={styles.note}>Or sign in using</Text>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} disabled={!request}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/281/281764.png' }} style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Create your account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    width: 150,
    height: 125,
    transform: 'rotate(14deg)',
    resizeMode: 'contain',
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#777777',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: 'Roboto',
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    textAlign: 'left',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPassword: {
    color: '#007BFF',
    fontFamily: 'Roboto',
  },
  button: {
    backgroundColor: '#007BFF',
    width: '100%',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  signInOptionsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  note: {
    color: '#777777',
    fontFamily: 'Roboto',
    marginBottom: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    width: 200,
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#333',
  },
  signUpContainer: {
    alignItems: 'center',
  },
  signUpText: {
    color: '#777777',
    fontFamily: 'Roboto',
    marginVertical: 10,
  },
  signUpLink: {
    color: '#007BFF',
  },
});

const stylesModal = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: width * 0.8,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 12,
  },
  closeButtonText: {
    color: 'white',
    textDecorationLine: 'underline',
  },
});

export default Login;
