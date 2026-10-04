// citation
// Academic Integrity / AI Assistance:
// This code was developed with assistance from Claude AI.
// The code was reviewed, adapted, and tested for this assignment.


//  data.js - the data for BlueLib Catalogue
//  The data is stored in Maps. A Map is a list where every item
//  has a key (like an ID) and a value (the details).
//  Example: booksData.get(1) gives the details of book number 1.
//  This file must be loaded BEFORE app.js.


/* Categories: category name -> CSS class used for its coloured badge */
const categoriesData = new Map([
    ["IT", "badge-it"],
    ["Business", "badge-business"],
    ["Science", "badge-science"],
    ["Arts", "badge-arts"]
]);

/* Books: book ID -> book details.
   cover = the picture file inside the assets folder
   (if the file is missing, the blue title box is shown instead) */
const booksData = new Map([
    [1, {
        id: 1,
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        category: "IT",
        copies: 5,
        cover: "assets/1.jpeg"
    }],
    [2, {
        id: 2,
        title: "Principles of Corporate Finance",
        author: "Richard A. Brealey",
        category: "Business",
        copies: 2,
        cover: "assets/2.jpeg"
    }],
    [3, {
        id: 3,
        title: "Astrophysics for People in a Hurry",
        author: "Neil deGrasse Tyson",
        category: "Science",
        copies: 4,
        cover: "assets/3.jpeg"
    }],
    [4, {
        id: 4,
        title: "The Design of Everyday Things",
        author: "Don Norman",
        category: "Arts",
        copies: 0,
        cover: "assets/4.jpeg"
    }],
    [5, {
        id: 5,
        title: "Introduction to Algorithms (CLRS)",
        author: "Thomas H. Cormen",
        category: "IT",
        copies: 7,
        cover: "assets/5.jpeg"
    }],
    [6, {
        id: 6,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        category: "Business",
        copies: 3,
        cover: "assets/6.jpeg"
    }]
]);

/* How many days a book can be borrowed */
const loanPeriodDays = 14;