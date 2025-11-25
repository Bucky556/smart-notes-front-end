let currentPage = 1;
let pageSize = 9;
let totalPages = 1;
document.addEventListener("DOMContentLoaded", () => {
    getNoteList();

    const noteQuery = document.getElementById("searchTitle")
    noteQuery.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            currentPage = 1;
            getNoteList(true);
        }
    });

    document.getElementById("prevPageBtn").addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            getNoteList();
        }
    });

    document.getElementById("nextPageBtn").addEventListener("click", function () {
        if (currentPage < totalPages) {
            currentPage++;
            getNoteList();
        }
    });
});

function getNoteList(isSearch = false) {
    const notesQuery = document.getElementById("searchTitle").value.trim();
    if (isSearch && !notesQuery) {
        return;
    }

    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        alert("Please login again")
        window.location.href = "./login.html";
    }

    const body = {
        "query": notesQuery
    }

    fetch("http://localhost:8080/note/api/v1/filter?page="+ currentPage + "&size=" + pageSize, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + jwt,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response)
            }
        })
        .then(data => {
            showNoteList(data.content);

            totalPages = data.totalPages;

            updatePagination();
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

function showNoteList(data) {
    const parent = document.getElementById('myNotesContainer');
    parent.innerHTML = '';

    data.forEach(note => {
        const div = document.createElement('div');
        div.classList.add('note-card');
        div.onclick = (e) => {
            if (e.target.tagName === 'Button') return;
            window.location.href = "./note-detail.html?id=" + note.id;
        }

        const title = document.createElement("h3");
        title.textContent = note.title;

        // Dates container
        const datesDiv = document.createElement('div');
        datesDiv.classList.add('note-dates');

        const reminderDate = document.createElement("p");
        reminderDate.classList.add('reminder-date');

        if (note.reminderDate) {
            const reminderTime = new Date(note.reminderDate);
            reminderDate.textContent = "⏰ Reminder: " + formatDate(reminderTime);
            reminderDate.style.color = reminderTime < new Date() ? "red" : "green";
        } else {
            reminderDate.textContent = "⏰"; // bo‘sh joy
            reminderDate.style.visibility = "hidden";
        }

        // Actions
        const noteActions = document.createElement("div");
        noteActions.classList.add('note-actions');

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteNote(note.id);
        }

        const favBtn = document.createElement("button");
        favBtn.classList.add('favorite-btn');
        favBtn.textContent = "♥";
        if (note.favorite) {
            favBtn.classList.add('active');
        } else {
            favBtn.classList.remove('active');
        }
        favBtn.onclick = (e) => {
            e.stopPropagation();
            changeFav(note.id, favBtn);
        }

        datesDiv.appendChild(reminderDate);

        noteActions.appendChild(deleteBtn);
        noteActions.appendChild(favBtn);

        div.appendChild(title);
        div.appendChild(datesDiv);
        div.appendChild(noteActions);

        parent.appendChild(div);
    });
}

function getNote(){
    currentPage = 1;
    getNoteList(true);
}

function deleteNote(noteId) {
    if (!confirm("Are you sure you want to delete this note?")) {
        return;
    }

    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
        alert("Please, login first");
        window.location.href = "./login.html";
    }

    fetch("http://localhost:8080/note/api/v1/delete/" + noteId, {
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
        getNoteList();
    }).catch(error => {
        console.error('Error:', error);
        return null;
    })
}

function changeFav(noteId, favBtn) {
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        alert("Please login again");
        window.location.href = "./login.html";
        return;
    }

    // Toggle favorite state
    const isFavorite = favBtn.classList.contains('active');
    const newFavorite = !isFavorite;

    fetch(`http://localhost:8080/note/api/v1/update/favorite/${noteId}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + jwt,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({favorite: newFavorite})
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                return Promise.reject(res);
            }
        })
        .then(data => {
            // chnaging fav button color
            favBtn.classList.toggle('active', newFavorite);

            // animation of changing favoriteButton
            favBtn.animate([
                {transform: 'scale(1)'},
                {transform: 'scale(1.3)'},
                {transform: 'scale(1)'}
            ], {
                duration: 300,
                easing: 'ease-out'
            });
        })
        .catch(err => {
            console.error(err);
            alert("Failed to update favorite");
        });
}

function updatePagination(){
    const paginationContainer = document.getElementById("paginationSection");

    if (totalPages <= 1) {
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