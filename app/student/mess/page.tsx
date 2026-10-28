"use client";

import React, { useEffect, useState } from "react";
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function StudentMessPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("MONDAY");

  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  useEffect(() => {
    fetch("/api/mess")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setData(d);
        const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const today = dayNames[new Date().getDay()];
        setSelectedDay(today);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-xs text-zinc-500">Loading mess schedule...</div>
      </div>
    );
  }

  if (!data || !data.mess) {
    return <div className="p-6 text-sm text-zinc-500">Mess menu currently unavailable.</div>;
  }

  const { mess, menus } = data;
  const currentDayMenu = menus.find((m: any) => m.dayOfWeek === selectedDay);

  const mealCategories = [
    { type: "BREAKFAST", title: "Breakfast", time: "07:00 AM – 08:30 AM" },
    { type: "LUNCH", title: "Lunch", time: "12:30 PM – 02:00 PM" },
    { type: "SNACKS", title: "Evening Snacks", time: "05:00 PM – 06:00 PM" },
    { type: "DINNER", title: "Dinner", time: "07:30 PM – 09:00 PM" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Mess Schedule</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Dining timings and weekly menus for {mess.name}
        </p>
      </div>

      {/* Mess Venue Info Card */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-zinc-900">{mess.name}</h2>
            <div className="text-xs text-zinc-500 mt-0.5">{mess.location} • Seating Capacity: {mess.capacity}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" />
          <span>FSSAI Compliant</span>
        </div>
      </section>

      {/* Day Selector Pills */}
      <div className="flex overflow-x-auto gap-2 pb-1">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition whitespace-nowrap ${
              selectedDay === day
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {day.charAt(0) + day.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Meals Grid for the selected day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mealCategories.map((meal) => {
          const items = currentDayMenu?.items?.filter((i: any) => i.mealType === meal.type) || [];

          return (
            <div key={meal.type} className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">{meal.title}</h3>
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{meal.time}</span>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                  {items.length} items
                </span>
              </div>

              <div className="space-y-2">
                {items.length === 0 ? (
                  <div className="text-xs text-zinc-400 py-3 text-center">Regular meal service.</div>
                ) : (
                  items.map((it: any) => (
                    <div key={it.id} className="p-2.5 rounded border border-zinc-200 bg-zinc-50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-zinc-900">{it.itemName}</span>
                        <span className="text-[10px] text-zinc-600 bg-zinc-200 px-1.5 py-0.5 rounded">
                          {it.isVeg ? "Veg" : "Non-Veg"}
                        </span>
                      </div>
                      {it.description && (
                        <p className="text-[11px] text-zinc-500 mt-1">{it.description}</p>
                      )}
                      {it.allergens && (
                        <div className="text-[10px] text-zinc-500 mt-1">Allergens: {it.allergens}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
