// Variables

const searchBtn = document.getElementById('search-btn');
const searchBox = document.getElementById('search-box');
const searchResults = document.getElementById('meals-title');
const mealsList = document.getElementById('meals-feed');
const mealDetails = document.getElementById('recipe-details');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// Buttons

searchBtn.addEventListener('click', searchForMeals);
searchBox.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchForMeals();
  }
})
mealsList.addEventListener('click', searchForRecipe);
recipeCloseBtn.addEventListener('click', () => {
  mealDetails.parentElement.classList.remove('showRecipe');
})

// Helper Functions

function instructionsParser(steps) {
  let string = "";
  steps.forEach((step, index) => {
    string += `<br><div> <b>Step ${index + 1} </b>: ${step.display_text} </div>`
  })
  return string;
}

function topicParser(topic) {
  let string = "";
  topic.forEach(step => {
    string += `<div class="topic"> ${step.name}</div>`
  } )
  return string;
}

// Functions

function searchForMeals(){
  let searchInput = document.getElementById('search-box').value.trim();
  document.getElementById('search-box').value = "Loading...";
  fetch(`https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&q=${searchInput}`, {
    "method": "GET",
    "headers": {
//API KEY
    }
  })
  .then(response => {
    console.log(response)
  return response.json()})
  .then(data => {
    console.log(data.results)
    let html = "";
    if(data.results){
      data.results.forEach(meal => {
        if (meal.instructions) {
          html += `
            <div class="meal-item" data-id="${meal.id}">
              <img class="meal-item_photo" src=${meal.thumbnail_url} alt="">
              <div class="meal-item_details">
              <div class="meal-item_name">${meal.name}
              </div>
              <p class="meal-item_author">Recipe by: ${meal.credits[0].name}
              </p>
              <a href="#" class="meal-recipe-btn">Get Recipe</a>
              </div>
            </div>
          `
        }
      })
    } else {
      html = "Sorry, we couldn't find any recipes for that ingrediant";
    }
    searchResults.innerHTML = "<h2>Your Search Results:</h2>"
    mealsList.innerHTML = html;
    document.getElementById('meals-title').scrollIntoView({behavior: "smooth"});
    document.getElementById('search-box').value = searchInput;
  })
}

function searchForRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains('meal-recipe-btn')) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(`https://tasty.p.rapidapi.com/recipes/get-more-info?id=${mealItem.dataset.id}`, {
	"method": "GET",
	"headers": {
//API KEY

    }
  })
  .then(response => response.json())
  .then(data => formatRecipe(data))
  .catch(err => {
    console.error(err);
  });
  }
}

function formatRecipe(meal){
  let html = `
    <div class="recipe-details" id="recipe-details">
    <div class="recipe-title">
      <img class="recipe-photo" src=${meal.thumbnail_url} alt="">
      <h2 class="recipe-name">${meal.name}</h2>
    </div>

      <div class="recipe-instructions">
        <h3>Instructions</h3>
        <div> ${ instructionsParser(meal.instructions) } </div>
      </div>

    </div>
  
  `;
  mealDetails.innerHTML = html;
  mealDetails.parentElement.classList.add('showRecipe');
}