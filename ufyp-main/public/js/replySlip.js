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
let studentOptions;
let classOptions;

async function populateYearSelector() {
    const yearSelector = document.getElementById("yearSelector");
    const replySlipTableDiv = document.getElementById("replySlipTableDiv");
    const addReplySlipButton = document.getElementById("addReplySlip");
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Select Year";
    defaultOption.selected = true; 
    defaultOption.disabled = true;
    yearSelector.add(defaultOption);
    replySlipTableDiv.hidden = true;
    addReplySlipButton.hidden = true;
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
            replySlipTableDiv.hidden = true;
            addReplySlipButton.hidden = true;
          } else {
            checkTitle();
            replySlipTableDiv.hidden = false;
            addReplySlipButton.hidden = false;
            await getReplySlip();
            classOptions = await getAllClassData();
            studentOptions = await getAllClassAndStudentData();
            //console.log(classOptions);
          }
        });
    } catch (error) {
      console.error(error);
    }
}


let table;
let table2;
let table3;


async function getReplySlip(){
    const yearSelector = document.getElementById("yearSelector");
    const selectedYear = yearSelector.value;
    try {
      const response = await fetch(`${window.API_URL}/api/v1/replySlip/getReplySlip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ year: selectedYear })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      response.json().then((dataset) => {
          table.clear().draw();
          dataset.forEach((data) => {
            console.log(data);
            const setdata = {
                id: data.id,
                titleTC: data.titleTC,
                titleEN: data.titleEN,
                mainContentTC:data.mainContentTC,
                mainContentEN:data.mainContentEN,
                recipientContentTC:data.recipientContentTC,
                recipientContentEN:data.recipientContentEN,
                payment:data.payment,
                paymentAmount:data.paymentAmount,
            };
            let statusFull = "";
            if(data.status==="UD"){
              statusFull = "Undistributed"
            }else if(data.status==="D"){
              statusFull = "Distributed"
            }
              var rowData = [
                data.id,
                data.titleTC + "<br>" + data.titleEN,
                data.creationDate,
                statusFull,
                `<button class="btn btn-success btn-circle view-replySlip-button" data-bs-toggle="modal" data-item='${JSON.stringify(setdata)}'  data-bs-target="#replySlipModal" title="Edit"><i class="fas fa-edit"></i></button>` + `<button class="btn btn-info btn-circle distributeReplySlip" onclick="distributeReplySlip('${data.id}','${data.status}')" title="Post"><i class="fa fa-share" style="color:aliceblue"></i></button>` + `<button class="btn btn-danger btn-circle removeReplySlip" title="remove" onclick="removeReplySlip('${data.id}')"><i class="fa fa-trash"></i> </button>`,     
              ];
              table.row.add(rowData).draw();
          });
            var editButtons = document.querySelectorAll('.view-replySlip-button');
            if (editButtons) {
                editButtons.forEach((editButton) => {
                    editButton.addEventListener('click', function() {
                    const item = JSON.parse(this.dataset.item);
                        modalShow('view',item);
                    });
                });
            }
      });
    } catch (error) {
      console.error(error);
    }
}

function removeReplySlip(id) {
    const CurrentUserUid = getCookie('LoginUid');
    const yearSelector = document.getElementById("yearSelector");
    const selectedYear = yearSelector.value;
    swal.fire({
        title: 'Are you sure?',
        text: "Do you want to remove this reply slip?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          fetch(`${window.API_URL}/api/v1/replySlip/removeReplySlip/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id,selectedYear,CurrentUserUid})
          })
          .then(response => response.json())
          .then(data => {
            swal.fire({
                title: 'Success',
                text: data.message,
                icon: 'success'
            }).then(() => {
              // Refresh the table
              getReplySlip();
            });
          })
          .catch(error => {
            console.error(error);
            swal.fire({
                title: 'Error',
                text: data.message,
                icon: 'error'
              });
          });
        } else {
          //swal.fire("Reply slip not removed!");
        }
      });
}


function SettingForClassSelector(){
  VirtualSelect.init({ 
    ele: '#class-select',
    options: classOptions,
    search: true,   
    multiple: true,
    showValueAsTags: true,
    required: true,
  });
}

function SettingForStudentSelector(){
  VirtualSelect.init({ 
    ele: '#student-select',
    options: studentOptions,
    search: true,   
    multiple: true,
    showValueAsTags: true,
    required: true,
    popupDropboxBreakpoint: '3000px',
    searchGroup: true,
  });
}

function initReplySlipDetail(){
  const numberOfStudentReadReplySlipTableDiv = document.getElementById('numberOfStudentReadReplySlipTableDiv');
  const numberOfStudentSubmitReplySlipTableDiv = document.getElementById('numberOfStudentSubmitReplySlipTableDiv'); 
  const showDetailReadSpan = document.getElementById('showDetailRead');
  const showDetailSubmitSpan = document.getElementById('showDetailSubmit');

  numberOfStudentReadReplySlipTableDiv.hidden = true;
  numberOfStudentSubmitReplySlipTableDiv.hidden = true;


  showDetailReadSpan.addEventListener('click', function() {
    if (numberOfStudentReadReplySlipTableDiv.hidden) {
      numberOfStudentReadReplySlipTableDiv.hidden = false;
      showDetailReadSpan.textContent = 'Off Detail Table';
    } else {
      numberOfStudentReadReplySlipTableDiv.hidden = true;
      showDetailReadSpan.textContent = 'Show Detail Table';
    }
  });
  
  showDetailSubmitSpan.addEventListener('click', function() {
    if (numberOfStudentSubmitReplySlipTableDiv.hidden) {
      numberOfStudentSubmitReplySlipTableDiv.hidden = false;
      showDetailSubmitSpan.textContent = 'Off Detail Table';
    } else {
      numberOfStudentSubmitReplySlipTableDiv.hidden = true;
      showDetailSubmitSpan.textContent = 'Show Detail Table';
    }
  });
}

async function putDataToTable(data){

  var rowData1 = [
    data.class,
    data.studentChiName,
    data.studentEngName,
    data.read,
    data.gotDate,
  ];
  var rowData2 = [
    data.class,
    data.studentChiName,
    data.studentEngName,
    data.submit,
    data.gotDate,
  ];
  var addRow = table2.row.add(rowData1).draw().node();
  var addRow2 =  table3.row.add(rowData2).draw().node();

  if(data.read === "R"){
    $(addRow).addClass('read');
  }else{
    $(addRow).addClass('notRead');
  }

  if(data.submit === "S"){
    $(addRow2).addClass('subbmited');
  }else{
    $(addRow2).addClass('notsubmit');
  }

}


async function distributeReplySlip(id,status) {
  $('#distributeReplySlipModal').on('shown.bs.modal', function () {
    $('#distributionMethod-tab').tab('show');
  });
  $('#distributeReplySlipModal').modal('show');
  const classSelectDiv = document.getElementById('classSelectDiv');
  const studentSelectDiv = document.getElementById('studentSelectDiv');
  const radioButtons = document.getElementsByName("distributionMethod");
  const notDistribute = document.getElementById('notDistribute');
  const distributed = document.getElementById('distributed');

  classSelectDiv.hidden = true;
  studentSelectDiv.hidden = true;
  if(status === "UD"){
    notDistribute.hidden = false;

  }else{
    notDistribute.hidden = true;
  }
  
  if(status === "D"){
    const progressOfReadReplySlip = document.getElementById('progressOfReadReplySlip');
    const progressOfSubmitReplySlip = document.getElementById('progressOfSubmitReplySlip');
    const progressBarOfRead = document.getElementById('progressBarOfRead');
    const progressBarOfSubmit = document.getElementById('progressBarOfSubmit');

    const submitFront = document.getElementById('submitFront');
    const readFront = document.getElementById('readFront');
    const submitEnd = document.getElementById('submitEnd');
    const readEnd = document.getElementById('readEnd');

    const data = await getNumStudentsWithReplySlip(id);

    const numberOfReplySlipDistribution = data.numStudentsWithReplySlip;
    const numberOfReadReplySlip = data.numStudentsReadReplySlip;
    const numberOfSubmitReplySlip = data.numStudentsSubmittedReplySlip;

    const percentageOfReadReplySlip = Math.round((numberOfReadReplySlip/numberOfReplySlipDistribution)*100);
    const percentageOfSubmitReplySlip = Math.round((numberOfSubmitReplySlip/numberOfReplySlipDistribution)*100);

    progressOfReadReplySlip.setAttribute('aria-valuenow', numberOfReadReplySlip);
    progressOfReadReplySlip.setAttribute('aria-valuemax', numberOfReplySlipDistribution);
  
    progressOfSubmitReplySlip.setAttribute('aria-valuenow', numberOfSubmitReplySlip);
    progressOfSubmitReplySlip.setAttribute('aria-valuemax', numberOfReplySlipDistribution);

    progressBarOfRead.style.width = percentageOfReadReplySlip + '%';
    progressBarOfSubmit.style.width = percentageOfSubmitReplySlip + '%';

    submitFront.textContent = numberOfSubmitReplySlip;
    readFront.textContent = numberOfReadReplySlip;
    submitEnd.textContent = numberOfReplySlipDistribution;
    readEnd.textContent = numberOfReplySlipDistribution;
    distributed.hidden = false;
    table2.clear().draw();
    table3.clear().draw();
    
    data.peopleGotReplySlip.forEach(async function(obj) {
      await putDataToTable(obj);
    });
   

  }else{
    distributed.hidden = true;
  }


  var classSelected= false;
  var studentSelected= false;

  let selectedValue;
  radioButtons.forEach(button => {
    button.onclick = function() {
      selectedValue = button.value;
      if(selectedValue === "selectClass"){
        classSelectDiv.hidden = false;
        SettingForClassSelector();
        document.querySelector('#class-select').reset();
        classSelected = true;
      }else{
        classSelected = false;
        classSelectDiv.hidden = true;
      }

      if(selectedValue === "selectStudent"){
        studentSelectDiv.hidden = false;
        SettingForStudentSelector();
        document.querySelector('#student-select').reset();
        studentSelected = true;
      }else{
        studentSelected = false;
        studentSelectDiv.hidden = true;
      }
    }
  });

  const distributeReplySlipButton = document.getElementById("distributeReplySlipButton");
  distributeReplySlipButton.onclick = function() {

    if (!selectedValue) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a distribution method'
      });
      return;
    }

    const CurrentUserUid = getCookie('LoginUid');
    const yearSelector = document.getElementById("yearSelector");
    const selectedYear = yearSelector.value;
    const data = {
      id: id,
      selectOption: selectedValue,
      yearSelect: selectedYear,
    }

    if(classSelected){
      classSelectedOptions  = document.querySelector('#class-select').getSelectedOptions();
      if (Array.from(classSelectedOptions).length < 1) {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please select at least one class option'
        });
        return;
      }

      data.classSelectedOptions = Array.from(classSelectedOptions).map(option => option.value);
    }

    if(studentSelected){
      studentSelectedOptions = document.querySelector('#student-select').getSelectedOptions();
      if (Array.from(studentSelectedOptions).length < 1) {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please select at least one student option'
        });
        return;
      }

      const studentSelectedArray = Array.from(studentSelectedOptions).map(option => {
        const [classId, studentId] = option.value.split("-");
        return { class: classId, studentID: studentId };
      });

      data.studentSelectedOptions = studentSelectedArray;
    }
  
    swal.fire({
      title: 'Are you sure?',
      text: "Do you want to distribute this reply slip?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, distribute!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    })
    .then((result) => {
      if (result.isConfirmed) {
        fetch(`${window.API_URL}/api/v1/replySlip/distributionReplySlip`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({data,CurrentUserUid})
        })
        .then(response => response.json())
        .then(data => {
          swal.fire({
              title: 'Success',
              text: data.message,
              icon: 'success'
          }).then(() => {
            // Refresh the table
            $('#distributeReplySlipModal').modal('hide'); // close the modal
            getReplySlip();
          });
        })
        .catch(error => {
          console.error(error);
          swal.fire({
              title: 'Error',
              text: data.message,
              icon: 'error'
            });
        });
      } else {
        //swal.fire("Reply slip not removed!");
      }
    });
  };
}



function resetEdit(){
    const titleTC = document.getElementById('titleTC');
    const titleEN = document.getElementById('titleEN');
    const contentTcColor = document.getElementById('contentTC_ifr');
    const contentENColor = document.getElementById('contentEN_ifr');
    const recipientTcColor = document.getElementById('recipientTC_ifr');
    const recipientENColor = document.getElementById('recipientEN_ifr');
    const tcTab = document.getElementById('tc-tab');
    const enTab = document.getElementById('en-tab');
    let payment = document.getElementById('paymentCheckbox');
    let paymentInput = document.getElementById('paymentInput');
    tcTab.innerHTML = "TC";
    tcTab.removeAttribute('title');
    enTab.innerHTML = "EN";
    enTab.removeAttribute('title');
    titleTC.style.border = '2px solid #1cc88a';
    titleEN.style.border = '2px solid #1cc88a';
    contentTcColor.style.border = '2px solid #1cc88a';
    recipientTcColor.style.border = '2px solid #1cc88a';
    contentENColor.style.border = '2px solid #1cc88a';
    recipientENColor.style.border = '2px solid #1cc88a';
    payment.checked = false;
    paymentInput.value = '';
    paymentInput.style.display = 'none';

}

function modalShow(mode,data){
    const addReplySlipButton = document.getElementById("addReplySlipButton");

    // Remove any existing event listeners
    addReplySlipButton.removeEventListener("click", addReplySlipToDB);
    addReplySlipButton.removeEventListener("click", editReplySlipToDB);

    if(mode === 'add'){
        console.log("add");
        initContent();
        checkTitle();
        addReplySlipButton.textContent = 'Add Reply Slip';
        addReplySlipButton.addEventListener("click", addReplySlipToDB);
    }else if (mode === 'view') {
        resetEdit();
        const contentTC = tinymce.get('contentTC');
        const recipientTC = tinymce.get('recipientTC');
        const contentEN = tinymce.get('contentEN');
        const recipientEN = tinymce.get('recipientEN');
        let payment = document.getElementById('paymentCheckbox');
        let paymentInput = document.getElementById('paymentInput');
        if (data.payment) {
          paymentInput.value =  data.paymentAmount;
          paymentInput.style.display = 'block';
        }
        payment.checked = data.payment;
        document.getElementById('titleTC').value = data.titleTC;
        document.getElementById('titleEN').value = data.titleEN;
        contentTC.setContent(data.mainContentTC);
        recipientTC.setContent(data.recipientContentTC);
        contentEN.setContent(data.mainContentEN);
        recipientEN.setContent(data.recipientContentEN);    
        addReplySlipButton.textContent = 'Edit Reply Slip';
        addReplySlipButton.disabled = false;
        addReplySlipButton.addEventListener('click', () => {
            editReplySlipToDB(data.id);
        });
    }
}

function editReplySlipToDB(dataID) {
    const CurrentUserUid = getCookie('LoginUid');
    const yearSelector = document.getElementById("yearSelector");
    const selectedYear = yearSelector.value;
    const titleTCValue = document.getElementById('titleTC').value.trim();
    const titleENValue = document.getElementById('titleEN').value.trim();
    const contentTC = tinymce.get('contentTC').getContent();
    const recipientTCValue = tinymce.get('recipientTC').getContent().trim();
    const contentEN = tinymce.get('contentEN').getContent();
    const recipientENValue = tinymce.get('recipientEN').getContent().trim();
    const paymentCheckbox = document.getElementById('paymentCheckbox');
    const paymentInput = document.getElementById('paymentInput');
    let payment = false;
    let paymentAmount = null;

    if (paymentCheckbox.checked) {
      payment = true;
      paymentAmount = paymentInput.value;
    }
    if (!selectedYear || !titleTCValue || !titleENValue || !contentTC || !recipientTCValue || !contentEN || !recipientENValue) {
      swal.fire({
        title: 'Error',
        text: 'Please fill in all fields',
        icon: 'error'
      });
      return;
    }

    const data = {
        yearSelect: selectedYear,
        titleTC: titleTCValue,
        titleEN: titleENValue,
        mainContentTC:contentTC,
        mainContentEN:contentEN,
        recipientContentTC:recipientTCValue,
        recipientContentEN:recipientENValue,
        payment:payment,
    };
    if (payment) {
      data.paymentAmount = paymentAmount;
    }
    console.log(data);
    
    swal.fire({
        title: 'Are you sure?',
        text: "Do you want to edit this reply slip?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, edit!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          fetch(`${window.API_URL}/api/v1/replySlip/editReplySlip`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({data,dataID,CurrentUserUid})
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            swal.fire({
                title: 'Success',
                text: data.message,
                icon: 'success'
            }).then(() => {
              $('#replySlipModal').modal('hide'); // close the modal
              getReplySlip();
              //showActivity(activityDate);
              ///fetchImages(selectedYear,photoDate,id);
            });
          })
          .catch(error => {
            console.error(error);
            swal.fire({
                title: 'Error',
                text: data.message,
                icon: 'error'
              });
          });
        } else {
          //swal.fire("Reply slip not edit!");
        }
      });
}


function initializeDataTable() {
    table = $('#replySlipTable').DataTable({
      columns: [
        { title: 'ID' },
        { title: 'Title' },
        { title: 'Creation Date'},
        { title: 'Status'},
        { title: 'Action'},
      ],
    });

    table2 = $('#numberOfStudentReadReplySlipTable').DataTable({
      columns: [
        { title: 'Class' },
        { title: 'Student Chinese Name'},
        { title: 'Student English Name'},
        { title: 'Status'},
        { title: 'Got Date'},
      ],
    });

    table3 = $('#numberOfStudentSubmitReplySlipTable').DataTable({
      columns: [
        { title: 'Class' },
        { title: 'Student Chinese Name'},
        { title: 'Student English Name'},
        { title: 'Status'},
        { title: 'Got Date'},
      ],
    });

}

function tinyInit(){
    tinymce.init({
        selector: '#contentTC',
        resize: false,
        setup:function(ed) {
            ed.on('change', checkContentTcTiny);
            ed.on('init', initContent)
        }
    });
  
    tinymce.init({
        selector: '#contentEN',
        resize: false,
        setup:function(ed) {
            ed.on('change', checkContentEnTiny);
            ed.on('init', initContent)
        }
    });

    tinymce.init({
        selector: '#recipientTC',
        resize: false,
       // plugins: 'lists checklist',
        //toolbar: 'numlist bullist checklist',
        setup:function(ed) {
            ed.on('change', checkRecipientContentTcTiny);
            ed.on('init', initContent)
        }
    });


    tinymce.init({
        selector: '#recipientEN',
        resize: false,
        //plugins: 'lists checklist',
       // toolbar: 'numlist bullist checklist',
        setup:function(ed) {
            ed.on('change', checkRecipientContentEnTiny);
            ed.on('init', initContent)
        }
    });
}

function setAddFormButton(){
    const addReplySlipFormButton = document.getElementById("addReplySlipButton");
    const titleTC = document.getElementById('titleTC');
    const titleEN = document.getElementById('titleEN');
    const titleTCValue = titleTC.value;
    const titleENValue = titleEN.value;
    const contentTC = tinymce.get('contentTC');
    const recipientTC = tinymce.get('recipientTC');
    const contentEN = tinymce.get('contentEN');
    const recipientEN = tinymce.get('recipientEN');
    const contentTCValue = contentTC.getContent();
    const recipientTCValue = recipientTC.getContent();
    const contentENValue = contentEN.getContent();
    const recipientENValue = recipientEN.getContent();

    if (titleTCValue.trim() === '' || contentTCValue.trim() === '' || recipientTCValue.trim() === '' || titleENValue.trim() === '' || contentENValue.trim() === '' || recipientENValue.trim() === '') {
        addReplySlipFormButton.disabled = true;
    } else {
        addReplySlipFormButton.disabled = false;
    }

}

function togglePaymentInput() {
  const paymentInput = document.getElementById('paymentInput');
  if (paymentInput.style.display === 'none') {
    paymentInput.style.display = 'block';
  } else {
    paymentInput.style.display = 'none';
  }
}

function initContent(){
    const addReplySlipFormButton = document.getElementById("addReplySlipButton");
    const contentTC = tinymce.get('contentTC');
    const recipientTC = tinymce.get('recipientTC');
    const contentEN = tinymce.get('contentEN');
    const recipientEN = tinymce.get('recipientEN');
    const contentTcColor = document.getElementById('contentTC_ifr');
    const contentENColor = document.getElementById('contentEN_ifr');
    const recipientTcColor = document.getElementById('recipientTC_ifr');
    const recipientENColor = document.getElementById('recipientEN_ifr');
    const payment = document.getElementById('paymentCheckbox');
    const paymentInput = document.getElementById('paymentInput');
    contentTC.setContent('');
    recipientTC.setContent('');
    contentEN.setContent('');
    recipientEN.setContent('');
    payment.checked = false;
    paymentInput.value = '';
    paymentInput.style.display = 'none';
    contentTcColor.style.border = '2px solid #f14668';
    recipientTcColor.style.border = '2px solid #f14668';
    contentENColor.style.border = '2px solid #f14668';
    recipientENColor.style.border = '2px solid #f14668';
    addReplySlipFormButton.disabled = true;
}




function checkContentTcTiny(){
    const exclamationIcon = "<i class='fas fa-exclamation-circle' style='font-size:18px;color:#f14668'></i>";
    const tcTab = document.getElementById('tc-tab');
    const titleTC = document.getElementById('titleTC');
    const titleTCValue = titleTC.value;
    const contentTC = tinymce.get('contentTC');
    const contentTCValue = contentTC.getContent();
    const contentTcColor = document.getElementById('contentTC_ifr');
    const recipientTC = tinymce.get('recipientTC');
    const recipientTCValue = recipientTC.getContent();
    if(contentTCValue.trim() === ''){
        contentTcColor.style.border = '2px solid #f14668';
    }else{
        contentTcColor.style.border = '2px solid #1cc88a';
    }

    if (titleTCValue.trim() === '' || contentTCValue.trim() === '' || recipientTCValue.trim() === '') {
        tcTab.innerHTML = "TC " + exclamationIcon;
        tcTab.setAttribute('title', 'Please fill in all fields');
    } else {
        tcTab.innerHTML = "TC";
        tcTab.removeAttribute('title');
    }

    setAddFormButton();
}

function checkRecipientContentTcTiny(){
    const exclamationIcon = "<i class='fas fa-exclamation-circle' style='font-size:18px;color:#f14668'></i>";
    const tcTab = document.getElementById('tc-tab');
    const titleTC = document.getElementById('titleTC');
    const titleTCValue = titleTC.value;
    const contentTC = tinymce.get('contentTC');
    const contentTCValue = contentTC.getContent();
    const recipientTC = tinymce.get('recipientTC');
    const recipientTCValue = recipientTC.getContent();
    const recipientTcColor = document.getElementById('recipientTC_ifr');

    if(recipientTCValue.trim() === ''){
        recipientTcColor.style.border = '2px solid #f14668';
    }else{
        recipientTcColor.style.border = '2px solid #1cc88a';
    }

    if (titleTCValue.trim() === '' || contentTCValue.trim() === '' || recipientTCValue.trim() === '') {
        tcTab.innerHTML = "TC " + exclamationIcon;
        tcTab.setAttribute('title', 'Please fill in all fields');
    } else {
        tcTab.innerHTML = "TC";
        tcTab.removeAttribute('title');
    }

    setAddFormButton();
}

function checkContentEnTiny(){
    const exclamationIcon = "<i class='fas fa-exclamation-circle' style='font-size:18px;color:#f14668'></i>";
    const enTab = document.getElementById('en-tab');
    const titleEN = document.getElementById('titleEN');
    const titleENValue = titleEN.value;
    const contentEN = tinymce.get('contentEN');
    const contentENValue = contentEN.getContent();
    const contentENColor = document.getElementById('contentEN_ifr');
    const recipientEN = tinymce.get('recipientEN');
    const recipientENValue = recipientEN.getContent();
    if(contentENValue.trim() === ''){
        contentENColor.style.border = '2px solid #f14668';
    }else{
        contentENColor.style.border = '2px solid #1cc88a';
    }

    if (titleENValue.trim() === '' || contentENValue.trim() === '' || recipientENValue.trim() === '') {
        enTab.innerHTML = "EN " + exclamationIcon;
        enTab.setAttribute('title', 'Please fill in all fields');
    } else {
        enTab.innerHTML = "EN";
        enTab.removeAttribute('title');
    }

    setAddFormButton();
    
}

function checkRecipientContentEnTiny(){
    const exclamationIcon = "<i class='fas fa-exclamation-circle' style='font-size:18px;color:#f14668'></i>";
    const enTab = document.getElementById('en-tab');
    const titleEN = document.getElementById('titleEN');
    const titleENValue = titleEN.value;
    const contentEN = tinymce.get('contentEN');
    const contentENValue = contentEN.getContent();
    const recipientENColor = document.getElementById('recipientEN_ifr');
    const recipientEN = tinymce.get('recipientEN');
    const recipientENValue = recipientEN.getContent();

    if(recipientENValue.trim() === ''){
        recipientENColor.style.border = '2px solid #f14668';
    }else{
        recipientENColor.style.border = '2px solid #1cc88a';
    }

    if (titleENValue.trim() === '' || contentENValue.trim() === '' || recipientENValue.trim() === '') {
        enTab.innerHTML = "EN " + exclamationIcon;
        enTab.setAttribute('title', 'Please fill in all fields');
    } else {
        enTab.innerHTML = "EN";
        enTab.removeAttribute('title');
    }

    setAddFormButton();
    
}


function checkTitle(){
    const titleTC = document.getElementById('titleTC');
    const titleEN = document.getElementById('titleEN');

    const exclamationIcon = "<i class='fas fa-exclamation-circle' style='font-size:18px;color:#f14668'></i>";

    function checkFormFields(){
        const tcTab = document.getElementById('tc-tab');
        const enTab = document.getElementById('en-tab');
        const titleTCValue = titleTC.value;
        const titleENValue = titleEN.value;
        const contentTC = tinymce.get('contentTC');
        const recipientTC = tinymce.get('recipientTC');
        const contentEN = tinymce.get('contentEN');
        const recipientEN = tinymce.get('recipientEN');
        const contentTCValue = contentTC.getContent();
        const recipientTCValue = recipientTC.getContent();
        const contentENValue = contentEN.getContent();
        const recipientENValue = recipientEN.getContent();
    
        if(titleTCValue.trim() === ''){
            titleTC.style.border = '2px solid #f14668';
        }else{
            titleTC.style.border = '2px solid #1cc88a';
        }

        if(titleENValue.trim() === ''){
            titleEN.style.border = '2px solid #f14668';
        }else{
            titleEN.style.border = '2px solid #1cc88a';
        }

        if (titleTCValue.trim() === '' || contentTCValue.trim() === '' || recipientTCValue.trim() === '') {
            tcTab.innerHTML = "TC " + exclamationIcon;
            tcTab.setAttribute('title', 'Please fill in all fields');
        } else {
            tcTab.innerHTML = "TC";
            tcTab.removeAttribute('title');
        }

        if (titleENValue.trim() === '' || contentENValue.trim() === '' || recipientENValue.trim() === '') {
            enTab.innerHTML = "EN " + exclamationIcon;
            enTab.setAttribute('title', 'Please fill in all fields');
        } else {
            enTab.innerHTML = "EN";
            enTab.removeAttribute('title');
        }
        setAddFormButton();
    };

    titleTC.addEventListener('change', checkFormFields);
    titleEN.addEventListener('change', checkFormFields);

    checkFormFields();
}

function resetReplySlipData(){
    const titleTC = document.getElementById('titleTC');
    const titleEN = document.getElementById('titleEN');
    const contentTC = tinymce.get('contentTC');
    const recipientTC = tinymce.get('recipientTC');
    const contentEN = tinymce.get('contentEN');
    const recipientEN = tinymce.get('recipientEN');

    contentTC.setContent('');
    recipientTC.setContent('');
    contentEN.setContent('');
    recipientEN.setContent('');
    titleTC.value = '';
    titleEN.value = '';
}


function addReplySlipToDB() {
    const CurrentUserUid = getCookie('LoginUid');
    const yearSelector = document.getElementById("yearSelector");
    const selectedYear = yearSelector.value;
    const titleTCValue = document.getElementById('titleTC').value.trim();
    const titleENValue = document.getElementById('titleEN').value.trim();
    const contentTC = tinymce.get('contentTC').getContent();
    const recipientTCValue = tinymce.get('recipientTC').getContent().trim();
    const contentEN = tinymce.get('contentEN').getContent();
    const recipientENValue = tinymce.get('recipientEN').getContent().trim();
    const paymentCheckbox = document.getElementById('paymentCheckbox');
    const paymentInput = document.getElementById('paymentInput');
    let payment = false;
    let paymentAmount = null;

    if (paymentCheckbox.checked) {
      payment = true;
      paymentAmount = paymentInput.value;
    }

    if (!selectedYear || !titleTCValue || !titleENValue || !contentTC || !recipientTCValue || !contentEN || !recipientENValue) {
        swal.fire({
          title: 'Error',
          text: 'Please fill in all fields',
          icon: 'error'
        });
        return;
      }

    const data = {
        yearSelect: selectedYear,
        titleTC: titleTCValue,
        titleEN: titleENValue,
        mainContentTC:contentTC,
        mainContentEN:contentEN,
        recipientContentTC:recipientTCValue,
        recipientContentEN:recipientENValue,
        payment:payment,
    };

    if (payment) {
      data.paymentAmount = paymentAmount;
    }
    console.log(data);

    swal.fire({
        title: 'Are you sure?',
        text: "Do you want to add this reply slip?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, add!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          fetch(`${window.API_URL}/api/v1/replySlip/addReplySlip`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({data,CurrentUserUid})
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            swal.fire({
                title: 'Success',
                text: data.message,
                icon: 'success'
            }).then(() => {
              $('#replySlipModal').modal('hide'); // close the modal
              getReplySlip();
            });
          })
          .catch(error => {
            console.error(error);
            swal.fire({
                title: 'Error',
                text: data.message,
                icon: 'error'
              });
          });
        } else {
          //swal.fire("Reply slip not added!");
        }
      });
}



async function getAllClassAndStudentData(){
  const yearSelector = document.getElementById("yearSelector");
  const selectedYear = yearSelector.value;
  try {
    const response = await fetch(`${window.API_URL}/api/v1/replySlip/getAllClassAndStudent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ year: selectedYear })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      return;
    }
    const options = [];
    const data = await response.json();

    //return response;
    data.forEach(item => {
      options.push({ label: item.class, options: item.students.map(student => ({ label: student.studentChiName+" ("+student.studentId+")", value: item.class+"-"+student.studentId })) });
    });

    return options;
  } catch (error) {
    console.error(error);
  }
}

async function getAllClassData(){
  const yearSelector = document.getElementById("yearSelector");
  const selectedYear = yearSelector.value;
  try {
    const response = await fetch(`${window.API_URL}/api/v1/replySlip/getAllClass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ year: selectedYear })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      return;
    }

    const options =  [];
    const data = await response.json();
    data.forEach(item => {
      options.push({ label: item.id, value: item.id });
    });


    return options;
    
  } catch (error) {
    console.error(error);
  }
}

async function getNumStudentsWithReplySlip(id){
  const yearSelector = document.getElementById("yearSelector");
  const selectedYear = yearSelector.value;
  try {
    const response = await fetch(`${window.API_URL}/api/v1/replySlip/getNumStudentsWithReplySlip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ year: selectedYear, replySlipId:id })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      return;
    }

    const data = await response.json();
    // data.forEach(item => {
    //   options.push({ label: item.id, value: item.id });
    // });
    return data;

    // return options;
    
  } catch (error) {
    console.error(error);
  }
}