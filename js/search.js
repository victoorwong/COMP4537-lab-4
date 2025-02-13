// Configuration class to handle API and validation settings
class Config {
    static API_URL = "https://walrus-app-2-u9tl4.ondigitalocean.app/api/definitions";
    static WORD_REGEX = /^[a-zA-Z\s]+$/;
}

// Validator class to handle input validation
class WordValidator {
    static isValid(str) {
        return Config.WORD_REGEX.test(str);
    }

    static isEmpty(str) {
        return !str.trim();
    }
}

// API service class to handle API interactions
class DictionaryAPI {
    static async fetchDefinition(word) {
        const response = await fetch(`${Config.API_URL}?word=${encodeURIComponent(word)}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error);
        }
        
        return data.definition;
    }
}

// UI handler class to manage DOM interactions
class UIHandler {
    constructor() {
        this.searchInput = document.getElementById("searchWord");
        this.resultElement = document.getElementById("result");
    }

    updateResult(message, isError = false) {
        this.resultElement.className = isError ? "error" : "success";
        this.resultElement.textContent = message;
    }

    getSearchWord() {
        return this.searchInput.value.trim();
    }
}

// Main WordSearch class to orchestrate the search process
class WordSearch {
    constructor() {
        this.ui = new UIHandler();
    }

    async search() {
        const word = this.ui.getSearchWord();

        if (WordValidator.isEmpty(word)) {
            this.ui.updateResult(strings.EMPTY_SEARCH_ERROR, true);
            return;
        }

        if (!WordValidator.isValid(word)) {
            this.ui.updateResult(strings.INVALID_WORD_ERROR, true);
            return;
        }

        try {
            const definition = await DictionaryAPI.fetchDefinition(word);
            this.ui.updateResult(`Definition: ${definition}`);
        } catch (error) {
            this.ui.updateResult(strings.SERVER_ERROR, true);
        }
    }
}

// Usage example:
const wordSearch = new WordSearch();
document.getElementById("searchButton").addEventListener("click", () => wordSearch.search());