browser.runtime.onMessage.addListener(async (message) => {
  if (message.command === "convertDateTime") {
    console.log("Received message from background script: ", message);
    const selectedText = message.text;
    const targetTimezone = message.targetTimezone;
    const parsedResult = chrono.chrono.parse(selectedText);

    if (parsedResult.length > 0) {
      const parsedDate = parsedResult[0].start.date();
      const dateInTargetTimezone = moment(parsedDate)
        .tz(targetTimezone)
        .format("dddd, MMMM D, YYYY, h:mm a z");

      // Replace the selected text with the converted date and time
      document.getSelection().getRangeAt(0).deleteContents();
      const newText = document.createTextNode(dateInTargetTimezone);
      document.getSelection().getRangeAt(0).insertNode(newText);
    } else {
      alert("Error: Unable to parse the selected date and time.");
    }
  }
});
