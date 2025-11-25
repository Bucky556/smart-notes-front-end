function sendResetCode(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;

    const body = {
        email: email
    }

    fetch("http://localhost:8080/auth/api/v1/reset/password", {
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
            localStorage.setItem('Pop-up', 'Code send');
            localStorage.setItem('email', email);

            window.location.href = "./reset-password-confirm.html";
        })
        .catch(error => {

        });
}