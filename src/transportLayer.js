export default {
  deleteEmployee: id => {
    let employees = localStorage.getItem('employees')
    if (employees) {
      employees = JSON.parse(employees)
    } else {
      employees = []
    }
    const index = employees.findIndex(e => e.id === id)
    if (index > 0) {
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
    const { id, name } = json
    let employees = localStorage.getItem('employees')
    if (employees) {
      employees = JSON.parse(employees)
    } else {
      employees = []
    }
    const e = { id, name }
    employees.push(e)
    localStorage.setItem('employees', JSON.stringify(employees))
    return new Promise(resolve => {
      setTimeout(resolve, 1500, 'saved')
    })
  }
}