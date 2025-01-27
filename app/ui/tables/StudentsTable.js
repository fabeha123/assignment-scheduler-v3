import Table from "../components/Table";

const StudentsTable = () => {
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

  return (
    <Table
      data={initialData}
      columns={columns}
      addButtonLabel="Add New Student"
    />
  );
};
export default StudentsTable;
