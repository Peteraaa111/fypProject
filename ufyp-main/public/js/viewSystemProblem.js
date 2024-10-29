let table;

function initializeDataTable() {
    table = $('#allSystemProblemTable').DataTable({
      columns: [
        { title: 'Descript' },
        { title: 'Phone Number' },
        { title: 'Date Applied' },
      ],
    });
}
  

function fetchData() {
    fetch(`${window.API_URL}/api/v1/admin/getAllSystemProblem/`)
    .then((response) => response.json())
    .then((data) => {
        table.clear().draw();
        data.systemProblemList.forEach((problemData) => {
        var rowData = [
            problemData.problem,
            problemData.phoneNumber,
            problemData.dateApplied,
        ];
            table.row.add(rowData).draw();
        });
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
}