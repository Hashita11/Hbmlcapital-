import { db } from "./firebase-config.js";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tableBody = document.querySelector("#loanTable tbody") || document.getElementById("loanTable");

// Listening to the correct collection from your database screenshot
onSnapshot(collection(db, "loan_approvals"), (snapshot) => {
    tableBody.innerHTML = "";

    if (snapshot.empty) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No loan applications found.</td></tr>`;
        return;
    }

    snapshot.forEach((item) => {
        const data = item.data();

        tableBody.innerHTML += `
        <tr>
            <td>${data.customerName || data.name || "N/A"}</td>
            <td>${data.mobile || "N/A"}</td>
            <td>${data.loanType || "Personal Loan"}</td>
            <td>₹${data.loanAmount || 0}</td>
            <td>${data.status || "Pending"}</td>
            <td>
                <button type="button" class="approve-btn" data-id="${item.id}">Approve</button>
                <button type="button" class="reject-btn" data-id="${item.id}">Reject</button>
                <button type="button" class="delete-btn" data-id="${item.id}">Delete</button>
            </td>
        </tr>`;
    });
});

// Event listener to handle Approve, Reject, and Delete clicks
tableBody.addEventListener("click", async (e) => {
    const target = e.target;
    const id = target.getAttribute("data-id");

    if (!id) return;

    try {
        const docRef = doc(db, "loan_approvals", id);

        if (target.classList.contains("approve-btn")) {
            await updateDoc(docRef, { status: "Approved" });
        } 
        else if (target.classList.contains("reject-btn")) {
            await updateDoc(docRef, { status: "Rejected" });
        } 
        else if (target.classList.contains("delete-btn")) {
            if (confirm("Delete this application?")) {
                await deleteDoc(docRef);
            }
        }
    } catch (error) {
        console.error("Operation failed: ", error);
        alert("Action failed: " + error.message);
    }
});
