const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');



// Search meal and fetch from API
function searchMeal(e) {
    e.preventDefault();

    // Clear singlem-meal
    single_mealEl.innerHTML = '';
    //Get search meal
    const term = search.value;
    //Check for empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                resultHeading.innerHTML = `<h2>Search results for <strong style="color:#5fbaa7">'${term}'</strong>:</h2>`;
                if (data.meals === null) {
                    resultHeading.innerHTML = `<p>Thera are no search results! TRY again</p>`
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                        <div class="meal-info" data-mealID = "${meal.idMeal}">
                        <h3 data-mealID = "${meal.idMeal}">${meal.strMeal}</h3>
                        
                        </div>
                    </div>
                    `).join('');
                }

            });
        //Clear search text
        search.value = '';
    } else {
        alert("Please enter a meal")
    }


}

// Fetch meal by id

function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        })
}

// Get random meal 

function randomMeal() {
    // Clear Meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
}

// Add meal to DOM

function addMealToDOM(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    </div>
    `
}

//Event listeners

submit.addEventListener("submit", searchMeal);
random.addEventListener("click", randomMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.composedPath();

    if (mealInfo[0]) {
        const mealID = mealInfo[0].getAttribute('data-mealid')
        getMealById(mealID)
    }

});

