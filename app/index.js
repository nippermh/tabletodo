const db = localStorage;
let tbody = document.querySelector("tbody");

function getAllTasks() {
  // Parse tasks from locastoroge
  let tasks = JSON.parse(db.getItem("tasks"));
  // clear the current DOM state before appending the new list. 
  //This will prevent us from displaying duplicates
  tbody.innerHTML = "";

  // Display all tasks
  if (tasks) { //removed length
    tasks.map((task, i) => {
      tbody.innerHTML += `
      <tr >
        <td>${i + 1}</td>
        <td class="task-name task-item">${task.name}</td>
        <td>
          <span id=${task.id}>
            <button class="btn edit" >Edit</button>
            <button class="btn delete" >Delete</button>
          </span>
        </td>
      </tr>
      `;
    });
  } else {
    db.setItem("tasks", JSON.stringify([]));
  }
}
getAllTasks();

document.addEventListener("DOMContentLoaded", () => {
  let form = document.querySelector("#form");
  const controlBtns = document.querySelectorAll(".btn");

  //on submit data
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let value = document.querySelector("#task").value;
    let currentTasks = null; 
    let data = [{id: "", name: "",},];

    if (db.length) {
      currentTasks = JSON.parse(db.getItem("tasks"));

      data = [
        ...currentTasks,
        {
          id: new Date().getMilliseconds().toString(),
          name: value,
        },
      ];
    } else {
      data = [
        {
          id: new Date().getMilliseconds().toString(),
          name: value,
        },
      ];
    }
    db.setItem("tasks", JSON.stringify(data));

    //add the inputted task
    // getAllTasks();
    window.location.reload();
  });

  //manipulating list items

  // Define the callback functions here and write the logic
  const editTodo = (event, id) => {
    editableItem =
      event.target.parentNode.parentNode.parentNode.querySelector(".task-name");
    editableItem.contentEditable = true;
    editableItem.focus();
    editableItem.style.backgroundColor = "#dddbdb";
    let editedTask = "";
    let currentItem = editableItem.textContent;
    editableItem.addEventListener("input", () => {
      editedTask = editableItem.textContent;
    });

      editableItem.addEventListener("blur", () => {
      // make content read-only
      editableItem.contentEditable = false;
      // change background color to white
      editableItem.style.backgroundColor = "#fff";
      // get edited element
      let currentTasks = JSON.parse(db.getItem("tasks")).map((task) => {
        if (id === task.id) {
          return { ...task, name: editedTask || currentItem };
        } else {
          return task;
        }
      });
      // update storage
      db.setItem("tasks", JSON.stringify(currentTasks));
    });
  };

  // Delete todo
  const deleteTodoById = (id) => {
    console.log(id);
    // remove element to be deleted form collection
    let tasksInDb = JSON.parse(db.getItem("tasks")).filter(
      (task) => task.id != id
    );
    db.setItem("tasks", JSON.stringify(tasksInDb));
    // reload window
    window.location.reload();
  };

  // Check action [delete or edit]
  function checkAction(event) {
    let id = event.target.parentNode.id;
    if (event.target.classList.contains("delete")) {
      deleteTodoById(id);
    } else {
      editTodo(event, id);
    }
  }

  // Add event listener
  controlBtns.forEach((btn) => {
    btn.addEventListener("click", checkAction);
  });
});