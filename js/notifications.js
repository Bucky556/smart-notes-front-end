import APIConfig from "./APIConfig.js";

document.addEventListener("DOMContentLoaded", () => {
    getNotifications();
});

window.getNotifications = getNotifications;
function getNotifications() {
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
            showNotifications(data)
            updateNotifBadge(data)
        })
        .catch(err => console.error(err));
}

function showNotifications(data) {
    const parent = document.getElementById('notificationsContainer');
    parent.innerHTML = '';

    const unreadNotifications = data.filter(notif => notif.type === 'UNREAD');

    if (!data || data.length === 0) {
        parent.innerHTML = '<p>No notifications found.</p>';
        return;
    }

    unreadNotifications.forEach(notif => {
        const div = document.createElement('div');
        div.classList.add('notification-card');
        if (notif.type === 'UNREAD') {
            div.classList.add('notification-unread');
        }

        const message = document.createElement('p');
        message.classList.add('notification-message');
        message.textContent = notif.title;

        const notifCloseBtn = document.createElement('button');
        notifCloseBtn.classList.add('notification-close');
        notifCloseBtn.textContent = 'X';

        notifCloseBtn.addEventListener('click', () => {
            div.remove();
            deleteNotification(notif.id);
        });

        div.addEventListener('click', (e) => {
            if (e.target !== notifCloseBtn) {
                window.location.href = `notification-detail.html?id=${notif.id}`;
            }
        });

        div.appendChild(message);
        div.appendChild(notifCloseBtn);

        parent.appendChild(div);
    })
}

window.deleteNotification = deleteNotification;
function deleteNotification(notifId) {
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        alert("Please login again");
        window.location.href = "./login.html";
        return;
    }

    fetch(APIConfig.API + "/notification/" + notifId, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + jwt
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(data => {
        showPopup(data.message);
        getNotifications();
    }).catch(error => {
        console.error('Error:', error);
        return null;
    })
}

function updateNotifBadge(data){
    const badge = document.getElementById("notifBadge");

    const unreadNotif = data.filter(notif => notif.type === 'UNREAD');

    if (unreadNotif > 0) {
        badge.style.display = "inline-block";
        badge.textContent = unreadNotif;
    } else {
        badge.style.display = "none";
    }
}