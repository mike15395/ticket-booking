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
  A: [9, 15],
  B: [9, 16],
  C: [10, 17],
  D: [10, 18],
  E: [10, 18],
  F: [11, 20],
  G: [11, 20],
  H: [11, 21],
  I: [12, 22],
  J: [12, 23],
  K: [13, 24],
  L: [13, 25],
  M: [14, 27],
  N: [14, 27],
  O: [15, 27],
  P: [14, 26],
  Q: [14, 27],
  R: [15, 28],
  S: [15, 28],
  // Add other rows and their respective seat numbers here
};

const url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKxTigr4rJDtrreI4z4rJE0BLOdqJnWGOGxjNiUQTyPzw2P-eB8xXEeUJe8xaZZcQOZdqLaZjg98aU/pub?output=csv&gid=970453845";

let bookedSeats = [];

const loader = document.getElementById("loader");
const main = document.querySelector(".main");
const auditorium = document.querySelector(".auditorium");
const displayBookedCount = document.getElementById("booked-count");
const displayAvailableCount = document.getElementById("available-count");
const bookingContainer = document.querySelector(".booking-status");

async function getBookedSeats() {
  // document.body.innerText = loader;
  try {
    loader.style.display = "block";
    bookingContainer.style.display = "none";

    bookedSeats = await fetchData();
    renderAuditorium(bookedSeats);
  } catch (error) {
    console.log("Error fetching API data", error);
  } finally {
    loader.style.display = "none";
    bookingContainer.style.display = "flex";
    auditorium.style.display = "grid";
  }
}

function renderAuditorium(bookedSeats) {
  const totalSeats = 665;

  displayBookedCount.innerHTML += " - " + bookedSeats.length + " Seats";

  displayAvailableCount.innerHTML +=
    " - " + parseInt(totalSeats - bookedSeats.length) + " Seats";

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
      const seat = document.createElement("div");
      seat.classList.add("seat");
      seat.dataset.row = row;
      seat.dataset.seatNumber = i;
      seat.dataset.price = price;
      seat.textContent = i;

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
