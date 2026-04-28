import React, { useState, useEffect } from 'react';

// Use Firestore or Context for real state, but for conversion, use localStorage shim
const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (e) {
            console.error("Error accessing localStorage:", e);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error("Error setting localStorage:", e);
        }
    }, [key, value]);
    
    return [value, setValue];
}


const CATEGORY_DATA = [
    { name: 'Sports', key: 'sports', icon: '⚽', color: 'bg-blue-600 group-hover:bg-blue-700', img: 'https://placehold.co/400x300/87CEEB/ffffff?text=Sports' },
    { name: 'Comedy', key: 'comedy', icon: '😂', color: 'bg-orange-500 group-hover:bg-orange-600', img: 'https://placehold.co/400x300/FFA07A/ffffff?text=Comedy' },
    { name: 'Theatre', key: 'theatre', icon: '🎭', color: 'bg-green-500 group-hover:bg-green-600', img: 'https://placehold.co/400x300/90EE90/ffffff?text=Theatre' },
    { name: 'Movies', key: 'movies', icon: '🎬', color: 'bg-pink-500 group-hover:bg-pink-600', img: 'https://placehold.co/400x300/FF69B4/ffffff?text=Movies' },
    { name: 'Concerts', key: 'concerts', icon: '🎵', color: 'bg-purple-600 group-hover:bg-purple-700', img: 'https://placehold.co/400x300/8A2BE2/ffffff?text=Concerts' },
];


function CategoryCard({ category, isFavorite, onToggleFavorite, onClick }) {
    const FavIcon = isFavorite ? '♥' : '♡';

    return (
        <div 
            className="category-card relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 group cursor-pointer" 
            data-category={category.key}
            onClick={() => onClick(category.key)}
        >
            <img className="w-full h-40 object-cover" src={category.img} alt={category.name} />
            <div className={`category-label p-3 text-center font-semibold text-white transition duration-300 ${category.color}`}>
                {category.icon} {category.name}
            </div>
            <span 
                className={`fav-icon transition duration-300 ease-in-out ${isFavorite ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(category.key); }}
            >
                {FavIcon}
            </span>
        </div>
    );
}

export default function CategoriesSection({ onCategoryClick }) {
    const [filter, setFilter] = useState('all');
    const [favorites, setFavorites] = useLocalStorage("favorites", []); // Custom hook for persistence

    const handleToggleFavorite = (key) => {
        setFavorites(prev => 
            prev.includes(key) 
                ? prev.filter(f => f !== key) 
                : [...prev, key]
        );
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };
    
    const filteredCategories = CATEGORY_DATA.filter(cat => {
        if (filter === 'all') return true;
        if (filter === 'favorites') return favorites.includes(cat.key);
        return cat.key === filter;
    });

    return (
        <div className="top-categories-wrapper p-4 md:p-8 font-sans" id="categories">
            <main className="max-w-7xl mx-auto">
                
                <section className="mb-8 p-6 md:p-10 rounded-xl shadow-lg filter-section-tailwind">
                    <h2 className="text-3xl font-extrabold mb-6 flex items-center justify-center">
                        <span className="mr-2">🔍</span> Filter Categories
                    </h2>
                    <div className="flex items-center justify-center">
                        <select 
                            id="categoryFilter" 
                            className="p-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-base min-w-[200px]"
                            value={filter}
                            onChange={handleFilterChange}
                        >
                            <option value="all">All</option>
                            <option value="favorites">⭐ My Favorites</option>
                            {CATEGORY_DATA.map(cat => (
                                <option key={cat.key} value={cat.key}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </section>

                <section className="top-categories p-6 md:p-10 rounded-xl shadow-2xl">
                    <h2 className="text-3xl font-extrabold mb-6 flex items-center justify-center">
                        <span className="mr-2">🎯</span> Top Categories
                    </h2 >

                    <div id="category-container">
                        {filteredCategories.map(cat => (
                            <CategoryCard
                                key={cat.key}
                                category={cat}
                                isFavorite={favorites.includes(cat.key)}
                                onToggleFavorite={handleToggleFavorite}
                                onClick={onCategoryClick}
                            />
                        ))}
                    </div>
                    {filteredCategories.length === 0 && filter === 'favorites' && (
                        <p className="text-center text-gray-500 mt-8">No favorites selected yet. Click the heart icon on any category to add it here!</p>
                    )}
                </section>
            </main>
        </div>
    );
}
