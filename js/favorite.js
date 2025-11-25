let currentPage = 1;
let pageSize = 5;
let totalPages = 1;
document.addEventListener("DOMContentLoaded", () => {
    getFavoriteNotes();

    document.getElementById("prevPageBtn").addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            getFavoriteNotes();
        }
    });

    document.getElementById("nextPageBtn").addEventListener("click", function () {
        if (currentPage < totalPages) {
            currentPage++;
            getFavoriteNotes();
        }
    });
});

function getFavoriteNotes() {
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        alert("Please login again")
        window.location.href = "./login.html";
    }

    fetch("http://localhost:8080/note/api/v1/favourites?page=" + currentPage + "&size=" + pageSize, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jwt,
            'Content-Type': 'application/json'
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
            showFavorites(data.content);

            totalPages = data.totalPages;

            updatePagination();
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

function showFavorites(data) {
    const parent = document.getElementById('noteCard-container-id');
    parent.innerHTML = '';

    if (!data || data.length === 0) {
        parent.innerHTML = '<p>No favorite notes found.</p>';
        return;
    }

    data.forEach(note => {
        // Asosiy card div
        const card = document.createElement('div');
        card.classList.add('note-card');

        // Header (title + date)
        const header = document.createElement('div');
        header.classList.add('note-header');

        const title = document.createElement('h3');
        title.classList.add('note-title');
        title.textContent = note.title;

        const createdDate = document.createElement('p');
        createdDate.classList.add('note-date');
        createdDate.textContent = formatDate(note.createdDate);

        header.appendChild(title);
        header.appendChild(createdDate);

        // Content
        const content = document.createElement('p');
        content.classList.add('note-content');
        content.textContent = note.content;

        // Actions
        const actions = document.createElement('div');
        actions.classList.add('actions');

        const viewBtn = document.createElement('button');
        viewBtn.classList.add('view-btn');
        viewBtn.textContent = 'View Details';
        viewBtn.onclick = (e) => {
            if (e.target.tagName === 'Button') return;
            window.location.href = "./note-detail.html?id=" + note.id;
        }

        const favBtn = document.createElement('button');
        favBtn.classList.add('favorite-btn');
        favBtn.textContent = '♥';
        if (note.favorite) {
            favBtn.classList.add('active');
        }

        favBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation(); // note divga click utmedi
            changeFav(note.id, favBtn);
        };

        actions.appendChild(viewBtn);
        actions.appendChild(favBtn);

        // Hammasini card ichida
        card.appendChild(header);
        card.appendChild(content);
        card.appendChild(actions);

        // Parentga qo‘shamiz
        parent.appendChild(card);
    });
}

function changeFav(noteId, favBtn1) {
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
        alert("Please login again");
        window.location.href = "./login.html";
        return;
    }

    // Toggle favorite state (agar frontendda note object bo‘lsa uni ham o‘zgartirish mumkin)
    const isFavorite = favBtn1.classList.contains('active'); // hozir favorite bo‘lsa
    const newFavorite = !isFavorite; // backendga yuboriladigan yangi qiymat

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
            // Tugma rangini yangilash
            favBtn1.classList.toggle('active', newFavorite);

            // animation of changing favoriteButton
            favBtn1.animate([
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

function updatePagination() {
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
