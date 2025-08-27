/* ---------------------------- Variables ---------------------------- */
/* ----- Theme ----- */
const headerChangeThemeBtn = document.querySelector(".header__theme-btn");
const themeIconSun = document.querySelector(".header__icon--sun");
const themeIconMoon = document.querySelector(".header__icon--moon");
/* ----- Modal ----- */
const headerCreateBtn = document.querySelector(".header__create-btn");
const modalScreen = document.querySelector(".modal-screen");
const modalCancelBtn = document.querySelector(".modal-screen__cancel-btn");
const modalXBtn = document.querySelector(".modal-screen__close-X-btn");
const modalCreateBtn = document.querySelector(".modal-screen__create-btn");
const modalInput = document.querySelector(".modal-screen__input");
/* ----- Toast ----- */
const toast = document.querySelector(".toast");
const toastProcess = document.querySelector(".toast__process");
const toastIcons = document.querySelector(".toast__icons");
const toastIconSuccess
 = document.querySelector(".toast__icon--success");
const toastIconInfo = document.querySelector(".toast__icon--info");
const toastIconDanger = document.querySelector(".toast__icon--danger");
const toastMessage = document.querySelector(".toast__message");
const toastProcessBar = document.querySelector(".toast__process-bar");
/* ----- Todos Container ----- */
const todoListLevelOneContainer = document.querySelector(
  ".main-section__body--level-one"
);
const todoListLevelTwoContainer = document.querySelector(
  ".main-section__body--level-two"
);
const todoListLevelThreeContainer = document.querySelector(
  ".main-section__body--level-three"
);
/* ----- For Date ----- */
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
/* ----- Todos ----- */
let todosLevelOne = [];
let todosLevelTwo = [];
let todosLevelThree = [];

/* ----------------------------- Functions ---------------------------- */
/* ----- load Body ----- */
function getDataFromLocalStorage() {
  if (localStorage.getItem("theme") === "dark") {
    changeTheme();
  }
  const levels = [
    {
      key: "todosLevelOne",
      arr: todosLevelOne,
      container: todoListLevelOneContainer,
    },
    {
      key: "todosLevelTwo",
      arr: todosLevelTwo,
      container: todoListLevelTwoContainer,
    },
    {
      key: "todosLevelThree",
      arr: todosLevelThree,
      container: todoListLevelThreeContainer,
    },
  ];

  levels.forEach(function ({ key, arr, container }) {
    const stored = localStorage.getItem(key);
    const parsed = JSON.parse(stored) || [];
    syncAndRenderTodosLevel(parsed, arr, container);
  });
}
function syncAndRenderTodosLevel(
  todosLevelArray,
  todosLevel,
  todosContainerElem
) {
  todosLevel.length = 0;
  if (Array.isArray(todosLevelArray)) {
    todosLevel.push(...todosLevelArray);
  }
  renderTodosToLevels(todosContainerElem, todosLevel);
}
// renderTodosToLevels(todoListLevelThreeContainer, todosLevelThree);
/* ----- Theme ----- */
function changeTheme() {
  const isDark = document.body.classList.contains("dark");
  document.body.classList.toggle("dark", !isDark);
  themeIconSun.classList.toggle("hidden", isDark);
  themeIconMoon.classList.toggle("hidden", !isDark);
  localStorage.setItem("theme", isDark ? "light" : "dark");
}
/* ----- Modal ----- */
function showModal() {
  modalScreen.classList.remove("hidden");
}
function hideModal() {
  modalScreen.classList.add("hidden");
  modalInput.value = "";
}
function createNewTodo() {
  const modalInputValue = modalInput.value.trim();
  if (modalInputValue === "") {
    showToastAndTimerForHide(
      "please enter the value",
      "toast danger",
      toastIconDanger
    );
  } else {
    const checkingDuplicateTodo = isTodoInLevels(modalInputValue);
    if (checkingDuplicateTodo) {
      showToastAndTimerForHide(
        "You have a todo with the same title on your list",
        "toast info",
        toastIconInfo
      );
    } else {
      const date = new Date();
      const uniqueId = Math.floor(10000 + Math.random() * 90000);
      const newTodo = {
        todoTitle: modalInputValue,
        todoDate: `${days[date.getDay()]}, ${
          month[date.getMonth()]
        } ${date.getDate()}, ${String(date.getHours()).padStart(
          2,
          "0"
        )}:${String(date.getMinutes()).padStart(2, "0")}`,
        todoId: uniqueId,
        level: 1,
      };
      todosLevelOne.push(newTodo);
      renderTodosToLevels(todoListLevelOneContainer, todosLevelOne);
      saveTodosToLocalStorage(todosLevelOne, "todosLevelOne");
      showToastAndTimerForHide(
        "Your todo creation operation was successful",
        "toast success",
        toastIconSuccess
      );
      hideModal();
    }
  }
}
function isTodoInLevels(InputValue) {
  return [todosLevelOne, todosLevelTwo, todosLevelThree].some(function (level) {
    return level.some(function (todo) {
      return todo.todoTitle === InputValue;
    });
  });
}

function deleteTodo(event) {
  const targetTodo = event.target.closest(".todo");
  const targetTodoId = +targetTodo.id.slice(-5);

  const levels = [
    {
      todos: todosLevelOne,
      container: todoListLevelOneContainer,
      storageKey: "todosLevelOne",
    },
    {
      todos: todosLevelTwo,
      container: todoListLevelTwoContainer,
      storageKey: "todosLevelTwo",
    },
    {
      todos: todosLevelThree,
      container: todoListLevelThreeContainer,
      storageKey: "todosLevelThree",
    },
  ];

  for (const level of levels) {
    const index = level.todos.findIndex(function (todo) {
      return todo.todoId === +targetTodoId;
    });
    if (index !== -1) {
      level.todos.splice(index, 1);
      saveTodosToLocalStorage(level.todos, level.storageKey);
      renderTodosToLevels(level.container, level.todos);
      break;
    }
  }
}
/* ----- Render Todos ----- */
function renderTodosToLevels(todosContainerElem, todosLevel) {
  todosContainerElem.innerHTML = "";
  todosLevel.forEach(function (todo) {
    todosContainerElem.insertAdjacentHTML(
      "beforeend",
      `
        <article draggable="true" ondragstart="todoDragStart(event)" id="id-${todo.todoId}" class="todo">
          <div class="todo__header">
            <div class="todo__wrapper">
              <h2 class="todo__title">
                ${todo.todoTitle}
              </h2>
              <p class="todo__date">${todo.todoDate}</p>
            </div>
            <button type="button" onclick="deleteTodo(event)" class="todo__btn btn-danger">
              Delete
            </button>
          </div>
        </article>
       `
    );
  });
  FillInTheBlankContainerElem();
}
function FillInTheBlankContainerElem() {
  const containers = [
    todoListLevelOneContainer,
    todoListLevelTwoContainer,
    todoListLevelThreeContainer,
  ];

  containers.forEach((container) => {
    if (container.innerHTML.trim() === "") {
      container.innerHTML =
        '<h1 class="main-section__body-title">No todos added</h1>';
    }
  });
}
/* ----- Toast ----- */
let toastTimer = null;
function showToastAndTimerForHide(message, toastClassList, toastIcon) {
  if (toastTimer) {
    clearInterval(toastTimer);
    toastTimer = null;
  }
  let currentWidth = 0;
  toastMessage.innerHTML = message;
  toastIcon.classList.remove("hidden");
  toast.className = toastClassList;

  toastTimer = setInterval(function () {
    currentWidth++;
    if (currentWidth === 100) {
      currentWidth = 0;
      clearInterval(toastTimer);
      toast.classList.add("hidden");
      toastIcon.classList.add("hidden");
    }
    toastProcess.style.setProperty("width", `${currentWidth}%`);
  }, 20);
}
/* ----- Drag & Drop ----- */
function todoDragStart(event) {
  const todoElem = event.currentTarget;
  event.dataTransfer.setData("dragTargetId", todoElem.id);
  event.dataTransfer.setData(
    "dragSectionLevels",
    event.target.parentElement.id
  );
}
function todoDragOver(event) {
  event.preventDefault();
}
const todosMap = {
  1: {
    arr: todosLevelOne,
    container: todoListLevelOneContainer,
    key: "todosLevelOne",
  },
  2: {
    arr: todosLevelTwo,
    container: todoListLevelTwoContainer,
    key: "todosLevelTwo",
  },
  3: {
    arr: todosLevelThree,
    container: todoListLevelThreeContainer,
    key: "todosLevelThree",
  },
};
function todoDrop(event) {
  const dragTargetId = event.dataTransfer.getData("dragTargetId");
  const dragTargetElem = document.querySelector(`#${dragTargetId}`);

  const dragSectionLevel = event.dataTransfer
    .getData("dragSectionLevels")
    .slice(-1);
  const dropSectionLevel = event.currentTarget.id.slice(-1);

  if (!dragTargetElem) return;
  event.currentTarget.append(dragTargetElem);

  moveTodoBetweenLevels(
    dragSectionLevel,
    dropSectionLevel,
    +dragTargetId.slice(-5)
  );
  // }
}
function moveTodoBetweenLevels(fromLevel, toLevel, todoId) {
  const from = todosMap[+fromLevel];
  const to = todosMap[+toLevel];
  
  const index = from.arr.findIndex(function(todo){
   return todo.todoId === todoId
  })  

  if (index === -1) return;

  const [todo] = from.arr.splice(index, 1);
  to.arr.push(todo);

  saveTodosToLocalStorage(from.arr, from.key);
  saveTodosToLocalStorage(to.arr, to.key);
  renderTodosToLevels(from.container, from.arr);
  renderTodosToLevels(to.container, to.arr);
}
/* ----- Local Storage ----- */
function saveTodosToLocalStorage(arr, key) {
  localStorage.setItem(key, JSON.stringify(arr));
}
/* ----- keys functions ----- */
function keyEscAndEnter(event) {
  if (!modalScreen.classList.contains("hidden")) {
    if (event.key === "Escape") {
      hideModal();
    } else if (event.key === "Enter") {
      createNewTodo();
    }
  }
}
/* ------------------------------ Events ------------------------------ */
/* ----- Theme ----- */
headerChangeThemeBtn.addEventListener("click", changeTheme);
/* ----- Modal ----- */
headerCreateBtn.addEventListener("click", showModal);
modalCancelBtn.addEventListener("click", hideModal);
modalXBtn.addEventListener("click", hideModal);
modalCreateBtn.addEventListener("click", createNewTodo);
/* ----- keys Events ----- */
document.addEventListener("keydown", keyEscAndEnter);
