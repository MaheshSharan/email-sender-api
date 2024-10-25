// scripts/app.js

let apiKey = localStorage.getItem('apiKey') || '';
document.getElementById('apiKeyInput').value = apiKey;

function confirmGenerateApiKey() {
  Swal.fire({
    title: 'Generate New API Key?',
    text: 'Generating a new API key will discard your existing key.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, generate new key!'
  }).then((result) => {
    if (result.isConfirmed) {
      generateApiKey();
    }
  });
}

function generateApiKey() {
  const companyId = document.getElementById('companyId').value;
  document.getElementById('apiKeyResult').innerText = 'Generating API Key...';

  fetch('http://localhost:3000/api/auth/keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyId })
  })
  .then(response => response.json())
  .then(result => {
    if (result.success && result.data.key) {
      apiKey = result.data.key;
      localStorage.setItem('apiKey', apiKey);
      document.getElementById('apiKeyInput').value = apiKey;
      Swal.fire({
        title: 'API Key Generated!',
        text: `Your new API key is: ${apiKey}`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        title: 'Error!',
        text: result.message || 'Failed to generate API key.',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  })
  .catch(error => {
    console.error('Error:', error);
    Swal.fire({
      title: 'Error!',
      text: 'An error occurred while generating API key.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  });
}

function sendEmail() {
  apiKey = document.getElementById('apiKeyInput').value;

  if (!apiKey) {
    Swal.fire({
      title: 'No API Key',
      text: 'Please enter or generate an API key first!',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    return;
  }

  const data = {
    from: document.getElementById('fromEmail').value,
    to: document.getElementById('toEmail').value,
    subject: document.getElementById('subject').value,
    content: document.getElementById('content').value
  };

  fetch('http://localhost:3000/api/messages', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      Swal.fire({
        title: 'Email Sent!',
        text: 'Your email has been successfully sent.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        title: 'Error!',
        text: result.message || 'Failed to send email.',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  })
  .catch(error => {
    console.error('Error:', error);
    Swal.fire({
      title: 'Error!',
      text: 'An error occurred while sending the email.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  });
}
