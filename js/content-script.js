browser.runtime.onMessage.addListener((message) => {
  if (message.command === "convertTime") {
    const { selectedText, targetTimezone } = message;

    try {
      const formats = [
        "LLLL",
        "YYYY-MM-DD HH:mm",
        "YYYY-MM-DD h:mm A",
        "MMM D, YYYY h:mm A",
        "D MMM YYYY HH:mm",
      ];

      const parsedDate = moment.tz(selectedText, formats, true, targetTimezone);

      if (!parsedDate.isValid()) {
        throw new Error("Invalid date format");
      }
      console.log(parsedDate);
      const localDate = parsedDate.clone().tz(targetTimezone).format("LLLL");
      replaceSelectedText(localDate);
    } catch (error) {
      alert(
        "Cannot convert the selected date/time. Please make sure the format is correct."
      );
    }
  }
});

function replaceSelectedText(replacementText) {
  const activeEl = document.activeElement;
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const textNode = document.createTextNode(replacementText);
  range.insertNode(textNode);

  if (
    activeEl instanceof HTMLInputElement ||
    activeEl instanceof HTMLTextAreaElement
  ) {
    const startPos = activeEl.selectionStart;
    const endPos = activeEl.selectionEnd;
    activeEl.value =
      activeEl.value.substring(0, startPos) +
      replacementText +
      activeEl.value.substring(endPos, activeEl.value.length);
    activeEl.setSelectionRange(
      startPos + replacementText.length,
      startPos + replacementText.length
    );
  }
}
console.log("content script loaded");
