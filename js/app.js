// ======================================================
// SMLT Expense Manager v3.1
// app.js
// ======================================================

import {

    createTrip,

    updateTrip,

    deleteTrip,

    subscribeTrips,

    searchTrips,

    calculateTotals

} from "./firestore.js";

import {

    formatCurrency,

    calculateIncome,

    calculateDriverSalary,

    calculateExpense,

    calculateProfit,

    showToast

} from "./utils.js";

// ======================================================
// GLOBAL VARIABLES
// ======================================================

let trips = [];

let filteredTrips = [];

let editingId = null;

// ======================================================
// DOM ELEMENTS
// ======================================================

const form = document.getElementById("tripForm");

const tripTable = document.getElementById("tripTable");

const searchInput = document.getElementById("searchInput");

const saveBtn = document.getElementById("saveBtn");

const clearBtn = document.getElementById("clearBtn");

// Dashboard

const tripCount = document.getElementById("tripCount");

const totalIncome = document.getElementById("totalIncome");

const totalExpense = document.getElementById("totalExpense");

const totalDriverSalary =
document.getElementById("totalDriverSalary");

const totalProfit =
document.getElementById("totalProfit");

// Form Inputs

const date =
document.getElementById("date");

const loading =
document.getElementById("loading");

const unloading =
document.getElementById("unloading");

const tonnage =
document.getElementById("tonnage");

const perTon =
document.getElementById("perTon");

const income =
document.getElementById("income");

const fuel =
document.getElementById("fuel");

const adBlue =
document.getElementById("adBlue");

const toll =
document.getElementById("toll");

const driverAdvance =
document.getElementById("driverAdvance");

const driverSalary =
document.getElementById("driverSalary");

const otherExpense =
document.getElementById("otherExpense");

const liveExpense =
document.getElementById("liveExpense");

const liveProfit =
document.getElementById("liveProfit");

// ======================================================
// TODAY
// ======================================================

date.value =

new Date()

.toISOString()

.split("T")[0];

// ======================================================
// LIVE CALCULATION
// ======================================================

function calculateForm(){

    const totalIncomeValue =

    calculateIncome(

        tonnage.value,

        perTon.value

    );

    income.value =

    totalIncomeValue.toFixed(2);

    const salary =

    calculateDriverSalary(

        totalIncomeValue,

        driverAdvance.value,

        otherExpense.value

    );

    driverSalary.value =

    salary.toFixed(2);

    const totalExpenseValue =

    calculateExpense({

        fuel:fuel.value,

        adBlue:adBlue.value,

        toll:toll.value,

        driverSalary:salary,

        otherExpense:otherExpense.value

    });

    const profit =

    calculateProfit(

        totalIncomeValue,

        totalExpenseValue

    );

    liveExpense.innerHTML =

    formatCurrency(

        totalExpenseValue

    );

    liveProfit.innerHTML =

    formatCurrency(

        profit

    );

}

// ======================================================
// INPUT EVENTS
// ======================================================

[

tonnage,

perTon,

fuel,

adBlue,

toll,

driverAdvance,

otherExpense

]

.forEach(input=>{

    input.addEventListener(

        "input",

        calculateForm

    );

});

// ======================================================
// CLEAR FORM
// ======================================================

function clearForm(){

    form.reset();

    editingId = null;

    saveBtn.innerHTML =

    "💾 Save Trip";

    date.value =

    new Date()

    .toISOString()

    .split("T")[0];

    calculateForm();

}

clearBtn.addEventListener(

    "click",

    clearForm

);

// ======================================================
// VALIDATION
// ======================================================

function validateForm(){

    if(

        loading.value.trim()===""

    ){

        showToast(

            "Loading is required",

            "error"

        );

        loading.focus();

        return false;

    }

    if(

        unloading.value.trim()===""

    ){

        showToast(

            "Unloading is required",

            "error"

        );

        unloading.focus();

        return false;

    }

    if(

        Number(

            tonnage.value

        )<=0

    ){

        showToast(

            "Enter valid tonnage",

            "error"

        );

        tonnage.focus();

        return false;

    }

    return true;

}

calculateForm();

// ======================================================
// SAVE / UPDATE TRIP
// ======================================================

form.addEventListener("submit", async function(e){

    e.preventDefault();

    if(!validateForm()) return;

    calculateForm();

    const trip={

        date:date.value,

        loading:loading.value.trim(),

        unloading:unloading.value.trim(),

        tonnage:Number(tonnage.value)||0,

        perTon:Number(perTon.value)||0,

        income:Number(income.value)||0,

        fuel:Number(fuel.value)||0,

        adBlue:Number(adBlue.value)||0,

        toll:Number(toll.value)||0,

        driverAdvance:Number(driverAdvance.value)||0,

        driverSalary:Number(driverSalary.value)||0,

        otherExpense:Number(otherExpense.value)||0

    };

    trip.expense = calculateExpense({

        fuel:trip.fuel,

        adBlue:trip.adBlue,

        toll:trip.toll,

        driverSalary:trip.driverSalary,

        otherExpense:trip.otherExpense

    });

    trip.profit = calculateProfit(

        trip.income,

        trip.expense

    );

    saveBtn.disabled = true;

    saveBtn.innerHTML =

    editingId

    ? "Updating..."

    : "Saving...";

    try{

        if(editingId){

            await updateTrip(

                editingId,

                trip

            );

            showToast(

                "Trip Updated Successfully"

            );

        }

        else{

            await createTrip(

                trip

            );

            showToast(

                "Trip Saved Successfully"

            );

        }

        clearForm();

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to Save Trip",

            "error"

        );

    }

    finally{

        saveBtn.disabled = false;

        saveBtn.innerHTML =

        editingId

        ? "💾 Update Trip"

        : "💾 Save Trip";

    }

});

// ======================================================
// CREATE EMPTY TABLE
// ======================================================

function emptyTable(){

    tripTable.innerHTML = `

    <tr>

        <td colspan="16"

            class="center">

            No Trips Available

        </td>

    </tr>

    `;

}

// ======================================================
// INITIAL TABLE
// ======================================================

emptyTable();

// ======================================================
// DISPLAY TRIPS
// ======================================================

function displayTrips(data = trips){

    filteredTrips = data;

    if(filteredTrips.length===0){

        emptyTable();

        updateDashboard([]);

        updateGrandTotals([]);

        return;

    }

    tripTable.innerHTML="";

    filteredTrips.forEach((trip,index)=>{

        const row=document.createElement("tr");

        row.innerHTML=`

            <td>${index+1}</td>

            <td>${trip.date}</td>

            <td>${trip.loading}</td>

            <td>${trip.unloading}</td>

            <td>${trip.tonnage}</td>

            <td>${formatCurrency(trip.perTon)}</td>

            <td>${formatCurrency(trip.income)}</td>

            <td>${formatCurrency(trip.fuel)}</td>

            <td>${formatCurrency(trip.adBlue)}</td>

            <td>${formatCurrency(trip.toll)}</td>

            <td>${formatCurrency(trip.driverAdvance)}</td>

            <td>${formatCurrency(trip.driverSalary)}</td>

            <td>${formatCurrency(trip.otherExpense)}</td>

            <td>${formatCurrency(trip.expense)}</td>

            <td class="${
                trip.profit>=0
                ? "profit"
                : "loss"
            }">

                ${formatCurrency(trip.profit)}

            </td>

            <td>

                <button
                    class="edit-btn"
                    data-id="${trip.id}">

                    ✏ Edit

                </button>

                <button
                    class="delete-btn"
                    data-id="${trip.id}">

                    🗑 Delete

                </button>

            </td>

        `;

        tripTable.appendChild(row);

    });

    document.getElementById("filteredCount").textContent =
    filteredTrips.length;

    document.getElementById("totalCount").textContent =
    trips.length;

    updateDashboard(filteredTrips);

    updateGrandTotals(filteredTrips);

}

// ======================================================
// DASHBOARD
// ======================================================

function updateDashboard(data){

    const totals = calculateTotals(data);

    tripCount.textContent =
    totals.count;

    totalIncome.textContent =
    formatCurrency(totals.income);

    totalExpense.textContent =
    formatCurrency(totals.expense);

    totalDriverSalary.textContent =
    formatCurrency(totals.driverSalary);

    totalProfit.textContent =
    formatCurrency(totals.profit);

}

// ======================================================
// GRAND TOTALS
// ======================================================

function updateGrandTotals(data){

    const totals = calculateTotals(data);

    document.getElementById("grandIncome").textContent =
    formatCurrency(totals.income);

    document.getElementById("grandFuel").textContent =
    formatCurrency(totals.fuel);

    document.getElementById("grandAdBlue").textContent =
    formatCurrency(totals.adBlue);

    document.getElementById("grandToll").textContent =
    formatCurrency(totals.toll);

    document.getElementById("grandAdvance").textContent =
    formatCurrency(totals.driverAdvance);

    document.getElementById("grandSalary").textContent =
    formatCurrency(totals.driverSalary);

    document.getElementById("grandOther").textContent =
    formatCurrency(totals.otherExpense);

    document.getElementById("grandExpense").textContent =
    formatCurrency(totals.expense);

    document.getElementById("grandProfit").textContent =
    formatCurrency(totals.profit);

}

// ======================================================
// SEARCH
// ======================================================

searchInput.addEventListener("input",()=>{

    const keyword =

    searchInput.value.trim();

    const result =

    searchTrips(

        trips,

        keyword

    );

    displayTrips(result);

});

// ======================================================
// RESET SEARCH
// ======================================================

document

.getElementById("resetSearch")

.addEventListener("click",()=>{

    searchInput.value="";

    displayTrips(trips);

});

// ======================================================
// EDIT TRIP
// ======================================================

function editTrip(id){

    const trip = trips.find(t => t.id === id);

    if(!trip){

        showToast("Trip not found","error");

        return;

    }

    editingId = id;

    date.value = trip.date;

    loading.value = trip.loading;

    unloading.value = trip.unloading;

    tonnage.value = trip.tonnage;

    perTon.value = trip.perTon;

    income.value = trip.income;

    fuel.value = trip.fuel;

    adBlue.value = trip.adBlue;

    toll.value = trip.toll;

    driverAdvance.value = trip.driverAdvance;

    driverSalary.value = trip.driverSalary;

    otherExpense.value = trip.otherExpense;

    calculateForm();

    saveBtn.innerHTML = "💾 Update Trip";

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

// ======================================================
// DELETE TRIP
// ======================================================

async function removeTrip(id){

    if(!confirm("Delete this trip?"))

        return;

    try{

        await deleteTrip(id);

        showToast("Trip Deleted");

    }

    catch(error){

        console.error(error);

        showToast("Delete Failed","error");

    }

}

// ======================================================
// TABLE BUTTON EVENTS
// ======================================================

tripTable.addEventListener("click",(event)=>{

    const button = event.target.closest("button");

    if(!button) return;

    const id = button.dataset.id;

    if(button.classList.contains("edit-btn")){

        editTrip(id);

    }

    else if(button.classList.contains("delete-btn")){

        removeTrip(id);

    }

});

// ======================================================
// FIRESTORE REALTIME LISTENER
// ======================================================

subscribeTrips((data)=>{

    trips = data;

    displayTrips(trips);

});

// ======================================================
// AUTO REFRESH
// ======================================================

window.addEventListener("focus",()=>{

    displayTrips(trips);

});

// ======================================================
// AUTO RECALCULATE
// ======================================================

calculateForm();

// ======================================================
// BACKUP TO JSON
// ======================================================

document

.getElementById("backupBtn")

.addEventListener("click", backupTrips);

function backupTrips(){

    const backup = {

        app: "SMLT Expenses Manager",

        version: "3.1",

        exportedAt: new Date().toISOString(),

        trips

    };

    const blob = new Blob(

        [

            JSON.stringify(

                backup,

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    const today = new Date();

    const fileName =

        `SMLT-BACKUP-${
            today.getDate().toString().padStart(2,"0")
        }-${
            (today.getMonth()+1).toString().padStart(2,"0")
        }-${
            today.getFullYear()
        }.json`;

    a.href = url;

    a.download = fileName;

    a.click();

    URL.revokeObjectURL(url);

}

// ======================================================
// RESTORE JSON
// ======================================================

const restoreFile =

document.getElementById("restoreFile");

document

.getElementById("restoreBtn")

.addEventListener("click",()=>{

    restoreFile.click();

});

restoreFile.addEventListener(

    "change",

    async function(e){

        const file = e.target.files[0];

        if(!file) return;

        const reader = new FileReader();

        reader.onload = async function(event){

            try{

                const backup = JSON.parse(

                    event.target.result

                );

                if(!backup.trips){

                    throw new Error();

                }

                if(

                    !confirm(

                        "Import all trips?"

                    )

                ){

                    return;

                }

                for(const trip of backup.trips){

                    delete trip.id;

                    await createTrip(trip);

                }

                showToast(

                    "Backup Restored"

                );

            }

            catch(error){

                console.error(error);

                showToast(

                    "Invalid Backup",

                    "error"

                );

            }

        };

        reader.readAsText(file);

    }

);

// ======================================================
// ONLINE / OFFLINE
// ======================================================

window.addEventListener(

    "online",

    ()=>{

        showToast(

            "Connected"

        );

    }

);

window.addEventListener(

    "offline",

    ()=>{

        showToast(

            "Offline Mode",

            "error"

        );

    }

);

// ======================================================
// INITIALIZE
// ======================================================

function initialize(){

    calculateForm();

    displayTrips([]);

}

initialize();

// ======================================================
// END OF APP
// ======================================================

console.log(

    "SMLT Expense Manager v3.1 Loaded"

);