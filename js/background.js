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
      settings.toggleState || settings.toggleState === undefined
        ? moment.tz.guess()
        : settings.selectedTimezone || moment.tz.guess();

    browser.tabs.sendMessage(tab.id, {
      command: "convertDateTime",
      text: selectedText,
      targetTimezone: currentSelectedTimezone,
    });
  }
});
