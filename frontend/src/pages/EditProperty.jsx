import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropertyForm from "./PropertyForm"; // adjust path if needed
import { fetchPropertyBySlug } from "../redux/slices/propertySlice";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/properties/${fetchPropertyBySlug(id)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch property data.");
        setFormData(data);
      } catch (error) {
        alert(error.message);
        navigate("/dashboard");
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${fetchPropertyBySlug}{id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");
      alert("Property updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed");
      alert("Property deleted successfully.");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    navigate("/dashboard");
  };

  return (
    <div className="p-4">
      <PropertyForm
        open={dialogOpen}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={handleClose}
        onDelete={handleDelete}
        isEdit
      />
    </div>
  );
};

export default EditProperty;
