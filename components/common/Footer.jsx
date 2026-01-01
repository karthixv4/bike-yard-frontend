import React from 'react';
import { Bike, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-nothing-black border-t border-nothing-gray py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-nothing-white">
            <div className="w-8 h-8 bg-nothing-red rounded-lg flex items-center justify-center">
              <Bike size={20} className="text-white" />
            </div>
            <span className="font-medium tracking-tight">Bike Yard</span>
          </div>
          <p className="text-nothing-muted text-sm leading-relaxed">
            Reimagining the refurbished marketplace with transparency, trust, and technology.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="p-2 bg-nothing-dark rounded-full text-nothing-muted hover:text-white transition-colors border border-nothing-gray hover:border-nothing-white">
              <Twitter size={16} />
            </a>
            <a href="#" className="p-2 bg-nothing-dark rounded-full text-nothing-muted hover:text-white transition-colors border border-nothing-gray hover:border-nothing-white">
              <Instagram size={16} />
            </a>
            <a href="#" className="p-2 bg-nothing-dark rounded-full text-nothing-muted hover:text-white transition-colors border border-nothing-gray hover:border-nothing-white">
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-4">
          <h4 className="text-sm font-mono uppercase tracking-widest text-nothing-white">Platform</h4>
          <ul className="space-y-2 text-sm text-nothing-muted">
            <li><a href="#" className="hover:text-nothing-red transition-colors">Buy Refurbished</a></li>
            <li><a href="#" className="hover:text-nothing-red transition-colors">Sell Your Bike</a></li>
            <li><a href="#" className="hover:text-nothing-red transition-colors">Spare Parts</a></li>
            <li><a href="#" className="hover:text-nothing-red transition-colors">Mechanic Services</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-4">
          <h4 className="text-sm font-mono uppercase tracking-widest text-nothing-white">Company</h4>
          <ul className="space-y-2 text-sm text-nothing-muted">
            <li><a href="#" className="hover:text-nothing-red transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-nothing-red transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-nothing-red transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-nothing-red transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        {/* Newsletter / Contact */}
        <div className="space-y-4">
          <h4 className="text-sm font-mono uppercase tracking-widest text-nothing-white">Stay Updated</h4>
          <p className="text-nothing-muted text-sm">Get the latest drops and mechanic tips.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-nothing-dark border border-nothing-gray rounded-lg px-4 py-2 text-sm text-nothing-white outline-none focus:border-nothing-white w-full transition-colors"
            />
            <button className="bg-nothing-white text-nothing-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-nothing-gray flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-nothing-muted font-mono">© 2026 Bike Yard. All rights reserved.</p>
        <div className="flex items-center gap-2 text-xs text-nothing-muted">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Systems Operational
        </div>
      </div>
    </footer>
  );
};

export default Footer;