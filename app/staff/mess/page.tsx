"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  CheckCircle2,
  AlertCircle,
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
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-xs text-zinc-500">Loading mess menu...</div>
      </div>
    );
  }

  const menus = data?.menus || [];
  const currentMenu = menus.find((m: any) => m.dayOfWeek === selectedDay);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Mess Menu Management</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Configure and publish daily menus for campus student residences
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded text-xs flex items-center gap-2 border ${
            message.startsWith("Error")
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-zinc-50 border-zinc-200 text-zinc-800"
          }`}
        >
          {message.startsWith("Error") ? (
            <AlertCircle className="w-4 h-4 text-red-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-zinc-700" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Day Selector */}
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

      {/* Add New Dish Form */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4 text-xs">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-2.5">
          <Plus className="w-4 h-4 text-zinc-600" />
          <span>Add Dish ({selectedDay.charAt(0) + selectedDay.slice(1).toLowerCase()})</span>
        </h2>

        <form onSubmit={handleAddItem} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Meal Period</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full p-1.5 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition bg-white"
              >
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="SNACKS">Snacks</option>
                <option value="DINNER">Dinner</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Dish Name</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Masala Dosa"
                className="w-full p-1.5 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Type</label>
              <select
                value={isVeg ? "VEG" : "NON_VEG"}
                onChange={(e) => setIsVeg(e.target.value === "VEG")}
                className="w-full p-1.5 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition bg-white"
              >
                <option value="VEG">Vegetarian</option>
                <option value="NON_VEG">Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Allergens</label>
              <input
                type="text"
                value={allergens}
                onChange={(e) => setAllergens(e.target.value)}
                placeholder="e.g. Dairy, Gluten"
                className="w-full p-1.5 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-zinc-500 block mb-1 text-[11px]">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Accompaniments, notes"
                className="w-full p-1.5 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={adding}
                className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium rounded text-xs transition"
              >
                {adding ? "Adding..." : "Add Dish"}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Current Dishes for Selected Day */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
            Scheduled Dishes
          </h2>
          <span className="text-[11px] text-zinc-500">{currentMenu?.items?.length || 0} items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {currentMenu?.items?.map((it: any) => (
            <div key={it.id} className="p-3 rounded border border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-900">{it.itemName}</span>
                  <span className="text-[10px] text-zinc-600 bg-zinc-200 px-1.5 py-0.5 rounded">
                    {it.mealType}
                  </span>
                </div>
                {it.description && <p className="text-[11px] text-zinc-500 mt-0.5">{it.description}</p>}
                {it.allergens && <div className="text-[10px] text-zinc-500 mt-0.5">Allergens: {it.allergens}</div>}
              </div>

              <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-200 text-zinc-700">
                {it.isVeg ? "Veg" : "Non-Veg"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
