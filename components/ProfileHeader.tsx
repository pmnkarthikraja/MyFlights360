// import { auth } from '@/config';
// import { findLocalUser } from '@/persistents';
// import { LinearGradient } from 'expo-linear-gradient';
// import React, { useEffect } from 'react';
// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// interface ProfileHeaderProps {
//   onLogout: () => void;
// }

// const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onLogout }) => {
//   const user = auth.currentUser;
//   const [localUser, setLocalUser] = React.useState<any>(null);

//   console.log("local user",localUser)

//   useEffect(() => {
//     const fetchLocalUser = async () => {
//         console.log("on fetch user",user, auth.currentUser?.email)
//       if (user==null && auth.currentUser?.email) {
//         const foundUser = await findLocalUser(auth.currentUser.email, '', false);
//         setLocalUser(foundUser);
//       }

//     };
//     fetchLocalUser();
//   }, []);

//   const displayName = user?.displayName || localUser?.userName || 'User';
//   const email = user?.email || localUser?.email || 'No email';

//   return (
//     <LinearGradient colors={['#007BFF', '#00C6FF']} style={styles.header}>
//       <View style={styles.profileContainer}>
//         <Image
//           source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png' }}
//           style={styles.avatar}
//         />
//         <View style={styles.textContainer}>
//           <Text style={styles.name}>{displayName}</Text>
//           <Text style={styles.email}>{email}</Text>
//         </View>
//         <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     padding: 20,
//     paddingTop: 40,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   profileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 15,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//     fontFamily: 'Roboto',
//   },
//   email: {
//     fontSize: 14,
//     color: '#E0E0E0',
//     fontFamily: 'Roboto',
//   },
//   logoutButton: {
//     backgroundColor: '#fff',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//   },
//   logoutText: {
//     color: '#007BFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });

// export default ProfileHeader;


import { findLocalUser } from '@/persistents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileHeaderProps {
  onLogout: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onLogout }) => {
  const [currentUser, setCurrentUser] = useState<{ userName: string; email: string } | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Get the email of the currently logged-in user
        const currentUserEmail = await AsyncStorage.getItem('currentUserEmail');
        console.log('Fetching current user email:', currentUserEmail);
        if (currentUserEmail) {
          // Find user in local storage (password not needed for display)
          const user = await findLocalUser(currentUserEmail, '',false);
          console.log('Fetched local user:', user);
          if (user) {
            setCurrentUser({ userName: user.userName, email: user.email });
          } else {
            console.log('No local user found for email:', currentUserEmail);
          }
        } else {
          console.log('No current user email in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching local user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const displayName = currentUser?.userName || 'User';
  const email = currentUser?.email || 'No email';

  return (
    <LinearGradient colors={['#007BFF', '#00C6FF']} style={styles.header}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png' }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Roboto',
  },
  email: {
    fontSize: 14,
    color: '#E0E0E0',
    fontFamily: 'Roboto',
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  logoutText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProfileHeader;