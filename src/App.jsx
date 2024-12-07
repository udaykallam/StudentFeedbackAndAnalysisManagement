import './App.css'
import { Routes,Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import Home from './components/Navbar.jsx'
import Logout from './components/Logout.jsx'
import Loading from './components/Loading.jsx'
import Error from './components/404.jsx'
import AddStudent from './components/admin/AddStudent.jsx'
import AddFaculty from './components/admin/AddFaculty.jsx'
import AddCourse from './components/admin/AddCourse.jsx'
import Courses from './components/student/Courses.jsx'
import ViewCourses from './components/student/ViewCourses.jsx'
import PieChart from './components/PieChart.jsx'
import Students from './components/admin/Students.jsx'
import Faculty from './components/admin/Faculty.jsx'
import AddFeedback from './components/admin/AddFeedback.jsx'
import Student from './components/faculty/Students.jsx'
import MyCourses from './components/faculty/MyCourses.jsx'
import Feedback from './components/student/Feedback.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import ResetPassword from './components/ResetPassword.jsx'
import ViewFeedback from './components/student/ViewFeedback.jsx'
import FeedbackList from './components/student/FeedbackList.jsx'
import FeedbackForms from './components/admin/Analysis.jsx'

function App() {

  const data = [
    { label: 'A', value: 40 },
    { label: 'B', value: 70 },
    { label: 'C', value: 50 },
    { label: 'D', value: 20 },
  ];

  return (
    <>
     <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="*" element={<Error />} />

        <Route path="/addstudent" element={<AddStudent />} />
        <Route path="/addfaculty" element={<AddFaculty />} />
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/students" element={<Students/>} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/addfeedback" element={<AddFeedback/>} />
        <Route path="/analysis" element={<FeedbackForms/>} />

        <Route path="/student-info" element={<Student/>} /> 
        <Route path="/mycourses" element={<MyCourses />} />

        <Route path="/register" element={<Courses />} />
        <Route path="/courses" element={<ViewCourses />} />
        <Route path="/feedbacklist" element={<FeedbackList />} />
        <Route path="/feedback/:formId" element={<Feedback/>} />
        <Route path="/viewfeedback" element={<ViewFeedback/>} />

        {/* Test */}
        <Route path="/piechart" element={<PieChart data={data}/>} />

     </Routes>
    </>
  )
}

export default App
