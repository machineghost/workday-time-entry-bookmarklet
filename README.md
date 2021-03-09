## What's a Bookmarklet?

A bookmarklet is a short piece of Javascript code that replaces the URL field of an ordinary browser bookmark.  Whenever the user clicks that bookmark,  its code is run.

## What Does This Bookmarklet Do?
It fills in four fields in the Workday "Enter Time" dialog box (on the "Enter My Time" page). First, it changes the "Time Type" to "Format", and then it sets three other fields: "Format", "Discipline", and "Course Type". When you create the bookmarklet you set the values for those fields, and you can create multiple bookmarklets for different types of time entries.

![Image of Time Entry Dialog](https://github.com/machineghost/workday-time-entry-bookmarklet/blob/master/EnterTimeDialog.png?raw=true)

## Who is This Bookmarklet For?

Anyone who wants to enter time faster in Workday, and who can:

* create a bookmark in their browser
* edit that bookmark (eg. by right-clicking on it)
* copy/paste code into the bookmark's URL/location field.
 
You **do not** need to be a Javascript programmer!

## How Do I Use the Bookmarklet?

First copy/paste the bookmarklet code into any text editing program (eg. Notepad on Windows):

    javascript:(async () => {  const dropdownValues = [    ['Format', '1:1/Mentorship'],    ['Discipline', 'Web Dev'],    ['Course Type', 'Flex']  ];  const findInputByLabel = (label) =>    [...document.querySelectorAll('label')].filter(      (el) => el.innerText === label    )[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0]      .childNodes[0].childNodes[0].childNodes[0].childNodes[0];  const findTagByTitle = (title) =>    document.querySelector(`[title="${title}"] div`);  const waitForElement = (selector) =>    new Promise((resolve, reject) => {      const findElement =        typeof selector === 'string'          ? () => document.querySelector(selector)          : selector;      const selectorString =        typeof selector === 'string' ? selector : 'function';      let attempts = 0;      const tryToGetElement = () => {        window.setTimeout(() => {          let element;          try {            element = findElement();          } catch (err) {}          attempts++;          if (element) return resolve(element);          if (attempts > 9)            reject(`Unable to find element with ${selectorString}`);          else tryToGetElement();        }, 500);      };      tryToGetElement();    });  const changeTypeToFormat = async () => {    /* Remove admin type */    findTagByTitle('Admin Time').click();    /* Click on the time type input (twice)*/    findInputByLabel('Time Type').click();    findInputByLabel('Time Type').click();    /* Wait for the "format" option, then click it */    const formatOption = await waitForElement(() =>      document.querySelector(        '[data-uxi-widget-type="multiselectlistitem"]' +          '[data-uxi-multiselectlistitem-index="1"]'      )    );    formatOption.click();  };  const changeDropdown = async (label, value) => {    const formatInput = await waitForElement(() => findInputByLabel(label));    formatInput.click();    const option = await waitForElement(      `[aria-label="Submenu ${label}"] [data-automation-label="${label}"]`    );    option.click();    console.log('clicked', option);    const mentorshipOption = await waitForElement(      `[data-automation-label="${value}"]`    );    mentorshipOption.click();  };  await changeTypeToFormat();  await changeDropdown(dropdownValues[0][0], dropdownValues[0][1]);  await changeDropdown(dropdownValues[1][0], dropdownValues[1][1]);  await changeDropdown(dropdownValues[2][0], dropdownValues[2][1]);})();
    
Next find this section, near the start:

    ['Format', '1:1/Mentorship'],    ['Discipline', 'Web Dev'],    ['Course Type', 'Flex']
    
Replace "1:1/Mentorship" with your format, and do the same for "Discipline" and "Course Type".  You must use the exact same spelling as in Workday.

For instance, to create a Web Development Office Hours time entry you would change:

    ['Format', '1:1/Mentorship'],    ['Discipline', 'Web Dev'],    ['Course Type', 'Flex']
   
to:

    ['Format', 'Office Hours'],    ['Discipline', 'Web Dev'],    ['Course Type', 'N/A']
    
.. but leave everything else the same. 

After that you just need to create and edit a bookmark in your browser, and then copy paste that code in your text editor into your bookmark's "URL" or "Location" field.

Save your bookmark and that's it (you might want to change it's name first though)!  You can now click that bookmark anytime you have the time entry dialog up in Workday, and it will fill in those values for you.


## I Followed the Above, but Something Didn't Work

Please file an issue in this repository, and/or message me in Chegg Slack.  Do not contact Chegg (this bookmarklet is not an official Chegg project).

## I'm a Dev and I'd Like to Edit and/or Improve This Bookmarklet

You can find the original Javascript code for the bookmarklet (ie. multi-line and indented, *not* formatted as a bookmarklet), in the index.js file in this repository.
