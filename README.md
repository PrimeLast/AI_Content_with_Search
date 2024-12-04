# AI Content Generation Chrome Extension

 This extension allows you to track search queries, and generate posts powered by Built-in AI directly in the browser.
 This Chrome extension integrates with the Gemini Nano model using the experimental Prompt API available in Chrome for on-device AI content generation. 

## Overview
Take example of anyone using a Desktop or Laptop, they all use a browser for finding things on the internet.
Everyday millions? billions? of searches are made on the internet. Well Search Provider has huge advantage of generating meaning from the search data. But how can the user create insights on its search history? User browsing the web, may go on serching couple of words, topics in the browser search bar or in seearch engine. at the end of the session, how about the user get extensive actionable summary or report from the browser? Lets say user is trying a online research on web, come across various information sources, data. Learning from the what User has initially wanted to search the web, and which website and the content user has seen, the Buil-in AI can generate thoughtful content, all based on users prefered sources of information, without dumping the search results to user. Giving additional control to user over generating content based on users thinking and sources of data. This is what was in mind when started this project. 
But for now, lets just use the search queris, and ask the Chrome Built-in AI to generate an X post, to see how your random, unrelated or scrambled search words makes sense.


## Features

- **Search Queries List**: View the list of entered search queries from the browsers search bar and Google search.
- **Generate Post**: Generate X post based on search queries.
- **Controls**: Clear the list of search queries, and interact with AI parameters.

## Under Developement:
1. **Search Summary**:
2. **Factual Content Generation in line with visited website and initial search query, even acros various search topics**





## Running this Extension

### Prerequisites
1. **Chrome** with the origin trial enabled for Gemini Nano (Follow the instructions on [Chrome Extensions AI documentation](https://developer.chrome.com/docs/extensions/ai/prompt-api)).

### Steps to Run

1. Clone this repository.
2. Run `npm install` in the project directory to install dependencies.
3. Build the extension by running `npm run build`.
4. Load the `dist` directory as an unpacked extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer Mode" at the top right.
   - Click "Load unpacked" and select the `dist` directory.
5. Click the extension icon to launch the sidebar.
6. Interact with the AI by entering a prompt and adjusting the sliders for model parameters.



## Creating Your Own Extension

If you wish to use this extension as a foundation for your own project, follow these steps:

1. **Add Your Own Origin Trial Token**: Update the `manifest.json` with your own origin trial token in the `"trial_tokens"` field.
2. **Update Model Parameters**: Modify the temperature and top-k parameters in `index.js` for fine-tuning model behavior.
3. **Customize Appearance**: Modify the HTML structure, CSS, or JavaScript for any customizations to the user interface or behavior.

## File Structure

- `index.html`: The main HTML file providing the structure of the extension.
- `index.js`: The JavaScript logic for handling user input, storing queries, interacting with the Gemini Nano API, and generating posts.
- `style.css`: CSS file for styling the extension's UI components.
- `manifest.json`: Defines the Chrome extension settings, permissions, and other metadata.

## API Integration

This extension integrates with the Chrome AI API (Gemini Nano), which allows you to make requests to a language model that generates content based on user inputs. You can control the AI's output with parameters like `temperature` and `top-k`.

1. **Temperature**: Affects how creative or deterministic the AI's response is.
2. **Top-k**: Determines the number of potential outcomes the model considers when responding.

## Contributing

Feel free to submit issues, suggestions, or pull requests to improve the extension. Contributions are always welcome!

## License

This extension is open source and available under the MIT License. Please see the LICENSE file for more details.
