import Button from "../../components/Button";
import Form from "../../components/Form";

export default function MarkingCriteriaSection({
  markingCriteria,
  setFormData,
}) {
  const addCriteria = () => {
    setFormData((prev) => ({
      ...prev,
      markingCriteria: [
        ...prev.markingCriteria,
        { criteria: "", weightage: "" },
      ],
    }));
  };

  const removeCriteria = (index) => {
    setFormData((prev) => ({
      ...prev,
      markingCriteria: prev.markingCriteria.filter((_, i) => i !== index),
    }));
  };

  const handleCriteriaChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.markingCriteria];
      updated[index][field] = value;
      return { ...prev, markingCriteria: updated };
    });
  };

  return (
    <div>
      <label className="text-gray-500 text-sm font-light block mb-1">
        Marking Criteria
      </label>
      {markingCriteria.map((criteria, index) => (
        <div
          key={index}
          className="grid grid-cols-[8fr_1.5fr_0.5fr] gap-2 mb-2 items-center"
        >
          <Form.InputTextMain
            value={criteria.criteria}
            onChange={(e) =>
              handleCriteriaChange(index, "criteria", e.target.value)
            }
            placeholder="Enter criteria"
            required
          />
          <Form.InputTextMain
            value={criteria.weightage}
            onChange={(e) =>
              handleCriteriaChange(index, "weightage", e.target.value)
            }
            placeholder="%"
            required
          />
          {index > 0 && (
            <div className="flex justify-end">
              <Button
                variant="iconOnlyOutlined"
                onClick={() => removeCriteria(index)}
              >
                ✕
              </Button>
            </div>
          )}
        </div>
      ))}
      <Button variant="textOnly" onClick={addCriteria}>
        + Add New Criteria
      </Button>
    </div>
  );
}
