import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBriefcase,
  FaBuilding,
} from "react-icons/fa";
import { MapPin, Users, BriefcaseBusiness } from "lucide-react";
import Header from "./Header";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProfiliKompaniseVizitor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fotoProfile, setFotoProfile] = useState(null);
  const [puneHapura, setPuneHapura] = useState([]);
  const [activeTab, setActiveTab] = useState("jobs");

  const formatDateDDMMYYYY = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "";
    }
  };

  const merreShkronjatFillestare = () => {
    if (profileData?.kompania) {
      return profileData.kompania.substring(0, 2).toUpperCase();
    }
    return "?";
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        );

        const userData = response.data.data;
        setProfileData(userData);

        if (userData.foto) {
          setFotoProfile(
            `${import.meta.env.VITE_API_URL}/api/profili/${id}/foto`,
          );
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Gabim në ngarkimin e të dhënave të profilit");
        setLoading(false);
      }
    };

    if (id) {
      fetchProfileData();
    }
  }, [id]);

  useEffect(() => {
    const fetchCompanyJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/shpallja/kompania`,
        );
        if (response.data.success) {
          const companyJobs = response.data.data.filter(
            (job) => job.perdoruesiId?._id === id || job.perdoruesiId === id,
          );
          setPuneHapura(companyJobs);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchCompanyJobs();
    }
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
                    alt="Logo Kompania"
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

          <div className="pt-5 pb-4 px-2">
            <div className="flex justify-end"></div>

            <div className="ml-8">
              <h1 className="text-3xl text-left font-bold text-gray-900 mt-10">
                {profileData?.kompania || "Kompania"}
              </h1>
              <p className="text-gray-600 mb-4 max-w-2xl line-clamp-2">
                {profileData?.rrethKompanise}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                {profileData?.vendodhja && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} style={{ color: "#5A7A99" }} />
                    <span>{profileData.vendodhja}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness size={16} style={{ color: "#5A7A99" }} />
                  <span>{puneHapura.length} punë të publikuara</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 mx-10">
            <div className="flex justify-center gap-8 px-8">
              <button
                onClick={() => setActiveTab("jobs")}
                className={`px-4 py-4 font-medium text-sm transition-all relative ${
                  activeTab === "jobs"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Punë të Kompanisë
                {activeTab === "jobs" && (
                  <div className="absolute bottom-0 bg-primary left-0 right-0 h-0.5 transition-all duration-300"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`px-4 py-4 font-medium text-sm transition-all relative ${
                  activeTab === "about"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Rreth Kompanisë
                {activeTab === "about" && (
                  <div className="absolute bottom-0 bg-primary left-0 right-0 h-0.5 transition-all duration-300"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className={`px-4 py-4 font-medium text-sm transition-all relative ${
                  activeTab === "info"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Informacione të Kompanisë
                {activeTab === "info" && (
                  <div className="absolute bottom-0 bg-primary left-0 right-0 h-0.5 transition-all duration-300"></div>
                )}
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === "jobs" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Punë të hapura të {profileData?.kompania}
                </h2>
                {puneHapura.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">
                    Nuk ka pozicione të hapura aktualisht
                  </p>
                ) : (
                  <div className="space-y-4">
                    {puneHapura.map((pune) => (
                      <div
                        key={pune._id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/shpallja/${pune._id}`)}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #F7FBFC 0%, #D6E6F2 100%)",
                            }}
                          >
                            {fotoProfile ? (
                              <img
                                src={fotoProfile}
                                alt="Logo"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span
                                className="font-bold text-sm"
                                style={{ color: "#5A7A99" }}
                              >
                                {merreShkronjatFillestare()}
                              </span>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="mb-2">
                              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                {profileData?.kompania}
                              </p>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {pune.pozitaPunes}
                              </h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {pune.lokacioniPunes && (
                                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                  <MapPin size={14} />
                                  {pune.lokacioniPunes}
                                </span>
                              )}
                              {pune.niveliPunes && (
                                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                  <FaBriefcase size={12} />
                                  {pune.niveliPunes}
                                </span>
                              )}
                              {pune.kategoriaPunes && (
                                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                  {pune.kategoriaPunes}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Rreth Kompanisë
                </h2>
                {profileData?.rrethKompanise ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {profileData.rrethKompanise}
                  </p>
                ) : (
                  <p className="text-gray-500 text-center py-12">
                    Nuk ka informacione të shtuar akoma.
                  </p>
                )}
              </div>
            )}

            {activeTab === "info" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Informacione të Kompanisë
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <FaBuilding
                      className="shrink-0 mt-1"
                      style={{ color: "#5A7A99" }}
                    />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Emri i Kompanisë
                      </p>
                      <p className="text-gray-900 font-medium">
                        {profileData?.kompania || "N/A"}
                      </p>
                    </div>
                  </div>

                  {profileData?.email && (
                    <div className="flex items-start gap-3">
                      <FaEnvelope
                        className="shrink-0 mt-1"
                        style={{ color: "#5A7A99" }}
                      />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="text-gray-900 font-medium break-all">
                          {profileData.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {profileData?.nrTelefonit && (
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
                        Anëtar që nga
                      </p>
                      <p className="text-gray-900 font-medium">
                        {profileData?.createdAt
                          ? formatDateDDMMYYYY(profileData.createdAt)
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {profileData?.linqet && profileData.linqet.length > 0 && (
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Linqet Sociale
                      </h3>
                      <div className="space-y-3">
                        {profileData.linqet.map((item, index) => (
                          <a
                            key={index}
                            href={item.linku || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:underline"
                            style={{ color: "#5A7A99" }}
                          >
                            {item.platforma} →
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
      </div>
    </div>
  );
};

export default ProfiliKompaniseVizitor;
