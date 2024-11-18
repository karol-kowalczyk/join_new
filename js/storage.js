const STORAGE_URL = 'http://127.0.0.1:8000/contacts/';
let contacts = [];

async function loadContacts() {
    let rsp = await fetch(STORAGE_URL);
    let rspJson = await rsp.json();
    console.log(rspJson)

    contacts = [...rspJson];
    console.log(contacts);
}







/**
 * This function initiate and loads the contact list
 */
async function initContacts() {
    await init();
    await loadContacts();
    renderContacts();
}


/**
 * This function creates the alphabet group container
 */
function renderContacts() {
    let contactContainer = document.getElementById('myContactsContainer');
    contactContainer.innerHTML = ''; // Container leeren

    // Kontakte rendern
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        // Füge HTML hinzu mit den Eigenschaften des Kontakts
        contactContainer.innerHTML += `
            <div class="contact-card">
                <h2>${contact.name}</h2>
                <p>Email: ${contact.email}</p>
                <p>Phone: ${contact.phone}</p>
            </div>
        `;
    }

        // for (let i = 0; i < contacts.length; i++) {
    //     let contact = contacts[i];
    //     if (!document.getElementById(contact['letter'])) {
    //         contactContainer.innerHTML += alphabetContainerHtml(contact['letter']);
    //     }
    //     let letterContainer = document.getElementById(contact['letter']);
    //     letterContainer.innerHTML += contactCardHTML(contact, i);
    // }
}



/**
 * Function to save new data in the remote storage
 * @param {Object} value - Data to be sent to the API (e.g., {name, email, handy})
 * @returns {Object} - The response from the API
 */
async function addContact(value) {
    let response = await fetch(STORAGE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(value)
    });
    return await response.json();
}

/**
 * Function to load all data from the remote storage
 * @returns {Array} - List of all contacts
 */
async function getAllContacts() {
    let response = await fetch(STORAGE_URL);
    return await response.json();
}

/**
 * Function to delete a contact by ID
 * @param {string} id - ID of the contact to delete
 * @returns {Object} - The response from the API
 */
async function deleteContact(id) {
    let response = await fetch(`${STORAGE_URL}${id}/`, {
        method: "DELETE",
    });
    if (response.ok) {
        return { message: "Contact deleted successfully" };
    } else {
        return { error: "Failed to delete contact" };
    }
}

/**
 * Function to update a contact by ID
 * @param {string} id - ID of the contact to update
 * @param {Object} value - Updated data (e.g., {name, email, handy})
 * @returns {Object} - The updated contact
 */
async function updateContact(id, value) {
    let response = await fetch(`${STORAGE_URL}${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(value)
    });
    return await response.json();
}
