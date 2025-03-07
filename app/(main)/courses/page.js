"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Subheader from "../../ui/components/Subheader";
import CourseTable from "../../ui/tables/CourseTable";
import Modal from "@/app/ui/components/Modal";
import AddCourseForm from "../../ui/forms/AddCourseForm";

const CoursesScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const router = useRouter();

  const openModal = (courseData = null) => {
    setSelectedCourse(courseData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/course/fetch", { method: "GET" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch courses");

      setCourses(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (course_code) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    setLoadingId(course_code);

    try {
      const response = await fetch(`/api/course/delete/${course_code}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.course_code !== course_code)
        );
      } else {
        alert(`Failed to delete course: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the course.");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader
        title="Courses"
        actionButtons={[
          { label: "Add New Course", variant: "outlined", onClick: openModal },
          {
            label: "Import",
            variant: "blue",
            onClick: () => router.push("/courses/import-courses"),
          },
        ]}
      />

      <div className="flex-1 overflow-auto">
        {loading ? (
          <p className="text-center mt-6">Loading courses...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-6">{error}</p>
        ) : (
          <CourseTable
            data={courses}
            openModal={openModal}
            onDelete={handleDelete}
            loadingId={loadingId}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedCourse ? "Update Course" : "Add Course"}
      >
        <AddCourseForm
          courseData={selectedCourse}
          onSuccess={fetchCourses}
          onUpdate={fetchCourses}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default CoursesScreen;
