import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { AuthContext } from "../views/auth/components/AuthContext";
import { AuthRouter } from "../views/auth/AuthRouter";
import { Register } from "../views/auth/login/Register";
import { Container, Navbar } from "react-bootstrap";
import { Home } from "../views/dashboard/home/Home";
import { useContext } from "react";
import { SessionProvider } from 'next-auth/react'; 

interface Context{
    dispachUser?: any;
    user?: User;
}

interface User{
    loggedIn: boolean;
}

export function AppRouter(){
    const {user}: Context = useContext(AuthContext);

    return(
        <SessionProvider session={null}>
            <Router>
                <Switch>

                    <Route path='/auth/login' component={AuthRouter} />
                    <Route path ='/auth/register' component={Register} />
                
                     {(user?.loggedIn || user) && (
                        <>
                            <Navbar />
                            <Container className="mb-4">
                                <Route path='/dashboard/home' component={Home} />
                                </Container>
                        </>
                     )}        
                    <Redirect to="/" />
                    
                </Switch>
            </Router>
        </SessionProvider>
    );
}