import { useNavigate } from "react-router-dom";
import "../index.css";
import { useState } from "react";
import axios from "axios";
import { useAlert } from "../contexts/AlertContext";

function VerifikoEmail() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [kodiVerifikimit, setKodiVerifikimit] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const email = localStorage.getItem("emailForVerification");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/regjistrimi/verifiko`,
        {
          email: email,
          kodi: kodiVerifikimit,
        },
      );

      if (response.data.success || response.data.status) {
        localStorage.removeItem("emailForVerification");
        showAlert("Verifikimi perfundoj me sukses", "success");
        navigate("/kycja");
      }
    } catch (error) {
      if (error.response.data.error.includes("Kodi eshte gabim")) {
        showAlert("Kodi eshte gabim", "error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Verifikimi i Email-it
        </h2>

        <div className="mb-5">
          <label
            htmlFor="kodi"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ju lutem shënoni kodin që ju është dërguar në email!
          </label>

          <input
            placeholder="Sheno Kodin"
            type="text"
            id="kodi"
            value={kodiVerifikimit}
            onChange={(e) => setKodiVerifikimit(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button type="submit" className="publikoPune">
          Konfirmo
        </button>
      </form>
    </div>
  );
}

export default VerifikoEmail;
