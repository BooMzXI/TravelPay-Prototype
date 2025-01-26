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
    tripDetailPage.style.display = "none";
    mobileContainer.classList.remove("blur-active");
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
        tripDetailPage.classList.remove("blur-active");
        InputNamePage.style.display = "none";
        InputPeopleName.value = "";

        const deleteBtn = peopleNameDiv.querySelector(".deleteNameButton");
        deleteBtn.addEventListener("click", () => {
            peopleNameDiv.remove(); 
        });
    }
    else {
        InputPeopleName.placeholder = "People name is required!";
    }
})

