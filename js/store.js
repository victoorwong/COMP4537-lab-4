const API_URL = "https://walrus-app-2-u9tl4.ondigitalocean.app/api/definitions";

function isValidInput(str) {
    return /^[a-zA-Z\s]+$/.test(str);
}

async function submitWord() {
    const word = document.getElementById("word").value.trim();
    const definition = document.getElementById("definition").value.trim();
    const feedback = document.getElementById("feedback");

    if (!word || !definition) {
        feedback.className = "error";
        feedback.textContent = strings.EMPTY_FIELDS_ERROR;
        return;
    }

    if (!isValidInput(word) || !isValidInput(definition)) {
        feedback.className = "error";
        feedback.textContent = strings.INVALID_WORD_ERROR;
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ word, definition })
        });

        const data = await response.json();
        
        if (response.ok) {
            feedback.className = "success";
            feedback.textContent = `Request #${data.request}: ${data.message}\nWord: ${data.word}\nDefinition: ${data.definition}\nTotal Words: ${data.totalWords}`;
        } else {
            feedback.className = "error";
            feedback.textContent = data.error || data.message;
        }
    } catch (error) {
        feedback.className = "error";
        feedback.textContent = strings.SERVER_ERROR;
    }
}
