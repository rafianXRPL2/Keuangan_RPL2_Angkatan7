'use client';

import React, { useEffect, useRef } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';

interface CalendarWrapperProps {
  events: Array<{
    id: string;
    title: string;
    start: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
  }>;
  statusAdmin: boolean;
  tampilkanInfoAgenda: (judul: string, tanggal: string) => void;
  hapusAgendaKalender: (key: string, title: string) => void;
}

export default function CalendarWrapper({
  events,
  statusAdmin,
  tampilkanInfoAgenda,
  hapusAgendaKalender
}: CalendarWrapperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const calendarInstRef = useRef<Calendar | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const calendar = new Calendar(containerRef.current, {
      plugins: [dayGridPlugin, listPlugin],
      initialView: window.innerWidth <= 576 ? 'listWeek' : 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listWeek'
      },
      buttonText: { list: 'Agenda' },
      firstDay: 1,
      height: 'auto',
      dayMaxEvents: true,
      events: events,
      eventClick: (info) => {
        if (!statusAdmin) {
          tampilkanInfoAgenda(info.event.title, info.event.startStr);
        } else {
          hapusAgendaKalender(info.event.id, info.event.title);
        }
      }
    });

    calendar.render();
    calendarInstRef.current = calendar;

    const handleResize = () => {
      if (calendarInstRef.current) {
        calendarInstRef.current.updateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      calendar.destroy();
    };
  }, [events, statusAdmin]);

  return <div ref={containerRef} id="kalender-box-inner" style={{ width: '100%' }} />;
}
