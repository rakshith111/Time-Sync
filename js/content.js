let targetTimezone;
async function main(attempts = 0) {
  try {
    console.log("Attempt number: ", attempts);
    const settings = await browser.storage.local.get(["autoDateConvertState"]);
    targetTimezone = await browser.storage.local.get(["selectedTimezone"]);
    if (targetTimezone.selectedTimezone === undefined) {
      targetTimezone = moment.tz.guess();
    } else {
      targetTimezone = targetTimezone.selectedTimezone;
    }
    if (
      settings.autoDateConvertState === undefined ||
      settings.autoDateConvertState
    ) {
      console.log("Auto-date converter is enabled");
      await findAndReplaceDates();
    } else {
      console.log("Auto-date converter is disabled");
    }
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
    console.log("Auto Content script loaded");
  } catch (error) {
    console.error("An error occurred while running the extension:", error);

    // Check if we should attempt to restart the extension.
    const maxAttempts = 3; // Set the maximum number of restart attempts.
    if (attempts < maxAttempts) {
      console.log(
        `Restarting the extension (attempt ${
          attempts + 1
        } of ${maxAttempts})...`
      );
      await main(attempts + 1);
    } else {
      console.error(
        `The extension failed after ${maxAttempts} attempts. Giving up.`
      );
    }
  }
}
main(1);
function cssEscape(value) {
  return value
    .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&")
    .replace(/\n/g, "\\A");
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
function firstLettersCaps(input) {
  // Return the first letter of each word in a string in uppercase For getting the timezone name in the format "PDT (Pacific Daylight Time)"
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
function findPotentialDates(text) {
  const nlpResult = nlp(text).dates().out("json");
  return nlpResult;
}
function isAlreadyParsed(dateText) {
  const escapedDateText = cssEscape(dateText);
  return !!document.querySelector(`[data-original="${escapedDateText}"]`);
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
function getParsedDateInTargetTimezone(parsedResult) {
  var local = luxon.DateTime.local();
  var rezoned = local.setZone(targetTimezone, {
    keepLocalTime: true,
  });
  var parsedDate = moment(parsedResult)
    .tz(targetTimezone)
    .format("MMMM D,dddd, YYYY, h:mm a Z");
  if (moment(parsedDate).isValid()) {
    parsedDate += " (" + firstLettersCaps(rezoned.offsetNameLong) + ")";
    console.log("Parsed date: ", parsedDate);
    return parsedDate;
  } else {
    console.log("Parsed date is not valid");
    return "nope";
  }
}
async function findAndReplaceDates(targetTimezone) {
  const bodyTextContent = document.body.textContent;

  // Split the content into smaller chunks
  const chunkSize = 5000; // Adjust this value based on performance
  const chunks = [];
  for (let i = 0; i < bodyTextContent.length; i += chunkSize) {
    chunks.push(bodyTextContent.slice(i, i + chunkSize));
  }

  let chunkCount = 0;

  for (const chunk of chunks) {
    const potentialDates = findPotentialDates(chunk);

    for (const date of potentialDates) {
      if (date.text.length >= 10) {
        const original = date.text;

        if (isAlreadyParsed(original)) {
          console.log("Already parsed: ", original);
          continue;
        }

        const parsedDateInTargetTimezone =
          getParsedDateInTargetTimezone(original);
        if (parsedDateInTargetTimezone != "nope") {
          const newText = `${parsedDateInTargetTimezone}`;

          const textNodes = getTextNodes(document.body);
          for (const node of textNodes) {
            if (node.textContent.includes(original)) {
              const newNodeValue = node.textContent.replace(original, "");
              const replacedDateSpan = createReplacedDateSpan(
                original,
                newText
              );
              node.parentNode.insertBefore(replacedDateSpan, node.nextSibling);
              node.textContent = newNodeValue;
            }
          }
        } else {
          console.log("Unable to parse date: ", original);
        }
      }
    }
    chunkCount++;
    console.log(`Chunk ${chunkCount} of ${chunks.length} parsed.`);
  }
  console.log(`Total chunks parsed: ${chunkCount}`);
}

browser.runtime.onMessage.addListener(async (message) => {
  if (message.command === "setTargetTimezone") {
    targetTimezone = message.targetTimezone;
    console.log("Received target timezone: ", targetTimezone);
    await findAndReplaceDates();
  }
  if (message.command === "convertDateTime") {
    console.log("Received message from background script: ", message);
    const selectedText = message.text;
    const parsedResult = chrono.chrono.parse(selectedText);
    if (parsedResult.length > 0) {
      const parsedDate = parsedResult[0].start.date();
      const dateInTargetTimezone = getParsedDateInTargetTimezone(parsedDate);
      if (dateInTargetTimezone != "nope") {
        wrapSelectedTextWithHover(selectedText, dateInTargetTimezone);
      } else {
        alert("Error: Unable to parse the selected date and time.");
      }
    } else {
      alert("Error: Unable to parse the selected date and time.");
    }
  }
});
