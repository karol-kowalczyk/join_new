/**
 * This function creates the etit form
 * It shows the current contact informations
 * @param {*} index - place of the current contact within the contacts array
 */
function renderEditForm(index) {
    let editCard = document.getElementById('editCardOne');
    editCard.innerHTML = '';

    let initial = getInitials(contacts[index]['name']);

    editCard.innerHTML = /* html */`
        <div class="leftBlueSection">
            <img class="closeAddCard d-none" onclick="editCardWindow(false)" src="./assets/img/contacts/close.svg">
            <img class="smallCardLogo" src="./assets/img/contacts/logo_card.svg">
            <div class="cardTitle">
                <span class="addCardHeadline">Edit Contact</span>
                <div id="devider3"></div>
            </div>
        </div>

        <div class="cardInitials_bg" style="background-color: ${contacts[index]['color']}">
            <span class="cardIntitials">${initial}</span>
        </div>

        <img class="closeAddContact_btn" src="./assets/img/contacts/close.svg" onclick="editCardWindow(false)">

        <form id="editForm" onsubmit="editCurrentContact(${index}); return false">
            <div class="addContactInputContainer"><input id="editName" class="addContactInput" type="text" placeholder="Name"><img src="./assets/img/contacts/person.svg"></div>
            <div class="addContactInputContainer"><input id="editMail" class="addContactInput" type="email" placeholder="Email"><img src="./assets/img/contacts/mail.svg"></div>
            <div class="addContactInputContainer"><input id="editNumber" class="addContactInput" type="tel" placeholder="Phone"><img src="./assets/img/contacts/call.svg"></div>
            <div class="addSummit_btn">
                <button class="addContactCancel_btn">Cancel<img src="./assets/img/contacts/iconoir_cancel.svg"></button>
                <button class="addContactCreate_btn">Save<img src="./assets/img/contacts/check.svg"></button>
            </div>
        </form>
    `;

    prefillEditForm(index);
}


/**
 * Loads the current contact informations
 * @param {*} index - place of the current contact within the contacts array
 */
function prefillEditForm(index) {
    const contact = contacts[index];
    editName.value = contact['name'];
    editMail.value = contact['mail'];
    editNumber.value = contact['number'];
}


/**
 * This function creates the etit form (mobile)
 * It shows the current contact informations
 * @param {*} index - place of the current contact within the contacts array
 */
function renderMobileEditForm(index) {
    let mobileEditCard = document.getElementById('mobileEditCardOne');
    mobileEditCard.innerHTML = '';

    let initial = getInitials(contacts[index]['name']);
    mobileEditCard.innerHTML = /* html */`
    <div class="mobileLeftBlueSection">
            <img class="mobileCloseAddCard d-none" onclick="editCardWindow(false)" src="./assets/img/contacts/close.svg">
            <div class="mobileAddCardTitle">
                <span class="addCardHeadline">Edit Contact</span>
                <div class="mobileDevider3"></div>
            </div>
        </div>
        <div class="mobileCardInitials_bg" style="background-color: ${contacts[index]['color']}">
            <span class="mobileCardIntitials">${initial}</span>
        </div>
        <img class="mobileCloseAddContact_btn" src="./assets/img/contacts/close.svg" onclick="editCardWindow(false)">
        <form id="editMobileForm" onsubmit="mobileEditCurrentContact(${index}); return false">
            <div class="addContactInputContainer"><input id="editMobileName" class="addContactInput" type="text" placeholder="Name"><img src="./assets/img/contacts/person.svg"></div>
            <div class="addContactInputContainer"><input id="editMobileMail" class="addContactInput" type="email" placeholder="Email"><img src="./assets/img/contacts/mail.svg"></div>
            <div class="addContactInputContainer"><input id="editMobileNumber" class="addContactInput" type="tel" placeholder="Phone"><img src="./assets/img/contacts/call.svg"></div>
            <div class="mobileAddSummit_btn">
                <button class="mobileAddContactCancel_btn">Cancel<img src="./assets/img/contacts/iconoir_cancel.svg"></button>
                <button class="mobileAddContactCreate_btn">Save<img src="./assets/img/contacts/check.svg"></button>
            </div>
        </form>
        `;

    prefillMobileEditForm(index);
}


/**
 * Loads the current contact informations (mobile)
 * @param {*} index - place of the current contact within the contacts array
 */
function prefillMobileEditForm(index) {
    const contact = contacts[index];
    editMobileName.value = contact['name'];
    editMobileMail.value = contact['mail'];
    editMobileNumber.value = contact['number'];
}


/**
 * this function pulls all informations out of the edit form
 * @param {*} index - place of the current contact within the contacts array
 * @param {string} newName - returns the current name
 * @param {string} newMail - returns the current mail
 * @param {string} newNumber - returns the current number
 * @param {string} firstLetter - returns the firstletter of the name
 */
function editCurrentContact(index) {
    let name = document.getElementById('editName');
    let mail = document.getElementById('editMail');
    let number = document.getElementById('editNumber');

    let getName = name.value;
    let firstLetter = getName.charAt(0).toUpperCase();

    let newName = name.value;
    let newMail = mail.value;
    let newNumber = number.value;

    getNewContactInformation(index, newName, newMail, newNumber, firstLetter);
    refreshContactList();
    editCardWindow(false);
    showContactCard(index);
}


/**
 * this function pulls all informations out of the edit form (mobile)
 * @param {*} index - place of the current contact within the contacts array
 * @param {string} newName - returns the current name
 * @param {string} newMail - returns the current mail
 * @param {string} newNumber - returns the current number
 * @param {string} firstLetter - returns the firstletter of the name
 */
function mobileEditCurrentContact(index) {
    let name = document.getElementById('editMobileName');
    let mail = document.getElementById('editMobileMail');
    let number = document.getElementById('editMobileNumber');

    let getName = name.value;
    let firstLetter = getName.charAt(0).toUpperCase();

    let newName = name.value;
    let newMail = mail.value;
    let newNumber = number.value;

    getNewContactInformation(index, newName, newMail, newNumber, firstLetter);
    refreshContactList();
    editCardWindow(false);
    showContactCard(index);
}


/**
 * this function is pushing all informations to the contacts array
 * @param {*} index - place of the current contact within the contacts array
 * @param {string} newName - new/ current name
 * @param {string} newMail - new/ current mail
 * @param {string} newNumber - new/ current number
 * @param {string} firstLetter - returns the firstletter of the current name
 */
function getNewContactInformation(index, newName, newMail, newNumber, firstLetter) {

    let editContact = {
        'name': newName,
        'mail': newMail,
        'number': newNumber,
        'letter': firstLetter,
        'color': contacts[index]['color']
    };

    contacts.splice(index, 1, editContact);
}


/**
 * this function removes the current contact out of the contact array
 * @param {*} index - place of the current contact within the contacts array
 */
function deleteContact(index) {
    contacts.splice(index, 1);
    refreshContactList();

    let contactDetails = document.getElementById('mainContactDetails');
    contactDetails.innerHTML = '';

    let mobileContactDetails = document.getElementById('mobileMainContactDetails');
    mobileContactDetails.innerHTML = '';

    hideContactCard();
}


/**
 * This function refreshes the contact list
 */
async function refreshContactList() {
    sortContacts();
    await setItem('contacts', contacts);
    await loadContacts();
    renderContacts();
}