import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProperty, clearPropertyState } from "../redux/slices/propertySlice";

const AddProperty = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { loading, success, error } = useSelector((state) => state.property);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    purpose: "sale",
    type: "house",
    areaValue: "",
    areaUnit: "sqft",
    city: "",
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    return () => dispatch(clearPropertyState());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("purpose", form.purpose);
    formData.append("type", form.type);
    formData.append("area", JSON.stringify({ value: Number(form.areaValue), unit: form.areaUnit }));
    formData.append("location", JSON.stringify({ city: form.city }));

    images.forEach((img) => formData.append("images", img));

    dispatch(addProperty({ formData, token: accessToken }));
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-xl mt-6 shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Property</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" type="text" placeholder="Title" className="w-full p-2 border rounded" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" className="w-full p-2 border rounded" onChange={handleChange} required />

        <div className="flex gap-4">
          <select name="purpose" value={form.purpose} onChange={handleChange} className="p-2 border rounded">
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>

          <select name="type" value={form.type} onChange={handleChange} className="p-2 border rounded">
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="flex gap-4">
          <input name="areaValue" type="number" placeholder="Area Value" className="w-full p-2 border rounded" onChange={handleChange} required />
          <select name="areaUnit" value={form.areaUnit} onChange={handleChange} className="p-2 border rounded">
            <option value="sqft">sqft</option>
            <option value="marla">marla</option>
            <option value="kanal">kanal</option>
            <option value="sqm">sqm</option>
          </select>
        </div>

        <input name="city" type="text" placeholder="City" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full" />

        <button disabled={loading} className="bg-blue-600 text-black px-4 py-2 rounded">
          {loading ? "Uploading..." : "Submit Property"}
        </button>
      </form>

      {success && <p className="mt-4 text-green-600">Property added successfully!</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default AddProperty;
