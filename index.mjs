// Imports the Express framework
import express from "express";

// Creates the Express application
const app = express();

// Sets the port number required by the assessment brief
const PORT = 5000;

// Sets EJS as the view engine
app.set("view engine", "ejs");

// Tells Express where the views folder is
app.set("views", "./views");

// Allows Express to use files from the public folder
app.use(express.static("public"));

// Allows Express to read form data sent by POST requests
app.use(express.urlencoded({ extended: true }));

// Home page route
app.get("/", (req, res) => {
    res.render("pages/home", {
        pageTitle: "Amazônia Verde Eco Adventure Park"
    });
});

// Habitats page route
app.get("/habitats", (req, res) => {
    res.render("pages/habitats", {
        pageTitle: "Habitats"
    });
});

// Experiences page route
app.get("/experiences", (req, res) => {
    res.render("pages/experiences", {
        pageTitle: "Experiences"
    });
});

// FAQ page route
app.get("/faq", (req, res) => {
    res.render("pages/faq", {
        pageTitle: "FAQ"
    });
});

// Contact page route
app.get("/contact", (req, res) => {
    res.render("pages/contact", {
        pageTitle: "Contact Us"
    });
});

// Search page route
app.get("/search", (req, res) => {
    res.render("pages/search", {
        pageTitle: "Wildlife Search"
    });
});

// Activity page route
app.get("/activity", (req, res) => {
    res.render("pages/activity", {
        pageTitle: "Brazilian Wildlife Match"
    });
});

// Starts the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});