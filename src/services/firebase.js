import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const db = firestore();
const storageRef = storage();
const authRef = auth();

export {db, storageRef, authRef};
