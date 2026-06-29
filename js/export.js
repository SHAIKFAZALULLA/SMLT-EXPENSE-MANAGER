// ======================================================
// SMLT Expense Manager v3.1
// export.js
// ======================================================

import { getAllTrips, calculateTotals } from "./firestore.js";

import { formatDate } from "./utils.js";

document
.getElementById("exportExcel")
.addEventListener("click", exportExcel);

// ======================================================
// EXPORT EXCEL
// ======================================================

async function exportExcel(){

    try{

        const trips = await getAllTrips();

        if(trips.length===0){

            alert("No trips available.");

            return;

        }

        const workbook = XLSX.utils.book_new();

        // =============================================
        // TRIPS SHEET
        // =============================================

        const rows=[];

        rows.push(["SMLT EXPENSES MANAGER"]);

        rows.push([]);

        rows.push([

            "Export Date",

            new Date().toLocaleString()

        ]);

        rows.push([]);

        rows.push([

            "S.No",

            "Date",

            "Loading",

            "Unloading",

            "Tonnage",

            "Per Ton",

            "Income",

            "Fuel",

            "AD Blue",

            "Toll",

            "Driver Adv",

            "Driver Salary",

            "Other Expense",

            "Total Expense",

            "Profit"

        ]);

        trips.forEach((trip,index)=>{

            rows.push([

                index+1,

                formatDate(trip.date),

                trip.loading,

                trip.unloading,

                trip.tonnage,

                trip.perTon,

                trip.income,

                trip.fuel,

                trip.adBlue,

                trip.toll,

                trip.driverAdvance,

                trip.driverSalary,

                trip.otherExpense,

                trip.expense,

                trip.profit

            ]);

        });

        const totals = calculateTotals(trips);

        rows.push([]);

        rows.push([

            "",

            "",

            "",

            "",

            "",

            "TOTAL",

            totals.income,

            totals.fuel,

            totals.adBlue,

            totals.toll,

            totals.driverAdvance,

            totals.driverSalary,

            totals.otherExpense,

            totals.expense,

            totals.profit

        ]);

        const sheet = XLSX.utils.aoa_to_sheet(rows);

        sheet["!cols"]=[

            {wch:8},

            {wch:15},

            {wch:25},

            {wch:25},

            {wch:12},

            {wch:12},

            {wch:15},

            {wch:12},

            {wch:12},

            {wch:12},

            {wch:15},

            {wch:15},

            {wch:18},

            {wch:18},

            {wch:18}

        ];

        XLSX.utils.book_append_sheet(

            workbook,

            sheet,

            "Trip Register"

        );

        // =============================================
        // SUMMARY SHEET
        // =============================================

        const summary=[];

        summary.push(["SMLT Expenses Summary"]);

        summary.push([]);

        summary.push(["Total Trips", totals.count]);

        summary.push(["Total Income", totals.income]);

        summary.push(["Fuel", totals.fuel]);

        summary.push(["AD Blue", totals.adBlue]);

        summary.push(["Toll", totals.toll]);

        summary.push(["Driver Advance", totals.driverAdvance]);

        summary.push(["Driver Salary", totals.driverSalary]);

        summary.push(["Other Expense", totals.otherExpense]);

        summary.push(["Total Expense", totals.expense]);

        summary.push(["Total Profit", totals.profit]);

        const summarySheet = XLSX.utils.aoa_to_sheet(summary);

        summarySheet["!cols"]=[

            {wch:30},

            {wch:20}

        ];

        XLSX.utils.book_append_sheet(

            workbook,

            summarySheet,

            "Summary"

        );

        // =============================================
        // FILE NAME
        // =============================================

        const today = new Date();

        const fileDate =

            String(today.getDate()).padStart(2,"0")

            + "-"

            + String(today.getMonth()+1).padStart(2,"0")

            + "-"

            + today.getFullYear();

        XLSX.writeFile(

            workbook,

            `SMLT-EXPENSES-${fileDate}.xlsx`

        );

    }

    catch(error){

        console.error(error);

        alert("Unable to export Excel.");

    }

}