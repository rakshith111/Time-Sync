browser.menus.create({
  id: "convert-time",
  title: "Convert Time to Local/User-defined Timezone",
  contexts: ["selection"],
});

browser.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "convert-time") {
    const selectedText = info.selectionText;
    const { selectedTimezone, toggleState } = await browser.storage.local.get([
      "selectedTimezone",
      "toggleState",
    ]);

    const targetTimezone = toggleState
      ? moment.tz.guess()
      : selectedTimezone || moment.tz.guess();

    browser.tabs.sendMessage(tab.id, {
      command: "convertTime",
      selectedText,
      targetTimezone,
    });
  }
});
