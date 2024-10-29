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

let ParentTable; 
let TeacherTable;

function initializeDataTable() {
    ParentTable = $('#parentTable').DataTable({
        columns: [
        { title: 'Phone Number' },
        { title: 'role' },
        { title: 'active' },
        { title: 'reset password' },
        ],
    });

    TeacherTable = $('#teacherTable').DataTable({
        columns: [
        { title: 'Phone Number' },
        { title: 'role' },
        { title: 'active' },
        { title: 'reset password' },
        ],
    });
}


function fetchData(){
    fetch(`${window.API_URL}/api/v1/admin/getAllUser`)
      .then((response) => response.json())
      .then((data) => {
        ParentTable.clear().draw();
        TeacherTable.clear().draw();
        data.teachersUsers.forEach((teacher) => {
            var rowData = [
                teacher.email,
                teacher.role,
                teacher.active,
                `<button class="btn btn-success btn-circle reset-password-button" onclick="setDocID('${teacher.id}')" data-bs-toggle="modal" data-bs-target="#resetPasswordModal" onclick="setDocID(JSON.parse(this.dataset.item))" title="Reset password"><i class="fas fa-edit"></i></button>`,
                // `<button class="btn btn-primary btn-sm" onclick="resetPassword('${teacher.id}')">Reset Passowrd</button>`,
            ];
            TeacherTable.row.add(rowData).draw();
        });
        data.parentsUsers.forEach((Parent) => {
            var rowData = [
                Parent.email,
                Parent.role,
                Parent.active,
                `<button class="btn btn-success btn-circle reset-password-button" onclick="setDocID('${Parent.id}')" data-bs-toggle="modal" data-bs-target="#resetPasswordModal"" title="Reset password"><i class="fas fa-edit"></i></button>`,
                // `<button class="btn btn-primary btn-sm" onclick="resetPassword('${Parent.id}')">Reset Passowrd</button>`,
            ];
            ParentTable.row.add(rowData).draw();
        });

      
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
}

function setDocID(id){
    document.querySelector('#docID').value = id;
}

function resetPassword(){
    const CurrentUserUid = getCookie('LoginUid');
    const newPassword = document.getElementById('newPassword');
    const reEnterPassword = document.getElementById('reEnterNewPassword');
    const docID = document.getElementById('docID');

    
    const docIDValue =docID.value;
    const newPasswordValue  =newPassword.value;
    const reEnterPasswordValue  =reEnterPassword.value;
    if (newPasswordValue !== reEnterPasswordValue) {
        Swal.fire({
            title: 'Error',
            text: 'Passwords do not match',
            icon: 'error',
        });
        return;
    }
    
    if (newPasswordValue.length < 6) {
        Swal.fire({
            title: 'Error',
            text: 'Password must be at least 6 characters long',
            icon: 'error',
        });
        return;
    }
    

    fetch(`${window.API_URL}/api/v1/admin/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ docIDValue, CurrentUserUid,newPasswordValue}),
      })
      .then((response) => response.json())
      .then((data) => {
        if(data.success){
            Swal.fire({
              title: 'Password Reset Successfully',
              text: 'Password Reset Successfully.',
              icon: 'success',
            }).then(() => {
              $('#resetPasswordModal').modal('hide');
            });
        }else{
            Swal.fire({
              title: 'Error',
              text: 'Password Reset Failed',
              icon: 'error',
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
}