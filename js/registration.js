import APIConfig from "./APIConfig.js";

document.getElementById("registration_form")
    .addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const phoneEmailRedLineBorder = document.getElementById("email");
        const email = phoneEmailRedLineBorder.value;
        const redLineBorderPassword = document.getElementById("password");
        const password = redLineBorderPassword.value;
        const redLineBorderConfirm = document.getElementById("confirmPassword");
        const confirmPassword = redLineBorderConfirm.value;
        const errorTextConfirmation = document.getElementById("errorTextConfirmation");
        const errorTextEmail = document.getElementById("errorTextEmail");
        const redLineBorderEmail = document.getElementById("email")

        //Har submitda default rangni qaytarib qo'yamiz agar tugri bulsa
        errorTextConfirmation.style.display = "none";
        errorTextEmail.style.display = "none";
        redLineBorderConfirm.style.borderColor = "#ddd";
        redLineBorderPassword.style.borderColor = "#ddd";
        phoneEmailRedLineBorder.style.borderColor = "#ddd";

        const body = {
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
        }

        fetch(APIConfig.API + "/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject(response);
                }
            })
            .then(data => {
                const Email = checkEmail(email);
                if (Email === 'Email') {
                    localStorage.setItem('email', email);
                    showPopup(data.message, "success") // backend-dan kelgan tilga mos xabar keladi
                    setTimeout(() => {
                        window.location.href = './registration-confirm.html';
                    }, 1500); // va registration-confirm page ga redirect qiladi
                } else if (Email === 'Invalid') {
                    errorTextEmail.style.display = "block";
                    errorTextEmail.innerText = data.data;
                    redLineBorderEmail.style.borderColor = "#ff0000";
                }
            })
            .catch(error => {
                error.json().then(err => {
                    const errorText = err.message;
                    if (errorText.includes("already")) {
                        errorTextEmail.style.display = "block";
                        errorTextEmail.innerText = errorText;
                        phoneEmailRedLineBorder.style.borderColor = "#ff0000";
                    } else if (errorText.includes("Passwords")) {
                        errorTextConfirmation.style.display = "block";
                        errorTextConfirmation.innerText = errorText;
                        redLineBorderConfirm.style.borderColor = "#ff0000";
                        redLineBorderPassword.style.borderColor = "#ff0000";
                    } else {
                        alert("Something went wrong, please try again later.");
                    }
                });
            })
    })

function checkEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(value)) {
        return "Email";
    } else {
        return "Invalid";
    }
}