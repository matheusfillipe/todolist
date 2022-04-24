import {v4 as uuidV4} from "uuid"

type Task = {id: string, title: string, completed: boolean, createdAt: Date}

const list = document.querySelector<HTMLUListElement>("#list")
const form = document.getElementById("new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task-title")

const tasks: Task[] = loadTasks()

tasks.forEach(addlistItem)

form?.addEventListener("submit", (e) => {
  e.preventDefault()
  if (input?.value == "" || input?.value == null) return

  const task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }
  tasks.push(task)
  addlistItem(task)
  input.value = ""
})

function addlistItem(newTask: Task) {
  const item = document.createElement("li")
  const label = document.createElement("label")
  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.checked = newTask.completed
  label.append(checkbox, newTask.title)
  checkbox.addEventListener("change", () => {
    newTask.completed = checkbox.checked
    updateDelButton(item, label, newTask)
    saveTasks()
  })
  updateDelButton(item, label, newTask)
  item.append(label)
  list?.append(item)
  saveTasks()
}

function updateDelButton(item: HTMLLIElement, label: HTMLLabelElement, newTask: Task) {
  if (!newTask.completed) {
    const delbutton = label.querySelector("#delete")
    delbutton?.remove()
    return
  }
  const delbutton = document.createElement("button")
  delbutton.id = "delete"
  delbutton.innerText = "Delete"
  delbutton.addEventListener("click", () => {
    const index = tasks.findIndex((task) => task.id === newTask.id)
    tasks.splice(index, 1)
    item.remove()
    saveTasks()
  })
  label.append(delbutton)
}


function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS")
  if (taskJSON == null) return []
  return JSON.parse(taskJSON)
}
