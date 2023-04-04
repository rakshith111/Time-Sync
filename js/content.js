browser.runtime.onMessage.addListener(async (message) => {
  if (message.command === "convertDateTime") {
    console.log("Received message from background script: ", message);
    const selectedText = message.text;
    const targetTimezone = message.targetTimezone;
    const parsedResult = chrono.chrono.parse(selectedText);
    var local = luxon.DateTime.local();
    var rezoned = local.setZone(targetTimezone, { keepLocalTime: true });
    if (parsedResult.length > 0) {
      const parsedDate = parsedResult[0].start.date();
      var dateInTargetTimezone = moment(parsedDate)
        .tz(targetTimezone)
        .format("dddd, MMMM D, YYYY, h:mm a Z");
      dateInTargetTimezone +=
        " (" + firstLettersCaps(rezoned.offsetNameLong) + ")";
      // Replace the selected text with the converted date and time
      document.getSelection().getRangeAt(0).deleteContents();
      const newText = document.createTextNode(dateInTargetTimezone);
      document.getSelection().getRangeAt(0).insertNode(newText);
    } else {
      alert("Error: Unable to parse the selected date and time.");
    }
  }
});

function firstLettersCaps(input) {
  // Return the first letter of each word in a string in uppercase For getting the timezone name in the format "PDT (Pacific Daylight Time)"
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
