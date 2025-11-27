import APIConfig from "./APIConfig.js";

let currentPage = 1;
let pageSize = 10;
let totalPages = 1;

window.addEventListener("DOMContentLoaded", function () {
    getProfileList();

    const profileQuery = document.getElementById("searchNameEmail")
    profileQuery.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            currentPage = 1;
            getProfileList(true);
        }
    });

    document.getElementById("prevPageBtn").addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            getProfileList();
        }
    });

    document.getElementById("nextPageBtn").addEventListener("click", function () {
        if (currentPage < totalPages) {
            currentPage++;
            getProfileList();
        }
    });

});

window.getProfileList = getProfileList;
function getProfileList(isSearch = false) {
    const profileQuery = document.getElementById("searchNameEmail").value.trim();
    if (isSearch && !profileQuery) {
        return;
    }


    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
        alert("Please, login first");
        window.location.href = "./login.html";
    }

    const body = {
        "query": profileQuery
    }

    fetch(APIConfig.API + "/profile/admin/filter?page=" + currentPage + "&size=" + pageSize, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt
        },
        body: JSON.stringify(body)
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(data => {
        try {
            showProfileList(data.content);

            totalPages = data.totalPages;
            updatePagination();
        } catch (error) {
            console.log(error);
        }
    }).catch(error => {
        console.error('Error:', error);
        return null;
    })
}

function showProfileList(profileList) {
    const parent = document.getElementById("profileListContainerId");
    parent.innerHTML = '';

    const parsedUser = JSON.parse(localStorage.getItem("userDetails"));
    profileList
        .filter(profile => profile.email !== parsedUser.email)  // uzinikini kursatmedi
        .forEach((profile, idCount) => {
            const tr = document.createElement("tr");
            const number = document.createElement("td");
            number.innerHTML = (currentPage - 1) * pageSize + (idCount + 1);
            const tdImage = document.createElement("td");
            const img = document.createElement("img");
            img.classList.add("userPhoto");
            if (profile.photoId && profile.photoId.id) {
                img.src = profile.photoId.url;
            } else {
                img.src = "./images/default-user.png"
            }
            tdImage.appendChild(img);
            const name = document.createElement("td");
            name.innerHTML = profile.name;
            const email = document.createElement("td");
            email.innerHTML = profile.email;
            const createdDate = document.createElement("td");
            createdDate.textContent = formatDate(profile.createdDate)
            const tdButton = document.createElement("td");
            const btnStatus = document.createElement("button");
            btnStatus.classList.add("status-btn", "active");
            btnStatus.innerHTML = profile.status;

            if (profile.status === "ACTIVE") {
                btnStatus.classList.add("status-btn", "active");
                btnStatus.innerHTML = "ACTIVE";
                btnStatus.onclick = function () {
                    changeStatus(profile.id, "BLOCKED");
                }
            } else if (profile.status === "BLOCKED") {
                btnStatus.classList.add("status-btn", "blocked");
                btnStatus.innerHTML = "BLOCKED";
                btnStatus.onclick = function () {
                    changeStatus(profile.id, "ACTIVE");
                }
            } else if (profile.status === "IN_REGISTRATION") {
                btnStatus.classList.add("status-btn", "registration");
                btnStatus.innerHTML = "IN_REGISTRATION";
            }
            tdButton.appendChild(btnStatus);
            const tdDelete = document.createElement("td");
            const basket = document.createElement("img");
            basket.classList.add("table_basket", "hover-pointer");
            basket.src = "./images/bin.png";
            basket.onclick = function () {
                deleteProfile(profile.id);
            }
            tdDelete.appendChild(basket);

            tr.appendChild(number);
            tr.appendChild(tdImage);
            tr.appendChild(name);
            tr.appendChild(email);
            tr.appendChild(createdDate);
            tr.appendChild(tdButton);
            tr.appendChild(tdDelete);

            parent.appendChild(tr);
        })
}

window.changeStatus = changeStatus;
function changeStatus(profileId, status) {
    if (!confirm("Are you sure you want to change status?")) {
        return;
    }

    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
        alert("Please, login again");
        window.location.href = "./login.html";
        return;
    }

    const body = {
        "status": status
    }

    fetch(APIConfig.API + '/profile/admin/change/status/' + profileId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt
        },
        body: JSON.stringify(body)
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(data => {
        showPopup(data.message);
        getProfileList();
    }).catch(error => {
        console.error('Error:', error);
        return null;
    })
}

window.deleteProfile = deleteProfile;
function deleteProfile(profileId) {
    if (!confirm("Are you sure you want to delete this profile?")) {
        return;
    }

    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
        alert("Please, login again");
        window.location.href = "./login.html";
        return;
    }

    fetch(APIConfig.API + '/profile/admin/delete/' + profileId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
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
        getProfileList();
    }).catch(error => {
        console.error('Error:', error);
        return null;
    })

}

function updatePagination() {
    const paginationContainer = document.getElementById("paginationSection");
    const visibleProfileRows = document.querySelectorAll("#profileListContainerId tr").length;

    if (totalPages <= 1 || visibleProfileRows <= 1) {
        paginationContainer.style.display = "none";
        return;
    }

    paginationContainer.style.display = "flex";

    document.getElementById("currentPage").innerText = currentPage;

    const prevBtn = document.getElementById("prevPageBtn");
    const nextBtn = document.getElementById("nextPageBtn");

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
}