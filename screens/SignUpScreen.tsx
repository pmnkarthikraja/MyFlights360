import { auth } from '@/config';
import { saveLocalUser } from '@/persistents';
import { User } from '@/utils/user';
import { Asset } from 'expo-asset';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { FunctionComponent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Dimensions, Image, ImageBackground, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const Signup: FunctionComponent = () => {
  const { handleSubmit, formState: { errors }, control } = useForm<User>();
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const [_userExist, setUserExist] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);


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
      native: 'com.anonymous.myFlight360:/signup',
    })
  })


  
  const image = Asset.fromModule(require('../assets/images/login-image.png')).uri;

  const handleSignup = async (data: User) => {
    try {
      const { userName, email, password } = data;
      console.log('Attempting signup with:', { email, userName });

        await saveLocalUser({ userName: data.userName || "", email: data.email, password: data.password });
        Alert.alert('Successfully user has registered!');
        router.push('/login')


      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;
      // console.log('User created:', user.uid);

      // await updateProfile(user, { displayName: userName });
      // setPendingUser({ userName, email, password, uid: user.uid });
      // await sendEmailVerification(user);
      // setOtpModalVisible(true);
      // Alert.alert('Success', 'Verification email sent. Please check your inbox and click the link.');
    } catch (error: any) {
      console.error('Signup error:', JSON.stringify(error, null, 2));
      let errorMessage = '';
      if (error.code === 'auth/email-already-in-use') {
        setUserExist(true);
        errorMessage = 'Email already in use. Please use a different email or log in.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters.';
      } else if (error.code === 'auth/network-request-failed') {
        try {
          await saveLocalUser({ userName: data.userName || "", email: data.email, password: data.password });
          Alert.alert('Successfully user has registered!');
        } catch (localError) {
          errorMessage = 'Network error and failed to save locally. Please check your connection and try again.';
        }
      }
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      if (!pendingUser) throw new Error('No pending user found.');
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setOtpModalVisible(false);
          Alert.alert('Success', 'Email verified! You are now signed up.');
          router.navigate('/home');
        } else {
          Alert.alert('Error', 'Email not verified. Please click the verification link in your email.');
        }
      } else {
        throw new Error('User session expired. Please sign up again.');
      }
    } catch (error: any) {
      console.error('OTP verification error:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error.message || 'Failed to verify OTP. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!request) {
        console.error('Auth request not initialized');
        Alert.alert('Error', 'Google sign-in is not ready. Please try again.');
        return;
      }
      console.log('Initiating Google sign-in...');
      const result = await promptAsync();
      console.log('Google auth result:', JSON.stringify(result, null, 2));
      if (result.type === 'success') {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;
        Alert.alert('Success', `Signed in as ${user.displayName || 'Google user'}`);
        router.navigate('/home');
      } else {
        throw new Error('Google sign-in cancelled.');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error.message || 'Failed to sign in with Google.');
    }
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <ImageBackground source={{ uri: image }} style={styles.backgroundImage}>
      <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <View style={styles.container}>
          <OtpModal
            visible={isOtpModalVisible}
            onClose={() => setOtpModalVisible(false)}
            onSubmit={handleVerifyOtp}
          />

          <Image source={{ uri: image }} style={styles.image} onError={e => console.log(e.nativeEvent.error)} />
          <Text style={styles.title}>Register your account</Text>

          <Controller
            control={control}
            name="userName"
            rules={{ required: 'Username is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#777777"
                onBlur={onBlur}
                onChangeText={e => onChange(e.toLowerCase())}
                value={value}
                textContentType="username"
              />
            )}
          />
          {errors.userName && <Text style={styles.errorText}>{errors.userName.message}</Text>}

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
            rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
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

          <TouchableOpacity onPress={handleSubmit(handleSignup)} style={styles.button}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>

          <View style={styles.signInOptionsContainer}>
            <Text style={styles.note}>Or sign up using</Text>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} disabled={!request}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/281/281764.png' }} style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Already have an account?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.signUpLink}>Go to login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const OtpModal: FunctionComponent<{ visible: boolean; onClose: () => void; onSubmit: (otp: string) => void }> = ({ visible, onClose, onSubmit }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = () => {
    if (otp.length === 6) {
      onSubmit(otp);
    } else {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP.');
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={stylesOtpModal.overlay}>
          <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']} style={stylesOtpModal.container}>
            <Text style={stylesOtpModal.title}>Enter OTP</Text>
            <Text style={stylesOtpModal.subtitle}>We have sent a verification link to your email. Please click the link to verify.</Text>
            <TextInput
              style={stylesOtpModal.input}
              placeholder="Enter OTP (if needed)"
              placeholderTextColor="#777777"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity onPress={handleSubmit} style={stylesOtpModal.button}>
              <Text style={stylesOtpModal.buttonText}>Verify</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={stylesOtpModal.closeButton}>
              <Text style={stylesOtpModal.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

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
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    textAlign: 'left',
  },
});

const stylesOtpModal = StyleSheet.create({
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

export default Signup;