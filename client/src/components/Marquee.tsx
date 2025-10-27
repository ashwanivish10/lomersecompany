import React, { useEffect, useRef } from 'react';

// Card data for testimonials. In a real app, this would likely come from an API.
const testimonials = [
  {
    name: 'Rajesh Kumar',
    username: '@rajeshk',
    avatar: 'https://i.pravatar.cc/40?u=rajesh',
    quote: "Lomerse has completely transformed my invoicing. The templates are clean and professional, saving me hours of work!"
  },
  {
    name: 'Aishwarya Patil',
    username: '@aishpatil',
    avatar: 'https://i.pravatar.cc/40?u=aishwarya',
    quote: "The user experience is top-notch. I love how intuitive and responsive everything feels. Truly a game changer for my freelance business."
  },
  {
    name: 'Vikram Singh',
    username: '@vikram_s',
    avatar: 'https://i.pravatar.cc/40?u=vikram',
    quote: "I’m blown away by the sleek design and instant PDF downloads. Lomerse has set a new standard for invoicing tools!"
  },
  {
    name: 'Priya Sharma',
    username: '@priyasharma',
    avatar: 'https://i.pravatar.cc/40?u=priya',
    quote: "A beautiful invoicing experience. I can’t imagine working without Lomerse now. It’s so smooth and aesthetically pleasing."
  },
  {
    name: 'Amit Patel',
    username: '@amitp',
    avatar: 'https://i.pravatar.cc/40?u=amit',
    quote: "Lomerse has taken my client billing to the next level. The pay-per-invoice option is perfect for my needs!"
  },
  {
    name: 'Neha Gupta',
    username: '@neha_g',
    avatar: 'https://i.pravatar.cc/40?u=neha',
    quote: "Such a simple yet powerful tool. The brand customization features are perfect for creating a premium feel for my brand!"
  },
  {
    name: 'Suresh Menon',
    username: '@smenon',
    avatar: 'https://i.pravatar.cc/40?u=suresh',
    quote: "I’m obsessed with how modern and clean the premium themes are. Lomerse makes it so easy to create stunning invoices."
  }
];

// Reusable Testimonial Card Component
const TestimonialCard: React.FC<typeof testimonials[0]> = ({ name, username, avatar, quote }) => (
  // --- YAHAN CHANGES KIYE HAIN ---
  <figure className="flex-shrink-0 w-72 h-44 cursor-pointer overflow-hidden rounded-xl p-5 bg-card backdrop-blur-lg border border-border shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex items-center gap-4">
      <img className="rounded-full border-2 border-border w-10 h-10" alt={name} src={avatar} />
      <div className="flex flex-col">
        <figcaption className="text-md font-bold text-foreground">{name}</figcaption>
        <p className="text-sm font-medium text-muted-foreground">{username}</p>
      </div>
    </div>
    <blockquote className="mt-3 text-sm text-foreground/80 line-clamp-3 whitespace-normal italic">
      “{quote}”
    </blockquote>
  </figure>
);

// Main Marquee Component
export default function Marquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect handles the pause-on-hover functionality
    const marqueeElement = marqueeRef.current;
    if (marqueeElement) {
      const handleMouseEnter = () => marqueeElement.style.animationPlayState = 'paused';
      const handleMouseLeave = () => marqueeElement.style.animationPlayState = 'running';

      marqueeElement.addEventListener('mouseenter', handleMouseEnter);
      marqueeElement.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        marqueeElement.removeEventListener('mouseenter', handleMouseEnter);
        marqueeElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <div className="w-full overflow-hidden relative py-12">
      {/* Gradient overlays for a fading effect on the edges */}
      <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-background to-transparent z-10"></div>
      <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-background to-transparent z-10"></div>
      
      {/* The marquee container that holds the animated content */}
      <div ref={marqueeRef} className="animate-marquee will-change-transform">
        <div className="flex items-center gap-6">
          {/* Render the testimonials twice for a seamless loop */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
}

