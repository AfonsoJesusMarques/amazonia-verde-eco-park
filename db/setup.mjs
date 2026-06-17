// Imports the sqlite3 package
import sqlite3 from "sqlite3";

// Opens the database file.
// If the file does not exist, SQLite will create it automatically.
const db = new sqlite3.Database("./database.db");

// This command makes sure foreign keys work in SQLite.
db.run("PRAGMA foreign_keys = ON");

// serialize() makes sure the database commands run in order.
db.serialize(() => {
    // Drops the tables if they already exist.
    // This is useful while developing because it lets us recreate the database.
    db.run("DROP TABLE IF EXISTS contact_messages");
    db.run("DROP TABLE IF EXISTS faqs");
    db.run("DROP TABLE IF EXISTS plants");
    db.run("DROP TABLE IF EXISTS experiences");
    db.run("DROP TABLE IF EXISTS animals");
    db.run("DROP TABLE IF EXISTS habitats");

    // Creates the habitats table.
    db.run(`
        CREATE TABLE habitats (
            habitat_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            short_description TEXT NOT NULL,
            full_description TEXT NOT NULL,
            region_inspiration TEXT NOT NULL,
            image TEXT NOT NULL,
            featured INTEGER NOT NULL DEFAULT 0
        )
    `);

    // Creates the animals table.
    db.run(`
        CREATE TABLE animals (
            animal_id INTEGER PRIMARY KEY AUTOINCREMENT,
            habitat_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            brazilian_name TEXT NOT NULL,
            species TEXT NOT NULL,
            description TEXT NOT NULL,
            fun_fact TEXT NOT NULL,
            image TEXT NOT NULL,
            FOREIGN KEY (habitat_id) REFERENCES habitats(habitat_id)
        )
    `);

    // Creates the experiences table.
    db.run(`
        CREATE TABLE experiences (
            experience_id INTEGER PRIMARY KEY AUTOINCREMENT,
            habitat_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            experience_type TEXT NOT NULL,
            suitable_for TEXT NOT NULL,
            image TEXT NOT NULL,
            FOREIGN KEY (habitat_id) REFERENCES habitats(habitat_id)
        )
    `);

    // Creates the plants table.
    db.run(`
        CREATE TABLE plants (
            plant_id INTEGER PRIMARY KEY AUTOINCREMENT,
            habitat_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            brazilian_name TEXT NOT NULL,
            description TEXT NOT NULL,
            fun_fact TEXT NOT NULL,
            image TEXT NOT NULL,
            FOREIGN KEY (habitat_id) REFERENCES habitats(habitat_id)
        )
    `);

    // Creates the FAQ table.
    db.run(`
        CREATE TABLE faqs (
            faq_id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            category TEXT NOT NULL
        )
    `);

    // Creates the contact messages table.
    db.run(`
        CREATE TABLE contact_messages (
            message_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            submitted_at TEXT NOT NULL
        )
    `);

    // Inserts habitat data.
    db.run(`
        INSERT INTO habitats 
        (name, short_description, full_description, region_inspiration, image, featured)
        VALUES
        (
            'Amazon River Trail',
            'A tropical river habitat inspired by the waterways of the Amazon rainforest.',
            'The Amazon River Trail introduces visitors to tropical river life, floating plants, riverbank animals and the importance of freshwater conservation.',
            'Amazon Rainforest',
            'amazon-river.jpg',
            1
        ),
        (
            'Jaguar Forest',
            'A dense forest habitat focused on jaguars and rainforest conservation.',
            'Jaguar Forest is a shaded trail area designed to teach visitors about one of Brazil’s most iconic predators and the importance of protecting forest ecosystems.',
            'Amazon Rainforest',
            'jaguar-forest.jpg',
            1
        ),
        (
            'Pantanal Wetlands',
            'A wetland-inspired habitat with capybaras, caimans and tropical birds.',
            'Pantanal Wetlands is inspired by one of the world’s largest tropical wetland areas, showing how water, plants and wildlife are connected.',
            'Pantanal',
            'pantanal-wetlands.jpg',
            1
        ),
        (
            'Arara Canopy',
            'A colourful canopy habitat inspired by Brazilian tropical birds.',
            'Arara Canopy celebrates Brazil’s birdlife with elevated walkways, bird viewing areas and educational exhibits about habitat protection.',
            'Brazilian Rainforest Canopy',
            'arara-canopy.jpg',
            1
        ),
        (
            'Cerrado Discovery Zone',
            'A dry tropical habitat inspired by Brazil’s Cerrado biome.',
            'Cerrado Discovery Zone explores a unique Brazilian landscape with adapted plants, open woodland and animals such as the maned wolf and giant anteater.',
            'Cerrado',
            'cerrado-discovery.jpg',
            0
        ),
        (
            'Atlantic Forest Garden',
            'A garden habitat inspired by the biodiversity of the Brazilian Atlantic Forest.',
            'Atlantic Forest Garden focuses on plants, amphibians, butterflies and conservation messages connected to one of Brazil’s most threatened biomes.',
            'Atlantic Forest',
            'atlantic-forest.jpg',
            0
        )
    `);

    // Inserts animal data.
    db.run(`
        INSERT INTO animals
        (habitat_id, name, brazilian_name, species, description, fun_fact, image)
        VALUES
        (
            1,
            'Giant Otter',
            'Ariranha',
            'Pteronura brasiliensis',
            'A social river mammal often found in family groups around freshwater habitats.',
            'Giant otters are known for their loud calls and strong family bonds.',
            'giant-otter.jpg'
        ),
        (
            2,
            'Jaguar',
            'Onça-pintada',
            'Panthera onca',
            'A powerful big cat and an important predator in tropical forest ecosystems.',
            'Jaguars have one of the strongest bites of all big cats.',
            'jaguar.jpg'
        ),
        (
            3,
            'Capybara',
            'Capivara',
            'Hydrochoerus hydrochaeris',
            'The world’s largest rodent, commonly found near rivers and wetlands.',
            'Capybaras are excellent swimmers and can stay underwater for several minutes.',
            'capybara.jpg'
        ),
        (
            3,
            'Caiman',
            'Jacaré',
            'Caimaninae',
            'A reptile commonly associated with wetland and river environments.',
            'Caimans help maintain balance in wetland food chains.',
            'caiman.jpg'
        ),
        (
            4,
            'Blue Macaw',
            'Arara-azul',
            'Anodorhynchus hyacinthinus',
            'A large bright blue parrot often used as a symbol of Brazilian wildlife.',
            'The blue macaw has a very strong beak that can crack hard nuts.',
            'blue-macaw.jpg'
        ),
        (
            4,
            'Toucan',
            'Tucano',
            'Ramphastidae',
            'A tropical bird known for its large colourful beak.',
            'A toucan’s beak helps it reach fruit and regulate body temperature.',
            'toucan.jpg'
        ),
        (
            5,
            'Maned Wolf',
            'Lobo-guará',
            'Chrysocyon brachyurus',
            'A tall, fox-like animal found in open habitats such as the Cerrado.',
            'The maned wolf is known for its long legs and distinctive reddish coat.',
            'maned-wolf.jpg'
        ),
        (
            5,
            'Giant Anteater',
            'Tamanduá-bandeira',
            'Myrmecophaga tridactyla',
            'A unique mammal with a long snout and tongue used to eat ants and termites.',
            'A giant anteater can flick its tongue many times per minute while feeding.',
            'giant-anteater.jpg'
        ),
        (
            6,
            'Poison Dart Frog',
            'Sapo colorido',
            'Dendrobatidae',
            'A small colourful amphibian often associated with tropical forest habitats.',
            'Bright colours can warn predators that an animal may be toxic.',
            'poison-dart-frog.jpg'
        )
    `);

    // Inserts experience data.
    db.run(`
        INSERT INTO experiences
        (habitat_id, name, description, experience_type, suitable_for, image)
        VALUES
        (
            1,
            'River Wildlife Lookout',
            'Visitors can observe river-inspired wildlife displays and learn about freshwater conservation.',
            'Wildlife Exhibit',
            'Families',
            'river-lookout.jpg'
        ),
        (
            1,
            'Victoria Water Lily Discovery',
            'An educational display about giant water lilies and their role in tropical river ecosystems.',
            'Educational Exhibit',
            'All ages',
            'water-lily-discovery.jpg'
        ),
        (
            2,
            'Jaguar Conservation Talk',
            'A short ranger-led talk about jaguar behaviour, habitat loss and conservation work.',
            'Keeper Talk',
            'Older children and adults',
            'jaguar-talk.jpg'
        ),
        (
            3,
            'Pantanal Boardwalk',
            'A raised walkway experience inspired by wetland paths and birdwatching areas.',
            'Adventure Trail',
            'Families',
            'pantanal-boardwalk.jpg'
        ),
        (
            4,
            'Canopy Bird Walk',
            'A colourful canopy trail where visitors learn about tropical birds and forest layers.',
            'Adventure Trail',
            'Families',
            'canopy-bird-walk.jpg'
        ),
        (
            5,
            'Cerrado Survival Challenge',
            'An interactive exhibit explaining how plants and animals survive in dry tropical landscapes.',
            'Interactive Activity',
            'Children',
            'cerrado-challenge.jpg'
        ),
        (
            6,
            'Atlantic Forest Mini Trail',
            'A garden trail focused on small animals, plants, butterflies and forest protection.',
            'Nature Trail',
            'All ages',
            'atlantic-mini-trail.jpg'
        )
    `);

    // Inserts plant data.
    db.run(`
        INSERT INTO plants
        (habitat_id, name, brazilian_name, description, fun_fact, image)
        VALUES
        (
            1,
            'Giant Water Lily',
            'Vitória-régia',
            'A large floating water plant strongly associated with Amazonian river habitats.',
            'Its circular leaves can grow very wide and float on the water surface.',
            'giant-water-lily.jpg'
        ),
        (
            1,
            'Açaí Palm',
            'Açaizeiro',
            'A tropical palm tree commonly linked to Amazonian environments.',
            'Açaí berries are an important food source for people and wildlife.',
            'acai-palm.jpg'
        ),
        (
            4,
            'Brazil Nut Tree',
            'Castanheira-do-pará',
            'A tall rainforest tree that supports wildlife and local communities.',
            'Brazil nut trees depend on healthy forest ecosystems to reproduce successfully.',
            'brazil-nut-tree.jpg'
        ),
        (
            6,
            'Bromeliad',
            'Bromélia',
            'A tropical plant that can hold water between its leaves.',
            'Some small animals use bromeliads as tiny water habitats.',
            'bromeliad.jpg'
        ),
        (
            5,
            'Ipê Tree',
            'Ipê',
            'A colourful flowering tree often associated with Brazilian landscapes.',
            'Ipê trees can produce bright yellow, pink or purple flowers.',
            'ipe-tree.jpg'
        )        ,
        (
            2,
            'Kapok Tree',
            'Sumaúma',
            'A very tall rainforest tree that provides shelter and food for many forest species.',
            'The kapok tree can grow extremely tall and is often called one of the giants of the rainforest.',
            'kapok-tree.jpg'
        ),
        (
            3,
            'Buriti Palm',
            'Buriti',
            'A palm tree often found in wetland and water-rich environments.',
            'Buriti fruit is important for wildlife and is also used by local communities.',
            'buriti-palm.jpg'
        )
    `);

    // Inserts FAQ data.
    db.run(`
        INSERT INTO faqs
        (question, answer, category)
        VALUES
        (
            'What time is the park open?',
            'The park is open every day from 9:00am to 6:00pm.',
            'Opening Times'
        ),
        (
            'Is Amazônia Verde suitable for children?',
            'Yes. The park includes family-friendly trails, educational exhibits and interactive activities for younger visitors.',
            'Visiting'
        ),
        (
            'Does the website include ticket booking?',
            'No. This is a promotional website only and does not include ticketing, prices or booking information.',
            'Website'
        ),
        (
            'Are the habitats based on real Brazilian environments?',
            'The habitats are fictional park areas inspired by Brazilian biomes such as the Amazon Rainforest, Pantanal, Cerrado and Atlantic Forest.',
            'Habitats'
        ),
        (
            'Can visitors learn about conservation?',
            'Yes. The park includes conservation-focused talks, displays and activities about wildlife and habitat protection.',
            'Education'
        )
    `);
});

// Closes the database after the setup has finished.
db.close((error) => {
    if (error) {
        console.error("Error closing the database:", error.message);
    } else {
        console.log("Database setup completed successfully.");
    }
});