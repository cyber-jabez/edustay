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
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-6 h-6 border-2 border-karunya-blue border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-slate-500 font-poppins">Loading mess schedule...</div>
      </div>
    );
  }

  if (!data || !data.mess) {
    return <div className="p-6 text-sm text-slate-500 font-poppins">Mess menu currently unavailable.</div>;
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
    <div className="space-y-5 max-w-4xl font-poppins">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 font-lora">Mess Schedule</h1>
      </div>

      {/* Mess Venue Info Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 font-lora">{mess.name}</h2>
            <div className="text-xs text-slate-500 mt-0.5">
              {mess.location} • Seating Capacity: {mess.capacity}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="font-semibold">FSSAI Compliant</span>
        </div>
      </section>

      {/* Day Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              selectedDay === day
                ? "bg-karunya-blue text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-card"
            }`}
          >
            {day.charAt(0) + day.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mealCategories.map((meal) => {
          const items = currentDayMenu?.items?.filter((i: any) => i.mealType === meal.type) || [];

          return (
            <div key={meal.type} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 font-lora">{meal.title}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{meal.time}</span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {items.length} items
                </span>
              </div>

              <div className="space-y-2">
                {items.length === 0 ? (
                  <div className="text-xs text-slate-400 py-4 text-center">Regular meal service.</div>
                ) : (
                  items.map((it: any) => (
                    <div key={it.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">{it.itemName}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            it.isVeg
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {it.isVeg ? "Veg" : "Non-Veg"}
                        </span>
                      </div>
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
