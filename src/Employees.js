import { useContext, useRef, useState } from "react";
import { observer } from 'mobx-react-lite'
import { EmployeeStoreContext } from "./EmployeeStoreContext";
import profilePlaceholder from './profile_placeholder.png'

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
      <img src={employee.profilePicUrl || profilePlaceholder} width="80" style={{ borderRadius: 40}} />
      {employee.name}
      {employee.isSaving && <small>Saving...</small>}
    </h4>
  </div>
})

const ExpandedEmployee = observer(({ employee, onCancel }) => {

  const imageInputRef = useRef(null)

  function handleFileSelection(e) {
    const file = e.target.files[0]
    var reader = new FileReader()
    reader.onloadend = function() {
      employee.setProfilePicUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return <div className="form">
    <input
      type="file"
      accept="image/*"
      capture="user"
      hidden
      onChange={e => handleFileSelection(e)}
      ref={imageInputRef}
    />
    <img
      src={employee.profilePicUrl || profilePlaceholder}
      width="100"
      onClick={() => imageInputRef.current.click()}
    />
    <input type="text" value={employee.name} onInput={e => employee.setName(e.target.value)} />
    <div>
      <button type="button" onClick={() => employee.delete()}>
        {employee.isDeleting ? 'Please wait...' : 'Delete'}
      </button>
      <button type="button" onClick={onCancel}>Done</button>
    </div>
  </div>
})