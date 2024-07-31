document.addEventListener('DOMContentLoaded', () => {
    const quotesKey = 'quotes';
    const lastQuoteKey = 'lastQuote';
    let quotes = JSON.parse(localStorage.getItem(quotesKey)) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Reflection" },
        { text: "The purpose of our lives is to be happy.", category: "Happiness" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuote');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const importFileInput = document.getElementById('importFile');
    const exportButton = document.getElementById('exportQuotes');

    // Function to display a random quote
    const showRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];

        // Clear existing quote
        quoteDisplay.innerHTML = '';
        
        // Create elements
        const quoteText = document.createElement('p');
        quoteText.textContent = quote.text;
        
        const quoteCategory = document.createElement('small');
        quoteCategory.textContent = quote.category;
        
        // Append elements to the display div
        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);

        // Save last viewed quote to session storage
        sessionStorage.setItem(lastQuoteKey, JSON.stringify(quote));
    };

    // Function to add a new quote to the quotes array and update the DOM
    const createAddQuoteForm = () => {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();
        if (text && category) {
            quotes.push({ text, category });
            newQuoteText.value = '';
            newQuoteCategory.value = '';
            saveQuotes();
            alert('Quote added successfully!');
        } else {
            alert('Please enter both a quote and a category.');
        }
    };

    // Function to save quotes to local storage
    const saveQuotes = () => {
        localStorage.setItem(quotesKey, JSON.stringify(quotes));
    };

    // Function to export quotes to a JSON file
    const exportToJsonFile = () => {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Function to import quotes from a JSON file
    const importFromJsonFile = (event) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    };

    // Load last viewed quote from session storage
    const lastQuote = JSON.parse(sessionStorage.getItem(lastQuoteKey));
    if (lastQuote) {
        quoteDisplay.innerHTML = `<p>${lastQuote.text}</p><small>${lastQuote.category}</small>`;
    }

    // Event listener for the "Show New Quote" button
    newQuoteButton.addEventListener('click', showRandomQuote);

    // Event listener for the "Add Quote" button
    addQuoteButton.addEventListener('click', createAddQuoteForm);

    // Event listener for the "Export Quotes" button
    exportButton.addEventListener('click', exportToJsonFile);

    // Event listener for the file input to import quotes
    importFileInput.addEventListener('change', importFromJsonFile);
});
