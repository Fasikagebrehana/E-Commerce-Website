
import { getProducts } from '../api/products';
import { useState, useEffect } from 'react';
import ProductsCard from '../components/products/productsCard';
// import product from '../components/products/productsCard';

const Home = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")
    
    useEffect(() => {
        const fetchProducts = async () => {
            try{
                setLoading(true);
                const data = await getProducts();
                setProducts(data.products);
                setError("")
            } catch (err) {
                setError("Failed to load products");
                console.error(err);
                
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [])
    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>{error}</div>
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1>Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductsCard key={product.id} product={product} />
                ))}
            </div>
            
        </div>
    )
}
export default Home;