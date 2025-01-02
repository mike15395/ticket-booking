const rows = [
  { row: "A", seats: 24, price: 1000 },
  { row: "B", seats: 25, price: 1000 },
  { row: "C", seats: 27, price: 1000 },
  { row: "D", seats: 28, price: 1000 },
  { row: "E", seats: 28, price: 1000 },
  { row: "F", seats: 31, price: 700 },
  { row: "G", seats: 31, price: 700 },
  { row: "H", seats: 32, price: 700 },
  { row: "I", seats: 34, price: 700 },
  { row: "J", seats: 35, price: 600 },
  { row: "K", seats: 37, price: 600 },
  { row: "L", seats: 38, price: 600 },
  { row: "M", seats: 41, price: 500 },
  { row: "N", seats: 41, price: 500 },
  { row: "O", seats: 42, price: 500 },
  { row: "P", seats: 41, price: 250 },
  { row: "Q", seats: 42, price: 250 },
  { row: "R", seats: 44, price: 250 },
  { row: "S", seats: 44, price: 250 },
];

const extraSpaceConfig = {
  A: [10, 16],
  B: [10, 17],
  C: [11, 18],
  D: [11, 19],
  E: [11, 19],
  F: [12, 21],
  G: [12, 21],
  H: [12, 22],
  I: [13, 23],
  J: [13, 24],
  K: [14, 25],
  L: [14, 26],
  M: [15, 28],
  N: [15, 28],
  O: [16, 28],
  P: [15, 27],
  Q: [15, 28],
  R: [16, 29],
  S: [16, 29],
};

const tableData = [
  {
    floorType: "Ground",
    rows: "A-B-C-D-E",
    price: 1000,
  },
  {
    floorType: "Ground",
    rows: "F-G-H-I",
    price: 700,
  },
  {
    floorType: "Stall",
    rows: "J-K-L",
    price: 600,
  },
  {
    floorType: "Stall",
    rows: "M-N-O",
    price: 500,
  },
  {
    floorType: "Balcony",
    rows: "P-Q-R-S",
    price: 250,
  },
];

const url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKxTigr4rJDtrreI4z4rJE0BLOdqJnWGOGxjNiUQTyPzw2P-eB8xXEeUJe8xaZZcQOZdqLaZjg98aU/pub?output=csv&gid=970453845";

let bookedSeats = [];

const loader = document.getElementById("loader");
const main = document.querySelector(".main");
const auditorium = document.querySelector(".auditorium");
const displayBookedCount = document.getElementById("booked-count");
const displayAvailableCount = document.getElementById("available-count");
const bookingContainer = document.querySelector(".booking-status");
const table = document.getElementById("details-table");
const dateTime = document.querySelector(".date-time");

async function getBookedSeats() {
  try {
    loader.style.display = "flex";
    bookingContainer.style.display = "none";

    bookedSeats = await fetchData();
    displayCurrentDateTime();
    generateTableData(bookedSeats);
    renderAuditorium(bookedSeats);
  } catch (error) {
    console.log("Error fetching API data", error);
  } finally {
    loader.style.display = "none";
    bookingContainer.style.display = "flex";
    auditorium.style.display = "grid";
  }
}

function refreshPage() {
  window.location.reload();
}

function displayCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  dateTime.textContent = formattedDateTime;
}

function generateTableData(bookedSeats) {
  const ground1000 = bookedSeats.filter((item) => item.Price === "1000");
  const ground700 = bookedSeats.filter((item) => item.Price === "700");
  const stall600 = bookedSeats.filter((item) => item.Price === "600");
  const stall500 = bookedSeats.filter((item) => item.Price === "500");
  const balcony250 = bookedSeats.filter((item) => item.Price === "250");
  tableData.forEach((item) => {
    if (item.price === 1000) {
      item.bookedCount = ground1000?.length;
      item.vacantCount = 132 - ground1000?.length;
    }
    if (item.price === 700) {
      item.bookedCount = ground700?.length;
      item.vacantCount = 128 - ground700?.length;
    }
    if (item.price === 600) {
      item.bookedCount = stall600?.length;
      item.vacantCount = 110 - stall600?.length;
    }
    if (item.price === 500) {
      item.bookedCount = stall500?.length;
      item.vacantCount = 124 - stall500?.length;
    }
    if (item.price === 250) {
      item.bookedCount = balcony250?.length;
      item.vacantCount = 171 - balcony250?.length;
    }
  });
  console.log(tableData);
  table.innerHTML += ` <tr>
                        <th>Floor type</th>
                        <th>Rows</th>
                        <th>Price(₹)</th>
                        <th>Booked</th>
                        <th>Available</th>
                    </tr>`;

  tableData.map((t) => {
    table.innerHTML += `<tr><td>${t.floorType}</td>
    <td>${t.rows}</td>
    <td>${t.price}</td>
    <td>${t?.bookedCount}</td>
    <td>${t?.vacantCount}</td></tr>`;
  });
}

function renderAuditorium(bookedSeats) {
  const totalSeats = 665;

  displayBookedCount.innerHTML += " → " + bookedSeats.length + " Seats";

  displayAvailableCount.innerHTML +=
    "→" + parseInt(totalSeats - bookedSeats.length) + " Seats";

  rows.forEach(({ row, seats, price }) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    const rowLabel = document.createElement("div");
    rowLabel.classList.add("row-label");
    rowLabel.textContent = row + "-₹:" + price;
    rowDiv.appendChild(rowLabel);

    const seatsDiv = document.createElement("div");
    seatsDiv.classList.add("seats");

    for (let i = 1; i <= seats; i++) {
      // const angle = -90 + (180 / (seats - 1)) * (i - 1); // Arc effect
      const seat = document.createElement("div");
      seat.classList.add("seat");
      seat.dataset.row = row;
      seat.dataset.seatNumber = i;
      seat.dataset.price = price;
      seat.textContent = i;
      // seat.style.transform = `rotate(${angle}deg) translate(0, -100px)`; // Arc effect

      const check = bookedSeats.filter(
        (item) =>
          item?.Row_number === row.toString() &&
          item?.Seat_number === i.toString() &&
          item?.Booking_Status === "Booked"
      );

      seat.classList.add(check?.length > 0 ? "booked" : "vacant");

      // if (row === "A" && (i === 9 || i === 15)) {
      //   seat.classList.add("extra-space");
      // }

      if (extraSpaceConfig[row] && extraSpaceConfig[row].includes(i)) {
        seat.classList.add("extra-space");
      }

      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = `Row ${row}, Seat ${i}: ₹${price}`;

      seat.appendChild(tooltip);
      seatsDiv.appendChild(seat);
    }

    rowDiv.appendChild(seatsDiv);
    auditorium.appendChild(rowDiv);
  });
}

async function fetchData() {
  console.time("fetching api data");
  const response = await fetch(url);
  const data = await response.text();
  console.timeEnd("fetching api data");
  console.log(data);
  const filteredData = parseCSV(data);
  console.log(filteredData, "filtered data");
  return filteredData;
}

function parseCSV(csvText) {
  const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
  const headers = rows[0].split(","); // Extract headers (assumes the first row is the header row)
  const data = []; // Initialize an array to store parsed data
  for (let i = 1; i < rows.length; i++) {
    const rowData = rows[i].split(","); // Split the row, handling '\r' characters
    const rowObject = {};
    for (let j = 0; j < headers.length; j++) {
      rowObject[headers[j]] = rowData[j];
    }
    data.push(rowObject);
  }
  return data;
}

getBookedSeats();
