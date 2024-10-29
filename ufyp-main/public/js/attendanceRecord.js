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
        const dateSelectorDiv = document.getElementById('dateSelector');
        const selectMethod = document.getElementById("selectMethod");
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
          setDatePicker();
          // Clear previous options
          classSelect.innerHTML = '';

          const placeholderOption2 = document.createElement('option');
          placeholderOption2.value = '';
          placeholderOption2.text = 'Select an class';
          placeholderOption2.disabled = true;
          placeholderOption2.selected = true; // Set it as the selected option
          classSelect.appendChild(placeholderOption2);
  
          
        if (selectMethod.value !== "singleInput") {
            classYearDiv.style.display = selectedAcademicYear ? 'block' : 'none';
        
            selectedYearData.classes.forEach((className) => {
                const option = document.createElement('option');
                option.value = className.id;
                option.text = className.id;
                classSelect.appendChild(option);
            });
        }else{
           // dateSelectorDiv.style.display = 'block';
        }

        });

      })
    .catch((error) => {
    console.error('Error fetching data:', error);
    });
}

function setDatePicker(){
  const elem = document.getElementById('activityDate');
  const yearSelector = document.getElementById('academicYearSelect');
  const datepicker = elem.datepicker;
  if (datepicker) {
    datepicker.destroy();
  }
  const yearRange = yearSelector.value.split('-');

  const currentYear = yearRange[0];
  const nextYear = yearRange[1];
  const newDatepicker = new Datepicker(elem, {
    type: 'year', 
    format: {
      toValue(date) {
        const fullYearDate = date.replace(/\/(\d\d)$/, '/20$1');
        return Datepicker.parseDate(fullYearDate, 'mm/yyyy');
      },
      toDisplay(date) {
        return Datepicker.formatDate(date , 'yyyy-mm');
      },
    },
    pickLevel: 1,
    autohide: true,
    minDate: new Date(currentYear, 0),
    maxDate: new Date(nextYear, 11),
   
  }); 
}

function refresh(){
    const selectMethod = document.getElementById("selectMethod");
    const placeholderOption = document.createElement('option');
    const searchStudentId = document.getElementById('searchStudentId');
    searchStudentId.value = '';
    placeholderOption.value = '';
    placeholderOption.text = 'Select';
    placeholderOption.disabled = true;
    placeholderOption.selected = true; // Set it as the selected option
    selectMethod.appendChild(placeholderOption);

    const checkWholeClassOption = document.createElement('option');
    checkWholeClassOption.value = 'checkWholeClass';
    checkWholeClassOption.text = 'Check Whole Class';
    selectMethod.appendChild(checkWholeClassOption);
  
    const singleInputOption = document.createElement('option');
    singleInputOption.value = 'singleInput';
    singleInputOption.text = 'Single Input';
    selectMethod.appendChild(singleInputOption);
  
    const singleClassOption = document.createElement('option');
    singleClassOption.value = 'singleClass';
    singleClassOption.text = 'Single Class';
    selectMethod.appendChild(singleClassOption);
  

    selectMethod.selectedIndex = 0;

    const academicYearSelectDiv = document.getElementById('academicYearSelectDiv');
    const searchStudentIdDiv = document.getElementById('searchStudentIdDiv');
    const classStudentDiv = document.getElementById('classStudentDiv');
    const recordTabDiv = document.getElementById('recordTabDiv');
    const academicYearSelect = document.getElementById('academicYearSelect');
    const classSelect = document.getElementById('classSelect');
    const searchStudentIdInput = document.getElementById('searchStudentId');
    const dateSelectorDiv = document.getElementById('dateSelector');
    const dateSelect = document.getElementById('activityDate');
    const classSelectDiv = document.getElementById('classYearDiv');
    selectMethod.addEventListener('change', function() {
        if (selectMethod.value !== null && selectMethod.value !== "") {
            academicYearSelectDiv.style.display = 'block';  
            academicYearSelect.selectedIndex = 0;       
            //dateSelectorDiv.style.display = 'none';
            classSelectDiv.style.display = 'none';
            searchStudentIdDiv.style.display = 'none';
            recordTabDiv.style.display = 'none';
            searchStudentIdInput.value = '';

        } else {
            academicYearSelectDiv.style.display = 'none';
        }

        if(selectMethod.value === "singleInput"){
            classSelectDiv.style.display = 'none';
            searchStudentIdDiv.style.display = 'flex';
        }

        if(selectMethod.value === "singleClass"){
            academicYearSelect.addEventListener('change', fetchClassMateData);
            classSelect.addEventListener('change', fetchClassMateData);
        }else{
          academicYearSelect.removeEventListener('change', fetchClassMateData);
          classSelect.removeEventListener('change', fetchClassMateData);
          classStudentDiv.style.display = 'none';
        }

        if(selectMethod.value === "checkWholeClass"){
          //dateSelectorDiv.style.display = 'block';
        
          classSelect.addEventListener('change', searchAttendance);
          classSelect.addEventListener('change', showDateSelectDiv);
          dateSelect.addEventListener('changeDate', searchAttendance);
        }else{
          dateSelectorDiv.style.display = 'none';
          classSelect.removeEventListener('change', () => {
            dateSelectorDiv.style.display = 'block';
          });
          classSelect.removeEventListener('change', searchAttendance);
          classSelect.removeEventListener('change', showDateSelectDiv);
          dateSelect.removeEventListener('changeDate', searchAttendance);
        }


    });
}

function showDateSelectDiv(){
  const dateSelectorDiv = document.getElementById('dateSelector');
  dateSelectorDiv.style.display = 'block';
}


async function fetchClassMateData() {
  const year = academicYearSelect.value;
  const classID = classSelect.value;
  const classStudentDiv = document.getElementById('classStudentDiv');
  const classStudentSelect = document.getElementById('classStudentSelect');
  const placeholderOption = document.createElement('option');
  if (year && classID) {
    classStudentDiv.style.display = 'block';
    classStudentSelect.innerHTML = '';
    placeholderOption.value = '';
    placeholderOption.text = 'Select student';
    placeholderOption.disabled = true;
    placeholderOption.selected = true; // Set it as the selected option
    classStudentSelect.add(placeholderOption);
    fetch(`${window.API_URL}/api/v1/class/getClassmateByAcademicYearAndClass/${year}/${classID}`)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((student) => {
          const option = document.createElement('option');
          option.text = `${student.studentChiName} (${student.studentId})`;
          option.value = student.studentId;
          classStudentSelect.add(option);
        });

        classStudentSelect.addEventListener('change', searchAttendance);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
}





function searchAttendance(){
    const yearSelector = document.getElementById("academicYearSelect");
    const selectMethodSelector = document.getElementById("selectMethod"); 
    const classStudentSelect = document.getElementById('classStudentSelect');
    const classSelect = document.getElementById('classSelect');
    const classID = classSelect.value;
    
    const attendanceDateSelect = document.getElementById('activityDate')
    const searchStudentIdInput = document.getElementById('searchStudentId');
    const recordTabDiv = document.getElementById('recordTabDiv');


    const CurrentUserUid = getCookie('LoginUid');
    const selectedYear = yearSelector.value;
    const selectMethod = selectMethodSelector.value;

    const attendanceDate = attendanceDateSelect.value;
    const classStudentIdValue = classStudentSelect.value;
    const searchStudentId = searchStudentIdInput.value
    let data;
    if(selectMethod === "singleInput"){
      if (!selectMethod ||!selectedYear || !searchStudentId) {
      // if (!selectMethod ||!selectedYear || !attendanceDate || !searchStudentId) {
          swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Please enter all the required fields!'
          });
          return;
      }

      data = {
          selectedYear: selectedYear,
          selectMethod: selectMethod,
          searchStudentId: searchStudentId
      };
    }else if(selectMethod === "singleClass"){
      if (!selectMethod ||!selectedYear || !classStudentIdValue || !classID) {
            swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter all the required fields!'
            });
            return;
        }

        data = {
          selectedYear: selectedYear,
          selectMethod: selectMethod,
          classID: classID,
        // attendanceDate: attendanceDate,
          searchStudentId: classStudentIdValue
        };
    }else if(selectMethod === "checkWholeClass"){
      if (!selectMethod ||!selectedYear || !classID || !attendanceDate) {
        return;
      }
      data = {
        selectedYear: selectedYear,
        selectMethod: selectMethod,
        classID: classID,
        attendanceDate:attendanceDate,
      };

    }
        
       
    fetch(`${window.API_URL}/api/v1/dataAnalysis/searchAttendance`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ data,CurrentUserUid })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success){
                recordTabDiv.style.display = 'block';
                table.clear().draw();
                if (data.data.length > 0) {
                    const statusGroup = [];
                    const studentGroup = {};

                    data.data.forEach(student => {

                      if(selectMethod === "checkWholeClass"){

                        const groupLabel = `${student.studentChiName} (${student.studentNumber})`;
                        if (groupLabel in studentGroup) {
                          studentGroup[groupLabel].push(student.status);
                        } else {
                          studentGroup[groupLabel] = [student.status];
                        }
                      }else{
                        statusGroup.push(student.status);
                      }

                      var rowData = [
                        student.classNumber,
                        student.studentChiName,
                        student.studentEngName,
                        student.studentNumber,
                        student.attendanceDate,
                        student.status,
                        student.takeAttendanceTime,
                      ];
                      table.row.add(rowData);
                    });
                    table.draw();
                    if(selectMethod === "checkWholeClass"){
                      makeAttendanceTable(studentGroup,data.totalDay);
                    }else{
                      makeAttendanceInfoAndChart(statusGroup,data.totalDay);
                    }

                    console.log(studentGroup);
                }else {
                    table.clear().draw();
                }
            
            }else{
                table.clear().draw();
            }
        })
        .catch(error => {
        swal.fire({
            title: 'Error'+error,
            text: data.message,
            icon: 'error'
        });
    });
}



let table;

function initializeDataTable() {
    table = $('#searchTable').DataTable({
      columns: [
        { title: 'Class Number', orderable: false },
        { title: 'Student Chinese Name', orderable: false },
        { title: 'Student English Name', orderable: false },
        { title: 'Student Number', orderable: false },
        { title: 'Attendance Date', orderable: true },
        { title: 'Status', orderable: false },
        { title: 'Take Attendance Time', orderable: false },
      ],
      order: [4, 'asc']
    });
}


function makeAttendanceTable(studentGroup,totalDays) {
  const searchAttendanceInfoDiv = document.getElementById('searchAttendanceInfo');

  // Initialize counters for each type of attendance
  const presentCount = new Map();
  const sickCount = new Map();
  const lateCount = new Map();
  const absentCount = new Map();

  let totalPresent = 0;
  let totalSick = 0;
  let totalLate = 0;
  let totalAbsent = 0;

  // Iterate over each student's attendance record
  for (const [studentName, attendanceRecord] of Object.entries(studentGroup)) {
    let present = 0;
    let sick = 0;
    let late = 0;
    let absent = 0;

    // Count the number of each type of attendance
    for (const attendance of attendanceRecord) {
      switch (attendance) {
        case 'Present':
          present++;
          totalPresent++;
          break;
        case 'Sick':
          sick++;
          totalSick++;
          break;
        case 'Late':
          late++;
          totalLate++;
          break;
        case 'Absent':
          absent++;
          totalAbsent++;
          break;
      }
    }

    // Update the counters for each type of attendance
    presentCount.set(studentName, present);
    sickCount.set(studentName, sick);
    lateCount.set(studentName, late);
    absentCount.set(studentName, absent);
  }

  // Display the results using innerHTML
  const resultTable = document.createElement('table');
  resultTable.classList.add('whole-class-attendance-table');
  const headerRow = document.createElement('tr');
  const nameHeader = document.createElement('th');
  nameHeader.textContent = 'Name';
  headerRow.appendChild(nameHeader);
  const presentHeader = document.createElement('th');
  presentHeader.textContent = 'Present Days';
  headerRow.appendChild(presentHeader);
  const sickHeader = document.createElement('th');
  sickHeader.textContent = 'Sick Days';
  headerRow.appendChild(sickHeader);
  const lateHeader = document.createElement('th');
  lateHeader.textContent = 'Late Days';
  headerRow.appendChild(lateHeader);
  const absentHeader = document.createElement('th');
  absentHeader.textContent = 'Absent Days';
  headerRow.appendChild(absentHeader);
  resultTable.appendChild(headerRow);

  for (const [studentName, attendanceRecord] of Object.entries(studentGroup)) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = studentName;
    row.appendChild(nameCell);
    const presentCell = document.createElement('td');
    presentCell.textContent = presentCount.get(studentName) || 0;
    row.appendChild(presentCell);
    const sickCell = document.createElement('td');
    sickCell.textContent = sickCount.get(studentName) || 0;
    row.appendChild(sickCell);
    const lateCell = document.createElement('td');
    lateCell.textContent = lateCount.get(studentName) || 0;
    row.appendChild(lateCell);
    const absentCell = document.createElement('td');
    absentCell.textContent = absentCount.get(studentName) || 0;
    row.appendChild(absentCell);
    resultTable.appendChild(row);
  }

  searchAttendanceInfoDiv.innerHTML = `
  <p class="text-center totalDaySetting">Number of School Days: ${totalDays}</p>
  `;
  searchAttendanceInfoDiv.appendChild(resultTable);

  makeChart(totalPresent,totalLate,totalAbsent,totalSick);
}


function makeAttendanceInfoAndChart(statusGroup,totalDays){
  const searchAttendanceInfoDiv = document.getElementById('searchAttendanceInfo');
  var numberOfSick= 0;
  var numberOfPresent= 0;
  var numberOfAbsent= 0;
  var numberOfLate= 0;
  for (var i = 0; i < statusGroup.length; i++) {
    if (statusGroup[i] === 'Sick') {
      numberOfSick++;
    } else if (statusGroup[i] === 'Present') {
      numberOfPresent++;
    } else if (statusGroup[i] === 'Absent') {
      numberOfAbsent++;
    } else if (statusGroup[i] === 'Late') {
      numberOfLate++;
    }
  }
  searchAttendanceInfoDiv.innerHTML = `
    <p class="text-center">Number of School Days: ${totalDays}</p>
    <p class="px-2">Number of Present Days: ${numberOfPresent}</p>
    <p class="px-2">Number of Late Days: ${numberOfLate}</p>
    <p class="px-2">Number of Absent Days: ${numberOfAbsent}</p>
    <p class="px-2">Number of Sick Days: ${numberOfSick}</p>
  `;

  //var ctx = document.getElementById('attendanceChart');
  makeChart(numberOfPresent,numberOfLate,numberOfAbsent,numberOfSick);
}



function makeChart(numberOfPresent,numberOfLate,numberOfAbsent,numberOfSick){
  var ctx = document.getElementById("attendanceChart").getContext("2d");
  var myChart = Chart.getChart(ctx);

  if (myChart) {
    myChart.destroy();
  }

  var params = {
      display: function(context) {
        return context.dataset.data[context.dataIndex] !== 0; // or >= 1 or ...
      },
      borderWidth: 2,
      lineWidth: 2,
      padding: 3,
      textAlign: 'center',
      stretch: 45,
      font: {
        resizable: true,
        minSize: 12,
        maxSize: 18,
        family: Chart.defaults.font.family,
        size: Chart.defaults.font.size,
        style: Chart.defaults.font.style,
        lineHeight: Chart.defaults.font.lineHeight,
      },
      color: "black",
      valuePrecision: 1,
      percentPrecision: 2
    };
    var chartOption = {
      maintainAspectRatio: false,
      zoomOutPercentage: 20,
      responsive: true,
      animation: false,
      layout: {
        padding: {
          left:120,
          top: 90,
          bottom: 50,
        }
      },
      plugins: {
        outlabels: params,
        legend: {
          onClick: null,
          position: 'right',
          padding: 20,
        },
      }
    };

  
  myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Present', 'Late', 'Absent', 'Sick'],
      datasets: [{
        data: [numberOfPresent, numberOfLate, numberOfAbsent, numberOfSick],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    },
    plugins: [ChartOutLabels],
    options: chartOption,
  });
  myChart.draw();
}