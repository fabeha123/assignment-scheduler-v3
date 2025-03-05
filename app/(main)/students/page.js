"use client";

import { useState, useEffect } from "react";
import Subheader from "../../ui/components/Subheader";
import StudentsTable from "../../ui/tables/StudentsTable";
import Modal from "@/app/ui/components/Modal";
import AddStudentForm from "../../ui/forms/AddStudentForm";
import { useRouter } from "next/navigation";

const StudentScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [student, setStudent] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const router = useRouter();

  const openModal = (studentfData = null) => {
    setSelectedStudent(studentfData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/student/fetchStudent", { method: "GET" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch student");

      setStudent(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  const handleDelete = async (student_id) => {
    if (!window.confirm("Are you sure you want to delete this student member?"))
      return;

    setLoadingId(student_id);

    try {
      const response = await fetch(`/api/student/delete/${student_id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setStudent((prevStudent) =>
          prevStudent.filter((student) => student.student_id !== student_id)
        );
      } else {
        alert("Failed to delete student. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while deleting student.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Subheader
        title="Student"
        actionButtons={[
          {
            label: "Add New Student",
            variant: "outlined",
            onClick: () => openModal(null),
          },
          {
            label: "Import",
            variant: "blue",
            onClick: () => router.push("/students/import-student"),
          },
        ]}
      />

      <div className="flex-1 overflow-auto">
        {loading ? (
          <p className="text-center mt-6">Loading student...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-6">{error}</p>
        ) : (
          <StudentsTable
            data={student}
            openModal={openModal}
            onDelete={handleDelete}
            loadingId={loadingId}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedStudent ? "Update Student" : "Add Student"}
      >
        <AddStudentForm
          studentData={selectedStudent}
          onSuccess={() => {
            fetchStudent();
            closeModal();
          }}
          onUpdate={() => {
            fetchStudent();
            closeModal();
          }}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default StudentScreen;
