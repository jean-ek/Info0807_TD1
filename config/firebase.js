import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database'
import Constants from 'expo-constants';

// add firebase config
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  databaseURL:"https://course-velo-g3-4ee27-default-rtdb.europe-west1.firebasedatabase.app/",
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId
};

// initialize firebase

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const db = app.database();
const auth = firebase.auth();

export { db, auth };