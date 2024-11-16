import { useState } from "react";
import { Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";



export default function CustomButton({ courseId, handleAddToCart, inCart} : {courseId: number, handleAddToCart: (course: number) => Promise<void>, inCart: Boolean}) {


    const [loading, setLoading] = useState(false)
    
    const handleOnClickButton = async () => {
        if(!loading) {
            console.log("bloqueado")
            setLoading(true)
            await handleAddToCart(courseId)
            setTimeout(() => { setLoading(false); console.log("libre")}, 900)
        }
    }

    return (
        <Button
            variant="success"
            onClick={handleOnClickButton} 
            className="items-center justify-center"
        >
            { loading ? <ClipLoader size={16} color='white' /> : <p>{inCart ? 'Eliminar del carrito' : 'Agregar al Carrito'}</p>}
        </Button>
    )

};
