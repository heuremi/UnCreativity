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
    try{
        const resp = await AuthCourse.login(auth.email, auth.password);
        const { login } = resp.data;
        
        console.log(resp)
        if (resp.data.login.success) {
          sessionStorage.setItem('user', JSON.stringify({ id: login.id, loggedIn: true })); // (cristian) cambie esto pero no se si esta bueno
          dispatchUser({ type: 'login', payload: login.id });
          history.replace('/dashboard/home');
      } else if (login.id !== -1) {
          console.log('Credenciales incorrectas');
      } else {
          console.log("Usuario no existe")
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

      <div className="flex-1 mb-2 p-1 d-flex border rounded items-center">
        <div className="mx-2 mt-0 content-center"> 
          <img 
            className="img-fluid"
            src={accountIcon}
            alt="iconUser" />
        </div>
        <div className="flex w-full justify-center items-center">
          <input
            autoFocus
            className="form-control txt-input mx-auto"
            name="email"
            type="email"
            placeholder="pepito@alumnos.com"
            onChange={(e) => handleChange(e)}
          />
        </div>

      </div>

      <div className="mb-2 p-1 d-flex border rounded">
        <div className="mx-2 mt-1 content-center"> 
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
        <Link to="/auth/recover" className="text-blue-700 underline">Recuperar contraseña</Link>
      </div>

      <div className="mt-3 mb-3 text-center">
          <h6>¿No tienes una cuenta?</h6>
        <Link className="text-blue-600 underline" to="/auth/register">Registrar</Link>
      </div>

      </form>   
          </AuthCard>
      </div>

  )
}