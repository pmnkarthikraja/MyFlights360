import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCg8GgSK8-jJuP4FBox5dt3k2LsLDq2nrI",
  authDomain: "myflight360-591f4.firebaseapp.com",
  projectId: "myflight360-591f4",
  storageBucket: "myflight360-591f4.firebasestorage.app",
  messagingSenderId: "376803482861",
  appId: "1:376803482861:web:67b73020dca9c2675940e4"
};


const app = initializeApp(firebaseConfig);
console.log('Firebase initialized:', app.name); 
const auth = getAuth(app);
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
}
export { auth };

