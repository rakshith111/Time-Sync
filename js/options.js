// Add event listeners to the "Add" and "Remove" buttons
document.getElementById('addDomain').addEventListener('click', addDomain);
document.getElementById('removeSelected').addEventListener('click', removeSelected);

// Function to add a new domain to the list
function addDomain() {
  // Get the value of the "Disabled Domains" input field
  let domain = document.getElementById('disabledDomains').value;

  if (domain) { // Check if a value has been entered
    // Regular expression to validate the input as a URL
    const domainRegex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff]-*)*[a-z\u00a1-\uffff]+)(?:\.(?:[a-z\u00a1-\uffff]-*)*[a-z\u00a1-\uffff]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    // Check if the input matches the regular expression
    const match = domain.match(domainRegex);

    if (match) { // Check if the input is a valid URL
      // Extract the domain name from the URL
      const extractedDomain = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)(?:\/|$)/i.exec(domain)[1];
      // Add "www." to the domain name if it doesn't start with it
      const listItemText = extractedDomain.startsWith("www.") ? extractedDomain : "www." + extractedDomain;
      // Get the list of domains
      const domainsList = document.getElementById('domainsList');
      // Get all the items in the list
      const domainItems = domainsList.getElementsByTagName('li');
      let domainExists = false;

      // Loop through all the items in the list to check if the new domain already exists
      for (let i = 0; i < domainItems.length; i++) {
        if (domainItems[i].textContent === listItemText) {
          domainExists = true;
          break;
        }
      }

      if (domainExists) { // Display an error message if the domain already exists in the list
        alert('The domain already exists in the list');
      } else { // Add the new domain to the list
        // Create a new list item for the new domain
        const listItem = document.createElement('li');
        // Set the text of the list item to the domain name
        listItem.textContent = listItemText;
        // Add a click event listener to the list item to toggle its "selected" class
        listItem.addEventListener('click', () => {
          listItem.classList.toggle('selected');
        });
        // Add the list item to the list
        domainsList.appendChild(listItem);
        // Save the
    // updated list of disabled domains
    saveOptions();
  }
} else { // Display an error message if the input is not a valid URL
  alert('Please enter a valid URL');
}

} else { // Display an error message if no value has been entered
alert('Please enter a URL');
}
}

// Function to remove the selected domains from the list
function removeSelected() {
// Get the list of domains
const domainsList = document.getElementById('domainsList');
// Get all the selected items in the list
const selectedItems = domainsList.querySelectorAll('li.selected');
// Remove each selected item from the list
selectedItems.forEach(item => item.remove());
// Save the updated list of disabled domains
saveOptions();
}

// Function to save the list of disabled domains to local storage
function saveOptions() {
// Get the list of domains
const domainsList = document.getElementById('domainsList');
// Get all the items in the list
const domainItems = domainsList.getElementsByTagName('li');
// Create an empty array to store the domain names
const domains = [];

// Loop through all the items in the list and add their text content to the array
for (let i = 0; i < domainItems.length; i++) {
domains.push(domainItems[i].textContent);
}

// Save the array of domain names to local storage
browser.storage.local.set({ disabledDomains: domains });
}

// Function to restore the list of disabled domains from local storage
function restoreOptions() {
// Get the list of disabled domains from local storage
browser.storage.local.get('disabledDomains')
.then(result => {
if (result.disabledDomains) { // Check if there are any disabled domains in local storage
const domainsList = document.getElementById('domainsList');
domainsList.innerHTML = ''; // Clear the list before reiterating
// Loop through all the disabled domains and add them to the list
result.disabledDomains.forEach(domain => {
const listItem = document.createElement('li');
listItem.textContent = domain;
listItem.addEventListener('click', () => {
listItem.classList.toggle('selected');
});
domainsList.appendChild(listItem);
});
}
});
}

// Restore the list of disabled domains when the page loads
restoreOptions();
document.addEventListener('DOMContentLoaded', restoreOptions);