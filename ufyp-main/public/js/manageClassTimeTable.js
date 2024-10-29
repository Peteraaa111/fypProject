let table;
function setUpFunction(){
    // Define the lesson times
    const lessonTimes = [
        '08:30', '09:05', // First 2 lessons
        '09:55', '10:30', // After 15 min break
        '11:20', '11:55', // After 15 min break
        '13:30', '14:05', '14:40' // After 55 min lunch
    ];

    // Define the days of the week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const lessons = ['Chinese', 'English', 'Math', 'General Studies', 'Art', 'PE', 'Music', 'Computer'];
    // Get the table element
    const table = document.getElementById('timeTable');

    // Create the header row
    const headerRow = document.createElement('tr');

    const emptyTh = document.createElement('th');
    headerRow.appendChild(emptyTh);


    daysOfWeek.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Create the rows for each lesson time
    lessonTimes.forEach(time => {
        const row = document.createElement('tr');

        const timeCell = document.createElement('td');
        timeCell.textContent = time;
        row.appendChild(timeCell);

        daysOfWeek.forEach(day => {
            const td = document.createElement('td');
            const select = document.createElement('select');
            select.className = 'form-control form-control-sm'; // Add Bootstrap classes
            select.id = day + '-' + time;
            select.name = day + '-' + time;

            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select lesson';
            select.appendChild(defaultOption);
        
            // Add an option for each lesson
            lessons.forEach(lesson => {
                const option = document.createElement('option');
                option.value = lesson;
                option.textContent = lesson;
                select.appendChild(option);
            });
        
            td.appendChild(select);
            td.style.padding = '10px';
            row.appendChild(td);
        });

        table.appendChild(row);
    });
}

async function setUpModal(action, data) {

    $('#manageClassTimeTableModal').modal('show'); // close the modal

    // Get the modal title element
    const modalTitle = document.getElementById('manageClassTimeTableModalLabel');
    const classSelection = document.getElementById('classSelection');
    // Get the form element
    const form = document.getElementById('timeTableForm');

    if (action === 'add') {

        // If adding a new timetable, set up the modal for adding
        classSelection.style.display = 'block';
        modalTitle.textContent = 'Add Class Time Table';
        // Clear the form
        form.reset();
    } else {
        form.reset();
        // If editing an existing timetable, set up the modal for editing
        modalTitle.textContent = 'Edit Class Time Table';
        classSelection.value = data;
        classSelection.style.display = 'none';
        // Prefill the form with the existing timetable
        await fetchData(data);
        //prefillForm(form, data);
    }
}

function prefillForm(form, data) {
    // Assuming data is an object where the keys are input names and the values are input values
    for (let key in data) {
        const input = form.elements[key];
        if (input) {
            input.value = data[key];
        }
    }
}

function setTimeTable() {
    // Get the form element
    const form = document.getElementById('timeTableForm');
    const classSelection = document.getElementById('classSelection');
    const classID = classSelection.value;
    // Get all the select elements in the form
    const selects = form.querySelectorAll('select');

    // Create an object to store the data
    const data = {};

    // Loop over the select elements
    
    for (let i = 0; i < selects.length; i++) {
        const select = selects[i];

        // Split the select element's name into the day and the time
        const [day, time] = select.name.split('-');

        // If the select element's value is null or empty, show an error and return
        if (!select.value) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a lesson for ' + day + ' at ' + time,
            });
            return;
        }

        // If the day doesn't exist in the data object yet, add it
        if (!data[day]) {
            data[day] = {};
        }

        // Add the select element's value to the data object
        // The key is the time, and the value is the select element's value
        data[day][time] = select.value;
    }


    // Now you can do whatever you want with the data
    // For example, you could send it to a server

    // Show a confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${window.API_URL}/api/v1/class/addClassTimeTable`, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data,classID }),
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
                        $('#manageClassTimeTableModal').modal('hide'); // close the modal
                       // $('#interestClassModal').modal('hide'); // close the modal
                        //fetchData();
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
            // If the user confirmed, do whatever you want with the data
            // For example, you could send it to a server
            console.log(data);
            console.log(classID);
        }
    });
}

function initTable(){
    table = $("#classTimeTable").DataTable({
        columns: [
          { title: "Class"},
          { title: "Action"},
        ],
        //columnDefs: [ { orderable: false, targets: [0,1,3,4] }],
        order: [[0, "asc"]],
    });
}

async function fetchData(classID){
    try {
        const response = await fetch(`${window.API_URL}/api/v1/class/getClassTimeTable`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ classID: classID})
        });

        response.json().then((data) => {
            console.log(data);
            if(data.haveData){
                console.log('have');
                data.data.forEach(item => {
                    const day = item.day;
                    const times = item.times;
                    for (const time in times) {
                        const subject = times[time];
                        const inputId = `${day}-${time}`;
                        const inputElement = document.getElementById(inputId);
                        if (inputElement) {
                            inputElement.value = subject;
                        }
                    }
                });
            }else {
                console.log('no have');
  
            }

        });
      } catch (error) {
        console.error(error);
        return [];
      }
}

function addRowToTable() {
    // Define the classes
    const classes = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];

    // Loop over the classes
    classes.forEach(classItem => {
        // Define the row data
        const rowData = [
            classItem,
            `<button type="button" class="btn btn-primary btn-circle" onclick="setUpModal('edit','${classItem}')"><i class="fas fa-edit"></i></button>`
        ];

        // Add the row data to the table and redraw it
        table.row.add(rowData).draw();
    });
}