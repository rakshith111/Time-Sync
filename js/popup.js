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


document.addEventListener("DOMContentLoaded", () => {
  const timezoneSelect = document.getElementById("timezoneSelect");
  const applyButton = document.getElementById("applyButton");

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

  // Apply selected timezone and log the current time
  applyButton.addEventListener("click", () => {
    const selectedTimezone = timezoneSelect.value;
    const currentTime = dayjs().tz(selectedTimezone).format("L LT");
    console.log("original time", dayjs().format("L LT"));
    console.log(`Current time in ${selectedTimezone}: ${currentTime}`);
  });
});




console.log("User Time Zone:",  moment.tz.guess());