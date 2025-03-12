document.addEventListener("DOMContentLoaded", function () {
    loadBooks();
    loadIssuedBooks(); // Load issued books in staff Dashboard
    loadstaffDashboardStats(); // Load dashboard stats
});

// **🔹 Search and Filter Books**
function filterBooks(inputId, tableId) {
    let input = document.getElementById(inputId).value.toLowerCase();
    let table = document.getElementById(tableId);
    let rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) { // Skip the header row
        let columns = rows[i].getElementsByTagName("td");
        if (columns.length < 2) continue; // Ensure the row has title & author columns

        let title = columns[0].textContent.toLowerCase();
        let author = columns[1].textContent.toLowerCase();

        if (title.includes(input) || author.includes(input)) {
            rows[i].style.display = ""; // Show matching rows
        } else {
            rows[i].style.display = "none"; // Hide non-matching rows
        }
    }
}

// **🔹 Load Books**
function loadBooks() {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
    let tableBody = document.querySelector("#book-table tbody");
    tableBody.innerHTML = "";

    books.forEach((book, index) => {
        let isIssued = issuedBooks.some(issued => issued.bookTitle === book.title);
        let status = isIssued ? "Issued" : "Available";
        let statusClass = isIssued ? "status-issued" : "status-available";

        let row = `<tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td class="${statusClass}">${status}</td>
            <td><button class="delete-btn" onclick="deleteBook(${index})">Delete</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// **🔹 Delete Book**
function deleteBook(index) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
}

// **🔹 Load Issued Books**
function loadIssuedBooks() {
    let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
    let tableBody = document.querySelector("#issued-books-table tbody");
    tableBody.innerHTML = "";

    if (issuedBooks.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4">No books issued.</td></tr>`;
        return;
    }

    issuedBooks.forEach((entry, index) => {
        let row = `<tr>
            <td>${entry.bookTitle}</td>
            <td>${entry.memberEmail}</td>
            <td>${entry.dueDate}</td>
            <td><button class="return-btn" onclick="staffReturnBook(${index})">Mark as Returned</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// **🔹 Load Dashboard Summary (Total Books, Members, Issued Books)**
function loadstaffDashboardStats() {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let members = JSON.parse(localStorage.getItem("members")) || [];
    let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];

    document.getElementById("total-books").textContent = books.length;
    document.getElementById("total-members").textContent = members.length;
    document.getElementById("total-issued").textContent = issuedBooks.length; // 🔹 Updates dynamically
}

// **🔹 Mark Book as Returned**
function staffReturnBook(index) {
    let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];

    let returnedBook = issuedBooks.splice(index, 1)[0]; // Remove the book from issued list
    localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));

    alert(`"${returnedBook.bookTitle}" has been marked as returned.`);

    // Update UI
    loadIssuedBooks();
    loadBooks();
    loadstaffDashboardStats();  // 🔹 Update staff stats
}

// **🔹 Logout**
function logout() {
    alert("Logging out...");
    window.location.href = "login.html";
}