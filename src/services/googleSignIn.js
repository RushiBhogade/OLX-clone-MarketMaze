// src/services/googleSignIn.js
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

let signInInProgress = false;

GoogleSignin.configure({
  webClientId:
    '723407935529-7bsr23tsk3t6o2fv688r5avolg5f2cbn.apps.googleusercontent.com', // Replace with your actual Web Client ID
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
});

export const signInWithGoogle = async () => {
  if (signInInProgress) {
    return;
  }

  signInInProgress = true;

  try {
    // Get the user's ID token
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const {idToken} = userInfo;

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);
    signInInProgress = false;
    return userCredential;
  } catch (error) {
    console.error('Google Sign-In error:', error.code, error.message);
    signInInProgress = false;
    throw error;
  }
};
