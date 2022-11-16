// ** Router Import
import Router from "./router/Router";
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUsersHttp } from "./redux/actions/users";
import useGetUsers from "./utility/hooks/useGetUsers";
const App = (props) => {
  
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
  
      <Router />
  
  
    </SnackbarProvider>
  )
}

export default App;
