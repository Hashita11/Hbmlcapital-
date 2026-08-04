import { db } from "./firebase-config.js";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tableBody = document.getElementById("loanTable");

// Read loan applications
onSnapshot(collection(db, "loan_applications"), (snapshot) => {

    tableBody.innerHTML = "";

    if (snapshot.empty) {
        tableBody.innerHTML = `
        <tr>
            <td colspan="6">No Loan Applications Found</td>
        </tr>`;
        return;
    }
let total = 0;
let pending = 0;
let approved = 0;
let rejected = 0;
    snapshot.forEach((item) => {

        const data = item.data();
total++;

if(data.status==="Approved"){
approved++;
}else if(data.status==="Rejected"){
rejected++;
}else{
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
// Update dashboard cards
document.getElementById("totalApps").innerText = total;
document.getElementById("pendingApps").innerText = pending;
document.getElementById("approvedApps").innerText = approved;
document.getElementById("rejectedApps").innerText = rejected;
});
 

// Button Click Events
tableBody.addEventListener("click", async (e) => {

    const id = e.target.dataset.id;

    if (!id) return;

    try {

        const docRef = doc(db, "loan_applications", id);

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

        console.error(err);
        alert(err.message);

    }

});
document.getElementById("searchBox").addEventListener("keyup", function(){

const value = this.value.toLowerCase();

document.querySelectorAll("#loanTable tr").forEach(row=>{

row.style.display =
row.innerText.toLowerCase().includes(value)
? ""
: "none";

});

});
