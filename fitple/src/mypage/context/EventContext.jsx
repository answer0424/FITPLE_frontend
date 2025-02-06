import React, { createContext, useState, useContext } from 'react';

// EventContext 생성
const EventContext = createContext();

// EventProvider 컴포넌트
export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);  // 일정 데이터를 저장

    // 이벤트 데이터를 업데이트하는 함수
    // 월별 최초 업데이트 시 값이 이상하게 들어갈 경우, update와 페이지 로딩 시 인서트를 다르게 작성
    const updateEvents = (newEvent) => {
        console.log("업데이트 시 받는 값");
        console.log(newEvent);
        if(events.length > 0) {
            console.log("여기가 도나?");
            setEvents((prevEvents) => [...prevEvents, newEvent]);}
        else {
            setEvents(newEvent)};
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