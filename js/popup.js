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
  const applyButton = document.getElementById("applyButton");
  const toggleButton = document.getElementById("toggleButton");
  const searchAndSelect = document.getElementById("searchAndSelect");

  let currentSelectedTimezone = moment.tz.guess();
  currentTimezoneElement.textContent = `Current timezone: ${currentSelectedTimezone}`;

  dayjs.extend(window.dayjs_plugin_timezone);
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_localizedFormat);

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
    searchAndSelect.style.display = savedSettings.toggleState
      ? "none"
      : "block";
  }

  // Apply selected timezone and log the current time
  applyButton.addEventListener("click", async () => {
    currentSelectedTimezone = timezoneSelect.value;
    currentTimezoneElement.textContent = `Current timezone: ${currentSelectedTimezone}`;

    // Save the selected timezone
    await browser.storage.local.set({
      selectedTimezone: currentSelectedTimezone,
    });
  });

  // Handle the toggle switch
  toggleButton.addEventListener("change", async (event) => {
    const toggleState = event.target.checked;
    await browser.storage.local.set({ toggleState });

    if (toggleState) {
      currentSelectedTimezone = moment.tz.guess();
      currentTimezoneElement.textContent = `Current timezone: ${currentSelectedTimezone}`;
      console.log("Toggled to User Time Zone:", moment.tz.guess());
      searchAndSelect.style.display = "none";
    } else {
      searchAndSelect.style.display = "block";
  
      const selectedTimezone = timezoneSelect.value;
      console.log(
        `Toggled to switch to Selected Time Zone: ${selectedTimezone}`
      );
    }
  });
});
