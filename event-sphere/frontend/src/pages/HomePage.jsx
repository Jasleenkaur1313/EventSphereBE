import React, { useState, useEffect, useRef, useCallback } from 'react';
import socket from '../socket';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import QuoteSection from '../components/QuoteSection';
import AboutSection from '../components/AboutSection';
import ConsentInfo from '../components/ConsentInfo';
import CategoriesSection from '../components/CategoriesSection';
import ContactForm from '../components/ContactForm';
import CalendarPopup from '../components/CalendarPopup';
import Footer from '../components/Footer';
import EventDetails from '../components/EventDetails';

// Complete event data matching home.html
const mockEventData = {
    sports: [
        { img: "https://placehold.co/400x250/87CEEB/ffffff?text=Football+Tournament", title: "Intercollege Football Tournament", desc: "Join the thrilling battle of goals and glory! Teams from across the region will compete for the grand trophy.", price: 150, id: "evt-sports-001" },
        { img: "https://placehold.co/400x250/6495ED/ffffff?text=Basketball+League", title: "Annual Basketball League", desc: "Experience fast-paced action and skill as college teams face off in this high-energy basketball league.", id: "evt-sports-002" },
        { img: "https://placehold.co/400x250/00BFFF/ffffff?text=Cricket+Match", title: "Cricket Carnival", desc: "The most awaited cricket match of the year — where sixes, cheers, and rivalry fill the air.", price: 100, id: "evt-sports-003" },
        { img: "https://placehold.co/400x250/1E90FF/ffffff?text=Athletics+Meet", title: "Annual Athletics Meet", desc: "Show your strength, stamina, and speed across multiple track and field events.", id: "evt-sports-004" },
        { img: "https://placehold.co/400x250/4682B4/ffffff?text=Table+Tennis", title: "Table Tennis Showdown", desc: "A fast-paced table tennis tournament to test your reflexes and focus.", price: 50, id: "evt-sports-005" },
    ],
    comedy: [
        { img: "https://placehold.co/400x250/FFA07A/ffffff?text=Stand-Up+Night", title: "Campus Stand-Up Night", desc: "Laugh out loud as budding comedians take the stage with hilarious sets.", price: 200, id: "evt-comedy-001" },
        { img: "https://placehold.co/400x250/FF7F50/ffffff?text=Mimicry+Show", title: "Mimicry Madness", desc: "Impersonations, jokes, and laughter guaranteed — can you guess who's who?", id: "evt-comedy-002" },
        { img: "https://placehold.co/400x250/FF6347/ffffff?text=Funny+Skit", title: "Funny Skit Competition", desc: "Teams perform short comic plays that'll have you in splits.", price: 80, id: "evt-comedy-003" },
        { img: "https://placehold.co/400x250/FF4500/ffffff?text=Comedy+Battle", title: "Comedy Battle", desc: "The ultimate face-off between the funniest minds on campus.", id: "evt-comedy-004" },
        { img: "https://placehold.co/400x250/DC143C/ffffff?text=Improv+Night", title: "Improv Night", desc: "Unscripted humor at its best — watch comedians create scenes on the spot.", id: "evt-comedy-005" },
    ],
    theatre: [
        { img: "https://placehold.co/400x250/90EE90/ffffff?text=Stage+Play", title: "Classic Stage Drama", desc: "Experience a powerful theatrical performance that blends art and storytelling.", price: 120, id: "evt-theatre-001" },
        { img: "https://placehold.co/400x250/3CB371/ffffff?text=Mono+Act", title: "Mono Act Challenge", desc: "Watch performers captivate the audience with solo acting brilliance.", id: "evt-theatre-002" },
        { img: "https://placehold.co/400x250/2E8B57/ffffff?text=Street+Play", title: "Nukkad Natak", desc: "An open-air street performance spreading social awareness through theatre.", id: "evt-theatre-003" },
        { img: "https://placehold.co/400x250/228B22/ffffff?text=Drama+Festival", title: "Intercollege Drama Fest", desc: "Teams compete with thought-provoking dramas and stage plays.", price: 180, id: "evt-theatre-004" },
        { img: "https://placehold.co/400x250/006400/ffffff?text=Mime+Act", title: "Mime Magic", desc: "A silent performance that speaks volumes through expressions and gestures.", id: "evt-theatre-005" },
    ],
    movies: [
        { img: "https://placehold.co/400x250/FF69B4/ffffff?text=Movie+Night", title: "Open-Air Movie Night", desc: "Enjoy a blockbuster under the stars with popcorn and friends.", price: 100, id: "evt-movies-001" },
        { img: "https://placehold.co/400x250/FF1493/ffffff?text=Short+Film", title: "Short Film Showcase", desc: "Watch creative short films by talented student filmmakers.", id: "evt-movies-002" },
        { img: "https://placehold.co/400x250/DB7093/ffffff?text=Film+Quiz", title: "Film Trivia Night", desc: "Test your cinema knowledge in a fun quiz about classics and blockbusters.", id: "evt-movies-003" },
        { img: "https://placehold.co/400x250/C71585/ffffff?text=Director's+Talk", title: "Director's Talk", desc: "Meet local filmmakers and learn the craft behind the camera.", id: "evt-movies-004" },
        { img: "https://placehold.co/400x250/FFB6C1/ffffff?text=Animation+Fest", title: "Animation Fest", desc: "Explore student-made animations and visual storytelling art.", price: 60, id: "evt-movies-005" },
    ],
    concerts: [
        { img: "https://placehold.co/400x250/8A2BE2/ffffff?text=Rock+Concert", title: "Rock Night", desc: "Feel the energy as live bands set the stage on fire!", price: 300, id: "evt-concerts-001" },
        { img: "https://placehold.co/400x250/9370DB/ffffff?text=EDM+Party", title: "EDM Party", desc: "Dance to electrifying beats with DJ sets lighting up the night.", price: 250, id: "evt-concerts-002" },
        { img: "https://placehold.co/400x250/BA55D3/ffffff?text=Acoustic+Evening", title: "Acoustic Evening", desc: "Relax and unwind with soulful acoustic tunes.", id: "evt-concerts-003" },
        { img: "https://placehold.co/400x250/9932CC/ffffff?text=Battle+of+Bands", title: "Battle of the Bands", desc: "Student bands compete for the title of campus rockstar.", price: 150, id: "evt-concerts-004" },
        { img: "https://placehold.co/400x250/9400D3/ffffff?text=Fusion+Night", title: "Fusion Night", desc: "A blend of classical and modern music — one mesmerizing evening!", id: "evt-concerts-005" },
    ]
};

export default function HomePage({ onNavigate, onToggleTheme, onLogout, isAdmin }) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [backendEvents, setBackendEvents] = useState({});
  const [categoryViewers, setCategoryViewers] = useState(0);

  const fetchEventsForCategory = useCallback(async (category) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:9001'}/api/events?category=${category}`);
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        const mapped = json.data.map(e => ({
          img: e.image,
          title: e.title,
          desc: e.description,
          price: e.price || null,
          id: e.id
        }));
        setBackendEvents(prev => ({ ...prev, [category]: mapped }));
      }
    } catch (err) {
      // Backend not running — silently fall back to mock data
    }
  }, []);

  // Rejoin category room and refresh events when socket broadcasts a change
  useEffect(() => {
    const handleCreated = ({ event }) => {
      if (selectedCategory && event.category === selectedCategory) {
        fetchEventsForCategory(selectedCategory);
      }
    };
    const handleUpdated = ({ event }) => {
      if (selectedCategory && event.category === selectedCategory) {
        fetchEventsForCategory(selectedCategory);
      }
    };
    const handleDeleted = ({ category }) => {
      if (selectedCategory && category === selectedCategory) {
        fetchEventsForCategory(selectedCategory);
      }
    };
    const handleViewers = ({ category, count }) => {
      if (category === selectedCategory) setCategoryViewers(count);
    };

    socket.on('event:created', handleCreated);
    socket.on('event:updated', handleUpdated);
    socket.on('event:deleted', handleDeleted);
    socket.on('category:viewers', handleViewers);

    return () => {
      socket.off('event:created', handleCreated);
      socket.off('event:updated', handleUpdated);
      socket.off('event:deleted', handleDeleted);
      socket.off('category:viewers', handleViewers);
    };
  }, [selectedCategory, fetchEventsForCategory]);

  // Join/leave category rooms on the socket
  useEffect(() => {
    if (selectedCategory) {
      socket.emit('category:join', selectedCategory);
      setCategoryViewers(0);
    }
    return () => {
      if (selectedCategory) socket.emit('category:leave', selectedCategory);
    };
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchEventsForCategory(category);
    setTimeout(() => {
        const eventSection = document.getElementById('event-details');
        if (eventSection) {
            eventSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  const handleBackToCategories = () => {
      setSelectedCategory(null);
      setTimeout(() => {
          const categoriesSection = document.getElementById('categories');
          if (categoriesSection) {
              categoriesSection.scrollIntoView({ behavior: 'smooth' });
          }
      }, 100);
  }
  
  // Use backend events if available, otherwise fall back to mock data
  const eventsToDisplay = selectedCategory
    ? (backendEvents[selectedCategory] || mockEventData[selectedCategory] || [])
    : [];
  const showEvents = selectedCategory !== null;

  return (
    <>
      <Navbar 
        onToggleTheme={onToggleTheme} 
        onOpenCalendar={() => setIsCalendarOpen(true)}
        onLogout={onLogout}
        isAdmin={isAdmin}
        onNavigateAdmin={() => onNavigate('admin')}
      />
      
      <Slider />
      <QuoteSection />

      {/* About Sections - Note: Fade logic is contained within the component */}
      <AboutSection 
        title="🎓 About College EventSphere"
        text="College EventSphere is your one-stop platform for all campus events! From technical fests and cultural nights to sports tournaments and hackathons, we bring every event under one digital roof — easy to browse, filter, and participate in."
        imgSrc="https://www.chitkara.edu.in/wp-content/uploads/2019/09/RANGREZZ.jpg"
        altText="College Events"
        fadeDirection="left"
      />
      <AboutSection 
        title="🌟 Our Mission"
        text="We aim to enhance student engagement by creating a connected event ecosystem. EventSphere empowers clubs and organizers to showcase their creativity while ensuring students never miss an opportunity to explore, learn, and connect."
        imgSrc="https://www.chitkara.edu.in/wp-content/uploads/2022/05/National-Integration-Camp-banner.jpg"
        altText="Mission Image"
        fadeDirection="right"
      />
      <AboutSection 
        title="💡 What We Offer"
        text="• Smart event discovery by category and location. • Personalized recommendations based on your interests. • Option to favorite events and get reminders. • AI-powered event assistant for instant help and information."
        imgSrc="https://www.chitkara.edu.in/wp-content/uploads/2020/06/our-charter.jpg"
        altText="Features"
        fadeDirection="left"
      />

      <CategoriesSection onCategoryClick={handleCategoryClick} />
      
      {/* Event Details is conditionally shown */}
      <EventDetails
          show={showEvents}
          events={eventsToDisplay}
          onBack={handleBackToCategories}
          categoryName={selectedCategory}
          viewerCount={categoryViewers}
      />

      <ContactForm />
      <Footer />
      <CalendarPopup 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
      />
      <ConsentInfo />
    </>
  );
}
