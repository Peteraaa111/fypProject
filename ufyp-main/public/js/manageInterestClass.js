function getCookie(name) {
    const cookieName = name + "=";
    const cookieArray = document.cookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return "";
}

let table;

 function initializeDataTable() {
    table = $("#interestClassListTable").DataTable({
      initComplete: function () {
        var button = $("<button>")
          .addClass("btn btn-success btn-circle add-interest-class")
          .attr("title", "Apply Interest Class")
          .attr("data-toggle", "tooltip")
          .attr("data-placement", "top")
          .on("click", function () {
            showModal("add");
          })
          .append($("<i>").addClass("fa fa-plus"));
  
        $("#interestClassListTable_filter").before(button);
      },
      columns: [
        { title: "Interest Class Name(TC)"},
        { title: "Interest Class Name(EN)"},
        { title: "Apply Time"},
        { title: "Start Time" },
        { title: "Action"},
      ],
      columnDefs: [ { orderable: false, targets: [0,1,3,4] }],
      order: [[2, "asc"]],
      

    });
}

 async function populateYearSelector() {
    const yearSelector = document.getElementById("academicYearSelect");
    const interestClassTableDiv = document.getElementById("interestClassTableDiv");
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
            interestClassTableDiv.style.display = "none";
        } else {
            interestClassTableDiv.style.display = "flex";
            await fetchData();
        }
  
      });
    } catch (error) {
      console.error(error);
    }
}


async function fetchData() {
  const yearSelector = document.getElementById("academicYearSelect");
  const selectedYear = yearSelector.value;
  try {
    const response = await fetch(`${window.API_URL}/api/v1/interestClass/getAllInterestClassGroup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ year: selectedYear})
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    response.json().then((data) => {
      table.clear().draw();
      data.forEach((data) => {
        
        if(data.status!== 'D'){
          var rowData = [
            data.titleTC,
            data.titleEN,
            data.validApplyDateFrom + ' To ' + data.validApplyDateTo,
            data.startDateFrom + ' To ' + data.startDateTo,
            `<button class="btn btn-success btn-circle edit-interestClass-button" data-item='${JSON.stringify({data: data})}' title="Edit interest class"><i class="fas fa-edit"></i></button>` +
            (data.status === 'A' ? `<button class="btn btn-danger btn-circle" style="margin-left:10px" onclick="changeStatus('S','${data.id}')" title="pause interest class"><i class="fas fa-pause"></i></button>` :
            `<button class="btn btn-info btn-circle" style="margin-left:10px" onclick="changeStatus('A','${data.id}')" title="resume interest class"><i class="fas fa-play"></i></button>`) +
            `<button class="btn btn-danger btn-circle" style="margin-left:10px" onclick="changeStatus('D','${data.id}')" title="delete interest class"><i class="fas fa-trash"></i></button>`,
          ];
            table.row.add(rowData).draw();
        }
      });
      var editButtons = document.querySelectorAll('.edit-interestClass-button');
      if (editButtons) {
          editButtons.forEach((editButton) => {
              editButton.addEventListener('click', function() {
              const item = JSON.parse(this.dataset.item);
                showModal('edit',item);
              });
          });
      }
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

function changeStatus(status,id){
  const yearSelector = document.getElementById("academicYearSelect");
  const selectedYear = yearSelector.value;
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
      fetch(`${window.API_URL}/api/v1/interestClass/editInterestClassStatus`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status,CurrentUserUid,selectedYear,id }),
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
                  fetchData();
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

function showModal(action,item){
    let interestClassModalabel = document.getElementById('interestClassModalabel');
    let interestClassActionButton = document.getElementById('interestClassActionButton');
    $('#interestClassModal').modal('show');
    if(action === "add"){
        interestClassModalabel.innerText = "Add Interest Class";
        interestClassActionButton.innerText = "Add";
        interestClassActionButton.onclick = null;
        interestClassActionButton.onclick = function () {
          addInterestClass();
        };
    }else if(action === 'edit'){
        const itemData = item.data;

        const form = document.getElementById('interestClassForm');
        const inputs = form.querySelectorAll('input,select');
        const borderColor = '#1cc88a';

        inputs.forEach(input => {
          input.style.borderColor = borderColor;
        });

        document.getElementById('titleEN').value = itemData.titleEN;
        document.getElementById('titleTC').value = itemData.titleTC;
        document.getElementById('validApplyDateFrom').value = itemData.validApplyDateFrom;
        document.getElementById('validApplyDateTo').value = itemData.validApplyDateTo;
        document.getElementById('startDateFrom').value = itemData.startDateFrom;
        document.getElementById('startDateTo').value = itemData.startDateTo;
        document.getElementById('startTime').value = itemData.startTime;
        document.getElementById('endTime').value = itemData.endTime;
        document.getElementById('weekDay').value = itemData.weekDay;

        interestClassModalabel.innerText = "Edit Interest Class";
        interestClassActionButton.innerText = "Edit";
        interestClassActionButton.onclick = function () {
          edidInterestClass(itemData.id);
        };
    }
}


function edidInterestClass(id){
  const yearSelector = document.getElementById("academicYearSelect");
  const selectedYear = yearSelector.value;
  const CurrentUserUid = getCookie('LoginUid');
  const form = document.getElementById('interestClassForm');
  if(!checkEmptyInputs() || !checkTime()){
    return
  };

  let data = {};
  const formData = new FormData(form);
  for (const [name, value] of formData.entries()) {
    data[name] = value;
  }
  data["id"] = id;

  swal.fire({
    title: "Are you sure?",
    text: "You are about to edit interest class. Are you sure you want to proceed?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, edit!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${window.API_URL}/api/v1/interestClass/editInterestClass`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data,CurrentUserUid,selectedYear }),
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
                  $('#interestClassModal').modal('hide'); // close the modal
                  fetchData();
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


function addInterestClass(){
  const yearSelector = document.getElementById("academicYearSelect");
  const selectedYear = yearSelector.value;
  const CurrentUserUid = getCookie('LoginUid');
  const form = document.getElementById('interestClassForm');
  if(!checkEmptyInputs() || !checkTime()){
    return
  };

  let data = {};
  const formData = new FormData(form);
  //const classData = {};
  for (const [name, value] of formData.entries()) {
    data[name] = value;
  }
  //data.push(classData);
  

  swal.fire({
    title: "Are you sure?",
    text: "You are about to add new interest class. Are you sure you want to proceed?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, add!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
  })
  .then((result) => {
    if (result.isConfirmed) {
      fetch(`${window.API_URL}/api/v1/interestClass/addInterestClass`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data,selectedYear,CurrentUserUid }),
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
                  $('#interestClassModal').modal('hide'); // close the modal
                  fetchData();
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

function checkEmptyInputs() {
  const form = document.getElementById('interestClassForm');
  const inputs = form.querySelectorAll('input,select');
  let flag = true;
  inputs.forEach(input => {
    let invalidLabel = input.parentNode.querySelector('.invalid-label');
    if (input.value === '' || input.value === null) {
      flag = false;
      input.style.borderColor = '#e74a3b';
      if (!invalidLabel) {
        invalidLabel = document.createElement('label');
        invalidLabel.className = 'invalid-label';
        invalidLabel.innerHTML = 'This field is required';
        invalidLabel.style.color = '#e74a3b';
        input.parentNode.appendChild(invalidLabel);
      }
    }
  });
  return flag;
}

function checkTime(){
  const validApplyDateFromT = document.getElementById('validApplyDateFrom');
  const validApplyDateToT = document.getElementById('validApplyDateTo');
  const startDateFromT = document.getElementById('startDateFrom');
  const startDateToT = document.getElementById('startDateTo');

  const validApplyDateFromCheck = new Date(validApplyDateFromT.value);
  const validApplyDateToCheck = new Date(validApplyDateToT.value);
  const startDateFormCheck = new Date(startDateFromT.value);
  const startDateToCheck = new Date(startDateToT.value);
  let flag = true;

  if(validApplyDateFromCheck >validApplyDateToCheck ){
    flag = false;
  }
  if(startDateFormCheck > startDateToCheck){
    flag = false;
  }

  if(startDateFormCheck < validApplyDateToCheck){
    flag = false;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Start date from cannot be earlier than valid apply date to',
    });
  }
  return flag;
}


function reset(){
  const form = document.getElementById('interestClassForm');
  const inputs = form.querySelectorAll('input');

  form.reset();
  const interestClassModal = document.getElementById('interestClassModal');
  interestClassModal.addEventListener('hidden.bs.modal', () => {
    form.reset();
    inputs.forEach(input => {
      input.style.borderColor = '';
    });
    const invalidLabels = document.querySelectorAll('.invalid-label');
    invalidLabels.forEach(label => label.remove()); 
  });


}


function setUpValidCheck(){
    const titleEN = document.getElementById('titleEN');
    const titleTC = document.getElementById('titleTC');
    const validApplyDateFrom = document.getElementById('validApplyDateFrom');
    const validApplyDateTo = document.getElementById('validApplyDateTo');
    const startDateFrom = document.getElementById('startDateFrom');
    const startDateTo = document.getElementById('startDateTo');
    const weekDay = document.getElementById('weekDay');
    const fromTime = document.getElementById('startTime');
    const toTime = document.getElementById('endTime');

    // Add input event listener to each input field
    titleEN.addEventListener('input', handleInput);
    titleTC.addEventListener('input', handleInput);
    validApplyDateFrom.addEventListener('input', handleInput);
    validApplyDateTo.addEventListener('input', handleInput);

    startDateFrom.addEventListener('input', handleInput);
    startDateTo.addEventListener('input', handleInput);
    weekDay.addEventListener('input', handleInput);

    fromTime.addEventListener('input', handleInput);
    toTime.addEventListener('input', handleInput);

    function handleInput(event) {
      const input = event.target;
      const invalidLabel = input.parentNode.querySelector('.invalid-label');
      if (input.value === '') {
        input.style.borderColor = '#e74a3b';
        if (invalidLabel) {
          invalidLabel.remove();
        }
        const newLabel = document.createElement('div');
        newLabel.classList.add('invalid-label');
        newLabel.textContent = 'The field cannot be empty';
        newLabel.style.color = '#e74a3b';
        input.parentNode.appendChild(newLabel);
      } else {
        input.style.borderColor = '#1cc88a';
        if (invalidLabel) {
          invalidLabel.remove();
        }
      }
    
      if (input === validApplyDateFrom || input === validApplyDateTo) {
        if (validApplyDateFrom.value !== '' && validApplyDateTo.value !== '') {
          const fromDate = new Date(validApplyDateFrom.value);
          const toDate = new Date(validApplyDateTo.value);
          if (fromDate >= toDate) {
            const invalidLabel = validApplyDateFrom.parentNode.querySelector('.invalid-label');
            validApplyDateFrom.style.borderColor = '#e74a3b';
            validApplyDateTo.style.borderColor = '#e74a3b';
            if (!invalidLabel) {
              const newLabel = document.createElement('div');
              newLabel.classList.add('invalid-label');
              newLabel.textContent = 'Valid apply date from cannot be higher or equal than valid apply date to';
              newLabel.style.color = '#e74a3b';
              validApplyDateFrom.parentNode.appendChild(newLabel);
            }
          } else {
            validApplyDateFrom.style.borderColor = '#1cc88a';
            validApplyDateTo.style.borderColor = '#1cc88a';
            if (invalidLabel) {
              invalidLabel.remove();
            }
          }
        }
      } 
      
      else if (input === startDateFrom || input === startDateTo) {
        if (startDateFrom.value !== '' && startDateTo.value !== '') {
          const fromDate = new Date(startDateFrom.value);
          const toDate = new Date(startDateTo.value);
          if (fromDate >= toDate) {
            const invalidLabel = startDateFrom.parentNode.querySelector('.invalid-label');
            startDateFrom.style.borderColor = '#e74a3b';
            startDateTo.style.borderColor = '#e74a3b';
            if (!invalidLabel) {
              const newLabel = document.createElement('div');
              newLabel.classList.add('invalid-label');
              newLabel.textContent = 'Start date from cannot be higher or equal than start date to';
              newLabel.style.color = '#e74a3b';
              startDateFrom.parentNode.appendChild(newLabel);
            }
          } else {
            startDateFrom.style.borderColor = '#1cc88a';
            startDateTo.style.borderColor = '#1cc88a';
            if (invalidLabel) {
              invalidLabel.remove();
            }
          }
        }
      }
    
      if(input === validApplyDateTo){
        if (validApplyDateFrom.value !== '' && validApplyDateTo.value !== '') {
          const fromDate = new Date(validApplyDateFrom.value);
          const toDate = new Date(validApplyDateTo.value);
          if (fromDate < toDate) {
            const invalidLabel = validApplyDateFrom.parentNode.querySelector('.invalid-label');
            if (invalidLabel) {
              invalidLabel.remove();
            }
          } 
        }
      }
    
      if(input === startDateTo){
        if (startDateFrom.value !== '' && startDateTo.value !== '') {
          const fromDate = new Date(startDateFrom.value);
          const toDate = new Date(startDateTo.value);
          if (fromDate < toDate) {
            const invalidLabel = startDateFrom.parentNode.querySelector('.invalid-label');
            if (invalidLabel) {
              invalidLabel.remove();
            }
          } 
        }
      }

      if (input === fromTime || input === toTime) {
        if (fromTime.value !== '' && toTime.value !== '') {
          const fromTimeValue = fromTime.value.split(':').map(Number);
          const toTimeValue = toTime.value.split(':').map(Number);
          if (fromTimeValue[0] > toTimeValue[0] || (fromTimeValue[0] === toTimeValue[0] && fromTimeValue[1] > toTimeValue[1])) {
            const invalidLabel = fromTime.parentNode.querySelector('.invalid-label');
            fromTime.style.borderColor = '#e74a3b';
            toTime.style.borderColor = '#e74a3b';
            if (!invalidLabel) {
              const newLabel = document.createElement('div');
              newLabel.classList.add('invalid-label');
              newLabel.textContent = 'Start time cannot be later than end time';
              newLabel.style.color = '#e74a3b';
              fromTime.parentNode.appendChild(newLabel);
            }
          } else {
            fromTime.style.borderColor = '#1cc88a';
            toTime.style.borderColor = '#1cc88a';
            const invalidLabel = fromTime.parentNode.querySelector('.invalid-label');
            if (invalidLabel) {
              invalidLabel.remove();
            }
          }
        }
      }

    }

}