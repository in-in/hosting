//// add url to form
var localHref = window.location.href;
var inputHidden = document.querySelector('input[name="_next"]');
inputHidden.setAttribute('value', localHref);

// hide email
function hide() {
  'use strict';
  // Run btoa('your@email.com') to get yours!
  var base64_email = 'c2V0Zm9ybXpAZ21haWwuY29t';
  var base_url = '//formspree.io/';
  var action = base_url + atob(base64_email);
  document.querySelector('.feedback-form').setAttribute('action', action);
}

hide();


//thanks message
var form = document.getElementsByClassName('feedback-form')[0];
form.addEventListener('submit', captureForm, false);

function captureForm() {
  alert('Thank you for your feedback.');
}