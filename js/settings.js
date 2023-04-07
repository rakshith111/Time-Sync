document.addEventListener("DOMContentLoaded", () => {
    const settingsIcon = document.getElementById("settingsIcon");
    settingsIcon.addEventListener("click", openSettingsPage);
  });
  
  function openSettingsPage() {
    const optionsURL = browser.runtime.getURL("html/options.html");
    browser.tabs.create({ url: optionsURL });
  }