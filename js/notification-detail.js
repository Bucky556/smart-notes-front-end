window.addEventListener("DOMContentLoaded", function () {
    const url = new URL(window.location.href);  // www.com.?id=1321123
    const id = url.searchParams.get("id");
    if (id) {
        getNotifById(id);
    }

    const detailBtn = document.getElementById("editBtn");
    const notifId = getNotifIdFromURL();

    if (detailBtn) {
        detailBtn.addEventListener("click", () => {
            window.location.href = `notification-detail.html?id=${notifId}`;
        });
    }
});

function getNotifById(id) {
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        alert("Please login again");
        window.location.href = "./login.html";
        return;
    }

    fetch("http://localhost:8080/api/v1/notification/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response)
            }
        })
        .then(data => {
            showNotification(data)
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

function showNotification(data) {
    const notifTitle = document.getElementById("notificationTitle");
    const notifDate = document.getElementById("notificationDate");
    const notifMessage = document.getElementById("notificationMessage");

    notifTitle.textContent = data.title || "Untitled Note";
    notifDate.textContent = formatDate(data.sentTime)
    notifMessage.textContent = data.message || "No content";

    const backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("click", () => {
        window.location.href = "./notifications.html";
    })
}

function getNotifIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}