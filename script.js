// Lookup by name
function lookupName() {
  const name = document.getElementById("nameInput").value;

  if (!name) {
    alert("Please enter a name");
    return;
  }

  fetch(`/api/lookup?name=${encodeURIComponent(name)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        document.getElementById("result").innerHTML =
          "<p style='color:red'>No record found</p>";
        return;
      }

      const r = data.data;
      document.getElementById("result").innerHTML = `
        <h3>Lookup Result</h3>
        <p><strong>Name:</strong> ${r.name}</p>
        <p><strong>Status:</strong> ${r.status}</p>
        <p><strong>NIN:</strong> ${r.nin}</p>
        <p><strong>Date:</strong> ${r.date}</p>
      `;
    })
    .catch(err => {
      console.error(err);
      alert("Server error");
    });
}

// Load table data
function loadTable() {
  fetch("/api/table")
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tableBody");
      tbody.innerHTML = "";

      data.forEach(row => {
        tbody.innerHTML += `
          <tr>
            <td>${row.id}</td>
            <td>${row.name}</td>
            <td>${row.status}</td>
          </tr>
        `;
      });
    });
}

// Auto load table on page load
window.onload = loadTable;
