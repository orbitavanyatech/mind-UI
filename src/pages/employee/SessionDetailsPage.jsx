import React, { useState } from "react";
import { Apple, Calendar, CalendarPlus, CheckCircle2, ChevronRight, Video } from "lucide-react";
import { Badge, BackLink, Button, Card } from "../../components/ui/Primitives";
import { SESSION_DETAILS, UPCOMING_SESSIONS } from "../../data/mockData";
import { useNavigation } from "../../navigation/NavigationContext";

export const SessionDetailsPage = () => {
  const { params, back } = useNavigation();
  const session = UPCOMING_SESSIONS.find((s) => s.title === params.sessionTitle) || UPCOMING_SESSIONS[0];
  const detail = SESSION_DETAILS[session.title] || Object.values(SESSION_DETAILS)[0];
  const [reserved, setReserved] = useState(session.spots === "Confirmed");

  return (
    <div className="space-y-6 max-w-2xl">
      <BackLink onClick={back}>Back to Live Sessions</BackLink>

      <div>
        <Badge color={session.type === "1:1 Coaching" ? "violet" : "teal"} className="mb-2">{session.type}</Badge>
        <h1 className="mpp-display text-xl sm:text-2xl font-bold text-slate-900">{session.title}</h1>
        <p className="text-sm text-slate-500 mt-1">Hosted by {session.host} · {session.date}, {session.time}</p>
      </div>

      <Card>
        <p className="text-sm text-slate-600 leading-relaxed mb-5">{detail.description}</p>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-600">
            <Video className="w-4 h-4 text-teal-600" /> {detail.location}
          </div>
          <Badge color={reserved ? "teal" : "slate"}>{reserved ? "You're confirmed" : session.spots}</Badge>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Agenda</p>
        <div className="space-y-2 mb-6">
          {detail.agenda.map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
              {item}
            </div>
          ))}
        </div>

        {reserved ? (
          <a
            href={detail.joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors bg-teal-600 text-white hover:bg-teal-700 px-4 py-2.5 text-sm w-full"
          >
            <Video className="w-4 h-4" /> Join on Zoom
          </a>
        ) : (
          <Button className="w-full" icon={CheckCircle2} onClick={() => setReserved(true)}>Reserve Spot</Button>
        )}
      </Card>

      <Card>
        <p className="text-sm font-semibold text-slate-900 mb-3">Add to your calendar</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="outline" size="sm" icon={CalendarPlus}>Google Calendar</Button>
          <Button variant="outline" size="sm" icon={Calendar}>Outlook Calendar</Button>
          <Button variant="outline" size="sm" icon={Apple}>Apple / iCal</Button>
        </div>
      </Card>
    </div>
  );
};
