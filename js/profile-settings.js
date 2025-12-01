import APIConfig from "./APIConfig.js";

window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("backBtn").addEventListener("click", () => {
        window.location.href = "./myNotes.html";
    });

    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    document.getElementById("nameInput").value = userDetails.name;
    document.getElementById("usernameInput").value = userDetails.email;

    if (userDetails.photoId && userDetails.photoId.url) {
        document.getElementById("profilePhoto").src = userDetails.photoId.url;
    } else {
        document.getElementById("profilePhoto").src = "./images/default-user.png";
    }
})

window.triggerFileInput = triggerFileInput;
function triggerFileInput() {
    document.getElementById("photoInput").click();
}

window.previewImage = previewImage;
function previewImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const img = document.getElementById('profilePhoto');
        img.src = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file);
        document.getElementById('savePhotoBtn').style.display = 'inline-block';
    }
}

window.uploadImage = uploadImage;
function uploadImage() {
    const fileInput = document.getElementById('photoInput');
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const jwt = localStorage.getItem('jwtToken');
        if (!jwt) {
            alert("Please, login again")
            window.location.href = './login.html';
            return;
        }

        fetch(APIConfig.API + '/attach/upload', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + jwt
            },
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject(response);
                }
            })
            .then(data => {
                    if (data.id) {
                        updateProfileImage(data.id)

                        const userDetailsJson = localStorage.getItem("userDetails");
                        if (userDetailsJson) {
                            const userDetailsObj = JSON.parse(userDetailsJson);
                            // update photo object
                            userDetailsObj.photoId = {
                                id: data.id,
                                url: data.url
                            };
                            // save a new object
                            localStorage.setItem("userDetails", JSON.stringify(userDetailsObj));
                        }

                        // DOMdagi rasmni ham update qilamiz (header va profile page)
                        document.getElementById('profilePhoto').src = data.url;
                    } else {
                        alert("Attach photo not found")
                    }
                }
            )
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

window.updateProfileImage = updateProfileImage;
function updateProfileImage(photoId) {
    const photoMessage = document.getElementById("photoMessage")
    if (!photoId) {
        return;
    }

    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        alert("Please, login again")
        window.location.href = './login.html';
        return;
    }

    const body = {
        "photoId": photoId,
    }

    fetch(APIConfig.API + '/profile/update/photo', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt
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
                document.getElementById('savePhotoBtn').style.display = 'none';
                photoMessage.textContent = data.message;
                photoMessage.style.display = "inline-block";

                setTimeout(() => {
                    photoMessage.style.display = "none";
                }, 3000)

                const userDetailsJson = localStorage.getItem("userDetails");
                if (userDetailsJson) {
                    const userDetailsObj = JSON.parse(userDetailsJson);
                    // update photo object
                    userDetailsObj.photoId = {
                        id: photoId,
                        url: APIConfig.API + `/attach/open/${photoId}`,
                    };
                    // save a new object of photoId
                    localStorage.setItem("userDetails", JSON.stringify(userDetailsObj));

                    document.querySelectorAll(".userPhoto").forEach(img => {
                        img.src = APIConfig.API + `/attach/open/${photoId}`;
                    });

                    setTimeout(() => {
                        location.reload();
                    }, 1000)
                }
            }
        )
        .catch(error => {
            console.error('Error:', error);
            alert("Error occurred");
        });
}

window.updateName = updateName;
function updateName() {
    const name = document.getElementById("nameInput").value
    if (!name) {
        alert("Please enter your name");
        return;
    }

    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        alert("PLease login again")
        window.location.href = "./login.html"
        return;
    }

    const nameMessage = document.getElementById("trueNameMessageSpan");
    nameMessage.style.display = "none";

    const body = {
        "name": name
    }

    fetch(APIConfig.API + '/profile/update/name', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt,
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
            nameMessage.style.display = "inline-block";
            nameMessage.innerText = data.message;

            setTimeout(() => {
                nameMessage.style.display = "none";
            }, 5000)

            // update localStorage
            const userDetailJon = localStorage.getItem("userDetails");
            const userDetails = JSON.parse(userDetailJon);
            userDetails.name = name;
            localStorage.setItem("userDetails", JSON.stringify(userDetails));

            // refresh qilmasdan boshqa joylarda ham automatik uzgarib ketadi update bulgan qiymatga
            document.getElementById("nameInput").textContent = name;
        })
        .catch(() => {
            alert("Something went wrong, please try again later.");
        })
}

window.updatePassword = updatePassword;
function updatePassword() {
    const currentPswd = document.getElementById("oldPassword").value;
    const newPswd = document.getElementById("newPassword").value;
    if (!currentPswd || !newPswd) {
        alert("Please enter all inputs")
        return;
    }

    const passwordMessage = document.getElementById("truePasswordMessageSpan");
    const errorPasswordMessage = document.getElementById("ErrorCurrentPasswordMessageSpan");
    passwordMessage.style.display = "none";
    errorPasswordMessage.style.display = "none";
    passwordMessage.style.borderColor = "#ddd";
    errorPasswordMessage.style.borderColor = "#ddd";

    const body = {
        "currentPassword": currentPswd,
        "newPassword": newPswd
    }

    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        alert("Please login again")
        window.location.href = "./login.html"
    }

    fetch(APIConfig.API + '/profile/update/password', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt
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
            passwordMessage.style.display = "inline-block";
            passwordMessage.innerText = data.message;

            document.getElementById("oldPassword").value = '';
            document.getElementById("newPassword").value = '';

            setTimeout(() => {  // 5 sekund kurinib turadi keyn yuq buladi
                passwordMessage.style.display = "none";
            }, 5000)

        })
        .catch(async (response) => {
            let errorText = "Something went wrong in password";
            try {
                const data = await response.json(); // serverdan kelgan JSONni o'qish
                errorText = data.message || data.data || errorText;
            } catch (e) {
                alert("Can not retrieve the data");
            }

            const errorPasswordMessage = document.getElementById("ErrorCurrentPasswordMessageSpan");
            errorPasswordMessage.style.display = "block";
            errorPasswordMessage.innerText = errorText;
            errorPasswordMessage.style.borderColor = "#ff0000";

            setTimeout(() => {
                errorPasswordMessage.style.display = "none";
            }, 5000)
        });
}

window.updateUsername = updateUsername;
function updateUsername() {
    const username = document.getElementById("usernameInput").value
    const errorUsernameMessage = document.getElementById("ErrorUsernameMessageSpan");
    const confirmCodeSent = document.getElementById("confirmModalResultId")
    if (!username) {
        alert("Enter all inputs")
        return;
    }
    const body = {
        "username": username
    }

    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
        alert("Please, login again")
        window.location.href = './login.html';
    }

    fetch(APIConfig.API + '/profile/update/username', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt
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
            confirmCodeSent.textContent = data.message;

            openModal()
        })
        .catch(async (response) => {
            let errorText = "Something went wrong in username";
            try {
                const data = await response.json(); // serverdan kelgan JSONni o'qish
                errorText = data.message || data.data || errorText;
            } catch (e) {
                alert("Can not retrieve the data");
            }

            errorUsernameMessage.style.display = "block";
            errorUsernameMessage.innerText = errorText;
            errorUsernameMessage.style.borderColor = "#ff0000";

            setTimeout(() => {
                errorUsernameMessage.style.display = "none";
            }, 5000)
        });
}

window.updateUsernameConfirm = updateUsernameConfirm;
function updateUsernameConfirm() {
    const confirmCode = document.getElementById("profileUserNameChaneConfirmInputId").value
    const errorCodeMessage = document.getElementById("ErrorCodeSpan");
    const usernameMessage = document.getElementById("trueUsernameMessageSpan")
    const username = document.getElementById("usernameInput").value
    if (!confirmCode) {
        alert("Enter all inputs")
    }

    const code = document.getElementById("profileUserNameChaneConfirmInputId").value

    const body = {
        "code": code
    }

    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
        alert("Please, login again")
        window.location.href = './login.html';
    }

    fetch(APIConfig.API + '/profile/update/username/confirm', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt
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
            usernameMessage.style.display = "inline-block";
            usernameMessage.innerText = data.message;

            setTimeout(() => {
                usernameMessage.style.display = "none";
            }, 5000)

            localStorage.setItem("jwtToken", data.data); // jwt-ni yangisiga set qilish

            const userDetailsJson = localStorage.getItem("userDetails");
            const userDetails = JSON.parse(userDetailsJson);
            userDetails.email = username;
            userDetails.accessToken = data.data
            localStorage.setItem("userDetails", JSON.stringify(userDetails)); // userDetails-ni yangisiga set qilish
            localStorage.setItem("email", username) // email-ni yangisiga set qilish

            closeModal()
        })
        .catch(async (response) => {
            let errorText = "Something went wrong in username";
            try {
                const data = await response.json(); // serverdan kelgan JSONni o'qish
                errorText = data.message || data.data || errorText;

                errorCodeMessage.style.display = "block";
                errorCodeMessage.textContent = errorText;
            } catch (e) {
                alert("Can not retrieve the data");
            }

            setTimeout(() => {
                errorCodeMessage.style.display = "none";
            }, 5000)
        });
}

const modal = document.getElementById('simpleModalId');

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};