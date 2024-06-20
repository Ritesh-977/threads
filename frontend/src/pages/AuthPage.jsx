import SignupCard from "../componenets/SignupCard"
import LoginCard from "../componenets/LoginCard";
import authScreenAtom from '../atoms/authAtom';
import { useRecoilValue } from "recoil";

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom);

  return (
    <>
    {
        authScreenState === "login" ? <LoginCard/> : <SignupCard/>
    }
    </>
  )
}

export default AuthPage
