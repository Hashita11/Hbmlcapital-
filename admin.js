<script type="module" src="firebase-config.js"></script>
<script type="module" src="admin.js"></script>
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

    snapshot.forEach((document) => {

        const data = document.data();

        table.innerHTML += `
        <tr>
            <td>${data.name || ""}</td>
            <td>${data.mobile || ""}</td>
            <td>${data.loanType || ""}</td>
            <td>₹${data.loanAmount || ""}</td>
            <td>${data.status || "Pending"}</td>

            <td>

            <button class="approve"
            onclick="approveLoan('${document.id}')">
            Approve
            </button>

            <button class="reject"
            onclick="rejectLoan('${document.id}')">
            Reject
            </button>

            <button
            onclick="deleteLoan('${document.id}')">
            Delete
            </button>

            </td>

        </tr>
        `;

    });

});

window.approveLoan = async function(id){

    await updateDoc(doc(db,"loan_applications",id),{

        status:"Approved"

    });

}

window.rejectLoan = async function(id){

    await updateDoc(doc(db,"loan_applications",id),{

        status:"Rejected"

    });

}

window.deleteLoan = async function(id){

    if(confirm("Delete this application?")){

        await deleteDoc(doc(db,"loan_applications",id));

    }

}
