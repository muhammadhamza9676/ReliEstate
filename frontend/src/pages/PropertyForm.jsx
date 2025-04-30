import React from "react";

const PropertyForm = ({
  open,
  formData,
  onChange,
  onSubmit,
  onClose,
  onDelete,
  isEdit = false,
}) => {
  return (
    <div className={`dialog ${open ? "open" : "closed"}`}>
      <div className="dialog-title">{isEdit ? "Edit Property" : "Add Property"}</div>
      <div className="dialog-content">
        <label>
          Property Name
          <input
            type="text"
            name="propertyName"
            value={formData.propertyName || ""}
            onChange={onChange}
          />
        </label>
        <label>
          Address
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={onChange}
          />
        </label>
        <label>
          Property Type
          <select
            name="propertyType"
            value={formData.propertyType || ""}
            onChange={onChange}
          >
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Commercial">Commercial</option>
          </select>
        </label>
        <label>
          Price
          <input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={onChange}
          />
        </label>
      </div>
      <div className="dialog-actions">
        {isEdit && (
          <button onClick={onDelete} className="delete-button">
            Delete
          </button>
        )}
        <button onClick={onClose}>Cancel</button>
        <button onClick={onSubmit} className="submit-button">
          {isEdit ? "Save" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default PropertyForm;
