import { Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPages from './pages/UserPages';
import PostPage from "./pages/PostPage";
import HomePage from "./pages/Homepage"
import AuthPage from "./pages/AuthPage";
import Header from "./componenets/Header";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import LogoutButton from "./componenets/LogoutButton";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./componenets/CreatePost";
function App() {
 const user = useRecoilValue(userAtom);

  return (
    <Container maxW="620px">
      <Header/>
     <Routes>
       <Route path="/" element={user ? <HomePage/>: <Navigate to="/auth"/>}></Route>
       <Route path="/auth" element={!user ? <AuthPage />: <Navigate to="/"/> } />
       <Route path="/update" element={user ? <UpdateProfilePage />: <Navigate to="/auth"/> } />

       <Route path="/:username" element={<UserPages/>}></Route>
       <Route path="/:username/post/:pid" element={<PostPage/>}></Route>
     </Routes>
     {user && <LogoutButton/>}
     {user && <CreatePost/>}
    </Container>
  )
}

export default App
