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
      del.textContent = "🗑";
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
    const input = document.createElement("input");

    input.type = "text";
    input.value = this.tasks[index].text;

    li.innerHTML = "";
    li.appendChild(input);
    input.focus();

    const saveEdit = () => {
      const value = input.value.trim();

      if (value.length >= 3 && value.length <= 255) {
        this.tasks[index].text = value;
        this.save();
      }

      this.draw();
    };

    input.addEventListener("blur", saveEdit);
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") input.blur();
    });
  }
}

const todo = new Todo();
