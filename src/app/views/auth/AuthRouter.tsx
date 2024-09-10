import { Login } from "./login/Login";
import { Register } from "./login/Register";
import {Switch, Route, Redirect} from 'react-router-dom';

export function AuthRouter(){
    return(
        <Switch>
            <Route exact path="/auth/login">
                <Login />

            </Route>
            <Route exact path="/auth/register" component={Register} />
            <Redirect to="/auth/login" />
        </Switch>
    )
}