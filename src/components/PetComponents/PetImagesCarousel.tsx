import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const PetImagesCarousel = ({ petImages }: { petImages: any[] }) => {
  return (
    <Carousel
      className="w-full bg-gradient-to-r from-red-100 via-stone-50 to-red-100"
      showThumbs={false}
      infiniteLoop={true}
    >
      {petImages.map((image: any, index: any) => (
        <div key={index}>
          <img
            className="h-96 w-full object-contain"
            src={image}
            alt={`Pet Image ${index}`}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default PetImagesCarousel;
