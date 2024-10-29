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
  const monthPhotoTableDiv = document.getElementById("monthPhotoTableDiv");
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "Select Year";
  defaultOption.selected = true; 
  defaultOption.disabled = true;
  yearSelector.add(defaultOption);
  monthPhotoTableDiv.hidden = true;
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
          monthPhotoTableDiv.hidden = true;
        } else {
          monthPhotoTableDiv.hidden = false;
          const photoDocIds = await getPhotoDocIds();
        }
      });
  } catch (error) {
    console.error(error);
  }
}

let table;
let table2;
let table3;


function initializeDataTable() {
    table = $('#monthPhotoTable').DataTable({
      columns: [
        { title: 'Year' },
        { title: 'Month' },
        { title: 'Action'},
      ],
    });
    table2 = $('#photoActivityTable').DataTable({
        columns: [
            { title: 'Activity Name' },
            { title: 'Activity Date' },
            { title: 'Action'},
        ],
    });
    table3 = $('#photoActivityImageTable').DataTable({
        searching: false,
        columns: [
            { title: 'Image Id'},
            { title: 'Image Name',"ordering": false},
            { title: 'Image Show', "ordering": false},
            { title: 'Action',"ordering": false},
        ],
        order: [[0, 'asc']],
        
    });
    // Select the photoActivityImageTable_length div
    const photoActivityImageTableLengthDiv = $('#photoActivityImageTable_length');


    // Create a new div element
    const newButton = $('<button>').attr({
      'type': 'button',
      'class': 'btn btn-success btn-circle addImageButton',
      'id': 'addImageButton',
      'title': 'Add Image',
    }).html('<i class="fas fa-plus"></i>');
    //newButton.attr('onclick', 'showAddImageModal(data)');
    // Insert the new div after the photoActivityImageTable_length div
    newButton.insertAfter(photoActivityImageTableLengthDiv);
}




async function getPhotoDocIds() {
  const yearSelector = document.getElementById("yearSelector");
  const selectedYear = yearSelector.value;
  try {
    const response = await fetch(`${window.API_URL}/api/v1/schoolActivity/getPhotoDocIds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ year: selectedYear })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    response.json().then((data) => {
        table.clear().draw();
        data.forEach((data) => {
            const arr = data.split("-");
            var rowData = [
                arr[0],
                arr[1],
                `<button class="btn btn-success btn-circle" data-bs-toggle="modal" data-bs-target="#photoActivityModal" onclick="showActivity('${data}')" title="Edit Activity"><i class="fas fa-edit"></i></button>`,
            ];
            table.row.add(rowData).draw();
        });
    });
  } catch (error) {
    console.error(error);
  }
}


function setDatePicker(activityDate){
  var year = parseInt(activityDate.split('-')[0]);
  var month = parseInt(activityDate.split('-')[1]) - 1;
  var mindate = new Date(year, month, 1);
  var maxdate = new Date(year, month + 1, 0);
  const elem = document.getElementById('activityDate');
  const datepicker = elem.datepicker;
  if (datepicker) {
    datepicker.destroy();
  }
  const newDatepicker = new Datepicker(elem, {
    format: {
      toValue(date) {
        const fullYearDate = date.replace(/\/(\d\d)$/, '/20$1');
        return Datepicker.parseDate(fullYearDate, 'mm/dd/yyyy');
      },
      toDisplay(date) {
        return Datepicker.formatDate(date , 'dd-mm-yyyy');
      },
    },

    minDate : mindate,
    maxDate : maxdate, 

  }); 
}

async function showActivity(activityDate) {
    
    setDatePicker(activityDate)
    const yearSelector = document.getElementById("yearSelector");
    const selectedYear = yearSelector.value;
    try {
        const response = await fetch(`${window.API_URL}/api/v1/schoolActivity/getPhotogetPhotoActivityDocIds`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ year: selectedYear, photoDate: activityDate})
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        response.json().then((data) => {
            table2.clear().draw();
            data.forEach((data) => {
                var rowData = [
                    data.name,
                    data.date,
                    `<button class="btn btn-success btn-circle view-image-button" data-item='${JSON.stringify({data: data, activityDate: activityDate})}' title="Edit Image"><i class="fas fa-edit"></i></button>`,
                ];
                table2.row.add(rowData).draw();
            });

            
            var editButtons = document.querySelectorAll('.view-image-button');
            if (editButtons) {
                editButtons.forEach((editButton) => {
                    editButton.addEventListener('click', function() {
                    const item = JSON.parse(this.dataset.item);
                      showImageModal(item);
                    });
                });
            }

        });
      } catch (error) {
        console.error(error);
      }
}



let photoDate;
let id;
let wholeDate;
let activityName;

function showImageModal(data) {
  $('#photoActivityImageModal').modal('show');
  const yearSelector = document.getElementById("yearSelector");
  const selectedYear = yearSelector.value;

  //const button = event.target;
  //const data = JSON.parse(button.dataset.data);
  console.log(data);
  photoDate = data.activityDate;
  id = data.data.id;
  activityName =data.data.name;
  wholeDate = data.data.date;
  fetchImages(selectedYear, photoDate,id,activityName,wholeDate);  

  const addImageButton = document.getElementById('addImageButton');
  addImageButton.onclick = function() {
    showAddImageModal(data.data);
  };
}

async function fetchImages(selectedYear, photoDate, id,activityName,wholeDate) {
  try {
    const response = await fetch(`${window.API_URL}/api/v1/schoolActivity/getPhotoInActivity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ year: selectedYear, photoDate: photoDate, id: id})
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    response.json().then((data) => {
      table3.clear().draw();
      data.forEach((data) => {
          var rowData = [
              data.id,
              data.name,
              `<img src="${data.url}" width="150" height="150">`,
              `<button class="btn btn-success btn-circle" onclick="editImageModal('${data.id}','${data.name}','${data.url}','${id}','${activityName}','${wholeDate}')" title="Edit image"><i class="fas fa-edit"></i></button>`+
              `<button class="btn btn-danger btn-circle" style="margin-left:2px" onclick="deleteImage('${data.id}','${data.name}','${data.url}','${id}','${activityName}','${wholeDate}')" title="Delete Image"><i class="fas fa-trash"></i></button>`,
          ];
          table3.row.add(rowData).draw();
      });
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}


function showAddImageModal(data){
    $('#addIamgeModal').modal('show');
    pond.removeFiles();

    const uploadFileButton = document.getElementById('uploadFileButton');
    uploadFileButton.onclick = function() {
      uploadImage(data);
    };
}

function editImageModal(id,name,url,phoneActivityID,activityName,photoDate){
  const editImageModal = document.getElementById('editIamgeModal');
  const editImageFileInput = document.getElementById('editImageFileInput');
  $('#editIamgeModal').modal('show');
  const pond2 = FilePond.create(editImageFileInput, {
    imagePreviewHeight: 250,
    imageCropAspectRatio: '1:1',
    storeAsFile: true,
    allowImagePreview: true,
    files: [
      {
        source: url,
        options:{
          type: "local",
        }
      }
    ],
    server: {
      load: async(source, load, error, progress, abort, headers) => {
        var myRequest = new Request(source);
        fetch(myRequest).then(function(response) {

          response.blob().then(function(myBlob) {
            const fileName = name + '.jpg'; // add .jpg extension to file name
            const file = new File([myBlob], fileName, { type: 'image/jpeg' }); // create new file with .jpg extension
            load(file); // load the new file
            pond2.addFile(file); // add the new file to the FilePond instance
          });
        });
      },
      revert: null,
    },
  });

  
  const editUploadFileButton = document.getElementById('editUploadFileButton');
  editUploadFileButton.onclick = function() {
    updateImage(id,name,url,phoneActivityID,activityName,photoDate);
  };

  editImageModal.addEventListener('hidden.bs.modal', () => {
    pond2.destroy();
  });

}


function deleteImage(id,name,url,phoneActivityID,activityName,activityPhotoDate){
  const CurrentUserUid = getCookie('LoginUid');
  const yearSelector = document.getElementById("yearSelector");
  const selectedYear = yearSelector.value;
  const filePath = `activity/${selectedYear}/${activityName}-${activityPhotoDate}`;
  const [day, month, year] = activityPhotoDate.split('-');
  const activityMonth = year+"-"+month;
  const activityID = phoneActivityID;
  const imageName = name;
  const imageID = id;
  const data = {
    year: selectedYear,
    filePath: filePath,
    activityName: activityName,
    activityMonth: activityMonth,
    activityID: activityID,
    imageID: imageID,
    imageName:imageName,
  };


  swal.fire({
    title: 'Are you sure?',
    text: 'You are about to delete an image. Are you sure you want to proceed?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
        fetch(`${window.API_URL}/api/v1/schoolActivity/deletePhoto`, {
            method: 'DELETE',
            body: JSON.stringify({data,CurrentUserUid}),
            headers: {
              "Content-Type": "application/json"
            },
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            swal.fire({
                title: 'Success',
                text: data.message,
                icon: 'success'
            }).then(() => {
              //$('#addIamgeModal').modal('hide'); // close the modal
              fetchImages(selectedYear,photoDate,phoneActivityID);
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

function updateImage(id,name,url,phoneActivityID,activityName,activityPhotoDate){
  const CurrentUserUid = getCookie('LoginUid');
  const editImageForm = document.getElementById('editImageForm');
  const formData = new FormData(editImageForm);
  const file = formData.get('filepond2');
  const yearSelector = document.getElementById("yearSelector");
  const selectedYear = yearSelector.value;
  const filePath = `activity/${selectedYear}/${activityName}-${activityPhotoDate}`;
  const [day, month, year] = activityPhotoDate.split('-');
  formData.append('year', selectedYear);
  formData.append('filePath', filePath);
  formData.append('imageName', name);
  formData.append('imageID', id);
  formData.append('activityName', activityName);
  formData.append('activityMonth', year+"-"+month);
  formData.append('activityID', phoneActivityID);
  formData.append('CurrentUserUid', CurrentUserUid);
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }


  if (file.size === 0) {
    swal.fire({
      title: 'Error',
      text: 'The selected file is empty. You should select the image first.',
      icon: 'error'
    });
    return;
  }

  swal.fire({
    title: 'Are you sure?',
    text: 'You are about to edit an image. Are you sure you want to proceed?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, edit!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
        fetch(`${window.API_URL}/api/v1/schoolActivity/editUploadPhoto`, {
            method: 'PUT',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            swal.fire({
                title: 'Success',
                text: data.message,
                icon: 'success'
            }).then(() => {
              $('#editIamgeModal').modal('hide'); // close the modal
              fetchImages(selectedYear,photoDate,phoneActivityID);
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


function uploadImage(datafield) {
    const CurrentUserUid = getCookie('LoginUid');
    const imageForm = document.getElementById('imageForm');
    const formData = new FormData(imageForm);
    const file = formData.get('filepond');
    if (file.size === 0) {
      swal.fire({
        title: 'Error',
        text: 'The selected file is empty. You should select the image first.',
        icon: 'error'
      });
      return;
    }

    const yearSelector = document.getElementById("yearSelector");
    const selectedYear = yearSelector.value;
    const filePath = `activity/${selectedYear}/${datafield.name}-${datafield.date}`;
    const [day, month, year] = datafield.date.split('-');

    formData.append('year', selectedYear);
    formData.append('filePath', filePath);
    formData.append('activityName', datafield.name);
    formData.append('activityMonth', year+"-"+month);
    formData.append('id', datafield.id);
    formData.append('CurrentUserUid', CurrentUserUid);
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
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
          fetch(`${window.API_URL}/api/v1/schoolActivity/uploadPhoto`, {
              method: 'POST',
              body: formData
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              swal.fire({
                  title: 'Success',
                  text: data.message,
                  icon: 'success'
              }).then(() => {
                $('#addIamgeModal').modal('hide'); // close the modal
                fetchImages(selectedYear,photoDate,id);
              });

            } else {
              swal.fire({
                  title: 'Success but wrong',
                  text: data.message,
                  icon: 'success'
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

function addAcitivity(){
  const CurrentUserUid = getCookie('LoginUid');
  const yearSelector = document.getElementById("yearSelector");
  const selectedYear = yearSelector.value;
  const activityName = document.getElementById('activityName').value;
  const photoDate = document.getElementById('activityDate').value;
  const [day, month, year] = photoDate.split('-');
  const activityDate = year+"-"+month;

  const data = {
    yearSelect: selectedYear,
    activityName: activityName,
    photoDate: photoDate,
    activityDate:activityDate
  };

  swal.fire({
    title: 'Are you sure?',
    text: 'You are about to add an activity. Are you sure you want to proceed?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, add!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
        fetch(`${window.API_URL}/api/v1/schoolActivity/addActivity`, {
            method: 'POST',
            body: JSON.stringify({data,CurrentUserUid}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            swal.fire({
                title: 'Success',
                text: data.message,
                icon: 'success'
            }).then(() => {
              $('#addActivityModal').modal('hide'); // close the modal
              showActivity(activityDate);
              //fetchImages(selectedYear,photoDate,id);
            });

          } else {
            swal.fire({
              title: 'Error',
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