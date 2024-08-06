$(document).ready(function () {
  let kitchenCount = 0;
  let fohCount = 0;

  $("#addKitchen").click(function () {
    kitchenCount++;
    $("#kitchenContainer").append(
      `<div class="form-row align-items-end mb-2" id="kitchen${kitchenCount}">
                  <div class="form-group col-md-3">
                      <label for="kitchenName${kitchenCount}" class="form-label">Name:</label>
                      <input type="text" class="form-control" id="kitchenName${kitchenCount}" placeholder="Enter name">
                  </div>
                  <div class="form-group col-md-3">
                      <label for="kitchenHours${kitchenCount}" class="form-label">Hours:</label>
                      <input type="number" class="form-control" id="kitchenHours${kitchenCount}" placeholder="Enter hours">
                  </div>
                  <div class="form-group col-md-3">
                      <label for="kitchenMinutes${kitchenCount}" class="form-label">Minutes:</label>
                      <input type="number" class="form-control" id="kitchenMinutes${kitchenCount}" placeholder="Enter minutes">
                  </div>
                  <div class="form-group col-md-3">
                      <button class="btn btn-danger" onclick="removeEmployee('kitchen${kitchenCount}')">Remove</button>
                  </div>
              </div>`
    );
  });

  $("#addFOH").click(function () {
    fohCount++;
    $("#fohContainer").append(
      `<div class="form-row align-items-end mb-2" id="foh${fohCount}">
                  <div class="form-group col-md-3">
                      <label for="fohName${fohCount}" class="form-label">Name:</label>
                      <input type="text" class="form-control" id="fohName${fohCount}" placeholder="Enter name">
                  </div>
                  <div class="form-group col-md-3">
                      <label for="fohHours${fohCount}" class="form-label">Hours:</label>
                      <input type="number" class="form-control" id="fohHours${fohCount}" placeholder="Enter hours">
                  </div>
                  <div class="form-group col-md-3">
                      <label for="fohMinutes${fohCount}" class="form-label">Minutes:</label>
                      <input type="number" class="form-control" id="fohMinutes${fohCount}" placeholder="Enter minutes">
                  </div>
                  <div class="form-group col-md-3">
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

    let kitchenData = getEmployeeData("kitchen", kitchenCount);
    let fohData = getEmployeeData("foh", fohCount);

    let kitchenTips = totalTips * 0.25;
    let fohTips = totalTips * 0.75;

    let kitchenShares = calculateShares(kitchenTips, kitchenData.times);
    let fohShares = calculateShares(fohTips, fohData.times);

    displayResults("Kitchen", kitchenShares, kitchenData.names);
    displayResults("FOH", fohShares, fohData.names);
  });
});

function getEmployeeData(type, count) {
  let names = [];
  let times = [];
  for (let i = 1; i <= count; i++) {
    let name = $(`#${type}Name${i}`).val();
    let hours = parseInt($(`#${type}Hours${i}`).val());
    let minutes = parseInt($(`#${type}Minutes${i}`).val());

    if (
      name &&
      !isNaN(hours) &&
      !isNaN(minutes) &&
      hours >= 0 &&
      minutes >= 0
    ) {
      names.push(name);
      times.push(hours * 60 + minutes);
    }
  }
  return { names, times };
}

function calculateShares(totalTips, employeeTimes) {
  let totalTime = employeeTimes.reduce((a, b) => a + b, 0);
  return employeeTimes.map((minutes) => (minutes / totalTime) * totalTips);
}

function displayResults(type, shares, names) {
  let resultDiv = $("#result");
  resultDiv.append(`<h4>${type} staff tips allocation:</h4>`);
  shares.forEach((share, index) => {
    resultDiv.append(
      `<p>${names[index]} gets $${share.toFixed(2)} in tips</p>`
    );
  });
}

function removeEmployee(id) {
  $(`#${id}`).remove();
}
