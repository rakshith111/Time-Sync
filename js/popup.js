const getMethods = (obj) => {
  let properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item) => typeof obj[item] === "function"
  );
};

document.addEventListener("DOMContentLoaded", async () => {
  const currentTimezoneElement = document.getElementById("currentTimezone");
  const searchBar = document.getElementById("searchBar");
  const timezoneSelect = document.getElementById("timezoneSelect");
  const toggleButton = document.getElementById("toggleButton");

  const searchAndSelect = document.getElementById("searchAndDropdownContainer");
  const toggleText = document.getElementById("toggleText");
  timezoneSelect.size = 10; // Set the default size of the dropdown list
  let currentSelectedTimezone = moment.tz.guess();
  currentTimezoneElement.textContent = `Current timezone: ${currentSelectedTimezone}`;
  const autoDateConvertToggle = document.getElementById(
    "autoDateConvertToggle"
  );
  searchAndSelect.style.display = "none";
  // Load the saved auto-date conversion state
  const savedAutoDateConvertState = await browser.storage.local.get([
    "autoDateConvertState",
  ]);
  if (savedAutoDateConvertState.autoDateConvertState !== undefined) {
    autoDateConvertToggle.checked =
      savedAutoDateConvertState.autoDateConvertState;
  }

  // Handle the auto-date conversion toggle switch
  autoDateConvertToggle.addEventListener("change", async (event) => {
    const autoDateConvertState = event.target.checked;
    await browser.storage.local.set({ autoDateConvertState });
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "setTargetTimezone",
        targetTimezone: currentSelectedTimezone,
      });
    });
  });

  // Populate the timezone select element
  const timezones = moment.tz.names();
  timezones.forEach((timezone) => {
    const option = document.createElement("option");
    option.value = timezone;
    option.text = timezone;
    timezoneSelect.add(option);
  });
  // Function to filter timezones based on search query
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

  // Handle search input
  searchBar.addEventListener("input", (event) => {
    filterTimezones(event.target.value);
    timezoneSelect.size = timezones.length > 10 ? 10 : timezones.length;
  });

  // Load the saved selected timezone and toggle state
  const savedSettings = await browser.storage.local.get([
    "selectedTimezone",
    "toggleState",
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

  // Handle timezone selection by double click
  timezoneSelect.addEventListener("dblclick", async () => {
    currentSelectedTimezone = timezoneSelect.value;
    currentTimezoneElement.textContent = `Current timezone: ${currentSelectedTimezone}`;

    // Save the selected timezone
    await browser.storage.local.set({
      selectedTimezone: currentSelectedTimezone,
    });

    // Close the dropdown list
    timezoneSelect.size = 10;
  });

  // Handle the toggle switch
  toggleButton.addEventListener("change", async (event) => {
    const toggleState = event.target.checked;
    await browser.storage.local.set({ toggleState });

    if (toggleState) {
      currentSelectedTimezone = moment.tz.guess();
      currentTimezoneElement.textContent = `Current timezone: ${currentSelectedTimezone}`;
      searchAndSelect.style.display = "none";
      toggleText.textContent = "Local timezone";
      // Save the selected timezone
      await browser.storage.local.set({
        selectedTimezone: currentSelectedTimezone,
      });

      console.log("Toggled to User Time Zone:", currentSelectedTimezone);
    } else {
      searchAndSelect.style.display = "flex";
      toggleText.textContent = "User-selected timezone";
      console.log(`Toggled  to Selected Time Zone`);
    }
  });

  const themeToggle = document.getElementById("themeToggle");

  // Load the saved dark mode state
  const savedDarkModeState = await browser.storage.local.get(["darkModeState"]);
  if (savedDarkModeState.darkModeState !== undefined) {
    themeToggle.checked = savedDarkModeState.darkModeState;
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
