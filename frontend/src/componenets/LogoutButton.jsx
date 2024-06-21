import { Button } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { Navigate } from "react-router-dom";

const LogoutButton = () => {
    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom)
    const handleLogout = async ()=>{
        try {
            const res = await fetch("/api/users/logout",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json();
            console.log(data);
            if(data.error){
                console.log("Error");
                showToast("Error", data.error, "error");
                return;
            }
            localStorage.removeItem("user-threads");
            setUser(null);
            <Navigate to={"/auth"}/>

        } catch (error) {
            showToast("Error", error, "error");
        }
    }
  return (
    <Button
     position={"fixed"}
    top={"30px"}
    right={"30px"}
    size={"sm"}
    onClick={handleLogout}
    >
        Logout
    </Button>
     
  )
}

export default LogoutButton
