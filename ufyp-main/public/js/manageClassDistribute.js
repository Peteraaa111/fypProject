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

function fetchReady() {
    const yearSelect = document.getElementById('yearSelect');
    yearSelect.addEventListener('change', fetchData);
}

function fetchData() {
    const tableDiv = document.getElementById('studentTableDiv');
    const year = yearSelect.value;
    const autoDistributeClass = document.getElementById('autoDistributeClass');
  
    if (year) {
      fetch(`${window.API_URL}/api/v1/yearlyRank/getStudentRankByYear/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ year })
      })
        .then((response) => response.json())
        .then((data) => {
            tableDiv.style.display = "block";
            autoDistributeClass.style.display='flex';
            table.clear().draw();
            data.data.forEach((student) => {
                var rowData = [
                    student.rank,
                    student.classID,
                    student.studentID,
                    student.studentChiName,
                    student.studentEngName,
                    student.expectedClass,
                ];
                table.row.add(rowData).draw();
            });
            autoDistributeClass.addEventListener('click', distributeClass);

        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
}

let table;

function initializeDataTable() { 
    table = $('#studentTable').DataTable({
      columns: [
        { title: 'Rank' },
        { title: 'Current Class' },
        { title: 'Student ID' },
        { title: 'Student Chinese Name' },
        { title: 'Student English Name' },
        { title: 'Expected Class Next Year'}
      ],
      //columnDefs: [ { orderable: false, targets: [0,1,2,3,4,5,6,7] }],
      order: [[0, 'asc']], 
    });
}

function makeSelectOption() {
  const yearSelect = document.getElementById("yearSelect");

  const years = ["Select a year", "1", "2", "3", "4", "5", "6"];

  years.forEach((year, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = year;
    if (index === 0) {
      option.selected = true;
    }
    yearSelect.appendChild(option);
  });
}

function distributeClass(){
    const CurrentUserUid = getCookie('LoginUid');
    const data = [];
    table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
      var tableData = this.data();
      const rowObject = {
        studentID:tableData[2],
        studentChiName: tableData[3],
        studentEngName: tableData[4],
        expectedClassID: tableData[5],

      };
      data.push(rowObject);
    });
    swal.fire({
        title: "Are you sure?",
        text: "You are about to distribute next year class. Are you sure you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, distribute!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          fetch(`${window.API_URL}/api/v1/yearlyRank/distributeNextYearClass`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ CurrentUserUid,data }),
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
                      //fetchPartentData();
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