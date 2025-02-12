const sidebar = document.querySelector('.sidebar');
const toggleButton = document.querySelector('#toggleSidebar'); 
const exitButtonDiv = document.querySelector('#exitSidebar')

toggleButton.addEventListener('click', () => {
    sidebar.classList.add('open');
    sidebar.classList.remove('close');
});
exitButtonDiv.addEventListener('click', () => {
    sidebar.classList.add('close');
    sidebar.classList.remove('open');
});

const home = document.querySelector('#home').addEventListener('click', () => {
    window.location.href = "/"
})