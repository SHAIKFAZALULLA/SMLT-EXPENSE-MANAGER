// ======================================================
// SMLT Expense Manager v3.1
// utils.js
// ======================================================

// ===============================
// Format Currency
// ===============================

export function formatCurrency(value){

    return "₹ " +

    Number(value || 0).toLocaleString("en-IN",{

        minimumFractionDigits:2,

        maximumFractionDigits:2

    });

}

// ===============================
// Format Date
// ===============================

export function formatDate(date){

    if(!date) return "";

    const d = new Date(date);

    return d.toLocaleDateString("en-GB");

}

// ===============================
// Calculate Income
// ===============================

export function calculateIncome(tonnage, perTon){

    tonnage = Number(tonnage || 0);

    perTon = Number(perTon || 0);

    return tonnage * perTon;

}

// ===============================
// Calculate Driver Salary
// 10% of Income
// Driver Adv - Other Expense
// Remaining deducted from salary
// ===============================

export function calculateDriverSalary(

    income,

    driverAdvance,

    otherExpense

){

    income = Number(income || 0);

    driverAdvance = Number(driverAdvance || 0);

    otherExpense = Number(otherExpense || 0);

    const totalSalary = income * 0.10;

    const remainingAdvance = Math.max(

        0,

        driverAdvance - otherExpense

    );

    return Math.max(

        0,

        totalSalary - remainingAdvance

    );

}

// ===============================
// Calculate Total Expense
// ===============================

export function calculateExpense({

    fuel,

    adBlue,

    toll,

    driverSalary,

    otherExpense

}){

    return (

        Number(fuel || 0)

        + Number(adBlue || 0)

        + Number(toll || 0)

        + Number(driverSalary || 0)

        + Number(otherExpense || 0)

    );

}

// ===============================
// Calculate Profit
// ===============================

export function calculateProfit(

    income,

    expense

){

    return (

        Number(income || 0)

        - Number(expense || 0)

    );

}

// ===============================
// Show Toast Message
// ===============================

export function showToast(message,type="success"){

    let toast = document.getElementById("toast");

    if(!toast){

        toast = document.createElement("div");

        toast.id = "toast";

        document.body.appendChild(toast);

    }

    toast.className = type;

    toast.innerText = message;

    toast.style.display = "block";

    setTimeout(()=>{

        toast.style.display="none";

    },3000);

}

// ===============================
// Confirm Delete
// ===============================

export function confirmDelete(){

    return confirm(

        "Delete this trip permanently?"

    );

}