/**
 * Generates HTML code for Task in board view
 * 
 * @param {number} element - Task ID
 * @returns - HTML code
 */
function generateTask(element) {
    return /* html */ `
    <div draggable="true" ondragstart="startDragging(${element['id']})" onclick="showTaskCard(tasks[${element['id']}], ${element['id']})" class="todo">
        <div class=headerTaskCard>
            <div class="toDoCategory${element['category']}"> ${categories[element['category']]} </div>
            <div class=changeStatusMobile> 
                <div onclick="statusUp(${element['id']}); event.stopPropagation()"> <img  src="./assets/img/arrow-left-line.svg" class="statusUp" alt="up"> </div>
                <div onclick="statusDown(${element['id']}); event.stopPropagation()"> <img src="./assets/img/arrow-left-line.svg" class="statusDown" alt="down"> </div>
            </div>
        </div>
        <div>
            <div class="toDoTitle"> ${element['title']} </div>
            <div class="toDoDescription"> ${element['description']}</div>
        </div>
        <div class="toDoSubtasks" id="toDoSubtasks${element['id']}">
            <div class="toDoSubtasksProgress">
                <div class="toDoSubtasksProgressFiller" id= "toDoSubtasksProgressFiller${element['id']}">
                </div>
            </div>  
            <div class="toDoSubtasksCount">
                <div id="toDoSubtasksDone${element["id"]}">  
                </div>
                ${element['subtasks'].length > 0 ? '/' + element['subtasks'].length : ''}
                 Subtask
            </div>
        </div>
        <div class="toDoBottom">
            <div class="toDoAssignedContainer" id="taskCardAssignedTo${element['id']}">  </div>
            <div class="toDoPrio">
                <img src="./assets/img/prio_icons/task_prio_${element['prio']}.svg" alt="icon">
            </div>
        </div>
    </div>`
}


/**
 * Generates HTML for empty Columns
 * 
 * @param {string} status - Status of Column
 * @returns - HTML code
 */
function generateNoTask(status) {
    return /* html */`
            <div class="noTaskContainer">
                <div class="noTask">No tasks ${status}</div>
            </div>`
}


/**
 * Generates HTML for Task Card
 * 
 * @param {object} task - Task-object in "tasks"-Array
 * @param {number} id - ID of the task
 * @returns 
 */
function generateTaskCard(task, id) {
    return /* html */`    
    <div id="taskContainer" onclick="closeTask()">
        <div id="taskCard2" class="taskCard showTaskCard textOverflow" onclick="preventClosing()">
            <div class="taskCardHeader">
                <div class="taskCardCategory${task['category']}" id="taskCardCategory${id}">
                    ${categories[task['category']]}
                </div>
                <div onclick="closeTask()">
                    <img class="closeTask" src="./assets/img/cancel.svg" alt="Close">
                </div>
            </div>
            <div class="taskTitle"> ${task["title"]}</div>
            <div class="taskDescription"> ${task["description"]}</div>
            <div class="taskDate">
              <div class="taskSection">Due date:</div>
              <div id="taskDate${id}">${task["due"]}</div>
            </div>
            <div class="taskPrio" id="">
                <div class="taskSection">Priority:</div>
                <div class="taskPrioText" id="taskPrio${id}">${task["prio"]}</div>
                <div class="taskPrioIcon" >
                <img src="./assets/img/prio_icons/task_prio_${task['prio']}.svg" alt="icon">
                </div>
            </div>

            <div class="taskAssignedContainer">
                <div class="taskSection">Assigned To:</div>
                <div class="taskAssigned" id="taskAssigned${id}"></div>
            </div>


            <div class="subtasksContainerBoard">
                <div class="taskSection">Subtasks:</div>
                <div class="subtasks" id="subtasks"></div>
            </div>
            <div class="taskFooter">

                <div onclick="deleteTask(${id})" class="deleteTask">
                    <img class="deleteTaskImg" src="./assets/img/delete.svg" alt="">
                    <div>Delete</div>
                </div>
                <div class="taskFooterSeparator"></div>
                <div onclick="editTask(${id})" class="editTask"> <img class="editTaskImg" src="./assets/img/edit.svg">
                    <div>Edit</div>
                </div>
            </div>

        </div>
    </div>`
}


/**
 * Generates HTML for Task Card Assigned section
 * 
 * @param {object} contact - User object (name, e-mail, password, initials, color)
 * @returns - HTML code
 */
function taskCardAssignedHTML(contact) {
    let html = '';
    html += `
    <div class="d-flex">
        ${contactAssignedIconHTML(contact)}
        <div class="contactDetails">
            <div>${contact['name']}     
    </div>`
    return html;
}


/**
 * Renders Subtask section on Task Card
 * 
 * @param {object} task - task object
 * @param {number} id - id of task object
 */
function renderCardSubtasks(task, id) {
    let subtasks = document.getElementById('subtasks');
    subtasks.innerHTML = '';
    if (task.subtasks.length === 0) {
        subtasks.innerHTML = '<div class="taskCardSubtask"><span>No subtask createt</span></div>'
    } else
        for (let i = 0; i < task.subtasks.length; i++) {
            subtasks.innerHTML += `
            <div class="taskCardSubtask">
              <input
                id="checkboxSubtask${i}"
                type="checkbox"
                onclick="updateSubtask(${id}, ${i})"
                ${task.subtasks[i]['status'] === "done" ? "checked" : ""} 
              />
              <p onclick="updateSubtask(${id}, ${i})">${task.subtasks[i]['title']}</p>
            </div>`
        }
}


/**
 * Generates HTML of add task template
 * 
 * @returns - HTML code
 */
function generateAddTaskTemplateAll() {
    let html = `<div id="taskContainer" class="addTaskCardContainer" onclick="closeTask()">`;
    html += generateAddTaskTemplateInner();
    html += `</div>`;
    return html
}


/**
 * Generates the inner HTML of add task template
 * 
 * @returns - HTML code
 */
function generateAddTaskTemplateInner() {
    return /* html */ `
        <div class="addTaskCard" onclick="preventClosing()" style="display: none" id="addTaskCard" w3-include-html="assets/templates/add_task_template.html"></div>
    `;
}


/**
 * Generates the edit task header
 * 
 * @returns HTML code
 */
function generateEditTaskHeader() {
    return /* html */ `
        <div class="taskCardHeader">
            <div></div>
            <div onclick="closeTask()">
                <img class="closeTask" src="./assets/img/cancel.svg" alt="Close">
            </div>
        </div>
    `;
}