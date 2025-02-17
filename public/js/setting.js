const userEmailFrame = document.querySelector('.userEmailFrame')
const showEmail = document.querySelector('#showEmail')

let server = location.origin;

window.onload = async () => {
    try {
        const res = await fetch(`${server}/api/getEmail`, {
            method: "GET"
        })
        if (!res) {
            return console.log("Error to get email")
        }
        const data = await res.json()
        showEmail.innerHTML = ` ${data.email}`
    } catch (err) {
        console.log(err)
    }
}


document.getElementById('backHome').addEventListener('click', () => {
    window.location.href = '/'
})