document.getElementById('addDomain').addEventListener('click', addDomain);
document.getElementById('removeSelected').addEventListener('click', removeSelected);

function addDomain() {
  const domain = prompt('Enter a domain URL to add:');
  if (domain) {
    const disabledDomains = document.getElementById('disabledDomains');
    disabledDomains.value += '\n' + domain.trim();
  }
}

function removeSelected() {
  const whitelist = document.getElementById('whitelistedWebsites');
  const selectedItems = whitelist.querySelectorAll('li.selected');
  selectedItems.forEach(item => item.remove());
}

function saveOptions() {
  const disabledDomains = document.getElementById('disabledDomains').value;
  const domainList = disabledDomains.split('\n').map(domain => domain.trim());
  browser.storage.local.set({ disabledDomains: domainList }).then(refreshWhitelistedWebsites);
}

function restoreOptions() {
  browser.storage.local.get('disabledDomains')
    .then(result => {
      if (result.disabledDomains) {
        document.getElementById('disabledDomains').value = result.disabledDomains.join('\n');
      }
      refreshWhitelistedWebsites();
    });
}

function refreshWhitelistedWebsites() {
  browser.storage.local.get('disabledDomains')
    .then(result => {
      const whitelist = document.getElementById('whitelistedWebsites');
      whitelist.innerHTML = '';

      if (result.disabledDomains) {
        result.disabledDomains.forEach(domain => {
          const listItem = document.createElement('li');
          listItem.textContent = domain;
          listItem.addEventListener('click', () => listItem.classList.toggle('selected'));
          whitelist.appendChild(listItem);
        });
      }
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveOptions').addEventListener('click', saveOptions);