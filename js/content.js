let targetTimezone;
(async function () {
  console.log("Content script loaded");
  function findPotentialDates(text) {
    const nlpResult = nlp(text).dates().json();
    return nlpResult;
  }

  async function findAndReplaceDates(targetTimezone) {
    if (!targetTimezone) {
      targetTimezone = moment.tz.guess();
      console.log("TimeZone not provided:", targetTimezone);
    }

    const bodyTextContent = document.body.textContent;
    const potentialDates = findPotentialDates(bodyTextContent);
    console.log("Potential dates: ", potentialDates);

    for (const date of potentialDates) {
      const original = date.text;
      const parsedResult = chrono.chrono.parseDate(original);

      if (
        parsedResult != null &&
        !document.querySelector(`[data-original="${original}"]`)
      ) {
        var local = luxon.DateTime.local();
        var rezoned = local.setZone(targetTimezone, {
          keepLocalTime: true,
        });
        var parsedDate = moment(parsedResult)
          .tz(targetTimezone)
          .format("dddd, MMMM D, YYYY, h:mm a Z");
        parsedDate += " (" + firstLettersCaps(rezoned.offsetNameLong) + ")";

        const newText = `${parsedDate}`;

        const textNodes = getTextNodes(document.body);
        for (const node of textNodes) {
          if (node.textContent.includes(original)) {
            const newNodeValue = node.textContent.replace(original, "");
            const replacedDateSpan = document.createElement("span");
            replacedDateSpan.className = "replaced-date";
            replacedDateSpan.textContent = newText;
            replacedDateSpan.dataset.original = original;
            replacedDateSpan.dataset.parsed = newText;

            node.parentNode.insertBefore(replacedDateSpan, node.nextSibling);
            node.textContent = newNodeValue;
          }
        }
      }
    }
  }

  function getTextNodes(node) {
    const allNodes = [];
    const iterator = document.createNodeIterator(
      node,
      NodeFilter.SHOW_TEXT,
      null
    );

    let currentNode;
    while ((currentNode = iterator.nextNode())) {
      allNodes.push(currentNode);
    }

    return allNodes;
  }

  const style = document.createElement("style");
  style.textContent = `
  .replaced-date {
    text-decoration: underline;
    cursor: help;
    position: relative;
  }

  .replaced-date::before {
    content: "Original: " attr(data-original) ;
    position: absolute;
    display: none;
    background-color: #f51616;
    border: 1px solid #ccc;
    padding: 8px; /* Increased padding for a larger box */
    border-radius: 6px; /* Increased border-radius for a larger box */
    font-size: 14px; /* Increased font-size for larger text */
    white-space: nowrap;
    z-index: 10;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
  }

  .replaced-date:hover::before {
    display: block;
  }
`;
  document.head.appendChild(style);

  const settings = await browser.storage.local.get(["autoDateConvertState"]);
  if (
    settings.autoDateConvertState === undefined ||
    settings.autoDateConvertState
  ) {
    console.log("Auto-date converter is enabled");
    findAndReplaceDates();
  } else {
    console.log("Auto-date converter is disabled");
  }
})();
browser.runtime.onMessage.addListener(async (message) => {
  if (message.command === "setTargetTimezone") {
    targetTimezone = message.targetTimezone;
    console.log("Received target timezone: ", targetTimezone);

    await findAndReplaceDates(targetTimezone);
  }
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
