class Todo {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    this.taskInput = document.getElementById("taskInput");
    this.taskDate = document.getElementById("taskDate");
    this.addBtn = document.getElementById("addTaskBtn");
    this.list = document.getElementById("taskList");
    this.search = document.getElementById("search");

    this.addBtn.addEventListener("click", () => this.add());
    this.search.addEventListener("input", () => this.draw());

    this.draw();
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  draw() {
    this.list.innerHTML = "";
    const filter = this.search.value.toLowerCase();

    this.tasks.forEach((task, index) => {
      if (filter.length >= 2 && !task.text.toLowerCase().includes(filter)) {
        return;
      }

      const li = document.createElement("li");

      const span = document.createElement("span");

      let text = task.text;

      if (task.date) {
        const date = new Date(task.date);
        text += ` (${date.toLocaleString()})`;
      }

      span.innerHTML = this.highlight(text, filter);

      span.addEventListener("click", () => this.edit(index));

      const del = document.createElement("button");
      del.textContent = "Usuń";
      del.className = "delete-btn";
      del.addEventListener("click", () => this.remove(index));

      li.appendChild(span);
      li.appendChild(del);
      this.list.appendChild(li);
    });
  }

  highlight(text, filter) {
    if (filter.length < 2) return text;
    const regex = new RegExp(`(${filter})`, "gi");
    return text.replace(regex, `<span class="highlight">$1</span>`);
  }

  add() {
    const text = this.taskInput.value.trim();
    const date = this.taskDate.value;

    if (text.length < 3 || text.length > 255) {
      alert("3-255 znaków");
      return;
    }

    if (date) {
      const now = new Date();
      const selected = new Date(date);
      if (selected <= now) {
        alert("Data musi być w przyszłości");
        return;
      }
    }

    this.tasks.push({
      text: text,
      date: date || null
    });
    this.taskInput.value = "";
    this.taskDate.value = "";

    this.save();
    this.draw();
  }

  remove(index) {
    this.tasks.splice(index, 1);
    this.save();
    this.draw();
  }

  edit(index) {
    const li = this.list.children[index];

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.value = this.tasks[index].text;

    const dateInput = document.createElement("input");
    dateInput.type = "datetime-local";
    dateInput.value = this.tasks[index].date || "";

    li.innerHTML = "";
    li.appendChild(textInput);
    li.appendChild(dateInput);

    textInput.focus();

    const saveEdit = (e) => {
      if (li.contains(e.target)) return; // klik wciąż w edycji

      const newText = textInput.value.trim();
      const newDate = dateInput.value;

      if (newText.length < 3 || newText.length > 255) {
        alert("3-255 znaków");
        document.removeEventListener("click", saveEdit);
        this.draw();
        return;
      }

      if (newDate) {
        const now = new Date();
        const selected = new Date(newDate);
        if (selected <= now) {
          alert("Data musi być w przyszłości");
          document.removeEventListener("click", saveEdit);
          this.draw();
          return;
        }
      }

      this.tasks[index].text = newText;
      this.tasks[index].date = newDate || null;

      this.save();
      document.removeEventListener("click", saveEdit);
      this.draw();
    };

    setTimeout(() => {
      document.addEventListener("click", saveEdit);
    });
  }
}

const todo = new Todo();
