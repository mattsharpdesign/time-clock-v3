export default {
  deleteEmployee: id => {
    let employees = localStorage.getItem('employees')
    if (employees) {
      employees = JSON.parse(employees)
    } else {
      employees = []
    }
    const index = employees.findIndex(e => e.id === id)
    if (index > -1) {
      employees.splice(index, 1)
      localStorage.setItem('employees', JSON.stringify(employees))
      return new Promise(resolve => {
        setTimeout(resolve, 1000, 'deleted')
      })
    } else {
      return Promise.reject('not found')
    }
  },

  saveEmployee: json => {
    let employees = localStorage.getItem('employees')
    if (employees) {
      employees = JSON.parse(employees)
    } else {
      employees = []
    }
    let index = employees.findIndex(e => e.id === json.id)
    if (index > -1) {
      employees[index] = { ...employees[index], ...json }
    } else {
      employees.push(json)
    }
    // const updatedEmployee = { ...employee, ...json }
    // const e = { id, name }
    localStorage.setItem('employees', JSON.stringify(employees))
    return new Promise(resolve => {
      setTimeout(resolve, 1000, 'saved')
    })
  }
}