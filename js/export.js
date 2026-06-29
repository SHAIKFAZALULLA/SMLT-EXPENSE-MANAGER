// ======================================================
// SMLT Expense Manager v3.1
// Professional Excel Export
// ======================================================

import { getAllTrips } from "./firestore.js";

import { formatDate } from "./utils.js";

document
    .getElementById("exportExcel")
    .addEventListener("click", exportExcel);

// ======================================================
// EXPORT
// ======================================================

async function exportExcel() {

    try {

        const trips = await getAllTrips();

        if (trips.length === 0) {

            alert("No trips available.");

            return;

        }

        const workbook = XLSX.utils.book_new();

        const data = [];

        // ============================================
        // HEADER ROW
        // ============================================

        data.push([

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

        // ============================================
        // TRIPS
        // ============================================

        trips.forEach((trip, index) => {

            data.push([

                index + 1,

                formatDate(trip.date),

                trip.loading,

                trip.unloading,

                Number(trip.tonnage),

                Number(trip.perTon),

                Number(trip.income),

                Number(trip.fuel),

                Number(trip.adBlue),

                Number(trip.toll),

                Number(trip.driverAdvance),

                Number(trip.driverSalary),

                Number(trip.otherExpense),

                Number(trip.expense),

                Number(trip.profit)

            ]);

        });

        // ============================================
        // CREATE SHEET
        // ============================================

        const sheet = XLSX.utils.aoa_to_sheet(data);

        // ============================================
        // AUTO FILTER
        // ============================================

        sheet["!autofilter"] = {
            ref: "A1:O1"
        };

        // ============================================
        // FREEZE HEADER
        // ============================================

        sheet["!freeze"] = {
            xSplit: 0,
            ySplit: 1
        };

        // ============================================
        // COLUMN WIDTHS
        // ============================================

        sheet["!cols"] = [

            { wch: 8 },   // S.No
            { wch: 15 },  // Date
            { wch: 28 },  // Loading
            { wch: 28 },  // Unloading
            { wch: 12 },  // Tonnage
            { wch: 12 },  // Per Ton
            { wch: 15 },  // Income
            { wch: 12 },  // Fuel
            { wch: 12 },  // AD Blue
            { wch: 12 },  // Toll
            { wch: 15 },  // Driver Adv
            { wch: 15 },  // Driver Salary
            { wch: 18 },  // Other Expense
            { wch: 18 },  // Total Expense
            { wch: 15 }   // Profit

        ];

        // ============================================
        // APPEND SHEET
        // ============================================

        XLSX.utils.book_append_sheet(

            workbook,

            sheet,

            "Trip Register"

        );

        // ============================================
        // FILE NAME
        // ============================================

        const today = new Date();

        const dd = String(today.getDate()).padStart(2, "0");

        const mm = String(today.getMonth() + 1).padStart(2, "0");

        const yyyy = today.getFullYear();

        XLSX.writeFile(

            workbook,

            `SMLT-EXPENSE-${dd}-${mm}-${yyyy}.xlsx`

        );

    }

    catch (error) {

        console.error(error);

        alert("Unable to export Excel.");

    }

}        