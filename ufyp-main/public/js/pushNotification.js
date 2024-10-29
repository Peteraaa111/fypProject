let table;
let deviceArray;

function initializeDataTable() {
    table = $('#notificationTable').DataTable({
      columns: [
        { title: 'ID' },
        { title: 'Title(EN)' },
        { title: 'Title(TC)' },
        { title: 'Action'},
      ],
    });
}

function addNewNotification() {
    const contentTC = document.getElementById('contentTC').value;
    const contentEN = document.getElementById('contentEN').value;
    const titleTC = document.getElementById('titleTC').value;
    const titleEN = document.getElementById('titleEN').value;

    if (!contentTC || !contentEN || !titleTC || !titleEN) {
        swal.fire({
            icon: 'error',
            title: 'Empty Field',
            text: 'All field must be filled out!',
        });
        return;
    }

    const data = {
        contentTC: contentTC,
        contentEN: contentEN,
        titleEN:titleEN,
        titleTC:titleTC,
    };



    Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to add a new notification. Are you sure you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, add it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
        fetch(`${window.API_URL}/api/v1/pushNotification/addNotification/`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success'
                }).then(() => {
                    $('#NotificationModal').modal('hide'); // close the modal
                    fetchData();
                    //fetchImages(selectedYear,photoDate,phoneActivityID);
                });
            }
        })
        .catch((error) => {
            swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        });
        }
    });
}
function fetchData() {
    fetch(`${window.API_URL}/api/v1/pushNotification/getAllNotification/`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        table.clear().draw();
        data.data.forEach((notification) => {
        const data = {
            id: notification.id,
            titleTC: notification.titleTC,
            titleEN: notification.titleEN,
            contentTC:notification.contentTC,
            contentEN:notification.contentEN,
        };
        var rowData = [
            notification.id,
            notification.titleEN,
            notification.titleTC,
            `<button class="btn btn-circle btn-success view-notification-button" style="margin-right:0.5rem" title="Edit" data-item='${JSON.stringify(notification)}'><i class="fa fa-edit"></i></button>`+ `<button class="btn btn-circle btn-info" title="Push Notification" onclick="showPushNotificationModal('${notification.id}')"><i class="fa fa-share" style="color:aliceblue"></i></button>`,
        ];
            table.row.add(rowData).draw();
        });
        var editButtons = document.querySelectorAll('.view-notification-button');
        if (editButtons) {
            editButtons.forEach((editButton) => {
                editButton.addEventListener('click', function() {
                const item = JSON.parse(this.dataset.item);
                    openModal('view',item);
                });
            });
        }
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
}



function openModal(action,data){
    const titleTC = document.getElementById('titleTC');
    const titleEN = document.getElementById('titleEN');
    const contentTC = document.getElementById('contentTC');
    const contentEN = document.getElementById('contentEN');
    const notificationModalButton = document.getElementById('notificationModalButton');
    if(action == "add"){
        $('#NotificationModal').modal('show');
        contentTC.value = '';
        contentEN.value = '';
        titleEN.value ='';
        titleTC.value ='';
        notificationModalButton.onclick = addNewNotification;
        notificationModalButton.textContent = 'Add Notification';
    }else if (action =="view"){
        $('#NotificationModal').modal('show');
        contentTC.value = data.contentTC;
        contentEN.value = data.contentEN;
        titleEN.value = data.titleEN;
        titleTC.value =data.titleTC;
        notificationModalButton.onclick = function() {
            editNotification(data.id);
        };
        notificationModalButton.textContent = 'Edit Notification';
        console.log(data);
    }
}

function editNotification(id){
    const contentTC = document.getElementById('contentTC').value;
    const contentEN = document.getElementById('contentEN').value;
    const titleTC = document.getElementById('titleTC').value;
    const titleEN = document.getElementById('titleEN').value;

    if (!contentTC || !contentEN || !titleTC || !titleEN) {
        swal.fire({
            icon: 'error',
            title: 'Empty Field',
            text: 'All field must be filled out!',
        });
        return;
    }

    const data = {
        id:id,
        contentTC: contentTC,
        contentEN: contentEN,
        titleEN:titleEN,
        titleTC:titleTC,


    };



    Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to edit notification. Are you sure you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, edit it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
        fetch(`${window.API_URL}/api/v1/pushNotification/editNotification/`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success'
                }).then(() => {
                    $('#NotificationModal').modal('hide'); // close the modal
                    fetchData();
                    //fetchImages(selectedYear,photoDate,phoneActivityID);
                });
            }
        })
        .catch((error) => {
            swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        });
        }
    });
}

function showPushNotificationModal(id){
    $('#pushNotificationModal').modal('show');
    const pushNotificationButton = document.getElementById('pushNotificationButton');
    pushNotificationButton.onclick = function() {
        pushNotification(id);
    };
}

function pushNotification(id){
    const userTypeSelect = document.getElementById('userType');
    const selectedUserType = userTypeSelect.value;

    const data = {
        selectedOption:selectedUserType,
        id:id,
    };
    Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to push notification. Are you sure you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, edit it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
        fetch(`${window.API_URL}/api/v1/pushNotification/pushNotification/`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success'
                }).then(() => {
                    //$('#NotificationModal').modal('hide'); // close the modal
                    //fetchData();
                });
            }
        })
        .catch((error) => {
            swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        });
        }
    });
}