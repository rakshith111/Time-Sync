## A FireFox Plugin to Automatically Convert any timezone/format on page to Local time
#### Most of the code was generated using GPT-4 
### INSTALLATION

## Plugin is now available on Mozilla firefox addon!!. <br> You can find it here 

[![image](https://user-images.githubusercontent.com/36219488/230857192-3ddeabf3-12b8-4ce9-9776-5ffc5d9d57bd.png)](https://addons.mozilla.org/en-US/firefox/addon/time-sync/)

### USAGE

- Select any text on the page and right click to convert it to local time, it will only convert if the text is a valid date
- Click on the plugin icon to open the popup
- Toggle the `Auto Convert` switch to enable/disable auto conversion
- Toggle the `Local Timezones` switch to enable/disable local timezones
      - If enabled, the plugin will only convert timezones to local timezone (enabled by default)
      - If disabled, the plugin will convert any timezone to the selected timezone
            - Select any timezone from the list or search for it by typing in the search bar and double click to select it 
- Hover over any text on the page to see the Original date.
- Go to the `Options` page to add/remove domains to the whitelist to control whether the auto converter should run on the domain

----------

### The auto script wont run on pages which are excluded in the manifest as they can affect browser's performance but manual mode is allowed, so select text -> convert will work
### Currently available features

- [x] Choose any timezone (Toggled)
- [x] Choose local timezones (BY DEFAULT)
- [x] List all timezones
- [x] Search for timezone (Can double click to select)
- [x] Parse any format, timezone and convert to local timezone and format
- [x] Whitelist/Blacklist pages in the options page
<s>
- [ ] Regex to parse any format <br>
- [ ] Regex to parse any timezone <br>
- [ ] Regex to parse any format and timezone <br>
 </s><br>
 
- [x] Right click to convert date by default
- [x] Auto convert date by default (Toggled)

-------

<details><summary><h2>  Screenshots </h2> </summary>

![Screenshot_4](https://user-images.githubusercontent.com/36219488/230720230-3d9cb7c1-3cff-4af6-9cdf-80fb7cdc4d01.png)
### Auto Converted page, one can hover over the converted, underlined date to see original text
![Screenshot_5](https://user-images.githubusercontent.com/36219488/230720231-0002c1dc-e7b2-4f1b-be03-55d1d49a267f.png)
### Here is a mail before converted in a different format
![Screenshot_6](https://user-images.githubusercontent.com/36219488/230720233-75acb1d0-1ff9-4b60-b233-a85795e78f4a.png)
### The text is selected and when you right click, a drop down menu with the option to "Convert Date and time" is available
![Screenshot_7](https://user-images.githubusercontent.com/36219488/230720235-0e25d29d-33b8-416d-9f69-7a92539f35b9.png)
### Upon converting , one can hover over to see the original text
![Screenshot_8](https://user-images.githubusercontent.com/36219488/230720237-0bb36eb9-5892-46f8-af19-6a563a805873.png)
### Minimalist Menu
![Untitled](https://user-images.githubusercontent.com/36219488/230720318-6611b786-8d00-4611-bc71-9b1ab6dd3cbe.png)
### Search feature to find non local timezone, can be selected by double clicking
![image](https://user-images.githubusercontent.com/36219488/230972644-64202a24-dfd4-475d-a93c-b613738c272a.png)
### The plugin now allows users to add/remove domains to the whitelist
</details>

--------
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

#### Attributions

<a href="https://www.flaticon.com/free-icons/working-hours" title="working hours icons">Working hours icons created by Maan Icons - Flaticon</a> 
<br> <a href="https://www.iconfinder.com/icons/9071418/sun_icon"> Sun icon </a> by <a href="https://www.iconfinder.com/icon-park">Kmg Design </a> 
<br> <a href="https://www.iconfinder.com/icons/9071456/moon_icon"> Moon icon </a> by <a href="https://www.iconfinder.com/icon-park">Kmg Design </a>
Wallpaper: [Smoke background texture black abstract design](https://www.freepik.com/free-photo/smoke-background-texture-black-abstract-design_17581044.htm#query=website%20background&position=13&from_view=search&track=ais) by rawpixel.com on Freepik <br>
Settings Icons: [bejombah-icon](https://www.iconfinder.com/bejombah-icon) on Iconfinder <br>

Special thanks to [@MAX-dev2020](https://github.com/MAX-dev2020) for contributing 
