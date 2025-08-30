chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript(
      {
        target: {tabId: tabs[0].id},
        func: () => {
          return [...document.body.innerText.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g)].map(m => m[0]);
        }
      },
      (results) => {
        let emails = [...new Set(results[0].result)];
        let ul = document.getElementById("email-list");
        emails.forEach(email => {
          let li = document.createElement("li");
          li.innerHTML = `${email} <a href="mailto:${email}">Send</a>`;
          ul.appendChild(li);
        });
      }
    );
  });
  