(function () {
  function initializeBackgroundScript() {
    // Create the context menu
    browser.contextMenus.create({
      id: "convert-date-time",
      title: "Convert date and time",
      contexts: ["selection"],
    });
    console.log("[b] Context menu created"); // Added log statement

    // Set up the event listener for context menu clicks
    browser.contextMenus.onClicked.addListener(async (info, tab) => {
      if (info.menuItemId === "convert-date-time") {
        const selectedText = info.selectionText;

        const settings = await browser.storage.local.get([
          "selectedTimezone",
          "toggleState",
        ]);

        // Only use the saved timezone if the toggleState is not false
        const currentSelectedTimezone =
          settings.toggleState === false || settings.toggleState === undefined
            ? settings.selectedTimezone || luxon.DateTime.local().zoneName
            : luxon.DateTime.local().zoneName;
        console.log("[b] Current selected timezone: ", currentSelectedTimezone);
        browser.tabs
          .sendMessage(tab.id, {
            command: "manualConvertDateTime", // Change the command to 'manualConvertDateTime'
            text: selectedText,
            targetTimezone: currentSelectedTimezone,
          })
          .catch((error) => {
            console.error("[p] Error sending message:", error);
          });
      }
    });
  }

  browser.runtime.onStartup.addListener(() => {
    console.log("Background script started on browser startup");
    initializeBackgroundScript();
  });

  browser.runtime.onInstalled.addListener((details) => {
    console.log(
      "Background script started on extension installation or update"
    );
    initializeBackgroundScript();
  });
})();
