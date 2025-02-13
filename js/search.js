class Config {
    static API_URL = "https://walrus-app-2-u9tl4.ondigitalocean.app/api/definitions";
    static WORD_REGEX = /^[a-zA-Z\s]+$/;
}

class WordValidator {
    static isValid(str) {
        return Config.WORD_REGEX.test(str);
    }

    static isEmpty(str) {
        return !str.trim();
    }
}

class Dictionary {
    static async getDefinition(word) {
        const response = await fetch(`${Config.API_URL}?word=${encodeURIComponent(word)}`);
        const data = await response.json();

        if (!response.ok) { 
            throw new Error(data.error);
        }

        return data.definition;
    }
}

class UI {
    constructor() {
        this.searchInput = document.getElementById("searchWord");
        this.resultElement = document.getElementById("result");
    }

    updateResult(message, isError = false) {
        this.resultElement.className = isError ? strings.ERROR : strings.SUCCESS;
        this.resultElement.textContent = message;
    }

    getSearchWord() {
        return this.searchInput.value.trim();
    }
}

class WordSearch {
    constructor() {
        this.ui = new UI();
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
            const definition = await Dictionary.getDefinition(word);
            this.ui.updateResult(`Definition: ${definition}`);
        } catch (error) {
            this.ui.updateResult(strings.SERVER_ERROR, true);
        }
    }
}

const wordSearch = new WordSearch();
document.getElementById("searchButton").addEventListener("click", () => wordSearch.search());