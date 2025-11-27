function login(event) {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const email = emailInput.value;
    const password = passwordInput.value;
    const emailError = document.getElementById("emailErrorSpan");
    const passwordError = document.getElementById("passwordErrorSpan");

    emailError.style.display = "none";
    emailInput.style.borderColor = "#ddd";
    passwordInput.nextElementSibling.style.display = "none";
    passwordInput.style.borderColor = "#ddd";

    let hasError = false;
    if (email === null || email === undefined || email.length === 0) {
        emailError.style.display = "block";
        emailInput.style.borderColor = "#ff0000";
        hasError = true;
    }

    if (password === null || password === undefined || password.length === 0) {
        passwordInput.nextElementSibling.style.display = "block";
        passwordInput.style.borderColor = "#ff0000";
        hasError = true;
    }

    if (hasError === true) {  // 2 ta input-da ham xato chiqsa birdaniga chiqarish uchun
        return;
    }

    const body = {
        email: email.trim(),
        password: password
    }

    fetch("http://localhost:8080/api/v1/auth/login", {
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
            localStorage.setItem("userDetails", JSON.stringify(data));
            localStorage.setItem("jwtToken", data.accessToken);

            emailInput.value = '';
            passwordInput.value = ''; // login bulgandan keyin inputlari tozalanib ketadi (clean)

            localStorage.removeItem("email")
            window.location.href = "./myNotes.html";
            // redirect bulekan page ni yozish kerak bu yerga...
        })
        .catch(async error => {
            let errorText = "Something went wrong, please try again.";

            try {
                const errData = await error.json(); // backenddan JSON olamiz
                if (errData && errData.message) {
                    errorText = errData.message;
                }
            } catch (e) {
                // agar json bo'lmasa default message ishlatiladi
            }

            if (errorText.includes("or")) {
                emailError.style.display = "block";
                emailError.innerText = errorText;
                emailInput.style.borderColor = "#ff0000";

                passwordError.style.display = "block";
                passwordError.innerText = errorText;
                passwordInput.style.borderColor = "#ff0000";
            } else {
                alert(errorText);
            }
        });
}