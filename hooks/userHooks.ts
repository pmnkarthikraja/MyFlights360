// import { useUser } from "@/components/userContext";
// import { User } from "@/utils/user";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { AxiosError, AxiosResponse } from "axios";
// import { router } from "expo-router";
// import { useMutation, useQuery, useQueryClient } from "react-query";

// interface AxiosErrorType {
//   message: string,
//   success: boolean
// }

// export const useGetAllUsers = () => {
//   const { data, error, isLoading, refetch, isError } = useQuery({
//     queryKey: ['users'],
//     queryFn: async () => {
//       const res = await userApi.getAllUsers()
//       return res.data
//     },
//     refetchOnWindowFocus: false,
//     staleTime: 5 * 60 * 1000,
//   });

//   return {
//     usersData:data,
//     error,
//     usersLoading:isLoading,
//     refetch,
//     isError
//   };
// };


// export const useEmailSignupMutation = (validatePassword: boolean) => {
//   const queryClient = useQueryClient();
//   const { setUser } = useUser()

//   return useMutation(
//     (userDetails: User) => userApi.signup(userDetails),
//     {
//       onSuccess: async (data) => {
//         queryClient.invalidateQueries('userDetails');
//         if (!validatePassword) {
//           await AsyncStorage.setItem('user', JSON.stringify(data.data.user))
//           setUser(data.data.user)
//         }
//         setTimeout(() => {
//           router.navigate('/')
//         }, 500)
//       },
//       onError: (e: AxiosError<AxiosErrorType>) => {
//         console.log("error on onRegister", e);
//       }
//     }
//   );
// };

// export const useDeleteUserAccount = () => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     (email: string) => {
//       return userApi.deleteUserAccount(email);
//     },
//     {
//       onSuccess: (data) => {
//         queryClient.invalidateQueries('userDetails');
//         localStorage.removeItem('token')
//       },
//       onError: (e: AxiosError<AxiosErrorType>) => {
//         console.log("error on delete user", e);
//       }
//     }
//   );
// };


// export const useAuthUser = () => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     AxiosResponse<{ message: string, success: boolean, user: User }, AxiosError<AxiosErrorType>>,
//     AxiosError<AxiosErrorType>,
//     string,
//     unknown
//   >(
//     'userDetails',
//     async (token: string) => {
//       return userApi.authToken(token)
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries('userDetails');
//       },
//       onError: (e) => {
//         console.log("Error during authentication", e);
//       }
//     }
//   );
// };

// interface OTPPayload {
//   email: string,
//   accountVerification: boolean,
//   type: 'forgotPassword' | 'verification',
//   userName: string | undefined
// }

// export const useSendOTPMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     (payload: OTPPayload) => userApi.sendOTP(payload.email, payload.accountVerification, payload.type, payload.userName),
//     {
//       onSuccess: (data) => {
//         queryClient.invalidateQueries('userclient');
//       },
//       onError: (e: AxiosError<AxiosErrorType>) => {
//         console.log("error on sending otp: ", e)
//       }
//     }
//   )
// }

// interface VerifyOTPPayload {
//   email: string,
//   otp: string
// }

// export const useVerifyOTPMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     (payload: VerifyOTPPayload) => userApi.verifyOTP(payload.email, payload.otp),
//     {
//       onSuccess: (data) => {
//         queryClient.invalidateQueries('userclient');
//       },
//       onError: (e: AxiosError<AxiosErrorType>) => {
//         console.log("error on verifying otp: ", e)
//       }
//     }
//   )
// }

// interface ValidatePasswordPayload {
//   email: string,
//   password: string,
// }

// export const useValidatePassword = () => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     (payload: ValidatePasswordPayload) => userApi.validatePassword(payload.email, payload.password),
//     {
//       onSuccess: (data) => {
//         queryClient.invalidateQueries('userclient');
//       },
//       onError: (e: AxiosError<AxiosErrorType>) => {
//         console.log("error on validating password: ", e)
//       }
//     }
//   )
// }

// export const useResetPassword = () => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     (payload: ValidatePasswordPayload) => userApi.resetPassword(payload.email, payload.password),
//     {
//       onSuccess: (data) => {
//         queryClient.invalidateQueries('userclient');
//       },
//       onError: (e: AxiosError<AxiosErrorType>) => {
//         console.log("error on reseting password: ", e)
//       }
//     }
//   )
// }


// export const useEmailSigninMutation = (validatePassword: boolean) => {
//   const queryClient = useQueryClient();
//   const { setUser } = useUser()

//   return useMutation(
//     (user: User) => userApi.login(user),
//     {
//       onSuccess: async (data) => {
//         queryClient.invalidateQueries('userDetails');
//         if (!validatePassword) {
//           await AsyncStorage.setItem('user', JSON.stringify(data.data.user))
//           setUser(data.data.user)
//         }
//       },
//       onError: (e: AxiosError<AxiosErrorType>) => {
//         console.log("error on onLogin: ", e);
//       }
//     }
//   );
// };

// interface GoogleLoginPayload {
//   email: string,
//   googleId: string
// }

// export const useGoogleSigninMutation = () => {
//   const queryClient = useQueryClient();
//   const { setUser } = useUser()

//   return useMutation(
//     (payload: GoogleLoginPayload) => userApi.googleLogin(payload.googleId, payload.email),
//     {
//       onSuccess: async (data) => {
//         queryClient.invalidateQueries('userDetails');
//         await AsyncStorage.setItem('user', JSON.stringify(data.data.user))
//         setUser(data.data.user as User)

//         setTimeout(() => {
//           router.replace('/(tabs)')
//         }, 500)
//       },
//       onError: (e: AxiosError<AxiosErrorType>) => {
//         console.log("error on google login", e);
//       }
//     }
//   );
// };


// export const useGoogleSignupMutation = () => {
//   const queryClient = useQueryClient();
//   const { setUser } = useUser()

//   return useMutation(
//     async (accessToken: string) => await userApi.googleSignup(accessToken),
//     {
//       onSuccess: async (data) => {
//         queryClient.invalidateQueries('userDetails');
//         await AsyncStorage.setItem('user', JSON.stringify(data.data.user))
//         setUser(data.data.user as User)

//         router.navigate('/')
//       },
//       onError: (e: AxiosError<any>) => {
//         console.log("error on google signup", e);
//         router.navigate('/signup')
//       }
//     }
//   );
// }

// interface EditProfilePayload {
//   email: string,
//   password: string,
//   userName: string,
//   profilePicture: string
// }

// export const useEditProfileMutation = () => {
//   const queryClient = useQueryClient();
//   const { setUser } = useUser()

//   return useMutation(
//     (user: EditProfilePayload) => userApi.editProfile(user.email, user.password, user.userName, user.profilePicture),
//     {
//       onSuccess: async (data) => {
//         queryClient.invalidateQueries('userDetails');
//         await AsyncStorage.removeItem('user')
//         await AsyncStorage.setItem('user', JSON.stringify(data.data.user))
//         setUser(data.data.user)

//         console.log("on edit profile mutation success: ", data);
//       },
//       onError: (e: AxiosError<AxiosErrorType>) => {
//         console.log("error on edit profile", e);
//       }
//     }
//   );
// };


// export const useGetMasterSwitchData = (email: string, refetchInterval?: number) => {
//   return useQuery({
//     queryKey: ['masterSwitchData'],
//     queryFn: async () => {
//       return await userApi.getMasterSwitchData(email)
//     },
//     onError: (e: AxiosError<AxiosErrorType>) => e,
//     refetchInterval: false,
//   })
// }

// export const useToggleMasterSwitchData = () => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     (data: MasterSwitchData) => userApi.toggleMasterSwitchData(data),
//     {
//       onSuccess: (data) => {
//         queryClient.invalidateQueries('masterSwitchData');
//       },
//       onError: (e: AxiosError<AxiosErrorType>) => {
//         console.log("error on toggle master switch", e);
//       }
//     }
//   );
// };