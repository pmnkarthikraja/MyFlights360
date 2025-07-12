import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  email: string;
  password: string;
  userName?: string;
  uid?: string; // for firebase
}


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