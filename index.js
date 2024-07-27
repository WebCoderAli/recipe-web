const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const recipeContainer = document.querySelector(".recipe-container");
const popup = document.querySelector(".popup");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".close-btn");
const popupContent = document.querySelector(".popup-content");

const fetchRecipes = async (recipe) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipe}`);
    const response = await data.json();
    recipeContainer.innerHTML = "";
    response.meals.forEach(meal => {
        const recipediv = document.createElement("div");
        recipediv.classList.add("recipe");
        recipediv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            <button class="view-recipe-btn" data-id="${meal.idMeal}">View Recipe</button>
        `;
        recipeContainer.appendChild(recipediv);
    });
};

searchBtn.addEventListener("click", function(e) {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    fetchRecipes(searchInput);
});

recipeContainer.addEventListener("click", function(e) {
    if (e.target.classList.contains("view-recipe-btn")) {
        const recipeId = e.target.dataset.id;
        showRecipePopup(recipeId);
    }
});

const showRecipePopup = async (recipeId) => {
    popup.style.display = "block";
    overlay.style.display = "block";
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
    const response = await data.json();
    const meal = response.meals[0];
    const instructions = meal.strInstructions.split('\r\n').filter(step => step);
    const instructionList = instructions.map(step => `<li>${step}</li>`).join('');
    popupContent.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <br>
        <h3><b>Instructions:</b></h3>
        <br>
        <ol><Big>${instructionList}</Big></ol>
    `;
};

closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
    overlay.style.display = "none";
});

overlay.addEventListener("click", () => {
    popup.style.display = "none";
    overlay.style.display = "none";
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        popup.style.display = "none";
        overlay.style.display = "none";
    }
});
