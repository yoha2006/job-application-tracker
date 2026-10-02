const companyInput = document.querySelector('input[placeholder="Company Name"]');
const roleInput = document.querySelector('input[placeholder="Job Role"]');
const dateInput = document.querySelector('input[type="date"]');
const statusInput = document.querySelector('#statusInput');
const addButton = document.querySelector('#addButton');

const searchInput = document.querySelector('#searchInput');
const filterStatus = document.querySelector('#filterStatus');

const applicationList = document.querySelector('#applicationList');

const totalApplications = document.querySelector('#totalApplications');
const shortlisted = document.querySelector('#shortlisted');
const interviews = document.querySelector('#interviews');
const selected = document.querySelector('#selected');

let applications = JSON.parse(localStorage.getItem("applications")) || [];

displayApplications();
updateDashboard();

addButton.addEventListener('click', function () {

    const company = companyInput.value.trim();
    const role = roleInput.value.trim();
    const date = dateInput.value;
    const status = statusInput.value;

    if (company === "" || role === "" || date === "") {
        alert("Please fill all the details.");
        return;
    }

    applications.push({
        company: company,
        role: role,
        date: date,
        status: status
    });

    saveApplications();
    displayApplications();
    updateDashboard();

    companyInput.value = "";
    roleInput.value = "";
    dateInput.value = "";
});

searchInput.addEventListener('input', displayApplications);

filterStatus.addEventListener('change', displayApplications);

function saveApplications() {
    localStorage.setItem("applications", JSON.stringify(applications));
}

function displayApplications() {

    applicationList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = filterStatus.value;

    const filteredApplications = applications.filter(function (application) {

        const matchesSearch =
            application.company.toLowerCase().includes(searchText) ||
            application.role.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            application.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    if (filteredApplications.length === 0) {
        applicationList.innerHTML = "<p>No applications found.</p>";
        return;
    }

    filteredApplications.forEach(function (application) {

        const index = applications.indexOf(application);

        const job = document.createElement("div");

        job.className = "application-card";

        job.innerHTML = `
            <h3>${application.company}</h3>
            <p>Role: ${application.role}</p>
            <p>Applied Date: ${application.date}</p>

            <span class="status-badge ${application.status.toLowerCase()}">
                ${application.status}
            </span>

            <div class="application-buttons">

                <button onclick="editApplication(${index})">
                    Edit
                </button>

                <button onclick="deleteApplication(${index})">
                    Delete
                </button>

            </div>
        `;

        applicationList.appendChild(job);
    });
}

function deleteApplication(index) {

    applications.splice(index, 1);

    saveApplications();
    displayApplications();
    updateDashboard();
}

function editApplication(index) {

    const application = applications[index];

    companyInput.value = application.company;
    roleInput.value = application.role;
    dateInput.value = application.date;
    statusInput.value = application.status;

    applications.splice(index, 1);

    saveApplications();
    displayApplications();
    updateDashboard();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function updateDashboard() {

    totalApplications.textContent = applications.length;

    shortlisted.textContent = applications.filter(function (application) {
        return application.status === "Shortlisted";
    }).length;

    interviews.textContent = applications.filter(function (application) {
        return application.status === "Interview";
    }).length;

    selected.textContent = applications.filter(function (application) {
        return application.status === "Selected";
    }).length;
}