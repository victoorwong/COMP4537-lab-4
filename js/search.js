const API_URL = "https://walrus-app-2-u9tl4.ondigitalocean.app/api/definitions";

function isValidInput(str) {
    return /^[a-zA-Z\s]+$/.test(str);
}

async function searchWord() {
    const word = document.getElementById("searchWord").value.trim();
    const result = document.getElementById("result");

    if (!word) {
        result.className = "error";
        result.textContent = strings.EMPTY_SEARCH_ERROR;
        return;
    }

    if (!isValidInput(word)) {
        result.className = "error";
        result.textContent = strings.INVALID_WORD_ERROR;
        return;
    }

    try {
        const response = await fetch(`${API_URL}?word=${encodeURIComponent(word)}`);
        const data = await response.json();
        
        result.className = response.ok ? "success" : "error";
        result.textContent = response.ok ? `Definition: ${data.definition}` : data.error;
    } catch (error) {
        result.className = "error";
        result.textContent = strings.SERVER_ERROR;
    }
}
