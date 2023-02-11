import Employees from './Employees';
import './App.css';
import { EmployeeStoreContext } from './EmployeeStoreContext';
import { EmployeeStore } from './EmployeeStore';
import transportLayer from './transportLayer';

const employeeStore = new EmployeeStore(transportLayer)

function App() {
  return (
    <EmployeeStoreContext.Provider value={employeeStore}>
      <div className="App">
        <Employees />
      </div>
    </EmployeeStoreContext.Provider>
  );
}

export default App;
