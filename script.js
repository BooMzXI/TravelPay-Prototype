let plusBtn = document.getElementById("plusButton");

//Screen setting
const mobileContainer = document.querySelector(".mobile");

//Show tripDetial Page
let tripDetailPage = document.getElementById("tripDetail");
let cancelBtn = document.getElementById("cancelButton");
let confirmBtn = document.getElementById("confirmButton");
let inputElement = document.querySelector("#tripDetail input"); 
const nameContainerFrame = document.querySelector(".nameContainerFrame");

//Input name page
let addBtn = document.getElementById("addButton");
let InputNamePage = document.querySelector(".inputNameBackground");
let CancelInputBtn = document.getElementById("cancelInputButton");
let ConfirmInputBtn = document.getElementById("confirmInputButton");
let InputPeopleName = document.getElementById("inputPeopleName");

let inputTripName;
let inputPeopleNameVariable;
let peopleCount = 0;

plusBtn.addEventListener("click", () => {
    tripDetailPage.style.display = "inline";
    mobileContainer.classList.add("blur-active");
});


//Trip detail page
cancelBtn.addEventListener("click", () => {
    tripDetailPage.style.display = "none";
    mobileContainer.classList.remove("blur-active");
});
confirmBtn.addEventListener("click", () => {
    inputTripName = inputElement.value.trim(); 
    const nameContainerFrame = document.querySelector(".nameContainerFrame");
    nameContainerFrame.innerHTML = "";

    // Create a new tripData div
    const tripDataDiv = document.createElement("div");
    tripDataDiv.classList.add("tripData");
    tripDataDiv.innerHTML = `
        <div class="nameTripFrame">
            <h4 id="showTripName">${inputTripName}</h4>
            <h4 id="showCreatedTime">${new Date().toLocaleDateString()}</h4>
        </div>
        <div class="joinCountFrame">
            <h4 class="joinCount">Join: ${peopleCount}</h4>
        </div>
        <div class="invitePeopleFrame">
            <div class="invitePeopleBorder"></div>
        </div>
    `;

    const showTripContainer = document.querySelector(".showTrip");
    showTripContainer.appendChild(tripDataDiv);
    tripDetailPage.style.display = "none";
    mobileContainer.classList.remove("blur-active");
    inputElement.value = "";
    peopleCount = 0;
});

//Add people name page
addBtn.addEventListener("click", () => {
    InputNamePage.style.display = "grid";
    tripDetailPage.classList.add("blur-active");
})
CancelInputBtn.addEventListener("click", () => {
    InputNamePage.style.display = "none";
    tripDetailPage.classList.remove("blur-active");
    InputPeopleName.value = "";
})
ConfirmInputBtn.addEventListener("click",() => {
    inputPeopleNameVariable = InputPeopleName.value.trim();
    if (inputPeopleNameVariable){
        const peopleNameDiv = document.createElement("div");
        peopleNameDiv.classList.add("peopleName");
        peopleNameDiv.innerHTML = `
            <h4>${inputPeopleNameVariable}</h4>
            <button class="deleteNameButton">
                <i class="fa-solid fa-delete-left"></i>
            </button>
        `;
        nameContainerFrame.appendChild(peopleNameDiv);
        peopleCount++;
        const invitePeopleBorder = document.querySelector(".invitePeopleBorder");
        const nameDiv = document.createElement("div");

        tripDetailPage.classList.remove("blur-active");
        InputNamePage.style.display = "none";
        InputPeopleName.value = "";
        nameDiv.classList.add("name");
        nameDiv.textContent = inputPeopleNameVariable;
        invitePeopleBorder.appendChild(nameDiv);

        const deleteBtn = peopleNameDiv.querySelector(".deleteNameButton");
        deleteBtn.addEventListener("click", () => {
            peopleNameDiv.remove(); 
            nameDiv.remove();
            peopleCount--;
            if (joinCount) {
                joinCount.textContent = `Join: ${peopleCount}`;
            }
        });
    }
    else {
        InputPeopleName.placeholder = "People name is required!";
    }
})

