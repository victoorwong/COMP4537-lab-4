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

    static areFieldsValid(word, definition) {
        return !this.isEmpty(word) && 
               !this.isEmpty(definition) && 
               this.isValid(word) && 
               this.isValid(definition);
    }
}

// API service class to handle API interactions
class DictionaryAPI {
    static async submitDefinition(word, definition) {
        const response = await fetch(Config.API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ word, definition })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || data.message);
        }
        
        return data;
    }
}

// UI handler class to manage DOM interactions
class UIHandler {
    constructor() {
        this.wordInput = document.getElementById("word");
        this.definitionInput = document.getElementById("definition");
        this.feedbackElement = document.getElementById("feedback");
    }

    getInputValues() {
        return {
            word: this.wordInput.value.trim(),
            definition: this.definitionInput.value.trim()
        };
    }

    clearInputs() {
        this.wordInput.value = "";
        this.definitionInput.value = "";
    }

    showError(message) {
        this.feedbackElement.className = "error";
        this.feedbackElement.textContent = message;
    }

    showSuccess(data) {
        this.feedbackElement.className = "success";
        this.feedbackElement.textContent = 
            `Request #${data.request} - \n` +
            `Word: ${data.word}\n` +
            `Definition: ${data.definition}\n` +
            `Total Words: ${data.totalWords}`;
    }
}

// Main WordSubmission class to orchestrate the submission process
class WordSubmission {
    constructor() {
        this.ui = new UIHandler();
    }

    async submit() {
        const { word, definition } = this.ui.getInputValues();

        if (!WordValidator.areFieldsValid(word, definition)) {
            this.ui.showError(
                WordValidator.isEmpty(word) || WordValidator.isEmpty(definition)
                    ? strings.EMPTY_FIELDS_ERROR
                    : strings.INVALID_WORD_ERROR
            );
            return;
        }

        try {
            const response = await DictionaryAPI.submitDefinition(word, definition);
            this.ui.showSuccess(response);
            this.ui.clearInputs();
        } catch (error) {
            this.ui.showError(strings.SERVER_ERROR);
        }
    }
}

// Usage example:
const wordSubmission = new WordSubmission();
document.getElementById("submitButton").addEventListener("click", () => wordSubmission.submit());