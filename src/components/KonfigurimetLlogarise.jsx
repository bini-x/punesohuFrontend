import Header from "./Header";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "../contexts/AlertContext";
import Perdoruesi from "../PerdoruesiContext";

function KonfigurimetLlogarise() {
  const { showAlert } = useAlert();
  const { perdoruesiData, setPerdoruesiData } = Perdoruesi.usePerdoruesi();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const togglePasswordVisibility = (field) => {
    if (field === "current") setShowPassword(!showPassword);
    if (field === "new") setShowNewPassword(!showNewPassword);
    if (field === "repeat") setShowRepeatPassword(!showRepeatPassword);
  };

  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        );
        setPerdoruesiData(response.data.data);
      } catch (error) {
        console.error(error);
        showAlert("Gabim gjatë ngarkimit të të dhënave", "error");
      }
    };

    if (id && perdoruesiData?.tipiPerdoruesit) {
      fetchData();
    }
  }, [id, perdoruesiData?.tipiPerdoruesit]);

  const validatePassword = (password) => {
    if (password.length < 8) {
      showAlert("Fjalëkalimi duhet të jetë të paktën 8 karaktere", "warning");
      return false;
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      showAlert(
        "Fjalëkalimi duhet të përmbajë shkronja të vogla dhe të mëdha",
        "warning",
      );
      return false;
    }

    if (!/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
      showAlert(
        "Fjalëkalimi duhet të përmbajë të paktën 1 numër ose simbol",
        "warning",
      );
      return false;
    }

    if (/\s/.test(password)) {
      showAlert("Fjalëkalimi nuk duhet të përmbajë hapësira", "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentPassword || newPassword || repeatPassword) {
      if (!currentPassword) {
        showAlert("Ju lutem shkruani fjalëkalimin aktual", "warning");
        return;
      }

      if (!newPassword) {
        showAlert("Ju lutem shkruani fjalëkalimin e ri", "warning");
        return;
      }

      if (!repeatPassword) {
        showAlert("Ju lutem konfirmoni fjalëkalimin e ri", "warning");
        return;
      }

      if (newPassword !== repeatPassword) {
        showAlert("Fjalëkalimi i ri dhe konfirmimi nuk përputhen!", "warning");
        return;
      }

      if (!validatePassword(newPassword)) {
        return;
      }

      if (currentPassword !== perdoruesiData.fjalekalimi) {
        showAlert("Fjalëkalimi aktual nuk është i saktë", "error");
        return;
      }
    }

    try {
      let dataToSend;

      if (perdoruesiData.tipiPerdoruesit === "aplikant") {
        if (!perdoruesiData.emri || !perdoruesiData.mbiemri) {
          showAlert("Ju lutem plotësoni emrin dhe mbiemrin", "warning");
          return;
        }

        dataToSend = {
          tipiPerdoruesit: "aplikant",
          emri: perdoruesiData.emri,
          mbiemri: perdoruesiData.mbiemri,
          email: perdoruesiData.email,
          fjalekalimi: perdoruesiData.fjalekalimi,
          nrTelefonit: perdoruesiData.nrTelefonit,
        };
      } else if (perdoruesiData.tipiPerdoruesit === "punedhenes") {
        if (!perdoruesiData.kompania) {
          showAlert("Ju lutem plotësoni emrin e kompanisë", "warning");
          return;
        }

        dataToSend = {
          tipiPerdoruesit: "punedhenes",
          kompania: perdoruesiData.kompania,
          email: perdoruesiData.email,
          fjalekalimi: perdoruesiData.fjalekalimi,
          nrTelefonit: perdoruesiData.nrTelefonit,
        };
      }

      if (newPassword) {
        dataToSend.fjalekalimi = newPassword;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        dataToSend,
      );

      if (response.data.success) {
        showAlert("Të dhënat u përditësuan me sukses!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setRepeatPassword("");

        if (newPassword) {
          setPerdoruesiData((prev) => ({
            ...prev,
            fjalekalimi: newPassword,
          }));
        }
      }
    } catch (err) {
      console.error(err);

      if (err.response?.data?.error?.includes("ekziston")) {
        showAlert("Përdoruesi me këtë email ekziston", "error");
      } else if (err.response?.data?.message) {
        showAlert(err.response.data.message, "error");
      } else {
        showAlert("Gabim gjatë përditësimit të të dhënave", "error");
      }
    }
  };

  const modifikoProfilin = (e) => {
    const { id, value } = e.target;
    setPerdoruesiData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  if (!perdoruesiData) {
    return (
      <div className="min-h-screen">
        <Header withGradient={true} />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Qasje e ndaluar
            </h2>
            <p className="text-gray-600 mb-6">
              Vetëm përdoruesit mund t'i modifikojnë konfigurimet e llogarisë.
              Nëse keni llogari, ju lutemi kycuni.
            </p>
            <a
              href="/kycja"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg font-semibold hover:from-[#3282B8] hover:to-[#0F4C75] transition-all duration-300"
            >
              Kycu
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <Header withGradient={true} />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#0F4C75] px-8 py-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <FontAwesomeIcon icon={faUserCog} className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-left">
                  Konfigurimet e Llogarisë
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Përditësoni të dhënat personale dhe fjalëkalimin
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              autoComplete="off"
            >
              {perdoruesiData.tipiPerdoruesit === "aplikant" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="emri"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Emri
                      </label>
                      <input
                        id="emri"
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition"
                        onChange={modifikoProfilin}
                        value={perdoruesiData.emri || ""}
                        placeholder="Shkruani emrin"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="mbiemri"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mbiemri
                      </label>
                      <input
                        id="mbiemri"
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition"
                        onChange={modifikoProfilin}
                        value={perdoruesiData.mbiemri || ""}
                        placeholder="Shkruani mbiemrin"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label
                    htmlFor="kompania"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Emri i Kompanisë
                  </label>
                  <input
                    id="kompania"
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition"
                    onChange={modifikoProfilin}
                    value={perdoruesiData.kompania || ""}
                    placeholder="Shkruani emrin e kompanisë"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition"
                  onChange={modifikoProfilin}
                  value={perdoruesiData.email || ""}
                  placeholder="email@example.com"
                />
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">
                    Ndrysho fjalëkalimin
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="fjalekalimi"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fjalëkalimi Aktual
                  </label>
                  <div className="relative">
                    <input
                      id="fjalekalimi"
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition pr-10"
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      value={currentPassword}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fjalëkalimi i Ri
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition pr-10"
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={showNewPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="repeatPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Konfirmo Fjalëkalimin e Ri
                  </label>
                  <div className="relative">
                    <input
                      id="repeatPassword"
                      type={showRepeatPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition pr-10"
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      value={repeatPassword}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("repeat")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={showRepeatPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="text-sm font-semibold text-[#0F4C75] mb-2">
                  Kërkesat për fjalëkalimin:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>të përmbajë shkronja të vogla dhe të mëdha</li>
                  <li>të përmbajë të paktën 1 numër ose simbol</li>
                  <li>të jetë të paktën 8 karaktere i gjatë</li>
                  <li>të përputhet në të dy fushat</li>
                  <li>të mos përmbajë hapësira</li>
                </ul>
              </div>

              <div className="pt-4">
                <button type="submit" className="publikoPune">
                  Përditëso të dhënat
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KonfigurimetLlogarise;
