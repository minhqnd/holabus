import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { getDatabase, ref, get, query, orderByChild, equalTo } from 'firebase/database'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

// Add this to verify connection
if (process.env.NODE_ENV === 'development') {
    console.log('Firebase initialized with database:', database)
}

export { app, database, ref, get, query, orderByChild, equalTo }