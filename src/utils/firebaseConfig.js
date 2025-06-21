// Firebase configuration for Zybl Passport
// src/utils/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiK3T07NvTjFJ5S2gLCRXYLZdfAOM-oz4",
  authDomain: "zybl-key.firebaseapp.com",
  projectId: "zybl-key",
  storageBucket: "zybl-key.firebasestorage.app",
  messagingSenderId: "457906869938",
  appId: "1:457906869938:web:b8932aa47c1b83d0529bab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection names
const USERS_COLLECTION = 'users';
const USER_JOURNEYS_COLLECTION = 'userJourneys';

/**
 * Create or get existing user ID for wallet address
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<string>} - Unique user ID
 */
export const createOrGetUserID = async (walletAddress) => {
  try {
    // Check if user with this wallet address exists
    const userQuery = query(collection(db, USERS_COLLECTION), where('walletAddress', '==', walletAddress));
    const userSnapshot = await getDocs(userQuery);
    
    if (!userSnapshot.empty) {
      // User exists, return their ID
      const userData = userSnapshot.docs[0].data();
      return userData.userID;
    }
    
    // Create new user with unique ID
    const userID = uuidv4();
    await setDoc(doc(db, USERS_COLLECTION, userID), {
      userID,
      walletAddress,
      createdAt: new Date(),
      lastActive: new Date()
    });
    
    return userID;
  } catch (error) {
    console.error("Error creating/getting user ID:", error);
    // Fallback to local unique ID if Firebase fails
    return `local_${uuidv4()}`;
  }
};

/**
 * Track user journey step
 * @param {string} userID - Unique user ID
 * @param {string} step - Current journey step (signin, verification, payment, dashboard)
 * @param {Object} data - Additional data for this step
 * @returns {Promise<boolean>} - Success status
 */
export const trackUserJourney = async (userID, step, data = {}) => {
  try {
    // Get journey document or create if it doesn't exist
    const journeyRef = doc(db, USER_JOURNEYS_COLLECTION, userID);
    const journeyDoc = await getDoc(journeyRef);
    
    if (journeyDoc.exists()) {
      // Update existing journey
      await updateDoc(journeyRef, {
        [`${step}Completed`]: true,
        [`${step}CompletedAt`]: new Date(),
        [`${step}Data`]: data,
        lastUpdated: new Date()
      });
    } else {
      // Create new journey record
      await setDoc(journeyRef, {
        userID,
        journeyStarted: new Date(),
        [`${step}Completed`]: true,
        [`${step}CompletedAt`]: new Date(),
        [`${step}Data`]: data,
        lastUpdated: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error(`Error tracking user journey step ${step}:`, error);
    return false;
  }
};

export { db };
export default app;
