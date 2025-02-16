const sidebar = document.querySelector('.sidebar');
const toggleButton = document.querySelector('#toggleSidebar'); 
const exitButtonDiv = document.querySelector('#exitSidebar')

let server = "http://localhost:3000";

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
document.querySelector('#signout').addEventListener('click', async () => {
    if (confirm("Are you sure to sign out?")) {
        try {
            const res = await fetch(`${server}/api/logout`, {
                method: 'POST',
                credentials: 'include' 
            });
            if (res.ok) {
                alert('Logged out successfully!');
                window.location.href = '/'; 
            } else {
                alert('Logout failed.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
})