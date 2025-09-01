document.addEventListener('DOMContentLoaded', function() {
  const statusDiv = document.getElementById('status');
  const emailList = document.getElementById('email-list');
  const highlightBtn = document.getElementById('highlight-btn');
  const sendBtn = document.getElementById('send-btn');
  
  // Get the current active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const activeTab = tabs[0];
    
    // Request emails from the content script
    chrome.tabs.sendMessage(activeTab.id, {action: "getEmails"}, function(response) {
      if (chrome.runtime.lastError) {
        statusDiv.textContent = "Error: Could not connect to the page.";
        return;
      }
      
      if (response && response.emails && response.emails.length > 0) {
        statusDiv.textContent = `Found ${response.emails.length} email(s)`;
        
        // Display unique emails with checkboxes
        const uniqueEmails = [...new Set(response.emails)];
        uniqueEmails.forEach(email => {
          const div = document.createElement('div');
          div.className = 'email-item';
          
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = email;
          checkbox.id = email;
          
          const label = document.createElement('label');
          label.htmlFor = email;
          label.textContent = email;
          
          div.appendChild(checkbox);
          div.appendChild(label);
          emailList.appendChild(div);
        });
      } else {
        statusDiv.textContent = "No emails found on this page.";
        emailList.innerHTML = '<div class="no-emails">No email addresses detected</div>';
      }
    });
  });
  
  // Highlight emails button
  highlightBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "highlightEmails"});
    });
  });
  
  // Send emails button
  sendBtn.addEventListener('click', function() {
    const selectedEmails = [];
    document.querySelectorAll('#email-list input:checked').forEach(checkbox => {
      selectedEmails.push(checkbox.value);
    });
    
    if (selectedEmails.length > 0) {
      // Open default email client with selected emails
      const mailtoLink = `mailto:${selectedEmails.join(',')}`;
      window.open(mailtoLink);
    } else {
      alert('Please select at least one email address.');
    }
  });
});