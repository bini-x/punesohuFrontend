import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { useState } from "react";
import axios from "axios";
import { useAlert } from "../contexts/AlertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons/faEyeSlash";

function Regjistrimi() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [tipiPerdoruesit, setTipiPerdoruesit] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [dataAplikant, setDataAplikant] = useState({
    emri: "",
    mbiemri: "",
    email: "",
    fjalekalimi: "",
    konfirmoFjalekalimin: "",
  });

  const [dataPunedhenesi, setDataPunedhenesi] = useState({
    kompania: "",
    email: "",
    fjalekalimi: "",
    konfirmoFjalekalimin: "",
  });

  const validatePassword = (password) => {
    // At least 8 characters
    if (password.length < 8) {
      showAlert("Fjalëkalimi duhet të jetë të paktën 8 karaktere", "warning");
      return false;
    }

    // Contains uppercase and lowercase
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      showAlert(
        "Fjalëkalimi duhet të përmbajë shkronja të vogla dhe të mëdha",
        "warning",
      );
      return false;
    }

    // Contains at least one number or symbol
    if (!/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
      showAlert(
        "Fjalëkalimi duhet të përmbajë të paktën 1 numër ose simbol",
        "warning",
      );
      return false;
    }

    // No spaces
    if (/\s/.test(password)) {
      showAlert("Fjalëkalimi nuk duhet të përmbajë hapësira", "warning");
      return false;
    }

    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Ju lutem shkruani një email të vlefshëm", "warning");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let dataToSend;

      if (!tipiPerdoruesit) {
        showAlert("Ju lutem zgjidhni tipin e përdoruesit", "warning");
        return;
      }

      if (tipiPerdoruesit === "aplikant") {
        // Validate all fields
        if (
          !dataAplikant.emri.trim() ||
          !dataAplikant.mbiemri.trim() ||
          !dataAplikant.email.trim() ||
          !dataAplikant.fjalekalimi ||
          !dataAplikant.konfirmoFjalekalimin
        ) {
          showAlert("Ju lutem plotësoni të gjitha fushat", "warning");
          return;
        }

        // Validate email
        if (!validateEmail(dataAplikant.email)) {
          return;
        }

        // Validate passwords match
        if (dataAplikant.fjalekalimi !== dataAplikant.konfirmoFjalekalimin) {
          showAlert("Fjalëkalimet nuk përputhen!", "warning");
          return;
        }

        // Validate password strength
        if (!validatePassword(dataAplikant.fjalekalimi)) {
          return;
        }

        dataToSend = {
          tipiPerdoruesit: "aplikant",
          emri: dataAplikant.emri.trim(),
          mbiemri: dataAplikant.mbiemri.trim(),
          email: dataAplikant.email.trim().toLowerCase(),
          fjalekalimi: dataAplikant.fjalekalimi,
        };
      } else if (tipiPerdoruesit === "punedhenes") {
        if (
          !dataPunedhenesi.kompania.trim() ||
          !dataPunedhenesi.email.trim() ||
          !dataPunedhenesi.fjalekalimi ||
          !dataPunedhenesi.konfirmoFjalekalimin
        ) {
          showAlert("Ju lutem plotësoni të gjitha fushat", "warning");
          return;
        }

        if (!validateEmail(dataPunedhenesi.email)) {
          return;
        }

        if (
          dataPunedhenesi.fjalekalimi !== dataPunedhenesi.konfirmoFjalekalimin
        ) {
          showAlert("Fjalëkalimet nuk përputhen!", "warning");
          return;
        }

        if (!validatePassword(dataPunedhenesi.fjalekalimi)) {
          return;
        }

        dataToSend = {
          tipiPerdoruesit: "punedhenes",
          kompania: dataPunedhenesi.kompania.trim(),
          email: dataPunedhenesi.email.trim().toLowerCase(),
          fjalekalimi: dataPunedhenesi.fjalekalimi,
        };
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/regjistrimi/perdoruesi`,
        dataToSend,
      );

      if (response.data.success) {
        showAlert(
          "Regjistrimi u krye me sukses! Ju lutem verifikoni email-in tuaj.",
          "success",
        );

        if (tipiPerdoruesit === "aplikant") {
          localStorage.setItem("emailForVerification", dataAplikant.email);
        } else if (tipiPerdoruesit === "punedhenes") {
          localStorage.setItem("emailForVerification", dataPunedhenesi.email);
        }

        setTimeout(() => {
          navigate("/verifiko");
        }, 1500);
      }
    } catch (err) {
      console.log("err: ", err);

      if (err.response?.data?.error) {
        if (err.response.data.error.includes("ekziston")) {
          showAlert("Ky përdorues ekziston tashmë!", "error");
        } else {
          showAlert(err.response.data.error, "error");
        }
      } else {
        showAlert("Diçka shkoi keq. Ju lutem provoni përsëri.", "error");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-[#F5F7F8] pb-10  shadow-[#0F4C75]">
      <div
        className="w-full max-w-162.5
                bg-white rounded-lg shadow-2xl 
                p-4 sm:p-6 md:p-8 lg:p-10"
      >
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div className="text-center">
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-4 md:mb-6">
              Regjistrimi
            </h1>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="grid  grid-cols-[repeat(2,minmax(100px,130px))] place-self-center gap-3 sm:gap-4">
              <div>
                <input
                  id="aplikant"
                  type="radio"
                  name="tipiPerdoruesit"
                  value="aplikant"
                  className="hidden peer"
                  required
                  onChange={(e) => setTipiPerdoruesit(e.target.value)}
                />
                <label htmlFor="aplikant" className="labelRegjistrimi">
                  <span className="text-sm sm:text-base">Aplikant</span>
                </label>
              </div>

              <div>
                <input
                  id="punedhenes"
                  type="radio"
                  name="tipiPerdoruesit"
                  value="punedhenes"
                  className="hidden peer"
                  required
                  onChange={(e) => setTipiPerdoruesit(e.target.value)}
                />
                <label htmlFor="punedhenes" className="labelRegjistrimi">
                  <span className="text-sm sm:text-base">Punëdhënës</span>
                </label>
              </div>
            </div>
          </div>

          <div
            className={
              tipiPerdoruesit === "aplikant" || tipiPerdoruesit === ""
                ? "block"
                : "hidden"
            }
          >
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-3 sm:gap-4"
              autoComplete="off"
            >
              <div className="grid grid-cols-1 gap-1">
                <label htmlFor="emri" className="text-sm sm:text-base">
                  Emri <span className="text-red-500">*</span>
                </label>
                <input
                  id="emri"
                  type="text"
                  placeholder="Emri"
                  className="border-inputbg bg-inputbg rounded-sm p-2 sm:p-3 w-full h-10 sm:h-12 placeholder-gray-500"
                  onChange={(e) =>
                    setDataAplikant({
                      ...dataAplikant,
                      emri: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-1">
                <label htmlFor="mbiemri" className="text-sm sm:text-base">
                  Mbiemri <span className="text-red-500">*</span>
                </label>
                <input
                  id="mbiemri"
                  type="text"
                  placeholder="Mbiemri"
                  className="border-inputbg bg-inputbg rounded-sm p-2 sm:p-3 w-full h-10 sm:h-12 placeholder-gray-500"
                  onChange={(e) =>
                    setDataAplikant({
                      ...dataAplikant,
                      mbiemri: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-1">
                <label htmlFor="email" className="text-sm sm:text-base">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="shembull@gmail.com"
                  className="border-inputbg bg-inputbg rounded-sm p-2 sm:p-3 w-full h-10 sm:h-12 placeholder-gray-500"
                  onChange={(e) =>
                    setDataAplikant({
                      ...dataAplikant,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-1">
                <label htmlFor="fjalekalimi" className="text-sm sm:text-base">
                  Fjalëkalimi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="fjalekalimi"
                    type={showPassword ? "text" : "password"}
                    placeholder="Fjalëkalimi"
                    className="border-inputbg bg-inputbg rounded-sm p-2 sm:p-3 pr-10 w-full h-10 sm:h-12 placeholder-gray-500"
                    onChange={(e) =>
                      setDataAplikant({
                        ...dataAplikant,
                        fjalekalimi: e.target.value,
                      })
                    }
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faEye}
                      className={
                        showPassword ? "!hidden" : "!block text-gray-800"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                    />
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className={
                        showPassword ? "!block text-gray-600" : "!hidden"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <label
                  htmlFor="konfirmoFjalekalimin"
                  className="text-sm sm:text-base"
                >
                  Konfirmo Fjalëkalimin <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="konfirmoFjalekalimin"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmo fjalëkalimin"
                    className="border-inputbg bg-inputbg rounded-sm p-2 sm:p-3 pr-10 w-full h-10 sm:h-12 placeholder-gray-500"
                    onChange={(e) =>
                      setDataAplikant({
                        ...dataAplikant,
                        konfirmoFjalekalimin: e.target.value,
                      })
                    }
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faEye}
                      className={
                        showConfirmPassword ? "!hidden" : "!block text-gray-800"
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      size="sm"
                    />
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className={
                        showConfirmPassword ? "!block text-gray-600" : "!hidden"
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-xs">
                <p className="font-semibold text-blue-900 mb-1">
                  Kërkesat për fjalëkalimin:
                </p>
                <ul className="text-blue-700 space-y-0.5 list-disc list-inside">
                  <li>Të paktën 8 karaktere</li>
                  <li>Shkronja të vogla dhe të mëdha</li>
                  <li>Të paktën 1 numër ose simbol</li>
                  <li>Pa hapësira</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="publikoPune w-full h-10 sm:h-12 text-sm sm:text-base"
                >
                  Regjistrohu
                </button>
              </div>
            </form>
          </div>

          <div
            className={tipiPerdoruesit === "punedhenes" ? "block" : "hidden"}
          >
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-3 sm:gap-4"
            >
              <div className="grid grid-cols-1 gap-1">
                <label htmlFor="kompania" className="text-sm sm:text-base">
                  Kompania <span className="text-red-500">*</span>
                </label>
                <input
                  id="kompania"
                  type="text"
                  placeholder="Emri i kompanisë"
                  className="border-inputbg bg-inputbg rounded-sm p-2 sm:p-3 w-full h-10 sm:h-12 placeholder-gray-500"
                  onChange={(e) =>
                    setDataPunedhenesi({
                      ...dataPunedhenesi,
                      kompania: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-1">
                <label htmlFor="email_p" className="text-sm sm:text-base">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email_p"
                  type="email"
                  placeholder="kompania@gmail.com"
                  className="border-inputbg bg-inputbg rounded-sm p-2 sm:p-3 w-full h-10 sm:h-12 placeholder-gray-500"
                  onChange={(e) =>
                    setDataPunedhenesi({
                      ...dataPunedhenesi,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-1">
                <label htmlFor="fjalekalimi_p" className="text-sm sm:text-base">
                  Fjalëkalimin <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="fjalekalimi_p"
                    type={showPassword ? "text" : "password"}
                    placeholder="Fjalëkalimi"
                    className="border-inputbg bg-inputbg rounded-sm p-2 sm:p-3 pr-10 w-full h-10 sm:h-12 placeholder-gray-500"
                    onChange={(e) =>
                      setDataPunedhenesi({
                        ...dataPunedhenesi,
                        fjalekalimi: e.target.value,
                      })
                    }
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faEye}
                      className={
                        showPassword ? "!hidden" : "!block text-gray-800"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                    />
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className={
                        showPassword ? "!block text-gray-600" : "!hidden"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <label
                  htmlFor="konfirmoFjalekalimin_p"
                  className="text-sm sm:text-base"
                >
                  Konfirmo fjalëkalimin <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="konfirmoFjalekalimin_p"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmo fjalëkalimin"
                    className="border-inputbg bg-inputbg rounded-sm p-2 sm:p-3 pr-10 w-full h-10 sm:h-12 placeholder-gray-500"
                    onChange={(e) =>
                      setDataPunedhenesi({
                        ...dataPunedhenesi,
                        konfirmoFjalekalimin: e.target.value,
                      })
                    }
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    <FontAwesomeIcon
                      icon={faEye}
                      className={
                        showConfirmPassword ? "!hidden" : "!block text-gray-800"
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      size="sm"
                    />
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className={
                        showConfirmPassword ? "!block text-gray-600" : "!hidden"
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-xs">
                <p className="font-semibold text-blue-900 mb-1">
                  Kërkesat për fjalëkalimin:
                </p>
                <ul className="text-blue-700 space-y-0.5 list-disc list-inside">
                  <li>Të paktën 8 karaktere</li>
                  <li>Shkronja të vogla dhe të mëdha</li>
                  <li>Të paktën 1 numër ose simbol</li>
                  <li>Pa hapësira</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="butoniKycjeRegjistrim w-full h-10 sm:h-12 text-sm sm:text-base"
                >
                  Regjistrohu
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <Link
              to="/"
              className="h-10 sm:h-12 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center"
            >
              ← Ballina
            </Link>

            <div className="grid gap-1">
              <p className="text-center text-sm  text-gray-600">
                Keni Llogari?
              </p>
              <Link
                to="/kycja"
                className="h-10 sm:h-12 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center"
              >
                Kycuni
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Regjistrimi;
