## A FireFox Plugin to Automatically Convert any timezone/format on page to Local time

### INSTALLATION

As of now, the plugin is not available on the Firefox Addons Store. You can install it by downloading the source code and loading it as a temporary addon.
here's how you can do it:

1. Download the source code from [here](https://github.com/rakshith111/Time-Sync)
2. Extract the zip file
3. Open Firefox and type `about:debugging` in the address bar
4. Click on `This Firefox` in the left sidebar
5. Click on `Load Temporary Add-on`
6. Select any file in the extracted folder
7. The plugin should be installed and ready to use

### USAGE

- Click on the plugin icon to open the popup
- Toggle the `Auto Convert` switch to enable/disable auto conversion
- Toggle the `Local Timezones` switch to enable/disable local timezones
      - If enabled, the plugin will only convert timezones to local timezone
      - If disabled, the plugin will convert any timezone to the selected timezone
            - Select any timezone from the list or search for it by typing in the search bar and double click to select it 
- Select any text on the page and right click to convert it to local time, it will only convert if the text is a valid date
- Hover over any text on the page to see the Original date.

### Currently available features

- [x] Choose any timezone (Toggled)
- [x] Choose local timezones (BY DEFAULT)
- [x] List all timezones
- [x] Search for timezone (Can double click to select)
- [x] Parse any format, timezone and convert to local timezone and format
      <s>
- [ ] Regex to parse any format <br>
- [ ] Regex to parse any timezone <br>
- [ ] Regex to parse any format and timezone <br>
      </s>
- [x] Right click to convert date by default
- [x] Auto convert date by default (Toggled)

### Features to be added

- [ ] Choose any format (Toggled)
- [ ] List all formats
- [ ] Search for format (Can double click to select)

### LIBRARIES USED

[Chrono-node](https://www.npmjs.com/package/chrono-node) (Packed via browserify) - A natural language date parser in JavaScript.<br>
[Compromise](https://www.npmjs.com/package/compromise) (Packed via webpack) - A modern natural language processing library for the browser and node.<br>
[Compromise-dates](https://www.npmjs.com/package/compromise-dates)(Packed via webpack) - A plugin for Compromise to parse, manipulate, and display dates.<br>
[Luxon](https://moment.github.io/luxon/) - A library for working with dates and times in JS.<br>
[Moment](https://momentjs.com/) - A lightweight JavaScript library for parsing, validating, manipulating, and formatting dates.<br>
[Moment Timezone with data](https://momentjs.com/timezone/) - A plugin for Moment to parse, manipulate, and display dates in any timezone with data.<br>

---

### ICONS USED

<a href="https://iconscout.com/icons/update-time" target="_blank">Update Time Icon(LIGHT)</a> by <a href="https://iconscout.com/contributors/zolute">Zolute Technology and Consulting Pvt Ltd</a> on <a href="https://iconscout.com">IconScout</a><br>
<a href="https://iconscout.com/icons/update-time" target="_blank">Update Time Icon(DARK)</a> by <a href="https://iconscout.com/contributors/zolute">Zolute Technology and Consulting Pvt Ltd</a> on <a href="https://iconscout.com">IconScout</a>
