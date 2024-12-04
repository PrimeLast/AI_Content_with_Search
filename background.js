// Set panel behavior to open on action click
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Error setting panel behavior:", error));

// Open side panel when the browser action is clicked
chrome.action.onClicked.addListener(() => {
  try {
    chrome.sidePanel.open({ path: "sidepanel.html" });
  } catch (error) {
    console.error("Error opening side panel: ", error);
  }
});

let searchQueries = [];

// Listen for changes in the URL (address bar)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    // Check if the URL is a search query (example: Google search query with ?q=)
    const url = new URL(changeInfo.url);
    if (url.searchParams.has("q")) {
      const query = url.searchParams.get('q');
      if (query) {
        // Get current list of search queries from storage
        chrome.storage.local.get('searchQueries', (data) => {
          searchQueries = data.searchQueries || []; // Default to an empty array if none exist
          
          // Append the new query to the list
          searchQueries.push(query);

          // Update the storage with the new list of queries
          chrome.storage.local.set({ searchQueries }, () => {
            console.log("Updated searchQueries in storage");
          });
        });
      }
    }
  }
});

// Function to clear all search queries from storage
function clearAllSearchQueries() {
  chrome.storage.local.set({ searchQueries: [] }, () => {
    console.log("All search queries cleared");
  });
}

// Handle requests from the side panel to clear search queries
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'clearQueries') {
    // Clear search queries in local storage
    chrome.storage.local.set({ searchQueries: [] }, () => {
      console.log("Search queries cleared.");
      // Send a response back indicating success
      sendResponse({ success: true });
    });
    // Return true to indicate we will send a response asynchronously
    return true; // This keeps the message port open for the response
  }
});
