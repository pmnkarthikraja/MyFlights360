// import { Link } from 'expo-router';
// import React, { useState } from 'react';
// import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     console.log('Login:', email, password);
//     // TODO: Implement Firebase login here
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Login</Text>
//       <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Log In</Text>
//       </TouchableOpacity>

//       <Link href={'/(auth)/signup'} style={{
//         marginTop:20
//       }}>
//         <Text style={styles.linkText}>Don't have an account? Sign up</Text>
//       </Link>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 10 },
//   button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8 },
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
import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession()

const Login: FunctionComponent = () => {
  const [forgotModal, setForgotModal] = useState(false)
  // const { isLoading: isEmailSigninLoading, isError: isEmailSigninError, error: emailSigninError, isSuccess: isEmailSigninSuccess, mutateAsync: emailSigninMutation,reset:emailsigninreset } = useEmailSigninMutation(false)
  // const { isLoading: isGoogleSigninLoading, isError: isGoogleSigninError, error: googleSigninError, mutateAsync: googleSigninMutation, reset:googlesigninreset } = useGoogleSigninMutation()
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
  //     native: 'com.anonymous.testexpoapp:/login',
  //   })
  // })

  const { handleSubmit, watch, formState: { errors }, control } = useForm<User>();

  const triggerForgotModal = () => {
    setForgotModal(r => !r)
  }

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     handleSigninWithGoogle();
  //   } else if (response?.type === 'error') {
  //     console.log('Login failed:', response?.error);
  //     router.navigate('/login')
  //   }
  // }, [response])


  // async function handleSigninWithGoogle() {
  //   if (response?.type === 'success') {
  //     await getUserInfo(response.authentication?.accessToken || '')
  //   }
  // }

  interface GoogleUser {
    id: string,
    email: string,
    name: string,
    picture: string
  }

  const getUserInfo = async (token: string) => {
    if (!token) return
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const user: GoogleUser = await response.json()
      // await googleSigninMutation({
      //   email: user.email,
      //   googleId: user.id
      // })
    } catch (e) {
      console.log("error on getting profile on google.", e)
      router.navigate('/login')
    }
  }

  const image = Asset.fromModule(require('../assets/images/login-image.png')).uri;
  //on mobile, raw path is not working. thats why we're giving this.ßß
  const handleForgotPassword = () => {
    setForgotModal(true)
  };

  const signInQuery = async () => {
    // googlesigninreset()
    // const data = watch()
    // await emailSigninMutation(data)
    router.navigate('/home')
  }

  const handleSignUp = () => {
    router.push('/signup')
  };

  return (
    <ImageBackground source={{ uri: image }} style={styles.backgroundImage}>
      {/* <ForgotPasswordModal modalVisible={forgotModal} triggerModal={triggerForgotModal} /> */}
      <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
        <View style={styles.container}>

          <Image source={{ uri: image }} style={styles.image} onError={e => console.log(e.nativeEvent.error)} />
          <Text style={styles.title}>Login</Text>
          {/* {(isEmailSigninLoading || isGoogleSigninLoading) &&
            <LoadingWidget/>
          } */}
          {/* <Text style={styles.errorText}>{isEmailSigninError && emailSigninError.response?.data.message || emailSigninError?.message}</Text> */}
          {/* <Text style={styles.errorText}>{isGoogleSigninError && googleSigninError.response?.data.message || googleSigninError?.message}</Text> */}
          
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

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSubmit(signInQuery)}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          {/* <View style={styles.signInOptionsContainer}>
            <Text style={styles.note}>Or sign in using</Text>

            <TouchableOpacity onPress={async () => {
              emailsigninreset()
              await promptAsync()
              }} style={styles.googleButton}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/281/281764.png' }} style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Google</Text>
            </TouchableOpacity>
            <View style={{ height: 20 }}></View>
          </View> */}

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
}

export default Login


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
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    textAlign: 'left'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
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
});