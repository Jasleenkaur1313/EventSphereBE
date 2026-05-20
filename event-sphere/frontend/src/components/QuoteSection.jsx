import React, { useState, useEffect } from 'react';

const API_URL = "https://motivational-spark-api.vercel.app/api/quotes/random/1";

export default function QuoteSection() {
  const [quote, setQuote] = useState("Loading...");
  const [author, setAuthor] = useState("");
  const [isFading, setIsFading] = useState(false);

  // Fetches a new quote with fade transition
  const loadQuote = async () => {
    setIsFading(true); 
    
    // Wait for fade-out CSS transition (1.5s as per global.css)
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const newQuote = data[0] || { quote: "Inspiration is everywhere.", author: "EventSphere" };
      
      setQuote(newQuote.quote || "No quote found.");
      setAuthor(newQuote.author ? "— " + newQuote.author : "— Unknown");
    } catch (err) {
      console.error("Error fetching quote:", err);
      setQuote("Failed to load quote.");
      setAuthor("");
    } finally {
        setIsFading(false); // Start fade-in transition
    }
  };

  // Initial load and timer for subsequent loads
  useEffect(() => {
    loadQuote(); // Initial load
    const intervalId = setInterval(loadQuote, 5000); // Reload every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const quoteClass = `quote-text fade ${isFading ? 'hide' : 'show'}`;
  const authorClass = `quote-author fade ${isFading ? 'hide' : 'show'}`;

  return (
    <section className="quote-section">
      <div id="quote" className={quoteClass}>{quote}</div>
      <div id="author" className={authorClass}>{author}</div>
    </section>
  );
}