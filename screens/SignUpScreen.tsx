// import { Link } from 'expo-router';
// import React, { useState } from 'react';
// import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// export default function SignupScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSignup = () => {
//     console.log('Sign Up:', email, password);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Sign Up</Text>
//       <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSignup}>
//         <Text style={styles.buttonText}>Sign Up</Text>
//       </TouchableOpacity>

//       <Link  href={'/(auth)/login'} style={{marginTop:20}}>
//         <Text style={styles.linkText}>Already have an account? Log in</Text>
//       </Link>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 10 },
//   button: { backgroundColor: '#28A745', padding: 15, borderRadius: 8 },
//   buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
//   linkText: { marginTop: 15, color: '#007AFF', textAlign: 'center' },
// });



import { User } from '@/utils/user';
import { Asset } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { FunctionComponent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Dimensions, Image, ImageBackground, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession()

const Signup = () => {
  // const { isLoading: isEmailSigninLoading, isError: isEmailSigninError, error: emailSigninError, mutateAsync: emailSigninMutation } = useEmailSigninMutation(false)

  // const { isLoading: isEmailSignupLoading, isError: isEmailSignupError, error: emailSignupError, mutateAsync: emailSignupMutation } = useEmailSignupMutation(false)
  // const { isLoading: isGoogleSignupLoading, isError: isGoogleSignupError, error: googleSignupError, mutateAsync: googleSignupMutation } = useGoogleSignupMutation()

  // const { mutateAsync: sendotp, error: otperr, isLoading: sendotploading } = useSendOTPMutation()
  // const { mutateAsync: verifyotp,error:verifyotperr, isError:isverifyotperr } = useVerifyOTPMutation()
  const { handleSubmit, watch, formState: { errors }, control } = useForm<User>();
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState('');
  const [userExist, setUserExist] = useState(false);
  const user = watch()

  // const [_request, response, promptAsync] = Google.useAuthRequest({
  //   webClientId: '522585345584-5eogmt9juv74frkjndmhq4i5ob3ah68g.apps.googleusercontent.com',
  //   androidClientId: '522585345584-mb227ovhe4v1dr9b2g2fbrum5j6av682.apps.googleusercontent.com',
  //   iosClientId: '522585345584-t7rrclh3kf4cd3jkh0ibluavpd6tf74e.apps.googleusercontent.com',
  //   scopes: [
  //     "profile",
  //     "email"
  //   ],
  //   responseType: 'code',
  //   redirectUri: makeRedirectUri({
  //     native: 'com.anonymous.testexpoapp:/signup',
  //   })
  // })

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     handleSignupWithGoogle();
  //   } else if (response?.type === 'error') {
  //     console.log('Signup failed:', response?.error);
  //     router.navigate('/signup')
  //   }
  // }, [response])

  // async function handleSignupWithGoogle() {
  //   if (response?.type === 'success') {
  //     await googleSignupMutation(response.authentication?.accessToken || '')
  //     router.navigate('/')
  //   }
  // }

  const image = Asset.fromModule(require('../assets/images/login-image.png')).uri;
  const handleSignout = async () => {
    try {
      // await emailSigninMutation({
      //   email: user.email,
      //   password:"", // password no matter, we need it for hash backend
      //   userName: ''  // username dont need for login purpose
      // });
    } catch (error) {
      throw new Error("error on login:")
    }
  }

  // useEffect(() => {
  //   setUserExist(false)
  //   if (emailSigninError?.response?.status == 404) {
  //     setEmailToVerify(user.email);
  //     sendotp({
  //       email: user.email,
  //       accountVerification: true,
  //       type: 'verification',
  //       userName: undefined
  //     });
  //     setOtpModalVisible(true)
  //   }
  //   if (emailSigninError?.response?.status==401) {  //authentication error, only happen if user exist
  //     setUserExist(true)
  //   }
  // }, [emailSigninError])

  // useEffect(()=>{
  //   if (isverifyotperr && verifyotperr?.response?.status === 400) {
  //     Alert.alert('Error', 'Invalid OTP. Please try again.');
  //   } 
  // },[verifyotperr])


  async function handleVerifyOtp(otp: string) {
    // try {
    //   await verifyotp({ email: emailToVerify, otp });
    //   await emailSignupMutation({
    //     email: emailToVerify,
    //     userName: user.userName,
    //     password: user.password,
    //   });
    //   Alert.alert('Success', 'Account created successfully!');
    //   setOtpModalVisible(false);
    //   router.navigate('/');
    // } catch (error) {
    //   console.log("error on verify otp:", error);
    //   if (emailSignupError){
    //     Alert.alert('Sorry', emailSignupError?.response?.data.message || emailSignupError?.message);
    //   }
    // }
  }

  const navigateToLogin = () => {
    router.push('/login')

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

          {/* {(isEmailSignupLoading || isEmailSigninLoading || sendotploading || isGoogleSignupLoading) &&
            <LoadingWidget/>
          }
          <Text style={styles.errorText}>
            {isEmailSignupError && emailSignupError.response?.data.message
              || emailSignupError?.message}</Text>
          
          {userExist && <Text style={styles.errorText}>User Already Exist!</Text>}
          {googleSignupError && <Text style={styles.errorText}>{googleSignupError.response?.data.message || googleSignupError.message}</Text>} */}

          <Controller
            control={control}
            name='userName'
            rules={{ required: 'Username is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#777777"
                onBlur={onBlur}
                onChangeText={e => onChange(e.toLowerCase())}
                value={value}
                textContentType='username'
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
                textContentType='emailAddress'
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message || (errors.email.type == 'pattern' && 'Please Enter a valid Email Address!')}</Text>}

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

          <TouchableOpacity onPress={handleSubmit(handleSignout)} style={styles.button}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>

          <View style={styles.signInOptionsContainer}>
            <Text style={styles.note}>Or sign up using</Text>
            <TouchableOpacity style={styles.googleButton} onPress={async ()=>{
              setUserExist(false)
              // await promptAsync()
              
              }}>
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
}

export default Signup

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
    resizeMode: 'contain'
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
    marginVertical: 10
  },
  signUpLink: {
    color: '#007BFF',
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    textAlign: 'left'
  },
  modalContainer: {
    flex: 1,
    width: 'auto',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    color: 'black',
  },
  otpInput: {
    width: 200,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    color: 'black',
    backgroundColor: 'white',
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white'
  },
});

const { height, width } = Dimensions.get('window');

import { Modal } from 'react-native';

const OtpModal: FunctionComponent<{ visible: boolean, onClose: () => void, onSubmit: (otp: string) => void }> = ({ visible, onClose, onSubmit }) => {
  const [otp, setOtp] = useState('');
  const [err,setErr]=useState('')

  const handleSubmit = () => {
    if (otp.length === 6) { // Assuming OTP is 6 digits
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
          <Text style={stylesOtpModal.subtitle}>We have sent an OTP to your email. Please enter it below.</Text>
          <TextInput
            style={stylesOtpModal.input}
            placeholder="Enter OTP"
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
    backgroundColor: '#007BFF', // Button color
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
})