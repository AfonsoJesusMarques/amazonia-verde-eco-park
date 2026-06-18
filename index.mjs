// Imports the Express framework
import express from "express";
import sqlite3 from "sqlite3";

// Creates the Express application
const app = express();

// Sets the port number required by the assessment brief
const PORT = 5000;

const db = new sqlite3.Database("./database.db");

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
    const sql = "SELECT * FROM habitats ORDER BY name";

    db.all(sql, [], (error, habitats) => {
        if (error) {
            console.error("Error loading habitats:", error.message);
            res.status(500).send("An error occurred while loading habitats.");
            return;
        }

        res.render("pages/habitats", {
            pageTitle: "Habitats",
            habitats: habitats
        });
    });
});

// Individual habitat details page route
app.get("/habitats/:id", (req, res) => {
    // Gets the habitat id from the URL
    const habitatId = req.params.id;

    // SQL query to get the selected habitat
    const habitatSql = "SELECT * FROM habitats WHERE habitat_id = ?";

    // SQL query to get animals linked to the selected habitat
    const animalsSql = "SELECT * FROM animals WHERE habitat_id = ? ORDER BY name";

    // SQL query to get experiences linked to the selected habitat
    const experiencesSql = "SELECT * FROM experiences WHERE habitat_id = ? ORDER BY name";

    // SQL query to get plants linked to the selected habitat
    const plantsSql = "SELECT * FROM plants WHERE habitat_id = ? ORDER BY name";

    db.get(habitatSql, [habitatId], (habitatError, habitat) => {
        if (habitatError) {
            console.error("Error loading habitat:", habitatError.message);
            res.status(500).send("An error occurred while loading the habitat.");
            return;
        }

        if (!habitat) {
            res.status(404).send("Habitat not found.");
            return;
        }

        db.all(animalsSql, [habitatId], (animalsError, animals) => {
            if (animalsError) {
                console.error("Error loading animals:", animalsError.message);
                res.status(500).send("An error occurred while loading animals.");
                return;
            }

            db.all(experiencesSql, [habitatId], (experiencesError, experiences) => {
                if (experiencesError) {
                    console.error("Error loading experiences:", experiencesError.message);
                    res.status(500).send("An error occurred while loading experiences.");
                    return;
                }

                db.all(plantsSql, [habitatId], (plantsError, plants) => {
                    if (plantsError) {
                        console.error("Error loading plants:", plantsError.message);
                        res.status(500).send("An error occurred while loading plants.");
                        return;
                    }

                    res.render("pages/habitat-details", {
                        pageTitle: habitat.name,
                        habitat: habitat,
                        animals: animals,
                        experiences: experiences,
                        plants: plants
                    });
                });
            });
        });
    });
});

// Experiences page route
app.get("/experiences", (req, res) => {
    const sql = `
        SELECT 
            experiences.experience_id,
            experiences.name,
            experiences.description,
            experiences.experience_type,
            experiences.suitable_for,
            experiences.image,
            habitats.habitat_id,
            habitats.name AS habitat_name
        FROM experiences
        INNER JOIN habitats
            ON experiences.habitat_id = habitats.habitat_id
        ORDER BY experiences.name
    `;

    db.all(sql, [], (error, experiences) => {
        if (error) {
            console.error("Error loading experiences:", error.message);
            res.status(500).send("An error occurred while loading experiences.");
            return;
        }

        res.render("pages/experiences", {
            pageTitle: "Experiences",
            experiences: experiences
        });
    });
});

// FAQ page route
app.get("/faq", (req, res) => {
    const sql = "SELECT * FROM faqs ORDER BY category, faq_id";

    db.all(sql, [], (error, faqs) => {
        if (error) {
            console.error("Error loading FAQs:", error.message);
            res.status(500).send("An error occurred while loading FAQs.");
            return;
        }

        res.render("pages/faq", {
            pageTitle: "FAQ",
            faqs: faqs
        });
    });
});

// Contact page route
app.get("/contact", (req, res) => {
    res.render("pages/contact", {
        pageTitle: "Contact Us",
        successMessage: null,
        errorMessage: null
    });
});

// Contact form submission route
app.post("/contact", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const submittedAt = new Date().toISOString();

    if (!name || !email || !subject || !message) {
        res.render("pages/contact", {
            pageTitle: "Contact Us",
            successMessage: null,
            errorMessage: "Please complete all fields before submitting the form."
        });
        return;
    }

    const sql = `
        INSERT INTO contact_messages
        (name, email, subject, message, submitted_at)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [name, email, subject, message, submittedAt], (error) => {
        if (error) {
            console.error("Error saving contact message:", error.message);

            res.render("pages/contact", {
                pageTitle: "Contact Us",
                successMessage: null,
                errorMessage: "There was a problem sending your message. Please try again."
            });
            return;
        }

        res.render("pages/contact", {
            pageTitle: "Contact Us",
            successMessage: "Thank you. Your message has been sent successfully.",
            errorMessage: null
        });
    });
});

// Search page route
app.get("/search", (req, res) => {
    res.render("pages/search", {
        pageTitle: "Wildlife Search"
    });
});

// AJAX search API route
app.get("/api/search", (req, res) => {
    const searchTerm = req.query.q;

    if (!searchTerm) {
        res.json([]);
        return;
    }

    const searchValue = `%${searchTerm}%`;

    const sql = `
        SELECT 
            'Habitat' AS result_type,
            habitat_id AS id,
            name,
            short_description AS description,
            '/habitats/' || habitat_id AS link
        FROM habitats
        WHERE name LIKE ? OR short_description LIKE ? OR region_inspiration LIKE ?

        UNION ALL

        SELECT
            'Animal' AS result_type,
            animal_id AS id,
            name,
            description,
            '/habitats/' || habitat_id AS link
        FROM animals
        WHERE name LIKE ? OR brazilian_name LIKE ? OR description LIKE ? OR fun_fact LIKE ?

        UNION ALL

        SELECT
            'Experience' AS result_type,
            experience_id AS id,
            name,
            description,
            '/habitats/' || habitat_id AS link
        FROM experiences
        WHERE name LIKE ? OR description LIKE ? OR experience_type LIKE ? OR suitable_for LIKE ?

        ORDER BY result_type, name
    `;

    db.all(
        sql,
        [
            searchValue, searchValue, searchValue,
            searchValue, searchValue, searchValue, searchValue,
            searchValue, searchValue, searchValue, searchValue
        ],
        (error, results) => {
            if (error) {
                console.error("Error running search:", error.message);
                res.status(500).json({ error: "Search failed." });
                return;
            }

            res.json(results);
        }
    );
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