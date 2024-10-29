import { auth,signInWithEmailAndPassword,signOut} from './firebaseSetUp.js';
import { setCookie ,deleteCookie} from './cookies.js';

export function SignIn() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Check if email and password are not empty
  if (!email || !password) {
    Swal.fire({
      title: "Error",
      text: "Please enter both email and password",
      icon: "error"
    });
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Successful login
      const user = userCredential.user;
      user.getIdToken()
        .then((token) => {
          // Use the token as needed
          //console.log('User token:', token);
          
          // Send the token to the backend for verification
          //https://ufypapi.onrender.com/api/v1/users/verifyAdmin
          //http://localhost:10888/api/v1/users/verifyAdmin
          fetch(`${window.API_URL}/api/v1/users/verifyAdmin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          })
            .then((response) => {
              if (response.ok) {
                // Response received successfully
                return response.json();
              } else {
                // Handle error cases
                throw new Error('Request failed');
              }
            })
            .then((data) => {
              if (data.isAdmin) {
                // User is an admin, redirect to the dashboard page
                //console.log("testing you are admin");
                //document.cookie = `email=${user.email}`;
                //sessionStorage.setItem('isLoggedIn', 'true');
                //sessionStorage.setItem('LoginUid', user.uid);
                setCookie('LoginUid', user.uid, 1); // set the LoginUid cookie
                setCookie('isLoggedIn', 'true', 1);
                const isLoggedIn = true;
                window.isLoggedIn = true;
                window.location.href = "./adminPage/home.html";
              } else {
                // User is not an admin, display login failure message
                Swal.fire({
                  title: "Login Failed",
                  text: "You are not an admin.",
                  icon: "error"
                });
              }
            })
            .catch((error) => {
              console.error('Error verifying admin status:', error);
              Swal.fire({
                title: "Error",
                text: "An error occurred while verifying admin status. Please try again.",
                icon: "error"
              });
            });
        })
        .catch((error) => {
          console.error('Error retrieving token:', error);
          Swal.fire({
            title: "Error",
            text: "An error occurred while retrieving user token. Please try again.",
            icon: "error"
          });
        });
    })
    .catch((error) => {
      // Invalid login or error occurred
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire({
        title: "Error",
        text: "Email or password is invalid. Please try again.",
        icon: "error"
      });
    });
}




document.addEventListener('DOMContentLoaded', () => {
  // Get a reference to the loginButton element
  const loginButton = document.getElementById('loginButton');
  // Check if the loginButton element exists
  if (loginButton) {
    // Add an event listener to the loginButton element
    loginButton.addEventListener('click', () => {
      // Call the SignIn function when the loginButton is clicked
      SignIn();
    });
  }

});



export function userLogOut(){
  signOut(auth)
    .then(() => {
      // Logout successful
      console.log("User logged out");
      deleteCookie('isLoggedIn'); // remove the isLoggedIn cookie
      deleteCookie('LoginUid'); // re move the LoginUid cookie
      deleteCookie('currentUrl');
    }).then(() => {
      window.location.href = "/"; 
    })
    .catch((error) => {
      // An error occurred
      console.log("Logout error:", error);
    });
}

window.userLogOut = userLogOut;


export { auth};