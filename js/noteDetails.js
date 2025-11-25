window.addEventListener("DOMContentLoaded", function () {
    const url = new URL(window.location.href);  // www.com.?id=1321123
    const id = url.searchParams.get("id");
    if (id) {
        getNoteById(id);
    }

    const editBtn = document.getElementById("editBtn");
    const noteId = getNoteIdFromURL();

    if (editBtn) {
        editBtn.addEventListener("click", () => {
            window.location.href = `note-edit.html?id=${noteId}`;
        });
    }
});

function getNoteById(id) {
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        alert("Please login again");
        window.location.href = "./login.html";
    }

    fetch("http://localhost:8080/note/api/v1/" + id, {
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
            showNote(data)
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

function showNote(data) {
    const noteTitle = document.getElementById("noteTitle");
    const noteDate = document.getElementById("noteDate");
    const noteContent = document.getElementById("noteContent");

    noteTitle.textContent = data.title || "Untitled Note";
    noteDate.textContent = formatDate(data.createdDate)
    noteContent.textContent = data.content || "No content";
}

function getNoteIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}