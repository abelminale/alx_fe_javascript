document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Reflection" },
        { text: "The purpose of our lives is to be happy.", category: "Happiness" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuote');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');

    // Function to display a random quote
    const showRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>${quote.text}</p><small>${quote.category}</small>`;
    };

    // Function to add a new quote to the quotes array and update the DOM
    const addQuote = () => {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();
        if (text && category) {
            quotes.push({ text, category });
            newQuoteText.value = '';
            newQuoteCategory.value = '';
            alert('Quote added successfully!');
        } else {
            alert('Please enter both a quote and a category.');
        }
    };

    // Event listener for the "Show New Quote" button
    newQuoteButton.addEventListener('click', showRandomQuote);

    // Event listener for the "Add Quote" button
    addQuoteButton.addEventListener('click', addQuote);
});
