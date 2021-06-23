import firebase from "firebase";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBxSAxb6EH4igxpLucILMgRekrjd_aK7Zk",
    authDomain: "nextfire-9779f.firebaseapp.com",
    projectId: "nextfire-9779f",
    storageBucket: "nextfire-9779f.appspot.com",
    messagingSenderId: "294711504908",
    appId: "1:294711504908:web:e8da2e6a496a422081be29",
    measurementId: "G-EV0WSKC98V",
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const firestore = firebase.firestore()
export const fromMillis = firebase.firestore.Timestamp.fromMillis
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
export const increment = firebase.firestore.FieldValue.increment

export const storage = firebase.storage()
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED

/// Helper functions

/**`
* Gets a users/{uid} document with username
* @param {string} username
*/
export async function getUserWithUsername(username) {
    const usersRef = firestore.collection('users')
    const query = usersRef.where('username', '==', username).limit(1)
    const userDoc = (await query.get()).docs[0]
    return userDoc
}

/**
 * Converts a Firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
    const data = doc.data()
    return {
        ...data,
        // Firebase timestamps are not serializable to JSON by default
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    }
}