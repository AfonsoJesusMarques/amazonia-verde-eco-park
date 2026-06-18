// Gets the button used to request a random wildlife fact
const factButton = document.getElementById("factButton");

// Gets the area where the fact will be displayed
const factResult = document.getElementById("factResult");

// Only runs this code if the fact button exists on the current page
if (factButton && factResult) {
    factButton.addEventListener("click", () => {
        factResult.innerHTML = "<p>Loading wildlife fact...</p>";

        fetch("/api/random-fact")
            .then((response) => response.json())
            .then((fact) => {
                factResult.innerHTML = `
                    <article class="card">
                        <h3>${fact.name}</h3>
                        <p><strong>Brazilian name:</strong> ${fact.brazilian_name}</p>
                        <p><strong>Habitat:</strong> ${fact.habitat_name}</p>
                        <p><strong>Fun fact:</strong> ${fact.fun_fact}</p>
                    </article>
                `;
            })
            .catch((error) => {
                console.error("Random fact error:", error);
                factResult.innerHTML = "<p>There was a problem loading the wildlife fact.</p>";
            });
    });
}