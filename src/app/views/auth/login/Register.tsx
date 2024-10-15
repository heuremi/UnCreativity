import React from "react";
import * as Yup from 'yup';
import { Form, Formik } from "formik";
import { MyTextInput } from "../components/MyTextInput";
import { Link, useHistory } from "react-router-dom";
import { AuthCard } from "../components/AuthCard";
import { AuthCourse } from "../components/AuthCourse";

import './Register.css';

export const Register = () => {
  const history = useHistory();

  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          lastName: '',
          email: '',
          password1: '',
          password2: ''
        }}
        onSubmit={async (values) => {
          try {
            console.log('Enviando datos:', values);

            // Llama a AuthCourse para enviar los datos al backend
            const response = await AuthCourse.register({
              name: values.name,
              lastName: values.lastName,
              email: values.email,
              password1: values.password1,
              password2: values.password2,
            });

            console.log('Respuesta del backend:', response);

            if (response.success) {
              // Redirigir al dashboard si el registro fue exitoso
              history.push("/dashboard/home");
            } else {
              alert('Error en el registro: ' + response.message);
            }
          } catch (error) {
            console.error('Error en el registro:', error);
            alert('Hubo un problema con el registro.');
          }
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .min(2, 'El nombre debe de ser de 3 caracteres o más')
            .required('Requerido'),
          lastName: Yup.string()
            .min(2, 'El apellido debe de ser de 3 caracteres o más')
            .required('Requerido'),
          email: Yup.string()
            .email('Revise el formato del correo')
            .required('Requerido'),
          password1: Yup.string()
            .min(6, 'Mínimo de 6 caracteres')
            .required('Requerido'),
          password2: Yup.string()
            .oneOf([Yup.ref('password1')], 'Las contraseñas no coinciden')
            .required('Requerido'),
        })}
      >
        <AuthCard>
          <Form>
            <MyTextInput label="Nombre" name="name" placeholder="Nombre" />
            <MyTextInput label="Apellido" name="lastName" placeholder="Apellido" />
            <MyTextInput label="Correo" name="email" type="email" placeholder="ejemplo@correo.com" />
            <MyTextInput label="Contraseña" name="password1" type="password" placeholder="*****" />
            <MyTextInput label="Confirmar contraseña" name="password2" type="password" placeholder="*****" />

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                Registrarse
              </button>
            </div>

            <div className="mt-3 mb-3 text-center">
              <h6>¿Ya tienes una cuenta?</h6>
              <Link to="/auth/login">Iniciar Sesión</Link>
            </div>
          </Form>
        </AuthCard>
      </Formik>
    </div>
  );
};
