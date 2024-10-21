import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { AuthContext } from "../views/auth/components/AuthContext";
import { AuthRouter } from "../views/auth/AuthRouter";
import { Register } from "../views/auth/login/Register";
import { Container, Navbar } from "react-bootstrap";
import { Home } from "../views/dashboard/home/Home";
import { useContext } from "react";
import { SessionProvider } from 'next-auth/react'; 
import { Profile } from "../views/dashboard/home/Profile";
import { Recover } from "../views/auth/login/Recover";



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
                    <Route exact path="/">
                        <Redirect to='/dashboard/home' />
                    </Route>
                    <Route path='/auth/login' component={AuthRouter} />
                    <Route path ='/auth/register' component={Register} />
                    <Route path='/auth/recover' component={Recover} />
                
                     {(user?.loggedIn || user) && (
                        <>
                            <Navbar />
                            <Container className="mb-4">
                                <Route path='/dashboard/home' component={Home} />
                                <Route path='/dashboard/profile' component={Profile} />
                            </Container>
                        </>
                     )}        
                    <Redirect to="/" />
                    
                </Switch>
            </Router>
        </SessionProvider>
    );
}