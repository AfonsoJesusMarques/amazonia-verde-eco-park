// Gets the search input from the page
const searchInput = document.getElementById("searchInput");

// Gets the area where search results will be displayed
const searchResults = document.getElementById("searchResults");

// Only runs this code if the search page elements exist
if (searchInput && searchResults) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();

        if (query.length < 2) {
            searchResults.innerHTML = "<p>Please type at least two characters to search.</p>";
            return;
        }

        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then((response) => response.json())
            .then((results) => {
                searchResults.innerHTML = "";

                if (results.length === 0) {
                    searchResults.innerHTML = "<p>No results found. Try another word.</p>";
                    return;
                }

                results.forEach((result) => {
                    const article = document.createElement("article");
                    article.className = "card search-result-card";

                    article.innerHTML = `
                        <p class="result-type">${result.result_type}</p>
                        <h2>${result.name}</h2>
                        <p>${result.description}</p>
                        <a href="${result.link}" class="button">View More</a>
                    `;

                    searchResults.appendChild(article);
                });
            })
            .catch((error) => {
                console.error("Search error:", error);
                searchResults.innerHTML = "<p>There was a problem loading the search results.</p>";
            });
    });
}