let selectedMain = "";
let selectedCampus = "";

/* COURSE SELECT */
function selectCourse(course, event) {

  selectedMain = course;

  document.querySelectorAll(".course-btn").forEach(btn => {
    btn.style.background = "black";
    btn.style.color = "white";
  });

  if (event) {
    event.target.style.background = "gold";
    event.target.style.color = "black";
  }

  const sub = document.getElementById("subCourse");

  if (!sub) return;

  sub.innerHTML = '<option value="">Select Course Detail</option>';

  if (course === "Computer") {
    sub.innerHTML += "<option>DIT</option><option>Graphics Designing</option><option>Typing classes</option>";
  }

  if (course === "Tuition") {
    sub.innerHTML += "<option>Primary</option><option>Middle</option><option>Matric</option>";
  }

  if (course === "English") {
    sub.innerHTML += "<option>Basic English</option><option>Spoken English</option>";
  }

  if (course === "Special") {
    sub.innerHTML += "<option>Special Classes</option><option>Short Writing</option><option>Test Preparation</option>";
  }
}

/* CAMPUS SELECT */
function selectCampus(campus, event) {
  selectedCampus = campus;

  const buttons = document.querySelectorAll(".courses")[1]?.querySelectorAll(".course-btn") || [];
  
  buttons.forEach(btn => {
    btn.style.background = "black";
    btn.style.color = "white";
  });

  if (event) {
    event.target.style.background = "gold";
    event.target.style.color = "black";
  }
}

/* FORM SUBMIT */
document.getElementById("form")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const file = document.getElementById("photo")?.files[0];

  if (!file) {
    alert("⚠️ Upload photo");
    return;
  }

  if (!selectedCampus) {
    alert("⚠️ Select a campus");
    return;
  }

  const cnic = document.getElementById("cnic").value;
  const name = document.getElementById("name").value;

  const formData = new FormData();

  formData.append("name", name);
  formData.append("fatherName", document.getElementById("father").value);
  formData.append("contact", document.getElementById("contact").value);
  formData.append("whatsapp", document.getElementById("whatsapp").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("gender", document.querySelector('input[name="gender"]:checked')?.value || "");
  formData.append("course", document.getElementById("subCourse").value);
  formData.append("campus", selectedCampus);
  formData.append("cnic", cnic);
  formData.append("dob", document.getElementById("dob").value);
  formData.append("photo", file);

  try {
    const res = await fetch("/submit", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Form Submitted Successfully!");

      const finalData = {
        name: name,
        fatherName: document.getElementById("father").value,
        contact: document.getElementById("contact").value,
        whatsapp: document.getElementById("whatsapp").value,
        email: document.getElementById("email").value,
        gender: document.querySelector('input[name="gender"]:checked')?.value,
        course: document.getElementById("subCourse").value,
        campus: selectedCampus,
        cnic: cnic,
        dob: document.getElementById("dob").value,
        photo: ""
      };

      sessionStorage.setItem("finalStudent", JSON.stringify(finalData));

      window.location.href = "success.html";
    } else {
      alert("⚠️ " + (data.message || "Submission failed"));
    }

  } catch (err) {
    console.log(err);
    alert("❌ Server Error: " + err.message);
  }
});