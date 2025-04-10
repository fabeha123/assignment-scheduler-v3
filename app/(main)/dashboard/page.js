"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import Select from "react-select";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// Helper function for generating colors
const generateColor = (name) => {
  if (!name || typeof name !== "string") return "hsl(0, 70%, 75%)";
  const h = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `hsl(${(h * 17) % 360}, 70%, 75%)`;
};

const StaffDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);

  // Fetch assignments data
  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await fetch("/api/staff/assignments");
      const data = await res.json();

      if (data.success) {
        const courseSet = new Set();
        const moduleSet = new Set();

        data.data.forEach((a) => {
          courseSet.add(a.course_name);
          moduleSet.add(a.module_name);
        });

        setCourses([...courseSet]);
        setModules([...moduleSet]);
        setAssignments(data.data);
        setFilteredAssignments(data.data);
      }
    };

    fetchAssignments();
  }, []);

  // Filter assignments based on course and module selections
  useEffect(() => {
    let filtered = assignments;

    if (selectedCourses.length > 0) {
      filtered = filtered.filter((a) =>
        selectedCourses.includes(a.course_name)
      );
    }

    if (selectedModules.length > 0) {
      filtered = filtered.filter((a) =>
        selectedModules.includes(a.module_name)
      );
    }

    setFilteredAssignments(filtered);
  }, [selectedCourses, selectedModules]);

  // Generate events for the calendar
  const events = filteredAssignments.map((a) => ({
    title: `${a.assignment_name} (${a.course_name} - ${a.module_name})`,
    start: new Date(a.start_date),
    end: new Date(a.end_date),
    allDay: true,
    resource: {
      module: a.module_name,
      course: a.course_name,
      color: generateColor(a.module_name),
    },
  }));

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Assignment Calendar
      </h1>

      {/* Filters for Courses and Modules */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <Select
          options={courses.map((c) => ({ value: c, label: c }))}
          isMulti
          placeholder="Filter by Courses"
          onChange={(val) => setSelectedCourses(val.map((v) => v.value))}
          className="min-w-[200px]"
        />
        <Select
          options={modules.map((m) => ({ value: m, label: m }))}
          isMulti
          placeholder="Filter by Modules"
          onChange={(val) => setSelectedModules(val.map((v) => v.value))}
          className="min-w-[200px]"
        />
      </div>

      {/* Calendar */}
      <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-lg">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: 700,
            borderRadius: "8px",
            backgroundColor: "white",
          }}
          views={["month", "week", "agenda"]}
          defaultView={Views.MONTH}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.resource.color,
              borderRadius: "4px",
              color: "#000",
              border: "none",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              padding: "4px 8px",
              textAlign: "left",
              fontSize: "12px",
            },
          })}
          toolbar={true}
          components={{
            event: ({ event }) => (
              <div
                style={{
                  backgroundColor: event.resource.color,
                  borderRadius: "4px",
                  padding: "4px 8px",
                  color: "#000",
                  textAlign: "left",
                  fontSize: "12px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <span>{event.title}</span>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default StaffDashboard;
