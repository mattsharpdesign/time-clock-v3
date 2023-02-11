import Employees from './Employees';
import { EmployeeStoreContext } from './EmployeeStoreContext';
import { EmployeeStore } from './EmployeeStore';
import transportLayer from './transportLayer';

const employeeStore = new EmployeeStore(transportLayer)

function App() {
  return (
    <EmployeeStoreContext.Provider value={employeeStore}>
      <div>
        <Employees />
      </div>
    </EmployeeStoreContext.Provider>
  );
}

export default App;
