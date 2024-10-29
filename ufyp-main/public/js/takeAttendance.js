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
          setDatePicker();
        });

        classSelect.addEventListener('change', () => {
          dateSelectorDiv.style.display = 'block';
        });

      })
    .catch((error) => {
    console.error('Error fetching data:', error);
    });
}

function setDatePicker(){
  const elem = document.getElementById('activityDate');
  const yearSelect = document.getElementById('academicYearSelect');
  const yearSelectValue = yearSelect.value;
  const years = yearSelectValue.split('-');
  const firstYear = years[0];
  const nextYear = years[1];

  const datepicker = elem.datepicker;
  if (datepicker) {
    datepicker.destroy();
  }
  //const currentYear = new Date().getFullYear();
  //const nextYear = currentYear + 1;
  const newDatepicker = new Datepicker(elem, {
    format: {
      toValue(date) {
        const fullYearDate = date.replace(/\/(\d\d)$/, '/20$1');
        return Datepicker.parseDate(fullYearDate, 'mm/dd/yyyy');
      },
      toDisplay(date) {
        return Datepicker.formatDate(date , 'yyyy-mm-dd');
      },
    },
    minDate: new Date(firstYear, 0, 1),
    maxDate: new Date(nextYear, 11, 31),
  }); 
}

let table;
let submitAttendanceBtn;

function fetchClassmate() {
  const academicYearSelect = document.getElementById('academicYearSelect');
  const classSelect = document.getElementById('classSelect');
  const attendanceDateSelect = document.getElementById('activityDate')

  academicYearSelect.addEventListener('change', fetchData);
  classSelect.addEventListener('change', fetchData);
  attendanceDateSelect.addEventListener('changeDate', fetchData); 
}


async function fetchData() {
  const attendanceDateSelect = document.getElementById('activityDate');
  const studentsTableDiv = document.getElementById('studentsTableDiv');
  const year = academicYearSelect.value;
  const classID = classSelect.value;
  const attendanceDate = attendanceDateSelect.value;

  if (year && classID && attendanceDate) {
    studentsTableDiv.style.display = 'block';
    submitAttendanceBtn.style.display = 'block';
    fetch(`${window.API_URL}/api/v1/class/getClassmateByAcademicYearAndClass/${year}/${classID}`)
      .then((response) => response.json())
      .then((data) => {
        table.clear().draw();
        data.forEach(async (student) => {
          const attendanceDateInfo = await getAttendanceDateInfo(student.classNumber);
          const selectOptions = ['Sick', 'Present', 'Absent', 'Late'];
          const selectValue = selectOptions.includes(attendanceDateInfo.data.status) ? attendanceDateInfo.data.status : 'NM';
          let status = attendanceDateInfo.data.status;
          let takeAttendanceTime = attendanceDateInfo.data.takeAttendanceTime;

          if (status === 'NM') {
            status = 'Pending';
          }
          
          if (takeAttendanceTime === 'NM') {
              takeAttendanceTime = 'Pending';
          }
          var rowData = [
            student.classNumber,
            student.studentChiName,
            student.studentEngName,
            student.studentId,
            status,
            takeAttendanceTime,
            `<select class="form-select form-select-sm" id="select" name="select">
            <option ${selectValue === 'Select' ? 'selected' : ''}>Select</option>
            <option value="Sick" ${selectValue === 'Sick' ? 'selected' : ''}>Sick</option>
            <option value="Present" ${selectValue === 'Present' ? 'selected' : ''}>Present</option>
            <option value="Absent" ${selectValue === 'Absent' ? 'selected' : ''}>Absent</option>
            <option value="Late" ${selectValue === 'Late' ? 'selected' : ''}>Late</option>
            </select>`,
          ];
          table.row.add(rowData).draw();
        });

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
}

function submitAttendance() {
  const attendanceDateSelect = document.getElementById('activityDate');
  const year = academicYearSelect.value;
  const classID = classSelect.value;
  const attendanceDate = attendanceDateSelect.value;
  const CurrentUserUid = getCookie('LoginUid');
  const data = [];
  table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
    var tableData = this.data();
    var selectedValue = $('select', this.node()).val();
    if(selectedValue!=='Select' && selectedValue!==tableData[4]){
      const rowObject = {
        classNumber: tableData[0],
        studentChiName: tableData[1],
        studentEngName: tableData[2],
        studentNumber: tableData[3],
        selectedValue: selectedValue,
      };
      data.push(rowObject);
    }
  });
  swal.fire({
    title: 'Are you sure?',
    text: 'You are about to submit the attendance data.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, submit it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      // Call your fetch() function here to submit the attendance data
      fetch(`${window.API_URL}/api/v1/class/submitAttendance`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data,year,classID,attendanceDate,CurrentUserUid })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        swal.fire({
          title: 'Success',
          text: data.message,
          icon: 'success'
        }).then(() => {
          fetchData();
        });
      })
      .catch(error => {
        swal.fire({
          title: 'Error',
          text: data.message,
          icon: 'error'
        });
      });
    }
  });
}


async function getAttendanceDateInfo(classNumber) {
  const attendanceDateSelect = document.getElementById('activityDate');
  const year = academicYearSelect.value;
  const classID = classSelect.value;
  const attendanceDate = attendanceDateSelect.value;
  try {
    const response = await fetch(`${window.API_URL}/api/v1/class/getAttendanceDateInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ classNumber,year,classID,attendanceDate })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      return;
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }

}





function initializeDataTable() { 
  submitAttendanceBtn = document.getElementById('submitAttendanceBtn')
  submitAttendanceBtn.addEventListener('click', submitAttendance);
  table = $('#studentsTable').DataTable({
    columns: [
      { title: 'Class Number' },
      { title: 'Student Chinese Name' },
      { title: 'Student English Name' },
      { title: 'Student ID' },
      { title: 'Status' },
      { title: 'Take Attendance Time' },
      { title: 'Action' },
    ],
    searching: false, 
    paging: false, 
    info: false,
    pageLength: 10,
    lengthMenu: [35],
    order: [[0, 'asc']],
  });
}