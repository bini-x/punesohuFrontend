import { useState, useEffect, useRef } from "react";
import "../index.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Phone,
  Plus,
  Edit2,
  Upload,
  Link,
  X,
  Camera,
  MapPin,
  Trash2,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import Perdoruesi from "../PerdoruesiContext";
import { useAlert } from "../contexts/AlertContext";

function ProfiliKompanise() {
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useAlert();
  const { id } = useParams();
  const { perdoruesiData, setPerdoruesiData } = Perdoruesi.usePerdoruesi();
  const [shfaqLinkeForm, setShfaqLinkeForm] = useState(false);
  const [puneHapura, setPuneHapura] = useState([]);
  const [fotoProfile, setFotoProfile] = useState(null);
  const [poNgarkohetFoto, setPoNgarkohetFoto] = useState(false);
  const inputFotoRef = useRef(null);
  const [editKompaniaMode, setEditKompaniaMode] = useState(false);
  const [newKompaniaData, setNewKompaniaData] = useState({
    kompania: "",
    nrTelefonit: "",
  });

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/shpallja/kompania/im`,
        );
        console.log(response.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          const activeJobs = response.data.data.filter(
            (job) => job.status === "aktiv",
          );
          setPuneHapura(activeJobs);
        } else {
          setPuneHapura([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployerJobs();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        );
        if (response.data.success) {
          setPerdoruesiData(response.data.data);
        }

        if (response.data.data.foto) {
          setFotoProfile(
            `${import.meta.env.VITE_API_URL}/api/profili/${id}/foto`,
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const merreShkronjatFillestare = () => {
    if (perdoruesiData?.kompania) {
      return perdoruesiData.kompania.substring(0, 2).toUpperCase();
    }
    return "KO";
  };

  const handleNgarkoFoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const llojetELejuara = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!llojetELejuara.includes(file.type)) {
      showAlert(
        "Vetëm fotot janë të lejuara (JPEG, PNG, WEBP, GIF)",
        "warning",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert(
        "Madhësia e fotos është shumë e madhe. Maksimumi 5MB",
        "warning",
      );
      return;
    }

    const formData = new FormData();
    formData.append("photoFile", file);
    setPoNgarkohetFoto(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profili/${id}/ngarko-foto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        const newPhotoUrl = `${import.meta.env.VITE_API_URL}/api/profili/${id}/foto?t=${Date.now()}`;
        setFotoProfile(newPhotoUrl);

        setPerdoruesiData((prev) => ({
          ...prev,
          foto: { data: true },
        }));

        showAlert("Fotoja u ngarkua me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert(
        error.response?.data?.message || "Gabim në ngarkimin e fotos",
        "error",
      );
    } finally {
      setPoNgarkohetFoto(false);
    }
  };

  const handleFshijFoto = async () => {
    showConfirm(
      "Jeni të sigurt që dëshironi të fshini foton?",
      "Fshi Foto",
      async () => {
        try {
          const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/profili/${id}/foto`,
          );

          if (response.data.success) {
            setFotoProfile(null);
            setPerdoruesiData((prev) => {
              const updated = { ...prev };
              delete updated.foto;
              return updated;
            });
            showAlert("Fotoja u fshi me sukses!", "success");
          }
        } catch (error) {
          console.error(error);
          showAlert("Gabim në fshirjen e fotos", "error");
        }
      },
    );
  };

  const [editMode, setEditMode] = useState({
    rrethKompanise: false,
    permbledhje: false,
  });

  const [rrethKompanise, setRrethKompanise] = useState("");

  const handleSaveKompania = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        {
          kompania: newKompaniaData.kompania,
          nrTelefonit: newKompaniaData.nrTelefonit,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        setEditKompaniaMode(false);
        showAlert("U përditësua me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim gjatë përditësimit", "error");
    }
  };

  const [linkRi, setLinkRi] = useState({
    platforma: "",
    linku: "",
  });

  const handleShtoLink = async () => {
    if (!linkRi.platforma || !linkRi.linku) {
      showAlert("Ju lutem plotësoni të dyja fushat", "info");
      return;
    }

    try {
      const newLink = {
        platforma: linkRi.platforma,
        linku: linkRi.linku,
      };

      const updatedLinks = [...(perdoruesiData?.linqet || []), newLink];

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        {
          linqet: updatedLinks,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        setLinkRi({
          platforma: "",
          linku: "",
        });
        setShfaqLinkeForm(false);
        showAlert("Linku u shtua me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim në ruajtjen e linkut", "error");
    }
  };

  const handleFshijLinkin = async (index) => {
    showConfirm(
      "Jeni të sigurt që dëshironi ta fshini këtë link?",
      "Fshi Link",
      async () => {
        try {
          const updatedLinks = (perdoruesiData?.linqet || []).filter(
            (_, i) => i !== index,
          );

          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
            {
              linqet: updatedLinks,
            },
          );

          if (response.data.success) {
            setPerdoruesiData(response.data.data);
            showAlert("Linku u fshi me sukses!", "success");
          }
        } catch (error) {
          console.error(error);
          showAlert("Gabim në fshirjen e linkut", "error");
        }
      },
    );
  };

  const handleRuajRrethKompanise = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        {
          rrethKompanise,
        },
      );
      if (response.data.success) {
        setPerdoruesiData((prev) => ({
          ...prev,
          ...response.data.data,
          rrethKompanise,
        }));
        setEditMode({ ...editMode, rrethKompanise: false });
        showAlert("Përditësuar me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim në përditësim", "error");
    }
  };

  useEffect(() => {
    if (perdoruesiData?.rrethKompanise) {
      setRrethKompanise(perdoruesiData.rrethKompanise);
    }
  }, [perdoruesiData]);

  return (
    <div className="max-w-5xl mx-auto mb-8 mt-10 px-4">
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-6 border border-gray-200">
        <div className="h-32 relative overflow-hidden">
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
          <div className="absolute top-6 right-6" style={{ zIndex: 2 }}>
            <button
              onClick={() => navigate("/publikopune")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-800 border border-gray-400 rounded-xl hover:shadow-lg hover:bg-[#F5F7F8] transition-all duration-200 font-medium"
            >
              <Upload size={18} />
              Publiko Punë
            </button>
          </div>
        </div>

        <div
          className="px-8 pb-8 -mt-16"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-white flex items-center justify-center text-[#769FCD] text-4xl font-bold shadow-xl border-4 border-white overflow-hidden">
                {fotoProfile ? (
                  <img
                    src={fotoProfile}
                    alt="Logo Kompania"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  merreShkronjatFillestare()
                )}
              </div>

              <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => inputFotoRef.current?.click()}
                  disabled={poNgarkohetFoto}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#769FCD] hover:bg-[#5a82b3] text-white shadow-md transition-all disabled:bg-gray-400"
                  title="Ngarko logo"
                >
                  {poNgarkohetFoto ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera size={14} />
                  )}
                </button>

                {fotoProfile && (
                  <button
                    onClick={handleFshijFoto}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md transition-all"
                    title="Fshi logo"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <input
                ref={inputFotoRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleNgarkoFoto}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center sm:text-left w-full mt-4 sm:mt-16">
              {editKompaniaMode ? (
                <form
                  onSubmit={handleSaveKompania}
                  className="space-y-4 bg-[#F5F7F8] p-6 rounded-2xl border border-gray-200"
                >
                  <input
                    type="text"
                    value={newKompaniaData.kompania}
                    onChange={(e) =>
                      setNewKompaniaData({
                        ...newKompaniaData,
                        kompania: e.target.value,
                      })
                    }
                    placeholder="Emri i kompanisë"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#769FCD]"
                    required
                  />

                  <div className="flex items-center gap-2 text-gray-600 bg-white px-4 py-3 rounded-xl border border-gray-200">
                    <Mail size={18} className="text-gray-500" />
                    <span>{perdoruesiData?.email || "email@kompania.com"}</span>
                  </div>

                  <input
                    type="text"
                    value={newKompaniaData.nrTelefonit}
                    onChange={(e) =>
                      setNewKompaniaData({
                        ...newKompaniaData,
                        nrTelefonit: e.target.value,
                      })
                    }
                    placeholder="Numri i telefonit"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#769FCD]"
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditKompaniaMode(false)}
                      className="flex-1 bg-white border border-gray-200 hover:bg-[#F5F7F8] text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200"
                    >
                      Anulo
                    </button>
                    <button type="submit" className="flex-1 publikoPune">
                      Ruaj Ndryshimet
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-4 mt-3">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {perdoruesiData?.kompania || "Emri i Kompanisë"}
                    </h1>

                    <button
                      onClick={() => {
                        setNewKompaniaData({
                          kompania: perdoruesiData?.kompania || "",
                          nrTelefonit:
                            perdoruesiData?.nrTelefonit?.toString() || "",
                        });
                        setEditKompaniaMode(true);
                      }}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 hover:bg-[#F5F7F8] transition-all duration-200"
                      title="Modifiko profilin"
                    >
                      <Edit2 size={18} className="text-gray-700" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-[#F5F7F8] flex items-center justify-center">
                        <Mail size={16} className="text-gray-700" />
                      </div>
                      <span>
                        {perdoruesiData?.email || "email@kompania.com"}
                      </span>
                    </div>

                    {perdoruesiData?.nrTelefonit ? (
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-[#F5F7F8] flex items-center justify-center">
                          <Phone size={16} className="text-gray-700" />
                        </div>
                        <span>{perdoruesiData.nrTelefonit}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-[#F5F7F8] flex items-center justify-center">
                          <Phone size={16} className="text-gray-700" />
                        </div>
                        <span className="text-gray-400">+383-44-XXX-XXX</span>
                      </div>
                    )}
                  </div>

                  {/* Links Section */}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {perdoruesiData?.linqet?.map((link, index) => (
                        <div key={index} className="group relative">
                          <a
                            href={link.linku}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F7F8] text-gray-700 rounded-xl text-sm hover:bg-[#D6E6F2] transition-all duration-200 border border-[#F5F7F8]"
                          >
                            <Link size={14} />
                            {link.platforma}
                          </a>
                          <button
                            onClick={() => handleFshijLinkin(index)}
                            className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setShfaqLinkeForm(!shfaqLinkeForm)}
                        className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-400 text-gray-700 rounded-xl text-sm hover:bg-[#F5F7F8] transition-all duration-200"
                      >
                        <Plus size={14} />
                        Shto Link
                      </button>
                    </div>

                    {shfaqLinkeForm && (
                      <div className="mt-4 p-4 bg-[#F5F7F8] rounded-xl border border-gray-200">
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Platforma (p.sh. LinkedIn, Website)"
                            value={linkRi.platforma}
                            onChange={(e) =>
                              setLinkRi({
                                ...linkRi,
                                platforma: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                          />
                          <input
                            type="url"
                            placeholder="URL"
                            value={linkRi.linku}
                            onChange={(e) =>
                              setLinkRi({ ...linkRi, linku: e.target.value })
                            }
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleShtoLink}
                              className="publikoPune w-fit"
                            >
                              Ruaj
                            </button>
                            <button
                              onClick={() => setShfaqLinkeForm(false)}
                              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-[#F5F7F8] text-sm transition-all duration-200"
                            >
                              Anulo
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden p-8 border border-gray-200">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6E6F2] to-[#B9D7EA] flex items-center justify-center">
                <Briefcase size={20} className="text-[#769FCD]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-700">
                  Punë të Hapura
                </h2>
                <p className="text-sm text-gray-500">
                  {puneHapura.length} pozicione aktive
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {puneHapura.length === 0 ? (
              <div className="text-center py-12 bg-[#F5F7F8] rounded-2xl border border-dashed border-gray-300">
                <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">
                  Nuk ka pozicione të hapura aktualisht
                </p>
                <button
                  onClick={() => navigate("/publikopune")}
                  className="publikoPune w-fit"
                >
                  Publiko Pozicionin e Parë
                </button>
              </div>
            ) : (
              <>
                {puneHapura.slice(0, 2).map((pune) => (
                  <div
                    key={pune.id}
                    onClick={() => navigate(`/shpallja/${pune._id}`)}
                    className="relative p-5 bg-[#F5F7F8] rounded-2xl border border-gray-200 hover:shadow-md hover:border-[#769FCD] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-[#769FCD] transition-colors">
                          {pune.pozitaPunes}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-gradient-to-r from-[#D6E6F2] to-[#B9D7EA] text-[#769FCD] rounded-lg text-xs font-medium">
                            {pune.kategoriaPunes}
                          </span>
                          {pune.lokacioniPunes && (
                            <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center gap-1">
                              <MapPin size={12} />
                              {pune.lokacioniPunes}
                            </span>
                          )}
                        </div>
                        {(pune.aftesitePrimare?.length > 0 ||
                          pune.aftesiteSekondare?.length > 0) && (
                          <div className="flex flex-wrap gap-1.5">
                            <span className="text-xs font-medium text-gray-600">
                              Aftësi:
                            </span>
                            {pune.aftesitePrimare?.map((ap, idx) => (
                              <span
                                key={idx}
                                className="text-xs text-[#769FCD] bg-white px-2 py-0.5 rounded border border-gray-200"
                              >
                                {ap}
                              </span>
                            ))}
                            {pune.aftesiteSekondare?.map((as, idx) => (
                              <span
                                key={idx}
                                className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200"
                              >
                                {as}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white group-hover:bg-[#769FCD] transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() =>
                    navigate(`/profili/${perdoruesiData?._id}/menaxhoShpalljet`)
                  }
                  className="w-full px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-[#F5F7F8] hover:border-[#769FCD] font-medium transition-all duration-200"
                >
                  Menaxho Të Gjitha Shpalljet ({puneHapura.length})
                </button>
              </>
            )}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8"></div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-700">
              Rreth Kompanisë
            </h2>
            {!editMode.rrethKompanise ? (
              <button
                onClick={() =>
                  setEditMode({ ...editMode, rrethKompanise: true })
                }
                className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#D6E6F2] transition-all duration-200"
                title="Modifiko përshkrimin"
              >
                <Edit2 size={18} className="text-gray-600" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleRuajRrethKompanise}
                  className="publikoPune w-fit"
                >
                  Ruaj
                </button>
                <button
                  onClick={() =>
                    setEditMode({ ...editMode, rrethKompanise: false })
                  }
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-[#F5F7F8] text-sm transition-all duration-200"
                >
                  Anulo
                </button>
              </div>
            )}
          </div>
          {editMode.rrethKompanise ? (
            <textarea
              value={rrethKompanise}
              onChange={(e) => setRrethKompanise(e.target.value)}
              placeholder="Shkruani rreth kompanisë suaj, misionin, vizionin dhe vlerë që ofroni..."
              className="w-full px-4 py-3 bg-[#F5F7F8] border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent min-h-[150px] resize-none"
            />
          ) : (
            <div className="p-6 bg-[#F5F7F8] rounded-2xl border border-gray-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {perdoruesiData?.rrethKompanise ||
                  "Nuk ka informacione të shtuar akoma. Klikoni butonin e modifikimit për të shtuar një përshkrim të kompanisë suaj."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfiliKompanise;
