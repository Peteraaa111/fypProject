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

let table;
function initializeDataTable() {
    table = $('#waitApprovalTable').DataTable({
      columns: [
        { title: 'Student Id' },
        { title: 'Interest Class ID' },
        { title: 'Parent Phone Number'},
        { title: 'Submitted Date' },
        { title: 'Status' },
        { title: 'Action'},
      ],
      columnDefs: [ { orderable: false, targets: [0,1,2,4,5] }],
      order: [[3, 'asc']],
    });
}
  

function fetchData() {
    fetch(`${window.API_URL}/api/v1/admin/getAllInterestClassRegistration/`)
    .then((response) => response.json())
    .then((data) => {
        table.clear().draw();
        data.interestClassFormList.forEach((from) => {
          
            var rowData = [
                from.studentId,
                from.interestClassID,
                from.phoneNumber,
                from.dateApplied,
                from.status,
                `<button class="btn btn-success btn-circle" title="Approve" onclick="changeStatus('approve','${from.interestClassID}')" ><i class="fas fa-check"></i></button>` +
                `<button class="btn btn-danger btn-circle" style="margin-left:10px" onclick="changeStatus('reject','${from.interestClassID}')" title="Reject"><i class="fas fa-times"></i></button>`,
            ];
            table.row.add(rowData).draw();
          

        });
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
}


function changeStatus(status,id){
    const CurrentUserUid = getCookie('LoginUid');
    swal.fire({
      title: "Are you sure?",
      text: `You are about to ${status} the from. Are you sure you want to proceed?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        fetch(`${window.API_URL}/api/v1/admin/approvalInterestClassForm`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status,CurrentUserUid,id }),
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
                    fetchData();
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