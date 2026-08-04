import { db } from "./firebase-config.js";

import {
    collection,
    onSnapshot,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const tableBody = document.getElementById("loanTable");

const totalApps = document.getElementById("totalApps");
const pendingApps = document.getElementById("pendingApps");
const approvedApps = document.getElementById("approvedApps");
const rejectedApps = document.getElementById("rejectedApps");

function updateCards(total, pending, approved, rejected) {

    totalApps.textContent = total;
    pendingApps.textContent = pending;
    approvedApps.textContent = approved;
    rejectedApps.textContent = rejected;

}

function showNoData() {

    tableBody.innerHTML = `
    <tr>
        <td colspan="6" style="padding:20px;text-align:center;">
            No Loan Applications Found
        </td>
    </tr>`;

    updateCards(0,0,0,0);

}

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

        tableBody.innerHTML+=`

<tr>

<td>${data.name ?? ""}</td>

<td>${data.mobile ?? ""}</td>

<td>${data.loanType ?? ""}</td>

<td>₹${data.loanAmount ?? ""}</td>

<td>${data.status ?? "Pending"}</td>

<td>

<button class="view-btn" data-id="${item.id}">
👁 View
</button>

<button class="approve-btn" data-id="${item.id}">
✅ Approve
</button>

<button class="reject-btn" data-id="${item.id}">
❌ Reject
</button>

<button class="delete-btn" data-id="${item.id}">
🗑 Delete
</button>
<button onclick="whatsappApplicant('${data.mobile}')">💬</button>

<button onclick="callApplicant('${data.mobile}')">📞</button>

<button onclick="copyRow(this)">📋</button>
</td>
</tr>

`;

    });

    updateCards(total,pending,approved,rejected);

},(error)=>{

    console.error(error);

    tableBody.innerHTML=`
<tr>
<td colspan="6" style="color:red;text-align:center;">
Failed to load data
</td>
</tr>`;

});
tableBody.addEventListener("click", async (e)=>{

    const id = e.target.dataset.id;

    if(!id) return;

    const docRef = doc(db,"loan_applications",id);

    try{

        // View Details
        if(e.target.classList.contains("view-btn")){

            const snap = await getDoc(docRef);

            if(snap.exists()){

                const data = snap.data();

                alert(

`HBML CAPITAL

Name : ${data.name || ""}

Mobile : ${data.mobile || ""}

Email : ${data.email || ""}

Loan Type : ${data.loanType || ""}

Loan Amount : ₹${data.loanAmount || ""}

Address : ${data.address || ""}

Status : ${data.status || "Pending"}`

                );

            }

        }

        // Approve
        if(e.target.classList.contains("approve-btn")){

            await updateDoc(docRef,{
                status:"Approved"
            });

            alert("Application Approved");

        }

        // Reject
        if(e.target.classList.contains("reject-btn")){

            await updateDoc(docRef,{
                status:"Rejected"
            });

            alert("Application Rejected");

        }

        // Delete
        if(e.target.classList.contains("delete-btn")){

            if(confirm("Delete this application?")){

                await deleteDoc(docRef);

                alert("Application Deleted");

            }

        }

    }catch(err){

        console.error(err);

        alert(err.message);

    }

});
// ==============================
// Advanced Search
// ==============================
const searchBox = document.getElementById("searchBox");

if (searchBox) {

    searchBox.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll("#loanTable tr").forEach(row => {

            const text = row.innerText.toLowerCase();

            row.style.display = text.includes(value) ? "" : "none";

        });

    });

}


// ==============================
// Filter by Status
// ==============================
window.filterStatus = function(status){

    document.querySelectorAll("#loanTable tr").forEach(row=>{

        if(status==="All"){

            row.style.display="";

            return;

        }

        const rowStatus=row.cells[4]?.innerText.trim();

        row.style.display=rowStatus===status?"":"none";

    });

};


// ==============================
// Sort by Amount
// ==============================
window.sortAmount=function(order){

    const tbody=document.getElementById("loanTable");

    const rows=Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a,b)=>{

        const aAmt=parseFloat(a.cells[3].innerText.replace(/[₹,]/g,""))||0;

        const bAmt=parseFloat(b.cells[3].innerText.replace(/[₹,]/g,""))||0;

        return order==="asc"
            ?aAmt-bAmt
            :bAmt-aAmt;

    });

    tbody.innerHTML="";

    rows.forEach(r=>tbody.appendChild(r));

};


// ==============================
// WhatsApp Applicant
// ==============================
window.whatsappApplicant=function(mobile){

    if(!mobile)return;

    window.open(`https://wa.me/91${mobile}`,"_blank");

};


// ==============================
// Call Applicant
// ==============================
window.callApplicant=function(mobile){

    if(!mobile)return;

    window.location.href=`tel:${mobile}`;

};


// ==============================
// Copy Row
// ==============================
window.copyRow=function(button){

    const row=button.closest("tr");

    navigator.clipboard.writeText(row.innerText);

    alert("Copied");

};


// ==============================
// Print Table
// ==============================
window.printApplications=function(){

    window.print();

};
