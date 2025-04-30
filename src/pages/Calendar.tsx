import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  ArrowRight,
  Plus,
  Bell,
  Filter,
  Trash2,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import Layout from "../components/Layout";

interface Notification {
  id: string;
  message: string;
  type: "warning" | "info";
  date: Date;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  completed: boolean;
  type: "planting" | "fertilizer" | "irrigation" | "harvest";
  notifyBefore: number; // days before to notify
}

interface EventFormData {
  title: string;
  description: string;
  type: Event["type"];
  date: string;
  notifyBefore: number;
}

function Calendar() {
  // State declarations
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem("farmEvents");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [eventForm, setEventForm] = useState<EventFormData>({
    title: "",
    description: "",
    type: "planting",
    date: new Date().toISOString().split("T")[0],
    notifyBefore: 1,
  });

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("farmEvents", JSON.stringify(events));
    checkNotifications();
  }, [events]);

  // Check for notifications daily
  useEffect(() => {
    const interval = setInterval(checkNotifications, 1000 * 60 * 60 * 24); // Check daily
    return () => clearInterval(interval);
  }, []);

  const checkNotifications = () => {
    const today = new Date();
    const newNotifications: Notification[] = [];

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      const daysUntil = Math.ceil(
        (eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
      );

      if (
        daysUntil <= event.notifyBefore &&
        daysUntil >= 0 &&
        !event.completed
      ) {
        newNotifications.push({
          id: `${event.id}-${daysUntil}`,
          message: `${event.type.toUpperCase()}: ${
            event.title
          } in ${daysUntil} days`,
          type: daysUntil === 0 ? "warning" : "info",
          date: eventDate,
        });
      }
    });

    setNotifications(newNotifications);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventForm.title,
      description: eventForm.description,
      date: new Date(eventForm.date),
      completed: false,
      type: eventForm.type,
      notifyBefore: eventForm.notifyBefore,
    };

    setEvents([...events, newEvent]);
    setShowEventModal(false);
    setEventForm({
      title: "",
      description: "",
      type: "planting",
      date: new Date().toISOString().split("T")[0],
      notifyBefore: 1,
    });
  };

  const toggleEventComplete = (eventId: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, completed: !event.completed } : event
      )
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  // Add these helper functions for calendar
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date: Date) => {
    return date.getMonth() === selectedDate.getMonth();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with Notifications */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Planting Calendar</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 cursor-pointer" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm">
                  <option>All Events</option>
                  <option>Planting</option>
                  <option>Fertilizer</option>
                  <option>Irrigation</option>
                  <option>Harvest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications Panel */}
          {notifications.length > 0 && (
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-semibold">Upcoming Events</h3>
              </div>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      notification.type === "warning"
                        ? "bg-red-50 text-red-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    <span>{notification.message}</span>
                    <X
                      className="h-4 w-4 cursor-pointer hover:text-red-500"
                      onClick={() => dismissNotification(notification.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Event Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>

        {/* Event List */}
        <div className="mt-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2"
            >
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-green-500" />
                <span>{event.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleEventComplete(event.id)}
                  className={`p-1 rounded-full ${
                    event.completed
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="p-1 rounded-full bg-red-100 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Planting Calendar
          </h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="text-lg font-medium">March 2024</span>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  setSelectedDate(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth() - 1,
                      1
                    )
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <span className="text-lg font-medium">
                {selectedDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={() =>
                  setSelectedDate(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth() + 1,
                      1
                    )
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ArrowRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 42 }, (_, i) => {
              const dayNumber = i - getFirstDayOfMonth(selectedDate) + 1;
              const date = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                dayNumber
              );
              const isCurrentMonth =
                dayNumber > 0 && dayNumber <= getDaysInMonth(selectedDate);
              const dayEvents = events.filter(
                (event) =>
                  new Date(event.date).toDateString() === date.toDateString()
              );

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (isCurrentMonth) {
                      setEventForm({
                        ...eventForm,
                        date: date.toISOString().split("T")[0],
                      });
                      setShowEventModal(true);
                    }
                  }}
                  className={`
                    aspect-square p-2 rounded-lg border transition cursor-pointer
                    ${
                      !isCurrentMonth
                        ? "bg-gray-50 text-gray-400"
                        : "hover:bg-gray-50"
                    }
                    ${
                      isToday(date)
                        ? "bg-green-50 border-green-500"
                        : "border-gray-200"
                    }
                  `}
                >
                  {isCurrentMonth && (
                    <>
                      <span
                        className={`text-sm font-medium ${
                          isToday(date) ? "text-green-600" : ""
                        }`}
                      >
                        {dayNumber}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`
                              text-xs p-1 rounded-full text-white
                              ${
                                event.type === "planting"
                                  ? "bg-green-500"
                                  : event.type === "fertilizer"
                                  ? "bg-blue-500"
                                  : event.type === "irrigation"
                                  ? "bg-cyan-500"
                                  : "bg-yellow-500"
                              }
                              ${event.completed ? "opacity-50" : ""}
                            `}
                            title={event.title}
                          >
                            {event.title.substring(0, 1)}
                          </div>
                        ))}
                  </div>
                    </>
                )}
              </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Activities</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span>March 15 - Plant wheat seeds</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span>March 20 - Fertilizer application</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                <span>March 25 - Crop inspection</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Seasonal Guide</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                • March-April: Ideal for planting wheat and barley
              </p>
              <p className="text-gray-600">• May-June: Start vegetable crops</p>
              <p className="text-gray-600">
                • July-August: Monitor for pests and diseases
              </p>
            </div>
          </div>
        </div>

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Farming Event</h2>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={eventForm.type}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        type: e.target.value as Event["type"],
                      })
                    }
                    className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="planting">Planting</option>
                    <option value="fertilizer">Fertilizer</option>
                    <option value="irrigation">Irrigation</option>
                    <option value="harvest">Harvest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, title: e.target.value })
                    }
                    className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                    required
                    placeholder="Event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="Event description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, date: e.target.value })
                    }
                    className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notify Before (days)
                  </label>
                  <input
                    type="number"
                    value={eventForm.notifyBefore}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        notifyBefore: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    max="30"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Calendar;
