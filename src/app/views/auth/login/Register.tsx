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
          rut: '',
          phoneNumber: '',
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
              rut: values.rut,
              phoneNumber: values.phoneNumber,
              password1: values.password1,
              password2: values.password2,
            });

            const { createCliente, errors} = response.data
            console.log(response.data)
            console.log('Respuesta del backend:', createCliente);
            console.log("REspoue: ", errors)

            if (createCliente) {
              // Redirigir al dashboard si el registro fue exitoso
              history.push("/dashboard/home");
            } else {
              alert('Error en el registro: ' + response.statusText);
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
          rut: Yup.string()
            .min(9, 'El rut no coincide en caracteres')
            .required('Requerido'),  
          phoneNumber: Yup.string()
            .min(8, 'Numero de telefono no existente')
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
            <MyTextInput label="Rut" name="rut" placeholder="9.999.999-9" />
            <MyTextInput label="Telefono" name="phoneNumber" placeholder="9 99999999" />
            <MyTextInput label="Contraseña" name="password1" type="password" placeholder="*****" />
            <MyTextInput label="Confirmar contraseña" name="password2" type="password" placeholder="*****" />

            <div className="d-grid gap-1 my-2">
              <button type="submit" className="btn btn-primary">
                Registrarse
              </button>
            </div>

            <div className="mt-3 mb-3 text-center">
              <h6>¿Ya tienes una cuenta?</h6>
              <Link to="/auth/login" className="text-blue-600 underline">Iniciar Sesión</Link>
            </div>
          </Form>
        </AuthCard>
      </Formik>
    </div>
  );
};
