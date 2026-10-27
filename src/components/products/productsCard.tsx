import React from "react";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
type product= {
    id: number;
    title: string;
    description: string;
    price: number;
    images: string[];
    rating: number;
    reviews: [{ rating: number; comment: string, reviewerName: string;
    reviewerEmail: string; }];
    category: string;
    stock: number;
    brand: string;
}
const ProductsCard = ({ product }: { product: product }) => {

    return (
        <Link to={`/product/${product.id}`} className="block">
        <div className="bg-white shadow-md rounded-lg p-4">
            <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover mb-4" />
            <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-gray-800 font-bold">${product.price}</p>
        </div> 
        </Link>

    )
}
export default ProductsCard;