const API_KEY = 'your API'; // Replace with your Spoonacular API key
const BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch';

// Pages
const homePage = document.getElementById('home-page');
const searchPage = document.getElementById('search-page');
const recipeDetailsPage = document.getElementById('recipe-details-page');
const recipeDetailsContent = document.getElementById('recipe-details-content');

// Navigation
document.getElementById('home-btn').addEventListener('click', () => {
  homePage.classList.add('active');
  searchPage.classList.remove('active');
  recipeDetailsPage.classList.remove('active');
});

document.getElementById('search-btn-nav').addEventListener('click', () => {
  homePage.classList.remove('active');
  searchPage.classList.add('active');
  recipeDetailsPage.classList.remove('active');
});

// Theme Toggle
const body = document.body;
const themeToggleBtn = document.getElementById('theme-toggle');

let currentTheme = 'light';

themeToggleBtn.addEventListener('click', () => {
  if (currentTheme === 'light') {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    themeToggleBtn.textContent = '🌈 Colorful Theme';
    currentTheme = 'dark';
  } else if (currentTheme === 'dark') {
    body.classList.remove('dark-theme');
    body.classList.add('colorful-theme');
    themeToggleBtn.textContent = '☀️ Light Mode';
    currentTheme = 'colorful';
  } else {
    body.classList.remove('colorful-theme');
    body.classList.add('light-theme');
    themeToggleBtn.textContent = '🌙 Dark Mode';
    currentTheme = 'light';
  }
});

// Search Button
document.getElementById('search-btn').addEventListener('click', function () {
  const searchQuery = document.getElementById('search-input').value;
  if (searchQuery) {
    fetchRecipes(searchQuery);
  } else {
    alert('Please enter a search term!');
  }
});

// Fetch Recipes
async function fetchRecipes(query) {
  const url = `${BASE_URL}?query=${query}&apiKey=${API_KEY}&number=10`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch recipes');
    const data = await response.json();
    displayRecipes(data.results);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    alert('Failed to fetch recipes.');
  }
}

// Display Recipes
function displayRecipes(recipes) {
  const resultsSection = document.querySelector('.results-section');
  resultsSection.innerHTML = '';

  if (recipes.length === 0) {
    resultsSection.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');

    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>Ready in ${recipe.readyInMinutes} minutes</p>
      <button class="view-recipe" data-id="${recipe.id}">View Recipe</button>
    `;

    resultsSection.appendChild(recipeCard);
  });

  document.querySelectorAll('.view-recipe').forEach((button) => {
    button.addEventListener('click', (event) => {
      const recipeId = event.target.getAttribute('data-id');
      viewRecipeDetails(recipeId);
    });
  });
}

// View Recipe Details
async function viewRecipeDetails(recipeId) {
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch recipe details');
    const recipe = await response.json();
    displayRecipeDetails(recipe);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    alert('Failed to fetch recipe details.');
  }
}

// Display Recipe Details
function displayRecipeDetails(recipe) {
  searchPage.classList.remove('active');
  recipeDetailsPage.classList.add('active');

  recipeDetailsContent.innerHTML = `
    <section class="recipe-details">
      <button id="back-to-search">← Back to Search</button>
      <h2>${recipe.title}</h2>
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>Ingredients</h3>
      <ul>
        ${recipe.extendedIngredients.map((ing) => `<li>${ing.original}</li>`).join('')}
      </ul>
      <h3>Instructions</h3>
      <p>${recipe.instructions || 'No instructions available.'}</p>
    </section>
  `;

  document.getElementById('back-to-search').addEventListener('click', () => {
    recipeDetailsPage.classList.remove('active');
    searchPage.classList.add('active');
  });
}

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


