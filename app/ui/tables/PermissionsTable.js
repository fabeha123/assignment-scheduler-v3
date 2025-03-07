"use client";

import Table from "../components/Table";

const permissionsOptions = ["No Access", "Read", "Read & Write"];

const PermissionsTable = ({
  data,
  openModal,
  onDelete,
  loadingId,
  showActions = true,
  setRoles,
}) => {
  const columns = [
    { key: "role_name", label: "Role Name" },
    { key: "Students", label: "Students" },
    { key: "Staff", label: "Staff" },
    { key: "Courses", label: "Courses" },
    { key: "Modules", label: "Modules" },
    { key: "Assignments", label: "Assignments" },
    { key: "all_users", label: "All Users" },
  ];

  const handlePermissionChange = async (role_id, tab_name, value) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.role_id === role_id ? { ...role, [tab_name]: value } : role
      )
    );

    const can_read = value === "Read" || value === "Read & Write";
    const can_write = value === "Read & Write";
    const no_access = value === "No Access";

    try {
      await fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_id,
          tab_name,
          can_read,
          can_write,
          no_access,
        }),
      });
    } catch (error) {
      console.error("Error updating permission:", error);
    }
  };

  const handleAllUsersChange = async (role_id, checked) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.role_id === role_id ? { ...role, all_users: checked } : role
      )
    );

    try {
      await fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_id,
          tab_name: "all_users",
          all_users: checked,
        }),
      });
    } catch (error) {
      console.error("Error updating all_users:", error);
    }
  };

  const formattedData = data.map((row) => ({
    ...row,
    idKey: row.role_id,
    Students: (
      <select
        value={row.Students || "No Access"}
        onChange={(e) =>
          handlePermissionChange(row.role_id, "Students", e.target.value)
        }
      >
        {permissionsOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ),
    Staff: (
      <select
        value={row.Staff || "No Access"}
        onChange={(e) =>
          handlePermissionChange(row.role_id, "Staff", e.target.value)
        }
      >
        {permissionsOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ),
    Courses: (
      <select
        value={row.Courses || "No Access"}
        onChange={(e) =>
          handlePermissionChange(row.role_id, "Courses", e.target.value)
        }
      >
        {permissionsOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ),
    Modules: (
      <select
        value={row.Modules || "No Access"}
        onChange={(e) =>
          handlePermissionChange(row.role_id, "Modules", e.target.value)
        }
      >
        {permissionsOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ),
    Assignments: (
      <select
        value={row.Assignments || "No Access"}
        onChange={(e) =>
          handlePermissionChange(row.role_id, "Assignments", e.target.value)
        }
      >
        {permissionsOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ),
    all_users: (
      <input
        type="checkbox"
        checked={row.all_users || false}
        onChange={(e) => handleAllUsersChange(row.role_id, e.target.checked)}
      />
    ),
  }));

  const addButton = {
    label: "Add New Role",
    variant: "textOnly",
    onClick: () => openModal(null),
  };

  return (
    <Table
      data={formattedData}
      columns={columns}
      addButton={addButton}
      gridTemplateColumns="1.5fr 1fr 1fr 1fr 1fr 1fr 1fr"
      showActions={showActions}
      onDelete={onDelete}
      loadingId={loadingId}
      onEdit={openModal}
    />
  );
};

export default PermissionsTable;
