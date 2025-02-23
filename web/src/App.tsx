import './App.css'
import { Route, Routes } from 'react-router-dom'
import SigninForm from './components/SigninForm'
import SignupForm from './components/SignupForm'
import WrapperWithHeader from './components/WrapperWithHeader'
import { ForgotPasswordForm } from './components/ForgotPasswordForm'
import ResetPasswordForm from './components/ResetPasswordForm'
import WrapperResetPassword from './components/WrapperResetPassword'
import { useState } from 'react'
import AccountActivationModal from './components/AccountActivationModal'

function App() {
  const [isActivation, setIsActivation] = useState<boolean>(false)
  return (
    <>
      <div className='flex'>
        <Routes>
          <Route element={<WrapperWithHeader />}>
            <Route path='/signin' element={<SigninForm />}/>
            <Route path='/signup' element={<SignupForm />}/>
          </Route>
          <Route element={<WrapperResetPassword />}>
            <Route path='/forgot-password' element={<ForgotPasswordForm />}/>
            <Route path='/reset-password/:token' element={<ResetPasswordForm />} />
          </Route>
        </Routes>
        {isActivation && <AccountActivationModal setIsActivation={setIsActivation}/>}
      </div>
    </>
  )
}

export default App
