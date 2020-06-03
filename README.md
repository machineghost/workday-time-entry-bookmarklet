## workday-time-entry-bookmarklet
Javascript code for a "bookmarklet" that facilitates easier entry into the Workday time management system.

## What is a Bookmarklet?

A bookmarklet is a short piece of Javascript code that replaces the URL of an ordinary bookmark.  After that, whenever the user clicks that bookmark the code is run.

## What Does This Bookmarklet Do?

It fills in four fields in the Workday "Enter Time" dialog box (which you can open by clicking on a time blank on the "Enter My Time" page).  The values it fills can be customized, but the default bookmarklet sets fields for a Web Development Flex mentor.

The four fields are "Time Type" (which will always be set to "Format"), and three customizable fields: "Format", "Discipline", and "Course Type:.

## Who is This Bookmarklet For?

Anyone who enters time through Workday and wants to save themselves some time.  You must be able to A) create a bookmark in your browser, B) edit that bookmark, and C) copy/paste code into the bookmark's URL/location field.  You **do not** need to be a Javascript programmer!

## I'm Sold: How Do I Use the Bookmarklet?

First off, you will need to copy/paste the bookmarklet code, and set the values that you want it to fill in.  That code is:

    javascript:(async () => {  const dropdownValues = [    ['Format', '1:1/Mentorship'],    ['Discipline', 'Web Dev'],    ['Course Type', 'Flex']  ];  const findInputByLabel = (label) =>    [...document.querySelectorAll('label')].filter(      (el) => el.innerText === label    )[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0]      .childNodes[0].childNodes[0].childNodes[0].childNodes[0];  const findTagByTitle = (title) =>    document.querySelector(`[title="${title}"] div`);  const waitForElement = (selector) =>    new Promise((resolve, reject) => {      const findElement =        typeof selector === 'string'          ? () => document.querySelector(selector)          : selector;      const selectorString =        typeof selector === 'string' ? selector : 'function';      let attempts = 0;      const tryToGetElement = () => {        window.setTimeout(() => {          let element;          try {            element = findElement();          } catch (err) {}          attempts++;          if (element) return resolve(element);          if (attempts > 9)            reject(`Unable to find element with ${selectorString}`);          else tryToGetElement();        }, 500);      };      tryToGetElement();    });  const changeTypeToFormat = async () => {    /* Remove admin type */    findTagByTitle('Admin Time').click();    /* Click on the time type input (twice)*/    findInputByLabel('Time Type').click();    findInputByLabel('Time Type').click();    /* Wait for the "format" option, then click it */    const formatOption = await waitForElement(() =>      document.querySelector(        '[data-uxi-widget-type="multiselectlistitem"]' +          '[data-uxi-multiselectlistitem-index="1"]'      )    );    formatOption.click();  };  const changeDropdown = async (label, value) => {    const formatInput = await waitForElement(() => findInputByLabel(label));    formatInput.click();    const option = await waitForElement(      `[aria-label="Submenu ${label}"] [data-automation-label="${label}"]`    );    option.click();    console.log('clicked', option);    const mentorshipOption = await waitForElement(      `[data-automation-label="${value}"]`    );    mentorshipOption.click();  };  await changeTypeToFormat();  await changeDropdown(dropdownValues[0][0], dropdownValues[0][1]);  await changeDropdown(dropdownValues[1][0], dropdownValues[1][1]);  await changeDropdown(dropdownValues[2][0], dropdownValues[2][1]);})();
    
If you are *not* a Web Development Flex mentor you will need to change the beginning of the script to set the three fields you desire.  For instance, if you wanted to create a bookmarklet for Group Session time entry (also for Web Dev, but for any course type), you would change the start of the script from:

    javascript:(async () => {  const dropdownValues = [    ['Format', '1:1/Mentorship'],    ['Discipline', 'Web Dev'],    ['Course Type', 'Flex']  ];
   
to instead be:

    javascript:(async () => {  const dropdownValues = [    ['Format', 'Group Sessions'],    ['Discipline', 'Web Dev'],    ['Course Type', 'N/A']  ];
    
(but you would leave the rest the same).  Once you have done that you simply need to:

1. Create a new bookmark in your browser (eg. in Chrome click the three dots to open the menu, choose "Bookmarks" and then choose "Bookmark this Tab".

2. Edit the bookmark (eg. in Chrome click the three dots to open the menu, choose "Bookmarks", find your bookmark, right-click on it, and choose "Edit")

3. Replace the URL in the "URL" field with the code for the bookmarklet

4. Save your bookmark

That's it!  Once you've done that, you can click that bookmark at any time while you have the time entry dialog open in Workday, and it will automatically fill in the selected fields for you.

## I Followed the Above, and it Didn't Work

Please file an issue in this repository and/or message me in Chegg Slack.  I'll do my best, but please understand this was a volunteer effort, not a paid service from Thinkful.

## The Bookmarklet Used to Work, Then Stopped

This sort of code is heavily dependent on the specifics of Workday's HTML: if that HTML ever changes, it will break.  When that happens please let me know (again via GitHub issue and/or Slack) and I'll do my best to update it.

## I'm a Dev and I'd Like to Edit and/or Improve This Bookmarklet

You can find the original code for the bookmarklet, *not* formatted to be a bookmarklet, but instead as normal (multi-line/indented) Javascript code, in the index.js file in this repository.
