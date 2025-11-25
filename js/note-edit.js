window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("backBtn").addEventListener("click", () => {
        window.location.href = "./myNotes.html";
    });

    const urlParams = new URLSearchParams(window.location.search);
    const noteId = urlParams.get("id");

    if (!noteId) {
        alert("No note selected");
        window.location.href = "./myNotes.html";
        return;
    }

    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        alert("Please, login again");
        window.location.href = "./login.html";
        return;
    }

    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const reminderInput = document.getElementById("reminder");
    const favoriteCheckbox = document.getElementById("favorite");
    const form = document.getElementById("editNoteForm");

    fetch(`http://localhost:8080/note/api/v1/by/id/${noteId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt
        }
    })
        .then(res => res.json())
        .then(data => {
            titleInput.value = data.title;
            contentInput.value = data.content;

            if (data.reminderDate) {
                reminderInput.value = new Date(data.reminderDate).toISOString().slice(0, 16);
            }

            favoriteCheckbox.checked = data.favorite || false;
        })
        .catch(err => {
            console.error(err);
            alert("Error loading note");
        });

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // page reload bo'lishini oldini olamiz

        const body = {
            title: titleInput.value,
            content: contentInput.value,
            reminderDate: reminderInput.value || null,
            favorite: favoriteCheckbox.checked
        };

        fetch('http://localhost:8080/note/api/v1/update/' + noteId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                if (!res.ok) throw new Error("Update failed");
                return res.json();
            })
            .then(data => {
                showPopup(data.message);
                setTimeout(function () {
                    window.location.href = "./note-detail.html?id=" + noteId;
                }, 2000);
            })
            .catch(err => {
                console.error(err);
                alert("Error updating note. Please try again.");
            });
    });
})