import { db } from "./firebase-config.js";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tableBody = document.querySelector("#loanTable tbody") || document.getElementById("loanTable");

// 1. Render data and attach IDs to data attributes instead of inline JS
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
                <button type="button" class="approve-btn" data-id="${item.id}">Approve</button>
                <button type="button" class="reject-btn" data-id="${item.id}">Reject</button>
                <button type="button" class="delete-btn" data-id="${item.id}">Delete</button>
            </td>
        </tr>`;
    });
});

// 2. Use Event Delegation to handle clicks safely (bypasses scope issues)
tableBody.addEventListener("click", async (e) => {
    const target = e.target;
    const id = target.getAttribute("data-id");

    if (!id) return; // Exit if clicked element isn't one of our buttons

    try {
        const docRef = doc(db, "loan_applications", id);

        if (target.classList.contains("approve-btn")) {
            await updateDoc(docRef, { status: "Approved" });
            console.log("Approved:", id);
        } 
        else if (target.classList.contains("reject-btn")) {
            await updateDoc(docRef, { status: "Rejected" });
            console.log("Rejected:", id);
        } 
        else if (target.classList.contains("delete-btn")) {
            if (confirm("Delete this application?")) {
                await deleteDoc(docRef);
                console.log("Deleted:", id);
            }
        }
    } catch (error) {
        console.error("Operation failed: ", error);
        alert("Action failed! Check Firestore Rules or Console. Error: " + error.message);
    }
});
