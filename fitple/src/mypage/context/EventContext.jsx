import React, { createContext, useState, useContext } from 'react';

// EventContext 생성
const EventContext = createContext();

// EventProvider 컴포넌트
export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);  // 일정 데이터를 저장

    // 이벤트 데이터를 업데이트하는 함수
    const updateEvents = (newEvent) => {
        if(events) setEvents((prevEvents) => [...prevEvents, newEvent]);
        else setEvents(newEvent);
    };

    return (
        <EventContext.Provider value={{ events, updateEvents }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEventContext = () => {
    return useContext(EventContext);
};