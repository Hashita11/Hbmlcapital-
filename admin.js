// =========================================
// HBML CAPITAL ADMIN DASHBOARD
// Part 1 - Firebase & Load Applications
// =========================================

import { db } from "./firebase-config.js";

import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================
// Elements
// ==========================

const tableBody = document.getElementById("loanTable");

const totalApps = document.getElementById("totalApps");
const pendingApps = document.getElementById("pendingApps");
const approvedApps = document.getElementById("approvedApps");
const rejectedApps = document.getElementById("rejectedApps");

// ==========================
// Dashboard Cards
// ==========================

function updateCards(total,pending,approved,rejected){

    if(totalApps) totalApps.innerText = total;
    if(pendingApps) pendingApps.innerText = pending;
    if(approvedApps) approvedApps.innerText = approved;
    if(rejectedApps) rejectedApps.innerText = rejected;

}

// ==========================
// No Data
// ==========================

function showNoData(){

    tableBody.innerHTML = `
    <tr>
        <td colspan="6" style="padding:25px;text-align:center;">
            No Loan Applications Found
        </td>
    </tr>`;

    updateCards(0,0,0,0);

}

// ==========================
// Load Applications
// ==========================

onSnapshot(collection(db,"loan_applications"),(snapshot)=>{

    tableBody.innerHTML="";

    if(snapshot.empty){

        showNoData();
        return;

    }

    let total=0;
    let pending=0;
    let approved=0;
    let rejected=0;

    snapshot.forEach((item)=>{

        const data=item.data();

        total++;

        if(data.status==="Approved"){
            approved++;
        }
        else if(data.status==="Rejected"){
            rejected++;
        }
        else{
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

<button class="view-btn"
data-id="${item.id}">
👁 View
</button>

<button class="approve-btn"
data-id="${item.id}">
✅
</button>

<button class="reject-btn"
data-id="${item.id}">
❌
</button>

<button class="delete-btn"
data-id="${item.id}">
🗑
</button>

<button onclick="whatsappApplicant('${data.mobile}')">
💬
</button>

<button onclick="callApplicant('${data.mobile}')">
📞
</button>

<button onclick="copyRow(this)">
📋
</button>

</td>

</tr>
`;

    });

    updateCards(total,pending,approved,rejected);

},(error)=>{

    console.error(error);

    tableBody.innerHTML=`
<tr>
<td colspan="6"
style="color:red;text-align:center;">
Failed to Load Firestore Data
</td>
</tr>`;

});
