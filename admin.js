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
// ================================
// Approve / Reject / Delete Events
// ================================

tableBody.addEventListener("click", async (e) => {

    const id = e.target.dataset.id;

    if (!id) return;

    const docRef = doc(db, "loan_applications", id);

    try {

        // Approve
        if (e.target.classList.contains("approve-btn")) {

            await updateDoc(docRef, {
                status: "Approved",
                approvedDate: new Date().toLocaleString()
            });

            alert("Loan Approved Successfully");

        }

        // Reject
        if (e.target.classList.contains("reject-btn")) {

            await updateDoc(docRef, {
                status: "Rejected",
                rejectedDate: new Date().toLocaleString()
            });

            alert("Loan Rejected");

        }

        // Delete
        if (e.target.classList.contains("delete-btn")) {

            if (confirm("Delete this application permanently?")) {

                await deleteDoc(docRef);

                alert("Application Deleted");

            }

        }

    } catch (err) {

        console.error(err);
        alert(err.message);

    }

});
// =======================================
// View Complete Customer Profile
// =======================================

tableBody.addEventListener("click", function(e){

    if(!e.target.classList.contains("view-btn")) return;

    const row = e.target.closest("tr");

    document.getElementById("dName").innerText = row.cells[0].innerText;

    document.getElementById("dMobile").innerText = row.cells[1].innerText;

    document.getElementById("dLoan").innerText = row.cells[2].innerText;

    document.getElementById("dAmount").innerText = row.cells[3].innerText;

    document.getElementById("dStatus").innerText = row.cells[4].innerText;

    // Extra fields (shown if available)
    document.getElementById("dEmail").innerText =
        row.dataset.email || "Not Available";

    document.getElementById("dAddress").innerText =
        row.dataset.address || "Not Available";

    document.getElementById("dOccupation").innerText =
        row.dataset.occupation || "Not Available";

    document.getElementById("dIncome").innerText =
        row.dataset.income || "Not Available";

    document.getElementById("dPurpose").innerText =
        row.dataset.purpose || "Not Available";

    document.getElementById("customerModal").style.display = "block";

});
// ===================================
// Live Search
// ===================================
const searchBox = document.getElementById("searchBox");

if (searchBox) {

    searchBox.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll("#loanTable tr").forEach(row => {

            const name = row.cells[0]?.innerText.toLowerCase() || "";
            const mobile = row.cells[1]?.innerText.toLowerCase() || "";
            const loan = row.cells[2]?.innerText.toLowerCase() || "";

            if (
                name.includes(value) ||
                mobile.includes(value) ||
                loan.includes(value)
            ) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }

        });

    });

}


// ===================================
// Filter by Status
// ===================================
window.filterStatus = function(status){

    document.querySelectorAll("#loanTable tr").forEach(row=>{

        const rowStatus = row.cells[4]?.innerText.trim();

        if(status === "All"){
            row.style.display = "";
        }
        else if(rowStatus === status){
            row.style.display = "";
        }
        else{
            row.style.display = "none";
        }

    });

};


// ===================================
// Auto Refresh Time
// ===================================
setInterval(() => {

    const time = document.getElementById("lastUpdated");

    if(time){

        time.innerHTML =
        "Last Updated : " +
        new Date().toLocaleTimeString();

    }

},1000);


// ===================================
// Export Table to CSV
// ===================================
window.exportCSV = function(){

    let csv = [];

    document.querySelectorAll("table tr").forEach(row=>{

        let cols = row.querySelectorAll("th,td");

        let data=[];

        cols.forEach(col=>{

            data.push(col.innerText);

        });

        csv.push(data.join(","));

    });

    const blob = new Blob([csv.join("\n")],{
        type:"text/csv"
    });

    const a=document.createElement("a");

    a.href=URL.createObjectURL(blob);

    a.download="HBML_Loan_Report.csv";

    a.click();

};


// ===================================
// Print Report
// ===================================
window.printReport=function(){

    window.print();

};
// ===================================
// Sort Loan Amount
// ===================================

window.sortAmount = function(order){

    let rows = Array.from(document.querySelectorAll("#loanTable tr"));

    rows.sort((a,b)=>{

        let amountA = parseFloat(
            a.cells[3].innerText.replace(/[₹,]/g,"")
        ) || 0;

        let amountB = parseFloat(
            b.cells[3].innerText.replace(/[₹,]/g,"")
        ) || 0;

        return order==="asc"
            ? amountA-amountB
            : amountB-amountA;

    });

    tableBody.innerHTML="";

    rows.forEach(row=>tableBody.appendChild(row));

};


// ===================================
// Today's Applications
// ===================================

window.showTodayApplications=function(){

    let count=0;

    document.querySelectorAll("#loanTable tr").forEach(row=>{

        const date=row.cells[5]?.innerText || "";

        const today=new Date().toLocaleDateString();

        if(date.includes(today)){
            count++;
        }

    });

    alert("Today's Applications : "+count);

};


// ===================================
// Pending Applications Alert
// ===================================

window.showPending=function(){

    let pending=0;

    document.querySelectorAll("#loanTable tr").forEach(row=>{

        const status=row.cells[4]?.innerText.trim();

        if(status==="Pending"){
            pending++;
        }

    });

    alert("Pending Applications : "+pending);

};


// ===================================
// Refresh Dashboard
// ===================================

window.refreshDashboard=function(){

    location.reload();

};


// ===================================
// Dashboard Welcome Message
// ===================================

const welcome=document.getElementById("welcome");

if(welcome){

    const hour=new Date().getHours();

    let msg="Welcome";

    if(hour<12){
        msg="Good Morning";
    }else if(hour<17){
        msg="Good Afternoon";
    }else{
        msg="Good Evening";
    }

    welcome.innerHTML=msg+" - HBML Capital Admin";

}
// ===================================
// Dashboard Quick Buttons
// ===================================

window.totalApplications = function () {
    alert("Total Applications : " + document.getElementById("totalApps").innerText);
};

window.totalApproved = function () {
    alert("Approved Loans : " + document.getElementById("approvedApps").innerText);
};

window.totalRejected = function () {
    alert("Rejected Loans : " + document.getElementById("rejectedApps").innerText);
};

window.totalPending = function () {
    alert("Pending Loans : " + document.getElementById("pendingApps").innerText);
};


// ===================================
// Dashboard Clock
// ===================================

setInterval(() => {

    const clock = document.getElementById("clock");

    if (clock) {

        clock.innerHTML = new Date().toLocaleString();

    }

}, 1000);


// ===================================
// Dashboard Footer
// ===================================

const footer = document.getElementById("footerText");

if (footer) {

    footer.innerHTML =
    "© 2026 HBML Capital Pvt Ltd. All Rights Reserved.";

}
// ===================================
// Loan Summary
// ===================================

window.loanSummary = function () {

    const total = document.getElementById("totalApps").innerText;
    const pending = document.getElementById("pendingApps").innerText;
    const approved = document.getElementById("approvedApps").innerText;
    const rejected = document.getElementById("rejectedApps").innerText;

    alert(
`HBML Loan Summary

Total Applications : ${total}

Approved : ${approved}

Pending : ${pending}

Rejected : ${rejected}`
    );

};


// ===================================
// Scroll to Top
// ===================================

window.scrollTopPage = function(){

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

};


// ===================================
// Print Current Date
// ===================================

window.currentDate = function(){

    alert(new Date().toLocaleDateString());

};


// ===================================
// Admin Version
// ===================================

console.log("HBML Admin Dashboard Version 1.0");

// ===========================
// View Full Application
// ===========================

tableBody.addEventListener("click", function(e){

    if(!e.target.classList.contains("view-btn")) return;

    const row = e.target.closest("tr");

    const details = `
Name : ${row.cells[0].innerText}

Mobile : ${row.cells[1].innerText}

Loan Type : ${row.cells[2].innerText}

Loan Amount : ${row.cells[3].innerText}

Status : ${row.cells[4].innerText}
`;

    alert(details);

});
// Close Popup

document.getElementById("closeModal").onclick=function(){

document.getElementById("customerModal").style.display="none";

};

window.onclick=function(e){

if(e.target==document.getElementById("customerModal")){

document.getElementById("customerModal").style.display="none";

}

};
