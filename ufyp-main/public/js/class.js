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

function fetchYearAndClass() {
    fetch(`${window.API_URL}/api/v1/class/getAcademicYearWithClasses`)
      .then((response) => response.json())
      .then((data) => {
        const academicYearSelect = document.getElementById('academicYearSelect');
        const classSelect = document.getElementById('classSelect');
        const classYearDiv = document.getElementById('classYearDiv');
        // Clear previous options
        academicYearSelect.innerHTML = '';
        classSelect.innerHTML = '';

        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.text = 'Select an academic year';
        placeholderOption.disabled = true;
        placeholderOption.selected = true; // Set it as the selected option
        academicYearSelect.appendChild(placeholderOption);


        // Populate academic year select box
        data.data.forEach((academicYear) => {
          const option = document.createElement('option');
          option.value = academicYear.id;
          option.text = academicYear.id;
          academicYearSelect.appendChild(option);
        });
        // Hide the class select box initially
        classYearDiv.style.display = 'none';
        // Populate class select box based on the selected academic year
        academicYearSelect.addEventListener('change', (event) => {
          const selectedAcademicYear = event.target.value;
          const selectedYearData = data.data.find((academicYear) => academicYear.id === selectedAcademicYear);
          
          // Clear previous options
          classSelect.innerHTML = '';

          const placeholderOption2 = document.createElement('option');
          placeholderOption2.value = '';
          placeholderOption2.text = 'Select an class';
          placeholderOption2.disabled = true;
          placeholderOption2.selected = true; // Set it as the selected option
          classSelect.appendChild(placeholderOption2);
  
          
          // Show the class select box if an academic year is selected
          classYearDiv.style.display = selectedAcademicYear ? 'block' : 'none';
        
          selectedYearData.classes.forEach((className) => {
            const option = document.createElement('option');
            option.value = className.id;
            option.text = className.id;
            classSelect.appendChild(option);
          });
        });
      })
    .catch((error) => {
    console.error('Error fetching data:', error);
    });
}

let table; // Declare table variable in the outer scope

let table2;

function initializeDataTable() {
  table = $('#studentsTable').DataTable({
    columns: [
      { title: 'Class Number' },
      { title: 'Student Chinese Name' },
      { title: 'Student English Name' },
      { title: 'Student ID' },
      { title: 'Action' },
    ],
  });

  table2 = $('#addStudentTable').DataTable({
    columns: [
      { title: 'Student ID' },
      { title: 'Student Chinese Name' },
      { title: 'Select Class' },
    ],
    columnDefs: [
      {
        targets: 0, // Index of the 'ID' column
        type: 'numeric', // Use numeric sorting
        render: function (data, type, row) {
          // Extract the numeric part from the 's_id' value
          if (type === 'sort') {
            // Extract the numeric part from the 's_id' value for sorting
            return parseInt(data.match(/\d+/)[0], 10);
          } else {
            // Display the original 's_id' value with the "student" prefix
            return data;
          }
        },
      },
    ],
    order: [[0, 'asc']], // Sort by the 'ID' column in ascending order
    select: {
      style: 'multi',
      selector: 'td:not(:last-child)'
    },
  });
}


function fetchClassmate() {
  const academicYearSelect = document.getElementById('academicYearSelect');
  const classSelect = document.getElementById('classSelect');

  academicYearSelect.addEventListener('change', fetchData);
  classSelect.addEventListener('change', fetchData);
}

function fetchData() {
  const year = academicYearSelect.value;
  const classID = classSelect.value;

  if (year && classID) {
    fetch(`${window.API_URL}/api/v1/class/getClassmateByAcademicYearAndClass/${year}/${classID}`)
      .then((response) => response.json())
      .then((data) => {
        table.clear().draw();
        data.forEach((student) => {
          var rowData = [
            student.classNumber,
            student.studentChiName,
            student.studentEngName,
            student.studentId,
            `<button class="btn btn-circle btn-danger" title="Remove" onclick="removeStudent('${student.studentId}')"><i class="fa fa-trash"></i></button>`,
          ];
          table.row.add(rowData).draw();
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
}

function fetchDataAndPopulateSelections() {
  const academicYearSelect = document.getElementById('academicYearSelect');
  const year = academicYearSelect.value;
  // Fetch unassigned students and current year class IDs
  fetch(`${window.API_URL}/api/v1/class/getUnassignedStudentsAndClass/`)
    .then((response) => response.json())
    .then((data) => {

      const userList = data.userList.data;
      const currentYearClassIds = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"];
      table2.clear().draw();
      // Populate student selection
      userList.forEach((user) => {
        //const inputElement = table2.querySelector('input[type="checkbox"]');
        var rowData = [
          user.s_Id,
          user.s_ChiName,
          createClassSelect(currentYearClassIds), // Add selection box to row data
        ];
        table2.row.add(rowData).draw();
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

function createClassSelect(classIds) {
  const select = document.createElement('select');
  select.classList.add('form-select'); 
  classIds.forEach((classId) => {
    const option = document.createElement('option');
    option.value = classId;
    option.text = classId;
    select.appendChild(option);
  });
  return select.outerHTML;
}

function uncheckAll() {
  table2.rows( { selected: true } ).deselect();
}

function addStudentToClass() {
  const fullSelected = [];
  const CurrentUserUid = getCookie('LoginUid');
  const academicYearValue = document.getElementById('academicYearSelect').value
  table2.rows( {selected: true} ).every( function ( rowIdx, tableLoop, rowLoop ) {
    var data = this.data();
    const sId = data[0];
    const classId = $('select', this.node()).val();
    fullSelected.push({sid:sId, classId:classId});
  });

  if (fullSelected.length === 0) {
    swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Please select at least one student',
    });
    return 
  }

  Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to add the student to the class?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      // Convert form data to JSON object

      fetch(`${window.API_URL}/api/v1/class/addStudentToClass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullSelected, CurrentUserUid,academicYearValue }),
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              title: 'Student added successfully',
              icon: 'success',
            }).then(() => {
              // Refresh the page
              fetchDataAndPopulateSelections();
              fetchData();
              $('#addStudentModal').modal('hide');
              //location.reload();
            });
          } else {
            response.text().then((errorMessage) => {
              Swal.fire({
                title: errorMessage,
                icon: 'error',
              });
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
          });
        });
    }
  });

}

// Get the selection elements and the button
function wait(){
  // Initially hide the button
  const resizeButton = document.getElementById('resizeClassNumber');
  resizeButton.style.display = 'none';

  const academicYearSelect = document.getElementById('academicYearSelect');
  const classSelect = document.getElementById('classSelect');
  // Add event listeners to the selection elements
  academicYearSelect.addEventListener('change', toggleResizeButtonVisibility);
  classSelect.addEventListener('change', toggleResizeButtonVisibility);
  
  // Function to toggle the visibility of the resize button
  function toggleResizeButtonVisibility() {
    if (academicYearSelect.value === "" || classSelect.value ==="") {
      resizeButton.style.display = 'none'; // Hide the button
    } else {
      resizeButton.style.display = 'block'; // Show the button
    }
  }
}

async function redistributeClassNumber() {
  const CurrentUserUid = getCookie('LoginUid');
  const classSelect = document.getElementById('classSelect');
  const academicYearValue = document.getElementById('academicYearSelect').value
  const selectedClass = classSelect.value;
  try {
    const confirmed = await Swal.fire({
      title: 'Redistribute Class Numbers',
      text: 'Are you sure you want to redistribute class numbers? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, redistribute',
      cancelButtonText: 'Cancel',
    });

    if (confirmed.isConfirmed) {
      const data = selectedClass ;

      const response = await fetch(`${window.API_URL}/api/v1/class/redistributeClassNumber`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, CurrentUserUid,academicYearValue }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          Swal.fire({
            title: 'Class numbers redistributed',
            text: 'Class numbers have been successfully redistributed.',
            icon: 'success',
          }).then(() => {
            fetchData();
            // Refresh the page
            //location.reload();
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: result.message,
            icon: 'error',
          });
        }
      } else {
        throw new Error('Failed to redistribute class numbers.');
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

function removeStudent(studentId) {
  const CurrentUserUid = getCookie('LoginUid');
  const classSelect = document.getElementById('classSelect');
  const academicYearValue = document.getElementById('academicYearSelect').value
  const selectedClass = classSelect.value;

  // Check if a class is selected
  if (!selectedClass) {
    console.error('No class selected');
    return;
  }

  // Show Swal confirm dialog
  Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to remove this student from the class?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed, make the API request
      fetch(`${window.API_URL}/api/v1/class/removeStudentFromClass/${selectedClass}/${studentId}/${CurrentUserUid}/${academicYearValue}`, {
        method: 'DELETE',
      })
        .then((response) => {
          console.log(response); // Log the response here
          return response.json();
        })
        .then((data) => {
          // Handle the response data
          if (data.success) {
            Swal.fire({
              title: 'Success',
              text: 'Student removed from the class successfully',
              icon: 'success',
            }).then(() => {
              // Refresh the page
              //location.reload();
              fetchData();
              fetchDataAndPopulateSelections();
            });
            // Perform any necessary actions after successful deletion
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to remove student from the class',
              icon: 'error',
            });
            // Perform any necessary actions after failed deletion
          }
          console.log('Student data deleted:', data);
        })
        .catch((error) => {
          console.error('Error deleting student data:', error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while deleting student data',
            icon: 'error',
          });
          // Perform any necessary actions after error
        });
    }
  });
}

// function resetData() {
//   const studentSelect = document.getElementById("studentIdSelect");
//   const addClassSelect = document.getElementById("addClassSelect");

//   studentSelect.value = ''; // Reset the hiddenValue input element
//   addClassSelect.value = ''; // Reset the hiddenValue input element
// }





