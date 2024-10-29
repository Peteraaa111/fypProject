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
        const termSelectDiv = document.getElementById('termSelectorDiv');
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
  
            classYearDiv.style.display = selectedAcademicYear ? 'block' : 'none';
            
            selectedYearData.classes.forEach((className) => {
                const option = document.createElement('option');
                option.value = className.id;
                option.text = className.id;
                classSelect.appendChild(option);
            });

            classSelect.addEventListener('change', (event) => {
                termSelectDiv.style.display = "block";
            });
    
        });

      })
    .catch((error) => {
    console.error('Error fetching data:', error);
    });
}


function eventListenerSetting() {
    const termSelect = document.getElementById('termSelect');
    const classSelect = document.getElementById('classSelect');
    termSelect.addEventListener('change', searchExamRecord);
    classSelect.addEventListener('change', searchExamRecord);
}
let table;

function initializeDataTable() {
    table = $('#searchTable').DataTable({
      columns: [
        { title: 'Class Number', orderable: true },
        { title: 'Student Chinese Name', orderable: false },
        { title: 'Student English Name', orderable: false },
        { title: 'Student Number', orderable: false },
        { title: 'Chinese', orderable: false },
        { title: 'English', orderable: false },
        { title: 'Mathematics', orderable: false },
        { title: 'General studies', orderable: false },
      ],
      order: [0, 'asc']
    });
}




function searchExamRecord(){
    const yearSelector = document.getElementById("academicYearSelect");
    const classSelect = document.getElementById('classSelect');
    const termSelect = document.getElementById('termSelect');
    const classID = classSelect.value;
    const term = termSelect.value;
    const selectedYear = yearSelector.value;
    const recordTabDiv = document.getElementById('recordTabDiv');

    let data;
    
    if (term !=""&& selectedYear!="" && classID!="") {
        data = {
            selectedYear: selectedYear,
            selectedClassID: classID,
            selectedTerm: term,
        };

        fetch(`${window.API_URL}/api/v1/dataAnalysis/searchExamRecord`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data })
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
                    const studentGroup = {};
                    if (data.data.length > 0) {    
                        data.data.forEach(student => {    

                        const groupLabel = `${student.studentChiName} (${student.studentId})`;
                        if (groupLabel in studentGroup) {
                            studentGroup[groupLabel].push({ subject: 'chi', score: student.chi });
                            studentGroup[groupLabel].push({ subject: 'eng', score: student.eng });
                            studentGroup[groupLabel].push({ subject: 'math', score: student.math });
                            studentGroup[groupLabel].push({ subject: 'gs', score: student.gs });
                          } else {
                            studentGroup[groupLabel] = [
                              { subject: 'chi', score: student.chi },
                              { subject: 'eng', score: student.eng },
                              { subject: 'math', score: student.math },
                              { subject: 'gs', score: student.gs }
                            ];
                        }
                        var rowData = [
                            student.classNumber,
                            student.studentChiName,
                            student.studentEngName,
                            student.studentId,
                            student.chi,
                            student.eng,
                            student.math,
                            student.gs,
                        ];
                        table.row.add(rowData);
                        });
                        table.draw();
                        makeStudentExamRecord(studentGroup);

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
}


function makeStudentExamRecord(studentGroup) {
    const searchStudentExamRecordInfoDiv = document.getElementById('searchStudentExamRecordInfo');
    let highestScores = {};
    let totalHighestScore = { name: '', score: 0 };
    let subjectScores = { chi: [], eng: [], math: [], gs: [] };
    let totalScores = [];
    const subjectNames = { chi: 'Chinese', eng: 'English', math: 'Mathematics', gs: 'General Studies' };
  
    // Loop through each student in the studentGroup
    for (const student in studentGroup) {
      const studentName = student;
      const studentScores = studentGroup[student];
  
      // Loop through each score for the student
      for (const score of studentScores) {
        const subject = score.subject;
        const scoreValue = parseInt(score.score);
  
        // Check if the current score is the highest for the subject
        if (!highestScores[subject] || scoreValue > highestScores[subject].score) {
          highestScores[subject] = { name: studentName, score: scoreValue };
        }
  
        // Add the score to the subject's scores array and the total scores array
        subjectScores[subject].push(scoreValue);
        totalScores.push(scoreValue);
  
        // Check if the current student has the highest total score
        const totalScore = studentScores.reduce((total, score) => total + parseInt(score.score), 0);
        if (totalScore > totalHighestScore.score) {
          totalHighestScore = { name: studentName, score: totalScore };
        }
      }
    }
  

    let subjectMeans = {};
    for (const subject in subjectScores) {
      const scores = subjectScores[subject];
      const mean = scores.reduce((total, score) => total + score, 0) / scores.length;
      subjectMeans[subject] = mean;
    }
    const totalMean = totalScores.reduce((total, score) => total + score, 0) / totalScores.length;
  
    // Output the highest scores and mean scores for each subject in a table
    let output = '<table class="student-exam-record-table"><tr><th>Subject</th><th>Highest Score Student</th><th>Highest score</th><th>Mean score</th></tr>';
    let subjectStats = [];
    for (const subject in highestScores) {
      const highestScore = highestScores[subject];
      const mean = subjectMeans[subject];
      const subjectName = subjectNames[subject];
      output += `<tr><td>${subjectName}</td><td>${highestScore.name}</td><td>${highestScore.score}</td><td>${mean.toFixed(2)}</td></tr>`;
      subjectStats.push({ subject: subjectName, highestScore: highestScore.score, meanScore: mean.toFixed(2) });
    }
    output += `<tr><td>Total score student</td><td>${totalHighestScore.name}</td><td>${totalHighestScore.score}</td><td>${totalMean.toFixed(2)}</td></tr>`;

    searchStudentExamRecordInfoDiv.innerHTML = output;
    makeChart(subjectStats);
}


function makeChart(subjectStats){
    console.log(subjectStats);
    var ctx = document.getElementById("studentExamRecordHighestChart").getContext("2d");
    var ctx2 = document.getElementById("studentExamRecordMeanChart").getContext("2d");

    var highestChart = Chart.getChart(ctx);
    var meanChart = Chart.getChart(ctx2);
  
    if (highestChart) {
        highestChart.destroy();
    }
    if (meanChart) {
        meanChart.destroy();
    }
    const subjectNames = subjectStats.map(subject => subject.subject);
    const highestScores = subjectStats.map(subject => subject.highestScore);
    const meanScores = subjectStats.map(subject => subject.meanScore);

    // Create the highest score chart
    var highestData = {
        labels: subjectNames,
        datasets: [
            {
                label: "Highest Score",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: highestScores
            }
        ]
    };
    var highestOptions = {
        scales: {
            y: {
              beginAtZero: true
            }
        },
        animation: false,
        plugins: {
            legend: {
              onClick: null,
              position: 'right',
              
            },
        }
    };
    var highestChart = new Chart(ctx, {
        type: 'bar',
        data: highestData,
        options: highestOptions,
        plugins: [ChartDataLabels],
    });

    // Create the mean score chart
    var meanData = {
        labels: subjectNames,
        datasets: [
            {
                label: "Mean Score",
                backgroundColor: "rgba(54,162,235,0.2)",
                borderColor: "rgba(54,162,235,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(54,162,235,0.4)",
                hoverBorderColor: "rgba(54,162,235,1)",
                data: meanScores
            }
        ]
    };
    var meanOptions = {
        scales: {
            y: {
              beginAtZero: true
            }
        },
        animation: false,
        plugins: {
            legend: {
              onClick: null,
              position: 'right',
              padding: 20,
            },
        }
    };  
    var meanChart = new Chart(ctx2, {
        type: 'bar',
        data: meanData,
        options: meanOptions,
        plugins: [ChartDataLabels],
    });
}



function resetData(){
    const termSelect = document.getElementById('termSelect');
    termSelect.value = "";
}

