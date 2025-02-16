const mobileContainer = document.querySelector(".mobile");

let BillFrame = document.getElementById('BillFrame')

let BillName = document.getElementById('BillName')
let Amount = document.getElementById('Amount')
let confirmBill = document.getElementById('confirmBill')
let cancelBill = document.getElementById('cancelBill')

let addBillTrip = document.getElementById('addBillTrip')
const showBillData = document.querySelector('.showBillData'); 

let server = "http://localhost:3000";

const tripData = JSON.parse(sessionStorage.getItem("tripData"));
window.onload = async () => {
    if (!tripData) {
        console.error("No trip data found");
        return;
    }
    const showTripNameOnTop = document.querySelector("#showTripNameOnTop")
    showTripNameOnTop.innerHTML = tripData.tripName
    try {
        const res = await fetch(`${server}/api/getBill` , {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({ tripName: tripData.tripName }),
        })
        if (!res.ok){
            return console.log("Error can't fetch to getBill")
        }
        const billData = await res.json()

        showBillData.innerHTML = ''

        billData.forEach(bill => {

            const billFrame = document.createElement('div');
            billFrame.classList.add("billFrame");
            billFrame.setAttribute("data-bill-id", bill._id);

            billFrame.innerHTML = `
                <div class="billNameFrame">
                    <h2>${bill.bill}</h2>
                    <div class="amount">${bill.amount} ฿</div>
                </div>
                <div class="deleteFrame">
                    <div class="delete">
                        <button class="deleteBillButton">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="peopleName">
                ${tripData.peopleNameList.map(person => `
                <div class="peopleCheckBox">
                    <input type="checkbox" name="peopleName" value="${person}" id="checkbox-${person}">
                    <label for="checkbox-${person}">${person}</label><br>
                </div>
            `).join('')}
        </div>
    `;
            
            showBillData.appendChild(billFrame);

            if (bill.checkboxStates) {
                billFrame.querySelectorAll('input[name="peopleName"]').forEach(checkbox => {
                    const person = checkbox.value;
                    checkbox.checked = bill.checkboxStates[person] || false;
                });
            }
        });

        document.querySelectorAll('input[name="peopleName"]').forEach(checkbox => {
            checkbox.addEventListener('change', async () => {
                const billFrame = checkbox.closest('.billFrame')
                const billName = billFrame.querySelector('h2').textContent
                const tripName = tripData.tripName;
        
                const checkboxStates = {};
                billFrame.querySelectorAll('input[name="peopleName"]').forEach(cb => {
                    checkboxStates[cb.value] = cb.checked;
                })
        
                try {
                    const res = await fetch(`${server}/api/saveCheckbox`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tripName, billName, checkboxStates })
                    })
                    if (!res.ok) throw new Error('Failed to save checkbox states');
                }
                catch (err) {
                    console.log(err)
                }
            })
        })

    } catch (err) {
        console.log(err);
    }
};


confirmBill.addEventListener('click', async () => {
    if (BillName.value.trim() === '' || Amount.value.trim() === ''){
        return console.log('Please fill billname and amount')
    }

    const var_billName = BillName.value.trim()
    const var_amount = Amount.value.trim()
    try {
        const res = await fetch(`${server}/api/addBill`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({tripName: tripData.tripName , BillName: var_billName , Amount: var_amount})
        })
        if (!res.ok) {
            console.log("Error can't add bill to Database")
        }
        const { BillName , Amount } = await res.json()
        if (BillName && Amount) {
            const billFrame = document.createElement('div');
            billFrame.classList.add("billFrame");
            billFrame.innerHTML = `
                <div class="billNameFrame">
                    <h2>${BillName}</h2>
                    <div class="amount">${Amount} ฿</div>
                </div>
                <div class="deleteFrame">
                    <div class="delete">
                        <button class="deleteBillButton">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="peopleName">
                ${tripData.peopleNameList.map(person => `
                <div class="peopleCheckBox">
                    <input type="checkbox" name="peopleName" value="${person}" id="checkbox-${person}">
                    <label for="checkbox-${person}">${person}</label><br>
                </div>
            `).join('')}
        </div>
    `;
            
            showBillData.appendChild(billFrame);
            window.location.reload()
        } else {
            console.error('Invalid response format');
        }
    } 
    catch (err) {
        console.log(err)
    }
})

showBillData.addEventListener('click', async (e) => {
    if (e.target.closest(".delete")) {
        const billFrame = e.target.closest(".billFrame")
        const billId = billFrame.getAttribute("data-bill-id");
        console.log(billId)
        if (!billId) {
            console.error("Bill ID not found");
            return;
        }
        if (confirm(`Are you sure you want to delete the Bill?`)){
            try {
                const res = await fetch(`${server}/api/deleteBill/${billId}`, {
                    method: "DELETE",
                    headers: {"Content-Type" : "application/json"},
                })
                if (!res.ok) {
                    console.log("Error can't delete Bill")
                }

                billFrame.remove()
            }
            catch (err) {
                console.log(err)
            }
        }
    }
})



addBillTrip.addEventListener('click', () => {
    BillFrame.style.display = "inline";
})
cancelBill.addEventListener('click', () => {
    BillFrame.style.display = "none"
})

////// EndTrip Logic //////////
const sumFrame = document.querySelector('.sumFrame') 
const showTotals = document.querySelector('.showTotals')
const totalsFrame = document.querySelector('.totalsFrame')

document.getElementById('endTrip').addEventListener('click', async () => {
    mobileContainer.classList.add("blur-active");
    sumFrame.style.display = "inline"
})
document.getElementById('cancelSum').addEventListener('click', async () => {
    mobileContainer.classList.remove("blur-active");
    sumFrame.style.display = "none"
})
document.getElementById('confirmSum').addEventListener('click', async () => {
    sumFrame.style.display = 'none'
    totalsFrame.style.display = 'inline'
    const peopleTotals = {}
    let totalsAmount = 0
    document.querySelectorAll('.billFrame').forEach(bills => {
        const amountText = document.querySelector('.amount').textContent.replace('฿' , '').trim()
        const amount = parseFloat(amountText)
        totalsAmount += amount

        const checkedPeople = bills.querySelectorAll('input[name="peopleName"]:checked')
        const splitAmount = amount / checkedPeople.length

        checkedPeople.forEach(checked => {
            const person = checked.value
            if (!peopleTotals[person]){
                peopleTotals[person] = 0
            }
            peopleTotals[person] += splitAmount
        })
    })
    for (const person in peopleTotals) {
        const totalsPersonalData = document.createElement('div')
        totalsPersonalData.classList.add('totalsPersonalData')
        totalsPersonalData.innerHTML =`
        <h4>${person}:</h4>
        <h4>${peopleTotals[person].toFixed(2)} ฿</h4>
        `
        showTotals.appendChild(totalsPersonalData)
    }
    const totalsPersonalData = document.createElement('div')
    totalsPersonalData.classList.add('totalsPersonalData')
    totalsPersonalData.style.marginTop = "10px"
    totalsPersonalData.innerHTML =`
        <h4>Total:</h4>
        <h4>${totalsAmount.toFixed(2)} ฿</h4>
        `
        showTotals.appendChild(totalsPersonalData)
})

document.querySelector('#confirmTotals').addEventListener('click', () => {
    mobileContainer.classList.remove("blur-active");
    totalsFrame.style.display = "none"
    showTotals.innerHTML = ''
})

////// EndTrip Logic ///////////

