// === Search Functionality ===
const searchInput = document.getElementById('searchInput');
const searchBtn = document.querySelector('.search-btn');

// Check if input is a URL or a search query
function isURL(str) {
    // Matches domains like "example.com", "www.example.com", or full URLs
    return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(str) ||
           /^https?:\/\//i.test(str);
}

function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    let url;
    if (isURL(query)) {
        url = query.startsWith('http') ? query : 'https://' + query;
    } else {
        url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
    }

    uvFrame.style.display = 'block';
    uvFrame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
}   

// Event listeners
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performSearch();
});

// Focus search bar on page load (like real Google)
searchInput.focus();

// === Quick Shortcuts (persistent) ===
const shortcutsContainer = document.querySelector('.shortcuts');
const SHORTCUTS_KEY = 'newtab_shortcuts';

function getShortcuts() {
    return JSON.parse(localStorage.getItem(SHORTCUTS_KEY) || '[]');
}

function saveShortcuts(shortcuts) {
    localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(shortcuts));
}

function renderShortcuts() {
    const shortcuts = getShortcuts();
    