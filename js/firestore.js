// ======================================================
// SMLT Expense Manager v3.1
// Firestore Service
// ======================================================

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    doc,
    query,
    orderBy,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ======================================================
// Collection Reference
// ======================================================

const tripsRef = collection(db, "trips");

// ======================================================
// Create Trip
// ======================================================

export async function createTrip(trip){

    try{

        const docRef = await addDoc(tripsRef,{

            ...trip,

            createdAt:serverTimestamp(),

            updatedAt:serverTimestamp()

        });

        return docRef.id;

    }

    catch(error){

        console.error("Create Trip Error:",error);

        throw error;

    }

}

// ======================================================
// Update Trip
// ======================================================

export async function updateTrip(id,data){

    try{

        const ref = doc(db,"trips",id);

        await updateDoc(ref,{

            ...data,

            updatedAt:serverTimestamp()

        });

    }

    catch(error){

        console.error("Update Trip Error:",error);

        throw error;

    }

}

// ======================================================
// Delete Trip
// ======================================================

export async function deleteTrip(id){

    try{

        await deleteDoc(

            doc(db,"trips",id)

        );

    }

    catch(error){

        console.error("Delete Trip Error:",error);

        throw error;

    }

}

// ======================================================
// Get One Trip
// ======================================================

export async function getTrip(id){

    try{

        const snap = await getDoc(

            doc(db,"trips",id)

        );

        if(!snap.exists()) return null;

        return{

            id:snap.id,

            ...snap.data()

        };

    }

    catch(error){

        console.error(error);

        return null;

    }

}

// ======================================================
// Get All Trips
// ======================================================

export async function getAllTrips(){

    try{

        const q = query(

            tripsRef,

            orderBy("createdAt","desc")

        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc=>({

            id:doc.id,

            ...doc.data()

        }));

    }

    catch(error){

        console.error(error);

        return [];

    }

}

// ======================================================
// Realtime Listener
// ======================================================

export function subscribeTrips(callback){

    const q = query(

        tripsRef,

        orderBy("createdAt","desc")

    );

    return onSnapshot(

        q,

        snapshot=>{

            const trips=[];

            snapshot.forEach(doc=>{

                trips.push({

                    id:doc.id,

                    ...doc.data()

                });

            });

            callback(trips);

        },

        error=>{

            console.error("Realtime Error:",error);

        }

    );

}

// ======================================================
// Search Trips
// ======================================================

export function searchTrips(trips,keyword){

    if(!keyword) return trips;

    keyword=keyword.toLowerCase();

    return trips.filter(trip=>{

        return(

            (trip.date||"")

            .toLowerCase()

            .includes(keyword)

            ||

            (trip.loading||"")

            .toLowerCase()

            .includes(keyword)

            ||

            (trip.unloading||"")

            .toLowerCase()

            .includes(keyword)

        );

    });

}

// ======================================================
// Calculate Totals
// ======================================================

export function calculateTotals(trips){

    return trips.reduce((totals,trip)=>{

        totals.income += Number(trip.income||0);

        totals.fuel += Number(trip.fuel||0);

        totals.adBlue += Number(trip.adBlue||0);

        totals.toll += Number(trip.toll||0);

        totals.driverAdvance += Number(trip.driverAdvance||0);

        totals.driverSalary += Number(trip.driverSalary||0);

        totals.otherExpense += Number(trip.otherExpense||0);

        totals.expense += Number(trip.expense||0);

        totals.profit += Number(trip.profit||0);

        totals.count++;

        return totals;

    },{

        count:0,

        income:0,

        fuel:0,

        adBlue:0,

        toll:0,

        driverAdvance:0,

        driverSalary:0,

        otherExpense:0,

        expense:0,

        profit:0

    });

}