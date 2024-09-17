const charts = {};
const DATA_UPDATE_ANIMATION_DELAY = 400;
// in seconds
const time = [0];

// in nm
const penetrationDepth = [49];

// in mN
const force = [7];

var currentStepProgress = 1;
var sampleLength = 0;
var sampleDiameter = 0;
var sampleFinalLength = 0;
var sampleFinalDiameter = 0;

document.getElementById("step1").classList.remove("disabled");
window.refresh();

function handle() {
  eval(`handleStep${currentStepProgress}()`);
  window.refresh();
}

// Function to display images with delay
function displayImagesWithDelay(images) {
  // Find the table element where the images will be displayed
  let imageTable = document.getElementById("imageTable");

  // Variable to track the index of the current image
  let currentIndex = 0;

  // Function to display the next image
  function displayNextImage() {
    if (currentIndex < images.length) {
      let image = images[currentIndex];
      let row = imageTable.insertRow(); // Create a new row

      // Create cells for time and image
      let timeCell = row.insertCell(0);
      let imageCell = row.insertCell(1);

      // Set the time in the first column
      timeCell.innerHTML = image.time;

      // Create an image element and set its attributes
      let img = document.createElement("img");
      img.src = image.url;
      img.width = 200; // Set image width (adjust as needed)
      img.height = 150; // Set image height (adjust as needed)

      // Append the image to the second column
      imageCell.appendChild(img);

      // Increment the index for the next image
      currentIndex++;

      // Schedule to display the next image after a delay
      setTimeout(displayNextImage, 1000); // Change the delay time as needed (currently 1 seconds)
    }
  }

  // Start displaying images
  displayNextImage();
}

function handleStep1() {
  let pane = document.getElementById("step1");
  if (!mit1 || !mit2 || !mit3) {
    alert("Please select a machine first!");
    return;
  }

  if (!mit1.isActive() && !mit2.isActive() && !mit3.isActive()) {
    alert("Please select a machine first!");
    return;
  }

  if (mit2.isActive()) {
    document.getElementById("sample0").style.visibility = "hidden";
    document.getElementById("sample1").style.visibility = "hidden";
    document.getElementById("text0").style.visibility = "hidden";
    document.getElementById("text1").style.visibility = "hidden";
  } else {
    document.getElementById("sample0").style.visibility = "visible";
    document.getElementById("sample1").style.visibility = "visible";
    document.getElementById("text0").style.visibility = "visible";
    document.getElementById("text1").style.visibility = "visible";
  }

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step2");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 2;
}

function handleStep2() {
  let currPos = 0;
  let pane = document.getElementById("step2");

  if (!mit1.isSampleLoaded() && !mit2.isSampleLoaded() && !mit3.isSampleLoaded()) {
    alert("Please load the sample in the machine first!");
    return;
  }

  pane.classList.add("done");
  pane.classList.remove("active");

  let images = [{}];

  if (mit1.isActive()) {
    if (CURRENT_SAMPLE === "brass") {
      images = [
        { time: "Indent-1", url: "images/results/Brass_Vickers_25 gf_1.jpg" },
        { time: "Indent-2", url: "images/results/Brass_Vickers_50 gf_1.jpg" },

        // Add more images as needed
      ];
    } else if (CURRENT_SAMPLE == "steel") {
      images = [
        { time: "Indent-1", url: "images/results/MS_Vickers_100 gf_1.jpg" },
        { time: "Indent-2", url: "images/results/MS_Vickers_50 gf_1.jpg" },
        // Add more images as needed
      ];
    } else {
      images = [
        { time: "Indent-1", url: "images/results/Al_Vickers_500 gf_2 (7).jpg" },
        { time: "Indent-2", url: "images/results/Al_Vickers_500 gf_1(40).jpg" },
        { time: "Indent-3", url: "images/results/Al_Vickers_500 gf_3(24).jpg" },
        // Add more images as needed
      ];
    }
  }
  if (mit2.isActive()) {
    images = [
      { time: "Indent-1", url: "images/results/MS_Brinell_250 kgf_1.jpg" },
      { time: "Indent-2", url: "images/results/MS_Brinell_250 kgf_2.jpg" },
      // Add more images as needed
    ];
  }

  // Find the table element where the images will be displayed
  let startTest = document.getElementById("startTest");
  startTest.disabled = false;
  startTest.innerHTML = "Start Test";

  document.getElementById("btnNext").disabled = false;

  const onStartTestHandler = (e) => {
    let tableBody = document.getElementById("testData");
    e.currentTarget.disabled = true;
    document.getElementById("btnNext").disabled = true;
    e.currentTarget.innerHTML = "Running...";
    displayImagesWithDelay(images);

    let totalSteps = force.length;
    let intr = setInterval(() => {
      if (currPos >= totalSteps) {
        clearInterval(intr);
        document.getElementById("startTest").disabled = false;
        document.getElementById("startTest").innerHTML = "Done";
        document.getElementById("btnNext").disabled = false;
        startTest.removeEventListener("click", onStartTestHandler);
        return;
      }
      let Sn = [];
      let sample_d = [];
      let d1 = [];
      let d2 = [];
      let HV = [];
      let Load = [];
      let average = [];

      if (mit1.isActive()) {
        if (CURRENT_SAMPLE === "aluminium") {
          document.getElementById("sample_name").innerHTML =
            "Perform d1 & d2 measurement from indent impressions of Al alloy";
          Sn = [1, 2, 3];
          sample_d = ["Indent-1", "Indent-2", "Indent-3"];
          d1 = [74.92, 77.58, 73.93];
          d2 = [74.01, 75.65, 75.26];
          Load = [0.5, 0.5, 0.5];
          HV = [167.22, 157.96, 166.62];
          average = [74.46, 76.61, 74.6];

          for (let i = 0; i < d1.length; i++) {
            tableBody.innerHTML += `
                      <tr>
                          <td>${Sn[i]}</td>
                          <td>${sample_d[i]}</td>
                          <td>${d1[i]}</td>
                          <td>${d2[i]}</td>
                          <td>${average[i]}</td>
                          <td>${Load[i]}</td>
                          <td>${HV[i]}</td>
                      </tr>
                  `;
          }
        } else if (CURRENT_SAMPLE === "brass") {
          document.getElementById("sample_name").innerHTML =
            "Perform d1 & d2 measurement from indent impressions of brass alloy";
          Sn = [1, 2];
          sample_d = ["Indent-1", "Indent-2"];
          d1 = [16.47, 17.75];
          d2 = [21.09, 23.84];
          Load = [0.025, 0.05];
          HV = [131.44, 214.44];
          average = [18.78, 20.79];

          for (let i = 0; i < d1.length; i++) {
            tableBody.innerHTML += `
                    <tr>
                        <td>${Sn[i]}</td>
                        <td>${sample_d[i]}</td>
                        <td>${d1[i]}</td>
                        <td>${d2[i]}</td>
                        <td>${average[i]}</td>
                        <td>${Load[i]}</td>
                        <td>${HV[i]}</td>
                    </tr>
                `;
          }
        } else {
          document.getElementById("sample_name").innerHTML =
            "Perform d1 & d2 measurement from indent impressions of MS alloy";
          Sn = [1, 2];
          sample_d = ["Indent-1", "Indent-2"];
          d1 = [23.44, 16.51];
          d2 = [31.04, 20.71];
          Load = [0.1, 0.05];
          HV = [249.84, 267.76];
          average = [27.24, 18.61];

          for (let i = 0; i < d1.length; i++) {
            tableBody.innerHTML += `
                  <tr>
                      <td>${Sn[i]}</td>
                      <td>${sample_d[i]}</td>
                      <td>${d1[i]}</td>
                      <td>${d2[i]}</td>
                      <td>${average[i]}</td>
                      <td>${Load[i]}</td>
                      <td>${HV[i]}</td>
                  </tr>
              `;
          }
        }
      }
      if (mit2.isActive()) {
        document.getElementById("sample_name").innerHTML =
          "Perform d1 & d2 measurement from indent impressions of MS alloy";
        const dataTable = document.querySelector(".dataTable table thead tr td:nth-child(7)");
        if (dataTable) {
          dataTable.textContent = "HBN"; // Update the text content with your desired value
        }

        Sn = [1, 2];
        sample_d = ["Indent-1", "Indent-2"];
        d1 = [1089.31, 1082.0];
        d2 = [1080.12, 1078.0];
        Load = [250.0, 250.0];
        HV = [269.87, 272.24];
        average = [1084.72, 1080.0];

        for (let i = 0; i < d1.length; i++) {
          tableBody.innerHTML += `
                <tr>
                    <td>${Sn[i]}</td>
                    <td>${sample_d[i]}</td>
                    <td>${d1[i]}</td>
                    <td>${d2[i]}</td>
                    <td>${average[i]}</td>
                    <td>${Load[i]}</td>
                    <td>${HV[i]}</td>
                </tr>
            `;
        }
      }

      currPos++;

      //let progress1 = (penetrationDepth.length / totalSteps) * currPos;
      // plotGraph(
      //   document.getElementById("outputGraphA").getContext("2d"),
      //   {
      //     labels: time,
      //     datasets: [
      //       {
      //         yAxisID: "A",
      //         data: penetrationDepth.slice(0, progress1),
      //         borderColor: "#3e95cd",
      //         fill: false,
      //         label: "Penetration Depth",
      //       },
      //       {
      //         yAxisID: "B",
      //         data: force.slice(0, progress1),
      //         borderColor: "brown",
      //         fill: false,
      //         label: "Force",
      //       },
      //     ],
      //   },
      //   "Penetration Depth (nm)",
      //   "Time (s)"
      // );
    }, DATA_UPDATE_ANIMATION_DELAY);
  };

  startTest.removeEventListener("click", onStartTestHandler);
  startTest.addEventListener("click", onStartTestHandler);

  let next = document.getElementById("step3");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 3;
}

function handleStep3() {
  let pane = document.getElementById("step3");

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step4");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 4;
}

function handleStep4() {
  let pane = document.getElementById("step4");

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step5");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 4;

  modal = new Modal({
    title: "Can you answer the questions?",
    body: [
      {
        page: 1,
        title:
          "The Vickers hardness in HV if the load applied is 100 grams and indentation size (diagonal length) is 43 microns (choose one of the closest one)?",
        options: ["100", "400", "980", "1280"],
        correct: 0,
      },
      {
        page: 2,
        title: " Rockwell hardness is measured by measuring the:",

        options: [
          " Diameter of indentation",
          "Projected area of Indentation",
          "Depth of penetration of indenter",
          "Rebound height of indenter",
        ],
        correct: 2,
      },
      {
        page: 3,
        title:
          "  If the load applied is 3000 kgf, ball diameter is 10 mm, and indent impression diameter is 3 mm, the Brinell hardness (in BHN) is:",

        options: ["1245", "415", "208", "520"],
        correct: 1,
      },
      {
        page: 4,
        title: "The Brinell hardness testing uses",

        options: [" Tungsten Carbide sphere", "Steel cone", "Diamond cone", "Diamond pyramid"],
        correct: 0,
      },
      {
        page: 5,
        title: "Which of the following test provide measurements of surface property?",

        options: ["Tensile test", "Fatigue test", "Impact test", "Hardness test"],
        correct: 3,
      },
      {
        page: 6,
        title:
          "The Vickers hardness in MPa if the load applied is 100 grams and indentation size (diagonal length) is 43 microns (choose one of the closest one)?",

        options: ["100", "980", "208", "520"],
        correct: 1,
      },

      {
        page: 7,
        title: "The included angle in the Vickers hardness test is",

        options: ["136", "90", "120", "60"],
        correct: 0,
      },
      {
        page: 8,
        title: " Rockwell indenter uses",

        options: ["Diamond pyramid", "Diamond cone", "Steel cone", "Tungsten carbide ball"],
        correct: 0,
      },
      {
        page: 9,
        title: " Penetration Indicated by each unit in dial in Rockwell test",

        options: ["0.2 mm", "0.02 mm", "0.002 mm", "0.0002 mm"],
        correct: 2,
      },
      {
        page: 10,
        title: `In Brinell hardness number "75 HB 10/500/30", what does 10 stands for?`,
        options: ["1245", "415", "208", "520"],
        correct: 1,
      },
      {
        page: 11,
        title: `If the length of the two diagonals in Vickers hardness test is 100 µm and 110 µm, then what is the average diagonal length?`,
        options: ["105", "210", "100", "110"],
        correct: 0,
      },
    ],
    onClose: handleStep5,
  });
  modal.show();
}

function handleStep5() {
  let pane = document.getElementById("step5");

  pane.classList.add("done");
  pane.classList.remove("active");

  // let next = document.getElementById("step6");
  // next.classList.add("active");
  // next.classList.remove("disabled");

  document.getElementById("btnNext").disabled = true;
  document.getElementById("btnNext").innerText = "Done";
  // currentStepProgress = 6;
}
function reset() {
  currentStepProgress = 1;
  setTimeout(() => {
    document.querySelectorAll(".box").forEach((e) => {
      e.classList.add("disabled");
      e.classList.remove("active");
      e.classList.remove("done");
    });

    const first_box = document.querySelector("#step1");
    first_box.classList.remove("disabled");
    first_box.classList.add("active");
  }, 50);

  if (mit1.isActive()) {
    mit1.destroy();
    mit1.unLoadSample();
  }
  if (mit2.isActive()) {
    mit2.destroy();
    mit2.unLoadSample();
  }

  document.getElementById("testData").innerHTML = "";
  document.getElementById("sample_name").innerHTML = "";
  document.querySelector("#imageTable").innerHTML =
    "<thead><tr><th>Indents</th><th>Indent Impressions</th></tr></thead><tbody></tbody>";
}
function plotGraph(graphCtx, data, labelX, labelY) {
  let chartObj = charts[graphCtx.canvas.id];
  if (chartObj) {
    chartObj.config.data.labels = data.labels;
    chartObj.config.data.datasets = data.datasets;
    chartObj.update();
  } else {
    charts[graphCtx.canvas.id] = new Chart(graphCtx, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        animation: false,
        scaleOverride: true,
        // legend: { display: false },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: labelX,
              },
              ticks: {
                beginAtZero: true,
                steps: 20,
                stepValue: 10,
                max: Math.max(...time),
              },
              // stacked: true,
            },
          ],
          yAxes: [
            {
              display: true,
              position: "left",
              id: "A",
              scaleLabel: {
                display: true,
                labelString: labelY,
              },
              ticks: {
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                // max: Math.max(...penetrationDepth),
                max: 2000,
              },
            },
            {
              display: true,
              position: "right",
              id: "B",
              scaleLabel: {
                display: true,
                labelString: "Force in mN",
              },
              ticks: {
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                // max: Math.max(...penetrationDepth),
                max: 2000,
              },
            },
          ],
        },
      },
    });
  }
}
