# 🚚 SMLT Expense Manager v3.1

A cloud-based Transport Expense Management System built using HTML, CSS, JavaScript, Firebase Firestore, and SheetJS.

---

## ✨ Features

### Dashboard

- Total Trips
- Total Income
- Total Expense
- Driver Salary
- Total Profit

### Trip Management

- Add Trip
- Edit Trip
- Delete Trip
- Real-time Sync

### Calculations

Income = Tonnage × Per Ton

Driver Salary = 10% of Income

Remaining Advance = Driver Advance − Other Expense

Salary Payable = Driver Salary − Remaining Advance

Total Expense =
Fuel +
AD Blue +
Toll +
Salary Payable +
Other Expense

Profit =
Income − Total Expense

---

## Search

Search by

- Date
- Loading
- Unloading

---

## Cloud Database

Firebase Firestore

- Real-time Sync
- Offline Support
- Multi-device Access

---

## Excel Export

Exports:

- Trip Register
- Summary

Filename:

SMLT-EXPENSES-DD-MM-YYYY.xlsx

---

## Backup

- JSON Backup
- JSON Restore

---

## Folder Structure

SMLT-EXPENSE-MANAGER/

├── index.html

├── css/

│ └── style.css

├── js/

│ ├── firebase.js

│ ├── firestore.js

│ ├── utils.js

│ ├── app.js

│ └── export.js

├── vendor/

│ └── xlsx.full.min.js

├── README.md

├── LICENSE

└── .gitignore

---

## Technologies Used

- HTML5
- CSS3
- JavaScript ES6
- Firebase Firestore
- SheetJS (xlsx)

---

## Author

**Shaik Fazalulla**

---

## Version

v3.1

---

## License

MIT License