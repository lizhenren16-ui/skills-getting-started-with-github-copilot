document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      activitiesList.innerHTML = "";
      activitySelect.innerHTML = ""; // Prevent duplicate options

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Participants section
        const participantsHTML = `
          <div class="activity-participants" style="margin-top:12px;background:#f1f5fa;border-radius:8px;padding:12px;">
            <div class="activity-participants-title" style="font-weight:500;margin-bottom:6px;color:#1a2a3a;font-size:1em;">
              참가자 (${details.participants.length}명):
            </div>
            <ul class="activity-participants-list" style="margin:0;padding-left:20px;color:#2d3a4b;font-size:0.97em;">
              ${
                details.participants.length === 0
                  ? '<li style="color:#888;">아직 참가자가 없습니다.</li>'
                  : details.participants.map(email => `<li>${email}</li>`).join('')
              }
            </ul>
          </div>
        `;

        activityCard.innerHTML = `
          <h4 style="font-size:1.2em;font-weight:bold;color:#2d3a4b;">${name}</h4>
          <p style="color:#444;">${details.description}</p>
          <p style="font-size:0.98em;color:#6c7a89;"><strong>일정:</strong> ${details.schedule}</p>
          <p><strong>남은 자리:</strong> ${spotsLeft}명</p>
          ${participantsHTML}
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
