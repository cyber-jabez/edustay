"use client";

import React, { useEffect, useState } from "react";
import {
  UtensilsCrossed,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Drumstick,
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
        // Set today's day of week
        const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const today = dayNames[new Date().getDay()];
        setSelectedDay(today);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Loading published mess schedule...</div>
      </div>
    );
  }

  if (!data || !data.mess) {
    return <div className="p-6 text-sm text-slate-500">Mess menu currently unpublished.</div>;
  }

  const { mess, menus } = data;
  const currentDayMenu = menus.find((m: any) => m.dayOfWeek === selectedDay);

  const mealCategories = [
    { type: "BREAKFAST", title: "Breakfast", time: "07:00 AM - 08:30 AM" },
    { type: "LUNCH", title: "Lunch", time: "12:30 PM - 02:00 PM" },
    { type: "SNACKS", title: "Evening Snacks", time: "05:00 PM - 06:00 PM" },
    { type: "DINNER", title: "Dinner", time: "07:30 PM - 09:00 PM" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Weekly Residence Mess Schedule</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official dining timings and daily meal schedules for {mess.name}
        </p>
      </div>

      {/* Mess Venue Info Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">{mess.name}</h2>
            <div className="text-xs text-slate-500 mt-0.5">{mess.location} • Seating Capacity: {mess.capacity}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>FSSAI Compliant Kitchen</span>
        </div>
      </section>

      {/* Day Selector Pills */}
      <div className="flex overflow-x-auto gap-2 pb-1">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedDay === day
                ? "bg-[#0072bc] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Meals Grid for the selected day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {mealCategories.map((meal) => {
          const items = currentDayMenu?.items?.filter((i: any) => i.mealType === meal.type) || [];

          return (
            <div key={meal.type} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{meal.title}</h3>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{meal.time}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {items.length} Course(s)
                </span>
              </div>

              <div className="space-y-2.5">
                {items.length === 0 ? (
                  <div className="text-xs text-slate-400 py-3 text-center">Regular institutional meal service.</div>
                ) : (
                  items.map((it: any) => (
                    <div key={it.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{it.itemName}</span>
                        <span className={`text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded ${
                          it.isVeg ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                          {it.isVeg ? <Leaf className="w-3 h-3" /> : <Drumstick className="w-3 h-3" />}
                          <span>{it.isVeg ? "Veg" : "Non-Veg"}</span>
                        </span>
                      </div>
                      {it.description && (
                        <p className="text-[11px] text-slate-500 mt-1">{it.description}</p>
                      )}
                      {it.allergens && (
                        <div className="text-[10px] text-amber-700 mt-1">Allergens: {it.allergens}</div>
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

