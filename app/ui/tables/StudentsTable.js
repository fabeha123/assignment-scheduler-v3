import Table from "../components/Table";

export default function StudentsTable() {
  const columns = [
    { key: "name", label: "Name" },
    { key: "course", label: "Course" },
    { key: "year", label: "Year" },
    { key: "modules", label: "Modules" },
  ];

  const initialData = [
    {
      name: "Fabeha Saleem",
      course: "BSc Computer Science",
      year: "Final Year",
      modules: "Advance Data Modelling, Software Development Practice",
    },
  ];

  const handleAddStudent = () => ({
    name: "New Student",
    course: "New Course",
    year: "N/A",
    modules: "N/A",
  });

  return (
    <Table
      data={initialData}
      columns={columns}
      onAddRow={handleAddStudent}
      addButtonLabel="Add New Student"
    />
  );
}
