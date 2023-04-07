document.getElementById('saveOptions').addEventListener('click', saveOptions);

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
          whitelist.appendChild(listItem);
        });
      }
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
