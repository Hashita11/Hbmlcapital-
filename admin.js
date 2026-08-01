import { db } from "./firebase-config.js";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Target the table body to avoid destroying table headers
const tableBody = document.querySelector("#loanTable tbody") || document.getElementById("loanTable");

onSnapshot(collection(db, "loan_applications"), (snapshot) => {
    tableBody.innerHTML = "";

    snapshot.forEach((item) => {
        const data = item.data();

        tableBody.innerHTML += `
        <tr>
            <td>${data.name || "N/A"}</td>
            <td>${data.mobile || "N/A"}</td>
            <td>${data.loanType || "N/A"}</td>
            <td>₹${data.loanAmount || 0}</td>
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
    try {
        await updateDoc(doc(db, "loan_applications", id), {
            status: "Approved"
        });
    } catch (error) {
        console.error("Error approving loan: ", error);
    }
};

window.rejectLoan = async (id) => {
    try {
        await updateDoc(doc(db, "loan_applications", id), {
            status: "Rejected"
        });
    } catch (error) {
        console.error("Error rejecting loan: ", error);
    }
};

window.deleteLoan = async (id) => {
    if (confirm("Delete this application?")) {
        try {
            await deleteDoc(doc(db, "loan_applications", id));
        } catch (error) {
            console.error("Error deleting loan: ", error);
        }
    }
};
