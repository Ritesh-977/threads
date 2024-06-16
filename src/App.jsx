import { Container } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom"
import UserPages from './pages/UserPages';
import PostPage from "./pages/PostPage";
import Header from "./componenets/Header";
function App() {

  return (
    <Container maxW="620px">
      <Header/>
     <Routes>
       <Route path="/:username" element={<UserPages/>}></Route>
       <Route path="/:username/post/:pid" element={<PostPage/>}></Route>
     </Routes>
    </Container>
  )
}

export default App
