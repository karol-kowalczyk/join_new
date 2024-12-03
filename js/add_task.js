const PRIOS = [null, 'urgent', 'medium', 'low'];



let submitOnEnter = true;
let currentTask = {};
let message = 'Task added to board';
// let tasks = [];

async function addTaskToDatabase() {
    const taskData = {
        title: addTaskTitle.value,
        description: addTaskDescription.value,
        due_date: addTaskDue.value,
        priority: PRIOS[getTaskPrioId()],
        subtasks: currentTask['subtasks'] || ""
    };

    // Holen des Tokens aus dem localStorage
    const token = localStorage.getItem('token');  // Der Schlüssel 'token' sollte dem entsprechen, was du verwendest
    console.log(token);
    // Überprüfen, ob das Token vorhanden ist
    if (!token) {
        alert("Fehler: Kein Authentifizierungstoken gefunden.");
        return;
    }

    try {
        const response = await fetch(`${STORAGE_URL}tasks/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Token im Header übergeben
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            showToastMsg('Task added to board!');
            const newTask = await response.json();
            console.log("Task successfully added:", newTask);
            resetTaskForm();
            goToBoard();
        } else {
            const errorData = await response.json();
            console.error("Error adding task:", errorData);
            alert("Error: Unable to add task. Please try again.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error: Unable to connect to the server.");
    }
}



/**
 * falls Add Task im Board geöffnet und Fenster auf 1-Spalten-Layout skaliert wird, Fenster schließen
 * (Add-Button leitet bei dieser Fenstergröße auf add_task.html weiter)
 */
window.addEventListener('resize', function () {
    if (isAddTaskFromBoard()) {
        let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        if (viewportWidth <= 700) {
            closeTask();
        }
    }
});


/**
 * Überprüfung, ob das Add Task-Formular vom Board aus aufgerufen wurde
 * @returns true, falls vom Board aus aufgerufen, sonst false
 */
function isAddTaskFromBoard() {
    return document.getElementById('addTaskForm') && document.getElementById('taskContainer') &&
        !document.getElementById('addTaskCard').classList.contains('editTaskCard');
}


/**
 * Initialisierung (bei Onload, Body)
 * @param {string} status - Bearbeitungsstatus des Tasks
 */
async function initAddTask(status) {
    initCurrentTask();
    await init();
    styleWebkit();
    submitBtn.disabled = true;
    renderAddTaskForm();
    document.addEventListener('keydown', submitFormOnEnter);
    let today = new Date();
    addTaskDue.min = today.toISOString().slice(0, -14);
    submitBtn.disabled = false;
    currentTask['status'] = status;
}


/**
 * Initialisierung des globalen "currentTask"-JSONs zum Zwischenspeichern
 */
function initCurrentTask() {
    currentTask = {
        id: -1,
        assignedTo: [],
        subtasks: [],
        status: ''
    }
}


/**
 * Custom-Icons für Webkit-Browser
 */
function styleWebkit() {
    if ('WebkitAppearance' in document.documentElement.style && !('MozAppearance' in document.documentElement.style)) {
        addTaskDescription.classList.add('customResizeHandle');
        addTaskDue.classList.add('customDatePicker');
    }
}


/**
 * Initialisierung des Bearbeitungsmodis
 * @param {number} id - Laufindex des Tasks im globalen tasks-Array
 */
async function editTask(id) {
    let task = tasks[id];
    await showEditTaskCard(task['status']);
    setCurrentTaskEdit(task);
    renderAddTaskForm();
    togglePrioTransition();
    unselectPrioBtn(2);
    prefillForm(task);
    togglePrioTransition();
    setFormEdit();
}


/**
 * currentTask zur Initialisierung des Bearbeitungsmodus zwischenspeichern
 * @param {JSON} task - Task-JSON aus Tasks-Array 
 */
function setCurrentTaskEdit(task) {
    currentTask['id'] = task['id'];
    currentTask['assignedTo'] = task['assignedTo'];
    currentTask['subtasks'] = task['subtasks'];
}


/**
 * Task entfernen
 * @param {number} id - ID des Tasks im tasks-Array 
 */
async function deleteTask(id) {
    tasks.splice(id, 1);
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        task['id'] = i;
    }
    await setItem('tasks', tasks);
    showToastMsg('Task deleted');
    goToBoard();
}


/**
 * allgemeine Render-Funktion
 */
function renderAddTaskForm() {
    renderAddTaskAssignedList();
    renderAddTaskSubtasks();
}


/**
 * Form zur Bearbeitung vorausfüllen
 * @param {JSON} task - Task-JSON aus tasks-Array 
 */
function prefillForm(task) {
    const prio = PRIOS.indexOf(task['prio']);
    addTaskTitle.value = task['title'];
    addTaskDescription.value = task['description'];
    precheckAssignedList();
    addTaskDueText.value = task['due'];
    addTaskDue.value = transformDate(task['due']);
    stylePrioBtn(prio, prio);
    addTaskCategory.value = categories[task['category']];
}


/**
 * Clear-Button durch Cancel-Button ersetzen
 */
function changeClearBtn() {
    hideClearBtn();
    addTaskCancelBtn.style.display = '';
}


/**
 * Clear-Button verbergen
 */
function hideClearBtn() {
    addTaskClearBtn.style.display = 'none';
}


/**
 * Form-Details im Bearbeitungsmodus, die über erstes Rendern und Vorausfüllen hinausgehen
 */
function setFormEdit() {
    addTaskHeadline.style.display = 'none';
    addTaskCategoryContainer.style.display = 'none';
    addTaskCancelBtn.style.display = 'none';
    submitBtn.innerHTML = 'Ok';
    message = 'Task edited';
}


/**
 * assigned-Liste rendern
 */
function renderAddTaskAssignedList() {
    const list = document.getElementById('addTaskAssignedMenu');
    list.innerHTML = '';
    renderActiveUserToAssignedList();
    for (let i = 0; i < users.length; i++) {
        if (i != userId) {
            let checkbox = 'assignedContact' + i;
            list.innerHTML += contactAssignedHTML(users[i], checkbox);
        }
    }
}


/**
 * aktiven User (ausgenommen Guest) zuerst rendern
 */
function renderActiveUserToAssignedList() {
    if (userId != -1) {
        const list = document.getElementById('addTaskAssignedMenu');
        let checkbox = 'assignedContact' + userId;
        list.innerHTML += contactAssignedHTML(users[userId], checkbox);
    }
}


/**
 * (Bearbeitungsmodus:) Vorauswahl zugeordneter Kontakte im Dropdown-Menü
 */
function precheckAssignedList() {
    const assigned = currentTask['assignedTo'];
    for (let i = 0; i < users.length; i++) {
        if (assigned.includes(i)) {
            let checkboxId = 'assignedContact' + i;
            let checkbox = document.getElementById(checkboxId);
            toggleAssignedStyle(checkbox);
        }
    }
}


/**
 * assigned-Icons rendern
 */
function renderAddTaskAssignedIcons() {
    const assigned = currentTask['assignedTo'];
    assignedIcons.innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        let contact = users[i];
        if (assigned.includes(i)) {
            assignedIcons.innerHTML += contactAssignedIconHTML(contact);
        }
    }
}


/**
 * bei Enter-Key Submit-Button auslösen (Ergänzung zu HTML-Mechanik)
 * @param {event} e - Event für Key-Abfrage
 */
function submitFormOnEnter(e) {
    if (submitOnEnter) {
        if (addTaskForm && e.key == 'Enter') {
            unfocusAll();
            submitBtn.click();
            addTaskToDatabase();
        }
        removeEventListener('keydown', submitFormOnEnter);
    }
}


/**
 * Formular resetten
 */
function resetTaskForm() {
    const prio = getTaskPrioId();
    if (prio) {
        unselectPrioBtn(prio);
    }
    stylePrioBtn(2, 2);
    currentTask['assignedTo'] = [];
    currentTask['subtasks'] = [];
    renderAddTaskForm();
}


/**
 * Task hinzufügen und zum Board weiterleiten
 */
async function submitTask() {
    setAddTaskDueText();
    const currentId = currentTask['id'];

    // Initialisiere 'tasks', falls es noch nicht existiert
    if (!tasks) {
        tasks = [];
    }

    if (currentId == -1) {
        tasks.push(generateTaskJSON(tasks.length));
    } else {
        tasks[currentId] = generateTaskJSON(currentId);
    }

    submitBtn.disabled = true;
    await setItem('tasks', tasks);
    submitBtn.disabled = false;
    showToastMsg(message);
    goToBoard();
}

/**
 * JSON-String für neuen oder bearbeiteten Task erzeugen
 * @param {number} id - ID des Tasks im tasks-Array 
 * @returns Task-JSON im Format des tasks-Arrays
 */
function generateTaskJSON(id) {
    return {
        id: id,
        title: addTaskTitle.value,
        description: addTaskDescription.value,
        assignedTo: currentTask['assignedTo'],
        due: addTaskDueText.value,
        prio: PRIOS[getTaskPrioId()],
        category: categories.indexOf(addTaskCategory.value),
        subtasks: currentTask['subtasks'] | [],
        timestamp: getTimestamp(),
        status: currentTask['status']
    };
}


/**
 * Message in Viewport bewegen
 */
function showToastMsg(message) {
    const container = document.getElementById('toastMsg');
    container.innerHTML = '';
    container.innerHTML += message;
    container.innerHTML += '<img src="./assets/img/menu_icons/board.svg" alt="icon">';
    container.style.bottom = '50vh';
}


/**
 * Weiterleitung zum Kanban-Board
 */
function goToBoard() {
    window.setTimeout(function () {
        window.location.href = './board.html';
    }, 500);
}