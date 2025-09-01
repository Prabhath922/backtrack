document.addEventListener('DOMContentLoaded', function() {
  const statusDiv = document.getElementById('status');
  const emailList = document.getElementById('email-list');
  const highlightBtn = document.getElementById('highlight-btn');
  const sendBtn = document.getElementById('send-btn');
  const processingBtn = document.getElementById('processing-btn');
  const rejectedBtn = document.getElementById('rejected-btn');
  const underreviewBtn = document.getElementById('underreview-btn');
  
  // Email templates
  const emailTemplates = {
    processing: "Dear Candidate,\n\nThank you for your application. We are currently processing your application and will update you on the status shortly.\n\nBest regards,\nRecruitment Team",
    rejected: "Dear Candidate,\n\nAfter careful consideration, we regret to inform you that your application has not been successful at this time.\n\nWe appreciate your interest in our company and encourage you to apply for future positions that match your skills and experience.\n\nBest regards,\nRecruitment Team",
    underreview: "Dear Candidate,\n\nWe are writing to inform you that your application is currently under review by our hiring team.\n\nWe will contact you as soon as a decision has been made. This process typically takes 7-10 business days.\n\nBest regards,\nRecruitment Team"
  };
  
  let currentTemplate = emailTemplates.processing;
  
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
      statusDiv.textContent = "Emails highlighted on page";
    });
  });
  
  // Processing application button
  processingBtn.addEventListener('click', function() {
    currentTemplate = emailTemplates.processing;
    statusDiv.textContent = "Processing application template selected";
  });
  
  // Rejected email button
  rejectedBtn.addEventListener('click', function() {
    currentTemplate = emailTemplates.rejected;
    statusDiv.textContent = "Rejection email template selected";
  });
  
  // Under review email button
  underreviewBtn.addEventListener('click', function() {
    currentTemplate = emailTemplates.underreview;
    statusDiv.textContent = "Under review email template selected";
  });
  
  // Send emails button
  sendBtn.addEventListener('click', function() {
    const selectedEmails = [];
    document.querySelectorAll('#email-list input:checked').forEach(checkbox => {
      selectedEmails.push(checkbox.value);
    });
    
    if (selectedEmails.length > 0) {
      // Encode the template for use in mailto link
      const encodedTemplate = encodeURIComponent(currentTemplate);
      
      // Open default email client with selected emails and template
      const mailtoLink = `mailto:${selectedEmails.join(',')}?body=${encodedTemplate}`;
      window.open(mailtoLink);
    } else {
      alert('Please select at least one email address.');
    }
  });
});