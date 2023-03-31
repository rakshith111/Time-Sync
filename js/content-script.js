// Define the regex pattern to extract date time values
const dateTimePattern = /\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/g;

// Extract all date time values from the page's HTML
const extractedDateTimeValues =
  document.documentElement.innerHTML.match(dateTimePattern);

if (extractedDateTimeValues) {
  // Process each date time value and send it to Day.js
  extractedDateTimeValues.forEach((dateTimeValue) => {
    const dayjsDateTime = dayjs(dateTimeValue);

    // Log the processed date time value
    console.log(
      `Original: ${dateTimeValue} | Day.js: ${dayjsDateTime.toString()}`
    );
  });
} else {
  console.log("No date time values found on this page.");
}
