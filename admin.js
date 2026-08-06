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
// =========================================
// PART 2 - Approve / Reject / Delete / View
// =========================================

tableBody.addEventListener("click", async (e) => {

    const id = e.target.dataset.id;

    if (!id) return;

    const docRef = doc(db, "loan_applications", id);

    try {

        // ======================
        // VIEW CUSTOMER
        // ======================
        if (e.target.classList.contains("view-btn")) {

            const snap = await getDoc(docRef);

            if (!snap.exists()) {
                alert("Application not found.");
                return;
            }

            const data = snap.data();

            // If modal exists
            if (document.getElementById("customerModal")) {

                document.getElementById("dName").innerText = data.name || "";
                document.getElementById("dMobile").innerText = data.mobile || "";
                document.getElementById("dEmail").innerText = data.email || "";
                document.getElementById("dAddress").innerText = data.address || "";
                document.getElementById("dLoan").innerText = data.loanType || "";
                document.getElementById("dAmount").innerText = "₹" + (data.loanAmount || "");
                document.getElementById("dOccupation").innerText = data.occupation || "";
                document.getElementById("dIncome").innerText = data.monthlyIncome || "";
                document.getElementById("dPurpose").innerText = data.loanPurpose || "";
                document.getElementById("dStatus").innerText = data.status || "Pending";

                document.getElementById("customerModal").style.display = "block";

            } else {

                alert(
`HBML CAPITAL

Name : ${data.name || ""}

Mobile : ${data.mobile || ""}

Email : ${data.email || ""}

Loan Type : ${data.loanType || ""}

Loan Amount : ₹${data.loanAmount || ""}

Status : ${data.status || "Pending"}`
                );

            }

            return;

        }

        // ======================
        // APPROVE
        // ======================

        if (e.target.classList.contains("approve-btn")) {

            await updateDoc(docRef, {

                status: "Approved",
                approvedDate: new Date().toLocaleString()

            });

            alert("Loan Approved Successfully");

            return;

        }

        // ======================
        // REJECT
        // ======================

        if (e.target.classList.contains("reject-btn")) {

            await updateDoc(docRef, {

                status: "Rejected",
                rejectedDate: new Date().toLocaleString()

            });

            alert("Loan Rejected");

            return;

        }

        // ======================
        // DELETE
        // ======================

        if (e.target.classList.contains("delete-btn")) {

            if (confirm("Delete this application permanently?")) {

                await deleteDoc(docRef);

                alert("Application Deleted");

            }

            return;

        }

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

});


// ==========================
// Close Customer Modal
// ==========================

const closeBtn = document.getElementById("closeModal");

if (closeBtn) {

    closeBtn.onclick = function () {

        document.getElementById("customerModal").style.display = "none";

    };

}

window.addEventListener("click", function (e) {

    const modal = document.getElementById("customerModal");

    if (modal && e.target === modal) {

        modal.style.display = "none";

    }

});

// =========================================
// PART 3 - Search, Filter & Sort
// =========================================

// ==========================
// Live Search
// ==========================

const searchBox = document.getElementById("searchBox");

if (searchBox) {

    searchBox.addEventListener("keyup", function () {

        const value = this.value.toLowerCase().trim();

        document.querySelectorAll("#loanTable tr").forEach(row => {

            const name = row.cells[0]?.innerText.toLowerCase() || "";
            const mobile = row.cells[1]?.innerText.toLowerCase() || "";
            const loan = row.cells[2]?.innerText.toLowerCase() || "";
            const amount = row.cells[3]?.innerText.toLowerCase() || "";
            const status = row.cells[4]?.innerText.toLowerCase() || "";

            if (
                name.includes(value) ||
                mobile.includes(value) ||
                loan.includes(value) ||
                amount.includes(value) ||
                status.includes(value)
            ) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });

}


// ==========================
// Filter by Status
// ==========================

window.filterStatus = function(status){

    document.querySelectorAll("#loanTable tr").forEach(row=>{

        if(status==="All"){

            row.style.display="";

            return;

        }

        const rowStatus = row.cells[4]?.innerText.trim();

        row.style.display = rowStatus===status ? "" : "none";

    });

};


// ==========================
// Sort by Loan Amount
// ==========================

window.sortAmount = function(order){

    const rows = Array.from(tableBody.querySelectorAll("tr"));

    rows.sort((a,b)=>{

        const amountA =
        parseFloat(
        a.cells[3].innerText.replace(/[₹,]/g,"")
        ) || 0;

        const amountB =
        parseFloat(
        b.cells[3].innerText.replace(/[₹,]/g,"")
        ) || 0;

        return order==="asc"
            ? amountA-amountB
            : amountB-amountA;

    });

    tableBody.innerHTML="";

    rows.forEach(row=>{

        tableBody.appendChild(row);

    });

};


// ==========================
// Dashboard Summary
// ==========================

window.loanSummary=function(){

    alert(

`HBML CAPITAL

Total Applications : ${totalApps.innerText}

Pending : ${pendingApps.innerText}

Approved : ${approvedApps.innerText}

Rejected : ${rejectedApps.innerText}`

    );

};


// ==========================
// Refresh Dashboard
// ==========================

window.refreshDashboard=function(){

    location.reload();

};
// =========================================
// PART 4 - WhatsApp, Call, Copy, Export, Print
// =========================================

// ==========================
// WhatsApp Customer
// ==========================
window.whatsappApplicant = function(mobile){

    if(!mobile){
        alert("Mobile number not available");
        return;
    }

    const message = encodeURIComponent(
        "Dear Customer,\n\nThank you for applying for a loan with HBML Capital.\nOur team will contact you shortly."
    );

    window.open(
        `https://wa.me/91${mobile}?text=${message}`,
        "_blank"
    );

};


// ==========================
// Call Customer
// ==========================
window.callApplicant = function(mobile){

    if(!mobile){
        alert("Mobile number not available");
        return;
    }

    window.location.href = `tel:${mobile}`;

};


// ==========================
// Copy Row Details
// ==========================
window.copyRow = function(btn){

    const row = btn.closest("tr");

    let text = "";

    row.querySelectorAll("td").forEach((cell,index)=>{

        if(index<5){

            text += cell.innerText + "\n";

        }

    });

    navigator.clipboard.writeText(text);

    alert("Customer details copied.");

};


// ==========================
// Export CSV
// ==========================
window.exportCSV = function(){

    let csv=[];

    document.querySelectorAll("table tr").forEach(row=>{

        let cols=row.querySelectorAll("th,td");

        let data=[];

        cols.forEach(col=>{

            data.push('"' + col.innerText.replace(/"/g,'""') + '"');

        });

        csv.push(data.join(","));

    });

    const blob=new Blob([csv.join("\n")],{
        type:"text/csv"
    });

    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);

    link.download="HBML_Loan_Report.csv";

    link.click();

};


// ==========================
// Print Report
// ==========================
window.printReport=function(){

    window.print();

};


// ==========================
// Dashboard Clock
// ==========================
setInterval(()=>{

    const clock=document.getElementById("clock");

    if(clock){

        clock.innerHTML=new Date().toLocaleString();

    }

},1000);
// =========================================
// PART 5 - Dashboard Utilities & Final
// =========================================

// ==========================
// Welcome Message
// ==========================
(function(){

    const welcome = document.getElementById("welcome");

    if(!welcome) return;

    const hour = new Date().getHours();

    let msg = "Welcome";

    if(hour < 12){

        msg = "🌅 Good Morning";

    }else if(hour < 17){

        msg = "☀ Good Afternoon";

    }else{

        msg = "🌙 Good Evening";

    }

    welcome.innerHTML = msg + " - HBML Capital Admin";

})();


// ==========================
// Dashboard Footer
// ==========================
(function(){

    const footer = document.getElementById("footerText");

    if(footer){

        footer.innerHTML =
        "© 2026 HBML Capital Pvt. Ltd. All Rights Reserved.";

    }

})();


// ==========================
// Current Date
// ==========================
window.currentDate=function(){

    alert(new Date().toLocaleDateString());

};


// ==========================
// Scroll to Top
// ==========================
window.scrollTopPage=function(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};


// ==========================
// Pending Alert
// ==========================
window.showPending=function(){

    alert(
    "Pending Applications : " +
    document.getElementById("pendingApps").innerText
    );

};


// ==========================
// Approved Alert
// ==========================
window.showApproved=function(){

    alert(
    "Approved Loans : " +
    document.getElementById("approvedApps").innerText
    );

};


// ==========================
// Rejected Alert
// ==========================
window.showRejected=function(){

    alert(
    "Rejected Loans : " +
    document.getElementById("rejectedApps").innerText
    );

};


// ==========================
// Total Alert
// ==========================
window.showTotal=function(){

    alert(
    "Total Applications : " +
    document.getElementById("totalApps").innerText
    );

};


// ==========================
// Auto Refresh Every 5 Minutes
// ==========================
setInterval(function(){

    console.log("Refreshing Dashboard...");

    location.reload();

},300000);


// ==========================
// Dashboard Loaded
// ==========================
console.log("==================================");
console.log("HBML CAPITAL ADMIN DASHBOARD");
console.log("Version : 2.0");
console.log("Firebase Connected");
console.log("Firestore Connected");
console.log("Dashboard Ready");
console.log("==================================");


// ==========================
// Keyboard Shortcuts
// ==========================
document.addEventListener("keydown",function(e){

    // Ctrl + P
    if(e.ctrlKey && e.key==="p"){

        e.preventDefault();

        printReport();

    }

    // Ctrl + R
    if(e.ctrlKey && e.key==="r"){

        e.preventDefault();

        refreshDashboard();

    }

    // Ctrl + E
    if(e.ctrlKey && e.key==="e"){

        e.preventDefault();

        exportCSV();

    }

});


// ==========================
// Final Ready Message
// ==========================
window.addEventListener("load",function(){

    console.log("HBML Capital Dashboard Successfully Loaded");

});
