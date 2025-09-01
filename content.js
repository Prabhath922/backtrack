const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g;

// Store found emails (unique only)
let foundEmails = new Set();

function wrapEmails(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.textContent;
    let matches = text.match(emailRegex);

    if (matches) {
      matches.forEach(email => foundEmails.add(email)); // keep unique

      // Replace in-place safely (no innerHTML nuking the page)
      let span = document.createElement("span");
      span.innerHTML = text.replace(emailRegex, (email) =>
        `<span style="background: yellow; padding:2px;">${email} 
          <a href="mailto:${email}" style="color:blue; font-weight:bold;">Send</a></span>`
      );
      node.replaceWith(span);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "A" && node.tagName !== "SCRIPT" && node.tagName !== "STYLE") {
    // Skip links, scripts, and styles
    node.childNodes.forEach(wrapEmails);
  }
}

// Run through the body
wrapEmails(document.body);

// Log unique emails
console.log("Unique emails found:", [...foundEmails]);
