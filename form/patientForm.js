import { useState } from "react";

function PatientForm() {

  const [type, setType] = useState("");

  const [formData, setFormData] = useState({
    patientName: "",
    relativeName: "",
    gender: "",
    age: "",
    mobile: "",
    altMobile: "",
    address: "",
    cause: "",
    payment: "",
    bed: "",
    hospital: ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log("Form Data:", formData);
    alert("✅ Form Submitted Successfully!");
  }

  return (
    <div className="card">

      <h2>📝 Patient Registration Form</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="patientName"
          placeholder="Patient Name"
          required
          onChange={handleChange}
        />

        <input
          type="text"
          name="relativeName"
          placeholder="Relative Name"
          required
          onChange={handleChange}
        />

        <select name="gender" required onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          type="number"
          name="age"
          placeholder="Age"
          required
          onChange={handleChange}
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          required
          onChange={handleChange}
        />

        <input
          type="tel"
          name="altMobile"
          placeholder="Alternative Number"
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Address"
          required
          onChange={handleChange}
        ></textarea>

        {/* Type Selection */}
        <select
          required
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="general">General</option>
          <option value="emergency">Emergency</option>
        </select>

        {/* Common Fields */}
        {type && (
          <>
            <input
              type="text"
              name="cause"
              placeholder="Cause"
              required
              onChange={handleChange}
            />

            <input
              type="text"
              name="payment"
              placeholder="Payment Method"
              required
              onChange={handleChange}
            />

            <select name="bed" required onChange={handleChange}>
              <option value="">Select Bed</option>
              <option>General</option>
              <option>ICU</option>
            </select>

            <input
              type="text"
              name="hospital"
              placeholder="Hospital Name"
              required
              onChange={handleChange}
            />
          </>
        )}

        {/* General Upload */}
        {type === "general" && (
          <>
            <label>Govt Document</label>
            <input type="file" required />

            <label>Medical Report</label>
            <input type="file" required />
          </>
        )}

        {/* Emergency Upload */}
        {type === "emergency" && (
          <>
            <label>Emergency Document</label>
            <input type="file" required />
          </>
        )}

        <button type="submit">Submit</button>

      </form>

    </div>
  );
}

export default PatientForm;
