const settingBtn = document.querySelector("#setting-btn");
const buttons = document.querySelectorAll(".nav .button");
const clearBtn = document.querySelector(".btn-1");
const randomBtn = document.querySelector(".btn-3");
const newParents = document.querySelectorAll(".new-parent");
const oldParent = document.querySelector(".old-parent");

// FUNCTION: Hide/Show setting buttons
// Toggle show classlist to all setting's buttons
buttons.forEach((button) => {
  settingBtn.addEventListener("click", (e) => {
    button.classList.toggle("show");
  });
});
// FUNCTION: Clear button remove items table and move items to oldparent list
const moveItemsToOldParent = function () {
  clearBtn.addEventListener("click", () => {
    newParents.forEach((newParent) => {
      while (newParent.children.length > 1) {
        oldParent.appendChild(
          newParent.children[newParent.children.length - 1]
        );
      }
    });
  });
};
moveItemsToOldParent();
// FUNCTION: Move items into Weekly table
const moveItemsToNewParents = function () {
  newParents.forEach((newParent) => {
    while (newParent.children.length <= 3) {
      newParent.appendChild(oldParent.children[0]);
    }
  });
};
// FUNCTION: Random button
randomBtn.addEventListener("click", () => {
  newParents.forEach((newParent) => {
    if (newParent.childElementCount <= 4) {
      while (newParent.children.length > 1) {
        oldParent.appendChild(
          newParent.children[newParent.children.length - 1]
        );
      }
    }
    moveItemsToNewParents();
  });
});

//
//
//
let calculatedKcal = 0;
// continue btn
const submitBtn = document.querySelector("#submit-btn");
submitBtn.addEventListener("click", () => {
  const calculation = Math.floor(
    (10 * document.querySelector("#input-weight").value +
      6.25 * document.querySelector("#input-height").value -
      5 * document.querySelector("#input-age").value +
      document.querySelector("#input-gender").value) *
    document.querySelector("#input-active").value
  );
  calculatedKcal = calculation;
  //
  document.querySelector("#recommended-calories").textContent = calculatedKcal;
  //
  const fat = document.querySelector("#recommended-fat");
  fat.textContent = `${Math.floor((calculatedKcal * 0.3) / 9)} `;
  // const fatPerMeal = fat.textContent / 3;
  const protein = document.querySelector("#recommended-protein");
  protein.textContent = `${Math.floor((calculatedKcal * 0.3) / 4)} `;
  // const proteinPerMeal = protein.textContent / 3;
  const carbs = document.querySelector("#recommended-carbs");
  carbs.textContent = `${Math.floor((calculatedKcal * 0.4) / 4)} `;
  // const carbsPerMeal = carbs.textContent / 3
  const kcalPerMeal = calculatedKcal / 3;

  formContainer.remove();
  generateMeals(kcalPerMeal);
});
// For men: 10 x weight (kg) + 6.25 x height (cm) – 5 x age (y) + 5 (kcal / day)
// For women: 10 x weight (kg) + 6.25 x height (cm) – 5 x age (y) -161 (kcal / day)

//  Then, this BMR count is multiplied, depending on your activity level:
// Sedentary = 1.2
// Lightly active = 1.375
// Moderately active = 1.550
// Very active = 1.725
// Extra active = 1.9

// The calorie count is then adjusted based on your goal:
// Weight loss: Reduce by 10-20%
// Weight gain: Add 10%-20%
// Weight maintenance: Unchanged

// Weight loss: 40/40/20 (carbohydrates/protein/fats)
// Weight gain: 40/30/30
// Weight maintenance: 40/30/30

// FUNCTION: API and display data on html
import FetchWrapper from "./fetch-wrapper.js";
const key = "?apiKey=93d3b9134b1d4c44ae5f9dd1b9800b0d";

const form = document.querySelector("#form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  generateMeals(calculatedKcal);
});

const API = new FetchWrapper("https://api.spoonacular.com/");
const generateMeals = async (calories) => {
  const datas = await API.get(
    //endpoint details: https://spoonacular.com/food-api/docs#Search-Recipes-by-Nutrients
    //this endpoint allow to collect datas base on macro nutrients value
    `recipes/findByNutrients${key}&maxCalories=${calories}&minCalories=300&number=31&random=true`
  );
  let card = "";
  //inject user's info: id (use to retrieve detail), image, title, calories, carbs, protein, fat
  datas.map((data) => {
    card += `
          <!-- single card  -->
          <li class="list-item" draggable="true">
            <div class="drag-icon">
              <i id="drag" class="fas fa-grip-vertical"></i>
              <i id="trash" class="far fa-trash-alt"></i>
            </div>
            <div class="img-wrapper">
              <button draggable="false" class="item-info">VIEW</button>
              <img
                class="item-img"
                src="${data.image}"
                draggable="false"
                alt="thumbnail"
              />
            </div>
            <article class="content-front">
              <h3 class="item-title">${data.title.substring(0, 20)}</h3>
              <p class="item-calories">(${data.calories} Kcal)</p>
            </article>
            <article class="content-back">
              <p class="item-protein">Protein: ${data.protein}</p>
              <p class="item-carbs">Carbs: ${data.carbs}</p>
              <p class="item-fat">Fat: ${data.fat}</p>
            </article>
            <div class="item-id">${data.id}</div>
          </li>
          <!-- end single card  -->`;
  });
  document.querySelector("#list").innerHTML = card;

  moveItemsToNewParents();
  //
  //
  //
  //
  //
  // FUNCTION: Trash button
  const trashBtns = document.querySelectorAll("#trash");
  // lopp through all trash btns and remove grandparent element
  trashBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.parentElement.remove();
    });
  });
  //
  //
  //
  //
  //
  // FUNCTION: Dragable function
  const listItems = document.querySelectorAll(".list-item");
  const lists = document.querySelectorAll("#list");
  //
  let draggedItem = null;
  // Loop through each dragable item
  listItems.forEach((item) => {
    // Fire event for drag start
    item.addEventListener("dragstart", function () {
      draggedItem = item;
      // Add timeout to keep the item visible until the event is complete
      setTimeout(function () {
        item.style.display = "none";
      }, 0);
    });
    // Fire event for drag end
    item.addEventListener("dragend", function () {
      setTimeout(function () {
        // Once completed, turn item back into flex
        draggedItem.style.display = "flex";
        draggedItem = null;
      }, 0);
    });
  });
  // Loop through each column
  lists.forEach((list) => {
    // Fire event for dragover and prevent page reload
    list.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    // Fire event for enter
    list.addEventListener("dragenter", function (e) {
      e.preventDefault();
      e.currentTarget.style.background = "var(--lightblue)";
      e.currentTarget.style.border = "2px dotted var(--darkgrey)";
      e.currentTarget.style.borderRadius = "5px";
    });
    // Fire event for leave
    list.addEventListener("dragleave", function (e) {
      e.preventDefault();
      e.currentTarget.style.border = "";
      e.currentTarget.style.background = "";
    });
    // Fire event for drop
    list.addEventListener("drop", function (e) {
      e.currentTarget.append(draggedItem);
      e.currentTarget.style.border = "";
      e.currentTarget.style.background = "";
    });
  });

  //
  //
  //
  //
  //
  // FUNCTION: MODAL
  const modalOpenBtns = document.querySelectorAll(".item-info");
  const modalCloseBtn = document.querySelector(".modal-close");
  const modalContainer = document.querySelector(".modal-container");
  const modalContent = document.querySelector(".modal-content");

  // hide-show modal
  modalOpenBtns.forEach((btn) => {
    // handle hide modal
    btn.addEventListener("click", async (e) => {
      modalContainer.classList.add("show-hide");
      // receive mealID to use for recipe detail API
      const mealID =
        e.currentTarget.parentElement.parentElement.lastElementChild.innerHTML;
      const data = await API.get(
        `recipes/${mealID}/information${key}&includeNutrition=true`
        // https://api.spoonacular.com/recipes/661510/information?apiKey=98bce4c26d4a425bb4183176fc75629fincludeNutrition=true
      );
      // insert content
      modalContent.innerHTML = `
          <h3 class="modal-title">${data.title}</h3>
          <h4 class="modal-type">Dish Type: ${data.dishTypes}</h4>
          <h5 class="modal-servings">Servings Size: ${data.servings}</h5>
          <p class="modal-summary">Summary: ${data.summary}</p>
          `;
    });
    //close modal
    modalCloseBtn.addEventListener("click", (e) => {
      modalContainer.classList.remove("show-hide");
    });
  });
};

// AUTO slideshow
let slideIndex = 0;
showSlides();
function showSlides() {
  let i;
  const slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 5000);
}
// Skip btn
const formContainer = document.querySelector("#form-container");
const skipBtn = document.querySelector("#skip-btn");
skipBtn.addEventListener("click", () => {
  formContainer.remove();
  generateMeals(2000);
});

window.onload = function () {
  //hide the preloader
  document.querySelector("#preloader").style.display = "none";
};
