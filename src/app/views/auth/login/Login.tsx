import { useContext, useState } from "react";
import { AuthCard } from "../components/AuthCard";
import { AuthCourse } from "../components/AuthCourse";
import accountIcon from '../../../icons/account.svg'
import passwordIcon from '../../../icons/password.svg'
import { AuthContext } from "../components/AuthContext";
import { Link, useHistory } from "react-router-dom";

export function Login(){
    const { dispatchUser } : any = useContext(AuthContext);
    const [ auth, setAuth ] = useState({ email: '', password: ''})
    const history = useHistory();


    const handleSubmit =async (e:React.ChangeEvent<HTMLFormElement>) =>{
      e.preventDefault();
      console.log("Datos enviados:", auth);
      try{
          console.log("Pres");
          const resp = await AuthCourse.login(auth.email, auth.password);
          console.log(resp)
          if (resp.data.login) {
            sessionStorage.setItem('user', JSON.stringify({ ...resp.date, loggedIn: true }));
            dispatchUser({ type: 'login', payload: resp.date });
            history.replace('/dashboard/home');
        } else {
            console.log('Credenciales incorrectas');
        }
      } catch (error){
        console.error('Error en el login:', error);
      }
    }

      const handleChange = (e: React.ChangeEvent<HTMLFormElement | HTMLInputElement>) => {
          setAuth({
            ...auth,
            [e.target.name]: e.target.value
          })
      }
        
    return(
        <div>
            <AuthCard>
                <form onSubmit={handleSubmit} autoComplete="off">
                <div className="text-center mb-2">
        </div>

        <div className="mb-2 p-1 d-flex border rounded">
          <div className="mx-2 mt-1"> 
            <img 
              className="img-fluid"
              src={accountIcon}
              alt="iconUser" />
          </div>
          <input
            autoFocus
            className="form-control txt-input"
            name="email"
            type="email"
            placeholder="pepito@alumnos.com"
            onChange={ e => handleChange(e) }
          />
        </div>

        <div className="mb-2 p-1 d-flex border rounded">
          <div className="mx-2 mt-1"> 
            <img 
              className="img-fluid"
              src={passwordIcon}
              alt="iconUser" />
          </div>
          <input
            className="form-control txt-input"
            name="password"
            type="password"
            placeholder="******"
            onChange={ e => handleChange(e) }
          />
        </div>


        <div className="row d-flex justify-content-between mt-3 mb-2">
          <div className="mb-3">
            <div className="form-check ms-1">
              <input
                type="checkbox"
                className="form-check-input"
                id="mycheckbox"
              />
              <label className="form-check-label" htmlFor="mycheckbox">
                Recordar
              </label>
            </div>
          </div>
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">
            Iniciar Sesión
          </button>
        </div>

        <div className="mt-3 mb-3 text-center">
          <h6>¿Olvidaste la contraseña?</h6>
          <Link to="/auth/recover">Recuperar contraseña</Link>
        </div>

        <div className="mt-3 mb-3 text-center">
           <h6>¿No tienes una cuenta?</h6>
          <Link to="/auth/register">Registrar</Link>
        </div>

        </form>   
            </AuthCard>
        </div>

    )
}