// chrome.contextMenus.create({
//     id: "main_page",
//     title: "Open Main Page", 
//     onclick: () => {
//       chrome.tabs.create({  
//         url: chrome.runtime.getURL("src/popup.html")
//       });
//     },
//     contexts: ["browser_action"]
//   }, () => {});

  // chrome.contextMenus.onClicked.addListener((info, tab) => {
  //     tab.create({  
  //       url: chrome.runtime.getURL("src/popup.html")
  //     });
  // })