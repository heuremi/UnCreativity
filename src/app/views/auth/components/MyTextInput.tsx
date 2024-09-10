import { ErrorMessage, useField } from 'formik';

interface Props {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'rut' | 'password';
    placeholder?: string;
    [x: string]: any;
}

function validateRut(value: string) {
    // Regular expression to validate RUT format
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/;
    return rutRegex.test(value);
}

export const MyTextInput = ( { label, type='text', ...props }: Props ) => {

    const [ field,meta ] = useField(props)

    const validate = type === 'rut' ? validateRut : undefined;

    return (
        <>
            <label htmlFor={ props.id || props.name }>{ label }</label>
            <input 
                className={"text-input ${meta.touched && meta.error && 'is-invalid'}"}
                { ...field } 
                { ...props } 
                type={type === 'rut' ? 'text' : type} // Change type to 'text' for RUT input
                aria-describedby={`${props.name}-error`}
            />
            {meta.touched && meta.error ? (
                <div id={`${props.name}-error`} className="error-message">
                    <ErrorMessage name={props.name} />
                </div>
            ) : null}

        </>
    );
};