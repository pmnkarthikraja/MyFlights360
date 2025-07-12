
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createHash } from 'crypto';

// // Interface for local user data
// interface LocalUser {
//   userName: string;
//   email: string;
//   passwordHash: string; // Store hashed password for security
//   uid: string; // Generate a temporary UID
// }

// // Generate a simple UID for local storage
// const generateTempUid = () => {
//   return 'local_' + Math.random().toString(36).substr(2, 9);
// };

// // Hash password using SHA-256 (for simplicity; use bcrypt in production)
// const hashPassword = (password: string): string => {
//   return createHash('sha256').update(password).digest('hex');
// };

// // Save user to local storage
// export const saveLocalUser = async (user: { userName: string; email: string; password: string }) => {
//   try {
//     const users = await getLocalUsers();
//     const passwordHash = hashPassword(user.password);
//     const localUser: LocalUser = {
//       userName: user.userName,
//       email: user.email.toLowerCase(),
//       passwordHash,
//       uid: generateTempUid(),
//     };
//     users.push(localUser);
//     await AsyncStorage.setItem('localUsers', JSON.stringify(users));
//     console.log('User saved locally:', { email: user.email, uid: localUser.uid });
//     return localUser.uid;
//   } catch (error) {
//     console.error('Error saving local user:', error);
//     throw new Error('Failed to save user locally');
//   }
// };

// // Get all local users
// export const getLocalUsers = async (): Promise<LocalUser[]> => {
//   try {
//     const usersJson = await AsyncStorage.getItem('localUsers');
//     return usersJson ? JSON.parse(usersJson) : [];
//   } catch (error) {
//     console.error('Error retrieving local users:', error);
//     return [];
//   }
// };

// // Find user by email and password
// export const findLocalUser = async (email: string, password: string): Promise<LocalUser | null> => {
//   try {
//     const users = await getLocalUsers();
//     const passwordHash = hashPassword(password);
//     const user = users.find(
//       (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash
//     );
//     return user || null;
//   } catch (error) {
//     console.error('Error finding local user:', error);
//     return null;
//   }
// };




import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

// Interface for local user data
interface LocalUser {
  userName: string;
  email: string;
  passwordHash: string; // Store hashed password for security
  uid: string; // Generate a temporary UID
}

// Generate a simple UID for local storage
const generateTempUid = () => {
  return 'local_' + Math.random().toString(36).substr(2, 9);
};

// Hash password using SHA-256 with expo-crypto
const hashPassword = async (password: string): Promise<string> => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};

// Save user to local storage
export const saveLocalUser = async (user: { userName: string; email: string; password: string }) => {
  try {
    const users = await getLocalUsers();
    const passwordHash = await hashPassword(user.password);
    const localUser: LocalUser = {
      userName: user.userName,
      email: user.email.toLowerCase(),
      passwordHash,
      uid: generateTempUid(),
    };
    users.push(localUser);
    await AsyncStorage.setItem('localUsers', JSON.stringify(users));
    console.log('User saved locally:', { email: user.email, uid: localUser.uid });
    return localUser.uid;
  } catch (error) {
    console.error('Error saving local user:', error);
    throw new Error('Failed to save user locally');
  }
};

// Get all local users
export const getLocalUsers = async (): Promise<LocalUser[]> => {
  try {
    const usersJson = await AsyncStorage.getItem('localUsers');
    console.log("local users", usersJson)
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error retrieving local users:', error);
    return [];
  }
};

// Find user by email and password
export const findLocalUser = async (email: string, password: string, isLogin: boolean): Promise<LocalUser | null> => {
  console.log("find user", email)
  try {
    const users = await getLocalUsers();
    const passwordHash = await hashPassword(password);
    if (isLogin) {
      const user = users.find(
        (u) => u.email.toLowerCase() == email.toLowerCase() && u.passwordHash === passwordHash
      );
      return user || null
    }
    console.log("users",users)
    const user = users.find((u)=>u.email.toLowerCase()==email.toLowerCase())
    return user||null
  } catch (error) {
    console.error('Error finding local user:', error);
    return null;
  }
};
