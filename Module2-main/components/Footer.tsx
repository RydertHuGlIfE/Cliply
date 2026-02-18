import React, { useEffect, useRef } from 'react';

const Footer: React.FC = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          window.scrollTo({ top: 0, behavior: 'auto' });
          alert("KEEP MOVING! REST IS FOR THE WEAK.");
        }
      });
    }, { threshold: 0.5 });

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="bg-black py-20 border-t border-[#333] text-center">
      <h2 className="text-[#ccfa00] text-4xl font-bold mb-4">ZENITH SYSTEMS</h2>
      <p className="text-gray-500 font-mono">EST 2024. NO SURRENDER.</p>
    </footer>
  );
};

export default Footer;