import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PagoExitoso = () => {
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");

    useEffect(() => {
        console.log("Pago exitoso:", { paymentId, status });
    }, [paymentId, status]);

    return <h1>✅ ¡Pago exitoso! Tu compra ha sido procesada correctamente.</h1>;
};

export default PagoExitoso;