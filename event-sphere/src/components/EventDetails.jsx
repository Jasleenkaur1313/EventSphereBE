import React, { useEffect, useState } from 'react';

export default function EventDetails({ show, events, onBack, categoryName }) {
    const [paymentStatus, setPaymentStatus] = useState({});

    useEffect(() => {
        if (show) {
            const cards = document.querySelectorAll("#events-container .event-card");
            cards.forEach((card, index) => {
                card.style.animation = `fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s forwards`;
            });
        }
    }, [show, events]);

    const handlePay = async (event) => {
        const eventId = event.id;
        setPaymentStatus(prev => ({ ...prev, [eventId]: 'loading' }));

        try {
            const res = await fetch(`http://localhost:9001/api/events/${eventId}/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const json = await res.json();

            if (json.success) {
                setPaymentStatus(prev => ({ ...prev, [eventId]: 'paid' }));
                alert(`${json.message}\n\nBooking Ref: ${json.data.bookingRef}`);
            } else {
                setPaymentStatus(prev => ({ ...prev, [eventId]: 'error' }));
                alert(`Payment failed: ${json.message}`);
            }
        } catch (err) {
            setPaymentStatus(prev => ({ ...prev, [eventId]: 'error' }));
            alert('Could not connect to server. Please try again.');
        }
    };

    const sectionStyle = { display: show ? 'block' : 'none' };
    const title = categoryName
        ? `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Events`
        : 'Events';

    return (
        <section id="event-details" className="event-details-section" style={sectionStyle}>
            <h2>{title}</h2>

            <button
                id="back-btn"
                className="back-btn"
                onClick={onBack}
                style={{ display: show ? 'inline-block' : 'none' }}
            >
                Back to Categories
            </button>

            <div id="events-container">
                {events.length > 0 ? (
                    events.map((event, index) => {
                        const status = paymentStatus[event.id];
                        const isPaid = status === 'paid';
                        const isLoading = status === 'loading';

                        return (
                            <div
                                key={event.id || index}
                                className="event-card"
                                style={{ opacity: 0, transform: 'translateY(20px)' }}
                            >
                                <img
                                    src={event.img}
                                    alt={event.title}
                                    className="event-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/400x250/333/ffffff?text=Event+Image';
                                    }}
                                />
                                <div className="event-content">
                                    <h3>{event.title}</h3>
                                    <p>{event.desc}</p>

                                    {event.price && (
                                        <div className="pay-btn-wrapper">
                                            {isPaid ? (
                                                <span className="pay-btn pay-btn--success">
                                                    Booked
                                                </span>
                                            ) : (
                                                <button
                                                    className={`pay-btn ${isLoading ? 'pay-btn--loading' : 'pay-btn--active'}`}
                                                    onClick={() => handlePay(event)}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'Processing...' : `Pay Rs ${event.price}`}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--secondary-text)' }}>
                        Select a category above to view events.
                    </p>
                )}
            </div>
        </section>
    );
}
