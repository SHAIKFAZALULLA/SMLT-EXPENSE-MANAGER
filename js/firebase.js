// =====================================================
// SMLT Expense Manager v3.1
// firebase.js
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    initializeFirestore,
    persistentLocalCache,
    persistentSingleTabManager
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// =====================================================
// Firebase Configuration
// =====================================================

const firebaseConfig = {

    apiKey: "AIzaSyAbbGec9DdZ0lILBObDXMgTsdHlBcslR-g",

    authDomain: "smlt-expense-manager.firebaseapp.com",

    projectId: "smlt-expense-manager",

    storageBucket: "smlt-expense-manager.firebasestorage.app",

    messagingSenderId: "454618691283",

    appId: "1:454618691283:web:0f976826de83a269244626"

};

// =====================================================
// Initialize Firebase
// =====================================================

const app = initializeApp(firebaseConfig);

// =====================================================
// Firestore
// =====================================================

const db = initializeFirestore(app,{

    localCache:persistentLocalCache({

        tabManager:persistentSingleTabManager()

    })

});

export { db };