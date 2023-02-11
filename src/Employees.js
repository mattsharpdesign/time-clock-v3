import { createContext, useContext, useReducer, useState } from "react";

const EmployeesContext = createContext()

let employees = localStorage.getItem('employees')
if (employees) {
  employees = JSON.parse(employees)
} else {
  employees = []
}

const initialState = {
  employees,
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, employees: [...state.employees, action.payload]}
    case 'REMOVE':
      let temp = [ ...state.employees ]
      temp.splice(temp.findIndex(e => e.id === action.payload.id), 1)
      return { ...state, employees: temp }
    default:
      return state
  }
}

function save(employee) {
  let employees = localStorage.getItem('employees')
  if (employees) {
    employees = JSON.parse(employees)
  } else {
    employees = []
  }
  const id = Math.random().toString(36).slice(2)
  const e = { id, name: employee }
  employees.push(e)
  localStorage.setItem('employees', JSON.stringify(employees))
  return Promise.resolve(e)
}

function remove(employee) {
  let employees = localStorage.getItem('employees')
  if (employees) {
    employees = JSON.parse(employees)
  } else {
    employees = []
  }
  const index = employees.findIndex(e => e.id === employee.id)
  if (index) {
    employees.splice(index, 1)
    localStorage.setItem('employees', JSON.stringify(employees))
    return new Promise(resolve => {
      setTimeout(resolve, 2000, 'removed')
    })
  } else {
    return Promise.reject('not found')
  }
}

export default function Employees() {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  const providerState = {
    state,
    dispatch
  }

  return <EmployeesContext.Provider value={providerState}>
    <h1>Employees</h1>
    <EmployeeList />
  </EmployeesContext.Provider>
}

function EmployeeList() {
  
  const [isExpanded, setExpanded] = useState(false)
  const [name, setName] = useState('')
  const { state, dispatch } = useContext(EmployeesContext)

  return <div>
    {state.employees.map(e => <Employee key={e.id} employee={e} />)}
    <p onClick={() => setExpanded(true)}>Add employee</p>
    {isExpanded && <form onSubmit={e => {
      e.preventDefault()
      console.log(name)
      save(name).then(e => {
        dispatch({ type: 'ADD', payload: e })
      })
      setName('')
    }}>
        <input type="text" placeholder="Name" value={name} onInput={e => setName(e.target.value)} />
      </form>}
  </div>
}

function Employee(props) {
  const [isExpanded, setExpanded] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const {state, dispatch} = useContext(EmployeesContext)

return <div>
    <h4 onClick={() => setExpanded(!isExpanded)}>{props.employee.name}</h4>
    {isExpanded && <div>
      <em>{props.employee.id}</em>
      <button type="button" onClick={() => {
        setDeleting(true)
        remove(props.employee).then(result => {
          console.log(result)
          setDeleting(false)
          dispatch({ type: 'REMOVE', payload: props.employee })
        })
      }}>{isDeleting ? 'Please wait...' : 'Delete'}</button>
    </div>}
  </div>
}