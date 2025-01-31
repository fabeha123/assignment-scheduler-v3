import Form from "../../components/Form";

export default function AssignmentDetailsSection({
  formData,
  onChange,
  modules,
}) {
  return (
    <>
      {/* Assignment Name + Weightage */}
      <div className="grid grid-cols-[4fr_1fr] gap-4">
        <Form.InputTextMain
          label="Assignment Name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
          placeholder="Enter assignment name"
        />
        <Form.InputTextMain
          label="Weightage (%)"
          value={formData.weightage}
          onChange={(e) => onChange("weightage", e.target.value)}
          required
          placeholder="%"
        />
      </div>

      {/* Module, Start Date, End Date */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.InputSelect
          label="Module"
          value={formData.module}
          onChange={(val) => onChange("module", val)}
          required
          options={modules}
        />
        <Form.InputTextMain
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => onChange("startDate", e.target.value)}
          required
        />
        <Form.InputTextMain
          label="End Date"
          type="date"
          value={formData.endDate}
          onChange={(e) => onChange("endDate", e.target.value)}
          required
        />
      </div>
    </>
  );
}
