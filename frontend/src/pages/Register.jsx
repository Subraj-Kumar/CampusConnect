import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    organization: ""
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
      />

      <select
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      >
        <option value="student">Student</option>
        <option value="organizer">Organizer</option>
      </select>

      {formData.role === "organizer" && (
        <input
          placeholder="Club / Department Name"
          onChange={(e) =>
            setFormData({ ...formData, organization: e.target.value })
          }
        />
      )}

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
