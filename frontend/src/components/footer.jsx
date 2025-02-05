import React,{useState} from 'react';
import { Home, Twitter, Facebook, Instagram, Github } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// FooterColumn component
const FooterColumn = ({ title, children, className = '' }) => {
  return (
    <div className={className}>
      <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">{title}</p>
      {children}
    </div>
  );
};

// FooterLink component
const FooterLink = ({ href, children }) => {
  return (
    <a 
      href={href} 
      className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
    >
      {children}
    </a>
  );
};

// SocialLinks component
const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Github, href: '#', label: 'GitHub' },
];

const SocialLinks = () => {
  return (
    <ul className="flex items-center space-x-3 pt-10">
      {socialLinks.map(({ icon: Icon, href, label }) => (
        <li key={label}>
          <a
            href={href}
            title={label}
            className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-blue-600 focus:bg-blue-600"
          >
            <Icon className="w-4 h-4 top-3" />
          </a>
        </li>
      ))}
    </ul>
  );
};

// Newsletter component
const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/news/newsdata', { email });
      if (response.status === 200) {
        toast.success('You have successfully subscribed to our newsletter!');
        setEmail(''); // Clear the input field
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
      <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
        Subscribe to newsletter
      </p>
      
      <form onSubmit={handleSubmit} className="mt-6">
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
          />
        </div>
        
        <button
          type="submit"
          className="inline-flex items-center justify-center px-6 py-4 mt-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700"
        >
          Subscribe
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

// Footer component
const companyLinks = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
];

const helpLinks = [
  { name: 'Customer Support', href: '/' },
  { name: 'Terms & Conditions', href: '/' },
  { name: 'Privacy Policy', href: '/' },
];

const Footer = () => {
  return (
    <section className="py-10 bg-gray-100 sm:pt-16 lg:pt-24 min-h-96">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
          {/* Brand Column */}
          <FooterColumn title="" className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
            <div className="flex items-center mb-4">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">BuildEstate</span>
            </div>
            
            <p className="text-base leading-relaxed text-gray-600 mt-7">
              Your trusted partner in finding the perfect home for you and your family.
            </p>
            
            <SocialLinks />
          </FooterColumn>

          {/* Company Links */}
          <FooterColumn title="Company">
            <ul className="mt-6 space-y-4">
              {companyLinks.map(link => (
                <li key={link.name}>
                  <FooterLink href={link.href}>{link.name}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Help Links */}
          <FooterColumn title="Help">
            <ul className="mt-6 space-y-4">
              {helpLinks.map(link => (
                <li key={link.name}>
                  <FooterLink href={link.href}>{link.name}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Newsletter */}
          <Newsletter />
        </div>

        <hr className="mt-16 mb-10 border-gray-200" />
        
        <p className="text-sm text-center text-gray-600">
          © Copyright {new Date().getFullYear()}, All Rights Reserved by BuildEstate
        </p>
      </div>
    </section>
  );
};

export default Footer;