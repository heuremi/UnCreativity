import React, { useEffect, useState } from "react";
import * as Yup from 'yup';
import { Form, Formik } from "formik";
import { MyTextInput } from "../components/MyTextInput";
import { Link, useHistory } from "react-router-dom";
import { AuthCard } from "../components/AuthCard";
import './EditProfile.css';

export const EditProfile = () => {
    const history = useHistory();
    const [initialValues, setInitialValues] = useState({
        name: '',
        lastName: '',
        email: '',
        password1: '',
        password2: ''
    });

   // Cargar datos del usuario al montar el componente
useEffect(() => {
    const userProfileStr = localStorage.getItem('userProfile');
    if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        setInitialValues({
            name: userProfile.name,
            lastName: userProfile.lastName,
            email: userProfile.email,
            password1: '', // Vacío por seguridad
            password2: ''  // Vacío por seguridad
        });
    } else {
        // Manejar el caso donde no hay perfil de usuario
        console.log('No se encontró el perfil de usuario.');
    }
}, []);


    return (
        <div>
          <Formik
            initialValues={initialValues}
            enableReinitialize // Permite que el formulario se actualice cuando cambien los initialValues
            onSubmit={(values) => {
              console.log("Valores actualizados:", values);
              // Guardar los datos actualizados en localStorage
              localStorage.setItem('userProfile', JSON.stringify(values));
              history.push("/dashboard/home");
            }}
            validationSchema={Yup.object({
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
            })}
          >
            <AuthCard>
              <Form>
                <div className="text-center mb-2">
                  <h2>Editar Perfil</h2>
                </div>

                <MyTextInput
                    label="Nombre"
                    name="name"
                    placeholder="Nombre"
                />

                <MyTextInput
                    label="Apellido"
                    name="lastName"
                    placeholder="Apellido"
                />

                <MyTextInput
                    label="Correo"
                    name="email"
                    type="email"
                    placeholder="correo@correo.com"
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
                    Guardar Cambios
                  </button>
                </div>

                <div className="mt-3 mb-3 text-center">
                  <Link to="/dashboard/home">Cancelar</Link>
                </div>
              </Form>
            </AuthCard>
          </Formik>
        </div>
    );
}
