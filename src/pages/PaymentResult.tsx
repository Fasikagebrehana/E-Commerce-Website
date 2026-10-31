import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { useFetch } from "../hooks/useFetch";
import { verifyPayment } from "../api/payments/chapa";

// Chapa sends the shopper back here (the return_url set in the backend).
// The redirect alone proves nothing, so ask the backend to verify with Chapa.
export default function PaymentResult() {
    const [params] = useSearchParams();
    const txRef = params.get("tx_ref");
    const { clear } = useCart();
    const { data: payment, error, loading } = useFetch(txRef, () => verifyPayment(txRef!));

    const paid = payment?.status === "success";

    useEffect(() => {
        if (paid) clear();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paid]);

    if (!txRef) {
        return (
            <div className="mx-auto max-w-lg px-4 py-20 text-center">
                <h1 className="text-3xl font-semibold text-gray-900">No payment found</h1>
                <Link to="/cart" className="mt-8 inline-block rounded-full bg-gray-900 px-7 py-3 font-medium text-white hover:bg-gray-700">
                    Back to cart
                </Link>
            </div>
        );
    }

    if (loading) {
        return <p className="py-20 text-center text-gray-500">Verifying your payment...</p>;
    }

    return (
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
            {paid ? (
                <>
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-600">✓</div>
                    <h1 className="mt-6 text-3xl font-semibold text-gray-900">Payment successful!</h1>
                    <p className="mt-2 text-gray-500">Paid {payment.amount} {payment.currency}.</p>
                    <p className="mt-1 text-sm text-gray-400">Reference: {txRef}</p>
                    <Link to="/products" className="mt-8 inline-block rounded-full bg-gray-900 px-7 py-3 font-medium text-white hover:bg-gray-700">
                        Continue shopping
                    </Link>
                </>
            ) : (
                <>
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-100 text-3xl text-red-600">!</div>
                    <h1 className="mt-6 text-3xl font-semibold text-gray-900">Payment not completed</h1>
                    <p className="mt-2 text-gray-500">{error || "Your cart is still saved, so you can try again."}</p>
                    <Link to="/cart" className="mt-8 inline-block rounded-full bg-gray-900 px-7 py-3 font-medium text-white hover:bg-gray-700">
                        Back to cart
                    </Link>
                </>
            )}
        </div>
    );
}
