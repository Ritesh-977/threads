import { Box, Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPages from './pages/UserPages';
import PostPage from "./pages/PostPage";
import HomePage from "./pages/Homepage"
import AuthPage from "./pages/AuthPage";
import Header from "./componenets/Header";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./componenets/CreatePost";
import ChatPage from "./pages/ChatPage";
function App() {
 const user = useRecoilValue(userAtom);

  return (
    <Box position={'relative'} w={'full'} >
    <Container maxW="620px">
      <Header/>
     <Routes>
       <Route path="/" element={user ? <HomePage/>: <Navigate to="/auth"/>}></Route>
       <Route path="/auth" element={!user ? <AuthPage />: <Navigate to="/"/> } />
       <Route path="/update" element={user ? <UpdateProfilePage />: <Navigate to="/auth"/> } />
       <Route path="/:username" 
       element={
        user ? (
          <>
          <UserPages/>
           <CreatePost/>
           </>
        ) : (
       <UserPages/>
       )}> </Route>
       <Route path="/:username/post/:pid" element={<PostPage/>}></Route>
       <Route path="/chat" element={ user ? <ChatPage/> : <Navigate to = "/auth" /> }></Route>
     </Routes>
    </Container>
    </Box>
  )
}

export default App
