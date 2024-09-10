import React from "react";
import * as Yup from 'yup';
import { Form, Formik } from "formik";
import { MyTextInput } from "../components/MyTextInput";

import { Link, useHistory } from "react-router-dom";
import { AuthCard } from "../components/AuthCard";


export const Register = () => {
    const history = useHistory();

    return(
        <div>
          
          <Formik
            initialValues={{
              name: '',
              lastName: '',
              email: '',
              password1: '',
              password2: ''
            }}
            onSubmit={( values) => {
              console.log(values);
               // Guardar los datos en localStorage
               localStorage.setItem('userProfile', JSON.stringify(values));
              
              history.push("/dashboard/home");
            }}
            validationSchema={
              Yup.object({
                name: Yup.string()
                                .min(2, 'El Nombre debe de ser de 3 caracteres o más')
                                .required('Requerido'),
                lastName: Yup.string()
                                .min(2, 'El Nombre debe de ser de 3 caracteres o más')
                                .required('Requerido'),
                email: Yup.string()
                                .email('Revise el formato del correo')
                                .required('Requerido'),
                password1: Yup.string()
                                .min(6,'Minimo de 6 caracteres')
                                .required('Requerido'),
                password2: Yup.string()
                                .oneOf([ Yup.ref('password1') ], 'Contraseña no coinciden')
                                .required('Requerido'),
              })
            }

          >
        <AuthCard>
        <Form>
        <div className="text-center mb-2">
        </div>

        <MyTextInput
            label="Nombre"
            name="name"
            placeholder="Nombre"
          />

        <MyTextInput
            label="Apellido"
            name="lastName"
            placeholder="apellido"
          />
        
        <MyTextInput
            label="Correo"
            name="email"
            type="email"
            placeholder="gege@gege.com"
        />

        <MyTextInput
            label="Contraseña"
            name="password1"
            type="password"
            placeholder="*****"
        />

        <MyTextInput
            label="Confirmar contraseña"
            name="password2"
            type="password"
            placeholder="*****"
        />
        
        
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">
            Registrarse
          </button>
        </div>

        <div className="mt-3 mb-3 text-center">
           <h6> ¿Ya tienes una cuenta? </h6>
          <Link to="/auth/login">Iniciar Sesión</Link>
        </div>
      </Form>
      </AuthCard>

    </Formik>
    </div>
    //nombre, apellido, rut?, correo, contraseña, contraseña2 
    )
}