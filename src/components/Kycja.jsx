import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons/faEyeSlash";
import Perdoruesi from "../PerdoruesiContext";
import axios from "axios";
import { useAlert } from "../contexts/AlertContext";

function Kycja() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setPerdoruesiData } = Perdoruesi.usePerdoruesi();

  const changeImage = () => {
    setShowPassword(!showPassword);
  };

  const [data, setData] = useState({
    email: "",
    fjalekalimi: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.email === "" || data.fjalekalimi === "") {
      showAlert("Plotesoni te gjitha fushat", "info");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/kycja/perdoruesi`,
        data,
      );
      if (response.data.success) {
        console.log("success", response.data);
        setPerdoruesiData(response.data.perdoruesiObj);
      }
      navigate("/");
    } catch (err) {
      if (err.response.data.error.includes("nuk ekziston")) {
        showAlert("Perdoruesi nuk ekziston", "error");
        return;
      }
      console.log(err);
    }
  };

  return (
    <div className=" bg-[#F5F7F8] pb-10  shadow-[#0F4C75] min-h-screen flex justify-center items-center p-4">
      <div
        className="w-full max-w-125
                bg-white rounded-lg shadow-2xl 
                p-4 sm:p-6 md:p-8 lg:p-10"
      >
        <div className="grid gap-4 sm:gap-6">
          <div>
            <h1>Kycu</h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 sm:gap-5"
            autoComplete="off"
          >
            <div className="grid gap-1">
              <label htmlFor="email" className="text-sm sm:text-base">
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Email"
                className="bg-inputbg rounded-sm w-full p-2 sm:p-3 pr-10 h-10 sm:h-12 "
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-1">
              <label
                htmlFor="fjalekalimi"
                className="block text-sm sm:text-base"
              >
                Fjalekalimi
              </label>
              <div className="relative">
                <input
                  id="fjalekalimi"
                  type={showPassword ? "text" : "password"}
                  placeholder="Fjalekalimi"
                  className="bg-inputbg rounded-sm w-full p-2 sm:p-3 pr-10 h-10 sm:h-12 "
                  onChange={(e) =>
                    setData({ ...data, fjalekalimi: e.target.value })
                  }
                  autoComplete="new-password"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                  <FontAwesomeIcon
                    icon={faEye}
                    className={
                      showPassword ? "!hidden" : "!block text-gray-800"
                    }
                    onClick={changeImage}
                    size="sm"
                  />
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    className={
                      showPassword ? "!block text-gray-600" : "!hidden"
                    }
                    onClick={changeImage}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="publikoPune w-full h-10 sm:h-12 text-sm sm:text-base"
              >
                Kycu
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <Link
                to="/"
                className="h-10 sm:h-12 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center"
              >
                ← Ballina
              </Link>

              <div className="grid gap-1 grid-cols-1 items-center">
                <p className="text-center text-sm text-gray-600">
                  Nuk keni llogari?
                </p>
                <Link
                  to="/regjistrimi"
                  className="h-10 sm:h-12 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center"
                >
                  Regjistrohuni
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Kycja;
