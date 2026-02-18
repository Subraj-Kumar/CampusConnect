import Slider from "react-slick";
import { Link } from "react-router-dom";

const UpcomingSlider = ({ events }) => {
  const settings = {
    dots: true,
    infinite: events.length > 1,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  if (events.length === 0) return null;

  return (
    <div className="relative mb-12 group">
      <Slider {...settings} className="overflow-hidden rounded-3xl shadow-2xl">
        {events.map((event) => (
          <div key={event._id} className="relative h-[400px] outline-none">
            {/* Background Image */}
            <img
              src={event.poster || "https://via.placeholder.com/1200x400?text=No+Poster"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            
            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
              <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                Happening Soon
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
                {event.title}
              </h2>
              <div className="flex items-center gap-6 text-gray-300 text-sm mb-6">
                <span>📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</span>
                <span>📍 {event.venue}</span>
              </div>
              <Link to={`/events/${event._id}`}>
                <button className="bg-white text-black font-black px-8 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 shadow-lg">
                  Grab Your Spot →
                </button>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default UpcomingSlider;