import { useCallback, useEffect, useState } from "react"
import { dummyEmployeeData , DEPARTMENTS} from "../assets/assets"
import { Plus, X } from "lucide-react"
import EmployeeCard from "../components/EmployeeCard"
import EmployeeForm from "../components/EmployeeForm"
import api from "../api/axios"

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectDept, setSelectDept] = useState("")
  const [editEmployee, setEditEmployee] = useState(null)
  const [showCreateModel, setshowCreateModel] = useState(false)

  const fetchEmployees = useCallback(async () => {
    try {
      const url = selectDept ? `/employees?department=${selectDept}` : "/employees";
      const res = await api.get(url)
      
      setEmployees(res.data)
    } catch (error) {
      console.error("Failed to load employees", error);
    }finally{
      setLoading(false)
    }
  },[selectDept])

  useEffect(()=>{
    fetchEmployees();
  },[fetchEmployees]);

  const filtered = employees.filter((emp)=> `${emp.firstName} ${emp.lastName} ${emp.position}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage your team members</p>
        </div>
        <button onClick={()=> setshowCreateModel(true)} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus size={16}/> Add Employee
        </button>
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
            <search className="absolute left-3.5 top-1/2 transform-translate-y-1/2 text-slate-400 w-4 h-4">

            </search>
            <input placeholder="Search Employee..." className="w-full pl-10!" onChange={(e)=> setSearch(e.target.value)} value={search} />
        </div>
        <select value={selectDept} onChange={(e)=>setSelectDept(e.target.value)} className="max-w-40">
          <option value="">All Departments</option>
          {DEPARTMENTS.map((deptName)=>(
            <option key={deptName} value={deptName}>{deptName}</option>
          ))}
        </select>
      </div>

      {/* Employee Profile cards */}
      {loading ?(
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      ):(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">No Employees found</p>
          ) : (
            filtered.map((emp)=> <EmployeeCard key={emp.id} employee={emp} onDelete={fetchEmployees} onEdit={(e)=>setEditEmployee(e)}/>)
          )}
        </div>
      )}

      {/* create Employee Modal */}
      {
        showCreateModel && (
          <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=> setshowCreateModel(false)}>
            <div className="fixed inset-0"/>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 pb-0">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Add new Employee
                  </h2>
                  <p className="text-am text-slate-500 mt-0.5">Create a user account and employee profile</p>
                </div>
                <button onClick={()=> setshowCreateModel(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5"/>
                </button>
              </div>
              <div className="p-6">
                <EmployeeForm 
                onSuccess={()=>{
                  setshowCreateModel(false);
                  fetchEmployees();
                }} OnCancel={()=> setshowCreateModel(false)}/>
              </div>
            </div>
          </div>
        )
      }

      {/* Edit Employee Modal */}
      { editEmployee && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-sm" onClick={()=> setEditEmployee(null)}>
          <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in' onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Edit Employee
                  </h2>
                  <p className="text-am text-slate-500 mt-0.5">Update employee details</p>
                </div>
                <button onClick={()=> setEditEmployee(null)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5"/>
                </button>
            </div>
            <div className="p-6">
              <EmployeeForm initialData={editEmployee} 
              onSuccess={()=>{
                setEditEmployee(null);
                fetchEmployees();
              }} OnCancel={()=> setEditEmployee(null)}/>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees