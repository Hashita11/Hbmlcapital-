import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table = document.getElementById("loanTable");

try {
    const snapshot = await getDocs(collection(db, "loan_applications"));

    table.innerHTML = "";

    if (snapshot.empty) {
        table.innerHTML = "<tr><td colspan='6'>No Data Found</td></tr>";
    } else {
        snapshot.forEach((doc) => {
            table.innerHTML += `
            <tr>
                <td colspan="6">${JSON.stringify(doc.data())}</td>
            </tr>`;
        });
    }

} catch (e) {
    table.innerHTML = `
    <tr>
        <td colspan="6">Error: ${e.message}</td>
    </tr>`;
    console.error(e);
}
