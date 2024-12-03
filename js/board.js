let currentDraggedElement;
let prevent = false; // dient zur Ermittlung, ob Add Task-Karte bei Klick geschlossen werden soll
let filteredTasks = [];

async function loadTasks() {
    try {
        const response = await fetch(`${STORAGE_URL}tasks/`);
        if (!response.ok) {
            throw new Error("Failed to fetch tasks from the backend");
        }
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Error loading tasks:", error);
        alert("Unable to load tasks from the backend. Please try again later.");
    }
}

async function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {
        const response = await fetch(`${STORAGE_URL}tasks/${taskId}/`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert("Task deleted successfully");
        } else {
            alert("Error deleting task");
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Network error. Please try again later.");
    }
}

function renderTasks(tasks) {
    const toDoContainer = document.getElementById("toDo");
    toDoContainer.innerHTML = "";
    tasks.forEach((task) => {
        toDoContainer.innerHTML += `
            <div class="task-card" draggable="true" ondragstart="drag(event)" id="task-${task.id}">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Due: ${task.due_date}</p>
                <p>Priority: <span class="${task.priority}">${task.priority}</span></p>
                <p>Subtasks: ${task.subtasks}</p>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
    });
}

function countTasks() {
    const toDoContainer = document.getElementById("toDo");
    console.log(toDoContainer.getElementsByClassName("task-card").length);
    return toDoContainer.getElementsByClassName("task-card").length;

}


async function editTask(taskId) {
    try {
        const response = await fetch(`${STORAGE_URL}tasks/${taskId}/`);
        if (!response.ok) {
            throw new Error("Failed to fetch task from the backend");
        }

        const task = await response.json();

        const editFormHTML = `
            <div class="edit-task-form">
                <h3>Edit Task</h3>
                <label for="editTitle">Title:</label>
                <input type="text" id="editTitle" value="${task.title}" />

                <label for="editDescription">Description:</label>
                <textarea id="editDescription">${task.description}</textarea>

                <label for="editDueDate">Due Date:</label>
                <input type="date" id="editDueDate" value="${task.due_date}" />

                <label for="editPriority">Priority:</label>
                <select id="editPriority">
                    <option value="urgent" ${task.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
                    <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                </select>

                <label for="editSubtasks">Subtasks:</label>
                <input type="text" id="editSubtasks" value="${task.subtasks}" />

                <button onclick="saveTask(${task.id})">Save</button>
                <button onclick="cancelEdit()">Cancel</button>
            </div>
        `;

        const editContainer = document.getElementById("toDo");
        editContainer.innerHTML = editFormHTML;

    } catch (error) {
        console.error("Error fetching task:", error);
        alert("Unable to load task. Please try again later.");
    }
}

function saveTask(taskId) {
    const updatedTask = {
        title: document.getElementById("editTitle").value,
        description: document.getElementById("editDescription").value,
        due_date: document.getElementById("editDueDate").value,
        priority: document.getElementById("editPriority").value,
        subtasks: document.getElementById("editSubtasks").value,
    };

    fetch(`${STORAGE_URL}tasks/${taskId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
    })
        .then(response => {
            if (response.ok) {
                alert("Task updated successfully");
                loadTasks();
            } else {
                alert("Error updating task");
            }
        })
        .catch(error => {
            console.error("Error updating task:", error);
            alert("Network error. Please try again later.");
        });
}

function cancelEdit() {
    loadTasks();
}

document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
    let searchInput = document.getElementById('findTask');
    searchInput.addEventListener("input", function () {
        searchTask();
    });
});

function cancelEdit() {
    loadTasks();
}






/**
 *  Initializes Board Page
 */
async function loadData() {
    await init();
    filteredTasks = tasks;
    updateHTML();
}

/**
 * Updates the rendered HTML 
 */
async function updateHTML() {
    updateToDo();
    updateInProgress();
    updateAwaitFeedback();
    updateDone();
}

/**
 * Saves Changes of tasks-Array in remote storage
 */
async function saveChanges() {
    // await setItem('tasks', JSON.stringify(tasks));
    await setItem('tasks', tasks);
    filteredTasks = tasks;
}

/**
 * Finds all tasks in "tasks"-Array with status = 'inProgress' and calls functions to render these tasks
 */
function updateInProgress() {
    let inprogress = filteredTasks.filter(t => t['status'] == 'inProgress')
    let status = 'in progress';

    document.getElementById('inProgress').innerHTML = '';

    if (inprogress.length == 0) {
        document.getElementById('inProgress').innerHTML = generateNoTask(status);
    } else

        for (let i = 0; i < inprogress.length; i++) {
            const element = inprogress[i];
            document.getElementById('inProgress').innerHTML += generateTask(element);
            generateSubtask(element);
            renderBoardAssignedIcons(element);
        }
}

/**
 * Finds all tasks in "tasks"-Array with status = 'awaitFeedback' and calls functions to render these tasks
 */
function updateAwaitFeedback() {
    let feedback = filteredTasks.filter(t => t['status'] == 'awaitFeedback');
    let status = 'await Feedback';

    document.getElementById('awaitFeedback').innerHTML = '';

    if (feedback.length == 0) {
        document.getElementById('awaitFeedback').innerHTML = generateNoTask(status);
    } else

        for (let i = 0; i < feedback.length; i++) {
            const element = feedback[i];
            document.getElementById('awaitFeedback').innerHTML += generateTask(element);
            generateSubtask(element);
            renderBoardAssignedIcons(element);
        }

}

/**
 * Finds all tasks in "tasks"-Array with status = 'done' and calls functions to render these tasks
 */
function updateDone() {
    let done = filteredTasks.filter(t => t['status'] == 'done')
    let status = 'done';

    document.getElementById('done').innerHTML = '';

    if (done.length == 0) {
        document.getElementById('done').innerHTML = generateNoTask(status);
    } else

        for (let i = 0; i < done.length; i++) {
            const element = done[i];
            document.getElementById('done').innerHTML += generateTask(element);
            generateSubtask(element);
            renderBoardAssignedIcons(element);
        }
}

/**
 * Saves id of the Element that should be dragged
 * 
 * @param {number} id - ID of dragged Element
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Renders the Task Card
 * 
 * @param {object} element - one task-object in "tasks"-Array
 * @param {number} id - ID of this task in "tasks"-Array
 */
function showTaskCard(element, id) {

    let taskCard = document.getElementById('taskCard');

    taskCard.innerHTML = generateTaskCard(element, id);
    renderCardPrio(element, id);
    renderCardSubtasks(element, id);
    renderCardAssigned(element, id);

    let taskContainer = document.getElementById('taskContainer');

    taskContainer.classList.remove('slideOut');
    taskContainer.classList.add('slideIn');
}


/**
 * The allowDrop function is called to prevent the default browser behavior during drag-and-drop operations and enable dropping.
 * 
 * @param {event} ev
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * This function changes the status of a Task when dropped in new column
 * 
 * @param {string} status - Status of Task
 */
function moveTo(status) {
    tasks[currentDraggedElement]['status'] = status;
    saveChanges();
    updateHTML();
}

/**
 * Highlights the column if task is dragged over
 * 
 * @param {string} id - Id of highlightet column
 */
function highlight(id) {
    document.getElementById(id).classList.add('dragAreaHighlight');
}

/**
 * Removes the highlight when task is not longer dragged over the column
 * 
 * @param {string} id - Id of highlightet column
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('dragAreaHighlight');
}

/**
 * Moves task to previous column
 *  
 * @param {number} id - ID of current Task
 */
function statusUp(id) {
    let newStatus
    let status = tasks[id]['status'];
    if (status === 'toDo') {
        newStatus = 'toDo';
    }
    else if (status === 'inProgress') {
        newStatus = 'toDo';
    }
    else if (status === 'awaitFeedback') {
        newStatus = 'inProgress';
    }
    else if (status === 'done') { newStatus = 'awaitFeedback' }

    tasks[id]['status'] = newStatus;
    saveChanges();
    updateHTML();
}

/**
 * Moves task to next column
 *  
 * @param {number} id - ID of current Task
 */
function statusDown(id) {
    let newStatus
    let status = tasks[id]['status'];
    if (status === 'done') {
        newStatus = 'done';
    }
    else if (status === 'awaitFeedback') {
        newStatus = 'done';
    }
    else if (status === 'inProgress') {
        newStatus = 'awaitFeedback';
    }
    else if (status === 'toDo') { newStatus = 'inProgress'; }

    tasks[id]['status'] = newStatus;
    saveChanges();
    updateHTML();
}

/**
 * Generates the subtask section of a task
 * 
 * @param {object} element - Selected Task Object
 */
function generateSubtask(element) {
    let subtasks = element['subtasks'];
    let subtasksDiv = document.getElementById(`toDoSubtasks${element['id']}`);
    let doneSubtasksDiv = document.getElementById(`toDoSubtasksDone${element['id']}`);
    let progressbarFillerDiv = document.getElementById(`toDoSubtasksProgressFiller${element['id']}`);

    if (subtasks.length == 0) {
        subtasksDiv.classList.add("d-none");
    } else {
        updateProgressBar(subtasks, doneSubtasksDiv, progressbarFillerDiv);
    }
}

/**
 * Renders Icons for assigned Users of a task in board view
 * 
 * @param {object} element - Selected Task Object
 */
function renderBoardAssignedIcons(element) {
    let assigned = element['assignedTo'];
    let assignedDiv = document.getElementById(`taskCardAssignedTo${element['id']}`);

    assignedDiv.innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        let contact = users[i];
        if (assigned.includes(i)) {
            assignedDiv.innerHTML += contactAssignedIconHTML(contact);
        }
    }
}

/**
 * Renders assigned Users of a task in task card view
 * 
 * @param {object} element - Selected task object
 * @param {number} id - ID of selected task
 */
function renderCardAssigned(element, id) {
    let assignedDiv = document.getElementById(`taskAssigned${id}`)
    let assigned = element['assignedTo'];

    assignedDiv.innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        let contact = users[i];
        if (assigned.includes(i)) {
            assignedDiv.innerHTML += taskCardAssignedHTML(contact, id);
        }
    }
}

/**
 * Updates the subtask-progress in board view
 * 
 * @param {array} subtasks - array with all subtasks of a task
 * @param {string} doneSubtasksDiv - ID of div 
 * @param {string} progressbarFillerDiv - ID of div
 */
function updateProgressBar(subtasks, doneSubtasksDiv, progressbarFillerDiv) {
    let trueCount = 0;
    for (let i = 0; i < subtasks.length; i++) {
        if (subtasks[i]['status'] == 'done') {
            trueCount++;
        }
    }
    let barWidth = document.querySelector('.toDoSubtasksProgress').offsetWidth;
    doneSubtasksDiv.innerHTML = `${trueCount}`;
    let fillWidth = barWidth * (trueCount / subtasks.length);
    progressbarFillerDiv.style.width = `${fillWidth}px`;
}

/**
 * Task-Karte entfernen
 */
function closeTask() {
    if (!prevent) {
        let taskContainer = document.getElementById('taskContainer');
        taskContainer.classList.remove('slideIn');
        taskContainer.classList.add('slideOut');
        updateHTML();
    }
    prevent = false;
}

/**
 * verhindern, dass Task-Karte entfernt wird
 */
function preventClosing() {
    prevent = true;
    // per Bubbling wird anschließend closeTask() aufgerufen und setzt im selben Klick wieder prevent = false
}

/**
 * Renders Prio of a task after turning the first letter to a capital
 * 
 * @param {object} task - task object
 * @param {number} id - id of task
 */
function renderCardPrio(task, id) {
    prio = task["prio"];
    result = prio.charAt(0).toUpperCase() + prio.slice(1);
    document.getElementById(`taskPrio${id}`).innerHTML = `${result}`;
}

/**
 * updates subtasks in tasks-array after checking/unchecking box
 * 
 * @param {number} id - id of task
 * @param {number} i - index of subtask
 */
function updateSubtask(id, i) {
    if (tasks[id].subtasks[i].status == 'toDo') {
        tasks[id].subtasks[i].status = 'done';
    }
    else {
        tasks[id].subtasks[i].status = 'toDo';
    }
    renderCardSubtasks(tasks[id], id);
    saveChanges();
}

/**
 * Opens add task view
 * 
 * @param {string} status - status the new task will get
 */
async function addTaskBtn(status) {
    if (window.innerWidth > 700) {
        await showAddTaskCard(status);
    } else {
        window.location.href = './add_task.html';
    }
}

/**
 * Add Task-Overlay aufrufen
 * @param {string} status - Bearbeitungsstatus des Tasks
 */
async function showAddTaskCard(status) {
    addTask = document.getElementById('taskCard');
    addTask.innerHTML = generateAddTaskTemplateAll();
    taskCard = document.getElementById('addTaskCard');
    await initAddTask(status);
    taskCard.style.display = '';
    taskCard.classList.add('slideIn');
    changeClearBtn(); // Clear-Button durch Cancel-Button ersetzen
}

/**
 * Renders edit task card
 * 
 * @param {string} status - status of task
 */
async function showEditTaskCard(status) {
    addTask = document.getElementById('taskCard2');
    addTask.innerHTML = '';
    addTask.innerHTML += generateEditTaskHeader();
    addTask.innerHTML += generateAddTaskTemplateInner();
    taskCard = document.getElementById('addTaskCard');
    taskCard.classList.add('editTaskCard');
    await initAddTask(status);
    taskCard.style.display = '';
    hideClearBtn();
}

/**
 * Filters all tasks live depending on user input
 */
function searchTask() {
    let search = document.getElementById('findTask').value.toLowerCase();
    filteredTasks = [];
    for (let i = 0; i < tasks.length; i++) {
        let title = tasks[i]['title'].toLowerCase();
        let description = tasks[i]['description'].toLowerCase();
        if (title.includes(search) || description.includes(search)) {
            filteredTasks.push(tasks[i]);
        }
    }
    updateHTML();
}

document.addEventListener("DOMContentLoaded", function () {
    updateHTML();
    let searchInput = document.getElementById('findTask');
    searchInput.addEventListener("input", function () {
        searchTask();
    });
});

