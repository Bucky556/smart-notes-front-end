import APIConfig from "./APIConfig.js";

document.addEventListener("DOMContentLoaded", () => {

    getNotification();

    setInterval(getNotification, 10000)
});

function getNotification() {
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        alert("Please login again");
        window.location.href = "./login.html";
        return;
    }

    fetch(APIConfig.API + "/notification", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jwt,
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (res.ok) return res.json();
            else return Promise.reject(res);
        })
        .then(data => {
            updateNotificationBadge(data)
        })
        .catch(err => console.error(err));
}

function updateNotificationBadge(data) {
    const badge = document.getElementById("notifBadge");

    const unreadNotif = data.filter(notif => notif.type === 'UNREAD');

    if (unreadNotif.length > 0) {
        badge.style.display = "inline-block";
        badge.textContent = unreadNotif.length;
    } else {
        badge.style.display = "none";
    }
}