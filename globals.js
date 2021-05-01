// GLOBAL CLICK FUNCTIONS

function deleteNote(e) {
  e.stopPropagation();
  // Delete notes from both Data and UI
  DataController.deleteNote(e.currentTarget.dataset.id);
  LSController.setNotes(DataController.getNotes());
  UIController.deleteNote(e.currentTarget.dataset.id);
  // Update total notes indicator
  UIController.totalNotes(DataController.getTotal());
}

function openNote(e) {
  UIController.waveEffect(e);
  // get clicked note from DataController via data-id dataset
  // data-id was given at creation of represented note
  const note = DataController.getNoteById(e.currentTarget.dataset.id);
  // set the current note, I should know which state am I in
  DataController.setCurrentNote(note);
  UIController.fillInputs(DataController.getCurrentNote());
  UIController.showAddEdit();
}

function back() {
  UIController.clearSearchInp();
  UIController.hideAddEdit();
  if (UIController.isInputsEmpty()) {
    DataController.deleteNote(DataController.getCurrentNote().id);
  }
  LSController.setNotes(DataController.getNotes());

  UIController.printNotes(DataController.getNotes());
  UIController.totalNotes(DataController.getTotal());
  DataController.emptyCurrentNote();
  UIController.clearInputs();
}
// GLOBAL HELPER FUNCTIONS

function formatter(text, maxChar) {
  if (text.length > maxChar) {
    return text.slice(0, maxChar) + "...";
  }
  return text;
}

function getCurrentDate() {
  let months = [
    "Jan",
    "Feb",
    "March",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let today = new Date();
  let day = String(today.getDate()).padStart(2, "0");
  let month = months[today.getMonth()];
  let year = today.getFullYear();

  todayFormat = month + " " + day + ", " + year;

  return todayFormat;
}

function showDate(date) {
  let currentDate = new Date();
  let createdDate = new Date(date);
  let futureDate = new Date(date);
  futureDate.setHours(23);
  futureDate.setMinutes(59);
  futureDate.setSeconds(59);
  futureDate.setMilliseconds(999);
  let isDayOver = futureDate - currentDate < 0;
  let asHourAndMinute =
    formatNumber(createdDate.getHours()) +
    ":" +
    formatNumber(createdDate.getMinutes());
  return isDayOver ? getCurrentDate() : asHourAndMinute;
}

function formatNumber(num) {
  if (num < 10) {
    return "0" + num;
  }
  return num;
}

function generateId() {
  let newId = 0;
  switch (DataController.getTotal()) {
    case 0:
      return 1;
    case 1:
      DataController.getNotes().forEach((item) => {
        newId += item.id;
      });
      return newId + 1;
    default:
      DataController.getNotes().forEach((item) => {
        newId += item.id;
      });
      return newId;
  }
}
