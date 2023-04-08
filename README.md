## A FireFox Plugin to Automatically Convert any timezone/format on page to Local time

### INSTALLATION

## Plugin is now available on Mozilla firefox addon. You can find it here [Time-Sync](https://addons.mozilla.org/en-US/firefox/addon/time-sync/)

### USAGE

- Click on the plugin icon to open the popup
- Toggle the `Auto Convert` switch to enable/disable auto conversion
- Toggle the `Local Timezones` switch to enable/disable local timezones
      - If enabled, the plugin will only convert timezones to local timezone
      - If disabled, the plugin will convert any timezone to the selected timezone
            - Select any timezone from the list or search for it by typing in the search bar and double click to select it 
- Select any text on the page and right click to convert it to local time, it will only convert if the text is a valid date
- Hover over any text on the page to see the Original date.

### The auto script wont run on pages which are excluded in the manifest as they can affect browser's performance but manual mode is allowed, so select-> convert will work
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
 </s><br>
 
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

### CURRENT ISSUES :warning:

- [x] The plugin works on all pages, I've whitelisted only a few heavy pages for now will add a whitelist option in the future
- [x] Not sure if the autoconvert feature works on pages that use `iframe` or `frame` tags
- [x] The plugin also edits the `inline code` in StackOverflow, I'm working on a fix for this
- [x] More testing is required to see how the nlp libraries work on different pages

### ICONS USED

<a href="https://www.flaticon.com/free-icons/working-hours" title="working hours icons">Working hours icons created by Maan Icons - Flaticon</a> <br>
<br> <a href="https://www.iconfinder.com/icons/9071418/sun_icon"> Sun icon </a> by <a href="https://www.iconfinder.com/icon-park">Kmg Design </a> <br>
<br> <a href="https://www.iconfinder.com/icons/9071456/moon_icon"> Moon icon </a> by <a href="https://www.iconfinder.com/icon-park">Kmg Design </a> <br>
