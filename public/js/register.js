let registerEmail = document.getElementById('registerEmail')
let registerPassword = document.getElementById('registerPassword')
let registerRepeatPassword = document.getElementById('registerRepeatPassword')
let registerButton = document.getElementById('registerButton')

let server = "http://localhost:3000";

registerButton.addEventListener('click', async () => {
    const var_registerEmail = registerEmail.value.trim()
    const var_registerPassword = registerPassword.value.trim()
    const var_registerRepeatPassword = registerRepeatPassword.value.trim()
    if (var_registerEmail == '' || var_registerPassword == '' || var_registerRepeatPassword == ''){
        return alert("Please fill in all information")
    }
    if (var_registerPassword !== var_registerRepeatPassword){
        return alert("Please enter your password correctly")
    }

    try {
        const res = await fetch(`${server}/api/register`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({email: var_registerEmail , password: var_registerPassword})
        })
        result = await res.json()
        if (!res.ok){
            return alert('This email is already registered. Please use a different email address')
        }
        alert('Register successfully!')
        window.location.href = result.redirectUrl;
    } catch (err) {
        console.log("Error can't fetch data",err)
    }
})