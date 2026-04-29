/* ========================= */
/* GLOBAL VARIABLES */
/* ========================= */

let allStudents = [];
let currentFilter = "all";

/* ========================= */
/* LOAD ALL STUDENTS */
/* ========================= */

async function loadStudents() {
  try {
    const res = await fetch("/admin/students");
    const data = await res.json();

    allStudents = data;
    displayStudents(currentFilter);

  } catch (err) {
    console.error("Load Error:", err);
    document.getElementById("studentsContainer").innerHTML = `
      <div style="color: red; text-align: center; padding: 20px;">
        ❌ Failed to load students: ${err.message}
      </div>
    `;
  }
}

/* ========================= */
/* DISPLAY STUDENTS */
/* ========================= */

function displayStudents(filter) {
  const container = document.getElementById("studentsContainer");
  currentFilter = filter;

  let filtered = allStudents;

  if (!filtered || filtered.length === 0) {
    container.innerHTML = `
      <div style="color: gold; text-align: center; padding: 40px;">
        📭 No students found
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(student => {
    const statusClass = `status-${student.paymentStatus || 'pending'}`;
    const statusText = getStatusText(student.paymentStatus);
    
    return `
      <div class="student-card">
        <div class="card-header">
          <div class="info-box">
            <div class="info-label">Name</div>
            <div class="info-value">${student.name || "N/A"}</div>
          </div>
          <div class="info-box">
            <div class="info-label">CNIC</div>
            <div class="info-value">${student.cnic || "N/A"}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div class="info-box">
            <div class="info-label">Course</div>
            <div class="info-value">${student.course || "N/A"}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Contact</div>
            <div class="info-value">${student.contact || "N/A"}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Campus</div>
            <div class="info-value">${student.campus || "N/A"}</div>
          </div>
        </div>

        <div class="info-box" style="margin-top: 15px;">
          <div class="info-label">Email</div>
          <div class="info-value">${student.email || "N/A"}</div>
        </div>

        ${student.photo ? `
          <div style="margin-top: 15px;">
            <img src="/uploads/${student.photo}" alt="Student Photo" style="max-width: 150px; border-radius: 8px; border: 2px solid gold;">
          </div>
        ` : ''}
      </div>
    `;
  }).join("");
}







/* ========================= */
/* AUTO LOAD */
/* ========================= */

window.onload = loadStudents;