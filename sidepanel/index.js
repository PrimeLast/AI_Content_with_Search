import DOMPurify from 'dompurify';
import { marked } from 'marked';

const inputPrompt = document.querySelector('#input-prompt');
const buttonPrompt = document.querySelector('#button-prompt');
const buttonReset = document.querySelector('#button-reset');
const elementResponse = document.querySelector('#response');
const elementLoading = document.querySelector('#loading');
const elementError = document.querySelector('#error');
const sliderTemperature = document.querySelector('#temperature');
const sliderTopK = document.querySelector('#top-k');
const labelTemperature = document.querySelector('#label-temperature');
const labelTopK = document.querySelector('#label-top-k');
const searchQueriesList = document.querySelector('#searchQueriesList');
const clearQueriesBtn_2 = document.querySelector('#clearQueriesBtn_2');

let session;

// Function to run the prompt and get the result from the AI
async function runPrompt(prompt, params) {
  try {
    if (!session) {
      session = await chrome.aiOriginTrial.languageModel.create(params);
    }
    return session.prompt(prompt);
  } catch (e) {
    console.error('Prompt failed', e);
    reset();
    throw e;
  }
}

// Reset the session
async function reset() {
  if (session) {
    session.destroy();
  }
  session = null;
}




// Event listener for "Generate Single Post" button
document.querySelector('#generate-single-post-btn_2').addEventListener('click', () => {
  generateSinglePost();
});

// Function to generate a single post based on search queries
async function generateSinglePost() {
  try {
    // Get all search queries from local storage
    const data = await new Promise((resolve, reject) => {
      chrome.storage.local.get('searchQueries', (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(data);
        }
      });
    });

    const searchQueries = data.searchQueries || [];

    if (searchQueries.length === 0) {
      showError('No search queries found.');
      return;
    }

    // Combine all search queries into one prompt
    const combinedPrompt = `Generate a single X post that integrates the following topics in a cohesive manner: 
      ${searchQueries.join(', ')}. The post should cover all topics and be engaging and relevant to each one.`;

    // Set the parameters for the AI model
    const params = {
      systemPrompt: 'You are an expert social media content creator. Generate a single X post that is relevant to all the following topics.',
      temperature: sliderTemperature.value,
      topK: sliderTopK.value,
    };

    // Show loading state
    showLoading();

    // Run the prompt to generate the post
    const response = await runPrompt(combinedPrompt, params);

    // Show the generated post
    showResponse(response);

  } catch (e) {
    // Handle errors
    showError(e);
  }
}



// Function to initialize the default settings for the model
function populateSearchQueries() {
  const searchQueriesList = document.getElementById('searchQueriesList');
  if (!searchQueriesList) return;  // Exit if the container is not found

  chrome.storage.local.get('searchQueries', (data) => {
      const searchQueries = data.searchQueries || []; // Get stored queries or default to empty array

      // Clear any existing queries in the list
      searchQueriesList.innerHTML = '';

      // If no queries are found, show a message
      if (searchQueries.length === 0) {
          let emptyMessage = searchQueriesList.querySelector('.empty-message');
          if (!emptyMessage) {
              emptyMessage = document.createElement('div');
              emptyMessage.classList.add('empty-message');
              searchQueriesList.appendChild(emptyMessage);
          }
          emptyMessage.textContent = 'No search queries found.';
      } else {
          // Remove the empty message if queries are present
          const emptyMessage = searchQueriesList.querySelector('.empty-message');
          if (emptyMessage) {
              emptyMessage.remove();
          }

          // Iterate over the queries and add them to the list
          searchQueries.forEach((query) => {
            const queryDiv = document.createElement('div');
              queryDiv.classList.add('query_class');
              queryDiv.classList.add('magicalText');
            queryDiv.textContent = query;
            searchQueriesList.appendChild(queryDiv);
          });
      }
  });
}

// Initial population of the list when the side panel is first loaded
populateSearchQueries();

// Listen for changes in storage and update the list dynamically
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.searchQueries) {
      // If searchQueries change, repopulate the list
      populateSearchQueries();
  }
});


// Function to display the response
function showResponse(response) {
  hide(elementLoading);
  show(elementResponse);
  elementResponse.innerHTML = DOMPurify.sanitize(marked.parse(response));
}

// Show loading spinner
function showLoading() {
  buttonReset.removeAttribute('disabled');
  hide(elementResponse);
  hide(elementError);
  show(elementLoading);
}

// Show error message
function showError(error) {
  show(elementError);
  hide(elementResponse);
  hide(elementLoading);
  elementError.textContent = error;
}

// Show an element
function show(element) {
  element.removeAttribute('hidden');
}

// Hide an element
function hide(element) {
  element.setAttribute('hidden', '');
}



// Function to clear all search queries
function clearAllQueries() {
  chrome.runtime.sendMessage({ action: 'clearQueries' }, (response) => {
    if (response.success) {
      populateSearchQueries();
    } else {
      console.error('Failed to clear queries.');
    }
  });
}

// Event listener for clearing search queries
clearQueriesBtn_2.addEventListener('click', clearAllQueries);

// Event listener for slider changes
sliderTemperature.addEventListener('input', (event) => {
  labelTemperature.textContent = event.target.value;
  reset();
});
sliderTopK.addEventListener('input', (event) => {
  labelTopK.textContent = event.target.value;
  reset();
});

// Event listener for prompt input
inputPrompt.addEventListener('input', () => {
  if (inputPrompt.value.trim()) {
    buttonPrompt.removeAttribute('disabled');
  } else {
    buttonPrompt.setAttribute('disabled', '');
  }
});

// Event listener for the "Run" button
buttonPrompt.addEventListener('click', async () => {
  const prompt = inputPrompt.value.trim();
  showLoading();
  try {
    const params = {
      systemPrompt: 'You are a helpful and friendly assistant.',
      temperature: sliderTemperature.value,
      topK: sliderTopK.value,
    };
    const response = await runPrompt(prompt, params);
    showResponse(response);

    // Save the query to storage after running the prompt
    chrome.storage.local.get('searchQueries', (data) => {
      const searchQueries = data.searchQueries || [];
      searchQueries.push(prompt);
      chrome.storage.local.set({ searchQueries });
    });
  } catch (e) {
    showError(e);
  }
});







// Initial setup
//initDefaults();
populateSearchQueries();
