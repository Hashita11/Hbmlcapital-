import { db } from "./firebase-config.js";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table = document.getElementById("loanTable");

onSnapshot(collection(db, "loan_applications"), (snapshot) => {

    table.innerHTML = "";

    if (snapshot.empty) {
        table.innerHTML = `
        <tr>
            <td colspan="6">No applications found.</td>
        </tr>`;
        return;
    }

    snapshot.forEach((document) => {

        const data = document.data();

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${data.name || ""}</td>
            <td>${data.mobile || ""}</td>
            <td>${data.loanType || ""}</td>
            <td>₹${data.loanAmount || ""}</td>
            <td>${data.status || "Pending"}</td>
            <td>
                <button class="approve">Approve</button>
                <button class="reject">Reject</button>
                <button class="delete">Delete</button>
            </td>
        `;

        row.querySelector(".approve").onclick = async () => {
            await updateDoc(doc(db, "loan_applications", document.id), {
                status: "Approved"
            });
        };

        row.querySelector(".reject").onclick = async () => {
            await updateDoc(doc(db, "loan_applications", document.id), {
                status: "Rejected"
            });
        };

        row.querySelector(".delete").onclick = async () => {
            if (confirm("Delete this application?")) {
                await deleteDoc(doc(db, "loan_applications", document.id));
            }
        };

        table.appendChild(row);
    });
});
