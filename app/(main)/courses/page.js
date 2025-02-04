"use client";

import { useState, useEffect } from "react";
import Subheader from "../../ui/components/Subheader";
import CourseTable from "../../ui/tables/CourseTable";
import Modal from "@/app/ui/components/Modal";
import AddCourseForm from "../../ui/forms/AddCourseForm";

const CoursesScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to fetch courses from the API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/course", { method: "GET" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch courses");
      }

      setCourses(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader
        title="Courses"
        actionButtons={[
          {
            label: "Add New Course",
            variant: "outlined",
            onClick: openModal,
          },
        ]}
      />

      <div className="flex-1 overflow-auto">
        {loading ? (
          <p className="text-center mt-6">Loading courses...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-6">{error}</p>
        ) : (
          <CourseTable data={courses} openModal={openModal} />
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={"Add Course"}>
        <AddCourseForm
          onSuccess={() => {
            fetchCourses();
            closeModal();
          }}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default CoursesScreen;
