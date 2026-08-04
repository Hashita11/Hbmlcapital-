import { db } from "./firebase-config.js";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tableBody = document.getElementById("loanTable");

// =======================
// Load Loan Applications
// =======================
onSnapshot(collection(db, "loan_applications"), (snapshot) => {

    tableBody.innerHTML = "";

    let total = 0;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    if (snapshot.empty) {

        tableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">
                No Loan Applications Found
            </td>
        </tr>`;

        document.getElementById("totalApps").innerText = 0;
        document.getElementById("pendingApps").innerText = 0;
        document.getElementById("approvedApps").innerText = 0;
        document.getElementById("rejectedApps").innerText = 0;

        return;
    }

    snapshot.forEach((item) => {

        const data = item.data();

        total++;

        if (data.status === "Approved") {
            approved++;
        } else if (data.status === "Rejected") {
            rejected++;
        } else {
            pending++;
        }

        tableBody.innerHTML += `
        <tr>
            <td>${data.name || ""}</td>
            <td>${data.mobile || ""}</td>
            <td>${data.loanType || ""}</td>
            <td>₹${data.loanAmount || ""}</td>
            <td>${data.status || "Pending"}</td>
            <td>
                <button class="approve-btn" data-id="${item.id}">Approve</button>

                <button class="reject-btn" data-id="${item.id}">Reject</button>

                <button class="delete-btn" data-id="${item.id}">Delete</button>
            </td>
        </tr>`;
    });

    // Dashboard Cards
    document.getElementById("totalApps").innerText = total;
    document.getElementById("pendingApps").innerText = pending;
    document.getElementById("approvedApps").innerText = approved;
    document.getElementById("rejectedApps").innerText = rejected;

});


// =======================
// Approve / Reject / Delete
// =======================
tableBody.addEventListener("click", async (e) => {

    const id = e.target.dataset.id;

    if (!id) return;

    const docRef = doc(db, "loan_applications", id);

    try {

        if (e.target.classList.contains("approve-btn")) {

            await updateDoc(docRef, {
                status: "Approved"
            });

        }

        if (e.target.classList.contains("reject-btn")) {

            await updateDoc(docRef, {
                status: "Rejected"
            });

        }

        if (e.target.classList.contains("delete-btn")) {

            if (confirm("Delete this application?")) {

                await deleteDoc(docRef);

            }

        }

    } catch (err) {

        alert(err.message);
        console.error(err);

    }

});


// =======================
// Search
// =======================
document.getElementById("searchBox").addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    document.querySelectorAll("#loanTable tr").forEach(row => {

        const name = row.cells[0]?.innerText.toLowerCase() || "";
        const mobile = row.cells[1]?.innerText.toLowerCase() || "";

        if (name.includes(value) || mobile.includes(value)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

});


// =======================
// Filter Buttons
// =======================
window.filterStatus = function(status){

    const rows = document.querySelectorAll("#loanTable tr");

    rows.forEach(row=>{

        if(status === "All"){
            row.style.display = "";
            return;
        }

        const rowStatus = row.cells[4]?.innerText.trim();

        if(rowStatus === status){
            row.style.display = "";
        }else{
            row.style.display = "none";
        }

    });

};
