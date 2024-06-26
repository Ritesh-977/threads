import { Button, Text } from "@chakra-ui/react"
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

const SettingsPage = () => {
    const showToast = useShowToast();
    const logout = useLogout();
    const deactivateAccount = async () =>{

        if(!window.confirm("Are you sure you want to deactivate your account ?")) return;

        try {
            const res = await fetch("/api/users/freeze",{
                method: "PUT",
                headers: {"Content-Type": "application/json"}
            });
            const data = await res.json();

            if(data.error){
              return  showToast("Error", data.error, "error");
            }
            if(data.success){
                await logout();
                showToast("Success", "Your account has been deactivated", "success");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }

  return (
    <>
      <Text my={1} fontWeight={'bold'}>Deactivate Account</Text>
      <Text my={1}>You can activate your account anytime by logging in. </Text>
      <Button size={'sm'} colorScheme="red" onClick={deactivateAccount} >Deactivate</Button>
    </>
  )
}

export default SettingsPage
