
/**
 * This function saves a new created contact and loads the contact into the remot storage
 */
// async function saveNewContact(isDesktopForm) {

//     if (isDesktopForm === true) {
//         await addNewContact();
//     } else {
//         await mobileAddNewContact();
//     }
//     await loadContacts();
//     closeAddCardOne();
//     renderContacts();
//     resetForm();
// }


/**
 * Resets the form after a delay of 2 seconds.
 * This function uses a delay to allow users time to view any confirmations or other actions before the form resets.
 * The reset is performed using the form's standard `reset()` method,
 * which sets all form elements back to their initial values.
 */
function resetForm() {
    setTimeout(() => {
        const form = document.getElementById('contactForm');
        form.reset();
    }, 2000);

}


/**
 * This function is pulling all informations out of the "add new contact" form
 * It pushes the information into the contact array
 * Loads the new contact array into the remote storage
 */
// async function addNewContact() {
//     const contactName = document.getElementById('contactName');
//     const contactEmail = document.getElementById('contactMail');
//     const contactNumber = document.getElementById('contactNumber');

//     let getName = contactName.value;
//     let firstLetter = getName.charAt(0).toUpperCase();

//     let newContact = {
//         'name': contactName.value,
//         'mail': contactEmail.value,
//         'number': contactNumber.value,
//         'letter': firstLetter,
//         'color': getRandomUserIconColor()
//     }

//     contacts.push(newContact);
//     sortContacts();
//     await setItem('contacts', contacts);

// }


/**
 * This function is pulling all informations out of the "add new contact" form (mobile)
 * It pushes the information into the contact array
 * Loads the new contact array into the remote storage
 */
async function mobileAddNewContact() {
    const contactName = document.getElementById('contactMobileName');
    const contactEmail = document.getElementById('contactMobileMail');
    const contactNumber = document.getElementById('contactMobileNumber');

    let getName = contactName.value;
    let firstLetter = getName.charAt(0).toUpperCase();

    let newContact = {
        'name': contactName.value,
        'mail': contactEmail.value,
        'number': contactNumber.value,
        'letter': firstLetter,
        'color': getRandomUserIconColor()
    }

    contacts.push(newContact);
    sortContacts();
    await setItem('contacts', contacts);
}




/**
 * This function is putting all contacts in a alphabetic order
 */
function sortContacts() {
    contacts.sort((a, b) => {
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();

        if (nameA < nameB) {
            return -1;
        }

        if (nameA > nameB) {
            return +1;
        }

        return 0;
    })
}


