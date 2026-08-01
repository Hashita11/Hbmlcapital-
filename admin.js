import { db } from "./firebase-config.js";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
                <button type="button" class="approve" onclick="window.approveLoan('${item.id}')">Approve</button>
                <button type="button" class="reject" onclick="window.rejectLoan('${item.id}')">Reject</button>
                <button type="button" onclick="window.deleteLoan('${item.id}')">Delete</button>
            </td>
        </tr>`;
    });
});

window.approveLoan = async (id) => {
    try {
        const docRef = doc(db, "loan_applications", id);
        await updateDoc(docRef, { status: "Approved" });
        console.log("Loan approved successfully");
    } catch (error) {
        console.error("Error approving loan:", error);
        alert("Failed to approve: " + error.message);
    }
};

window.rejectLoan = async (id) => {
    try {
        const docRef = doc(db, "loan_applications", id);
        await updateDoc(docRef, { status: "Rejected" });
        console.log("Loan rejected successfully");
    } catch (error) {
        console.error("Error rejecting loan:", error);
        alert("Failed to reject: " + error.message);
    }
};

window.deleteLoan = async (id) => {
    if (confirm("Delete this application?")) {
        try {
            const docRef = doc(db, "loan_applications", id);
            await deleteDoc(docRef);
            console.log("Loan deleted successfully");
        } catch (error) {
            console.error("Error deleting loan:", error);
            alert("Failed to delete: " + error.message);
        }
    }
};
