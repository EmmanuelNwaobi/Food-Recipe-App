let form = document.getElementById("form")
let inputSearch = document.getElementById("food-search")
let modalOverlay = document.getElementById("modal-overlay")
let searchContainer = document.getElementById("search-container")



// Extract user Input 
form.addEventListener("submit", colletUserInput)
function colletUserInput(event){
    event.preventDefault()

    let inputValue = inputSearch.value.trim()

    if(inputValue.length === 0){
        alert("Field is empty, search for receipe")
        return
    }else{
        fetchuserInput(inputValue)
    }
    form.reset()
}
 
// Fetch data from an APi 
function fetchuserInput(inputValue){
    let endpoint = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${inputValue}`
    fetch(endpoint).then((dataRespose, error)=>{
        return dataRespose.json()
    }).then((mydata)=>{
        printToUi(mydata)
    }).catch((error)=>{
        error = "sorry we didn't find a meal with this Ingredient"
        alert(error)
    })
}

// Print the collected data from the Api to the UI 
function printToUi(mydata){
    let receipeArray = mydata.meals
    searchContainer.innerHTML = ""
    receipeArray.forEach((item, index)=>{
        let nameOfFood = item.strMeal
        let foodImage = item.strMealThumb
        let foodId = item.idMeal

        let imageAndReceipeContainer = document.createElement("div")
        imageAndReceipeContainer.classList.add("image-and-receipe-container")
        imageAndReceipeContainer.addEventListener("click", userTarget)

        let imageContainer = document.createElement("div")
        imageContainer.classList.add("image-container")
        
        let img = document.createElement("img")
        img.src = foodImage
        img.alt = "food-image"

        imageContainer.append(img)

        let foodTextButtonContainer = document.createElement("div")
        foodTextButtonContainer.classList.add("food-text-and-receipe-button-container")
        foodTextButtonContainer.setAttribute("id", `${foodId}`)

        let foodTextcontent = document.createElement("h3")
        foodTextcontent.textContent = nameOfFood

        let buttonTxt = document.createElement("button")
        buttonTxt.setAttribute("id", "get-receipe")
        buttonTxt.setAttribute("data-action", "show")
        buttonTxt.textContent = "Get Receipe"

        foodTextButtonContainer.append(foodTextcontent, buttonTxt)
        imageAndReceipeContainer.append(imageContainer, foodTextButtonContainer)
        searchContainer.append(imageAndReceipeContainer)



    })
}

// Show Modal overaly 
function showModal(){
    modalOverlay.classList.remove("modal-overlay")
    modalOverlay.classList.add("modal-overlay-visible")
}

// Catch user action
function userTarget(event){
    let userTarget = event.target
    let parentElement = userTarget.parentElement

    if(!parentElement.classList.contains("food-text-and-receipe-button-container")){
        return
    }
    
    let userId = Number(parentElement.id)
    let userAction = userTarget.dataset.action 
    
    if(userAction === "show"){
        showModal()
        revealInstruction(userId)
    }
}

// Reveal Meal Instruction with a modal
function revealInstruction(id){
    let endpoint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    fetch(endpoint).then((dataFeedBack)=>{
        return dataFeedBack.json()
    }).then((feedBack)=>{
        printInstructions(feedBack)
    })
}

// Print Instructions to the UI 
function printInstructions(feedBack){
    let mealArray = feedBack.meals
    
    modalOverlay.innerHTML = ""
    mealArray.forEach((foodItem, index)=>{
        let myFoodName = foodItem.strMeal
        let myFoodImage = foodItem.strMealThumb
        let instructions = foodItem.strInstructions
        let watchVideo = foodItem.strYoutube
        let category = foodItem.strCategory

        let modalItems = document.createElement("div")
        modalItems.classList.add("modal-items")

        let closeIconContainer = document.createElement("div")
        closeIconContainer.classList.add("close-icon-container")

        let closeIcon = document.createElement('i')
        closeIcon.classList.add("fa-regular", "fa-circle-xmark")
        closeIcon.setAttribute("id", "close-icon")
        closeIcon.addEventListener("click", closeModal)

        closeIconContainer.append(closeIcon)

        let headingModalText = document.createElement("div")
        headingModalText.classList.add("heading-modal-text")

        let nameOfFoodElement = document.createElement("h1")
        nameOfFoodElement.textContent = myFoodName

        let categoryElement = document.createElement("p")
        categoryElement.textContent = category

        let instructionElement = document.createElement("h3")
        instructionElement.textContent = "Instructions:"

        headingModalText.append(nameOfFoodElement, categoryElement, instructionElement)

        let instructionTextContainer = document.createElement("div")
        instructionTextContainer.classList.add("instruction-text")

        let instructionOnText = document.createElement("p")
        instructionOnText.textContent = instructions

        instructionTextContainer.append(instructionOnText)

        let imageAndWatchVideoContainer = document.createElement("div")
        imageAndWatchVideoContainer.classList.add("image-and-watch-video-container")

        let imageModalContainer = document.createElement("div")
        imageModalContainer.classList.add("image-modal-container")

        let modalImg = document.createElement("img")
        modalImg.src = myFoodImage
        modalImg.alt = "Food-image"

        imageModalContainer.append(modalImg)

        let link = document.createElement("a")
        link.setAttribute("href", `${watchVideo}`)
        link.setAttribute("target", "_blank")
        link.textContent = "Watch video"

        // Add Favorite Button
        let favoriteButton = document.createElement("button")
        favoriteButton.textContent = "Add to Favorites"
        favoriteButton.classList.add("favorite-btn")
        favoriteButton.addEventListener("click", function(){
            saveFavoriteRecipe(foodItem)
        })

        imageAndWatchVideoContainer.append(imageModalContainer, link, favoriteButton)

        modalItems.append(closeIconContainer, headingModalText, instructionTextContainer, imageAndWatchVideoContainer)

        modalOverlay.append(modalItems)

    })
}


// Close modal overlay
function closeModal(){
    if(modalOverlay.classList.contains("modal-overlay-visible")){
        modalOverlay.classList.remove("modal-overlay-visible")
        modalOverlay.classList.add("modal-overlay")
    }
}

// Function to save favorite recipe to local storage
let favoriteRecipesArray = []
function saveFavoriteRecipe(foodItem){
    // Before saving check if the favrite receipe exist already in local storage then get it if it exist 
    if(localStorage.getItem("favoriteRecipes")){
        favoriteRecipesArray = JSON.parse(localStorage.getItem("favoriteRecipes"))
    }
    // Check if the recipe is already in the favorites
    if(!favoriteRecipesArray.some(favObject=> favObject.idMeal === foodItem.idMeal)){
        favoriteRecipesArray.push(foodItem)
        localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipesArray))
        alert(`${foodItem.strMeal} has been added to your favorites!`)
    }else{
        alert(`${foodItem.strMeal} is already in your favorites.`)
    }
}

// Function to retrieve and display favorite recipes
function displayFavoriteRecipe(){

    if(localStorage.getItem("favoriteRecipes")) {
        favoriteRecipesArray = JSON.parse(localStorage.getItem("favoriteRecipes"))
    } else {
        alert("No favorite recipes found.")
        return
    }

    searchContainer.innerHTML = ""

    favoriteRecipesArray.forEach((item, index)=>{

        let nameOfFood = item.strMeal
        let foodImage = item.strMealThumb
        let foodId = item.idMeal

        let imageAndReceipeContainer = document.createElement("div")
        imageAndReceipeContainer.classList.add("image-and-receipe-container")

        let imageContainer = document.createElement("div")
        imageContainer.classList.add("image-container")

        let img = document.createElement("img")
        img.src = foodImage
        img.alt = "food-image"

        imageContainer.appendChild(img)

        let foodTextButtonContainer = document.createElement("div")
        foodTextButtonContainer.classList.add("food-text-and-receipe-button-container")
        foodTextButtonContainer.setAttribute("id", `${foodId}`)

        let foodTextcontent = document.createElement("h3")
        foodTextcontent.textContent = nameOfFood

        let buttonTxt = document.createElement("button")
        buttonTxt.setAttribute("id", "get-receipe")
        buttonTxt.setAttribute("data-action", "show")
        buttonTxt.textContent = "Get Receipe"
        buttonTxt.addEventListener("click", userTarget)

        // Add Remove from Favorites Button
        let removeButton = document.createElement("button")
        removeButton.textContent = "Remove from Favorites"
        removeButton.classList.add("remove-favorite-btn")
        removeButton.addEventListener("click", function(){
            removeFavoriteRecipe(item.idMeal)
        })
        

        foodTextButtonContainer.append(foodTextcontent, buttonTxt, removeButton)
        imageAndReceipeContainer.append(imageContainer, foodTextButtonContainer)
        searchContainer.append(imageAndReceipeContainer)
    })
}

// Function to remove a recipe from favorites
function removeFavoriteRecipe(idMeal){
    favoriteRecipesArray = favoriteRecipesArray.filter(recipe => recipe.idMeal !== idMeal)
    localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipesArray))
    // Re-render to the UI 
    displayFavoriteRecipe() 
}

// Adding a button in your HTML to trigger displaying favorites
document.addEventListener('DOMContentLoaded', () => {
    const showFavoritesBtn = document.createElement('button')
    showFavoritesBtn.textContent = "Show Favorite Recipes"
    showFavoritesBtn.classList.add("show-favorites-btn")
    showFavoritesBtn.addEventListener("click", displayFavoriteRecipe)

    document.querySelector('.heading-text').appendChild(showFavoritesBtn)
})