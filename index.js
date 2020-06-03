/** @format Bookmarklet*/

//javascript:
(async () => {
  /*const dropdownValues = [
    ['Format', '1:1/Mentorship'],
    ['Discipline', 'Web Dev'],
    ['Course Type', 'Flex']
  ];*/
  const dropdownValues = [
    ['Format', 'Group Sessions'],
    ['Discipline', 'Web Dev'],
    ['Course Type', 'N/A']
  ];
  const findInputByLabel = (label) =>
    [...document.querySelectorAll('label')].filter(
      (el) => el.innerText === label
    )[0].parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0]
      .childNodes[0].childNodes[0].childNodes[0].childNodes[0];

  const findTagByTitle = (title) =>
    document.querySelector(`[title="${title}"] div`);

  const waitForElement = (selector) =>
    new Promise((resolve, reject) => {
      const findElement =
        typeof selector === 'string'
          ? () => document.querySelector(selector)
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

  const changeTypeToFormat = async () => {
    /* Remove admin type */
    findTagByTitle('Admin Time').click();
    /* Click on the time type input (twice)*/
    findInputByLabel('Time Type').click();
    findInputByLabel('Time Type').click();
    /* Wait for the "format" option, then click it */
    const formatOption = await waitForElement(() =>
      document.querySelector(
        '[data-uxi-widget-type="multiselectlistitem"]' +
          '[data-uxi-multiselectlistitem-index="1"]'
      )
    );
    formatOption.click();
  };
  const changeDropdown = async (label, value) => {
    const formatInput = await waitForElement(() => findInputByLabel(label));
    formatInput.click();
    const option = await waitForElement(
      `[aria-label="Submenu ${label}"] [data-automation-label="${label}"]`
    );
    option.click();
    console.log('clicked', option);
    const mentorshipOption = await waitForElement(
      `[data-automation-label="${value}"]`
    );
    mentorshipOption.click();
  };

  await changeTypeToFormat();
  await changeDropdown(dropdownValues[0][0], dropdownValues[0][1]);
  await changeDropdown(dropdownValues[1][0], dropdownValues[1][1]);
  await changeDropdown(dropdownValues[2][0], dropdownValues[2][1]);
})();
