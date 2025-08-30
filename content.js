// Regex for detecting emails
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g;

let bodyText = document.body.innerHTML;
let foundEmails = bodyText.match(emailRegex);

if (foundEmails) {
    console.log("Emails found:", [...new Set(foundEmails)]);
    
    // Highlight emails
    foundEmails.forEach(email => {
        document.body.innerHTML = document.body.innerHTML.replace(
            new RegExp(email, "g"),
            `<span style="background: yellow; padding:2px;">${email} 
             <a href="mailto:${email}" style="color:blue; font-weight:bold;">Send</a></span>`
        );
    });
}
