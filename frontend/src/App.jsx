import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
// import { AuthProvider, useAuth } from './hooks/useAuth';
import { useParams } from "react-router-dom";
// import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
// import ResetPasswordPage from './features/auth/ResetPasswordPage';
// import VerifyEmailPage from './features/auth/VerifyEmailPage';
import ProfileCard from './features/profile/ProfileCard' ;
import { Button } from './components/ui/button';
import EditProfile from './features/profile/EditProfile' ;
import NotExistUser from './features/profile/NotExistUser' ;
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './features/home';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from './store/authStore';
import PostDisplay from './features/post/postDisplay';
import SinglePost from './features/post/singlepost';
import ExplorePage from './features/post/ExplorePosts';
import ProfilePosts from './features/post/ProfilePosts';
import Navbar from "./components/navigation/Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import MainLayout from './components/navigation/MainLayout';
import CreatePost from './features/post/CreatePost';
import ProfilePage from './features/profile/ProfilePage';
import SearchPage from './features/search/SearchPage';
import SearchBar from './components/search/SearchBar';
import LandingPage from './features/landing/LandingPage';


function HomePage() {
  // const { user, logout } = useAuth();

  return (
    <div className="mx-auto mt-20 grid w-full max-w-md gap-6 text-center">
      <h1 className="text-2xl font-bold">Social Network</h1>
      <Home></Home>
    </div>
  );
}

function ProtectedRoute({ children }) {
    
    const isAuthenticated = useAuthStore.getState().isAuthenticated
    const { username } = useParams();
    const currentUser = useAuthStore.getState().user;
    const isOwnProfile = currentUser?.username === username;
    console.log(`is auth : ${isAuthenticated} and ${currentUser}`)
    if (!isAuthenticated || !isOwnProfile) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


function PublicRoute({ children }) {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}


function ProfilePostsRoute(){

    const { username } = useParams();

    return (
        <ProfilePosts
            username={username}
        />
    );
}

function App() {
    // const handleSearchSubmit = (query) => {
    // navigate(
    //     `/search?q=${encodeURIComponent(query)}`
    //     );
    // };
  
  return (  //<QueryClientProvider client={queryClient}>
            <BrowserRouter>
              {/* <AuthProvider> */}
              
              <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<MainLayout/>}>
                        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/verify-email" element={<VerifyEmailPage />} /> */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                        <Route
                            path="/search"
                            element={<SearchPage />}
                        />
                        <Route
                        
                        path="profile/:username"

                            element={
                                <ProtectedRoute>
                                    <ProfilePage
                                    // username={
                                    //     username
                                    // }
                                />
                                </ProtectedRoute>
                                
                        }

                        />
                        {/* <Route path="profile/:username" element={<ProfileCard />} /> */}
                        {/* <Route path="edit_profile/:username" element={
                            <ProtectedRoute>
                            <EditProfile />
                        </ProtectedRoute> } /> */}
                        <Route path="create_post" element={<CreatePost/>}/>
                        <Route path="display_post" element={<PostDisplay/>}/>
                        <Route path="posts/:postId" element={<SinglePost/>}/>
                        <Route path="Not_exist_user" element={<NotExistUser/>}/>
                        
                        <Route
                            path="/explore"
                            element={<ExplorePage />}
                        />

                        <Route
                            path="/profile/:username/posts"
                            element={<ProfilePostsRoute />}
                        />
                        {/* <Route path="/feed" element={
                            <ProtectedRoute>
                                <Feed />
                            </ProtectedRoute>
                        }
                        />

                        <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        /> */}

                        
                    
                    
                    </Route>
                    
                
                
              </Routes>
              
          </BrowserRouter>
         //<ReactQueryDevtools initialIsOpen={false} />
      //</QueryClientProvider> 
    
  );
}

export default App;
