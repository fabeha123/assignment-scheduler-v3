"use client";
import { useState } from "react";
import TableWithAddRows from "../ui/components/TableWithAddRows";

const studentsData = [
  {
    name: "Fabeha Saleem",
    course: "BSc Computer Science",
    year: "Final Year",
    modules:
      "Advance Data Modelling, Software Development Practice, FYP, Mobile App Development",
  },
  {
    name: "John Doe",
    course: "BSc Information Systems",
    year: "2nd Year",
    modules: "Databases, Programming, Networks",
  },
  // ... add more if you like
];

// Define columns
const columns = [
  { label: "Name", key: "name" },
  { label: "Course", key: "course" },
  { label: "Year", key: "year" },
  { label: "Modules", key: "modules" },
];

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#6ec5ff] px-4 py-3 flex items-center">
        {/* Logo + Name */}
        <div className="flex items-center space-x-2">
          {/* Example of a placeholder for an icon */}
          <div className="w-6 h-6 bg-white rounded-full" />
          <h1 className="text-white text-2xl font-normal font-['Gochi_Hand']">
            Zippy
          </h1>
        </div>

        {/* Centered Search (auto width on large screens, full width on small) */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="bg-[#53b5f6] rounded-[13px] flex items-center px-4 py-2">
            {/* Icon could go here */}
            <span className="text-white text-base font-bold font-['Inter']">
              Search
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area: Sidebar + Main Section */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[250px] lg:w-[300px] border-r border-[#e8ebf0] bg-[#fbfbfb] flex flex-col">
          {/* Top section (User info) */}
          <div className="border-b border-[#e8ebf0] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8 bg-[#ff6f61] rounded-lg flex items-center justify-center">
                <span className="text-white text-base font-bold font-['Inter']">
                  FS
                </span>
              </div>
              <h2 className="text-black text-base font-semibold font-['Inter']">
                Fabeha Saleem
              </h2>
            </div>
            {/* Settings / Notification icon placeholder */}
            <div className="relative w-8 h-8 bg-white rounded-full shadow-sm border" />
          </div>

          {/* Nav items */}
          <nav className="flex-1 mt-2">
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center px-6 py-2 hover:bg-gray-100"
                >
                  {/* Icon placeholder */}
                  <div className="w-5 h-5 bg-transparent mr-3" />
                  <span className="text-black text-sm font-['Inter']">
                    Home
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-6 py-2 bg-[#d2edff] rounded-[10px]"
                >
                  {/* Icon placeholder */}
                  <div className="w-5 h-5 bg-transparent mr-3" />
                  <span className="text-[#408fc3] text-sm font-medium font-['Inter']">
                    Students
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-6 py-2 hover:bg-gray-100"
                >
                  <div className="w-5 h-5 bg-transparent mr-3" />
                  <span className="text-black text-sm font-['Inter']">
                    Staff
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-6 py-2 hover:bg-gray-100"
                >
                  <div className="w-5 h-5 bg-transparent mr-3" />
                  <span className="text-black text-sm font-['Inter']">
                    Courses
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-6 py-2 hover:bg-gray-100"
                >
                  <div className="w-5 h-5 bg-transparent mr-3" />
                  <span className="text-black text-sm font-['Inter']">
                    Modules
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-6 py-2 hover:bg-gray-100"
                >
                  <div className="w-5 h-5 bg-transparent mr-3" />
                  <span className="text-black text-sm font-['Inter']">
                    Assignments
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Header / Filters row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-black text-xl font-semibold font-['Inter'] mb-2 md:mb-0">
              Students
            </h2>

            <div className="flex items-center space-x-3">
              <button className="border border-[#e8ebf0] bg-white rounded-[7px] px-4 py-2 text-[#48515c] text-sm font-light font-['Inter']">
                Add New Student
              </button>
              <button className="bg-[#54b5f6] rounded-[7px] px-4 py-2 text-white text-sm font-normal font-['Inter']">
                Import
              </button>
            </div>
          </div>

          {/* Group / Filter Row */}
          <div className="flex flex-wrap items-center space-x-3 mb-4">
            <button className="px-4 py-1.5 border border-[#0075c4] bg-[#d2edff] text-[#0075c4] rounded-full text-sm">
              Group: None
            </button>
            <button className="px-4 py-1.5 border border-[#e8ebf0] bg-white rounded-full text-sm">
              Filter
            </button>
          </div>
          <div className="flex flex-col p-8">
            <h1 className="text-2xl font-semibold mb-4">Students</h1>

            {/* TableWithAddRow usage */}
            <TableWithAddRows initialData={studentsData} columns={columns} />
          </div>
        </main>
      </div>
    </div>
  );
}
