document.addEventListener("DOMContentLoaded", function () {
    loadIssuedBooks(); // Load issued books for the logged-in member
});
function goBack() {
    window.location.href = "member-dashboard.html";
}


// **🔹 Load Issued Books for Returning**
function loadIssuedBooks() {
    let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
    let tableBody = document.querySelector("#issued-books-table tbody");
    let memberEmail = localStorage.getItem("loggedInMember");

    tableBody.innerHTML = "";

    let filteredBooks = issuedBooks.filter(book => book.memberEmail === memberEmail);

    if (filteredBooks.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3">No books to return.</td></tr>`;
        return;
    }

    filteredBooks.forEach((entry, index) => {
        let row = `<tr>
            <td>${entry.bookTitle}</td>
            <td>${entry.dueDate}</td>
            <td><button class="return-btn" onclick="returnBook(${index})">Return</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}


// **🔹 Return a Book**
function returnBook(index) {
    let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
    let memberEmail = localStorage.getItem("loggedInMember");

    // Remove the returned book
    issuedBooks = issuedBooks.filter((book, i) => !(i === index && book.memberEmail === memberEmail));

    localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));
    alert("Book returned successfully!");

    loadIssuedBooks(); // Refresh issued books list
}

// **🔹 Logout**
function logout() {
    alert("Logging out...");
    window.location.href = "login.html";
}
