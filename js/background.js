// background.js
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "convert-date-time",
    title: "Convert date and time",
    contexts: ["selection"],
  });
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "convert-date-time") {
    const selectedText = info.selectionText;

    const settings = await browser.storage.local.get([
      "selectedTimezone",
      "toggleState",
    ]);

    const currentSelectedTimezone =
      settings.toggleState === false || settings.toggleState === undefined
        ? settings.selectedTimezone || luxon.DateTime.local().zoneName
        : luxon.DateTime.local().zoneName;

    browser.tabs.sendMessage(tab.id, {
      command: "convertDateTime",
      text: selectedText,
      targetTimezone: currentSelectedTimezone,
    });
  }
});
