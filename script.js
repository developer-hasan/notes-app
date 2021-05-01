const DataController = (function () {
  let data = {
    notes: [
      // {
      //   id: 1,
      //   header: "how is it going",
      //   body:
      //     "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus, dignissimos.",
      //   createdAt: "Apr 24, 2021",
      // },
      // {
      //   id: 2,
      //   header: "some note 2",
      //   body: "note content 2",
      //   createdAt: "Jan 17, 2021",
      // },
    ],
    currentNote: {},
    sortedNotes: [],
  };

  let { notes, currentNote } = data;

  return {
    filterByHeader: function (term) {
      return notes.filter((item) => {
        return item.header.toLowerCase().includes(term.toLowerCase());
      });
    },
    getNotes: function () {
      return notes;
    },
    setNotes: function (notesArg) {
      notes = notesArg;
    },
    getCurrentNote: function () {
      return currentNote;
    },
    getTotal: function () {
      return notes.length;
    },
    getNoteById: function (id) {
      return notes.find((item) => {
        return item.id == id;
      });
    },
    setCurrentNote: function (note) {
      currentNote = note;
    },
    emptyCurrentNote: function () {
      currentNote = {};
    },
    addNote: function (note) {
      notes.push(note);
    },
    deleteNote: function (id) {
      notes = notes.filter((item) => {
        return item.id != id;
      });
    },
    deleteNotes: function (ids) {
      notes = notes.filter((item) => {
        ids.forEach((id) => {
          return item.id != id;
        });
      });
    },
    updateNote: function (id, updatedNote) {
      notes.forEach((item) => {
        if (item.id === id) {
          item = updatedNote;
        }
      });
    },
    getEmptyNote: function () {
      return {
        id: generateId(),
        header: "",
        body: "",
        createdAt: getCurrentDate(),
        dateFormat: new Date(),
      };
    },
  };
})();
const UIController = (function () {
  const Selectors = {
    app: ".app",
    notesHeader: ".header",
    actionsHeader: ".app .body .actions h3",
    totalNotes: ".app .header .total",
    notesContainer: ".app .body .notes .notes-content",
    repNote: ".app .body .notes .note",
    addEditNote: ".add-edit-note",
    headerInp: ".add-edit-note .title input",
    bodyInp: ".add-edit-note .note-body textarea",
    searchBtn: ".app .body .actions .search button",
    addBtn: ".edit button",
    addBtn2: ".app .body .btn-container button",
    searchBtnIcon: "#ic",
    searchInp: ".app .body .actions .search input",
    inpOverlay: ".inp-overlay",
    overlay: ".app .body .actions .search .overlay",
  };
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return {
    getSelectors: function () {
      return Selectors;
    },
    disableOverflow: function () {
      document.body.classList.add("overflow-hidden");
    },
    enableOverflow: function () {
      document.body.classList.add("overflow-auto");
    },
    totalNotes: function (total) {
      document.querySelector(Selectors.totalNotes).innerHTML = total + " notes";
    },
    scrollEffect: function (e) {
      // dummy function
      let scrollY = window.scrollY;
      const notesHeader = document.querySelector(".header");
      const actionsHeader = document.querySelector(".app .body .actions h3");
      let st = window.pageYOffset || document.documentElement.scrollTop;
      console.log({ lastScrollTop, st });
      if (!(st > lastScrollTop) && st === 0) {
        notesHeader.style.height = "30vh";
        notesHeader.style.overflow = "initial";
        notesHeader.style.opacity = 1;
        actionsHeader.style.opacity = 0;
      } else {
        notesHeader.style.height = "1px";
        notesHeader.style.overflow = "hidden";
        notesHeader.style.opacity = 0;
        actionsHeader.style.opacity = 1;
      }
      lastScrollTop = st <= 0 ? 0 : st;
    },
    printNotes: function (notes) {
      let html = "";

      notes.forEach((note) => {
        html += `
        <div class="note" data-id=${note.id} onclick="openNote(event)">
          <h4>${note.header}</h4>
          <div class="created-at">${showDate(note.dateFormat)}</div>
          <div class="content">${formatter(note.body, 70)}</div>
          <button class="delete" onclick="deleteNote(event)" data-id=${note.id}>
            <i class="fa fa-times"></i>
          </button>
        </div>
        `;
      });
      document.querySelector(Selectors.notesContainer).innerHTML = html;
    },
    deleteNote: function (noteId) {
      // select each represented note, find given and delete.
      document.querySelectorAll(Selectors.repNote).forEach((note) => {
        if (note.dataset.id === noteId) {
          note.remove();
        }
      });
    },
    clearInputs: function () {
      document.querySelector(Selectors.headerInp).value = "";
      document.querySelector(Selectors.bodyInp).value = "";
    },
    fillInputs: function (note) {
      document.querySelector(Selectors.headerInp).value = note.header;
      document.querySelector(Selectors.bodyInp).value = note.body;
    },
    isInputsEmpty: function () {
      return (
        document.querySelector(Selectors.headerInp).value == "" &&
        document.querySelector(Selectors.bodyInp).value == ""
      );
    },
    showAddEdit: function () {
      document.querySelector(Selectors.addEditNote).classList.add("active");
    },
    hideAddEdit: function () {
      document.querySelector(Selectors.addEditNote).classList.remove("active");
    },
    switchIcon: function () {
      const ic = document.querySelector(Selectors.searchBtnIcon);
      ic.classList.toggle("cred");
      if (ic.classList.contains("fa-search")) {
        ic.classList.remove("fa-search");
        ic.classList.add("fa-times");
      } else {
        ic.classList.remove("fa-times");
        ic.classList.add("fa-search");
      }
    },
    clearSearchInp: function () {
      document.querySelector(Selectors.searchInp) = "";
    },
    waveEffect: function (e) {
      let x = e.clientX - e.currentTarget.offsetLeft;
      let y = e.clientY - e.currentTarget.offsetTop;

      let wave = document.createElement("span");
      wave.classList.add("wave");
      wave.style.left = x + "px";
      wave.style.top = y + "px";
      e.currentTarget.appendChild(wave);

      setTimeout(() => {
        wave.remove();
      }, 500);
    },
    headerInpEffect: function (e) {
      const overlay = document.querySelector(Selectors.inpOverlay);
      let style =
        e.currentTarget.currentStyle ||
        window.getComputedStyle(e.currentTarget);
      let totalOffset =
        style.paddingTop +
        style.paddingBottom +
        style.marginTop +
        style.marginBottom +
        style.height;
      overlay.classList.add("active");
      overlay.style.top = totalOffset + "px";
    },
    addGray: function (selector) {
      document.querySelector(Selectors.bodyInp).classList.add("bg-gray-o");
    },
    removeGray: function () {
      document.querySelector(Selectors.bodyInp).classList.remove("bg-gray-o");
    },
    activeOverlay: function () {
      document.querySelector(Selectors.overlay).classList.add("active");
    },
    removeOverlay: function () {
      document.querySelector(Selectors.overlay).classList.remove("active");
    },
    focusInp: function (selector) {
      document.querySelector(selector).focus();
    },
    clearSearchInp: function () {
      document.querySelector(Selectors.searchInp).value = "";
    },
  };
})();

const LSController = (function () {
  return {
    setNotes: function (notes) {
      localStorage.setItem("notes", JSON.stringify(notes));
    },
    getNotes: function () {
      return JSON.parse(localStorage.getItem("notes") || "[]");
    },
    clearNotes: function () {
      localStorage.setItem("notes", "[]");
    },
  };
})();

const App = (function (Data, UI, LS) {
  const noteHeader = document.querySelector(UI.getSelectors().headerInp);
  const noteBody = document.querySelector(UI.getSelectors().bodyInp);
  const addBtn = document.querySelector(UI.getSelectors().addBtn);
  const addBtn2 = document.querySelector(UI.getSelectors().addBtn2);
  const searchBtn = document.querySelector(UI.getSelectors().searchBtn);
  const searchInp = document.querySelector(UI.getSelectors().searchInp);
  // events
  noteHeader.addEventListener("keyup", (e) => {
    let value = e.currentTarget.value;
    let currentNote = Data.getCurrentNote();
    currentNote.header = value;
    Data.updateNote(currentNote.id, currentNote);
  });
  noteBody.addEventListener("keyup", (e) => {
    let value = e.currentTarget.value;
    let currentNote = Data.getCurrentNote();
    currentNote.body = value;
    Data.updateNote(currentNote.id, currentNote);
  });
  document.addEventListener("scroll", UI.scrollEffect);
  window.addEventListener("DOMContentLoaded", (e) => {
    Data.setNotes(LS.getNotes());
    UI.totalNotes(Data.getTotal());
    UI.printNotes(Data.getNotes());
  });

  noteHeader.addEventListener("focus", UI.addGray);
  noteHeader.addEventListener("blur", UI.removeGray);
  addBtn.addEventListener("click", addNote);
  addBtn2.addEventListener("click", addNote);
  searchBtn.addEventListener("click", searchState);
  searchInp.addEventListener("keyup", searchNote);

  // functions
  function searchState(e) {
    // focuses specified selector's element
    UI.focusInp(UI.getSelectors().searchInp);
  }

  function addNote(e) {
    // focuses specified selector's element
    UI.focusInp(UI.getSelectors().headerInp);
    let emptyNote = DataController.getEmptyNote();
    DataController.addNote(emptyNote);
    DataController.setCurrentNote(emptyNote);
    UIController.showAddEdit();
  }

  function searchNote(e) {
    let value = e.currentTarget.value;
    let notes = Data.filterByHeader(value);

    UI.printNotes(notes);
  }
})(DataController, UIController, LSController);
