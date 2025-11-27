import APIConfig from "./APIConfig.js";

window.createNote = createNote;
function createNote(e) {
    e.preventDefault();
    const title = document.getElementById("noteTitle").value;
    const content = document.getElementById("noteContent").value;
    let reminder = document.getElementById("reminderDate").value;
    if (reminder) {
        reminder = reminder + ":00"; // format to LocalDateTime
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

    fetch(APIConfig.API + "/note/create", {
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