// get the button element
const button = document.querySelector('#submit-button');

// add event listener for button click
button.addEventListener('click', () => {
  // get the input element
  const input = document.querySelector('#input-field');
  
  // get the value of the input
  const inputValue = input.value;
  
  // create a new paragraph element
  const paragraph = document.createElement('p');
  
  // set the text content of the paragraph to the input value
  paragraph.textContent = inputValue;
  
  // get the div element where we want to add the new paragraph
  const outputDiv = document.querySelector('#output');
  
  // append the new paragraph to the output div
  outputDiv.appendChild(paragraph);
  
  // clear the input field
  input.value = '';
});
