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
  } catch (error) {
    console.error(error);
  }
}



function fetchGradeAndClass() {
  const termSelect = document.getElementById('termSelect');
  const classSelect = document.getElementById('classSelect');
  const classYearDiv = document.getElementById('classYearDiv');
  const buttonDiv = document.getElementById('buttonAction');

  // Clear previous options
  termSelect.innerHTML = '';
  classSelect.innerHTML = '';

  const placeholderOption = document.createElement('option');
  placeholderOption.value = '';
  placeholderOption.text = 'Select a Term';
  placeholderOption.disabled = true;
  placeholderOption.selected = true; // Set it as the selected option
  termSelect.appendChild(placeholderOption);

  // Add first half term option
  const firstHalfTermOption = document.createElement('option');
  firstHalfTermOption.value = 'firstHalfTerm';
  firstHalfTermOption.text = 'First Half Term';
  termSelect.appendChild(firstHalfTermOption);

  // Add second half term option
  const secondHalfTermOption = document.createElement('option');
  secondHalfTermOption.value = 'secondHalfTerm';
  secondHalfTermOption.text = 'Second Half Term';
  termSelect.appendChild(secondHalfTermOption);

  const placeholderOption2 = document.createElement('option');
  placeholderOption2.value = '';
  placeholderOption2.text = 'Select a Class';
  placeholderOption2.disabled = true;
  placeholderOption2.selected = true; // Set it as the selected option
  classSelect.appendChild(placeholderOption2);

  // Populate class select box
  const classOptions = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];
  classOptions.forEach((classOption) => {
    const option = document.createElement('option');
    option.value = classOption;
    option.text = classOption;
    classSelect.appendChild(option);
  });

  // Hide the class select box initially
  classYearDiv.style.display = 'none';
  buttonDiv.style.display = 'none';

  // Show the class select box when a term is selected
  termSelect.addEventListener('change', (event) => {
    const selectedTerm = event.target.value;
    classYearDiv.style.display = selectedTerm ? 'block' : 'none';
  });

  // Show the button div when a class is selected
  classSelect.addEventListener('change', (event) => {
    const selectedClass = event.target.value;
    buttonDiv.style.display = selectedClass ? 'flex' : 'none';
  });
}

let table; // Declare table variable in the outer scope
let table2;

function initializeDataTable() {
  table = $('#classGradeTable').DataTable({
    columns: [
      { title: 'Student Chinese Name' },
      { title: 'Student English Name' },
      { title: 'Chinese' },
      { title: 'English' },
      { title: 'Mathematics' },
      { title: 'General Studies' },
      { title: 'Action' },
    ],
  });

  table2 = $('#addStudentGradeTable').DataTable({
    columns: [
      { title: 'Class Number' },
      { title: 'Student Chinese Name' },
      { title: 'Student English Name' },
      { title: 'Chinese' },
      { title: 'English' },
      { title: 'Mathematics' },
      { title: 'General Studies' },
    ],
    order: [[0, 'asc']],
    columnDefs: [ { orderable: false, targets: [1,2,3,4,5,6] }],
    select: {
      style: 'multi',
      selector: 'td:not(:last-child)'
    },
    
  });

}


function fetchGradeReady() {
  const termSelect = document.getElementById('termSelect');
  const classSelect = document.getElementById('classSelect');
  termSelect.addEventListener('change', fetchAllData);
  classSelect.addEventListener('change', fetchAllData);
}

function fetchAllData() {
  const termSelect = document.getElementById('termSelect');
  const classSelect = document.getElementById('classSelect');
  const yearSelector = document.getElementById("yearSelector");
  const termDate = termSelect.value;
  const classID = classSelect.value;
  const year = yearSelector.value
  if (termDate && classID && year) {
    fetch(`${window.API_URL}/api/v1/class/getAllDocumentsInCollection/${year}/${termDate}/${classID}`)
      .then((response) => response.json())
      .then((data) => {
        table.clear().draw();
        table2.clear().draw();
        data.list.data.forEach((item) => {
          var rowData = [
            item.studentChiName,
            item.studentEngName,
            item.chi,
            item.eng,
            item.math,
            item.gs,
            `<button class="btn btn-success btn-circle edit-examMark-button" data-bs-toggle="modal" data-bs-target="#editExamModal" data-item='${JSON.stringify(item)}' title="Edit"><i class="fas fa-edit"></i></button>`,
          ]
          table.row.add(rowData).draw();
        });
        
        var editButtons = document.querySelectorAll('.edit-examMark-button');
        if (editButtons) {
          editButtons.forEach((editButton) => {
            editButton.addEventListener('click', function() {
              const item = JSON.parse(this.dataset.item);
              setExamMark(item);
            });
          });
        }

        data.list2.data.forEach((student) => {
          var rowData2 = [
            student.classNumber,
            student.studentChiName,
            student.studentEngName,
            createInput("chi"),
            createInput("eng"),
            createInput("math"),
            createInput("gs")
          ];
          let row = table2.row.add(rowData2).draw().node();
          row.id = student.classmateId; 
        });
        setUp()
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }else{
    table.clear().draw();
    table2.clear().draw();
  }
}

function setGradeToStduent() {
  const classSelect = document.getElementById("classSelect");
  const termSelect = document.getElementById('termSelect');
  const yearSelector = document.getElementById("yearSelector");
  const year = yearSelector.value
  const termDate = termSelect.value;
  const classID = classSelect.value;
  const CurrentUserUid = getCookie('LoginUid');
  const data = [];
  const checkboxInputs = document.querySelectorAll('input[name="selectedStudent"]');
  let hasMissingValue = false; 
  let outOfRange = false; 
  table2.rows( {selected: true} ).every( function ( rowIdx, tableLoop, rowLoop ) {
    var dataOwn = this.data();
    const docID = this.node().id; // Get the id attribute of the row
    const studentClassNumber = dataOwn[0];
    const studentName =  dataOwn[1];
    const chiValue = $('input[name="chi"]', this.node()).val();
    const engValue = $('input[name="eng"]', this.node()).val();
    const mathValue = $('input[name="math"]', this.node()).val();
    const gsValue = $('input[name="gs"]', this.node()).val();
    if (!chiValue || !engValue || !mathValue || !gsValue) {
      hasMissingValue = true;
      const missingValues = [];
      if (!chiValue) {
        missingValues.push("Chinese");
      }
      if (!engValue) {
        missingValues.push("English");
      }
      if (!mathValue) {
        missingValues.push("Mathematics");
      }
      if (!gsValue) {
        missingValues.push("General Studies");
      }
      Swal.fire({
        title: "Error",
        text: `One or more input values are missing for ${studentName}: ${missingValues.join(", ")}`,
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Stop processing the current row
    }
    if (chiValue < 0 || chiValue > 100 || engValue < 0 || engValue > 100 || mathValue < 0 || mathValue > 100 || gsValue < 0 || gsValue > 100) {
      outOfRange = true;
      const outOfRangeValues = [];
      if (chiValue < 0 || chiValue > 100) {
        outOfRangeValues.push("Chinese");
      }
      if (engValue < 0 || engValue > 100) {
        outOfRangeValues.push("English");
      }
      if (mathValue < 0 || mathValue > 100) {
        outOfRangeValues.push("Mathematics");
      }
      if (gsValue < 0 || gsValue > 100) {
        outOfRangeValues.push("General Studies");
      }
      Swal.fire({
        title: "Error",
        text: `One or more input values are out of range (0-100) for ${studentName}: ${outOfRangeValues.join(", ")}`,
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Stop processing the current row
    }
    data.push({docID:docID,classNumber:studentClassNumber,chi:chiValue,eng:engValue,math:mathValue,gs:gsValue});
  });

  if (hasMissingValue) { // Check flag to see if any input value is missing
    return; // Stop processing the function
  }

  if(outOfRange){
    return;
  }

  if (data.length === 0) {
    Swal.fire({
      title: "Error",
      text: "You must select at least one student",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }
  
  fetch(`${window.API_URL}/api/v1/class/addClassExamGrade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data, CurrentUserUid,classID,termDate,year}),
  })
  .then(response => response.json())
  .then(result => {
    // Handle the response data
    if (result.success) {
      Swal.fire({
        title: 'Success',
        text: 'Add grade to student from the class successfully',
        icon: 'success',
      }).then(() => {
        $('#addStudentGradeModal').modal('hide'); // close the modal
        fetchAllData();
      });
      // Perform any necessary actions after successful deletion
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Failed to add grade to student from the class',
        icon: 'error',
      });
    }
  })
  .catch(error => console.error('Error setting grade:', error));
}


function createCheckboxInput(value) {
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.name = 'selectedStudent';
  input.value = value;
  return input.outerHTML;
}

function createInput(value) {
  const input = document.createElement('input');
  input.type = 'text';
  input.name = value;
  input.id = value;
  input.value = value;
  input.style.width = '100px';
  return input.outerHTML;
}


function setUp() {
  table2.on('click','input',function(e){
    e.stopPropagation()
  })
}


function uncheckAll() {
  table2.rows( { selected: true } ).deselect();
}

function setExamMark(data) {
  document.querySelector('#nameEdit').value = data.studentName;
  document.querySelector('#hiddenDocIDEdit').value = data.id;
  document.querySelector('#chineseExamEdit').value = data.chi;
  document.querySelector('#englishExamEdit').value = data.eng;
  document.querySelector('#mathematicsExamEdit').value = data.math;
  document.querySelector('#generalStuidesExamEdit').value = data.gs;
}

async function editExam() {
  const termSelect = document.getElementById('termSelect');
  const classSelect = document.getElementById('classSelect');
  const CurrentUserUid = getCookie('LoginUid');
  const form = document.querySelector('#editExamForm');
  const yearSelector = document.getElementById("yearSelector");
  const year = yearSelector.value
  const termDate = termSelect.value;
  const classID = classSelect.value;
  // Create a new FormData object from the form
  const formData = new FormData(form);
  // Convert the FormData object to a regular object
  const formDataObj = Object.fromEntries(formData.entries());
  
  const data = {
    studentName:formDataObj.nameEdit,
    docID:formDataObj.hiddenDocIDEdit,
    chi: formDataObj.chineseExamEdit,
    eng: formDataObj.englishExamEdit,
    math: formDataObj.mathematicsExamEdit,
    gs: formDataObj.generalStuidesExamEdit,
  };

  const hasEmptyValue = Object.values(data).some(value => value.trim() === '');
  if (hasEmptyValue) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Please fill in all form fields!',
      confirmButtonText: 'OK'
    });
    return;
  }
  const hasInvalidValue = Object.values(data).slice(2).some(value => {
    const numValue = Number(value);
    return isNaN(numValue) || numValue < 0 || numValue > 100;
  });
  if (hasInvalidValue) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Please enter a valid grade between 0 and 100!',
      confirmButtonText: 'OK'
    });
    return;
  }


  try {
    const confirmed = await Swal.fire({
      title: 'Edit Exam Mark',
      text: 'Are you sure you want to edit this exam mark? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });

    if (confirmed.isConfirmed) {

      const response = await fetch(`${window.API_URL}/api/v1/class/editExam`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, CurrentUserUid,classID,termDate,year}),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          Swal.fire({
            title: 'Exam Mark edited successfully',
            text: 'Exam Mark edited successfully.',
            icon: 'success',
          }).then(() => {
            $('#editExamModal').modal('hide'); // close the modal
            fetchAllData();
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
          text: 'Failed to edit exam mark information',
          icon: 'error'
        });
      }
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Failed to edit exam mark information'+error,
      icon: 'error'
    });
  }
}