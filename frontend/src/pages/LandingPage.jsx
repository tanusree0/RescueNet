import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Shield, Heart, PawPrint, Star, Mail } from 'lucide-react';
import { images } from '../assets/images';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Reporter',
    text: 'Reported an injured stray dog in my locality. Within 20 minutes a volunteer arrived. Amazing platform!',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Volunteer',
    text: 'I get real-time alerts for nearby rescues. The live tracking makes it so easy to reach the location.',
    rating: 5,
  },
  {
    name: 'Anita Das',
    role: 'Reporter',
    text: 'Saved a wounded bird. The rescuer was professional and the whole process was smooth. Highly recommend!',
    rating: 5,
  },
];

function VolunteerImage({ src, fallback, alt }) {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [errored, setErrored] = React.useState(false);

  const handleError = () => {
    if (!errored && fallback) {
      setImgSrc(fallback);
      setErrored(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img
          src={images.hero}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.35]"
          alt="Animal rescue"
        />
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <PawPrint className="text-amber-300" size={24} />
            <span className="font-semibold">Emergency Rescue Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl tracking-tight">
            RescuePaw
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-gray-100 font-medium">
            Connect injured animals with nearby rescuers in real-time. Report, track, and save lives.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-amber-500 hover:bg-amber-600 px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition shadow-xl shadow-amber-500/30"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 px-10 py-4 rounded-full font-bold text-lg transition border border-white/30"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About / How can you help */}
      <section id="about" className="py-24 px-6 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            How can you help?
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            RescuePaw connects people who spot injured animals with nearby volunteers. Report incidents with photo proof and GPS, or join as a rescuer to receive alerts.
          </p>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Reporter Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-amber-100 group hover:shadow-2xl hover:border-amber-300 transition-all duration-500">
              <div className="overflow-hidden rounded-2xl mb-6 h-48 bg-gray-100">
                <img
                  src={images.reporterBanner}
                  alt="Reporter"
                  onError={(e) => { e.target.src = images.volunteerBanner; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition">
                <Shield className="text-amber-600" size={28} />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">I am a Reporter</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Spotted an injured animal? Report with GPS and photo. Nearby rescuers get instant alerts.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="font-bold text-amber-600 flex items-center gap-2 hover:text-amber-700 underline underline-offset-4"
              >
                Report an incident <ArrowRight size={18} />
              </button>
            </div>

            {/* Volunteer Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 group hover:shadow-2xl hover:border-emerald-300 transition-all duration-500">
              <div className="overflow-hidden rounded-2xl mb-6 h-48 bg-gray-100">
                <VolunteerImage
                  src={images.volunteerBanner}
                  fallback={images.volunteerBannerFallback}
                  alt="Volunteer rescuer"
                />
              </div>
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:-rotate-6 transition">
                <Heart className="text-emerald-600" size={28} />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">I am a Rescuer</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Receive alerts within 5km. Accept missions, navigate to location, and update status.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="font-bold text-emerald-600 flex items-center gap-2 hover:text-emerald-700 underline underline-offset-4"
              >
                Open Volunteer Dashboard <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            What people say
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-xl mx-auto">
            Real stories from reporters and volunteers
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-amber-50 p-6 rounded-3xl border border-amber-100 hover:shadow-lg transition"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="fill-amber-400 text-amber-400" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-gray-800">{t.name}</p>
                <p className="text-sm text-amber-600">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            Have questions? Reach out to us.
          </p>
          <a
            href="mailto:rescuepaw@example.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition"
          >
            <Mail size={20} /> rescuepaw@example.com
          </a>
        </div>
      </section>
    </div>
  );
}
