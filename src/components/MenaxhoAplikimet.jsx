import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowDownWideNarrow,
  Calendar,
  MapPin,
  Building,
  X,
} from "lucide-react";
import Header from "./Header";
import {
  faSearch,
  faEllipsisVertical,
  faPencil,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Perdoruesi from "../PerdoruesiContext";
import { useAlert } from "../contexts/AlertContext";

function MenaxhoAplikimet() {
  const { showAlert } = useAlert();
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();
  const [shpalljaData, setShpalljaData] = useState([]);
  const [aplikimet, setAplikimet] = useState([]);
  const navigate = useNavigate();
  const [aplikimiKlikuar, setAplikimiKlikuar] = useState(null);
  const [filtrimiFaqes, setFiltrimiFaqes] = useState("Aktive");
  const [kerko, setKerko] = useState("");
  const [shfaqMeny, setShfaqMeny] = useState(null);
  const [menyRadhitjes, setMenyRadhitjes] = useState(false);
  const [sortimiDates, setSortimiDates] = useState("teRejat");
  const [cvFile, setCvFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!perdoruesiData || !perdoruesiData._id) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/shpallja/aplikimet`,
        );
        if (Array.isArray(response.data.data)) {
          const aplikimetFiltruara = response.data.data.filter((aplikimi) => {
            return aplikimi.aplikantiId === perdoruesiData._id;
          });
          setAplikimet(aplikimetFiltruara);
        }
      } catch (error) {
        console.error(error);
        showAlert("Gabim gjatë ngarkimit të aplikimeve", "error");
      }
    };

    fetchData();
  }, [perdoruesiData]);

  useEffect(() => {
    const fetchData = async () => {
      const shpalljet = [];

      for (const aplikimi of aplikimet) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shpallja/${aplikimi.shpalljaId}`,
          );

          shpalljet.push(response.data.data);
        } catch (error) {
          console.error(error);
        }
      }

      setShpalljaData(shpalljet);
    };

    if (aplikimet.length > 0) {
      fetchData();
    }
  }, [aplikimet]);

  const modifikoAplikimin = (e) => {
    const { id, value } = e.target;
    setAplikimiKlikuar({
      ...aplikimiKlikuar,
      [id]: value,
    });
  };

  const getExpirationDate = (creationDate) => {
    const date = new Date(creationDate);
    date.setDate(date.getDate() + 30);
    return date;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      showAlert("Ju lutem ngarkoni vetëm skedarë PDF ose Word", "warning");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert(
        "Madhësia e skedarit është shumë e madhe. Maksimumi 5MB",
        "warning",
      );
      return;
    }

    setCvFile(file);
    showAlert("Skedari u zgjodh me sukses", "success");
  };

  const ruajNdryshimet = async (e) => {
    e.preventDefault();

    if (!aplikimiKlikuar.emriAplikantit?.trim()) {
      showAlert("Ju lutem shkruani emrin", "warning");
      return;
    }

    if (!aplikimiKlikuar.mbiemriAplikantit?.trim()) {
      showAlert("Ju lutem shkruani mbiemrin", "warning");
      return;
    }

    if (!aplikimiKlikuar.emailAplikantit?.trim()) {
      showAlert("Ju lutem shkruani email-in", "warning");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("emriAplikantit", aplikimiKlikuar.emriAplikantit);
      formData.append(
        "mbiemriAplikantit",
        aplikimiKlikuar.mbiemriAplikantit || "",
      );
      formData.append("emailAplikantit", aplikimiKlikuar.emailAplikantit || "");
      formData.append("nrTelefonit", aplikimiKlikuar.nrTelefonit || "");
      formData.append("eksperienca", aplikimiKlikuar.eksperienca || "");
      formData.append("letraMotivuese", aplikimiKlikuar.letraMotivuese || "");
      if (cvFile) {
        formData.append("cvFile", cvFile);
      }
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shpallja/aplikimi/${aplikimiKlikuar._id}`,
        formData,
      );
      if (response.data.success) {
        setAplikimet(
          aplikimet.map((a) =>
            a._id === aplikimiKlikuar._id ? response.data.data : a,
          ),
        );
        showAlert("Ndryshimet u ruajten me sukses!", "success");
        setAplikimiKlikuar(null);
        setCvFile(null);
      }
    } catch (error) {
      console.error(error);
      showAlert("Gabim gjatë ruajtjes së ndryshimeve", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const sortimDates = (data) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.dataKrijimit);
      const dateB = new Date(b.dataKrijimit);

      if (sortimiDates === "teRejat") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  };

  const filteredData = sortimDates(
    aplikimet.filter((aplikimi) => {
      const shpallja = shpalljaData.find(
        (sh) => sh._id === aplikimi.shpalljaId,
      );

      const jobStatus = shpallja?.status?.toLowerCase();
      const matchesStatus =
        (filtrimiFaqes === "Aktive" && jobStatus === "aktiv") ||
        (filtrimiFaqes === "Te Skaduara" && jobStatus === "skaduar");

      if (!matchesStatus) return false;

      const matchesSearch =
        shpallja?.pozitaPunes?.toLowerCase().includes(kerko?.toLowerCase()) ||
        shpallja?.kategoriaPunes
          ?.toLowerCase()
          .includes(kerko?.toLowerCase()) ||
        shpallja?.lokacioniPunes
          ?.toLowerCase()
          .includes(kerko?.toLowerCase()) ||
        aplikimi?.emriAplikantit
          ?.toLowerCase()
          .includes(kerko?.toLowerCase()) ||
        aplikimi?.emailAplikantit?.toLowerCase().includes(kerko?.toLowerCase());

      return matchesSearch;
    }),
  );

  if (perdoruesiData?.tipiPerdoruesit !== "aplikant") {
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
              Vetëm aplikantët mund të menaxhojnë aplikimet. Nëse jeni aplikant,
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
    <div className="bg-white min-h-screen">
      <Header withGradient={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Menaxho Aplikimet
          </h1>
          <p className="paragraf mt-1">
            Menaxho dhe modifiko aplikimet e tua për pozita pune
          </p>
        </div>

        <div className="tabela">
          <div className="flex space-x-8 overflow-x-auto pb-2 lg:pb-4">
            {["Aktive", "Te Skaduara"].map((faqja) => (
              <button
                key={faqja}
                onClick={() => setFiltrimiFaqes(faqja)}
                className={`whitespace-nowrap text-sm font-medium transition-colors relative ${
                  filtrimiFaqes === faqja
                    ? "text-gray-900 border-b-2 border-indigo-600 pb-4"
                    : "text-gray-500 hover:text-gray-700 pb-4"
                }`}
              >
                {faqja}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
              />
              <input
                type="text"
                placeholder="Kërko aplikime..."
                value={kerko}
                onChange={(e) => setKerko(e.target.value)}
                className="input-kerkimi"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setMenyRadhitjes(!menyRadhitjes)}
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 w-full sm:w-auto"
              >
                <ArrowDownWideNarrow size={18} />
                <span>Radhit</span>
              </button>

              {menyRadhitjes && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Radhit sipas Dates
                    </p>
                    <button
                      onClick={() => {
                        setSortimiDates("teRejat");
                        setMenyRadhitjes(false);
                      }}
                      className="butonSortimi"
                    >
                      <span>Më e re</span>
                      {sortimiDates === "teRejat" && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-indigo-600 text-xs"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSortimiDates("teVjetrat");
                        setMenyRadhitjes(false);
                      }}
                      className="butonSortimi"
                    >
                      <span>Më e vjetër</span>
                      {sortimiDates === "teVjetrat" && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-indigo-600 text-xs"
                        />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-visible">
          <div className="hidden lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="tableHead">Pozita</th>
                  <th className="tableHead">Data e Aplikimit</th>
                  <th className="tableHead">Data e Skadimit Te Shpalljes</th>
                  <th className="tableHead">Lokacioni</th>
                  <th className="tableHead text-center">Orari</th>
                  <th className="tableHead">Statusi</th>
                  {filtrimiFaqes === "Aktive" && (
                    <th className="tableHead text-right">Veprime</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((aplikimi) => {
                  const shpallja = shpalljaData.find(
                    (sh) => sh._id === aplikimi.shpalljaId,
                  );
                  const expirationDate = shpallja?.dataKrijimit
                    ? getExpirationDate(shpallja.dataKrijimit)
                    : null;
                  const isExpired =
                    shpallja?.status?.toLowerCase() === "skaduar";

                  return (
                    <tr key={aplikimi._id} className="hover:bg-gray-50">
                      <td
                        className="px-6 py-4 cursor-pointer"
                        onClick={() =>
                          navigate(`/shpallja/${aplikimi.shpalljaId}`)
                        }
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {shpallja?.pozitaPunes || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shpallja?.kategoriaPunes || "N/A"}
                        </div>
                      </td>
                      <td className="tableData text-gray-500">
                        {new Date(aplikimi.dataKrijimit).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="tableData">
                        {expirationDate ? (
                          <span
                            className={
                              isExpired
                                ? "text-red-600 font-medium"
                                : "text-gray-500"
                            }
                          >
                            {formatDate(expirationDate)}
                            {isExpired && (
                              <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                Skaduar
                              </span>
                            )}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="tableData">
                        {shpallja?.lokacioniPunes || "N/A"}
                      </td>
                      <td className="tableData">
                        <span className="py-1 w-full items-center justify-center inline-flex text-sm font-medium">
                          {shpallja?.orari || "N/A"}
                        </span>
                      </td>
                      <td className="tableData">
                        {aplikimi.status === "Pranuar" ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            {aplikimi.status}
                          </span>
                        ) : aplikimi.status === "Ne_Pritje" ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Ne Pritje
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            {aplikimi.status}
                          </span>
                        )}
                      </td>
                      {filtrimiFaqes === "Aktive" && (
                        <td className="tableData text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setShfaqMeny(
                                  shfaqMeny === aplikimi._id
                                    ? null
                                    : aplikimi._id,
                                )
                              }
                              className="text-gray-400 hover:text-gray-600 p-2"
                            >
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>

                            {shfaqMeny === aplikimi._id && (
                              <div className="absolute right-6 top-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button
                                  onClick={() => {
                                    setAplikimiKlikuar(aplikimi);
                                    setShfaqMeny(null);
                                  }}
                                  className="butonModifikimi"
                                >
                                  <FontAwesomeIcon
                                    icon={faPencil}
                                    className="text-sm"
                                  />
                                  <span>Modifiko</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-gray-200">
            {filteredData.map((aplikimi) => {
              const shpallja = shpalljaData.find(
                (sh) => sh._id === aplikimi.shpalljaId,
              );
              return (
                <div key={aplikimi._id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="text-base font-medium text-gray-900 mb-1">
                        {shpallja?.pozitaPunes || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {shpallja?.kategoriaPunes || "N/A"}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          {new Date(aplikimi.dataKrijimit).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={14} className="mr-2 text-gray-400" />
                          {shpallja?.lokacioniPunes || "N/A"}
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Building size={14} className="mr-2 text-gray-400" />
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {shpallja?.orari || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative ml-2">
                      <button
                        onClick={() =>
                          setShfaqMeny(
                            shfaqMeny === aplikimi._id ? null : aplikimi._id,
                          )
                        }
                        className="text-gray-400 hover:text-gray-600 p-2"
                      >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </button>

                      {shfaqMeny === aplikimi._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => {
                              setAplikimiKlikuar(aplikimi);
                              setShfaqMeny(null);
                            }}
                            className="butonModifikimi"
                          >
                            <FontAwesomeIcon
                              icon={faPencil}
                              className="text-sm"
                            />
                            <span>Modifiko</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        aplikimi.status === "Pranuar"
                          ? "bg-green-100 text-green-800"
                          : aplikimi.status === "Ne_Pritje"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {aplikimi.status === "Ne_Pritje"
                        ? "Në pritje"
                        : aplikimi.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nuk ka aplikime për të shfaqur
            </div>
          )}
        </div>
      </div>

      {aplikimiKlikuar && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/10 "
            onClick={() => {
              setAplikimiKlikuar(null);
              setCvFile(null);
            }}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] w-full sm:w-3/4 md:w-2/3 lg:w-1/2 flex flex-col">
            <div className="relative bg-[#F5F7F8] px-8 py-6 overflow-hidden">
              <div className="relative flex justify-center items-center">
                <h2 className="text-2xl font-bold text-gray-700 tracking-tight">
                  Modifiko Aplikimin
                </h2>
                <button
                  onClick={() => {
                    setAplikimiKlikuar(null);
                    setCvFile(null);
                  }}
                  className="absolute right-0 text-gray-700 transition-all hover:bg-white/10 rounded-xl p-2 hover:rotate-5 duration-300"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-8">
              <form onSubmit={ruajNdryshimet} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="emriAplikantit" className="labelTabela">
                      Emri <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="emriAplikantit"
                      type="text"
                      value={aplikimiKlikuar.emriAplikantit}
                      onChange={modifikoAplikimin}
                      className="input-ShpalljaProfil"
                      placeholder="Sheno Emrin"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="mbiemriAplikantit" className="labelTabela">
                      Mbiemri <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="mbiemriAplikantit"
                      type="text"
                      value={aplikimiKlikuar.mbiemriAplikantit || ""}
                      onChange={modifikoAplikimin}
                      className="input-ShpalljaProfil"
                      placeholder="Sheno Mbiemrin"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="emailAplikantit" className="labelTabela">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="emailAplikantit"
                    type="email"
                    value={aplikimiKlikuar.emailAplikantit || ""}
                    onChange={modifikoAplikimin}
                    className="input-ShpalljaProfil"
                    placeholder="email@shembull.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="nrTelefonit" className="labelTabela">
                    Nr. Telefonit
                  </label>
                  <input
                    id="nrTelefonit"
                    type="text"
                    value={aplikimiKlikuar.nrTelefonit || ""}
                    onChange={modifikoAplikimin}
                    className="input-ShpalljaProfil"
                    placeholder="+383 XX XXX XXX"
                  />
                </div>

                <div>
                  <label htmlFor="eksperienca" className="labelTabela">
                    Eksperienca
                  </label>
                  <input
                    id="eksperienca"
                    type="text"
                    value={aplikimiKlikuar.eksperienca || ""}
                    onChange={modifikoAplikimin}
                    className="input-ShpalljaProfil"
                    placeholder="3 vjet"
                  />
                </div>

                <div>
                  <label htmlFor="letraMotivuese" className="labelTabela">
                    Letra Motivuese
                  </label>
                  <textarea
                    id="letraMotivuese"
                    value={aplikimiKlikuar.letraMotivuese || ""}
                    onChange={modifikoAplikimin}
                    rows="5"
                    className="input-ShpalljaProfil"
                    placeholder="Shkruaj letrën motivuese..."
                  />
                </div>

                <div>
                  <label htmlFor="cvFile" className="labelTabela">
                    CV (lini bosh nëse nuk doni të ndryshoni)
                  </label>
                  <input
                    id="cvFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {cvFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Skedari i zgjedhur: {cvFile.name}
                    </p>
                  )}
                  {aplikimiKlikuar.emriFileCv && (
                    <div className="text-sm text-gray-500 mt-1">
                      CV aktuale:{" "}
                      <a
                        href={`${import.meta.env.VITE_API_URL}/api/shpallja/${aplikimiKlikuar._id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {aplikimiKlikuar.emriFileCv}
                      </a>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="publikoPune cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {isSaving ? "Duke ruajtur..." : "Perfundo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenaxhoAplikimet;
