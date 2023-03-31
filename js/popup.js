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
  const timezoneSelect = document.getElementById("timezoneSelect");
  const applyButton = document.getElementById("applyButton");
  const toggleButton = document.getElementById("toggleButton");

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

  // Load the saved selected timezone and toggle state
  const savedSettings = await browser.storage.local.get([
    "selectedTimezone",
    "toggleState",
  ]);
  if (savedSettings.selectedTimezone) {
    timezoneSelect.value = savedSettings.selectedTimezone;
  }
  if (savedSettings.toggleState !== undefined) {
    toggleButton.checked = savedSettings.toggleState;
  }

  // Apply selected timezone and log the current time
  applyButton.addEventListener("click", async () => {
    const selectedTimezone = timezoneSelect.value;
    const currentTime = dayjs().tz(selectedTimezone).format("L LT");
    console.log("original time", dayjs().format("L LT"));
    console.log(`Current time in ${selectedTimezone}: ${currentTime}`);

    // Save the selected timezone
    await browser.storage.local.set({ selectedTimezone });
  });

  // Handle the toggle switch
  toggleButton.addEventListener("change", async (event) => {
    const toggleState = event.target.checked;
    await browser.storage.local.set({ toggleState });

    if (toggleState) {
      console.log("Toggled to User Time Zone:", moment.tz.guess());
    } else {
      const selectedTimezone = timezoneSelect.value;
      console.log(
        `Toggled to switch to Selected Time Zone: ${selectedTimezone}`
      );
    }
  });
});
