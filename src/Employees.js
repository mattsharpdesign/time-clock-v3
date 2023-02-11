import { useContext, useState } from "react";
import { observer } from 'mobx-react-lite'
import { EmployeeStoreContext } from "./EmployeeStoreContext";


export default function Employees() {
  
  return <>
    <h1>Employees</h1>
    <EmployeeList />
  </>
}

const EmployeeList = observer(() => {
  
  const [isExpanded, setExpanded] = useState(false)
  const [name, setName] = useState('')
  const store = useContext(EmployeeStoreContext)

  return <div>
    {store.employees.map(e => <Employee key={e.id} employee={e} />)}
    <p onClick={() => setExpanded(true)}>Add employee</p>
    {isExpanded && <form onSubmit={e => {
      e.preventDefault()
      console.log(name)
      store.addEmployee({ name })
      setName('')
    }}>
        <input type="text" placeholder="Name" value={name} onInput={e => setName(e.target.value)} />
      </form>}
  </div>
})


const Employee = observer(({ employee }) => {
  const [isExpanded, setExpanded] = useState(false)

  if (isExpanded) return <ExpandedEmployee employee={employee} onCancel={() => setExpanded(false)} />

  return <div>
    <h4 onClick={() => setExpanded(!isExpanded)}>
      {employee.name}
      {employee.isSaving && <small>Saving...</small>}
    </h4>
  </div>
})

const ExpandedEmployee = observer(({ employee, onCancel }) => {
  const [name, setName] = useState(employee.name)
  function handleSubmit(e) {
    e.preventDefault()
    employee.updateFromJson({ name })
    employee.save()
  }

  function isDirty() {
    return name !== employee.name
  }

  return <form onSubmit={handleSubmit}>
    <input type="text" value={name} onInput={e => setName(e.target.value)} />
    <button disabled={!isDirty()}>{!isDirty() ? 'Saved' : employee.isSaving ? 'Saving' : 'Save'}</button>
    <button type="button" onClick={() => employee.delete()}>
      {employee.isDeleting ? 'Please wait...' : 'Delete'}
    </button>
    <button type="button" onClick={onCancel}>Cancel</button>
  </form>
})