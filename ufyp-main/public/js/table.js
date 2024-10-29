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

let allStudentTable;
let graduateStudentsTable;
let notGraduateStudentsTable;

function fetchAndPopulateStudentsTable() {
    allStudentTable = $('#studentsTable').DataTable({
      columns: [
        { title: 'ID' },
        { title: 'Chinese Name' },
        { title: 'English Name' },
        { title: 'Age' },
        { title: 'Gender' },
        { title: 'Born' },
        { title: 'ID Card Number' },
        { title: 'Graduate' },
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
      lengthChange: false, // Disable the length change feature
      pageLength: 15, // Set the initial number of rows per page
    });
  
    graduateStudentsTable = $('#graduateStudentsTable').DataTable({
      columns: [
        { title: 'ID' },
        { title: 'Chinese Name' },
        { title: 'English Name' },
        { title: 'Age' },
        { title: 'Gender' },
        { title: 'Born' },
        { title: 'ID Card Number' },
        { title: 'Graduate' },
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
      lengthChange: false, // Disable the length change feature
      pageLength: 15, // Set the initial number of rows per page
    });
  
    notGraduateStudentsTable = $('#notGraduateStudentsTable').DataTable({
      columns: [
        { title: 'ID' },
        { title: 'Chinese Name' },
        { title: 'English Name' },
        { title: 'Age' },
        { title: 'Gender' },
        { title: 'Born' },
        { title: 'ID Card Number' },
        { title: 'Graduate' },
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
      lengthChange: false, // Disable the length change feature
      pageLength: 15, // Set the initial number of rows per page
    });
}

async function fetchStudent(){
  fetch(`${window.API_URL}/api/v1/users/getStudents`)
  .then((response) => response.json())
  .then((data) => {
    // Populate the datatable with the fetched data
    allStudentTable.clear().draw();
    notGraduateStudentsTable.clear().draw();
    graduateStudentsTable.clear().draw();
    data.forEach((student) => {
      var rowData = [
        student.s_Id,
        student.s_ChiName,
        student.s_EngName,
        student.s_Age,
        student.s_Gender,
        student.s_Born,
        student.s_IdNumber,
        student.graduate ? 'Graduated' : 'Not graduated'
      ];
      allStudentTable.row.add(rowData).draw();
      if (student.graduate == true) {
        // Populate the graduate table with the fetched data
        graduateStudentsTable.row.add(rowData).draw();
      } else {
        // Populate the not graduate table with the fetched data
        notGraduateStudentsTable.row.add(rowData).draw();
      }
    });
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
}


let AllParentTable;
let activeParentsTable;
let nonActiveParentsTable;

function fetchAndPopulateParentTable() {
    AllParentTable = $('#AllParentTable').DataTable({
      columns: [
        { title: 'Parent Phone Number',width: '180px' },
        { title: 'Chinese Name' },
        { title: 'Student ID' },
        { title: 'Home_Address' },
        { title: 'Active'},
        { title: 'Action'},
      ],
      columnDefs: [
        {
          targets: 2, // Index of the 'ID' column
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
          }
        },

      ],
      
      order: [[2, 'asc']], // Sort by the 'ID' column in ascending order
      lengthChange: false, // Disable the length change feature
      pageLength: 15, // Set the initial number of rows per page
    });
  
    activeParentsTable = $('#activeParentsTable').DataTable({
      columns: [
        { title: 'Parent Phone Number' },
        { title: 'Chinese Name' },
        { title: 'Student ID' },
        { title: 'Home_Address' },
        { title: 'Active' },
        { title: 'Action'},
      ],
      columnDefs: [
        {
            targets: 2, // Index of the 'ID' column
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
            }
          },
      ],
      order: [[2, 'asc']], // Sort by the 'ID' column in ascending order
      lengthChange: false, // Disable the length change feature
      pageLength: 15, // Set the initial number of rows per page
    });

    nonActiveParentsTable = $('#nonActiveParentsTable').DataTable({
        columns: [
            { title: 'Parent Phone Number' },
            { title: 'Parent Name' },
            { title: 'Student ID' },
            { title: 'Home_Address' },
            { title: 'Active'},
            { title: 'Action'},
        ],
        columnDefs: [
        {
            targets: 2, // Index of the 'ID' column
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
            }
            },
        ],
        order: [[2, 'asc']], // Sort by the 'ID' column in ascending order
        lengthChange: false, // Disable the length change feature
        pageLength: 15, // Set the initial number of rows per page
      });
      fetchPartentData();
}

function fetchPartentData(){
  fetch(`${window.API_URL}/api/v1/users/getAllParentData`)
  .then((response) => response.json())
  .then((data) => {
    nonActiveParentsTable.clear().draw();
    activeParentsTable.clear().draw();
    AllParentTable.clear().draw();
    data.forEach((info) => {
      var rowData = [
        info.parent_PhoneNumber,
        info.parent_Name,
        info.studentId,
        info.Home_Address,
        info.active ? 'Active' : 'Inactive',
        // {userId:info.userId},
        // onclick="showActivity('${data}')"
        
        `<button class="btn btn-success btn-circle view-parent-button" data-item='${JSON.stringify(info)}' onclick="populateModal(JSON.parse(this.dataset.item))"  data-bs-toggle="modal" title="Edit "data-bs-target="#viewModal"><i class="fas fa-edit"></i></button>` + 
        (info.active === true ? `<button class="btn btn-danger btn-circle" style="margin-left:10px" onclick="changeParentStatus('false','${info.email}')" title="pause parent account"><i class="fas fa-pause"></i></button>` :
        `<button class="btn btn-info btn-circle" style="margin-left:10px" onclick="changeParentStatus('true','${info.email}')" title="resume parent account"><i class="fas fa-play"></i></button>`)+
        `<button class="btn btn-danger btn-circle moveRight" title="Delete" onclick="deleteParentAccount('${info.userId}')"><i class="fas fa-trash"></i></button>`,
      ];
      AllParentTable.row.add(rowData).draw();
      if (info.active == true) {
        // Populate the graduate table with the fetched data
        activeParentsTable.row.add(rowData).draw();
      } else {
        // Populate the not graduate table with the fetched data
        nonActiveParentsTable.row.add(rowData).draw();
      }
    });

    // var editButtons = document.querySelectorAll('.view-parent-button');
    // if (editButtons) {
    //     editButtons.forEach((editButton) => {
    //         editButton.addEventListener('click', function() {
    //         const item = JSON.parse(this.dataset.item);
    //           populateModal(item);
    //         });
    //     });
    // }


  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  }); 
}

function changeParentStatus(status,email){
  const CurrentUserUid = getCookie('LoginUid');
  swal.fire({
    title: "Are you sure?",
    text: "You are about to change class status. Are you sure you want to proceed?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, change!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
  })
  .then((result) => {
    if (result.isConfirmed) {
      fetch(`${window.API_URL}/api/v1/users/updateUserStatus`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status,CurrentUserUid,email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            swal.fire({
                title: "Success",
                text: data.message,
                icon: "success",
              })
              .then(() => {
                  //$('#interestClassModal').modal('hide'); // close the modal
                  fetchPartentData();
              });
          } else {
            swal.fire({
              title: "Something wrong",
              text: data.message,
              icon: "error",
            });
          }
        })
        .catch((error) => {
          swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
          });
        });
    }
  });
}


function populateModal(data) {
  var modal = document.getElementById("viewModal");
  //var rowData = data.split(';');
  var chineseNameInput = modal.querySelector("#chinese-name");
  var phoneNumberInput = modal.querySelector("#phone-number");
  var studentIdInput = modal.querySelector("#student-id");
  var homeAddressInput = modal.querySelector("#home-address");
  var uidInput = modal.querySelector("#uid");
  // Set the values in the modal inputs
  //emailInput.value = rowData[0];
  phoneNumberInput.value = data.parent_PhoneNumber;
  chineseNameInput.value = data.parent_Name;
  studentIdInput.value = data.studentId;
  homeAddressInput.value = data.Home_Address;
  uidInput.value = data.userId;
}



  
function deleteParentAccount(Targetuid) {
  const CurrentUserUid = getCookie('LoginUid');
  Swal.fire({
    title: 'Delete User',
    text: 'Are you sure you want to delete this user?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${window.API_URL}/api/v1/users/deleteParentUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Targetuid ,CurrentUserUid }),
      })
        .then((response) => response.json())
        .then((data) => {
          Swal.fire({
            title: 'Success',
            text: data.message,
            icon: 'success'
          }).then(() => {
            fetchPartentData(); // Refresh the page
          });
          // Perform additional actions if needed
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error',
            text: 'Error deleting user account',
            icon: 'error'
          });
          console.error('Error deleting user account:', error);
          // Handle the error appropriately
        });
    }
  });
}

function addStudentButtonToFilter() {
  // Create the button element
  const button = document.createElement('button');
  //button.textContent = 'Add Students';
  button.classList.add('btn', 'btn-success','btn-circle','addStudentsButton');
  button.id = 'addStudentsButton';
  const icon = document.createElement('i');
  icon.classList.add('fa', 'fa-plus');

  button.appendChild(icon);
  // Find the studentsTable_filter div
  const filterDiv = document.getElementById('studentsTable_filter');
  if (filterDiv) {
    // Append the button to the filterDiv
    filterDiv.appendChild(button);
  }

  document.getElementById('addStudentsButton').addEventListener('click', function() {
    // Show a dialog or prompt to select the action (add one student or multiple students)
    Swal.fire({
      title: 'Add Students',
      showCancelButton: true,
      confirmButtonText: 'Add One Student',
      cancelButtonText: 'Add Multiple Students',
      reverseButtons: true,
      customClass: {
        confirmButton: 'add-one-student-button',
        cancelButton: 'add-multiple-students-button'
      },
      didOpen: (modal) => {
        // Add id attribute to the buttons
        const confirmButton = modal.querySelector('.add-one-student-button');
        const cancelButton = modal.querySelector('.add-multiple-students-button');
        confirmButton.id = 'addOneStudentButton';
        cancelButton.id = 'addMultipleStudentsButton';
        confirmButton.setAttribute('data-bs-toggle', 'modal');
        confirmButton.setAttribute('data-bs-target', '#registrationModal');
        cancelButton.setAttribute('data-bs-toggle', 'modal');
        cancelButton.setAttribute('data-bs-target', '#addMultipleStudentsModal');
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Add one student
        //addOneStudent();
      } else {
        // Add multiple students
        //addMultipleStudents();
      }
    });
  });

}

// Function to handle adding one student
function addOneStudent() {
  const CurrentUserUid = getCookie('LoginUid');

  // Add your logic here to handle adding one student
  // You can show a form or input fields to collect student information and process it accordingly
  const form = document.getElementById('registrationStudentForm');
  const formData = new FormData(form);
  // Generate email address based on parent's phone number
  const parentPhone = formData.get('parent_PhoneNumber');
  const email = parentPhone + '@cityprimary.com';
  formData.set('email', email);

  // Convert form data to JSON object
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  //const jsonData = JSON.stringify(data);
  //console.log(jsonData);
  fetch(`${window.API_URL}/api/v1/users/addParent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data ,CurrentUserUid }),
  })
  .then(response => {
    if (response.ok) {
      Swal.fire({
        title: 'Student added successfully',
        icon: 'success'
      }).then(() => {
        // Reset the form after successful submission
        form.reset();
        $('#registrationModal').modal('hide'); // close the modal
        fetchStudent();
      });

    } else {
      response.text().then(errorMessage => {
        Swal.fire({
          title: errorMessage,
          icon: 'error'
        });
      });
      //throw new Error('Network response was not ok');
    }
  })
  .catch(error => {
    Swal.fire({
      title: 'Error',
      text: error.message,
      icon: 'error'
    });
  });
}

async function addStudent(data, index, failedStudents) {
  const CurrentUserUid = getCookie('LoginUid');
  const parentPhone = data.parent_PhoneNumber;
  data.email = `${parentPhone}@cityprimary.com`;
  try {
    const response = await fetch(`${window.API_URL}/api/v1/users/addParent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, CurrentUserUid }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return index;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function addMultipleStudents() {
  const fileInput = document.getElementById('studentFileInput');
  const file = fileInput.files[0];
  if (!file) {
    Swal.fire({
      title: 'Please select a file',
      icon: 'warning'
    });
    return;
  }

  const reader = new FileReader();
  reader.readAsText(file);

  reader.onload = async () => {
    const csvData = reader.result;
    const students = convertCsvToJson(csvData);
    const numStudents = students.length;
    let numAdded = 0;
    const failedStudents = [];

    Swal.fire({
      title: 'Now loading',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        swal.showLoading();
      }
    });

    const promises = students.map((student, index) => addStudent(student, index, failedStudents));
    const results = await Promise.all(promises);

    results.forEach(index => {
      if (index !== undefined) {
        numAdded++;
      }
    });

    Swal.close();

    if (numAdded === numStudents) {
      Swal.fire({
        title: `Students added successfully: ${numAdded}/${numStudents}`,
        icon: 'success'
      }).then(() => {
        fetchStudent();
        $('#addMultipleStudentsModal').modal('hide'); 
      });
    } else {
      const failedStudentNumbers = failedStudents.map(student => student.index + 1);
      Swal.fire({
        title: `Failed to add students: ${failedStudentNumbers.join(', ')}, Other students are added successfully`,
        icon: 'error'
      });
    }
  
    fileInput.value = '';
  };

  reader.onerror = () => {
    Swal.fire({
      title: 'Error',
      text: 'An error occurred while reading the file',
      icon: 'error'
    });
  };
}


//handle csv file
function convertCsvToJson(csvData) {
  const lines = csvData.split('\n');
  const result = [];
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length === 1 && currentLine[0] === '') {
      continue; // Skip empty lines
    }

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      let value = currentLine[j].trim();
      // Remove the field name "password" from the \r character
      if (headers[j] === 'password\r') {
        headers[j] = 'password';
      }

      obj[headers[j]] = value;
    }

    result.push(obj);
  }
  return result;
}

//handle csv file



function editModal() {
  const CurrentUserUid = getCookie('LoginUid');
  // Enable the input fields for editing
  var chineseNameInput = document.getElementById('chinese-name');
  var phoneNumberInput = document.getElementById('phone-number');
  var homeAddressInput = document.getElementById('home-address');
  var uid = document.getElementById('uid');

  var chineseNameValue = chineseNameInput.value;
  var phoneNumberValue = phoneNumberInput.value;
  var homeAddressValue = homeAddressInput.value;
  var uidValue = uid.value;

  // Validate data
  if (!chineseNameValue || !phoneNumberValue || !homeAddressValue) {
    Swal.fire({
      title: 'Error',
      text: 'Please fill in all the required fields',
      icon: 'error'
    });
    return;
  }

  if (phoneNumberValue.length !== 8) {
    Swal.fire({
      title: 'Error',
      text: 'Phone number should be 8 characters long',
      icon: 'error'
    });
    return;
  }

  // Create an object with the updated data
  var updatedData = {
    CurrentUserUid:CurrentUserUid,
    uid: uidValue,
    chineseName: chineseNameValue,
    phoneNumber: phoneNumberValue,
    homeAddress: homeAddressValue,
  };

  // Show confirmation dialog using SweetAlert
  Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to update the user information?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      // Perform the save operation by posting the updated data to the backend
      fetch(`${window.API_URL}/api/v1/users/upDateUserInformation`, {
        method: 'POST',
        body: JSON.stringify(updatedData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the backend
        //console.log('Data updated successfully:', data);
        Swal.fire({
          title: 'Success',
          text: 'User information updated successfully',
          icon: 'success'
        }).then(() => {
          $('#viewModal').modal('hide');
          fetchPartentData();
        });
        // You can perform additional actions here, such as displaying a success message or refreshing the data in your datatable
      })
      .catch(error => {
        // Handle any errors that occurred during the save operation
        Swal.fire({
          title: 'Error',
          text: 'Failed to update user information'+error,
          icon: 'error'
        });
        // You can display an error message to the user or take other appropriate actions
      });
    }
  });
}

  
function fetchAndPopulateSLogsTable() {
  var allLogsTable = $('#AllLogTable').DataTable({
    columns: [
      { title: 'Actor UID' },
      { title: 'Target UID' },
      { title: 'Action' },
      { title: 'Action Time',type: 'date'},
    ],
    order: [[3, 'asc']], // Sort by the 'ID' column in ascending order
    lengthChange: false, // Disable the length change feature
    pageLength: 15, // Set the initial number of rows per page
  });

  fetch(`${window.API_URL}/api/v1/users/getLogs`)
    .then((response) => response.json())
    .then((data) => {
      // Populate the datatable with the fetched data
      data.forEach((logs) => {
        var rowData = [
          logs.actorUid,
          logs.TargetUid,
          logs.action,
          logs.timestamp,
        ];
        allLogsTable.row.add(rowData).draw();
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

function populateTeacherModal(data,uid) {
  var modal = document.getElementById("viewModal");
  var rowData = data.split(';');
  var teacherIdInput = modal.querySelector("#teacher-id");
  var chineseNameInput = modal.querySelector("#chinese-name");
  var englishNameInput = modal.querySelector("#english-name");
  var genderInput = modal.querySelector("#gender");
  var phoneNumberInput = modal.querySelector("#phone-number");

  var homeAddressInput = modal.querySelector("#home-address");
  var uidInput = modal.querySelector("#uid");
  // Set the values in the modal inputs
  teacherIdInput.value = rowData[0];
  chineseNameInput.value = rowData[1];
  englishNameInput.value = rowData[2];
  genderInput.value = rowData[3];
  phoneNumberInput.value = rowData[4];
  homeAddressInput.value = rowData[5];
  uidInput.value = uid;
}

let allTeachersTable;
let leaveTeachersTable;
let inWorkTeachersTable;

function fetchAndPopulateTeacherTable() {
  allTeachersTable = $('#allTeachersTable').DataTable({
    columns: [
      { title: 'Teacher ID' },
      { title: 'Teacher Chi_Name'},
      { title: 'Teacher Eng_Name' },
      { title: 'Teacher Gender'},
      { title: 'PhoneNumber'},
      { title: 'Home_Address', width:'250px' },
      { title: 'Leave' },
      { title: 'Action', width:'130px'},
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
        }
      },
      {
          targets: 7, // Index of the last column (Action column)
          render: function(data, type, row, meta) {
            var userId = row[row.length - 1].userId;
            var rowData = row.slice(0, -1); // Exclude the last column (Action column)
            return '<button class="btn btn-success btn-circle view-btn" onclick="populateTeacherModal(\'' + rowData.join(';') + '\',\'' + userId + '\')" data-bs-toggle="modal" data-bs-target="#viewModal" title="Edit"><i class="fas fa-edit"></i></button>'+
            (rowData[6] === true ? `<button class="btn btn-danger btn-circle" style="margin-left:6px" onclick="changeTeacherStatus('false','${rowData[0]}')" title="pause parent account"><i class="fas fa-pause"></i></button>` :
            `<button class="btn btn-info btn-circle" style="margin-left:6px" onclick="changeTeacherStatus('true','${rowData[0]}')" title="resume parent account"><i class="fas fa-play"></i></button>`)+
            '<button class="btn btn-danger btn-circle moveRight" onclick="deleteTeacherAccount(\'' + userId + '\')" title="Delete"><i class="fas fa-trash"></i></button>';

          }
      },
    ],
    
    order: [[0, 'asc']], // Sort by the 'ID' column in ascending order
    lengthChange: false, // Disable the length change feature
    pageLength: 15, // Set the initial number of rows per page
  });

  leaveTeachersTable = $('#leaveTeachersTable').DataTable({
    columns: [
      { title: 'Teacher ID' },
      { title: 'Teacher Chi_Name' },
      { title: 'Teacher Eng_Name' },
      { title: 'Teacher Gender' },
      { title: 'PhoneNumber' },
      { title: 'Home_Address' },
      { title: 'Leave' },
      { title: 'Action' },
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
          }
        },
        {
            targets: 7, // Index of the last column (Action column)
            render: function(data, type, row, meta) {
                  var userId = row[row.length - 1].userId;
                  var rowData = row.slice(0, -1); // Exclude the last column (Action column)
                  console.log(rowData);
                  return '<button class="btn btn-success btn-circle view-btn" onclick="populateTeacherModal(\'' + rowData.join(';') + '\',\'' + userId + '\')" data-bs-toggle="modal" data-bs-target="#viewModal" title="Edit"><i class="fas fa-edit"></i></button>'+
                  (rowData[6] === true ? `<button class="btn btn-danger btn-circle" style="margin-left:6px" onclick="changeTeacherStatus('false','${rowData[0]}')" title="pause parent account"><i class="fas fa-pause"></i></button>` :
                  `<button class="btn btn-info btn-circle" style="margin-left:6px" onclick="changeTeacherStatus('true','${rowData[0]}')" title="resume parent account"><i class="fas fa-play"></i></button>`)+
                  '<button class="btn btn-danger btn-circle moveRight" title="Delete" onclick="deleteTeacherAccount(\'' + userId + '\')"><i class="fas fa-trash"></i></button>';
            }
        },
    ],
    order: [[0, 'asc']], // Sort by the 'ID' column in ascending order
    lengthChange: false, // Disable the length change feature
    pageLength: 15, // Set the initial number of rows per page
  });

  
  inWorkTeachersTable = $('#inWorkTeachersTable').DataTable({
      columns: [
          //{ title: 'Email' },
          { title: 'Teacher ID' },
          { title: 'Teacher Chi_Name' },
          { title: 'Teacher Eng_Name' },
          { title: 'Teacher Gender' },
          { title: 'PhoneNumber'},
          { title: 'Home_Address' },
          { title: 'Leave' },
          { title: 'Action'},
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
          }
          },
          {
              targets: 7, // Index of the last column (Action column)
              render: function(data, type, row, meta) {
                  var userId = row[row.length - 1].userId;
                  var rowData = row.slice(0, -1); // Exclude the last column (Action column)
                  return '<button class="btn btn-success btn-circle view-btn" onclick="populateTeacherModal(\'' + rowData.join(';') + '\',\'' + userId + '\')" data-bs-toggle="modal" data-bs-target="#viewModal" title="Edit"><i class="fas fa-edit"></i></button>'+
                  `<button class="btn btn-info btn-circle" style="margin-left:6px" onclick="changeTeacherStatus('true','${rowData[0]}')" title="resume parent account"><i class="fas fa-play"></i></button>`+
                  '<button class="btn btn-danger btn-circle moveRight" onclick="deleteTeacherAccount(\'' + userId + '\')" title="Delete "><i class="fas fa-edit"></i></button>';
              }
          },
      ],
      order: [[0, 'asc']], // Sort by the 'ID' column in ascending order
      lengthChange: false, // Disable the length change feature
      pageLength: 15, // Set the initial number of rows per page
    });

}


function changeTeacherStatus(status,id){
  const CurrentUserUid = getCookie('LoginUid');
  swal.fire({
    title: "Are you sure?",
    text: "You are about to change class status. Are you sure you want to proceed?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, change!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
  })
  .then((result) => {
    if (result.isConfirmed) {
      fetch(`${window.API_URL}/api/v1/users/updateTeacherStatus`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status,CurrentUserUid,id }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            swal.fire({
                title: "Success",
                text: data.message,
                icon: "success",
              })
              .then(() => {
                  //$('#interestClassModal').modal('hide'); // close the modal
                  fetchTeacherData();
              });
          } else {
            swal.fire({
              title: "Something wrong",
              text: data.message,
              icon: "error",
            });
          }
        })
        .catch((error) => {
          swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
          });
        });
    }
  });
}


function fetchTeacherData(){
  allTeachersTable.clear().draw();
  leaveTeachersTable.clear().draw();
  inWorkTeachersTable.clear().draw();
  fetch(`${window.API_URL}/api/v1/users/getTeachers`)
  .then((response) => response.json())
  .then((data) => {
    // Populate the datatable with the fetched data
    data.forEach((info) => {
      var rowData = [
        info.t_Id,
        info.t_ChiName,
        info.t_EngName,
        info.t_gender,
        info.t_phoneNumber,
        info.home_Address,
        info.leave,
        {userId:info.userId}
      ];
      allTeachersTable.row.add(rowData).draw();
      if (info.leave) {
        // Populate the graduate table with the fetched data
        leaveTeachersTable.row.add(rowData).draw();
      } else {
        // Populate the not graduate table with the fetched data
        inWorkTeachersTable.row.add(rowData).draw();
      }
    });
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  }); 
}

function editTeacherModal() {
  const CurrentUserUid = getCookie('LoginUid');
  // Enable the input fields for editing
  var chineseNameInput = document.getElementById('chinese-name');
  var EnglishNameInput = document.getElementById('english-name');
  var phoneNumberInput = document.getElementById('phone-number');
  var homeAddressInput = document.getElementById('home-address');
  var uid = document.getElementById('uid');

  var chineseNameValue = chineseNameInput.value;
  var EnglishNameValue = EnglishNameInput.value;
  var phoneNumberValue = phoneNumberInput.value;
  var homeAddressValue = homeAddressInput.value;
  var uidValue = uid.value;

  // Validate data
  if (!chineseNameValue || !phoneNumberValue || !homeAddressValue || !EnglishNameInput) {
    Swal.fire({
      title: 'Error',
      text: 'Please fill in all the required fields',
      icon: 'error'
    });
    return;
  }

  if (phoneNumberValue.length !== 8) {
    Swal.fire({
      title: 'Error',
      text: 'Phone number should be 8 characters long',
      icon: 'error'
    });
    return;
  }

  // Create an object with the updated data
  var updatedData = {
    CurrentUserUid:CurrentUserUid,
    uid: uidValue,
    chineseName: chineseNameValue,
    englishName:EnglishNameValue,
    phoneNumber: phoneNumberValue,
    homeAddress: homeAddressValue,
  };

  // Show confirmation dialog using SweetAlert
  Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to update the Teacher information?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      // Perform the save operation by posting the updated data to the backend
      fetch(`${window.API_URL}/api/v1/users/upDateTeacherInformation`, {
        method: 'POST',
        body: JSON.stringify(updatedData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the backend
        //console.log('Data updated successfully:', data);
        Swal.fire({
          title: 'Success',
          text: 'Teacher information updated successfully',
          icon: 'success'
        }).then(() => {
          $('#viewModal').modal('hide');
          fetchTeacherData();
        });
        // You can perform additional actions here, such as displaying a success message or refreshing the data in your datatable
      })
      .catch(error => {
        // Handle any errors that occurred during the save operation
        Swal.fire({
          title: 'Error',
          text: 'Failed to update user information'+error,
          icon: 'error'
        });
        // You can display an error message to the user or take other appropriate actions
      });
    }
  });
}

function addTeacherButtonToFilter() {
  // Create the button element
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-success','btn-circle','addStudentsButton');
  button.id = 'addTeachersButton';
  button.title = 'add Teacher'
  const icon = document.createElement('i');
  icon.classList.add('fa', 'fa-plus');
  button.appendChild(icon);
  // Find the studentsTable_filter div

  const button2 = document.createElement('button');
  button2.classList.add('btn', 'btn-success','btn-circle','addStudentsButton');
  button2.id = 'addTeachersButton2';
  button2.title = 'add Teacher'
  const icon2 = document.createElement('i');
  icon2.classList.add('fa', 'fa-plus');
  button2.appendChild(icon2);

  const button3 = document.createElement('button');
  button3.classList.add('btn', 'btn-success','btn-circle','addStudentsButton');
  button3.id = 'addTeachersButton3';
  button3.title = 'add Teacher'
  const icon3 = document.createElement('i');
  icon3.classList.add('fa', 'fa-plus');
  button3.appendChild(icon3);

  const filterDiv = document.getElementById('allTeachersTable_filter');
  const filter2Div = document.getElementById('leaveTeachersTable_filter');
  const filter3Div = document.getElementById('inWorkTeachersTable_filter');
  if (filterDiv) {
    filterDiv.appendChild(button);
  }
  if (filter2Div) {
    filter2Div.appendChild(button2);
  }

  if (filter3Div) {
    filter3Div.appendChild(button3);
  }

  
  document.getElementById('addTeachersButton').addEventListener('click', function() {
    // Show a dialog or prompt to select the action (add one student or multiple students)
    Swal.fire({
      title: 'Add Teacher',
      showCancelButton: true,
      confirmButtonText: 'Add One Teacher',
      cancelButtonText: 'Add Multiple Teacher',
      reverseButtons: true,
      customClass: {
        confirmButton: 'add-one-teacher-button',
        cancelButton: 'add-multiple-teachers-button'
      },
      didOpen: (modal) => {
        // Add id attribute to the buttons
        const confirmButton = modal.querySelector('.add-one-teacher-button');
        const cancelButton = modal.querySelector('.add-multiple-teachers-button');
        confirmButton.id = 'addOneTeacherButton';
        cancelButton.id = 'addMultipleTeachersButton';
        confirmButton.setAttribute('data-bs-toggle', 'modal');
        confirmButton.setAttribute('data-bs-target', '#registrationModal');
        cancelButton.setAttribute('data-bs-toggle', 'modal');
        cancelButton.setAttribute('data-bs-target', '#addMultipleTeachersModal');
      }
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  });

  document.getElementById('addTeachersButton2').addEventListener('click', function() {
    // Show a dialog or prompt to select the action (add one student or multiple students)
    Swal.fire({
      title: 'Add Teacher',
      showCancelButton: true,
      confirmButtonText: 'Add One Teacher',
      cancelButtonText: 'Add Multiple Teacher',
      reverseButtons: true,
      customClass: {
        confirmButton: 'add-one-teacher-button',
        cancelButton: 'add-multiple-teachers-button'
      },
      didOpen: (modal) => {
        // Add id attribute to the buttons
        const confirmButton = modal.querySelector('.add-one-teacher-button');
        const cancelButton = modal.querySelector('.add-multiple-teachers-button');
        confirmButton.id = 'addOneTeacherButton';
        cancelButton.id = 'addMultipleTeachersButton';
        confirmButton.setAttribute('data-bs-toggle', 'modal');
        confirmButton.setAttribute('data-bs-target', '#registrationModal');
        cancelButton.setAttribute('data-bs-toggle', 'modal');
        cancelButton.setAttribute('data-bs-target', '#addMultipleTeachersModal');
      }
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  });

  document.getElementById('addTeachersButton3').addEventListener('click', function() {
    // Show a dialog or prompt to select the action (add one student or multiple students)
    Swal.fire({
      title: 'Add Teacher',
      showCancelButton: true,
      confirmButtonText: 'Add One Teacher',
      cancelButtonText: 'Add Multiple Teacher',
      reverseButtons: true,
      customClass: {
        confirmButton: 'add-one-teacher-button',
        cancelButton: 'add-multiple-teachers-button'
      },
      didOpen: (modal) => {
        // Add id attribute to the buttons
        const confirmButton = modal.querySelector('.add-one-teacher-button');
        const cancelButton = modal.querySelector('.add-multiple-teachers-button');
        confirmButton.id = 'addOneTeacherButton';
        cancelButton.id = 'addMultipleTeachersButton';
        confirmButton.setAttribute('data-bs-toggle', 'modal');
        confirmButton.setAttribute('data-bs-target', '#registrationModal');
        cancelButton.setAttribute('data-bs-toggle', 'modal');
        cancelButton.setAttribute('data-bs-target', '#addMultipleTeachersModal');
      }
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  });

}

// Function to handle adding one student
function addOneTeacher() {
  const CurrentUserUid = getCookie('LoginUid');

  // Add your logic here to handle adding one student
  // You can show a form or input fields to collect student information and process it accordingly
  const form = document.getElementById('registrationTeacherForm');
  const formData = new FormData(form);
  // Generate email address based on parent's phone number
  const teacherPhone = formData.get('t_phoneNumber');
  if (teacherPhone.length !== 8) {
    Swal.fire({
      title: 'Phone number must be 8 characters long',
      icon: 'error'
    });
    return; // Exit the function if the phone number length is not 8
  }

  const email = teacherPhone + '@cityprimary.com';
  formData.set('email', email);

  // Convert form data to JSON object
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  //const jsonData = JSON.stringify(data);
  //console.log(jsonData);
  fetch(`${window.API_URL}/api/v1/users/addTeacher`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data ,CurrentUserUid }),
  })
  .then(response => {
    if (response.ok) {
      Swal.fire({
        title: 'Teacher added successfully',
        icon: 'success'
      });
      // Reset the form after successful submission
      $('#registrationModal').modal('hide');
      form.reset();
      fetchTeacherData();
    } else {
      response.text().then(errorMessage => {
        Swal.fire({
          title: errorMessage,
          icon: 'error'
        });
      });
      //throw new Error('Network response was not ok');
    }
  })
  .catch(error => {
    Swal.fire({
      title: 'Error',
      text: error.message,
      icon: 'error'
    });
  });
}

function deleteTeacherAccount(Targetuid) {
  const CurrentUserUid = getCookie('LoginUid');
  Swal.fire({
    title: 'Delete User',
    text: 'Are you sure you want to delete this teacher user?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${window.API_URL}/api/v1/users/deleteTeacherUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Targetuid ,CurrentUserUid }),
      })
        .then((response) => response.json())
        .then((data) => {
          Swal.fire({
            title: 'Success',
            text: data.message,
            icon: 'success'
          }).then(() => {
            fetchTeacherData();
          });
          // Perform additional actions if needed
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error',
            text: 'Error deleting user account',
            icon: 'error'
          });
          console.error('Error deleting user account:', error);
          // Handle the error appropriately
        });
    }
  });
}

async function addTeacher(data, index, failedTeachers) {
  const CurrentUserUid = getCookie('LoginUid');
  const t_phoneNumber = data.t_phoneNumber;
  data.email = `${t_phoneNumber}@cityprimary.com`;
  data.index = index;
  try {
    const response = await fetch(`${window.API_URL}/api/v1/users/addTeacher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, CurrentUserUid }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return index;
  } catch (error) {
    throw new Error(error.message);
  }

}


// Function to handle adding multiple students
async function addMultipleTeachers() {
  const fileInput = document.getElementById('teacherFileInput');
  const file = fileInput.files[0];
  if (!file) {
    Swal.fire({
      title: 'Please select a file',
      icon: 'warning'
    });
    return;
  }

  const reader = new FileReader();
  reader.readAsText(file);

  reader.onload = async () => {
    const csvData = reader.result;
    const teachers = convertCsvToJson(csvData);
    const numTeachers = teachers.length;
    let numAdded = 0;
    const failedTeachers = [];

    Swal.fire({
      title: 'Now loading',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        swal.showLoading();
      }
    });

    const promises = teachers.map((teacher, index) => addTeacher(teacher, index, failedTeachers));
    // const promises = teachers.map((teacher, index) => {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       const result = addTeacher(teacher, index, failedTeachers);
    //       resolve(result);
    //     }, 200);
    //   });
    // });
    const results = await Promise.all(promises);

    results.forEach(index => {
      if (index !== undefined) {
        numAdded++;
      }
    });

    Swal.close();

    if (numAdded === numTeachers) {
      Swal.fire({
        title: `Teacher added successfully: ${numAdded}/${numTeachers}`,
        icon: 'success'
      }).then(() => {
        fetchTeacherData();
        $('#addMultipleTeachersModal').modal('hide'); 
      });
    } else {
      const failedTeacherNumbers = failedStudents.map(teacher => teacher.index + 1);
      Swal.fire({
        title: `Failed to add Teachers: ${failedTeacherNumbers.join(', ')}, Other teachers are added successfully`,
        icon: 'error'
      });
    }
  

    // Promise.all(addTeacherPromises)
    //   .then(() => {
    //     if (numAdded === numTeachers) {
    //       Swal.fire({
    //         title: `Teacher added successfully: ${numAdded}/${numTeachers}`,
    //         icon: 'success'
    //       });
    //     } else {
    //       const failedTeacherNumbers = failedTeachers.map(teacher => teacher.index + 1);
    //       Swal.fire({
    //         title: `Failed to add Teachers: ${failedTeacherNumbers.join(', ')}, Other teachers are added successfully`,
    //         icon: 'error'
    //       });
    //     }
    //   })
    //   .catch(() => {
    //     Swal.fire({
    //       title: 'Error',
    //       text: 'An error occurred while adding teachers',
    //       icon: 'error'
    //     });
    //   });

    fileInput.value = '';
  };

  reader.onerror = () => {
    Swal.fire({
      title: 'Error',
      text: 'An error occurred while reading the file',
      icon: 'error'
    });
  };
}