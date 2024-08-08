$(document).ready(function () {
  let kitchenCount = 0;
  let fohCount = 0;

  $("#addKitchen").click(function () {
    kitchenCount++;
    $("#kitchenContainer").append(
      `<div class="form-row align-items-end" id="kitchen${kitchenCount}">
                  <div class="form-group employee-input">
                      <label for="kitchenName${kitchenCount}">Name:</label>
                      <input type="text" class="form-control" id="kitchenName${kitchenCount}" placeholder="Name">
                  </div>
                  <div class="form-group employee-input">
                      <label for="kitchenHours${kitchenCount}">Hours:</label>
                      <input type="number" class="form-control" id="kitchenHours${kitchenCount}" placeholder="Hours">
                  </div>
                  <div class="form-group employee-input">
                      <label for="kitchenMinutes${kitchenCount}">Mins:</label>
                      <input type="number" class="form-control" id="kitchenMinutes${kitchenCount}" placeholder="Mins">
                  </div>
                  <div class="form-group employee-input">
                      <button class="btn btn-danger" onclick="removeEmployee('kitchen${kitchenCount}')">Remove</button>
                  </div>
              </div>`
    );
  });

  $("#addFOH").click(function () {
    fohCount++;
    $("#fohContainer").append(
      `<div class="form-row align-items-end" id="foh${fohCount}">
                  <div class="form-group employee-input">
                      <label for="fohName${fohCount}">Name:</label>
                      <input type="text" class="form-control" id="fohName${fohCount}" placeholder="Name">
                  </div>
                  <div class="form-group employee-input">
                      <label for="fohHours${fohCount}">Hours:</label>
                      <input type="number" class="form-control" id="fohHours${fohCount}" placeholder="Hours">
                  </div>
                  <div class="form-group employee-input">
                      <label for="fohMinutes${fohCount}">Mins:</label>
                      <input type="number" class="form-control" id="fohMinutes${fohCount}" placeholder="Mins">
                  </div>
                  <div class="form-group employee-input">
                      <button class="btn btn-danger" onclick="removeEmployee('foh${fohCount}')">Remove</button>
                  </div>
              </div>`
    );
  });

  $("#calculate").click(function () {
    let totalTips = parseFloat($("#totalTips").val());

    if (isNaN(totalTips) || totalTips <= 0) {
      alert("Please enter a valid total tips amount.");
      return;
    }

    let kitchenTimes = getEmployeeTimes("kitchen", kitchenCount);
    let fohTimes = getEmployeeTimes("foh", fohCount);

    let kitchenTips = totalTips * 0.25;
    let fohTips = totalTips * 0.75;

    let kitchenShares = calculateShares(kitchenTips, kitchenTimes);
    let fohShares = calculateShares(fohTips, fohTimes);

    displayResults("Kitchen", kitchenShares, kitchenCount);
    displayResults("FOH", fohShares, fohCount);
  });
});

function getEmployeeTimes(type, count) {
  let times = [];
  for (let i = 1; i <= count; i++) {
    let hours = parseInt($(`#${type}Hours${i}`).val());
    let minutes = parseInt($(`#${type}Minutes${i}`).val());
    let name = $(`#${type}Name${i}`).val();

    if (
      !isNaN(hours) &&
      !isNaN(minutes) &&
      hours >= 0 &&
      minutes >= 0 &&
      name
    ) {
      times.push({ name: name, time: hours * 60 + minutes });
    }
  }
  return times;
}

function calculateShares(totalTips, employeeTimes) {
  let totalTime = employeeTimes.reduce((a, b) => a + b.time, 0);
  return employeeTimes.map((employee) => ({
    name: employee.name,
    share: (employee.time / totalTime) * totalTips
  }));
}

function displayResults(type, shares, count) {
  let resultDiv = $("#result");
  resultDiv.append(`<h4>${type} staff tips allocation:</h4>`);
  shares.forEach((share, index) => {
    resultDiv.append(
      `<p>${type} Employee ${index + 1} (${
        share.name
      }) gets $${share.share.toFixed(2)} in tips</p>`
    );
  });
}

function removeEmployee(id) {
  $(`#${id}`).remove();
}
