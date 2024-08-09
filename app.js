$(document).ready(function () {
  let kitchenCount = 0;
  let fohCount = 0;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  function validateInputField(input, message) {
    if (!input.val()) {
      alert(message);
      input.focus();
      return false;
    } else {
      return true;
    }
  }

  function validateTotalTips() {
    let totalTipsInput = $("#totalTips");
    return validateInputField(totalTipsInput, "You must enter tips amount.");
  }

  function validateEmployeeFields(type, count) {
    let nameInput = $(`#${type}Name${count}`);
    let hoursInput = $(`#${type}Hours${count}`);
    let minutesInput = $(`#${type}Minutes${count}`);

    if (
      !validateInputField(
        nameInput,
        `You must enter a name for ${
          type === "kitchen" ? "BOH" : "FOH"
        } Employee ${count}.`
      )
    )
      return false;
    if (
      !validateInputField(
        hoursInput,
        `You must enter hours for ${nameInput.val()}.`
      )
    )
      return false;
    if (
      !validateInputField(
        minutesInput,
        `You must enter minutes for ${nameInput.val()}.`
      )
    )
      return false;

    return true;
  }

  function addEmployee(type) {
    if (!validateTotalTips()) return;

    let count = type === "kitchen" ? ++kitchenCount : ++fohCount;
    let container = type === "kitchen" ? "#kitchenContainer" : "#fohContainer";

    // Validate the previous employee's fields before adding a new one
    if (count > 1 && !validateEmployeeFields(type, count - 1)) {
      if (type === "kitchen") kitchenCount--;
      else fohCount--;
      return;
    }

    $(container).append(
      `<div class="form-row align-items-end" id="${type}${count}">
                  <div class="form-group employee-input">
                      <label for="${type}Name${count}">Name:</label>
                      <input type="text" class="form-control" id="${type}Name${count}" placeholder="Name" required>
                  </div>
                  <div class="form-group employee-input">
                      <label for="${type}Hours${count}">Hours:</label>
                      <input type="number" class="form-control" id="${type}Hours${count}" placeholder="Hours" required>
                  </div>
                  <div class="form-group employee-input">
                      <label for="${type}Minutes${count}">Mins:</label>
                      <input type="number" class="form-control" id="${type}Minutes${count}" placeholder="Mins" required>
                  </div>
                  <div class="form-group employee-input">
                      <button class="btn btn-danger" type="button" onclick="removeEmployee('${type}${count}')">Remove</button>
                  </div>
              </div>`
    );

    $(`#${type}Name${count}`).on("input", function () {
      $(this).val(capitalizeFirstLetter($(this).val()));
    });
  }

  $("#addKitchen").click(function () {
    addEmployee("kitchen");
  });

  $("#addFOH").click(function () {
    addEmployee("foh");
  });

  $("#calculate").click(function () {
    if (!validateTotalTips()) return;

    let kitchenTimes = getEmployeeTimes("kitchen", kitchenCount);
    let fohTimes = getEmployeeTimes("foh", fohCount);

    if (!kitchenTimes.length && !fohTimes.length) {
      alert("No employees added.");
      return;
    }

    let totalTips = parseFloat($("#totalTips").val());
    let kitchenTips = totalTips * 0.25;
    let fohTips = totalTips * 0.75;

    let kitchenShares = calculateShares(kitchenTips, kitchenTimes);
    let fohShares = calculateShares(fohTips, fohTimes);

    displayResults("BOH", kitchenShares);
    displayResults("FOH", fohShares);
  });

  function getEmployeeTimes(type, count) {
    let times = [];
    for (let i = 1; i <= count; i++) {
      let nameInput = $(`#${type}Name${i}`);
      let hoursInput = $(`#${type}Hours${i}`);
      let minutesInput = $(`#${type}Minutes${i}`);

      if (!validateEmployeeFields(type, i)) return [];

      let hours = parseInt(hoursInput.val());
      let minutes = parseInt(minutesInput.val());
      let name = capitalizeFirstLetter(nameInput.val());

      times.push({ name: name, time: hours * 60 + minutes });
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

  function displayResults(type, shares) {
    let resultDiv = $("#result");
    resultDiv.append(`<h4>${type} staff tips allocation:</h4>`);
    shares.forEach((share) => {
      resultDiv.append(
        `<p>${type} Employee ${
          share.name
        } gets <span class="pill badge badge-info p-2">$${share.share.toFixed(
          2
        )}</span> in tips</p>`
      );
    });
  }

  window.removeEmployee = function (id) {
    $(`#${id}`).remove();
  };
});
