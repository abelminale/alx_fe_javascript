document.addEventListener('DOMContentLoaded', () => {
    const quotesKey = 'quotes';
    const lastQuoteKey = 'lastQuote';
    const lastCategoryKey = 'lastCategory';
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
    const categoryFilter = document.getElementById('categoryFilter');

    const getCategories = () => {
        const categories = new Set(quotes.map(quote => quote.category));
        return Array.from(categories);
    };

    const populateCategories = () => {
        const categories = getCategories();
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        const lastCategory = localStorage.getItem(lastCategoryKey);
        if (lastCategory) {
            categoryFilter.value = lastCategory;
        }
    };

    const filterQuotes = () => {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem(lastCategoryKey, selectedCategory);
        const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
        displayQuotes(filteredQuotes);
    };

    const displayQuotes = (quotesToDisplay) => {
        quoteDisplay.innerHTML = '';
        quotesToDisplay.forEach(quote => {
            const quoteText = document.createElement('p');
            quoteText.textContent = quote.text;

            const quoteCategory = document.createElement('small');
            quoteCategory.textContent = quote.category;

            quoteDisplay.appendChild(quoteText);
            quoteDisplay.appendChild(quoteCategory);
        });
    };

    const showRandomQuote = () => {
        const filteredQuotes = categoryFilter.value === 'all' ? quotes : quotes.filter(quote => quote.category === categoryFilter.value);
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = '';

        const quoteText = document.createElement('p');
        quoteText.textContent = quote.text;

        const quoteCategory = document.createElement('small');
        quoteCategory.textContent = quote.category;

        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);

        sessionStorage.setItem(lastQuoteKey, JSON.stringify(quote));
    };

    const createAddQuoteForm = () => {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();
        if (text && category) {
            quotes.push({ text, category });
            newQuoteText.value = '';
            newQuoteCategory.value = '';
            saveQuotes();
            populateCategories();
            alert('Quote added successfully!');
        } else {
            alert('Please enter both a quote and a category.');
        }
    };

    const saveQuotes = () => {
        localStorage.setItem(quotesKey, JSON.stringify(quotes));
    };

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

    const importFromJsonFile = (event) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    };

    const lastQuote = JSON.parse(sessionStorage.getItem(lastQuoteKey));
    if (lastQuote) {
        quoteDisplay.innerHTML = `<p>${lastQuote.text}</p><small>${lastQuote.category}</small>`;
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', createAddQuoteForm);
    exportButton.addEventListener('click', exportToJsonFile);
    importFileInput.addEventListener('change', importFromJsonFile);

    populateCategories();
    filterQuotes();
});
