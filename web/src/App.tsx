import { Route, Routes } from 'react-router-dom'
import SigninForm from './components/forms/SigninForm'
import SignupForm from './components/forms/SignupForm'
import WrapperWithHeader from './components/WrapperWithHeader'
import { ForgotPasswordForm } from './components/forms/ForgotPasswordForm'
import ResetPasswordForm from './components/forms/ResetPasswordForm'
import WrapperResetPassword from './components/WrapperResetPassword'
import UserProfile from './components/UserProfile'
import UserPostsGallery from './components/UserPostsGallery'
import FollowerRenderer from './components/renderers/FollowerRenderer'
import FollowingRenderer from './components/renderers/FollowingRenderer'
import FeedRenderer from './components/renderers/FeedRenderer'
import Page from './components/Page'
import Gallery from './components/LikePostGallery'
import LikedPostViewer from './components/LikedPostsViewer'
import LikedPostWrapper from './components/LikedPostWrapper'
import SavedPostWrapper from './components/SavedPostWrapper'
import SavedPostsGallery from './components/SavedPostsGallery'
import ProtectedComponent from './components/ProtectedComponent'
import SavedPostsViewer from './components/SavedPostsViewer'
import { ToastContainer } from 'react-toastify'
import NotFoundPage from './components/NotFoundPage'
import UserPostsViewer from './components/UserPostsViewer'
import UserPostWrapper from './components/UserPostsWrapper'

function App() {
  return (
    <>
      <div className='flex'>
        <Routes>
          <Route element={<WrapperWithHeader />}>
            <Route path='/' element={<SigninForm />}/>
            <Route path='/signup' element={<SignupForm />}/>
          </Route>
          <Route element={<ProtectedComponent />}>
            <Route element={<Page />}>  
              <Route path='/dashboard' element={<FeedRenderer/>}/>
              <Route path='/user-profile/:userID' element={<UserProfile />}>
                <Route index element={<UserPostWrapper ><UserPostsGallery /></UserPostWrapper>}/>
                <Route path='followers' element={<FollowerRenderer />}/>  
                <Route path='followings' element={<FollowingRenderer />}/>
              </Route>
              <Route element={<LikedPostWrapper />}>
                <Route path='liked-gallery' element={<Gallery />} />
                <Route path='liked-posts' element={<LikedPostViewer />} />
              </Route>
              <Route element={<SavedPostWrapper />}>
                <Route path='saved-gallery' element={<SavedPostsGallery />} />
                <Route path='saved-posts' element={<SavedPostsViewer />} />
              </Route>
              <Route path='/:userID'>
                <Route path='posts' element={<UserPostWrapper><UserPostsViewer /></UserPostWrapper>}/>
              </Route>
            </Route>
            <Route element={<WrapperResetPassword />}>
              <Route path='/forgot-password' element={<ForgotPasswordForm />}/>
              <Route path='/reset-password/:token' element={<ResetPasswordForm />} />
            </Route>

            
          </Route>

          <Route path='*' element={<NotFoundPage />}/>
        </Routes>
        <ToastContainer 
          position='top-center'/>
      </div>
    </>
  )
}

export default App