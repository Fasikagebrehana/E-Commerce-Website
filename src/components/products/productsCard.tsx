
const ProductsCard = ({ product }: { product: any }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover mb-4" />
            <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-gray-800 font-bold">${product.price}</p>
        </div> 

    )
}
export default ProductsCard;