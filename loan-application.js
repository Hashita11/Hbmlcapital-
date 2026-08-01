import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("loanForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try{

        await addDoc(collection(db,"loan_applications"),{

            name:document.getElementById("name").value,

            mobile:document.getElementById("mobile").value,

            email:document.getElementById("email").value,

            loanType:document.getElementById("loanType").value,

            loanAmount:document.getElementById("loanAmountField").value,

            address:document.getElementById("address").value,

            status:"Pending",

            createdAt:serverTimestamp()

        });

        alert("Application Submitted Successfully.");

        form.reset();

    }catch(error){

        alert("Error : "+error.message);

    }

});
