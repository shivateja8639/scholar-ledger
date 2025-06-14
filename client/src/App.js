import {Routes,Route, Navigate} from 'react-router-dom'
import Homepage from './pages/Homepage';
import Register from './pages/Register';
import Login from './pages/Login';
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<protectedRoutes>
          <Homepage/>
          </protectedRoutes>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </>
  );
}

export function protectedRoutes(props){
  if(localStorage.getItem('user')){
    return props.children
  }else{
    return <Navigate to="/login"/>
  }
}

export default App;
