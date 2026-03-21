
"use client";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith('/en');
  return (
    <footer className="relative z-10 bg-[#0a0a0a] text-white/40 py-6 border-t border-white/[0.07]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Chien-Sheng Liu. {isEnglish ? 'All rights reserved.' : '版權所有.'}
          </p>
          <div className="flex space-x-4">
            <a href="https://github.com/chien-sheng-liu" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
              <FaGithub size={24} />
            </a>
            <a href="https://www.linkedin.com/in/chienshengliu/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
