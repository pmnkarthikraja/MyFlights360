import AsyncStorage from "@react-native-async-storage/async-storage"

export interface User {
    userName: string,
    email: string,
    password?: string
    profilePicture?: string
    googlePicture?: string
    googleId?:string
}

// export interface GoogleUser {
//     id: string,
//     email: string,
//     name: string,
//     picture: string
// }

export const getCurrentUser = async ():Promise<User|null> => {
    const result = await AsyncStorage.getItem('token')
    if (result!=null){
      try{
        const gotUser:User =JSON.parse(result)
        console.log("current user:",gotUser)
        return gotUser
      }catch(e){
        console.log("error on json parse err",e)
        return null
      }
    }
    return null
}