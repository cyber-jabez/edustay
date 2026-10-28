"use client";

import React, { useEffect, useState } from "react";
import {
  UtensilsCrossed,
  Plus,
  Save,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Drumstick,
} from "lucide-react";

export default function StaffMessPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("MONDAY");
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // New item form
  const [mealType, setMealType] = useState<"BREAKFAST" | "LUNCH" | "SNACKS" | "DINNER">("LUNCH");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [allergens, setAllergens] = useState("None");

  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  const loadMenu = () => {
    fetch("/api/mess")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setMessage(null);

    const currentMenu = data?.menus?.find((m: any) => m.dayOfWeek === selectedDay);
    if (!currentMenu) {
      setMessage("Error: No menu record found for selected day.");
      setAdding(false);
      return;
    }

    try {
      const res = await fetch("/api/mess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuId: currentMenu.id,
          mealType,
          itemName,
          description,
          isVeg,
          allergens,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to add dish");

      setMessage(`Dish '${itemName}' added to ${selectedDay} ${mealType} menu.`);
      setItemName("");
      setDescription("");
      loadMenu();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Loading mess menu configuration...</div>
      </div>
    );
  }

  const menus = data?.menus || [];
  const currentMenu = menus.find((m: any) => m.dayOfWeek === selectedDay);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Hostel Mess Menu Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure, publish and modify weekly dining schedules for campus student residences
        </p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
          message.startsWith("Error")
            ? "bg-rose-50 border border-rose-200 text-rose-700"
            : "bg-emerald-50 border border-emerald-200 text-emerald-700"
        }`}>
          {message.startsWith("Error") ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{message}</span>
        </div>
      )}

      {/* Day Selector */}
      <div className="flex overflow-x-auto gap-2 pb-1">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedDay === day
                ? "bg-slate-900 text-amber-400 shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Add New Dish Form */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Add Dish to {selectedDay} Schedule</span>
        </h2>

        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Meal Period</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              >
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="SNACKS">Evening Snacks</option>
                <option value="DINNER">Dinner</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Dish Name</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Masala Dosa & Sambar"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Classification</label>
              <select
                value={isVeg ? "VEG" : "NON_VEG"}
                onChange={(e) => setIsVeg(e.target.value === "VEG")}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              >
                <option value="VEG">Vegetarian</option>
                <option value="NON_VEG">Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Allergen Notice</label>
              <input
                type="text"
                value={allergens}
                onChange={(e) => setAllergens(e.target.value)}
                placeholder="e.g. Dairy, Gluten, Nuts"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-slate-700 font-semibold block mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Accompaniments, preparation notes"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={adding}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold rounded-lg shadow-sm transition"
              >
                {adding ? "Adding..." : "Add Dish to Menu"}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Current Dishes for Selected Day */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span>Active Dishes Scheduled for {selectedDay}</span>
          <span className="text-xs text-slate-500 font-semibold">{currentMenu?.items?.length || 0} Total Courses</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {currentMenu?.items?.map((it: any) => (
            <div key={it.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{it.itemName}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    {it.mealType}
                  </span>
                </div>
                {it.description && <p className="text-[11px] text-slate-500 mt-0.5">{it.description}</p>}
                {it.allergens && <div className="text-[10px] text-amber-700 mt-0.5">Allergens: {it.allergens}</div>}
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                it.isVeg ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
              }`}>
                {it.isVeg ? <Leaf className="w-3 h-3" /> : <Drumstick className="w-3 h-3" />}
                <span>{it.isVeg ? "Veg" : "Non-Veg"}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

