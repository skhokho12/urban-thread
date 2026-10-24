Urban Threads 

A simple multi-page e-commerce demo built with HTML, CSS, Vanilla JavaScript (ES modules), and Firebase. Urban Threads demonstrates a basic online shopping experience, with product listings, user authentication, and a shopping cart.

Features
Product listing powered by Firebase Firestore
User signup and login using Firebase Authentication
Shopping cart functionality
Multiple pages built with HTML, CSS, and Vanilla JavaScript
Sample product data seeded into Firestore

Keep only the features that are implemented and working in your project.

Technologies Used
HTML5 — Page structure
CSS3 — Styling and layout
Vanilla JavaScript — Application logic and ES modules
Firebase Authentication — User authentication
Cloud Firestore — Product data storage
Prerequisites

Before running the project, make sure you have:

Visual Studio Code
The Live Server extension for VS Code
A Firebase project with Authentication and Cloud Firestore configured
Getting Started

live link
https://vusim-urban-thread.netlify.app/shop.html

1. Clone or download the project

Download the repository or clone it using Git:

 git remote add origin https://github.com/skhokho12/urban-thread.git



Alternatively, download the project ZIP and extract it.


Available Pages
File	Description
index.html	Landing page
shop.html	Product listing
login.html	Signup and login
cart.html	Shopping cart (requires login, if enforced by the application)
seed.html	One-time sample product seeder
Project Structure

The main files are organized around HTML pages, JavaScript modules, stylesheets, and Firebase configuration.

text
urban-threads/
├── index.html
├── shop.html
├── login.html
├── cart.html
├── seed.html
├── css/
├── js/
│   ├── firebase-config.js
│   └── seed.js
└── README.md

This project is a demonstration application. Features such as payment processing, order management, and production-grade security should not be assumed to exist unless they have been implemented.

Future Improvements

Possible enhancements include:

Product search and category filtering
Product detail pages
Improved mobile responsiveness
Order history and checkout
Payment integration
Admin product management
License

