class Todo {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    this.taskInput = document.getElementById("wpisZ");
    this.taskDate = document.getElementById("dataZ");
    this.addBtn = document.getElementById("dodG");
    this.taskList = document.getElementById("listaZ");
    this.search = document.getElementById("szuk");

    this.addBtn.addEventListener("click", () => this.addTask());
    this.search.addEventListener("input", () => this.draw());

    this.draw();
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  draw() {
    const phrase = this.search.value.toLowerCase();
    this.taskList.innerHTML = "";

    this.tasks.forEach((task, index) => {
      if (phrase.length >= 2 && !task.text.toLowerCase().includes(phrase)) {
        return;
      }

      const li = document.createElement("li");

      const span = document.createElement("span");
      span.innerHTML = this.highlight(task.text, phrase);
      span.addEventListener("click", () => this.editTask(span, index));

      const date = document.createElement("small");
      date.textContent = task.date ? " (" + task.date + ")" : "";

      const del = document.createElement("button");
      del.textContent = "🗑";
      del.className = "delete-btn";
      del.onclick = () => {
        this.tasks.splice(index, 1);
        this.save();
        this.draw();
      };

      li.appendChild(span);
      li.appendChild(date);
      li.appendChild(del);

      this.taskList.appendChild(li);
    });
  }

  highlight(text, phrase) {
    if (phrase.length < 2) return text;
    const regex = new RegExp(`(${phrase})`, "gi");
    return text.replace(regex, `<span class="highlight">$1</span>`);
  }

  addTask() {
    const text = this.taskInput.value.trim();
    const date = this.taskDate.value;

    if (text.length < 3 || text.length > 255) {
      alert("Zadanie musi mieć 3-255 znaków");
      return;
    }

    if (date && new Date(date) <= new Date()) {
      alert("Data musi być w przyszłości");
      return;
    }

    this.tasks.push({ text, date });
    this.save();
    this.draw();

    this.taskInput.value = "";
    this.taskDate.value = "";
  }

  editTask(span, index) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = this.tasks[index].text;

    span.replaceWith(input);
    input.focus();

    const save = () => {
      const value = input.value.trim();
      if (value.length >= 3 && value.length <= 255) {
        this.tasks[index].text = value;
        this.save();
      }
      this.draw();
    };

    input.addEventListener("blur", save);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") input.blur();
    });
  }
}

const todo = new Todo();
