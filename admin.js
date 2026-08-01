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

    snapshot.forEach((item) => {

        const data = item.data();

        table.innerHTML += `
        <tr>
            <td>${data.name}</td>
            <td>${data.mobile}</td>
            <td>${data.loanType}</td>
            <td>₹${data.loanAmount}</td>
            <td>${data.status || "Pending"}</td>
            <td>
                <button class="approve" onclick="approveLoan('${item.id}')">Approve</button>
                <button class="reject" onclick="rejectLoan('${item.id}')">Reject</button>
                <button onclick="deleteLoan('${item.id}')">Delete</button>
            </td>
        </tr>`;
    });
});

window.approveLoan = async (id) => {
    await updateDoc(doc(db, "loan_applications", id), {
        status: "Approved"
    });
};

window.rejectLoan = async (id) => {
    await updateDoc(doc(db, "loan_applications", id), {
        status: "Rejected"
    });
};

window.deleteLoan = async (id) => {
    if (confirm("Delete this application?")) {
        await deleteDoc(doc(db, "loan_applications", id));
    }
};
