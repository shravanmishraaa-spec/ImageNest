const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const status = document.getElementById("status");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = input.value.trim();

    // Ignore empty searches
    if (query === "") {
        return;
    }

    const url =
        `https://commons.wikimedia.org/w/api.php?` +
        `action=query&generator=search&gsrsearch=${encodeURIComponent(query)}` +
        `&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata` +
        `&iiurlwidth=500&format=json&origin=*`;

    const response = await fetch(url);

    // Check if the request was successful
    if (!response.ok) {
        return;
    }

    const data = await response.json();

    // Clear old results
    results.innerHTML = "";

    const pages = data.query?.pages || {};
    const items = Object.values(pages);

    // Enhancement: show result count
    status.textContent = `Showing ${items.length} results for "${query}"`;

    // Create a card for every result
    items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "image-card";

        const image = document.createElement("img");
        image.src =
            item.imageinfo?.[0]?.thumburl ||
            item.imageinfo?.[0]?.url;

        image.alt = item.title.replace("File:", "");

        const title = document.createElement("h3");
        title.textContent = item.title.replace("File:", "");

        card.appendChild(image);
        card.appendChild(title);

        results.appendChild(card);
    });
});