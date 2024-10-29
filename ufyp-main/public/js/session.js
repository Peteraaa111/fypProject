import { auth,signOut} from './firebaseSetUp.js';
import { getCookie,setCookie,deleteCookie} from './cookies.js';

function checkSession() {
  var isLoggedIn = getCookie('isLoggedIn');
  if (isLoggedIn) {
    // User is logged in or has an active session, proceed to the restricted page
    console.log("isLoggedIn")
    return true;
  }
  return false;
}

if (!checkSession()) {
  // sessionLogOut().then(() => {
  //   sessionStorage.setItem('isSessionLogOut', true);
  // });
  sessionLogOut();

}



function sessionLogOut(){
  signOut(auth)
    .then(() => {
      // Logout successful
      deleteCookie('isLoggedIn'); // remove the isLoggedIn cookie
      deleteCookie('LoginUid'); // remove the LoginUid cookie
      deleteCookie('currentUrl');
      window.location.href = "/"; 
    }).then(() => {
      sessionStorage.setItem('isSessionLogOut', true);
    })
    .catch((error) => {
      // An error occurred
      console.log("Logout error:", error);
    });
}

let timeout;
let uid = getCookie('LoginUid');
let loginValid = getCookie('isLoggedIn'); 
let currentPage = window.location.href;
let lastPart = currentPage.substring(currentPage.lastIndexOf('/') + 1);
//var isLoggedIn = false;

setCookie('currentUrl', lastPart, 1);
// Function to reset the session timeout


function resetSessionTimeout() {
    clearTimeout(timeout);
    //   timeout = window.setTimeout(userLogOut(), 5000); // Set timeout to 1 hours  (3600000)
    timeout = setTimeout(sessionLogOut,3600000);
    //  // console.log("reset");
    if (timeout) {
      setCookie('isLoggedIn', loginValid, 1); // Update expiration time to 1 hour
      setCookie('LoginUid', uid, 1); // Update expiration time to 1 hour
    }
  }
  



function handleUserActivity() {
  resetSessionTimeout();
}


// Add event listeners to detect user activity
document.addEventListener('mousemove', handleUserActivity);
document.addEventListener('mousedown', handleUserActivity);
document.addEventListener('keypress', handleUserActivity);
document.addEventListener('touchstart', handleUserActivity);



