window.addEventListener("DOMContentLoaded", () => {
    const popupMessage = localStorage.getItem("Pop-up");
    if (popupMessage) {
        showPopup(popupMessage, "success");
        localStorage.removeItem("Pop-up"); // faqat bir marta chiqsin
    }
});


function resetPasswordConfirm(event) {
    event.preventDefault();

    const email = localStorage.getItem('email');
    const code = document.getElementById("code").value;
    const newPassword = document.getElementById("newPassword").value;

    const body = {
        email: email,
        code: code,
        newPassword: newPassword
    }

    if (!newPassword || newPassword.trim() === "") {
        alert("Please enter new password")
        return;
    }

    fetch("http://localhost:8080/auth/api/v1/reset/password/confirm", {
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
            showPopup(data.message);

            setTimeout(() => {
                window.location.href = './login.html';
            }, 1500);
        })
        .catch(error => {
            showPopup("Wrong code", "error");
        });
}