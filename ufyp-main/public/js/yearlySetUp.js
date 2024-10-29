function getCookie(name) {
    const cookieName = name + '=';
    const cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return '';
}

async function setupYearlyAttendance(){
    try {
      const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will create a new yearly attendance record. Are you sure you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, create it!',
        cancelButtonText: 'No, cancel'
      });
  
      if (!confirmed.isConfirmed) {
        return;
      }
  
      const response = await fetch(`${window.API_URL}/api/v1/yearlySetup/createYearlyAttendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        //body: JSON.stringify({ year: selectedYear })
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          Swal.fire({
            title: 'Create Yearly Attendance',
            text:  result.message,
            icon: 'success',
          }).then(() => {

          });
        } else {
          Swal.fire({
            title: 'Error',
            text: result.message,
            icon: 'error',
          });
        }
      } else {
        throw new Error('Failed to create yearly attendance.');
      }
  
      //return response;
      
    } catch (error) {
      console.error(error);
    }
}

async function deleteAttendanceCollection(){
    try {
      const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will delete yearly attendance record. Are you sure you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel'
      });
  
      if (!confirmed.isConfirmed) {
        return;
      }
  
      const response = await fetch(`${window.API_URL}/api/v1/yearlySetup/deleteAttendanceCollection`, {
        method: "Delete",
        headers: {
          "Content-Type": "application/json"
        },
        //body: JSON.stringify({ year: selectedYear })
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          Swal.fire({
            title: 'Delete Yearly Attendance',
            text:  result.message,
            icon: 'success',
          }).then(() => {

          });
        } else {
          Swal.fire({
            title: 'Error',
            text: result.message,
            icon: 'error',
          });
        }
      } else {
        throw new Error('Failed to delete yearly attendance.');
      }
  
     // return response;
      
    } catch (error) {
      console.error(error);
    }
}