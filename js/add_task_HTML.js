/**
 * erzeugt Kontaktfeld für assignedTo-Dropdown-Menü
 * @param {JSON} contact - Kontaktdaten
 * @param {string} id - ID des Kontakts ('assignedContact' + Index) 
 * @returns HTML-String
 */
function contactAssignedHTML(contact, id) {
    let html = '';
    html += /* html */`
    <li onclick="event.stopPropagation(); toggleAssigned(${id})">
        ${contactAssignedIconHTML(contact)}
        <div class="contactDetails">
            <div>${contact['name']}`;
    if (id == 'assignedContact' + userId) {
        html += ' (You)';
    }
    html += /* html */`</div>
            </div>
            <button type="button">
                <img id="${id}" src="./assets/img/checkbox.svg" alt="unchecked">
            </button>
        </li>`;
    return html;
}


/**
 * erzeugt Kontakt-Icon unter assignedTo-Eingabefeld
 * @param {JSON} contact - Kontaktdaten
 * @returns HTML-String
 */
function contactAssignedIconHTML(contact) {
    return /* html */`
        <div class="contactInitials" style="background: ${contact['color']}">
            <span>${contact['initials']}</span>
        </div>    
    `;
}


/**
 * erzeugt Subtask für Subtasks-Liste
 * @param {string} subtask - Subtask-Titel (wie in ['subtasks'][#]['title'])
 * @param {number} index - Laufindex zur Identifikation
 * @returns HTML-String
 */
function subtaskHTML(subtask, index) {
    return /* html */`
        <li id="subtask${index}">
            &bull;
            <span ondblclick="editSubtask(${index})">${subtask}</span>
            <button type="button" onclick="event.stopPropagation(); editSubtask(${index})">
                <img src="./assets/img/edit.svg" alt="edit subtask">
            </button>
            <div class="vr"></div>
            <button type="button" onclick="removeSubtask(${index})">
                <img src="./assets/img/remove.svg" alt="remove subtask">
            </button>
        </li>`;
}


/**
 * erzeugt Bearbeitungsfeld für Subtask in Subtasks-Liste
 * @param {string} subtask - Subtask-Titel (wie in ['subtasks'][#]['title'])
 * @param {number} index - Laufindex zur Identifikation
 * @returns HTML-String
 */
function editSubtaskHTML(subtask, index) {
    return /* html */`
        <input id="editSubtaskInput" onclick="event.stopPropagation()" type="text" value="${subtask}">    
        <button type="button" onclick="event.stopPropagation(); removeSubtask(${index})" class="subtasksButton">
            <img src="./assets/img/remove.svg" alt="remove subtask">
        </button>
        <div class="vr"></div>
        <button type="button" onclick="event.stopPropagation(); confirmSubtaskEdit(${index})" class="subtasksButton">
            <img src="./assets/img/check.svg" alt="confirm subtask edit">
        </button>
    `;
}