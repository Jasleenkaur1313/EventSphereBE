import React, { useState, useEffect } from 'react';

const EVENTS = {
    11: "Theatre Play", 14: "Rangrezz Day I", 15: "Rangrezz Day II",
    19: "Art Competition", 21: "Workshop Day", 28: "Smart India Hackathon"
};
const DAYS_IN_MONTH = 31; // March has 31 days
const START_DAY = 0;     // March 2026 starts on Sunday (0=Sun ... 6=Sat)
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPopup({ isOpen, onClose }) {
    const [eventInfo, setEventInfo] = useState("Click an event date to see details.");

    const handleDayClick = (day) => {
        if (EVENTS[day]) {
            setEventInfo(`March ${day}: ${EVENTS[day]}`);
        } else {
            setEventInfo(`March ${day}: No events planned.`);
        }
    };

    const renderCalendarDays = () => {
        let cells = [];
        
        // Day Names Header
        cells.push(...DAY_NAMES.map(name => <div key={name} className="day-name">{name}</div>));
        
        // Empty days before the start day
        for (let i = 0; i < START_DAY; i++) {
            cells.push(<div key={`empty-${i}`} className="day"></div>);
        }
        
        // Days of the month
        for (let d = 1; d <= DAYS_IN_MONTH; d++) {
            const isEvent = EVENTS[d] ? "event" : "";
            cells.push(
                <div 
                    key={d} 
                    className={`day ${isEvent}`} 
                    data-day={d}
                    onClick={() => handleDayClick(d)}
                >
                    {d}
                </div>
            );
        }
        return cells;
    };

    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target.id === 'calendarPopup') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="calendar-popup" id="calendarPopup" style={{ display: 'flex' }} onClick={handleBackdropClick}>
            <div className="calendar-box">
                <div className="calendar-header">March 2026
                    <button className="close-btn" id="closeCal" onClick={onClose}>×</button>
                </div>
                <div className="calendar-grid" id="calendarDays">
                    {renderCalendarDays()}
                </div>
                <div className="event-info" id="eventInfo">{eventInfo}</div>
            </div>
        </div>
    );
}