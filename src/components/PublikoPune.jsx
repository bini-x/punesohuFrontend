import axios from "axios";
import "../index.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import { useAlert } from "../contexts/AlertContext";
import Perdoruesi from "../PerdoruesiContext";

function PublikoPune() {
  const { showAlert } = useAlert();
  const [aftesitePrimare, setAftesitePrimare] = useState([]);
  const [aftesiaPrimareTanishme, setAftesiaPrimareTanishme] = useState("");
  const [aftesiteSekondare, setAftesiteSekondare] = useState([]);
  const [aftesiaSekondareTanishme, setAftesiaSekondareTanishme] = useState("");
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();

  const [formData, setFormData] = useState({
    emailKompanise: "",
    emriKompanise: perdoruesiData?.kompania || "",
    pozitaPunes: "",
    kategoriaPunes: "",
    lokacioniPunes: "",
    pershkrimiPunes: "",
    niveliPunes: "",
    orari: [],
    eksperienca: "",
    pagaPrej: 0,
    pagaDeri: 0,
    aftesitePrimare: [],
    aftesiteSekondare: [],
    perdoruesiId: "",
  });

  const employmentTypes = [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
  ];

  const shtoAftesinePrimare = () => {
    if (aftesiaPrimareTanishme.trim()) {
      setAftesitePrimare([...aftesitePrimare, aftesiaPrimareTanishme]);
      setAftesiaPrimareTanishme("");
      showAlert("Aftësia u shtua me sukses", "success");
    } else {
      showAlert("Ju lutem shkruani një aftësi", "warning");
    }
  };

  const fshijAftesinePrimare = (index) => {
    const aftesitePrimareReja = aftesitePrimare.filter((_, i) => i !== index);
    setAftesitePrimare(aftesitePrimareReja);
    showAlert("Aftësia u fshi", "info");
  };

  const shtoAftesineSekondare = () => {
    if (aftesiaSekondareTanishme.trim()) {
      setAftesiteSekondare([...aftesiteSekondare, aftesiaSekondareTanishme]);
      setAftesiaSekondareTanishme("");
      showAlert("Aftësia u shtua me sukses", "success");
    } else {
      showAlert("Ju lutem shkruani një aftësi", "warning");
    }
  };

  const fshijAftesineSekondare = (index) => {
    const aftesiteSekondareReja = aftesiteSekondare.filter(
      (_, i) => i !== index,
    );
    setAftesiteSekondare(aftesiteSekondareReja);
    showAlert("Aftësia u fshi", "info");
  };

  const handleEmploymentTypeChange = (typeValue) => {
    setFormData((prevState) => {
      if (prevState.orari && prevState.orari.includes(typeValue)) {
        return {
          ...prevState,
          orari: [],
        };
      }

      return {
        ...prevState,
        orari: [typeValue],
      };
    });
  };

  useEffect(() => {
    const fetchPerdoruesiData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/kycja/perdoruesi`,
        );

        if (response.data.success) {
          setFormData({
            ...formData,
            emailKompanise: response.data.perdoruesiObj.email,
            perdoruesiId: response.data.perdoruesiObj._id,
          });
        }
      } catch (error) {
        console.error(error);
        showAlert(
          "Gabim gjatë ngarkimit të të dhënave të përdoruesit",
          "error",
        );
      }
    };

    fetchPerdoruesiData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pozitaPunes.trim()) {
      showAlert("Ju lutem shkruani titullin e punës", "warning");
      return;
    }

    if (!formData.kategoriaPunes) {
      showAlert("Ju lutem zgjidhni kategorinë e punës", "warning");
      return;
    }

    if (!formData.orari || formData.orari.length === 0) {
      showAlert("Ju lutem zgjidhni llojin e punës", "warning");
      return;
    }

    if (!formData.lokacioniPunes) {
      showAlert("Ju lutem zgjidhni lokacionin", "warning");
      return;
    }

    if (!formData.pershkrimiPunes.trim()) {
      showAlert("Ju lutem shkruani përshkrimin e punës", "warning");
      return;
    }

    if (formData.pagaDeri > 0 && formData.pagaPrej > 0) {
      if (formData.pagaDeri < formData.pagaPrej) {
        showAlert(
          "Rangu i pagës është gabim! Vlera 'Deri' duhet të jetë më e madhe se 'Prej'",
          "warning",
        );
        return;
      }
    }

    let dataToSend = {
      emailKompanise: formData.emailKompanise,
      emriKompanise: formData.emriKompanise,
      pozitaPunes: formData.pozitaPunes,
      kategoriaPunes: formData.kategoriaPunes,
      lokacioniPunes: formData.lokacioniPunes,
      pershkrimiPunes: formData.pershkrimiPunes,
      pyetjet: [],
      niveliPunes: formData.niveliPunes,
      orari: formData.orari,
      eksperienca: formData.eksperienca,
      pagaPrej: formData.pagaPrej,
      pagaDeri: formData.pagaDeri,
      aftesitePrimare: aftesitePrimare,
      aftesiteSekondare: aftesiteSekondare,
      perdoruesiId: formData.perdoruesiId,
    };

    if (dataToSend.pagaDeri < dataToSend.pagaPrej) {
      showAlert("Rangu i pages eshte gabim!", "info");
      return;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shpallja/kompania`,
      dataToSend,
    );

    if (response.data.success) {
      showAlert("Puna u shpall", "success");

      setFormData({
        emailKompanise: "",
        emriKompanise: "",
        pozitaPunes: "",
        kategoriaPunes: "",
        lokacioniPunes: "",
        pershkrimiPunes: "",
        niveliPunes: "",
        orari: [],
        eksperienca: "",
        aftesitePrimare: [],
        aftesiteSekondare: [],
        pagaPrej: 0,
        pagaDeri: 0,
        perdoruesiId: "",
      });
      setAftesitePrimare([]);
      setAftesiteSekondare([]);
      setAftesiaPrimareTanishme("");
      setAftesiaSekondareTanishme("");
    }
  };

  if (perdoruesiData?.tipiPerdoruesit !== "punedhenes") {
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
              Vetëm punëdhënësit mund të publikojnë punë. Nëse jeni punëdhënës,
              ju lutemi kycuni/regjistrohuni si i tillë.
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
    <div className="min-h-screen">
      <div className="bg-linear-to-br from-[#F7FBFC] via-[#D6E6F2] to-[#B9D7EA] pb-32 relative ">
        <Header />

        <div className="text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4">Publiko Punë të Re</h1>
          <p className="text-lg text-gray-600 font-extralight max-w-2xl mx-auto px-4">
            Plotësoni formularin për të publikuar shpalljen tuaj
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-20 pb-20 relative z-20">
        <div className="bg-white rounded-2xl  shadow-2xl p-8 md:p-12">
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
            auto-complete="off"
          >
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Informacioni i Punës
              </h2>

              <div className="mb-6">
                <label
                  htmlFor="pozitaPunes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Titulli i Punës<span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  type="text"
                  id="pozitaPunes"
                  placeholder="Sheno titullin e punës"
                  value={formData.pozitaPunes}
                  onChange={(e) =>
                    setFormData({ ...formData, pozitaPunes: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="kategoriaPunes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Kategoria e Punës<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="kategoriaPunes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.kategoriaPunes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kategoriaPunes: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="" hidden disabled>
                      Zgjedh kategorinë
                    </option>
                    <option value="Industria">Industria</option>
                    <option value="Administrate">Administratë</option>
                    <option value="Agrikulture-Industri-Ushqimore">
                      Agrikulturë dhe Industri Ushqimore
                    </option>
                    <option value="Arkitekture">Arkitekturë</option>
                    <option value="Banka">Banka</option>
                    <option value="Retail-Distribuim">
                      Retail dhe Distribuim
                    </option>
                    <option value="Ndertimtari-Patundshmeri">
                      Ndërtimtari & Patundshmëri
                    </option>
                    <option value="Mbeshtetje-Konsumatoreve-Call-Center">
                      Mbështetje e Konsumatorëve, Call Center
                    </option>
                    <option value="Ekonomi-Finance-Kontabilitet">
                      Ekonomi, Financë, Kontabilitet
                    </option>
                    <option value="Edukim-Shkence-Hulumtim">
                      Edukim, Shkencë & Hulumtim
                    </option>
                    <option value="Pune-Te-Pergjithshme">
                      Punë të Përgjithshme
                    </option>
                    <option value="Burime-Njerezore">Burime Njerëzore</option>
                    <option value="Teknologji-Informacioni">
                      Teknologji e Informacionit
                    </option>
                    <option value="Sigurim">Sigurim</option>
                    <option value="Gazetari-Shtyp-Media">
                      Gazetari, Shtyp & Media
                    </option>
                    <option value="Ligj-Legjislacion">
                      Ligj & Legjislacion
                    </option>
                    <option value="Menaxhment">Menaxhment</option>
                    <option value="Marketing-Reklamim-Pr">
                      Marketing, Reklamim & PR
                    </option>
                    <option value="Inxhinieri">Inxhinieri</option>
                    <option value="Shendetesi-Medicine">
                      Shëndetësi, Medicinë
                    </option>
                    <option value="Prodhim">Prodhim</option>
                    <option value="Siguri$Mbrojtje">Siguri&Mbrojtje</option>
                    <option value="Industri te sherbimit">
                      Industri te sherbimit
                    </option>
                    <option value="Telekomunikim">Telekomunikim</option>
                    <option value="Tekstil, Lekure, Industri Veshembathje">
                      Tekstil, Lekure, Industri Veshembathje
                    </option>
                    <option value="Gastronomi, Hoteleri, Turizem">
                      Gastronomi, Hoteleri, Turizem
                    </option>
                    <option value="Transport, Logjistike">
                      Transport, Logjistike
                    </option>
                    <option value="IT">IT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lloji i Punës<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    {employmentTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleEmploymentTypeChange(type.value)}
                        className={`
                          flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium
                          transition-all duration-200
                          ${
                            (formData.orari || []).includes(type.value)
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                          }
                        `}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="lokacioniPunes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Lokacioni<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="lokacioniPunes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.lokacioniPunes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lokacioniPunes: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="" hidden disabled>
                      Zgjedh lokacionin
                    </option>
                    <option value="Prishtine">Prishtinë</option>
                    <option value="Prizren">Prizren</option>
                    <option value="Peje">Pejë</option>
                    <option value="Gjakove">Gjakovë</option>
                    <option value="Mitrovice">Mitrovicë</option>
                    <option value="Ferizaj">Ferizaj</option>
                    <option value="Gjilan">Gjilan</option>
                    <option value="Vushtrri">Vushtrri</option>
                    <option value="Podujeve">Podujevë</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="paga"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Paga
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        €
                      </span>
                      <input
                        type="number"
                        value={formData.pagaPrej || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pagaPrej: Number(e.target.value),
                          })
                        }
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Prej"
                        min="0"
                      />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        €
                      </span>
                      <input
                        type="number"
                        value={formData.pagaDeri || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pagaDeri: Number(e.target.value),
                          })
                        }
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Deri"
                        min="0"
                      />
                    </div>
                  </div>
                  {formData.pagaDeri > 0 &&
                    formData.pagaPrej > 0 &&
                    formData.pagaDeri < formData.pagaPrej && (
                      <p className="mt-2 text-sm text-red-500">
                        Vlera "Deri" duhet të jetë më e madhe se "Prej"
                      </p>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="niveliPunes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Niveli i Punës
                  </label>
                  <select
                    id="niveliPunes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.niveliPunes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        niveliPunes: e.target.value,
                      })
                    }
                  >
                    <option value="">Zgjedh nivelin</option>
                    <option value="Praktike">Praktikë</option>
                    <option value="Fillestar">Fillestar</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lider">Lider</option>
                    <option value="Menaxher">Menaxher</option>
                    <option value="Drejtor">Drejtor</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="eksperienca"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Eksperienca
                  </label>
                  <select
                    id="eksperienca"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.eksperienca}
                    onChange={(e) =>
                      setFormData({ ...formData, eksperienca: e.target.value })
                    }
                  >
                    <option value="">Zgjedh eksperiencën</option>
                    <option value="0-6 muaj">0-6 muaj</option>
                    <option value="1 vjet">1 vjet</option>
                    <option value="1-2 vite">1-2 vite</option>
                    <option value="2-3 vite">2-3 vite</option>
                    <option value="3-6 vite">3-6 vite</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="pershkrimiPunes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Përshkrimi i Punës<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="pershkrimiPunes"
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Shkruaj përshkrimin e punës këtu..."
                  value={formData.pershkrimiPunes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pershkrimiPunes: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aftësitë Primare{" "}
                </label>

                {aftesitePrimare.length > 0 && (
                  <div className="mb-4 border border-gray-200 rounded-lg divide-y divide-gray-200">
                    {aftesitePrimare.map((aftesi, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-700">{aftesi}</span>
                        <button
                          type="button"
                          onClick={() => fshijAftesinePrimare(i)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Shto aftësi (p.sh. Aftësi komunikuese të shkëlqyera)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={aftesiaPrimareTanishme}
                    onChange={(e) => setAftesiaPrimareTanishme(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        shtoAftesinePrimare();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={shtoAftesinePrimare}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                    Shto
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-5">
                  Aftësitë Sekondare
                </label>

                {aftesiteSekondare.length > 0 && (
                  <div className="mb-4 border border-gray-200 rounded-lg divide-y divide-gray-200">
                    {aftesiteSekondare.map((aftesi, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-700">{aftesi}</span>
                        <button
                          type="button"
                          onClick={() => fshijAftesineSekondare(i)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Shto aftësi (p.sh. Aftësi komunikuese të shkëlqyera)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={aftesiaSekondareTanishme}
                    onChange={(e) =>
                      setAftesiaSekondareTanishme(e.target.value)
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        shtoAftesineSekondare();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={shtoAftesineSekondare}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                    Shto
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button type="submit" className="publikoPune ">
                Publiko Punën
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PublikoPune;
