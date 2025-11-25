document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("createNoteForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        createNote();
    });
});


function createNote(e) {
    e.preventDefault();
    const title = document.getElementById("noteTitle").value;
    const content = document.getElementById("noteContent").value;
    let reminder = document.getElementById("reminderDate").value;
    if (reminder) {
        reminder = reminder + ":00"; // LocalDateTime formatiga moslashtirish
    }

    if (!title || !content) {
        alert("Please enter all inputs");
        return;
    }

    const body = {
        "title": title,
        "content": content
    };

    if (reminder) {
        body.reminderDate = reminder;
    }

    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
        alert("Please, login again")
        window.location.href = './login.html';
        return;
    }

    fetch("http://localhost:8080/note/api/v1/create", {
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
            showPopup(data.message);

            // pop-up message vaqti bilan bir xil timeout buladi va vaqti tugagandan keyin keyingi page ga redirect qilinadi.
            setTimeout(() => {
                window.location.href = './myNotes.html';
            }, 1000);
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}