import { useState, useEffect, useRef } from "react";
import "../index.css";
import { useParams } from "react-router-dom";
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
  Trash2,
  ArrowRight,
} from "lucide-react";
import Perdoruesi from "../PerdoruesiContext";
import { useAlert } from "../contexts/AlertContext";

function ProfiliAplikantit() {
  const { perdoruesiData, setPerdoruesiData } = Perdoruesi.usePerdoruesi();
  const { id } = useParams();
  const { showAlert, showConfirm } = useAlert();

  const [shfaqLinkeForm, setShfaqLinkeForm] = useState(false);
  const [shfaqFormenEksperienca, setShfaqFormenEksperienca] = useState(false);
  const [shfaqFormenEdukimi, setShfaqFormenEdukimi] = useState(false);
  const [shfaqFormenProjektet, setShfaqFormenProjektet] = useState(false);
  const [shfaqFormenAftesite, setShfaqFormenAftesite] = useState(false);
  const [aftesiRe, setAftesiRe] = useState("");
  const [newData, setNewData] = useState({
    emri: "",
    mbiemri: "",
    profesioni: "",
    nrTelefonit: 0,
  });
  const [shfaqEditData, setShfaqEditData] = useState(false);

  const [fotoProfile, setFotoProfile] = useState(null);
  const [poNgarkohetFoto, setPoNgarkohetFoto] = useState(false);
  const inputFotoRef = useRef(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        );
        setPerdoruesiData(response.data.data);

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

  const modifikoProfilin = async (e) => {
    e.preventDefault();
    try {
      let dataToSend = {
        emri: newData.emri,
        mbiemri: newData.mbiemri,
        nrTelefonit: newData.nrTelefonit,
        profesioni: newData.profesioni,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        dataToSend,
      );

      if (response.data.success) {
        showAlert("U modifikua me sukses!", "success");
        setPerdoruesiData(response.data.data);
        setShfaqEditData(false);
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim në përditësimin e profilit", "error");
    }
  };

  const merreShkronjatFillestare = () => {
    if (perdoruesiData?.emri && perdoruesiData?.mbiemri) {
      return `${perdoruesiData.emri[0]}${perdoruesiData.mbiemri[0]}`.toUpperCase();
    } else if (perdoruesiData?.kompania) {
      return perdoruesiData.kompania.substring(0, 2).toUpperCase();
    }
    return "?";
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
      "Fshij Foton",
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

  const [linkRi, setLinkRi] = useState({
    platforma: "",
    linku: "",
  });

  const handleShtoLink = async () => {
    if (!linkRi.platforma || !linkRi.linku) {
      showAlert("Ju lutem plotësoni të dyja fushat", "warning");
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
      "Fshij Linkun",
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

  const [eksperienceRe, setEksperienceRe] = useState({
    titulli: "",
    kompania: "",
    dataFillimit: "",
    dataMbarimit: "",
    aktuale: false,
    pershkrimi: "",
  });

  const handleShtoEksperiencen = async () => {
    if (!eksperienceRe.titulli || !eksperienceRe.kompania) {
      showAlert(
        "Ju lutem plotësoni të paktën titullin dhe kompaninë",
        "warning",
      );
      return;
    }

    if (eksperienceRe.dataFillimit && eksperienceRe.dataMbarimit) {
      const start = new Date(eksperienceRe.dataFillimit);
      const end = new Date(eksperienceRe.dataMbarimit);
      const today = new Date();

      if (end < start) {
        showAlert(
          "Data e mbarimit nuk mund të jetë më herët se data e fillimit!",
          "warning",
        );
        return;
      }

      if (start > today) {
        showAlert("Data e fillimit nuk mund të jetë në të ardhmen!", "warning");
        return;
      }

      if (end > today) {
        showAlert("Data e mbarimit nuk mund të jetë në të ardhmen!", "warning");
        return;
      }
    }

    try {
      const newExperience = {
        titulli: eksperienceRe.titulli,
        kompania: eksperienceRe.kompania,
        dataFillimit: eksperienceRe.dataFillimit,
        dataMbarimit: eksperienceRe.dataMbarimit || null,
        aktuale: eksperienceRe.aktuale || false,
        pershkrimi: eksperienceRe.pershkrimi || "",
      };

      const updatedExperiences = [
        ...(perdoruesiData?.eksperiencat || []),
        newExperience,
      ];

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        {
          eksperiencat: updatedExperiences,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        setEksperienceRe({
          titulli: "",
          kompania: "",
          dataFillimit: "",
          dataMbarimit: "",
          aktuale: false,
          pershkrimi: "",
        });
        setShfaqFormenEksperienca(false);
        showAlert("Eksperienca u shtua me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim në ruajtjen e eksperiencës", "error");
    }
  };

  const handleFshijEksperiencen = async (index) => {
    showConfirm(
      "Jeni të sigurt që dëshironi ta fshini këtë eksperiencë?",
      "Fshij Eksperiencën",
      async () => {
        try {
          const updatedExperiences = (
            perdoruesiData?.eksperiencat || []
          ).filter((_, i) => i !== index);

          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
            {
              eksperiencat: updatedExperiences,
            },
          );

          if (response.data.success) {
            setPerdoruesiData(response.data.data);
            showAlert("Eksperienca u fshi me sukses!", "success");
          }
        } catch (error) {
          console.error(error);
          showAlert("Gabim në fshirjen e eksperiencës", "error");
        }
      },
    );
  };

  const [edukimiRi, setEdukimiRi] = useState({
    titulli: "",
    institucioni: "",
    dataFillimit: "",
    dataMbarimit: "",
    aktuale: false,
    pershkrimi: "",
  });

  const handleShtoEdukimin = async () => {
    if (!edukimiRi.titulli || !edukimiRi.institucioni) {
      showAlert(
        "Ju lutem plotësoni të paktën titullin dhe institucionin",
        "warning",
      );
      return;
    }

    if (edukimiRi.dataFillimit && edukimiRi.dataMbarimit) {
      const start = new Date(edukimiRi.dataFillimit);
      const end = new Date(edukimiRi.dataMbarimit);
      const today = new Date();

      if (end < start) {
        showAlert(
          "Data e mbarimit nuk mund të jetë më herët se data e fillimit!",
          "warning",
        );
        return;
      }

      if (start > today) {
        showAlert("Data e fillimit nuk mund të jetë në të ardhmen!", "warning");
        return;
      }

      if (end > today) {
        showAlert("Data e mbarimit nuk mund të jetë në të ardhmen!", "warning");
        return;
      }
    }

    try {
      const newEducation = {
        titulli: edukimiRi.titulli,
        institucioni: edukimiRi.institucioni,
        dataFillimit: edukimiRi.dataFillimit,
        dataMbarimit: edukimiRi.dataMbarimit || null,
        aktuale: edukimiRi.aktuale || false,
        pershkrimi: edukimiRi.pershkrimi || "",
      };

      const updatedEducation = [
        ...(perdoruesiData?.edukimi || []),
        newEducation,
      ];

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        {
          edukimi: updatedEducation,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        setEdukimiRi({
          titulli: "",
          institucioni: "",
          dataFillimit: "",
          dataMbarimit: "",
          aktuale: false,
          pershkrimi: "",
        });
        setShfaqFormenEdukimi(false);
        showAlert("Edukimi u shtua me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim në ruajtjen e edukimit", "error");
    }
  };

  const handleFshijEdukimin = async (index) => {
    showConfirm(
      "Jeni të sigurt që dëshironi ta fshini këtë edukim?",
      "Fshij Edukimin",
      async () => {
        try {
          const updatedEducation = (perdoruesiData?.edukimi || []).filter(
            (_, i) => i !== index,
          );

          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
            {
              edukimi: updatedEducation,
            },
          );

          if (response.data.success) {
            setPerdoruesiData(response.data.data);
            showAlert("Edukimi u fshi me sukses!", "success");
          }
        } catch (error) {
          console.error(error);
          showAlert("Gabim në fshirjen e edukimit", "error");
        }
      },
    );
  };

  const [projektRi, setProjektRi] = useState({
    emriProjektit: "",
    pershkrimi: "",
    teknologjite: "",
    linku: "",
  });

  const handleShtoProjekt = async () => {
    if (!projektRi.emriProjektit) {
      showAlert("Ju lutem plotësoni emrin e projektit", "warning");
      return;
    }

    try {
      const newProject = {
        emriProjektit: projektRi.emriProjektit,
        pershkrimi: projektRi.pershkrimi || "",
        teknologjite: projektRi.teknologjite || "",
        linku: projektRi.linku || "",
      };

      const updatedProjects = [
        ...(perdoruesiData?.projektet || []),
        newProject,
      ];

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        {
          projektet: updatedProjects,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        setProjektRi({
          emriProjektit: "",
          pershkrimi: "",
          teknologjite: "",
          linku: "",
        });
        setShfaqFormenProjektet(false);
        showAlert("Projekti u shtua me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim në ruajtjen e projektit", "error");
    }
  };

  const handleFshijProjektin = async (index) => {
    showConfirm(
      "Jeni të sigurt që dëshironi ta fshini këtë projekt?",
      "Fshij Projektin",
      async () => {
        try {
          const updatedProjects = (perdoruesiData?.projektet || []).filter(
            (_, i) => i !== index,
          );

          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
            {
              projektet: updatedProjects,
            },
          );

          if (response.data.success) {
            setPerdoruesiData(response.data.data);
            showAlert("Projekti u fshi me sukses!", "success");
          }
        } catch (error) {
          console.error(error);
          showAlert("Gabim në fshirjen e projektit", "error");
        }
      },
    );
  };

  const handleShtoAftesine = async () => {
    if (!aftesiRe.trim()) {
      showAlert("Ju lutem shkruani emrin e aftësisë", "warning");
      return;
    }

    try {
      const updatedSkills = [
        ...(perdoruesiData?.aftesite || []),
        aftesiRe.trim(),
      ];

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
        {
          aftesite: updatedSkills,
        },
      );

      if (response.data.success) {
        setPerdoruesiData(response.data.data);
        setAftesiRe("");
        setShfaqFormenAftesite(false);
        showAlert("Aftësia u shtua me sukses!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim në ruajtjen e aftësisë", "error");
    }
  };

  const handleFshijAftesine = async (index) => {
    showConfirm(
      "Jeni të sigurt që dëshironi ta fshini këtë aftësi?",
      "Fshij Aftësinë",
      async () => {
        try {
          const updatedSkills = (perdoruesiData?.aftesite || []).filter(
            (_, i) => i !== index,
          );

          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/profili/${id}`,
            {
              aftesite: updatedSkills,
            },
          );

          if (response.data.success) {
            setPerdoruesiData(response.data.data);
            showAlert("Aftësia u fshi me sukses!", "success");
          }
        } catch (error) {
          console.error(error);
          showAlert("Gabim në fshirjen e aftësisë", "error");
        }
      },
    );
  };

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
        </div>

        <div
          className="px-8 pb-8 -mt-16"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#D6E6F2] to-[#B9D7EA] flex items-center justify-center text-[#769FCD] text-4xl font-bold shadow-xl border-4 border-white overflow-hidden">
                {fotoProfile ? (
                  <img
                    src={fotoProfile}
                    alt="Foto Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{merreShkronjatFillestare()}</span>
                )}
              </div>

              <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => inputFotoRef.current?.click()}
                  disabled={poNgarkohetFoto}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#769FCD] hover:bg-[#5a82b3] text-white shadow-md transition-all duration-200 disabled:bg-gray-400"
                  title="Ngarko foto"
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
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md transition-all duration-200"
                    title="Fshij foton"
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
              {shfaqEditData ? (
                <div className="w-full space-y-4 bg-[#F5F7F8] p-6 rounded-2xl border border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={newData.emri}
                      onChange={(e) =>
                        setNewData({ ...newData, emri: e.target.value })
                      }
                      placeholder="Emri"
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#769FCD] focus:border-transparent transition"
                    />
                    <input
                      type="text"
                      value={newData.mbiemri}
                      onChange={(e) =>
                        setNewData({ ...newData, mbiemri: e.target.value })
                      }
                      placeholder="Mbiemri"
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#769FCD] focus:border-transparent transition"
                    />
                  </div>

                  <input
                    type="text"
                    value={newData.profesioni}
                    onChange={(e) =>
                      setNewData({ ...newData, profesioni: e.target.value })
                    }
                    placeholder="Profesioni"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#769FCD] focus:border-transparent transition"
                  />

                  <div className="flex items-center gap-2 text-gray-600 bg-white px-4 py-3 rounded-xl border border-gray-200">
                    <Mail size={18} className="text-gray-500" />
                    <span>{perdoruesiData?.email}</span>
                  </div>

                  <input
                    type="text"
                    value={newData.nrTelefonit}
                    onChange={(e) =>
                      setNewData({ ...newData, nrTelefonit: e.target.value })
                    }
                    placeholder="Numri i Telefonit"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#769FCD] focus:border-transparent transition"
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShfaqEditData(false)}
                      className="flex-1 bg-white border border-gray-200 hover:bg-[#F5F7F8] text-gray-700 font-medium py-3 px-6 rounded-xl transition duration-200"
                    >
                      Anulo
                    </button>
                    <button
                      type="button"
                      onClick={modifikoProfilin}
                      className="flex-1 publikoPune"
                    >
                      Ruaj Ndryshimet
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-4 mt-3">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {perdoruesiData?.emri || perdoruesiData?.kompania}{" "}
                        {perdoruesiData?.mbiemri}
                      </h1>
                      {perdoruesiData?.profesioni ? (
                        <p className="text-[#769FCD] text-lg font-medium mt-1">
                          {perdoruesiData.profesioni}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-lg font-medium mt-1">
                          Profesioni
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setShfaqEditData(!shfaqEditData);
                        setNewData({
                          emri: perdoruesiData?.emri || "",
                          mbiemri: perdoruesiData?.mbiemri || "",
                          nrTelefonit:
                            perdoruesiData?.nrTelefonit?.toString() || "",
                          profesioni: perdoruesiData?.profesioni || "",
                        });
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
                      <span>{perdoruesiData?.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-[#F5F7F8] flex items-center justify-center">
                        <Phone size={16} className="text-gray-700" />
                      </div>
                      <span>{perdoruesiData?.nrTelefonit}</span>
                    </div>
                  </div>

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
                            placeholder="Platforma (p.sh. LinkedIn, GitHub)"
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
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setShfaqLinkeForm(false)}
                              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-[#F5F7F8] text-sm transition-all duration-200"
                            >
                              Anulo
                            </button>
                            <button
                              onClick={handleShtoLink}
                              className="publikoPune w-fit"
                            >
                              Ruaj
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
            <h2 className="text-2xl font-bold text-gray-700">
              Pervojat Profesionale
            </h2>
            <button
              onClick={() => setShfaqFormenEksperienca(!shfaqFormenEksperienca)}
              className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#D6E6F2] transition-all duration-200"
              title="Shto eksperiencë"
            >
              <Plus size={20} className="text-gray-600" />
            </button>
          </div>

          {shfaqFormenEksperienca && (
            <div className="p-6 bg-[#F5F7F8] mb-6 rounded-2xl border border-gray-100">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Titulli i pozicionit"
                  value={eksperienceRe.titulli}
                  onChange={(e) =>
                    setEksperienceRe({
                      ...eksperienceRe,
                      titulli: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Kompania"
                  value={eksperienceRe.kompania}
                  onChange={(e) =>
                    setEksperienceRe({
                      ...eksperienceRe,
                      kompania: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="date"
                    placeholder="Data fillimit"
                    value={eksperienceRe.dataFillimit}
                    onChange={(e) =>
                      setEksperienceRe({
                        ...eksperienceRe,
                        dataFillimit: e.target.value,
                      })
                    }
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                  />
                  <input
                    type="date"
                    placeholder="Data mbarimit"
                    value={eksperienceRe.dataMbarimit}
                    onChange={(e) =>
                      setEksperienceRe({
                        ...eksperienceRe,
                        dataMbarimit: e.target.value,
                      })
                    }
                    max={new Date().toISOString().split("T")[0]}
                    min={eksperienceRe.dataFillimit || ""}
                    disabled={eksperienceRe.aktuale}
                    className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent ${
                      eksperienceRe.aktuale
                        ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="aktuale"
                    checked={eksperienceRe.aktuale}
                    onChange={(e) =>
                      setEksperienceRe({
                        ...eksperienceRe,
                        aktuale: e.target.checked,
                        dataMbarimit: e.target.checked
                          ? ""
                          : eksperienceRe.dataMbarimit,
                      })
                    }
                    className="w-4 h-4 text-[#769FCD] rounded focus:ring-[#769FCD]"
                  />
                  <label htmlFor="aktuale" className="text-sm text-gray-700">
                    Aktualisht punoj këtu
                  </label>
                </div>
                <textarea
                  placeholder="Përshkrimi"
                  value={eksperienceRe.pershkrimi}
                  onChange={(e) =>
                    setEksperienceRe({
                      ...eksperienceRe,
                      pershkrimi: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                  rows="3"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShfaqFormenEksperienca(false)}
                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-[#F5F7F8] transition-all duration-200"
                  >
                    Anulo
                  </button>
                  <button
                    onClick={handleShtoEksperiencen}
                    className="publikoPune w-fit"
                  >
                    Ruaj
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {!perdoruesiData?.eksperiencat ||
            perdoruesiData.eksperiencat.length === 0 ? (
              <div className="text-center py-12 bg-[#F5F7F8] rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">Nuk ka përvoja të shtuara ende</p>
              </div>
            ) : (
              perdoruesiData.eksperiencat.map((exp, index) => (
                <div
                  key={index}
                  className="relative p-5 bg-[#F5F7F8] rounded-2xl border-l-4 border-[#769FCD] hover:shadow-md transition-all duration-200 group"
                >
                  <button
                    onClick={() => handleFshijEksperiencen(index)}
                    className="absolute top-4 right-4 p-1.5 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {exp.titulli}
                  </h3>
                  <p className="text-[#769FCD] font-medium mb-2">
                    {exp.kompania}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDateDDMMYYYY(exp.dataFillimit)} -{" "}
                    {exp.aktuale
                      ? "Aktuale"
                      : formatDateDDMMYYYY(exp.dataMbarimit)}
                  </p>
                  {exp.pershkrimi && (
                    <p className="text-gray-600 leading-relaxed">
                      {exp.pershkrimi}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8"></div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Edukimi</h2>
            <button
              onClick={() => setShfaqFormenEdukimi(!shfaqFormenEdukimi)}
              className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#D6E6F2] transition-all duration-200"
              title="Shto edukim"
            >
              <Plus size={20} className="text-gray-600" />
            </button>
          </div>

          {shfaqFormenEdukimi && (
            <div className="p-6 bg-[#F5F7F8] mb-6 rounded-2xl border border-gray-100">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Titulli (Diplomë, Shkollim)"
                  value={edukimiRi.titulli}
                  onChange={(e) =>
                    setEdukimiRi({
                      ...edukimiRi,
                      titulli: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Institucioni"
                  value={edukimiRi.institucioni}
                  onChange={(e) =>
                    setEdukimiRi({
                      ...edukimiRi,
                      institucioni: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="date"
                    placeholder="Data fillimit"
                    value={edukimiRi.dataFillimit}
                    onChange={(e) =>
                      setEdukimiRi({
                        ...edukimiRi,
                        dataFillimit: e.target.value,
                      })
                    }
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                  />
                  <input
                    type="date"
                    placeholder="Data mbarimit"
                    value={edukimiRi.dataMbarimit}
                    onChange={(e) =>
                      setEdukimiRi({
                        ...edukimiRi,
                        dataMbarimit: e.target.value,
                      })
                    }
                    max={new Date().toISOString().split("T")[0]}
                    min={edukimiRi.dataFillimit || ""}
                    disabled={edukimiRi.aktuale}
                    className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent ${
                      edukimiRi.aktuale
                        ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="aktuale-edu"
                    checked={edukimiRi.aktuale}
                    onChange={(e) =>
                      setEdukimiRi({
                        ...edukimiRi,
                        aktuale: e.target.checked,
                        dataMbarimit: e.target.checked
                          ? ""
                          : edukimiRi.dataMbarimit,
                      })
                    }
                    className="w-4 h-4 text-[#769FCD] rounded focus:ring-[#769FCD]"
                  />
                  <label
                    htmlFor="aktuale-edu"
                    className="text-sm text-gray-700"
                  >
                    Aktualisht studioj këtu
                  </label>
                </div>
                <textarea
                  placeholder="Përshkrimi"
                  value={edukimiRi.pershkrimi}
                  onChange={(e) =>
                    setEdukimiRi({
                      ...edukimiRi,
                      pershkrimi: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                  rows="3"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShfaqFormenEdukimi(false)}
                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-[#F5F7F8] transition-all duration-200"
                  >
                    Anulo
                  </button>
                  <button
                    onClick={handleShtoEdukimin}
                    className="publikoPune w-fit"
                  >
                    Ruaj
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {!perdoruesiData?.edukimi || perdoruesiData.edukimi.length === 0 ? (
              <div className="text-center py-12 bg-[#F5F7F8] rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">Nuk ka arsimim të shtuar ende</p>
              </div>
            ) : (
              perdoruesiData.edukimi.map((edu, index) => (
                <div
                  key={index}
                  className="relative p-5 bg-[#F5F7F8] rounded-2xl border-l-4 border-[#B9D7EA] hover:shadow-md transition-all duration-200 group"
                >
                  <button
                    onClick={() => handleFshijEdukimin(index)}
                    className="absolute top-4 right-4 p-1.5 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {edu.titulli}
                  </h3>
                  <p className="text-[#769FCD] font-medium mb-2">
                    {edu.institucioni}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDateDDMMYYYY(edu.dataFillimit)} -{" "}
                    {edu.aktuale
                      ? "Aktuale"
                      : formatDateDDMMYYYY(edu.dataMbarimit)}
                  </p>
                  {edu.pershkrimi && (
                    <p className="text-gray-600 leading-relaxed">
                      {edu.pershkrimi}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8"></div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Aftësitë</h2>
            <button
              onClick={() => setShfaqFormenAftesite(!shfaqFormenAftesite)}
              className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#D6E6F2] transition-all duration-200"
              title="Shto aftësi"
            >
              <Plus size={20} className="text-gray-600" />
            </button>
          </div>

          {shfaqFormenAftesite && (
            <div className="p-4 bg-[#F5F7F8] rounded-2xl border border-gray-100 mb-6">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Emri i aftësisë (p.sh. React, Projekt Menaxhim)"
                  value={aftesiRe}
                  onChange={(e) => setAftesiRe(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShfaqFormenAftesite(false);
                      setAftesiRe("");
                    }}
                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-[#F5F7F8] transition-all duration-200"
                  >
                    Anulo
                  </button>
                  <button
                    onClick={handleShtoAftesine}
                    className="publikoPune w-fit"
                  >
                    Ruaj
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {perdoruesiData?.aftesite?.map((aftesi, index) => (
              <div key={index} className="group relative">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D6E6F2] to-[#B9D7EA] text-gray-600 rounded-xl text-sm font-medium">
                  {aftesi}
                </span>
                <button
                  onClick={() => handleFshijAftesine(index)}
                  className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {(!perdoruesiData?.aftesite ||
              perdoruesiData.aftesite.length === 0) && (
              <div className="w-full text-center py-12 bg-[#F5F7F8] rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">Nuk ka aftësi të shtuara ende</p>
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8"></div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Projektet</h2>
            <button
              onClick={() => setShfaqFormenProjektet(!shfaqFormenProjektet)}
              className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#D6E6F2] transition-all duration-200"
              title="Shto projekt"
            >
              <Plus size={20} className="text-gray-600" />
            </button>
          </div>

          {shfaqFormenProjektet && (
            <div className="p-6 bg-[#F5F7F8] mb-6 rounded-2xl border border-gray-100">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Emri i projektit"
                  value={projektRi.emriProjektit}
                  onChange={(e) =>
                    setProjektRi({
                      ...projektRi,
                      emriProjektit: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                />
                <textarea
                  placeholder="Përshkrimi"
                  value={projektRi.pershkrimi}
                  onChange={(e) =>
                    setProjektRi({
                      ...projektRi,
                      pershkrimi: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                  rows="3"
                />
                <input
                  type="text"
                  placeholder="Teknologjitë (p.sh. React, Node.js, MongoDB)"
                  value={projektRi.teknologjite}
                  onChange={(e) =>
                    setProjektRi({
                      ...projektRi,
                      teknologjite: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Link (opsionale)"
                  value={projektRi.linku}
                  onChange={(e) =>
                    setProjektRi({ ...projektRi, linku: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#769FCD] focus:border-transparent"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShfaqFormenProjektet(false)}
                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-[#F5F7F8] transition-all duration-200"
                  >
                    Anulo
                  </button>
                  <button
                    onClick={handleShtoProjekt}
                    className="publikoPune w-fit"
                  >
                    Ruaj
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {!perdoruesiData?.projektet ||
            perdoruesiData.projektet.length === 0 ? (
              <div className="text-center py-12 bg-[#F5F7F8] rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">Nuk ka projekte të shtuara ende</p>
              </div>
            ) : (
              perdoruesiData.projektet.map((proj, index) => (
                <div
                  key={index}
                  className="relative p-5 bg-[#F5F7F8] rounded-2xl border-l-4 border-gray-300 hover:shadow-md transition-all duration-200 group"
                >
                  <button
                    onClick={() => handleFshijProjektin(index)}
                    className="absolute top-4 right-4 p-1.5 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {proj.emriProjektit}
                  </h3>
                  {proj.pershkrimi && (
                    <p className="text-gray-600 leading-relaxed mb-3">
                      {proj.pershkrimi}
                    </p>
                  )}
                  {proj.teknologjite && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {proj.teknologjite.split(",").map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-white text-[#769FCD] rounded-lg text-xs font-medium border border-gray-200"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  {proj.linku && (
                    <a
                      href={proj.linku}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#769FCD] hover:text-[#5a82b3] text-sm font-medium"
                    >
                      Shiko projektin
                      <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfiliAplikantit;
