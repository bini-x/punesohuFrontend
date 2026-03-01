import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaGraduationCap,
  FaBriefcase,
  FaLink,
} from "react-icons/fa";
import Header from "./Header";
import axios from "axios";
import { useParams } from "react-router-dom";
import Perdoruesi from "../PerdoruesiContext";

const ProfiliAplikantitVizitor = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fotoProfile, setFotoProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("experience");

  const { perdoruesiData: currentUser } = Perdoruesi.usePerdoruesi();

  const formatDateDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (err) {
      console.error("Error formatting date:", dateString, err);
      return "";
    }
  };

  const merreShkronjatFillestare = () => {
    if (profileData && profileData.emri && profileData.mbiemri) {
      return (profileData.emri[0] + profileData.mbiemri[0]).toUpperCase();
    }
    if (profileData && profileData.kompania) {
      return profileData.kompania.substring(0, 2).toUpperCase();
    }
    return "?";
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profili/` + id,
        );
        const userData = response.data.data;
        setProfileData(userData);
        if (userData.foto) {
          setFotoProfile(
            `${import.meta.env.VITE_API_URL}/api/profili/` + id + "/foto",
          );
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Gabim ne ngarkimin e te dhenave te profilit");
        setLoading(false);
      }
    };

    if (id) fetchProfileData();
  }, [id]);

  if (loading) {
    return (
      <div
        className="flex flex-col items-center min-h-screen"
        style={{
          background: "linear-gradient(135deg, #F7FBFC 0%, #D6E6F2 100%)",
        }}
      >
        <Header withGradient={true} />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: "#D6E6F2" }}
            ></div>
            <p className="font-medium" style={{ color: "#5A7A99" }}>
              Duke ngarkuar profilin...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div
        className="flex flex-col items-center min-h-screen"
        style={{
          background: "linear-gradient(135deg, #F7FBFC 0%, #D6E6F2 100%)",
        }}
      >
        <Header withGradient={true} />
        <div className="max-w-6xl mx-auto p-8">
          <div className="bg-white border border-red-200 rounded-lg p-4 text-red-700">
            <p>{error || "Diqka shkoi keq. Profili nuk u gjet."}</p>
          </div>
        </div>
      </div>
    );
  }

  const eksperiencat = profileData.eksperiencat || [];
  const edukimi = profileData.edukimi || [];
  const projektet = profileData.projektet || [];
  const linqet = profileData.linqet || [];
  const eshteVetja = currentUser && currentUser._id === profileData._id;

  const tabs = [
    { key: "experience", label: "Pervoja" },
    { key: "education", label: "Edukimi" },
    { key: "projects", label: "Projektet" },
    { key: "skills", label: "Aftesite" },
    { key: "info", label: "Informacione" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <Header withGradient={true} />

      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-40 relative overflow-visible">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1440 320"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              style={{ zIndex: 1 }}
            >
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop
                    offset="0%"
                    style={{ stopColor: "#3a3a3a", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#4a4a4a", stopOpacity: 1 }}
                  />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop
                    offset="0%"
                    style={{ stopColor: "#4a4a4a", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#5a5a5a", stopOpacity: 1 }}
                  />
                </linearGradient>
                <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop
                    offset="0%"
                    style={{ stopColor: "#5a5a5a", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#6a6a6a", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>

              <path
                fill="url(#grad1)"
                d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                opacity="0.8"
              />
              <path
                fill="url(#grad2)"
                d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,165.3C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                opacity="0.6"
              />
              <path
                fill="url(#grad3)"
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                opacity="0.4"
              />
            </svg>

            <div
              className="absolute bottom-0 left-8 transform translate-y-1/2"
              style={{ zIndex: 50 }}
            >
              <div className="w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-white">
                {fotoProfile ? (
                  <img
                    src={fotoProfile}
                    alt="Foto Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "#5A7A99" }}
                  >
                    {merreShkronjatFillestare()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-15 pb-6 px-2">
            <div className="ml-7">
              <h1 className="text-3xl text-left font-bold text-gray-900 mb-1">
                {profileData.emri || profileData.kompania || ""}{" "}
                {profileData.mbiemri || ""}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                {profileData.profesioni && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#769FCD] text-lg font-medium mt-1">
                      {profileData.profesioni}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 mx-10">
            <div className="flex justify-center gap-8 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-4 font-medium text-sm transition-all relative ${
                    activeTab === tab.key
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 bg-primary left-0 right-0 h-0.5 transition-all duration-300"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === "experience" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Pervoja Profesionale
                </h2>
                {eksperiencat.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">
                    Nuk ka pervoja te shtuara
                  </p>
                ) : (
                  <div className="space-y-4">
                    {eksperiencat.map((exp, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #F7FBFC 0%, #D6E6F2 100%)",
                            }}
                          >
                            <FaBriefcase
                              style={{ color: "#5A7A99" }}
                              size={18}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {exp.titulli}
                            </h3>
                            <p className="text-gray-600 font-medium">
                              {exp.kompania}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {formatDateDDMMYYYY(exp.dataFillimit)}
                              {" - "}
                              {exp.aktuale
                                ? "Aktuale"
                                : formatDateDDMMYYYY(exp.dataMbarimit)}
                            </p>
                            {exp.pershkrimi && (
                              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                                {exp.pershkrimi}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "education" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Edukimi
                </h2>
                {edukimi.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">
                    Nuk ka arsimim te shtuar
                  </p>
                ) : (
                  <div className="space-y-4">
                    {edukimi.map((edu, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #F7FBFC 0%, #D6E6F2 100%)",
                            }}
                          >
                            <FaGraduationCap
                              style={{ color: "#5A7A99" }}
                              size={18}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {edu.titulli}
                            </h3>
                            <p className="text-gray-600 font-medium">
                              {edu.institucioni}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {formatDateDDMMYYYY(edu.dataFillimit)}
                              {" - "}
                              {edu.aktualet
                                ? "Aktuale"
                                : formatDateDDMMYYYY(edu.dataMbarimit)}
                            </p>
                            {edu.pershkrimi && (
                              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                                {edu.pershkrimi}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "projects" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Projektet
                </h2>
                {projektet.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">
                    Nuk ka projekte te shtuara
                  </p>
                ) : (
                  <div className="space-y-4">
                    {projektet.map((proj, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #F7FBFC 0%, #D6E6F2 100%)",
                            }}
                          >
                            <FaLink style={{ color: "#5A7A99" }} size={16} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {proj.emriProjektit}
                            </h3>
                            {proj.pershkrimi && (
                              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                                {proj.pershkrimi}
                              </p>
                            )}
                            {proj.teknologjite && (
                              <p className="text-sm text-gray-500 mt-2">
                                <span className="font-medium text-gray-700">
                                  Teknologjite:
                                </span>
                                {" " + proj.teknologjite}
                              </p>
                            )}
                            {proj.linku && (
                              <a
                                href={proj.linku}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 font-medium text-sm hover:underline"
                                style={{ color: "#5A7A99" }}
                              >
                                Shiko projektin →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "skills" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Aftesite
                </h2>
                {!profileData.aftesite || profileData.aftesite.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">
                    Nuk ka aftesi te shtuara
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {profileData.aftesite.map((aftesi, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:shadow-md transition-shadow"
                        style={{
                          background:
                            "linear-gradient(135deg, #F7FBFC 0%, #D6E6F2 100%)",
                          color: "#5A7A99",
                        }}
                      >
                        {aftesi}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "info" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Informacione Kontaktuese
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <FaEnvelope
                      className="shrink-0 mt-1"
                      style={{ color: "#5A7A99" }}
                    />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="text-gray-900 font-medium">
                        {profileData.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  {profileData.nrTelefonit && (
                    <div className="flex items-start gap-3">
                      <FaPhone
                        className="shrink-0 mt-1"
                        style={{ color: "#5A7A99" }}
                      />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Telefon</p>
                        <p className="text-gray-900 font-medium">
                          {profileData.nrTelefonit}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <FaCalendarAlt
                      className="shrink-0 mt-1"
                      style={{ color: "#5A7A99" }}
                    />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Anetar qe nga
                      </p>
                      <p className="text-gray-900 font-medium">
                        {profileData.createdAt
                          ? formatDateDDMMYYYY(profileData.createdAt)
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {linqet.length > 0 && (
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Linqet Sociale
                      </h3>
                      <div className="space-y-3">
                        {linqet.map((socialLink, index) => (
                          <a
                            key={index}
                            href={socialLink.linku}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:underline"
                            style={{ color: "#5A7A99" }}
                          >
                            {socialLink.platforma} →
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {eshteVetja && (
          <div
            className="mt-4 bg-white border rounded-lg p-4 shadow-sm"
            style={{ borderColor: "#D6E6F2" }}
          >
            <p className="text-center text-sm" style={{ color: "#5A7A99" }}>
              Ju jeni duke pare profilin tuaj. Per te ndryshuar te dhena, shkoni
              te faqja e profilit tuaj.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfiliAplikantitVizitor;
