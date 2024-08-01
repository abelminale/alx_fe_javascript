document.addEventListener('DOMContentLoaded', () => {
    const quotesKey = 'quotes';
    const lastQuoteKey = 'lastQuote';
    const lastCategoryKey = 'lastCategory';
    const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL for fetching and posting quotes
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
    const conflictNotification = document.createElement('div');
    conflictNotification.id = 'conflictNotification';
    document.body.insertBefore(conflictNotification, document.body.firstChild);

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

    const addQuote = () => {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();
        if (text && category) {
            const newQuote = { text, category };
            quotes.push(newQuote);
            newQuoteText.value = '';
            newQuoteCategory.value = '';
            saveQuotes();
            populateCategories();
            postQuoteToServer(newQuote);
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

    const fetchQuotesFromServer = async () => {
        try {
            const response = await fetch(serverUrl);
            const serverQuotes = await response.json();
            return serverQuotes.map(quote => ({ text: quote.title, category: 'Server' })); // Mock server response formatting
        } catch (error) {
            console.error('Error fetching quotes from server:', error);
            return [];
        }
    };

    const postQuoteToServer = (quote) => {
        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: quote.text })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Quote posted to server:', data);
        })
        .catch(error => {
            console.error('Error posting quote to server:', error);
        });
    };

    const syncQuotes = async () => {
        const serverQuotesFormatted = await fetchQuotesFromServer();
        const newQuotes = serverQuotesFormatted.filter(serverQuote => 
            !quotes.some(localQuote => localQuote.text === serverQuote.text && localQuote.category === serverQuote.category)
        );
        
        if (newQuotes.length > 0) {
            quotes.push(...newQuotes);
            saveQuotes();
            populateCategories();
            displayConflictNotification(newQuotes.length);
        }
    };

    const displayConflictNotification = (newQuotesCount) => {
        conflictNotification.textContent = `Conflict resolved. ${newQuotesCount} new quotes were added from the server.`;
        setTimeout(() => {
            conflictNotification.textContent = '';
        }, 5000);
    };

    const lastQuote = JSON.parse(sessionStorage.getItem(lastQuoteKey));
    if (lastQuote) {
        quoteDisplay.innerHTML = `<p>${lastQuote.text}</p><small>${lastQuote.category}</small>`;
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);
    exportButton.addEventListener('click', exportToJsonFile);
    importFileInput.addEventListener('change', importFromJsonFile);

    populateCategories();
    filterQuotes();
    setInterval(syncQuotes, 10000); // Sync with server every 10 seconds
});
