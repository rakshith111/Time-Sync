document.getElementById("addDomain").addEventListener("click", addDomain);
document
  .getElementById("removeSelected")
  .addEventListener("click", removeSelected);

// Function to add a new domain to the list
function addDomain() {
  let domain = document.getElementById("disabledDomains").value;

  if (domain) {
    const domainRegex =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff]-*)*[a-z\u00a1-\uffff]+)(?:\.(?:[a-z\u00a1-\uffff]-*)*[a-z\u00a1-\uffff]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    const match = domain.match(domainRegex);

    if (match) {
      const extractedDomain =
        /^(?:https?:\/\/)?(?:www\.)?([^\/]+)(?:\/|$)/i.exec(domain)[1];
      const listItemText = extractedDomain.startsWith("www.")
        ? extractedDomain
        : "www." + extractedDomain;
      const domainsList = document.getElementById("domainsList");
      const domainItems = domainsList.getElementsByTagName("li");
      let domainExists = false;

      for (let i = 0; i < domainItems.length; i++) {
        if (domainItems[i].textContent === listItemText) {
          domainExists = true;
          break;
        }
      }

      if (domainExists) {
        alert("The domain already exists in the list");
      } else {
        const listItem = document.createElement("li");
        listItem.textContent = listItemText;
        listItem.addEventListener("click", () => {
          listItem.classList.toggle("selected");
        });
        domainsList.appendChild(listItem);
        saveOptions();
      }
    } else {
      alert("Please enter a valid URL");
    }
  } else {
    alert("Please enter a URL");
  }
}
// Function to remove the selected domains from the list
function removeSelected() {
  const domainsList = document.getElementById("domainsList");
  const selectedItems = domainsList.querySelectorAll("li.selected");
  selectedItems.forEach((item) => item.remove());
  saveOptions();
}
// Function to save the list of disabled domains to local storage

function saveOptions() {
  const domainsList = document.getElementById("domainsList");
  const domainItems = domainsList.getElementsByTagName("li");
  const domains = [];

  for (let i = 0; i < domainItems.length; i++) {
    domains.push(domainItems[i].textContent);
  }

  browser.storage.local.set({ disabledDomains: domains });
}
// Function to restore the list of disabled domains from local storage

function restoreOptions() {
  browser.storage.local.get("disabledDomains").then((result) => {
    if (result.disabledDomains) {
      const domainsList = document.getElementById("domainsList");
      domainsList.innerHTML = "";
      result.disabledDomains.forEach((domain) => {
        const listItem = document.createElement("li");

        listItem.textContent = domain;
        listItem.addEventListener("click", () => {
          listItem.classList.toggle("selected");
        });
        domainsList.appendChild(listItem);
      });
    }
  });
}
// Restore the list of disabled domains when the page loads
restoreOptions();
document.addEventListener("DOMContentLoaded", restoreOptions);
