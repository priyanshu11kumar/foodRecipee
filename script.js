const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const recipesContainer = document.getElementById('recipes');
const recipeDetailsContainer = document.getElementById('recipe-details');
const imageContainer = document.getElementById('image-container'); // Get the image container

const API_KEY = '40c1e6502a2a44bd8d5a82e1978d3196'; // Replace with your actual API key
const API_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}`;

// Disable right-click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    alert('Right-click is disabled on this page.');
});

// Disable keyboard shortcuts for inspect tool
document.addEventListener('keydown', (e) => {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J
        (e.ctrlKey && e.key === 'U') // Ctrl+U
    ) {
        e.preventDefault();
        alert('This action is disabled on this page.');
    }
});

searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        console.log('Searching for:', query);
        fetchRecipes(query);
        imageContainer.style.display = 'none'; // Hide the image container
    } else {
        console.log('Please enter a search term.');
    }
});

searchInput.addEventListener('input', () => {
    if (searchInput.value === '') {
        imageContainer.style.display = 'flex'; // Show the image container
        recipesContainer.innerHTML = ''; // Clear the recipe results
        recipeDetailsContainer.innerHTML = ''; // Clear the recipe details
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.style.display = 'none'; // Hide the back button
        }
    }
});

async function fetchRecipes(query) {
    try {
        const response = await fetch(`${API_URL}&query=${query}`);
        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
        `;
        recipeCard.addEventListener('click', () => {
            fetchRecipeDetails(recipe.id);
        });
        recipesContainer.appendChild(recipeCard);
    });
}

async function fetchRecipeDetails(recipeId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`);
        const data = await response.json();
        displayRecipeDetails(data);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

function displayRecipeDetails(recipe) {
    recipeDetailsContainer.innerHTML = `
        <button id="back-btn">Back to Recipes</button>
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}">
        <p>${recipe.instructions || 'No instructions available.'}</p>
    `;

    // Show the back button
    const backBtn = document.getElementById('back-btn');
    backBtn.style.display = 'block';

    // Scroll to the recipe details section
    recipeDetailsContainer.scrollIntoView({ behavior: 'smooth' });

    // Add event listener to the back button
    backBtn.addEventListener('click', () => {
        recipeDetailsContainer.innerHTML = ''; // Clear the recipe details
        backBtn.style.display = 'none'; // Hide the back button
        recipesContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll back to the recipes
    });
}

