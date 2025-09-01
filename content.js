// Function to find all email addresses in the page text
function findEmails() {
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    const text = document.body.textContent;
    const emails = text.match(emailRegex) || [];
    return emails;
  }
  
  // Function to highlight email addresses on the page
  function highlightEmails() {
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    
    // Remove existing highlights
    document.querySelectorAll('.email-highlight').forEach(el => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
    
    // Walk through all text nodes
    const walk = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    const textNodes = [];
    
    while (node = walk.nextNode()) {
      if (node.textContent.match(emailRegex)) {
        textNodes.push(node);
      }
    }
    
    // Highlight emails in each text node
    textNodes.forEach(node => {
      const span = document.createElement('span');
      span.innerHTML = node.textContent.replace(
        emailRegex,
        '<span class="email-highlight" style="background-color: yellow; padding: 2px; border-radius: 3px;">$&</span>'
      );
      node.parentNode.replaceChild(span, node);
    });
  }
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getEmails") {
      const emails = findEmails();
      sendResponse({emails: emails});
    } else if (request.action === "highlightEmails") {
      highlightEmails();
      sendResponse({status: "emails highlighted"});
    }
    return true; // Keeps the message channel open for async response
  });