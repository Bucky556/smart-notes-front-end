function verifyCode(event) {
    event.preventDefault(); // form submit-ni to‘xtatadi

    const code = document.getElementById("code").value.trim();
    const email = localStorage.getItem('email');

    const body = {
        email: email,
        code: code
    }

    if (!code || code.length !== 4) {
        showPopup("Please enter 4 digit code");
        return;
    }

    fetch("http://localhost:8080/auth/api/v1/register/email/verification", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then(async response => {
            if (response.ok) {
                return response.json();
            } else {
                // backenddan error message ni olish
                const errorData = await response.json().catch(() => null);
                const message = errorData?.message || "Verification failed. Please try again.";
                throw new Error(message);
            }
        })
        .then(data => {
            showPopup(data.message);

            setTimeout(() => {
                window.location.href = "./login.html";
            }, 1000);
        })
        .catch(error => {
            showPopup(error.message);
        })
}

function resendCode(event) {
    event.preventDefault();

    const email = localStorage.getItem('email')

    const body = {
        email: email
    }

    fetch("http://localhost:8080/auth/api/v1/register/email/verification/resend", {
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
            showPopup("Verification code resent");
        })
        .catch(error => {
            showPopup(error.message || "Something went wrong. Please try again.");
        })
}