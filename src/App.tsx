import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { 
  Camera, 
  ArrowUpRight, 
  Github, 
  Linkedin, 
  Mail, 
  Menu, 
  X, 
  ChevronRight,
  Globe,
  Award,
  Zap,
  CheckCircle,
  Loader2
} from 'lucide-react';

// --- Components ---

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div 
        className="custom-cursor hidden md:block"
        animate={{ 
          x: mousePos.x - 10, 
          y: mousePos.y - 10,
          scale: isHovering ? 2.5 : 1
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 800, mass: 0.1 }}
      />
      <motion.div 
        className="custom-cursor-outline hidden md:block"
        animate={{ 
          x: mousePos.x - 20, 
          y: mousePos.y - 20,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.2 }}
      />
    </>
  );
};

const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.3);
    y.set(middleY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      transition={{ type: 'spring', damping: 15, stiffness: 150, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

const ParallaxImage = ({ src, alt, className = "" }: { src: string, alt: string, className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} className={`parallax-img-container bg-neutral-light/10 ${className}`}>
      <motion.img 
        src={src} 
        alt={alt} 
        style={{ y }} 
        className="parallax-img w-full h-[120%] object-cover absolute top-[-10%] left-0"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const Marquee = ({ items }: { items: string[] }) => {
  return (
    <div className="relative flex overflow-x-hidden bg-bg-dark py-12 border-y border-white/10">
      <div className="animate-marquee whitespace-nowrap flex">
        {items.concat(items).map((item, i) => (
          <span key={i} className="text-6xl md:text-8xl font-display font-black text-white/10 mx-8 uppercase tracking-tighter hover:text-accent transition-colors duration-500 cursor-default">
            {item} •
          </span>
        ))}
      </div>
      <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex">
        {items.concat(items).map((item, i) => (
          <span key={i} className="text-6xl md:text-8xl font-display font-black text-white/10 mx-8 uppercase tracking-tighter hover:text-accent transition-colors duration-500 cursor-default">
            {item} •
          </span>
        ))}
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#portfolio' },
    { name: 'Research', href: '#exhibitions' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${visible || mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'} ${isScrolled || mobileMenuOpen ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <motion.a 
          href="#home" 
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-display font-bold tracking-tighter"
        >
          YASHASVI<span className="text-accent">.</span>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.name} className="inline-block">
              <Magnetic>
                <a 
                  href={link.href} 
                  className="text-sm font-medium hover:text-accent transition-colors duration-300 uppercase tracking-widest relative group px-2 py-1"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </a>
              </Magnetic>
            </div>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 hover:bg-neutral-light rounded-full transition-colors" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-bg-dark z-[100] flex flex-col items-center justify-center h-screen w-screen"
          >
            <motion.button 
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="absolute top-8 right-8 text-white p-4 z-[110]" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} />
            </motion.button>
            <div className="flex flex-col items-center space-y-10">
              {navLinks.map((link, i) => (
                <motion.a 
                  key={link.name} 
                  href={link.href} 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="text-white text-5xl font-display font-bold hover:text-accent transition-colors tracking-tighter"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const titleWords = ["MACHINE", "LEARNING"];
  
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center section-padding pt-32 relative overflow-hidden bg-grid">
      {/* Background Blobs */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="bg-blob w-96 h-96 bg-accent/20 -top-20 -left-20"
      />
      <motion.div 
        animate={{ 
          x: [0, -50, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="bg-blob w-[30rem] h-[30rem] bg-accent/10 bottom-0 right-0"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 z-10">
          <div className="mb-6">
            {titleWords.map((word, i) => (
              <div key={i} className="text-reveal">
                <motion.h1 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="text-oversized text-[12vw] sm:text-[15vw] lg:text-[10vw]"
                >
                  {word}
                </motion.h1>
              </div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <p className="text-lg md:text-2xl text-neutral-medium max-w-xl mb-12 leading-relaxed">
              Engineering intelligent systems at the Big Data Center of Excellence. Specializing in Computer Vision, NLP, and Predictive Analytics.
            </p>
            
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex -space-x-4">
                {['python', 'tensorflow', 'opencv'].map((tech, i) => (
                  <motion.div 
                    key={tech} 
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 1.2 + (i * 0.1), type: 'spring' }}
                    className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-neutral-light flex items-center justify-center shadow-lg"
                  >
                    <Zap size={20} className="text-accent" />
                  </motion.div>
                ))}
              </div>
              <div className="text-sm font-medium">
                <span className="block text-bg-dark">B.TECH COMPUTER SCIENCE</span>
                <span className="block text-neutral-medium uppercase tracking-tighter">AKGEC GHAZIABAD</span>
              </div>
              <Magnetic>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(245, 166, 35, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="pill-button-accent flex items-center gap-2"
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView()}
                >
                  VIEW PROJECTS <ArrowUpRight size={18} />
                </motion.button>
              </Magnetic>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl bg-neutral-light flex items-center justify-center p-8 group"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-center"
            >
              <Camera size={80} className="text-accent mx-auto mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-3xl font-display font-bold mb-2">YASHASVI KHATRI</h3>
              <p className="text-neutral-medium uppercase tracking-widest">ML Engineer</p>
            </motion.div>
            <div className="absolute inset-0 bg-accent/5 mix-blend-overlay"></div>
          </motion.div>
          
          {/* Decorative Elements */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-12 -right-12 w-48 h-48 border border-accent/30 rounded-full flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-accent rounded-full"></div>
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent rounded-3xl -z-10 rotate-12"
          ></motion.div>
        </div>
      </div>
      
      {/* Background Text Element */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: '-100%' }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-full opacity-[0.03] select-none pointer-events-none whitespace-nowrap"
      >
        <h2 className="text-[25vw] font-display font-black tracking-tighter leading-none">
          ENGINEER 2025 • INNOVATOR • DEVELOPER • 
        </h2>
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="bg-bg-dark text-bg-light section-padding relative overflow-hidden bg-grid-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative z-10 rounded-2xl overflow-hidden aspect-square max-w-md mx-auto bg-white/5 flex items-center justify-center group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
              >
                <Globe size={120} className="text-accent opacity-50" />
              </motion.div>
            </motion.div>
            
            {/* Abstract Shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/10 rounded-full -z-0 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full -z-0"></div>
            
            {/* Crosshair Icons */}
            <div className="absolute top-0 left-0 text-accent"><Zap size={24} /></div>
            <div className="absolute bottom-0 right-0 text-accent"><Award size={24} /></div>
          </div>

          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-accent font-display font-bold tracking-[0.3em] uppercase mb-4 block">The Engineer</span>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-8 tracking-tighter">
                SOLVING WITH <br /><span className="text-accent">DATA.</span>
              </h2>
              <p className="text-lg text-neutral-medium mb-8 leading-relaxed">
                I am a Machine Learning Engineer at the Big Data Center of Excellence (BDCOE), where I engineer classification, clustering, and predictive models that drive 25% accuracy improvements in real-world systems.
              </p>
              <p className="text-lg text-neutral-medium mb-12 leading-relaxed">
                Currently pursuing my B.Tech in Computer Science at AKGEC, I focus on building automated ML workflows and conducting deep exploratory data analysis to identify trends and anomalies that shape the future of technology.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="text-3xl font-display font-bold text-white mb-2">94%</h4>
                  <p className="text-sm text-neutral-medium uppercase tracking-widest">Model Accuracy</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="text-3xl font-display font-bold text-white mb-2">40%</h4>
                  <p className="text-sm text-neutral-medium uppercase tracking-widest">Effort Reduction</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Background Oversized Text */}
      <div className="absolute top-1/2 -right-1/4 -translate-y-1/2 opacity-[0.02] select-none pointer-events-none rotate-90">
        <h2 className="text-[20vw] font-display font-black tracking-tighter">ENGINEER</h2>
      </div>
    </section>
  );
};

const Portfolio = () => {
  const projects = [
    { 
      id: 1, 
      title: "Hand Gesture Control", 
      category: "Computer Vision", 
      img: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=800", 
      size: "lg", 
      desc: "Real-time recognition using OpenCV and CNNs with 92% accuracy.",
      link: "https://github.com/Yashasvikhatri9/hand-gestures-control" 
    },
    { 
      id: 2, 
      title: "Fake News Prediction", 
      category: "NLP", 
      img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800", 
      size: "sm", 
      desc: "TF-IDF + Logistic Regression model achieving 94% accuracy.",
      link: "https://github.com/Yashasvikhatri9/FAKE-NEWS-PREDICTION-BY-LR" 
    },
    { 
      id: 3, 
      title: "The Tech Stack", 
      category: "Skills", 
      img: "", 
      size: "accent", 
      desc: "Python, TensorFlow, Scikit-learn, FastAPI.",
      link: "https://github.com" 
    },
    { 
      id: 4, 
      title: "EDA of Spotify", 
      category: "Data Analysis", 
      img: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=800", 
      size: "sm", 
      desc: "Exploratory analysis of music trends and feature correlations.",
      link: "https://github.com/Yashasvikhatri9/EDA_SPOTIFY" 
    },
    { 
      id: 5, 
      title: "Movie Recommendation", 
      category: "ML Systems", 
      img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800", 
      size: "lg", 
      desc: "Hybrid engine using collaborative filtering and matrix factorization.",
      link: "https://github.com/Yashasvikhatri9/MOVIE-RECOMMEND" 
    },
    { 
      id: 6, 
      title: "Face Recognition", 
      category: "Computer Vision", 
      img: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=800", 
      size: "sm", 
      desc: "Robust facial recognition and verification system using deep learning.",
      link: "https://github.com/Yashasvikhatri9/Face-Recognition" 
    },
  ];

  return (
    <section id="portfolio" className="section-padding bg-bg-light">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-display font-bold tracking-[0.3em] uppercase mb-4 block">Selected Projects</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter">PORTFOLIO.</h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-neutral-medium max-w-xs text-right hidden md:block"
          >
            Engineering solutions across Computer Vision, NLP, and Data Analytics.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -15, 
                skewX: -2,
                transition: { duration: 0.3 } 
              }}
              className={`relative rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 min-h-[400px] h-full ${
                project.size === 'lg' ? 'md:row-span-2 md:min-h-[832px]' : ''
              } ${project.size === 'accent' ? 'bg-accent flex flex-col justify-center p-12' : ''}`}
            >
              {project.size === 'accent' ? (
                <>
                  <h3 className="text-4xl font-display font-bold text-bg-dark mb-4">MY TOOLKIT</h3>
                  <p className="text-bg-dark/70 mb-8">{project.desc}</p>
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 45 }}
                    className="w-12 h-12 rounded-full bg-bg-dark text-white flex items-center justify-center"
                  >
                    <ArrowUpRight size={24} />
                  </motion.div>
                </>
              ) : (
                <>
                  <ParallaxImage 
                    src={project.img} 
                    alt={project.title} 
                    className="absolute inset-0 w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 z-10">
                    <motion.span 
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      className="text-accent text-xs font-bold tracking-widest uppercase mb-2"
                    >
                      {project.category}
                    </motion.span>
                    <h3 className="text-white text-2xl font-display font-bold mb-2">{project.title}</h3>
                    <p className="text-white/70 text-sm line-clamp-2">{project.desc}</p>
                  </div>
                </>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

const Exhibitions = () => {
  const events = [
    { id: '01', title: "Real-Time Video Tampering Detection", location: "Research Project", date: "2025", link: "https://github.com/Yashasvikhatri9/video-tampering" },
    { id: '02', title: "Fetal Head Biometry ML", location: "Research Project", date: "2026", link: "https://github.com/abhishekrajdhar/Research-1" },
    { id: '03', title: "Big Data Center of Excellence", location: "Machine Learning Engineer", date: "2024–Present", link: "#" },
    { id: '04', title: "AKGEC Ghaziabad", location: "B.Tech Computer Science", date: "2024–2028", link: "https://github.com/Yashasvikhatri9" },
  ];

  return (
    <section id="exhibitions" className="section-padding bg-neutral-light overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-accent font-display font-bold tracking-[0.3em] uppercase mb-4 block">Experience & Research</span>
          <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter">TIMELINE.</h2>
        </div>

        <div className="space-y-4">
          {events.map((event, i) => (
            <motion.a 
              key={event.id}
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group border-b border-neutral-medium/30 py-12 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-white transition-all duration-500 px-4 md:px-8 rounded-2xl cursor-pointer block"
            >
              <div className="flex items-center gap-8">
                <span className="text-xl font-display font-bold text-neutral-medium group-hover:text-accent transition-colors">{event.id}</span>
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight mb-2 group-hover:translate-x-2 transition-transform duration-300">{event.title}</h3>
                  <p className="text-neutral-medium uppercase tracking-widest text-sm">{event.location} — {event.date}</p>
                </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="pill-button self-start md:self-center whitespace-nowrap"
              >
                VIEW DETAILS
              </motion.div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server Error: ${text.substring(0, 50)}...`);
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      console.error('Error sending message:', error);
      setStatus('error');
      setErrorMessage(error.message);
    }
    
    // Reset status after 5 seconds
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" className="section-padding bg-bg-dark text-bg-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-display font-bold tracking-[0.3em] uppercase mb-4 block">Get in Touch</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-8">LET'S BUILD <br /><span className="text-accent">INTELLIGENCE.</span></h2>
            <p className="text-xl text-neutral-medium mb-12 max-w-md">
              Open for collaborations in ML research, data science projects, and software engineering.
            </p>
            
            <div className="space-y-6">
              <motion.a 
                whileHover={{ x: 10 }}
                href="mailto:yashasvi.khatri05@gmail.com" 
                className="flex items-center gap-4 text-xl sm:text-2xl font-display font-bold hover:text-accent transition-colors break-all"
              >
                <Mail className="text-accent shrink-0" /> yashasvi.khatri05@gmail.com
              </motion.a>
              <div className="flex items-center gap-4 text-xl font-display font-bold text-neutral-medium">
                <Globe className="text-accent shrink-0" /> +91-6396349899
              </div>
              <div className="flex gap-6 pt-6">
                {[
                  { Icon: Github, href: 'https://github.com/Yashasvikhatri9' },
                  { Icon: Linkedin, href: 'https://www.linkedin.com/in/yashasvi-khatri/' }
                ].map(({ Icon, href }, i) => (
                  <div key={i} className="inline-block">
                    <Magnetic>
                      <motion.a 
                        whileHover={{ y: -5, backgroundColor: '#F5A623', color: '#000' }}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300"
                      >
                        <Icon size={20} />
                      </motion.a>
                    </Magnetic>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/5 p-8 md:p-12 rounded-[2rem] backdrop-blur-sm border border-white/10 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center py-12 text-center h-full"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle size={40} className="text-bg-dark" />
                  </motion.div>
                  <h3 className="text-3xl font-display font-bold mb-4">MESSAGE SENT!</h3>
                  <p className="text-neutral-medium">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                  <motion.button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-accent font-bold uppercase tracking-widest text-sm hover:underline"
                  >
                    Send another message
                  </motion.button>
                </motion.div>
              ) : status === 'error' ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center py-12 text-center h-full"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6"
                  >
                    <X size={40} className="text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-display font-bold mb-4">SENDING FAILED</h3>
                  <p className="text-neutral-medium mb-2">{errorMessage || "Something went wrong."}</p>
                  <p className="text-xs text-neutral-medium/50 mb-6">Please try again or contact me directly via email.</p>
                  <motion.button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-accent font-bold uppercase tracking-widest text-sm hover:underline"
                  >
                    Try again
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-neutral-medium">Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors" 
                        placeholder="Yashasvi Khatri" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-neutral-medium">Email</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors" 
                        placeholder="yashasvi@example.com" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-medium">Message</label>
                    <textarea 
                      required
                      rows={4} 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors resize-none" 
                      placeholder="Let's discuss a project..."
                    ></textarea>
                  </div>
                  <motion.button 
                    disabled={status === 'sending'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full pill-button-accent py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        SENDING...
                      </>
                    ) : (
                      'SEND MESSAGE'
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-0"></div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-bg-dark text-bg-light py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="text-2xl font-display font-bold tracking-tighter cursor-pointer"
        >
          YASHASVI<span className="text-accent">.</span>
        </motion.div>
        
        <div className="flex space-x-8">
          <a href="https://github.com/Yashasvikhatri9" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-medium hover:text-white transition-colors">Github</a>
          <a href="https://www.linkedin.com/in/yashasvi-khatri/" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-medium hover:text-white transition-colors">LinkedIn</a>
        </div>
        
        <p className="text-sm text-neutral-medium">
          © 2025 Yashasvi Khatri. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-[100]" 
      style={{ scaleX }} 
    />
  );
};

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-bg-dark shadow-2xl z-40"
        >
          <ChevronRight className="-rotate-90" size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <div className="relative selection:bg-accent selection:text-bg-dark">
      <div className="noise-overlay" />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Marquee items={['Computer Vision', 'NLP', 'TensorFlow', 'PyTorch', 'OpenCV', 'Scikit-Learn', 'FastAPI', 'Data Analysis', 'Deep Learning']} />
        <Portfolio />
        <Exhibitions />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
