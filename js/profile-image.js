window.addEventListener("DOMContentLoaded", function () {
    const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};

    const userPhotoEl = document.getElementById("userPhoto");
    if (userDetails.photoId && userDetails.photoId.url) {
        userPhotoEl.src = userDetails.photoId.url;
    } else {
        userPhotoEl.src = "./images/default-user.png";
    }
});
