const patientForm = document.getElementById("patientForm");
const appointmentRows = document.getElementById("appointmentRows");
const healthInfo = document.getElementById("healthInfo");
const formMessage = document.getElementById("formMessage");
const appointmentDate = document.getElementById("appointmentDate");
const dobInput = document.getElementById("dob");

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
appointmentDate.min = localToday;
dobInput.max = localToday;

function valueOf(id) {
  return document.getElementById(id).value.trim();
}

function addHealthItem(label, value) {
  const col = document.createElement("div");
  col.className = "col-sm-6 col-lg-4";
  const card = document.createElement("div");
  card.className = "info-card";
  const small = document.createElement("small");
  small.textContent = label;
  const strong = document.createElement("strong");
  strong.textContent = value || "—";
  card.append(small, strong);
  col.appendChild(card);
  healthInfo.appendChild(col);
}

patientForm.addEventListener("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();

  if (valueOf("appointmentDate") < localToday) {
    appointmentDate.setCustomValidity("Choose today or a future date.");
  } else {
    appointmentDate.setCustomValidity("");
  }

  if (!patientForm.checkValidity()) {
    patientForm.classList.add("was-validated");
    formMessage.className = "alert alert-danger";
    formMessage.textContent = "Please check the highlighted fields and correct the errors.";
    return;
  }

  const patient = {
    id: "APT-" + Date.now().toString().slice(-6),
    name: valueOf("patientName"),
    email: valueOf("email"),
    mobile: valueOf("mobile"),
    dob: valueOf("dob"),
    gender: valueOf("gender"),
    bloodGroup: valueOf("bloodGroup"),
    address: valueOf("address"),
    department: valueOf("department"),
    doctor: valueOf("doctor"),
    date: valueOf("appointmentDate"),
    time: valueOf("appointmentTime"),
    symptoms: valueOf("symptoms"),
    status: "Pending"
  };

  const emptyRow = document.getElementById("emptyAppointments");
  if (emptyRow) emptyRow.remove();

  const row = document.createElement("tr");
  const values = [patient.id, patient.name, patient.department, patient.doctor, patient.date, patient.time];
  values.forEach(value => {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
  });
  const statusCell = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = "status-badge";
  badge.textContent = patient.status;
  statusCell.appendChild(badge);
  row.appendChild(statusCell);
  appointmentRows.prepend(row);

  healthInfo.replaceChildren();
  [
    ["Patient Name", patient.name],
    ["Blood Group", patient.bloodGroup],
    ["Department", patient.department],
    ["Doctor", patient.doctor],
    ["Appointment Date", patient.date],
    ["Appointment Time", patient.time],
    ["Symptoms", patient.symptoms],
    ["Appointment Status", patient.status]
  ].forEach(([label, value]) => addHealthItem(label, value));

  formMessage.className = "alert alert-success";
  formMessage.textContent = `Appointment registered successfully! Your appointment ID is ${patient.id}.`;
  patientForm.classList.remove("was-validated");
  patientForm.reset();
  appointmentDate.min = localToday;
  dobInput.max = localToday;
  document.getElementById("appointments").scrollIntoView({ behavior: "smooth" });
});

patientForm.addEventListener("reset", function () {
  patientForm.classList.remove("was-validated");
  formMessage.className = "alert d-none";
  formMessage.textContent = "";
});
