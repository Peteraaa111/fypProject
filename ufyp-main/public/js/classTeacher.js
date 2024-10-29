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

async function populateYearSelector() {
  const yearSelector = document.getElementById("academicYearSelect");
  const addButtonRowDiv = document.getElementById("ButtonDiv");
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "Select Year";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  yearSelector.add(defaultOption);
  try {
    const response = await fetch(
      `${window.API_URL}/api/v1/schoolActivity/getAcademicYearDocIds`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    data.forEach((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.text = year;
      yearSelector.add(option);
    });
    yearSelector.addEventListener("change", async () => {
      if (yearSelector.value === "") {
          addButtonRowDiv.style.display = "none";
      } else {
          addButtonRowDiv.style.display = "block";
          await fetchData();
          await fetchDataAndPopulateSelections();
      }

    });
  } catch (error) {
    console.error(error);
  }
}

let table; // Declare table variable in the outer scope

let table2;

function initializeDataTable() {
  table = $('#teachersTable').DataTable({
    columns: [
      { title: 'Teacher Chinese Name' },
      { title: 'Teacher English Name' },
      { title: 'Teacher ID' },
      { title: 'Class ID'},
      { title: 'Action' },
    ],
    order: [[3, 'asc']]
  });

  table2 = $('#addTeacherTable').DataTable({
    columns: [
      { title: 'Teacher ID' },
      { title: 'Teacher Chinese Name' },
      { title: 'Teacher English Name' },
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

  academicYearSelect.addEventListener('change', fetchData);
}

function fetchData() {
  const year = academicYearSelect.value;

  if (year) {
    fetch(`${window.API_URL}/api/v1/class/getAllClassHeadTeacher/${year}/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        table.clear().draw();
        data.forEach((teacher) => {
          var rowData = [
            teacher.t_ChiName,
            teacher.t_EngName,
            teacher.t_Id,
            teacher.id,
            `<button class="btn btn-circle btn-danger" title="Remove" onclick="removeTeacher('${teacher.id}')"><i class="fa fa-trash"></i></button>`,
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
    fetch(`${window.API_URL}/api/v1/class/getAllUnAssignTeachers/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ year }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const currentYearClassIds = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"];
        table2.clear().draw();
        data.forEach((teacher) => {
          var rowData = [
            teacher.t_Id,
            teacher.t_ChiName,
            teacher.t_EngName,
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

function addTeacherToClass() {
  const fullSelected = [];
  const CurrentUserUid = getCookie('LoginUid');
  const academicYearValue = document.getElementById('academicYearSelect').value
  table2.rows( {selected: true} ).every( function ( rowIdx, tableLoop, rowLoop ) {
    var data = this.data();
    const t_Id = data[0];
    const t_ChiName = data[1];
    const t_EngName = data[2];
    const classId = $('select', this.node()).val();
    fullSelected.push({t_Id:t_Id,t_ChiName:t_ChiName,t_EngName:t_EngName, classId:classId});
  });

  if (fullSelected.length === 0) {
    swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Please select at least one teacher',
    });
    return 
  }

  if (fullSelected.length > 1) {
    const classIds = [];
    fullSelected.forEach(obj => {
      classIds.push(obj.classId);
    });
    const uniqueClassIds = new Set(classIds);
    if (uniqueClassIds.size < classIds.length) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Duplicate class IDs selected',
      });
      return;
    }
  }

  Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to add the teacher to the class?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      // Convert form data to JSON object

      fetch(`${window.API_URL}/api/v1/class/addTeacherToClass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullSelected, CurrentUserUid,academicYearValue }),
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              title: 'Teacher added successfully',
              icon: 'success',
            }).then(() => {
              // Refresh the page
              fetchDataAndPopulateSelections(academicYearValue);
              fetchData();
              $('#addTeacherModal').modal('hide');
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


function removeTeacher(classId) {
  const CurrentUserUid = getCookie('LoginUid');
  const academicYearValue = document.getElementById('academicYearSelect').value


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
      fetch(`${window.API_URL}/api/v1/class/removeTeacherFromClass/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId, CurrentUserUid,academicYearValue }),
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
              text: 'Teacher removed from the class successfully',
              icon: 'success',
            }).then(() => {
              // Refresh the page
              //location.reload();
              fetchData();
              fetchDataAndPopulateSelections(academicYearValue);
            });
            // Perform any necessary actions after successful deletion
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to remove teacher from the class',
              icon: 'error',
            });
            // Perform any necessary actions after failed deletion
          }
        })
        .catch((error) => {
          console.error('Error deleting teacher data:', error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while deleting teacher data',
            icon: 'error',
          });
          // Perform any necessary actions after error
        });
    }
  });
}




