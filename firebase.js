import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCOhItVy6QJaENyZxAc57_e_YOiWl_mq_c',
  authDomain: 'travel-planner-codex.firebaseapp.com',
  projectId: 'travel-planner-codex',
  storageBucket: 'travel-planner-codex.firebasestorage.app',
  messagingSenderId: '807049061422',
  appId: '1:807049061422:web:adacaf28604ed87a94ebbf',
  measurementId: 'G-R1MEKTJW2R'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
let analytics;
try {
  analytics = getAnalytics(app);
} catch (_) {
  // analytics not supported in this environment
}
export { analytics };
