import { auth} from './User.js';
import { getCookie,setCookie,deleteCookie} from './cookies.js';


function checkLogin() {
 var isLoggedIn = getCookie('isLoggedIn');
 var currentUrl = getCookie('currentUrl');
  if (isLoggedIn) {
      // User is logged in, proceed to the restricted page
      const dashboardPage = `/adminPage/${currentUrl}`;
      window.location.href = dashboardPage;
  } else{
    
  }
}


window.onpageshow = function(event) {
  checkLogin();
};

document.addEventListener('DOMContentLoaded', () => {
  checkLogin();
});

window.onbeforeunload = function() {
  checkLogin();
};


