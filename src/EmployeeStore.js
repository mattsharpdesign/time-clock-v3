import { makeAutoObservable, runInAction } from 'mobx'
import { simpleId } from './simpleId'

export class EmployeeStore {
  transportLayer
  employees = []
  isLoading = true

  constructor(transportLayer) {
    makeAutoObservable(this)
    this.transportLayer = transportLayer
    this.loadEmployees()  
  }

  loadEmployees() {
    this.isLoading = true
    let employees = localStorage.getItem('employees')
    if (employees) {
      employees = JSON.parse(employees)
    } else {
      employees = []
    }
    employees.forEach(json => this.updateEmployeeFromServer(json))
  }

  updateEmployeeFromServer(json) {
    let employee = this.employees.find(employee => employee.id === json.id)
    if (!employee) {
      employee = new Employee(this, json.id)
      this.employees.push(employee)
    }
    if (json.isDeleted) {
      this.removeEmployee(employee)
    } else {
      employee.updateFromJson(json)
    }
  }

  addEmployee(data) {
    const employee = new Employee(this)
    employee.updateFromJson(data)
    employee.save()
    this.employees.push(employee)
  }

  removeEmployee(employee) {
    this.employees.splice(this.employees.indexOf(employee), 1)
  }
}

class Employee {
  store = null
  id = null
  name = ''
  isSaving = false
  isDeleting = false

  constructor(store, id = simpleId()) {
    makeAutoObservable(this, {
      store: false,
      id: false,
    })
    this.store = store
    this.id = id
  }

  updateFromJson(json) {
    this.name = json.name
  }

  save() {
    this.isSaving = true
    this.store.transportLayer.saveEmployee(this.asJson).then(() => {
      runInAction(() => {
        this.isSaving = false
      })
    })
  }

  delete() {
    this.isDeleting = true
    this.store.transportLayer.deleteEmployee(this.id).finally(() => {
      runInAction(() => {
        this.store.removeEmployee(this)
        // this.isDeleting = false
      })
    })
  }

  get asJson() {
    return {
      id: this.id,
      name: this.name,
    }
  }
}