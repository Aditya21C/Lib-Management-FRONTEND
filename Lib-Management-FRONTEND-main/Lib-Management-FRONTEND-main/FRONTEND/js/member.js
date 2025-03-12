document.addEventListener("DOMContentLoaded", function () {
    initializeBooks(); // Ensure books exist
    loadAvailableBooks();
    loadIssuedBooks();
});
// **🔹 Search and Filter Books**
function filterBooks(inputId, tableId) {
    let input = document.getElementById(inputId).value.toLowerCase();
    let table = document.getElementById(tableId);
    let rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        let columns = rows[i].getElementsByTagName("td");
        let title = columns[0].textContent.toLowerCase();
        let author = columns[1].textContent.toLowerCase();
        
        if (title.includes(input) || author.includes(input)) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}


// **🔹 Ensure Books Exist in LocalStorage**
function initializeBooks() {
    let books = JSON.parse(localStorage.getItem("books"));

    if (!books || books.length === 0) {
        books = [
            { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
            { title: "1984", author: "George Orwell" },
            { title: "To Kill a Mockingbird", author: "Harper Lee" },
            { title: "The Catcher in the Rye", author: "J.D. Salinger" },
            { title: "Moby-Dick", author: "Herman Melville" }
        ];

        localStorage.setItem("books", JSON.stringify(books));
    }
}

// **🔹 Load Available Books**
function loadAvailableBooks() {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
    let tableBody = document.querySelector("#available-books-table tbody");
    tableBody.innerHTML = "";

    books.forEach((book, index) => {
        let isIssued = issuedBooks.some(issued => issued.bookTitle === book.title);
        let status = isIssued ? "Issued" : "Available";
        let statusClass = isIssued ? "status-issued" : "status-available";
        let issueButton = isIssued ? `<button class="disabled-btn" disabled>Issued</button>` : `<button onclick="issueBook(${index})">Issue</button>`;

        let row = `<tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td class="${statusClass}">${status}</td>
            <td>${issueButton}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}


// **🔹 Issue Book**
// **🔹 Issue a Book & Update Availability Status**
function issueBook(index) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
    let memberEmail = localStorage.getItem("loggedInMember");

    if (!memberEmail) {
        alert("You must be logged in to issue books!");
        return;
    }

    let selectedBook = books[index];

    // Check if the book is already issued
    let alreadyIssued = issuedBooks.some(book => book.bookTitle === selectedBook.title);
    if (alreadyIssued) {
        alert("This book is already issued to another member.");
        return;
    }

    let dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // Set due date 14 days from today

    // Add the book to issuedBooks list
    issuedBooks.push({
        bookTitle: selectedBook.title,
        memberEmail: memberEmail,
        dueDate: dueDate.toISOString().split("T")[0] // Format: YYYY-MM-DD
    });

    localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));
    alert("Book issued successfully!");

    // 🔹 Update UI immediately
    loadAvailableBooks();
    loadIssuedBooks();  // 🔹 Now updates the Issued Books section
    loadMemberDashboardStats();
    loadAdminDashboardStats();
}




// **🔹 Load Issued Books for Member**
function loadIssuedBooks() {
    let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
    let memberEmail = localStorage.getItem("loggedInMember");
    let tableBody = document.querySelector("#issued-books-table tbody");

    tableBody.innerHTML = "";

    let memberIssuedBooks = issuedBooks.filter(book => book.memberEmail === memberEmail);

    if (memberIssuedBooks.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="2">No books issued.</td></tr>`;
        return;
    }

    memberIssuedBooks.forEach((entry) => {
        let row = `<tr>
            <td>${entry.bookTitle}</td>
            <td>${entry.dueDate}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// **🔹 Load Member Dashboard Stats**
function loadMemberDashboardStats() {
    let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
    let memberEmail = localStorage.getItem("loggedInMember");

    let booksIssuedToMember = issuedBooks.filter(book => book.memberEmail === memberEmail).length;

    document.getElementById("member-issued-books").textContent = booksIssuedToMember; // 🔹 Updates dynamically
}


// **🔹 Call the function when the page loads**
document.addEventListener("DOMContentLoaded", loadMemberDashboardStats);


// **🔹 Logout**
function logout() {
    alert("Logging out...");
    window.location.href = "login.html";
}
