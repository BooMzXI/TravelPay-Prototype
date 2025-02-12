const InputPassword = document.getElementById('PasswordData')
const InputEmail = document.getElementById('EmailData')
const loginButton = document.getElementById('loginButton')
const registerButton = document.getElementById('registerButton')

let server = "http://localhost:3000";

loginButton.addEventListener('click', async () => {
    let email = InputEmail.value.trim()
    let password = InputPassword.value.trim()

    if (!email || !password){
        alert("Please enter email and password")
        return
    }
    try {
        let res = await fetch(`${server}/api/sign-in`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({ email , password }),
        })
        const result = await res.json();
        if(!res.ok){
            alert("This email address has not been logged in yet")
        }
        else {
            alert("Welcome back!")
            window.location.href = result.redirectUrl;
        }
    } catch (err) {
        if(err){
            console.log("Error to fetch  sign-in api: ",err)
        }
    }
})

registerButton.addEventListener('click', () => {
    window.location.href = "/register.html"
})