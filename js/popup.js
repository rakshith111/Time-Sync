document.addEventListener("DOMContentLoaded", async () => {
  const currentTimezoneElement = document.getElementById("currentTimezone");
  const searchBar = document.getElementById("searchBar");
  const timezoneSelect = document.getElementById("timezoneSelect");
  const toggleButton = document.getElementById("toggleButton");
  const searchAndSelect = document.getElementById("searchAndDropdownContainer");
  const toggleText = document.getElementById("toggleText");
  const autoDateConvertToggle = document.getElementById(
    "autoDateConvertToggle"
  );
  const themeToggle = document.getElementById("themeToggle");

  let currentSelectedTimezone = moment.tz.guess();

  timezoneSelect.size = 10;

  searchAndSelect.style.display = "none";

  function filterTimezones(searchQuery) {
    const filteredTimezones = timezones.filter((timezone) =>
      timezone.toLowerCase().includes(searchQuery.toLowerCase())
    );
    timezoneSelect.innerHTML = "";

    filteredTimezones.forEach((timezone) => {
      const option = document.createElement("option");
      option.value = timezone;
      option.text = timezone;
      timezoneSelect.add(option);
    });
  }

  // Populate the timezone select element
  const timezones = moment.tz.names();
  timezones.forEach((timezone) => {
    const option = document.createElement("option");
    option.value = timezone;
    option.text = timezone;
    timezoneSelect.add(option);
  });

  // Load saved settings and states
  const savedSettings = await browser.storage.local.get([
    "selectedTimezone",
    "toggleState",
    "autoDateConvertState",
    "darkModeState",
  ]);

  if (savedSettings.selectedTimezone) {
    currentSelectedTimezone = savedSettings.selectedTimezone;
    currentTimezoneElement.textContent = `Current timezone: ${currentSelectedTimezone}`;
  }
  if (savedSettings.toggleState !== undefined) {
    toggleButton.checked = savedSettings.toggleState;
    searchAndSelect.style.display = savedSettings.toggleState ? "none" : "flex";
    toggleText.textContent = savedSettings.toggleState
      ? "Local timezone"
      : "User-selected timezone";
  }
  if (savedSettings.autoDateConvertState !== undefined) {
    autoDateConvertToggle.checked = savedSettings.autoDateConvertState;
  }
  if (savedSettings.darkModeState !== undefined) {
    themeToggle.checked = savedSettings.darkModeState;
    if (themeToggle.checked) {
      document.body.classList.add("dark-mode");
      document.getElementById("lightModeIcon").style.display = "none";
      document.getElementById("darkModeIcon").style.display = "inline-block";
    } else {
      document.body.classList.remove("dark-mode");
      document.getElementById("lightModeIcon").style.display = "inline-block";
      document.getElementById("darkModeIcon").style.display = "none";
    }
  }

  searchBar.addEventListener("input", (event) => {
    filterTimezones(event.target.value);
    timezoneSelect.size = timezones.length > 10 ? 10 : timezones.length;
  });

  timezoneSelect.addEventListener("dblclick", async () => {
    currentSelectedTimezone = timezoneSelect.value;
    currentTimezoneElement.textContent = `Current timezone: ${currentSelectedTimezone}`;

    await browser.storage.local.set({
      selectedTimezone: currentSelectedTimezone,
    });

    timezoneSelect.size = 10;
  });

  toggleButton.addEventListener("change", async (event) => {
    const toggleState = event.target.checked;
    await browser.storage.local.set({ toggleState });

    if (toggleState) {
      currentSelectedTimezone = moment.tz.guess();
      currentTimezoneElement.textContent = `Current timezone: ${currentSelectedTimezone}`;
      searchAndSelect.style.display = "none";
      toggleText.textContent = "Local timezone";
      await browser.storage.local.set({
        selectedTimezone: currentSelectedTimezone,
      });

      console.log("[p] Toggled to User Time Zone:", currentSelectedTimezone);
    } else {
      searchAndSelect.style.display = "flex";
      toggleText.textContent = "User-selected timezone";
      console.log(`[p] Toggled to Selected Time Zone`);
    }
  });

  autoDateConvertToggle.addEventListener("change", async (event) => {
    const autoDateConvertState = event.target.checked;
    await browser.storage.local.set({ autoDateConvertState });
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs
        .sendMessage(tabs[0].id, {
          command: "setTargetTimezone",
          targetTimezone: currentSelectedTimezone,
        })
        .catch((error) => {
          console.error("[p]Error sending message:", error);
        });
    });
  });

  themeToggle.addEventListener("change", async (event) => {
    const darkModeState = event.target.checked;

    if (darkModeState) {
      document.body.classList.add("dark-mode");
      document.getElementById("lightModeIcon").style.display = "none";
      document.getElementById("darkModeIcon").style.display = "inline-block";
    } else {
      document.body.classList.remove("dark-mode");
      document.getElementById("lightModeIcon").style.display = "inline-block";
      document.getElementById("darkModeIcon").style.display = "none";
    }

    // Save the dark mode state to local storage
    await browser.storage.local.set({ darkModeState });
  });
});
