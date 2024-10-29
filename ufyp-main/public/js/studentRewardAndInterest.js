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
let table2;
let rewardTable;
let activityTable;
let studentOptions;
let studentInterestClassOptions;
let interestClassGroup;
var rewardArray = [];
var interestArray = [];

function initializeDataTable() {
  table = $("#studentRewardTable").DataTable({
    initComplete: function () {
      var button = $("<button>")
        .addClass("btn btn-success btn-circle applyRewardBtn")
        .attr("title", "Apply Reward")
        .attr("data-toggle", "tooltip")
        .attr("data-placement", "top")
        .on("click", function () {
          clearAddReward();
          applyRewardToStudentSetting();
        })
        .append($("<i>").addClass("fa fa-plus"));

      $("#studentRewardTable_filter").before(button);
    },
    columns: [
      { title: "Student ID" },
      { title: "Class" },
      { title: "Chinese Name" },
      { title: "English Name" },
      { title: "Action" },
    ],
  });

  table2 = $("#studentActivityTable").DataTable({
    initComplete: function () {
      var button = $("<button>")
        .addClass("btn btn-success btn-circle applyStudentActivityBtn")
        .attr("title", "Apply Activity")
        .attr("data-toggle", "tooltip")
        .attr("data-placement", "top")
        .on("click", function () {
          clearAddInterestClass();
          applyInterestClassToStudentSetting();
        })
        .append($("<i>").addClass("fa fa-plus"));

      $("#studentActivityTable_filter").before(button);
    },
    columns: [
      { title: "Student ID" },
      { title: "Class" },
      { title: "Chinese Name" },
      { title: "English Name" },
      { title: "Action" },
    ],
  });

}


async function populateYearSelector() {
  const yearSelector = document.getElementById("academicYearSelect");
  const tabBar = document.getElementById("tabBar");
  const myTabContent = document.getElementById("myTabContent");
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
        myTabContent.style.display = "none";
        tabBar.style.display = "none";
      } else {
        tabBar.style.display = "flex";
        myTabContent.style.display = "block";

        await fetchRewardStudentData();
        await fetchInterestClassStudentData();
        studentOptions = await getAllClassAndStudentRewardData();
        studentInterestClassOptions = await getAllClassAndStudentInterestClassData();
        interestClassGroup = await getAllInterestClassGroup();
        document.querySelector("#student-select").setOptions(studentOptions);
        document.querySelector("#student-interestClass-select").setOptions(studentInterestClassOptions);
      }

    });
  } catch (error) {
    console.error(error);
  }
}

async function getAllClassAndStudentRewardData() {
  const yearSelector = document.getElementById("academicYearSelect");
  const selectedYear = yearSelector.value;
  try {
    const response = await fetch(
      `${window.API_URL}/api/v1/studentSetting/getAllClassAndStudent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year: selectedYear }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      return;
    }
    const options = [];
    const data = await response.json();

    //return response;
    data.forEach((item) => {
      options.push({
        label: item.class,
        options: item.students.map((student) => ({
          label: student.studentChiName + " (" + student.studentId + ")",
          value: item.class + "-" + student.studentId,
        })),
      });
    });

    return options;
  } catch (error) {
    console.error(error);
  }
}

async function getAllClassAndStudentInterestClassData() {
    const yearSelector = document.getElementById("academicYearSelect");
    const selectedYear = yearSelector.value;
    try {
      const response = await fetch(
        `${window.API_URL}/api/v1/interestClass/getAllClassAndStudentInterest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ year: selectedYear }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        return;
      }
      const options = [];
      const data = await response.json();
  
      //return response;
      data.forEach((item) => {
        options.push({
          label: item.class,
          options: item.students.map((student) => ({
            label: student.studentChiName + " (" + student.studentId + ")",
            value: item.class + "-" + student.studentId,
          })),
        });
      });
  
      return options;
    } catch (error) {
      console.error(error);
    }
}

async function getAllInterestClassGroup() {
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
    const options = [];
    const data = await response.json();
    //return response;
    data.forEach((item) => {

      if(item.status === "A"){
        options.push({
          label: item.titleEN + " (" + item.titleTC + ")",
          value: item.id,
        });
      }
    });

    return options;
  } catch (error) {
    console.error(error);
    return [];
  }
}


function SettingForStudentRewardSelector() {
  VirtualSelect.init({
    ele: "#student-select",
    search: true,
    showValueAsTags: true,
    required: true,
    popupDropboxBreakpoint: "3000px",
    searchGroup: true,
  });

  VirtualSelect.init({
    ele: "#student-interestClass-select",
    search: true,
    showValueAsTags: true,
    required: true,
    popupDropboxBreakpoint: "3000px",
    searchGroup: true,
  });
}


function applyRewardToStudentSetting() {
    $("#applyRewardToStudentModal").modal("show");
    const applyRewardToStudentButton = document.getElementById(
      "applyRewardToStudentButton"
    );
    applyRewardToStudentButton.onclick = null;
    applyRewardToStudentButton.onclick = function () {
      applyRewardToStudent();
    };
}

function applyInterestClassToStudentSetting() {
    $("#applyActivityToStudentModal").modal("show");
    const applyInterestClassToStudentButton = document.getElementById(
      "applyActivityToStudentButton"
    );
    applyInterestClassToStudentButton.onclick = null;
    applyInterestClassToStudentButton.onclick = function () {
      applyInterestClassToStudent();
    };
}

function clearAddReward() {
  document.querySelector("#student-select").reset();
  document.getElementById("studentSelectDiv").style.display = "block";
  var table = document.getElementById("rewardItemTable");
  rewardArray = [];
  table.innerHTML = "";
}

function clearAddInterestClass() {
    document.querySelector("#student-interestClass-select").reset();
    document.getElementById("studentInterestClassDiv").style.display = "block";
    var table = document.getElementById("interestClassItemTable");
    interestArray = [];
    table.innerHTML = "";
}

function addInterestClassItem() {
  let table = document.getElementById("interestClassItemTable");
  let row = table.insertRow(-1);
  let interestClassNameCell = row.insertCell(0);
  let actionCell = row.insertCell(1);

  let interestClassName = document.createElement("div");
  interestClassName.classList.add("input-group", "interclassSelector");

  let selectElement = document.createElement("select");
  selectElement.classList.add("form-control", "checkInput");
  selectElement.setAttribute("aria-label", "Interest Class Name");
  selectElement.setAttribute("aria-describedby", "basic-addon1");

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an interest class";
  selectElement.appendChild(defaultOption);

  interestClassGroup.forEach((interestClass) => {
    let option = document.createElement("option");
    option.value = interestClass.value;
    option.textContent = interestClass.label;
    selectElement.appendChild(option);
  });

  interestClassName.appendChild(selectElement);

  interestClassName.addEventListener("change", function () {
    let input = interestClassName.querySelector("select");
    if (input.value === "") {
      input.style.borderColor = "#e74a3b";
    } else {
      input.style.borderColor = "#1cc88a";
    }
    let index = row.rowIndex - 1;
    interestArray[index].interestClassName =
      interestClassName.querySelector("select").value;
  });
  interestClassNameCell.appendChild(interestClassName);

  actionCell.innerHTML = `
    <button class="btn btn-circle btn-danger" title="Remove Interest Class" onclick="removeInterestClassItem(this)">
      <i class="fa fa-trash"></i>
    </button>
  `;

  interestArray.push({
    interestClassName: "",
  });
}

function removeInterestClassItem(button) {
    var row = button.parentNode.parentNode;
    var index = row.rowIndex - 1;
    interestArray.splice(index, 1);
    row.parentNode.removeChild(row);
}

function applyInterestClassToStudent() {
  const yearSelector = document.getElementById("academicYearSelect");
  const selectedYear = yearSelector.value;

  var studentSelectedOptions = document
    .querySelector("#student-interestClass-select")
    .getSelectedOptions();

  if (!studentSelectedOptions) {
    swal.fire({
      title: "Error",
      text: "Please select a student",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  if (interestArray.length > 0) {
    const interestSet = new Set();
    for (var i = 0; i < interestArray.length; i++) {
      if (interestArray[i].interestClassName === "") {
        swal.fire({
          title: "Error",
          text: "Some field is missing",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      if (interestSet.has(interestArray[i].interestClassName)) {
        swal.fire({
          title: "Error",
          text: "Duplicate interest class found",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      interestSet.add(interestArray[i].interestClassName);
    }
  } else {
    swal.fire({
      title: "Error",
      text: "No interest class available",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  const CurrentUserUid = getCookie("LoginUid");
  var selectedOptionValueParts = studentSelectedOptions.value.split("-");
  var studentClass = selectedOptionValueParts[0];
  var studentId = selectedOptionValueParts[1];
  const applyInterestClassData = {
    studentId: studentId,
    studentClass: studentClass,
    selectedYear: selectedYear,
    CurrentUserUid: CurrentUserUid,
  };

  
  swal.fire({
      title: "Are you sure?",
      text: "You are about to apply ineterest class to student. Are you sure you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, apply!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        fetch(`${window.API_URL}/api/v1/studentSetting/applyInterestClassToStudent`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ interestArray,applyInterestClassData }),
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
                    $('#applyActivityToStudentModal').modal('hide'); // close the modal
                    fetchInterestClassStudentData();
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


function addRewardItem() {
  var table = document.getElementById("rewardItemTable");
  var row = table.insertRow(-1);
  var imageCell = row.insertCell(0);
  var rewardNameTCCell = row.insertCell(1);
  var rewardNameENCell = row.insertCell(2);
  var actionCell = row.insertCell(3);

  var card = document.createElement("div");
  card.classList.add("card");
  card.style.width = "300px";
  card.style.height = "200px";

  var cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");

  var fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.classList.add("form-control-file");
  fileInput.addEventListener("change", function (event) {
    var index = row.rowIndex - 1;
    rewardArray[index].image = event.target.files[0];
    imagePreview.src = URL.createObjectURL(event.target.files[0]);
    imagePreview.style.display = "block";
  });

  cardHeader.appendChild(fileInput);
  card.appendChild(cardHeader);

  var cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  cardBody.classList.add("imageCard");

  cardBody.style.width = "300px";
  cardBody.style.height = "200px";

  var imagePreview = document.createElement("img");
  imagePreview.classList.add("img-fluid");
  imagePreview.style.width = "300px";
  imagePreview.style.height = "150px";
  imagePreview.style.maxHeight = "150px";
  imagePreview.style.maxWidth = "300px";
  imagePreview.style.display = "none";
  cardBody.appendChild(imagePreview);

  card.appendChild(cardBody);
  cardHeader.appendChild(fileInput);
  imageCell.appendChild(card);

  var rewardNameTCInput = document.createElement("div");
  rewardNameTCInput.classList.add("input-group");
  rewardNameTCInput.innerHTML = `
      <input type="text" class="form-control checkInput" placeholder="Reward Name (TC)" aria-label="Reward Name (TC)" aria-describedby="basic-addon1">
    `;

  rewardNameTCInput.addEventListener("input", function () {
    var input = rewardNameTCInput.querySelector("input");
    if (input.value === "") {
      input.style.borderColor = "#e74a3b";
    } else {
      input.style.borderColor = "#1cc88a";
    }
    var index = row.rowIndex - 1;
    rewardArray[index].rewardNameTC =
      rewardNameTCInput.querySelector("input").value;
  });
  rewardNameTCCell.appendChild(rewardNameTCInput);

  var rewardNameENInput = document.createElement("div");
  rewardNameENInput.classList.add("input-group");
  rewardNameENInput.innerHTML = `
      <input type="text" class="form-control checkInput" placeholder="Reward Name (EN)" aria-label="Reward Name (EN)" aria-describedby="basic-addon1">
    `;
  rewardNameENInput.addEventListener("input", function () {
    var input = rewardNameENInput.querySelector("input");
    var index = row.rowIndex - 1;
    rewardArray[index].rewardNameEN =
      rewardNameENInput.querySelector("input").value;
    if (input.value === "") {
      input.style.borderColor = "#e74a3b";
    } else {
      input.style.borderColor = "#1cc88a";
    }
  });
  rewardNameENCell.appendChild(rewardNameENInput);

  actionCell.innerHTML = `
      <button class="btn btn-circle btn-danger" title="Remove Reward" onclick="removeRewardItem(this)">
        <i class="fa fa-trash"></i>
      </button>
    `;

  rewardArray.push({
    rewardNameTC: "",
    rewardNameEN: "",
    image: "",
  });
}

function removeRewardItem(button) {
  var row = button.parentNode.parentNode;
  var index = row.rowIndex - 1;
  rewardArray.splice(index, 1);
  row.parentNode.removeChild(row);
}

function applyRewardToStudent() {
  const yearSelector = document.getElementById("academicYearSelect");
  const selectedYear = yearSelector.value;

  var studentSelectedOptions = document
    .querySelector("#student-select")
    .getSelectedOptions();

  if (!studentSelectedOptions) {
    swal.fire({
      title: "Error",
      text: "Please select a student",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }
  if (rewardArray.length > 0) {
    for (var i = 0; i < rewardArray.length; i++) {
      if (
        rewardArray[i].image === "" ||
        rewardArray[i].rewardNameEN === "" ||
        rewardArray[i].rewardNameTC === ""
      ) {
        swal.fire({
          title: "Error",
          text: "Some field is missing",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    }
  } else {
    swal.fire({
      title: "Error",
      text: "No rewards available",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }
  var data = new FormData();
  const CurrentUserUid = getCookie("LoginUid");
  var selectedOptionValueParts = studentSelectedOptions.value.split("-");
  var studentClass = selectedOptionValueParts[0];
  var studentId = selectedOptionValueParts[1];
  const filePath = `reward/${selectedYear}/${studentId}`;
  const applyRewardData = {
    studentId: studentId,
    studentClass: studentClass,
    selectedYear: selectedYear,
    filePath: filePath,
    CurrentUserUid: CurrentUserUid,
  };
  let temporyArray = [];

  data.append("applyRewardData", JSON.stringify(applyRewardData));
  for (let i = 0; i < rewardArray.length; i++) {
    const rewardData = rewardArray[i];
    const rewardDataKeys = Object.keys(rewardData);
    const rewardDataValues = Object.values(rewardData);
    for (let j = 0; j < rewardDataKeys.length; j++) {
      const key = rewardDataKeys[j];
      const value = rewardDataValues[j];
      if (key === "image") {
        data.append(`file`, value, value.name);
      }
    }
    temporyArray.push({
      rewardNameTC: rewardArray[i].rewardNameTC,
      rewardNameEN: rewardArray[i].rewardNameEN,
    });
  }
  data.append("rewardData", JSON.stringify(temporyArray));

  swal
    .fire({
      title: "Are you sure?",
      text: "You are about to apply reward to student. Are you sure you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, apply!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        fetch(`${window.API_URL}/api/v1/studentSetting/applyRewardToStudent`, {
          method: "POST",
          body: data,
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
                    $('#applyRewardToStudentModal').modal('hide'); // close the modal
                    fetchRewardStudentData();
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

async function fetchRewardStudentData() {
  const yearSelector = document.getElementById("academicYearSelect");
  const selectedYear = yearSelector.value;
  try {
    const response = await fetch(
      `${window.API_URL}/api/v1/studentSetting/getAllStudentReward`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year: selectedYear }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    response.json().then((data) => {
      table.clear().draw();
      data.forEach((data) => {
        var rowData = [
          data.studentId,
          data.classId,
          data.chineseName,
          data.englishName,
          `<button class="btn btn-success btn-circle btn-sm viewStudentRewardDetail" data-bs-toggle="modal" title="Edit" data-bs-target="#applyRewardToStudentModal" data-item='${JSON.stringify(
            data
          )}'><i class="fas fa-edit"></i></button>`,
        ];
        table.row.add(rowData).draw();
      });
      var editButtons = document.querySelectorAll(".viewStudentRewardDetail");
      if (editButtons) {
        editButtons.forEach((editButton) => {
          editButton.addEventListener("click", function () {
            const item = JSON.parse(this.dataset.item);
            editStudentRewardSetting(item);
          });
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
}


async function fetchInterestClassStudentData() {
  const yearSelector = document.getElementById("academicYearSelect");
  const selectedYear = yearSelector.value;
  try {
    const response = await fetch(
      `${window.API_URL}/api/v1/interestClass/getAllStudentInterestClass`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year: selectedYear }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    response.json().then((data) => {
      table2.clear().draw();
      data.forEach((data) => {
        var rowData = [
          data.studentId,
          data.classId,
          data.studentChiName,
          data.studentEngName,
          `<button class="btn btn-success btn-circle viewStudentInterestClassDetail" data-bs-toggle="modal" data-bs-target="#applyActivityToStudentModal" data-item='${JSON.stringify(data)}'><i class="fas fa-edit"></i></button>`,
        ];
        table2.row.add(rowData).draw();
      });

      var editButtons = document.querySelectorAll(".viewStudentInterestClassDetail");
      if (editButtons) {
        editButtons.forEach((editButton) => {
          editButton.addEventListener("click", function () {
            const item = JSON.parse(this.dataset.item);
            editStudentInterestClass(item);
          });
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function editStudentInterestClass(data) {
  const studentSelectorDiv = document.getElementById("studentInterestClassDiv");
  studentSelectorDiv.style.display = "none";
  interestArray = [];
  const applyActivityToStudentButton = document.getElementById(
    "applyActivityToStudentButton"
  );
  applyActivityToStudentButton.onclick = null;
  applyActivityToStudentButton.onclick = function () {
    editInterestClassToStudent(data);
  };
  showExistInterestClassItem(data.interestClass);
}

function editInterestClassToStudent(data) {
  const yearSelector = document.getElementById("academicYearSelect");
  const selectedYear = yearSelector.value;
  if (interestArray.length > 0) {
    const interestSet = new Set();
    for (var i = 0; i < interestArray.length; i++) {
      if (interestArray[i].interestClassName === "") {
        swal.fire({
          title: "Error",
          text: "Some field is missing",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      if (interestSet.has(interestArray[i].interestClassName)) {
        swal.fire({
          title: "Error",
          text: "Duplicate interest class found",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      interestSet.add(interestArray[i].interestClassName);
    }
  } else {
    swal.fire({
      title: "Error",
      text: "No interest class available",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  const CurrentUserUid = getCookie("LoginUid");
  const applyInterestClassData = {
    studentId: data.studentId,
    studentClass: data.classId,
    selectedYear: selectedYear,
    CurrentUserUid: CurrentUserUid,
  };

  
  swal.fire({
      title: "Are you sure?",
      text: "You are about to edit ineterest class to student. Are you sure you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, edit!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        fetch(`${window.API_URL}/api/v1/studentSetting/editInterestClassToStudent`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ interestArray,applyInterestClassData }),
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
                    $('#applyActivityToStudentModal').modal('hide'); // close the modal
                    fetchInterestClassStudentData();
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




function showExistInterestClassItem(data) {
  let table = document.getElementById("interestClassItemTable");
  table.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    let row = table.insertRow(-1);
    let interestClassNameCell = row.insertCell(0);
    let actionCell = row.insertCell(1);

    let interestClassName = document.createElement("div");
    interestClassName.classList.add("input-group", "interclassSelector");

    let selectElement = document.createElement("select");
    selectElement.classList.add("form-control", "existInput");
    selectElement.setAttribute("aria-label", "Interest Class Name");
    selectElement.setAttribute("aria-describedby", "basic-addon1");

    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select an interest class";
    selectElement.appendChild(defaultOption);

    interestClassGroup.forEach((interestClass) => {
      let option = document.createElement("option");
      option.value = interestClass.value;
      option.textContent = interestClass.label;
      if (interestClass.value === data[i].interestClassId) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    });

    interestClassName.appendChild(selectElement);

    interestClassName.addEventListener("change", function () {
      let input = interestClassName.querySelector("select");
      if (input.value === "") {
        input.style.borderColor = "#e74a3b";
      } else {
        input.style.borderColor = "#1cc88a";
      }
      let index = row.rowIndex - 1;
      interestArray[index].interestClassName =
        interestClassName.querySelector("select").value;
    });
    interestClassNameCell.appendChild(interestClassName);

    actionCell.innerHTML = `
      <button class="btn btn-circle btn-danger" title="Remove Interest Class" onclick="removeInterestClassItem(this)">
        <i class="fa fa-trash"></i>
      </button>
    `;

    interestArray.push({
      interestClassName: data[i].interestClassId,
    });
  }
}



async function editStudentRewardSetting(data) {
  const studentSelectorDiv = document.getElementById("studentSelectDiv");
  studentSelectorDiv.style.display = "none";
  rewardArray = [];
  const applyRewardToStudentButton = document.getElementById(
    "applyRewardToStudentButton"
  );
  applyRewardToStudentButton.onclick = null;
  applyRewardToStudentButton.onclick = function () {
    editStudentReward(data);
  };
  await showExistRewardItem(data.reward);
}

async function showExistRewardItem(rewardDataArray) {
  let table = document.getElementById("rewardItemTable");
  table.innerHTML = "";
  for (let i = 0; i < rewardDataArray.length; i++) {
    let rewardData = rewardDataArray[i];
    let row = table.insertRow(-1);
    let imageCell = row.insertCell(0);
    let rewardNameTCCell = row.insertCell(1);
    let rewardNameENCell = row.insertCell(2);
    let actionCell = row.insertCell(3);

    // Create the card element and add it to the image cell
    let card = document.createElement("div");
    card.classList.add("card");
    card.style.width = "300px";
    card.style.height = "200px";
    imageCell.appendChild(card);

    // Create the card header element and add it to the card
    let cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");
    card.appendChild(cardHeader);

    // Create the file input element and add it to the card header
    let testDiv = document.createElement('div');
    testDiv.classList.add('row');
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "fileInput"+i;
    fileInput.classList.add("form-control-file");
    let imageUrl = rewardData.imageUrl;
    let imageName = rewardData.imageName;
    let label = document.createElement("label");
    label.textContent = imageName;
    label.htmlFor = "fileInput"+i;


    fileInput.addEventListener("change", function (event) {
      let index = row.rowIndex - 1;
      rewardArray[index].image = event.target.files[0];
      imagePreview.src = URL.createObjectURL(event.target.files[0]);
      imagePreview.style.display = "block";
      const realPathArray = fileInput.value.split('\\');
      label.innerHTML = realPathArray[realPathArray.length - 1];
    });

    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        let file = new File([blob], imageName, { type: blob.type });
        rewardData.image = file;
      } catch (error) {
        console.error(error);
      }

  
    cardHeader.appendChild(fileInput);
    cardHeader.appendChild(label);
    // Create the card body element and add it to the card
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.classList.add("imageCard");
    cardBody.style.width = "300px";
    cardBody.style.height = "200px";
    card.appendChild(cardBody);

    // Create the image preview element and add it to the card body
    let imagePreview = document.createElement("img");
    imagePreview.classList.add("img-fluid");
    imagePreview.style.width = "300px";
    imagePreview.style.height = "150px";
    imagePreview.style.maxHeight = "150px";
    imagePreview.style.maxWidth = "300px";
    imagePreview.style.display = "none";
    cardBody.appendChild(imagePreview);

    // Set the image preview source if there is an image in the reward data
    if (rewardData.image) {
      imagePreview.src = URL.createObjectURL(rewardData.image);
      imagePreview.style.display = "block";
    }

    // Create the reward name (TC) input element and add it to the reward name (TC) cell
    // Add event listener to the reward name (TC) input element
    let rewardNameTCInput = document.createElement("div");
    rewardNameTCInput.classList.add("input-group");
    rewardNameTCInput.innerHTML = `
    <input type="text" class="form-control existInput" placeholder="Reward Name (TC)" aria-label="Reward Name (TC)" aria-describedby="basic-addon1">
    `;
    let rewardNameTCInputElement = rewardNameTCInput.querySelector("input");
    rewardNameTCInputElement.addEventListener("input", function () {
      let input = rewardNameTCInputElement;
      if (input.value === "") {
        input.style.borderColor = "#e74a3b";
      } else {
        input.style.borderColor = "#1cc88a";
      }
      let index = row.rowIndex - 1;
      rewardArray[index].rewardNameTC = input.value;
    });
    rewardNameTCCell.appendChild(rewardNameTCInput);

    // Set the reward name (TC) input value if there is a reward name (TC) in the reward data
    if (rewardData.rewardNameTC) {
      rewardNameTCInputElement.value = rewardData.rewardNameTC;
    }

    // Add event listener to the reward name (EN) input element
    let rewardNameENInput = document.createElement("div");
    rewardNameENInput.classList.add("input-group");
    rewardNameENInput.innerHTML = `
    <input type="text" class="form-control existInput" placeholder="Reward Name (EN)" aria-label="Reward Name (EN)" aria-describedby="basic-addon1">
    `;
    let rewardNameENInputElement = rewardNameENInput.querySelector("input");
    rewardNameENInputElement.addEventListener("input", function () {
      let input = rewardNameENInputElement;
      let index = row.rowIndex - 1;
      rewardArray[index].rewardNameEN = input.value;
      if (input.value === "") {
        input.style.borderColor = "#e74a3b";
      } else {
        input.style.borderColor = "#1cc88a";
      }
    });
    rewardNameENCell.appendChild(rewardNameENInput);

    // Set the reward name (EN) input value if there is a reward name (EN) in the reward data
    if (rewardData.rewardNameEN) {
      rewardNameENInputElement.value = rewardData.rewardNameEN;
    }

    actionCell.innerHTML = `
        <button class="btn btn-circle btn-danger" title="Remove Reward Hour" onclick="removeRewardItem(this)">
        <i class="fa fa-trash"></i>
        </button>
    `;
    rewardArray.push({
      image: rewardData.image,
      rewardNameEN: rewardData.rewardNameEN,
      rewardNameTC: rewardData.rewardNameTC,
    });
  }
}


function editStudentReward(data) {
    const yearSelector = document.getElementById("academicYearSelect");
    const selectedYear = yearSelector.value;
  
    if (rewardArray.length > 0) {
      for (var i = 0; i < rewardArray.length; i++) {
        if (
          rewardArray[i].image === "" ||
          rewardArray[i].rewardNameEN === "" ||
          rewardArray[i].rewardNameTC === ""
        ) {
          swal.fire({
            title: "Error",
            text: "Some field is missing",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }
      }
    } else {
      swal.fire({
        title: "Error",
        text: "No rewards available",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    var formdata = new FormData();
    const CurrentUserUid = getCookie("LoginUid");
    var studentClass = data.classId;
    var studentId = data.studentId;
    const filePath = `reward/${selectedYear}/${studentId}`;
    const applyRewardData = {
      studentId: studentId,
      studentClass: studentClass,
      selectedYear: selectedYear,
      filePath: filePath,
      CurrentUserUid: CurrentUserUid,
    };

    let temporyArray = [];
  
    formdata.append("applyRewardData", JSON.stringify(applyRewardData));
    for (let i = 0; i < rewardArray.length; i++) {
      const rewardData = rewardArray[i];
      const rewardDataKeys = Object.keys(rewardData);
      const rewardDataValues = Object.values(rewardData);
      for (let j = 0; j < rewardDataKeys.length; j++) {
        const key = rewardDataKeys[j];
        const value = rewardDataValues[j];
        if (key === "image") {
            formdata.append(`file`, value, value.name);
        }
      }
      temporyArray.push({
        rewardNameTC: rewardArray[i].rewardNameTC,
        rewardNameEN: rewardArray[i].rewardNameEN,
      });
    }
    formdata.append("rewardData", JSON.stringify(temporyArray));

    // for (const [key, value] of formdata.entries()) {
    //     console.log(key, value);
    // }

    swal
      .fire({
        title: "Are you sure?",
        text: "You are about to edit reward of this student. Are you sure you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, edit!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          fetch(`${window.API_URL}/api/v1/studentSetting/editStudentReward`, {
            method: "PUT",
            body: formdata,
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
                    $('#applyRewardToStudentModal').modal('hide'); // close the modal
                    fetchRewardStudentData();
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
  