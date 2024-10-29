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
  const yearSelector = document.getElementById("yearSelector");
  const classYearDiv = document.getElementById("classYearDiv");
  const classSelect = document.getElementById('classSelect');
  const buttonAddHomeWorkDiv = document.getElementById('buttonAddHomeWorkDiv');
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "Select Year";
  defaultOption.selected = true; 
  defaultOption.disabled = true;
  yearSelector.add(defaultOption);
  try {
    const response = await fetch(`${window.API_URL}/api/v1/schoolActivity/getAcademicYearDocIds`);
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
    yearSelector.addEventListener("change", async() => {
        if (yearSelector.value === "") {
          classYearDiv.style.display= 'none';
        } else {
          classYearDiv.style.display = 'flex';
        }
    });
    classSelect.addEventListener("change", async() => {
      if (classSelect.value === "") {
        buttonAddHomeWorkDiv.style.display= 'none';
      } else {
        buttonAddHomeWorkDiv.style.display = 'block';
      }
  });
  } catch (error) {
    console.error(error);
  }
}

function reset(){
  document.getElementById('classSelect').value = "";
  document.getElementById('yearSelector').value = "";
  document.getElementById('classYearDiv').style.display = 'none';
  document.getElementById('buttonAddHomeWorkDiv').style.display = 'none';
  document.getElementById('activityDate').value = "";
  //document.getElementById('classHomeWorkTable').style.display = 'none';
  document.getElementById('ImageFileInput').value = "";
}

async function sendImage(){
  const selectedClass = document.getElementById('classSelect').value;
  const selectedDate = document.getElementById('activityDate').value;
  const selectedYear = document.getElementById('yearSelector').value;
  const fileInput = document.getElementById('ImageFileInput');
  const CurrentUserUid = getCookie('LoginUid');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('selectedYear',selectedYear);
  formData.append('selectedClass',selectedClass);
  formData.append('selectedDate',selectedDate);
  formData.append('CurrentUserUid',CurrentUserUid);
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  if (!file) {
    Swal.fire({
      title: 'Please select a file',
      icon: 'warning'
    });
    return;
  }

  console.log(file);



  swal.fire({
    title: 'Are you sure?',
    text: 'You are about to upload an image. Are you sure you want to proceed?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, upload!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
        Swal.fire({
          title: 'Now loading',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            swal.showLoading();
          }
        });
        fetch(`${window.API_URL}/api/v1/class/uploadHomeworkImage`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
          Swal.close();
          if (data.success) {
 
            swal.fire({
                title: 'Success',
                text: data.message,
                icon: 'success'
            }).then(() => {
              $('#addImageModal').modal('hide');
              fetchHomeWorkData();
            });

          } else {
            swal.fire({
                title: 'Something wrong',
                text: data.message,
                icon: 'error'
            });
          }
        })
        .catch(error => {
          swal.fire({
              title: 'Error',
              text: error.message,
              icon: 'error'
          });
      });
    }
  });

}

let table; // Declare table variable in the outer scope


function initializeDataTable() {
  table = $('#classHomeWorkTable').DataTable({
    columns: [
      { title: 'Date' },
      { title: 'Chinese' },
      { title: 'English' },
      { title: 'Mathematics' },
      { title: 'General Studies' },
      { title: 'Other' },
      { title: 'Action' },
    ],
    order: [[0, 'desc']],
    columnDefs: [ { orderable: false, targets: [1,2,3,4,5,6] }],
  });
}

function fetchHomeWorkReady() {
    const yearSelector = document.getElementById('yearSelector');
    const classSelect = document.getElementById('classSelect');
    
    yearSelector.addEventListener('change', fetchHomeWorkData);
    classSelect.addEventListener('change', fetchHomeWorkData);
}

function fetchHomeWorkData() {
  const yearSelectorSelect = document.getElementById('yearSelector');
  const classSelector = document.getElementById('classSelect');
  const year = yearSelectorSelect.value;
  const classID = classSelector.value;
  if (year && classID) {
    fetch(`${window.API_URL}/api/v1/class/getClassHomework/${classID}/${year}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          table.clear().draw();
        
          data.data.forEach((homework) => {
            const rowData = [
              homework.id,
              homework.data.chi,
              homework.data.eng,
              homework.data.math,
              homework.data.gs,
              homework.data.other,
              `<button class="btn btn-success btn-circle edit-homework-button" data-bs-toggle="modal" data-bs-target="#editHomeworkModal" title="Edit"><i class="fas fa-edit"></i></button>`+
              `<button class="btn btn-circle btn-danger" title="Remove" style="margin-left:10px" onclick="removeHomework('${homework.id}')"><i class="fa fa-trash"></i></button>`,,

            ];
            table.row.add(rowData).draw();
        
            const editButton = document.querySelector('.edit-homework-button');
            if (editButton) {
              editButton.addEventListener('click', function() {
                // call the editHomework function with the data as arguments
                setHomeworkData(homework.data,homework.id);
              });
            }
          });
        } else {
          table.clear().draw();
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
}

function removeHomework(homeworkId) {
  const CurrentUserUid = getCookie('LoginUid');
  const academicYearValue = document.getElementById('yearSelector').value
  const classId = document.getElementById('classSelect').value;

  // Show Swal confirm dialog
  Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to remove the homework from the class?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed, make the API request
      fetch(`${window.API_URL}/api/v1/class/deleteHomeworkInClass/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ homeworkId, CurrentUserUid,academicYearValue,classId }),
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
              text: 'Homework removed from the class successfully',
              icon: 'success',
            }).then(() => {
              fetchHomeWorkData();
            });
            // Perform any necessary actions after successful deletion
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to remove homework from the class',
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


function setHomeworkData(data,id) {
  document.querySelector('#date').value = id;
  document.querySelector('#chineseHomework').value = data.chi;
  document.querySelector('#englishHomework').value = data.eng;
  document.querySelector('#mathematicsHomework').value = data.math;
  document.querySelector('#generalStuidesHomework').value = data.gs;
  document.querySelector('#other').value = data.other;
}

function setDatePicker(){
  const elem = document.getElementById('activityDate');
  const datepicker = elem.datepicker;
  if (datepicker) {
    datepicker.destroy();
  }
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const newDatepicker = new Datepicker(elem, {
    format: {
      toValue(date) {
        const fullYearDate = date.replace(/\/(\d\d)$/, '/20$1');
        return Datepicker.parseDate(fullYearDate, 'dd-mm-yyyy');
      },
      toDisplay(date) {
        return Datepicker.formatDate(date , 'dd-mm-yyyy');
      },
    },
    minDate: new Date(currentYear, 0, 1),
    maxDate: new Date(nextYear, 11, 31),
  }); 
}

async function editHomework() {
  const date = document.getElementById('date').value;
  const classSelect = document.getElementById('classSelect');
  const yearSelector = document.getElementById('yearSelector').value
  // Get the form element
  const CurrentUserUid = getCookie('LoginUid');
  const form = document.querySelector('#editHomeworkForm');
  const classID = classSelect.value;
  // Create a new FormData object from the form
  const formData = new FormData(form);
  // Convert the FormData object to a regular object
  const formDataObj = Object.fromEntries(formData.entries());
  
  const data = {
    chi: formDataObj.chineseHomework,
    eng: formDataObj.englishHomework,
    math: formDataObj.mathematicsHomework,
    gs: formDataObj.generalStuidesHomework,
    other: formDataObj.other
  };

  try {
    const confirmed = await Swal.fire({
      title: 'Edit Class Homework',
      text: 'Are you sure you want to edit this homework list? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });

    if (confirmed.isConfirmed) {

      const response = await fetch(`${window.API_URL}/api/v1/class/${classID}/${date}/editHomework`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, CurrentUserUid,yearSelector }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          Swal.fire({
            title: 'Homework edited successfully',
            text: 'Homework edited successfully.',
            icon: 'success',
          }).then(() => {
            $('#editHomeworkModal').modal('hide'); // close the modal
            fetchHomeWorkData();
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
        Swal.fire({
          title: 'Error',
          text: 'Failed to edit homework information',
          icon: 'error'
        });
      }
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Failed to edit homework information'+error,
      icon: 'error'
    });
  }
}