(async function () {
  const style = document.createElement("style");
  style.textContent = `
  .replaced-date {
    text-decoration: underline;
    cursor: help;
    position: relative;
  }

  .replaced-date::before {
    content: "Original: " attr(data-original);
    position: absolute;
    display: none;
    background-color: #1f1f1f; /* Dark background for better theme matching */
    border: 1px solid #ccc;
    color: #ffffff; /* White text for better visibility on dark background */
    padding: 8px;
    border-radius: 6px;
    font-size: 14px;
    white-space: nowrap;
    z-index: 10;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Added a subtle box-shadow for depth */
  }

  .replaced-date:hover::before {
    display: block;
  }
`;
  document.head.appendChild(style);
  console.log("Manual Content script loaded");
})();
function firstLettersCaps(input) {
  // Return the first letter of each word in a string in uppercase For getting the timezone name in the format "PDT (Pacific Daylight Time)"
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
function createReplacedDateSpan(original, newText) {
  const replacedDateSpan = document.createElement("span");
  replacedDateSpan.className = "replaced-date";
  replacedDateSpan.textContent = newText;
  replacedDateSpan.dataset.original = original;
  replacedDateSpan.dataset.parsed = newText;
  return replacedDateSpan;
}
function wrapSelectedTextWithHover(original, newText) {
  const selection = document.getSelection();
  const range = selection.getRangeAt(0);
  const replacedDateSpan = createReplacedDateSpan(original, newText);
  range.deleteContents();
  range.insertNode(replacedDateSpan);
}

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
        .format("MMMM D,dddd, YYYY, h:mm a Z");

      dateInTargetTimezone +=
        " (" + firstLettersCaps(rezoned.offsetNameLong) + ")";
      // Replace the selected text with the converted date and time

      wrapSelectedTextWithHover(selectedText, dateInTargetTimezone);
    } else {
      alert("Error: Unable to parse the selected date and time.");
    }
  } else {
    alert("Error: Unable to parse the selected date and time.");
  }
});
