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

  return <div>
    <h4 onClick={() => setExpanded(!isExpanded)}>
      {employee.name}
      {employee.isSaving && <small>Saving...</small>}
    </h4>
    {isExpanded && <div>
      <em>{employee.id}</em>
      <button type="button" onClick={() => employee.delete()}>
        {employee.isDeleting ? 'Please wait...' : 'Delete'}
      </button>
    </div>}
  </div>
})