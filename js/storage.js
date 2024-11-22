const STORAGE_URL = 'http://127.0.0.1:8000/api/';
let contacts = [];

async function loadContacts() {
    let rsp = await fetch(STORAGE_URL+'contacts/');
    let rspJson = await rsp.json();
    console.log(rspJson)

    contacts = rspJson;
    console.log(contacts);
}

async function deleteContact(contactId) {
    try {
        const response = await fetch(`${STORAGE_URL}contacts/${contactId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log(`Contact with ID ${contactId} deleted successfully.`);
            await loadContacts(); // Kontakte neu laden
        } else {
            const errorData = await response.json();
            console.error("Error deleting contact:", errorData);
            alert("Error: Unable to delete contact.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error: Unable to connect to the server.");
    }
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
                <button onclick="deleteContact(${contact.id})">DEL</button>
                <button onclick="editContact(${contact.id})">EDIT</button>
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
 * Function to edit a contact
 * @param {number} id - ID of the contact to edit
 */
async function editContact(id) {
    const response = await fetch(`${STORAGE_URL}contacts/${id}/`);
    if (!response.ok) {
        alert("Contact not found.");
        return;
    }

    const contact = await response.json();

    const newName = prompt("Enter new name:", contact.name);
    const newEmail = prompt("Enter new email:", contact.email);
    const newPhone = prompt("Enter new phone:", contact.phone);

    try {
        const updatedContact = {
            name: newName || contact.name,
            email: newEmail || contact.email,
            phone: newPhone || contact.phone
        };

        await updateContact(id, updatedContact);
        await loadContacts(); // Kontakte neu laden
        alert("Contact updated successfully.");
    } catch (error) {
        console.error("Error updating contact:", error);
        alert("Error: Unable to update contact.");
    }
}


/**
 * Function to save new data in the remote storage
 * @param {Object} value - Data to be sent to the API (e.g., {name, email, handy})
 * @returns {Object} - The response from the API
 */
async function addContact(value) {
    let response = await fetch(STORAGE_URL+'contacts/', {
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
 * Function to update a contact by ID
 * @param {string} id - ID of the contact to update
 * @param {Object} value - Updated data (e.g., {name, email, handy})
 * @returns {Object} - The updated contact
 */
async function updateContact(id, value) {
    let response = await fetch(`${STORAGE_URL}contacts/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(value)
    });
    return await response.json();
}


async function saveNewContact() {

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactMail').value;
    const phone = document.getElementById('contactNumber').value;

    if (!name || !email || !phone) {
        alert('Bitte füllen Sie alle Felder aus.');
        return;
    }


    const newContact = {
        name: name,
        email: email,
        phone: phone
    };

    try {

        const response = await fetch(STORAGE_URL+'contacts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // JSON-Daten senden
            },
            body: JSON.stringify(newContact) // JSON-Daten aus dem Objekt erstellen
        });


        if (response.ok) {
            const responseData = await response.json();
            console.log('Neuer Kontakt erfolgreich gespeichert:', responseData);
            alert('Kontakt wurde erfolgreich gespeichert!');
            closeAddCardOne(); 
        } else {
            const errorData = await response.json();
            console.error('Fehler beim Speichern des Kontakts:', errorData);
            alert('Es ist ein Fehler aufgetreten. Überprüfen Sie die Eingaben.', errorData);
        }
    } catch (error) {
        console.error('Netzwerkfehler:', error);
        alert('Es konnte keine Verbindung zur API hergestellt werden.');
    }
}
