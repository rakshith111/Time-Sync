document.getElementById('addDomain').addEventListener('click', addDomain);
document.getElementById('removeSelected').addEventListener('click', removeSelected);

function addDomain() {
  const domain = document.getElementById('disabledDomains').value;
  if (domain) {
    const domainsList = document.getElementById('domainsList');
    const listItem = document.createElement('li');
    listItem.textContent = domain.trim();
    listItem.addEventListener('click', () => {
      listItem.classList.toggle('selected');
    });
    domainsList.appendChild(listItem);
    saveOptions();
  }
}

function removeSelected() {
  const domainsList = document.getElementById('domainsList');
  const selectedItems = domainsList.querySelectorAll('li.selected');
  selectedItems.forEach(item => item.remove());
  saveOptions();
}

function saveOptions() {
  const domainsList = document.getElementById('domainsList');
  const domainItems = domainsList.getElementsByTagName('li');
  const domains = [];

  for (let i = 0; i < domainItems.length; i++) {
    domains.push(domainItems[i].textContent);
  }

  browser.storage.local.set({ disabledDomains: domains });
}

function restoreOptions() {
  browser.storage.local.get('disabledDomains')
    .then(result => {
      if (result.disabledDomains) {
        const domainsList = document.getElementById('domainsList');
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

document.addEventListener('DOMContentLoaded', restoreOptions);
