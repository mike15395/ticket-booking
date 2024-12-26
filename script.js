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

const url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKxTigr4rJDtrreI4z4rJE0BLOdqJnWGOGxjNiUQTyPzw2P-eB8xXEeUJe8xaZZcQOZdqLaZjg98aU/pub?output=csv&gid=970453845";

let bookedSeats = [];

const loader = "<div>Loading...</div>";
const main = document.querySelector(".main");

async function getBookedSeats() {
  // document.body.innerText = loader;

  bookedSeats = await fetchData();

  renderAuditorium(bookedSeats);
}

function renderAuditorium(bookedSeats) {
  const totalSeats = 665;
  const auditorium = document.querySelector(".auditorium");
  const displayBookedCount = document.getElementById("booked-count");
  displayBookedCount.innerHTML += " - " + bookedSeats.length + " Seats";

  const displayAvailableCount = document.getElementById("available-count");
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
