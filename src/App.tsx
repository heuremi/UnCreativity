import { useReducer } from "react";
import { AppRouter } from "./app/router/AppRouter";
import { AuthContext } from "./app/views/auth/components/AuthContext";
import { authReducer } from "./app/views/auth/components/AuthReducers";
import "bootstrap/dist/css/bootstrap.min.css"

function App() {

  const [user, dispatchUser ] = useReducer(authReducer, {});
  
  return (
      <AuthContext.Provider value={{user, dispatchUser}}>
        <AppRouter />
      </AuthContext.Provider>


  );
}

export default App;
