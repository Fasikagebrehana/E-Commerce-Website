import { useState } from "react";

const ImageGallery = ({ images, title }: { images: string[]; title: string }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (images.length === 0) {
        return <div className="aspect-square w-full bg-gray-100" />;
    }

    return (
        <div className="flex flex-col-reverse gap-4 md:flex-row">
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto md:flex-col md:overflow-visible">
                    {images.map((image, index) => (
                        <button
                            key={image}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`h-24 w-20 shrink-0 border-2 bg-gray-100 md:h-32 md:w-28 ${
                                index === activeIndex ? "border-emerald-400" : "border-transparent hover:border-gray-300"
                            }`}
                            aria-label={`Show image ${index + 1}`}
                        >
                            <img src={image} alt="" className="h-full w-full object-contain" />
                        </button>
                    ))}
                </div>
            )}

            <div className="flex aspect-square flex-1 items-center justify-center bg-gray-100">
                <img src={images[activeIndex]} alt={title} className="h-full w-full object-contain" />
            </div>
        </div>
    );
};

export default ImageGallery;
