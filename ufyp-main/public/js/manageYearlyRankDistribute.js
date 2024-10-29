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


// getWholeYearClassGrade
function fetchReady() {
    const yearSelect = document.getElementById('yearSelect');
    yearSelect.addEventListener('change', fetchData);
}

function fetchData() {
    const tableDiv = document.getElementById('studentTableDiv');
    const year = yearSelect.value;
    const generateRankBtn = document.getElementById('generateRankBtn');
  
    if (year) {
      fetch(`${window.API_URL}/api/v1/class/getWholeYearClassGrade/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ year })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
            tableDiv.style.display = "block";
            generateRankBtn.style.display = 'flex';
            table.clear().draw();
            data.studentData.forEach((student) => {
              let score = 0;
              if (student.chi !== undefined) {
                score += parseInt(student.chi);
              }
              if (student.secondTermChi !== undefined) {
                score += parseInt(student.secondTermChi);
              }
              if (student.eng !== undefined) {
                score += parseInt(student.eng);
              }
              if (student.secondTermEng !== undefined) {
                score += parseInt(student.secondTermEng);
              }
              if (student.math !== undefined) {
                score += parseInt(student.math);
              }
              if (student.secondTermMath !== undefined) {
                score += parseInt(student.secondTermMath);
              }
              if (student.gs !== undefined) {
                score += parseInt(student.gs);
              }
              if (student.secondTermGs !== undefined) {
                score += parseInt(student.secondTermGs);
              }


              var rowData = [
                  student.classID,
                  student.studentId,
                  student.studentChiName,
                  student.studentEngName,
                  "First Term: " + (student.chi !== undefined ? student.chi : "not have marks yet") + "<br />Second Term: " + (student.secondTermChi !== undefined ? student.secondTermChi : "not have marks yet"),
                  "First Term: " + (student.eng !== undefined ? student.eng : "not have marks yet") + "<br />Second Term: " + (student.secondTermEng !== undefined ? student.secondTermEng : "not have marks yet"),
                  "First Term: " + (student.math !== undefined ? student.math : "not have marks yet") + "<br />Second Term: " + (student.secondTermMath !== undefined ? student.secondTermMath : "not have marks yet"),
                  "First Term: " + (student.gs !== undefined ? student.gs : "not have marks yet") + "<br />Second Term: " + (student.secondTermGs !== undefined ? student.secondTermGs : "not have marks yet"),
                  score,
              ];
              table.row.add(rowData).draw();
            });
            // Check if the event listener has already been added before adding it again
            
            generateRankBtn.addEventListener('click', generateRanking);
            
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
        { title: 'Class' },
        { title: 'Student ID' },
        { title: 'Student Chinese Name' },
        { title: 'Student English Name' },
        { title: 'Chinese' },
        { title: 'English' },
        { title: 'Mathematics' },
        { title: 'General studies' },
        { title: 'Total score'},
      ],
      columnDefs: [ { orderable: false, targets: [0,1,2,3,4,5,6,7] }],
      order: [[8, 'desc']], 
    });
}

function generateRanking(){
  const yearSelect = document.getElementById('yearSelect');
  const yearSelectValue = yearSelect.value;
  const CurrentUserUid = getCookie('LoginUid');
  const data = [];
  table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
    var tableData = this.data();
    const rowObject = {
      classID: tableData[0],
      studentID:tableData[1],
      studentChiName: tableData[2],
      studentEngName: tableData[3],
      totalScore: tableData[8],
    };
    data.push(rowObject);
  });

  // Sort the data array by totalMarks in descending order
  data.sort((a, b) => b.totalScore - a.totalScore);
  const dataLength = data.length;
  const halfLength = Math.ceil(dataLength / 2);
  let nextYear;
  if(yearSelectValue === "6"){
    nextYear = "graduate";
  }else{
    nextYear = parseInt(yearSelectValue)+1;
  }

  // Add a rank property to each object in the array
  data.forEach((student, index) => {
    student.rank = index + 1;
    if(yearSelectValue === "6"){
      student.expectedClass = nextYear;
    }else{
      student.expectedClass = index < halfLength ? `${nextYear}A` : `${nextYear}B`;
    }


  });

  swal.fire({
    title: "Are you sure?",
    text: "You are about to generate rank. Are you sure you want to proceed?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, generate!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
  })
  .then((result) => {
    if (result.isConfirmed) {
      fetch(`${window.API_URL}/api/v1/yearlyRank/generateRank`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CurrentUserUid,data,yearSelectValue }),
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