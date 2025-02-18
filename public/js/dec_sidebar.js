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
document.querySelector('#signout').addEventListener('click', async () => {
    Swal.fire({
        title: "Are you sure?",
        text: "Are you sure to sign out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, sign out"
    }).then(async (result) => {

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${location.origin}/api/logout`, {
                    method: 'POST',
                    credentials: 'include'
                });
                if (res.ok) {
                    alert('Logged out successfully!');
                    window.location.href = '/';
                } else {
                    // alert('Logout failed.');
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Logout failed",
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
    // if (confirm("Are you sure to sign out?")) {

    // }
})