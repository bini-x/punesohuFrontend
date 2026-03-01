import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import "../index.css";
import { useNavigate } from "react-router-dom";
import Perdoruesi from "../PerdoruesiContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "../contexts/AlertContext";

function ShpalljaCard({ shpallja }) {
  const navigate = useNavigate();
  const { perdoruesiData } = Perdoruesi.usePerdoruesi();
  const { showAlert } = useAlert();
  const [eshteRuajtur, setEshteRuajtur] = useState(false);
  const [duke_ngarkuar, setDuke_ngarkuar] = useState(false);
  const [fotoError, setFotoError] = useState(false);

  const getRemainingTime = () => {
    if (!shpallja.dataKrijimit) return null;
    const created = new Date(shpallja.dataKrijimit);
    const expires = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
    const now = new Date();
    const diffMs = expires - now;

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      return {
        label: `${diffHours} orë${diffHours !== 1 ? "të mbetura" : "e mbeturë"}`,
        isUrgent: true,
      };
    }
    return {
      label: `${diffDays} ditë`,
      isUrgent: diffDays < 5,
    };
  };

  const timeRemaining = getRemainingTime();

  useEffect(() => {
    const kontrolloStatusin = async () => {
      if (perdoruesiData && perdoruesiData.tipiPerdoruesit !== "punedhenes") {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/punetRuajtura/eshte-ruajtur/${shpallja._id}`,
          );
          setEshteRuajtur(response.data.eshteRuajtur);
        } catch (error) {
          console.error("Gabim gjatë kontrollimit:", error);
        }
      }
    };

    kontrolloStatusin();
  }, [shpallja._id, perdoruesiData]);

  const handleClick = () => {
    navigate(`/shpallja/${shpallja._id}`);
  };

  const ndryshoRuajtjen = async (e) => {
    e.stopPropagation();

    if (!perdoruesiData) {
      showAlert("Ju lutem kyçuni për të ruajtur punë", "warning");
      return;
    }

    if (perdoruesiData.tipiPerdoruesit === "punedhenes") {
      showAlert("Punëdhënësit nuk mund të ruajnë punë", "info");
      return;
    }

    setDuke_ngarkuar(true);
    try {
      if (eshteRuajtur) {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/punetRuajtura/hiq/${shpallja._id}`,
          {
            data: { perdoruesiId: perdoruesiData._id },
          },
        );

        if (response.data.success) {
          setEshteRuajtur(false);
          showAlert("Puna u hoq nga listat e ruajtura", "info");
        }
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/punetRuajtura/ruaj/${shpallja._id}`,
          {
            perdoruesiId: perdoruesiData._id,
          },
        );

        if (response.data.success) {
          setEshteRuajtur(true);
          showAlert("Puna u ruajt me sukses!", "success");
        }
      }
    } catch (error) {
      console.error("Gabim gjatë ndryshimit të ruajtjes:", error);
      showAlert("Gabim gjatë ruajtjes së punës", "error");
    } finally {
      setDuke_ngarkuar(false);
    }
  };

  const handlePhotoError = () => {
    setFotoError(true);
  };

  const isPhotoUrl =
    shpallja.fotoProfili && shpallja.fotoProfili.startsWith("http");
  const isPhotoBase64 =
    shpallja.fotoProfili && shpallja.fotoProfili.startsWith("data:");

  const getCompanyName = () => {
    if (!shpallja.emailKompanise) return "COMPANY";
    const name = shpallja.emailKompanise.split("@")[0];
    return name.toUpperCase();
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg w-full p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-gray-300 hover:bg-white/90 group">
      <div className="flex items-start gap-3 mb-2">
        <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
          {(isPhotoUrl || isPhotoBase64) && !fotoError ? (
            <img
              src={shpallja.fotoProfili}
              alt="Company Logo"
              className="w-14 h-14 rounded-lg object-cover border border-gray-200"
              onError={handlePhotoError}
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center border border-gray-200">
              <span className="text-white font-bold text-lg">
                {getCompanyName().substring(0, 2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 transition-colors duration-300 group-hover:text-[#0f4c75]">
            {getCompanyName()}
          </p>
          <h3 className="font-semibold text-gray-900 text-base leading-tight mb-0 transition-colors duration-300 group-hover:text-[#0f4c75]">
            {shpallja.pozitaPunes}
          </h3>
        </div>

        {perdoruesiData?.tipiPerdoruesit !== "punedhenes" && (
          <button
            onClick={ndryshoRuajtjen}
            disabled={duke_ngarkuar}
            className={`flex shrink-0 transition-all duration-200 ${
              duke_ngarkuar
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110 cursor-pointer"
            }`}
          >
            <FontAwesomeIcon
              icon={eshteRuajtur ? faBookmarkSolid : faBookmarkRegular}
              className={`text-xl ${eshteRuajtur ? "text-primary" : "text-gray-400"}`}
            />
          </button>
        )}
      </div>

      <div className="mb-2 h-10 overflow-hidden">
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem] transition-colors duration-300 group-hover:text-gray-700">
          {shpallja.pershkrimiPunes
            ? shpallja.pershkrimiPunes.substring(0, 100) +
              (shpallja.pershkrimiPunes.length > 100 ? "..." : "")
            : "No description available"}
        </p>
      </div>

      <hr className="hrCard transition-opacity duration-300 group-hover:opacity-50" />

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium transition-all duration-300 group-hover:bg-[#0f4c75]/10 group-hover:text-[#0f4c75]">
          <FontAwesomeIcon
            icon={faLocationDot}
            className="text-gray-500 transition-colors duration-300 group-hover:text-[#0f4c75]"
          />
          {shpallja.lokacioniPunes || "Remote"}
        </span>

        {shpallja.niveliPunes && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium transition-all duration-300 group-hover:bg-[#0f4c75]/10 group-hover:text-[#0f4c75]">
            {shpallja.niveliPunes}
          </span>
        )}

        {shpallja.orari && shpallja.orari.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium transition-all duration-300 group-hover:bg-[#0f4c75]/10 group-hover:text-[#0f4c75]">
            {shpallja.orari[0]}
          </span>
        )}

        {timeRemaining && (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              timeRemaining.isUrgent
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <FontAwesomeIcon
              icon={faClock}
              className={
                timeRemaining.isUrgent ? "text-red-600" : "text-yellow-600"
              }
            />
            {timeRemaining.label}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          {shpallja.pagaPrej > 0 && shpallja.pagaDeri > 0 && (
            <p className="text-sm font-medium text-gray-900 transition-colors duration-300 group-hover:text-[#0f4c75]">
              <FontAwesomeIcon
                icon={faDollarSign}
                className="mr-1 text-gray-500 transition-colors duration-300 group-hover:text-[#0f4c75]"
              />
              {shpallja.pagaPrej}-{shpallja.pagaDeri}
            </p>
          )}
        </div>

        <button
          className="relative group/button bg-transparent cursor-pointer"
          onClick={handleClick}
        >
          <div className={`}`}>
            <span className="relative z-10 bg-gradient-to-r from-slate-700 via-gray-800 to-black bg-clip-text text-transparent font-semibold text-sm group-hover/button:from-slate-800 group-hover/button:via-gray-900 group-hover/button:to-black transition-all duration-300">
              {perdoruesiData?.tipiPerdoruesit === "punedhenes"
                ? "Shiko me shume"
                : "Apliko tani"}
            </span>
            <FontAwesomeIcon
              icon={faArrowRightLong}
              className="ml-1 text-gray-700 group-hover/button:text-black group-hover/button:translate-x-1 transition-all duration-300"
            />
          </div>
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-700 to-black group-hover/button:w-full transition-all duration-500 ease-out"></div>
        </button>
      </div>
    </div>
  );
}

export default ShpalljaCard;
