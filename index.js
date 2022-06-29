/** @format Bookmarklet*/

//javascript:
(async () => {
  const config = {
    sessionLength: 40,
    dropdownValues: [
      ['Format', '1:1/Mentorship'],
      ['Discipline', 'Web Dev'],
      ['Course Type', 'Flex'],
    ],
  };
  const { dropdownValues, sessionLength } = config;
  const findInputByLabel = (label) =>
    [...document.querySelectorAll('label')].filter(
      (el) => el.innerText === label
    )[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0]
      .childNodes[0].childNodes[0].childNodes[0].childNodes[0];

  const waitForElement = (selector, index = 0) =>
    new Promise((resolve, reject) => {
      const findElement =
        typeof selector === 'string'
          ? () => document.querySelectorAll(selector)[index]
          : selector;
      const selectorString =
        typeof selector === 'string' ? selector : 'function';
      let attempts = 0;
      const tryToGetElement = () => {
        window.setTimeout(() => {
          let element;
          try {
            element = findElement();
          } catch (err) {}
          attempts++;
          if (element) return resolve(element);

          if (attempts > 9)
            reject(`Unable to find element with ${selectorString}`);
          else tryToGetElement();
        }, 500);
      };
      tryToGetElement();
    });

  const changeDropdown = async (label, value) => {
    const formatInput = await waitForElement(() => findInputByLabel(label));
    formatInput.click();
    const option = await waitForElement(
      `[aria-label="Submenu ${label}"] [data-automation-label="${label}"]`
    );
    option.click();

    const mentorshipOption = await waitForElement(
      `[data-automation-label="${value}"]`
    );
    mentorshipOption.click();
  };

  const setEndTime = async () => {
    const startTimeInput = await waitForElement('.gwt-TextBox.WFT2.WPT2');
    startTimeInput.dispatchEvent(new Event('blur'));
    const startTime = startTimeInput.value;
    let [timePart, amPm] = startTime.split(' ');
    const [hoursStr, minutesStr] = timePart.split(':');
    const startHours = Number(hoursStr);
    const startMinutes = Number(minutesStr);
    let endHours = startHours;
    let endMinutes = startMinutes + sessionLength;
    if (endMinutes > 59) {
      endMinutes -= 60;
      endHours += 1;
      if (endHours > 12) {
        endHours -= 12;
        if (startHours !== 12) {
          amPm = amPm === 'AM' ? 'PM' : 'AM';
        }
      } else if (endHours === 12 && startHours !== 12) {
        amPm = amPm === 'AM' ? 'PM' : 'AM';
      }
    }
    if (!endMinutes) endMinutes = '00';
    const endTimeInput = await waitForElement('.gwt-TextBox.WFT2.WPT2', 1);
    endTimeInput.value = `${endHours}:${endMinutes} ${amPm}`;
    endTimeInput.dispatchEvent(new Event('blur'));
  };

  await setEndTime();
  await changeDropdown(dropdownValues[0][0], dropdownValues[0][1]);
  await changeDropdown(dropdownValues[1][0], dropdownValues[1][1]);
  await changeDropdown(dropdownValues[2][0], dropdownValues[2][1]);
  (
    await waitForElement(
      `[data-automation-id="wd-CommandButton"] span[title="OK"]`
    )
  ).click();
})();
