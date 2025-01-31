import Button from "../../components/Button";
import Form from "../../components/Form";

export default function ObjectivesSection({ objectives, setFormData }) {
  // Add a new objective
  const addObjective = () => {
    setFormData((prev) => ({
      ...prev,
      objectives: [...prev.objectives, ""],
    }));
  };

  // Remove an objective
  const removeObjective = (index) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  // Handle change for a single objective
  const handleObjectiveChange = (value, index) => {
    setFormData((prev) => {
      const updated = [...prev.objectives];
      updated[index] = value;
      return { ...prev, objectives: updated };
    });
  };

  return (
    <div>
      <label className="text-gray-500 text-sm font-light block mb-1">
        Objectives
      </label>
      {objectives.map((objective, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <Form.InputTextMain
            value={objective}
            onChange={(e) => handleObjectiveChange(e.target.value, index)}
            placeholder="Enter an objective"
            required
          />
          {index > 0 && (
            <Button
              variant="iconOnlyOutlined"
              onClick={() => removeObjective(index)}
            >
              ✕
            </Button>
          )}
        </div>
      ))}
      <Button variant="textOnly" onClick={addObjective}>
        + Add New Objective
      </Button>
    </div>
  );
}
