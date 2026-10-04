// citation
// Academic Integrity / AI Assistance:
// This code was developed with assistance from Claude AI.
// The code was reviewed, adapted, and tested for this assignment.


//  app.js - the functions for BlueLib Catalogue
//  The data (booksData, categoriesData, loanPeriodDays)
//  comes from data.js, which is loaded first.


/* ---------- 1. Get the elements from the page ---------- */
const bookGrid = document.getElementById("book-grid");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const resultCount = document.getElementById("result-count");
const loanPeriod = document.getElementById("loan-period");
const statTitles = document.getElementById("stat-titles");
const statCopies = document.getElementById("stat-copies");

const addForm = document.getElementById("add-book-form");
const titleInput = document.getElementById("book-title");
const authorInput = document.getElementById("book-author");
const categoryInput = document.getElementById("book-category");
const copiesInput = document.getElementById("book-copies");
const coverInput = document.getElementById("book-cover");
const coverPreview = document.getElementById("cover-preview");
const formMessage = document.getElementById("form-message");
const toast = document.getElementById("toast");
const navLinks = document.querySelectorAll(".nav-link");

/* ---------- 2. Variables ---------- */
const maxImageMB = 20; // biggest image allowed (20 MB)
let uploadedCover = ""; // the picture chosen in the form ("" means no picture)


/* ---------- 3. Make typed text safe ----------
   If someone types HTML tags in the form, this turns them into
   plain text so they cannot break the page. */
function makeSafe(text) {
    text = text.replace(/&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/"/g, "&quot;");
    return text;
}


/* ---------- 4. Notification pop-up ---------- */
function showToast(message, isWarning) {
    toast.textContent = message;

    if (isWarning) {
        toast.className = "toast is-warning";
    } else {
        toast.className = "toast";
    }

    toast.hidden = false;

    // Hide the notification after 3 seconds
    setTimeout(function() {
        toast.hidden = true;
    }, 3000);
}


/* ---------- 5. Fill the category dropdowns ---------- */
function fillCategories() {
    categoriesData.forEach(function(badgeClass, name) {
        const option = '<option value="' + name + '">' + name + "</option>";
        categoryFilter.innerHTML += option; // the dropdown above the books
        categoryInput.innerHTML += option; // the dropdown in the form
    });
}


/* ---------- 6. Build one book card ---------- */
function makeCard(book) {
    // Text and button depend on how many copies are left
    let availableText = book.copies + " copies available";
    let availableClass = "";
    let buttonText = "Borrow Book";
    let disabled = "";

    if (book.copies === 1) {
        availableText = "1 copy available";
    }
    if (book.copies === 0) {
        availableText = "Out of stock";
        availableClass = "is-out";
        buttonText = "Out of stock";
        disabled = "disabled";
    }

    // Add the picture only if the book has one.
    // If the picture file is missing, onerror hides it (the blue title box shows).
    let picture = "";
    if (book.cover !== "") {
        picture = '<img src="' + book.cover + '" alt="Cover of ' + makeSafe(book.title) + '" onerror="this.classList.add(\'hidden\')">';
    }

    // Put the card together piece by piece
    let card = '<article class="book-card">';
    card += '<div class="cover-box"><span>' + makeSafe(book.title) + "</span>" + picture + "</div>";
    card += '<div class="book-body">';
    card += '<div class="book-top">';
    card += '<span class="badge ' + categoriesData.get(book.category) + '">' + book.category + "</span>";
    card += '<span class="book-id">ID #' + book.id + "</span>";
    card += "</div>";
    card += '<h4 class="book-title">' + makeSafe(book.title) + "</h4>";
    card += '<p class="book-author">By ' + makeSafe(book.author) + "</p>";
    card += '<div class="book-footer">';
    card += '<div class="avail">';
    card += '<span class="avail-label">Availability</span>';
    card += '<span class="avail-value ' + availableClass + '">' + availableText + "</span>";
    card += "</div>";
    card += '<button type="button" class="btn btn-primary" onclick="borrowBook(' + book.id + ')" ' + disabled + ">" + buttonText + "</button>";
    card += "</div>";
    card += "</div>";
    card += "</article>";

    return card;
}


/* ---------- 7. Show the books on the page ---------- */
function showBooks() {
    const searchText = searchInput.value.toLowerCase().trim();
    const chosenCategory = categoryFilter.value;

    let allCards = "";
    let count = 0;
    let totalCopies = 0;

    // Go through every book in the Map
    booksData.forEach(function(book) {
        totalCopies = totalCopies + book.copies;

        // Does the book match the search and the category?
        const matchesSearch = book.title.toLowerCase().includes(searchText);
        const matchesCategory = chosenCategory === "all" || book.category === chosenCategory;

        if (matchesSearch && matchesCategory) {
            allCards += makeCard(book);
            count = count + 1;
        }
    });

    // Show the cards and the numbers
    bookGrid.innerHTML = allCards;
    emptyState.hidden = count > 0; // the "no books" message shows only when nothing matches
    resultCount.textContent = "Showing " + count + " of " + booksData.size + " books";
    statTitles.textContent = booksData.size;
    statCopies.textContent = totalCopies;
}


/* ---------- 8. Borrow a book: take away 1 copy ---------- */
function borrowBook(id) {
    const book = booksData.get(id);

    if (book.copies > 0) {
        book.copies = book.copies - 1;
        showBooks(); // draw the cards again with the new number

        if (book.copies === 0) {
            showToast('You borrowed "' + book.title + '". That was the last copy!', true);
        } else {
            showToast('You borrowed "' + book.title + '". Return it within ' + loanPeriodDays + " days.", false);
        }
    }
}


/* ---------- 9. Messages under the form ---------- */
function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "form-message is-" + type; // is-error or is-success
    formMessage.hidden = false;
}

function clearMessage() {
    formMessage.hidden = true;

    // Take the red border off every field
    titleInput.classList.remove("has-error");
    authorInput.classList.remove("has-error");
    categoryInput.classList.remove("has-error");
    copiesInput.classList.remove("has-error");
    coverInput.classList.remove("has-error");
}


/* ---------- 10. Picture upload ---------- */
function clearCover() {
    uploadedCover = "";
    coverInput.value = "";
    coverPreview.innerHTML = "";
    coverPreview.hidden = true;
}

function coverChosen() {
    clearMessage();
    const file = coverInput.files[0];

    // Nothing chosen
    if (!file) {
        clearCover();
        return;
    }

    // The file must be a picture
    if (file.type.indexOf("image/") !== 0) {
        clearCover();
        coverInput.classList.add("has-error");
        showMessage("Please choose an image file (PNG, JPG, WEBP or GIF).", "error");
        return;
    }

    // The picture must not be bigger than 20 MB
    if (file.size > maxImageMB * 1024 * 1024) {
        clearCover();
        coverInput.classList.add("has-error");
        showMessage("The image is too big. Please choose one under " + maxImageMB + " MB.", "error");
        return;
    }

    // Make a temporary link to the picture so the browser can show it
    uploadedCover = URL.createObjectURL(file);

    // Show a small preview with a Remove button
    let preview = '<img src="' + uploadedCover + '" alt="Preview of the chosen cover">';
    preview += '<div class="cover-preview-info">';
    preview += "<span>" + makeSafe(file.name) + "</span>";
    preview += '<button type="button" class="btn btn-light" onclick="clearCover()">Remove image</button>';
    preview += "</div>";

    coverPreview.innerHTML = preview;
    coverPreview.hidden = false;
}


/* ---------- 11. Add a new book ---------- */
function addBook(event) {
    event.preventDefault(); // stop the page from reloading
    clearMessage();

    // Check each field. Every problem is added to the errors list.
    const errors = [];
    const copies = Number(copiesInput.value);

    if (titleInput.value.trim() === "") {
        errors.push("Book title is required.");
        titleInput.classList.add("has-error");
    }
    if (authorInput.value.trim() === "") {
        errors.push("Author is required.");
        authorInput.classList.add("has-error");
    }
    if (categoryInput.value === "") {
        errors.push("Please select a category.");
        categoryInput.classList.add("has-error");
    }
    if (copiesInput.value.trim() === "") {
        errors.push("Copies available is required.");
        copiesInput.classList.add("has-error");
    } else if (!Number.isInteger(copies) || copies < 0) {
        errors.push("Copies must be a whole number of 0 or more.");
        copiesInput.classList.add("has-error");
    }

    // If there are problems, show them and stop
    if (errors.length > 0) {
        showMessage(errors.join(" "), "error");
        return;
    }

    // No problems, so add the new book to the Map
    const newId = booksData.size + 1;
    const newTitle = titleInput.value.trim();

    booksData.set(newId, {
        id: newId,
        title: newTitle,
        author: authorInput.value.trim(),
        category: categoryInput.value,
        copies: copies,
        cover: uploadedCover
    });

    // Empty the form and show the updated list
    addForm.reset();
    clearCover();
    searchInput.value = "";
    categoryFilter.value = "all";
    showBooks();

    showMessage('"' + newTitle + '" was added to the catalogue (ID #' + newId + ").", "success");
    showToast('"' + newTitle + '" was added to the catalogue.', false);
}


/* ---------- 12. Reset Form button ---------- */
function resetForm() {
    clearCover();
    clearMessage();
}


/* ---------- 13. Menu: highlight the link that was clicked ---------- */
function menuClicked() {
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove("is-active");
    }
    this.classList.add("is-active");
}


/* ---------- 14. Connect the page to the functions and start ---------- */
searchInput.addEventListener("input", showBooks); // search while typing
categoryFilter.addEventListener("change", showBooks); // filter by category
coverInput.addEventListener("change", coverChosen); // picture chosen
addForm.addEventListener("submit", addBook); // Add Book button
addForm.addEventListener("reset", resetForm); // Reset Form button

for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", menuClicked);
}

loanPeriod.textContent = "Standard Loan Period: " + loanPeriodDays + " Days";
fillCategories();
showBooks();