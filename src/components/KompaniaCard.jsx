import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function KompaniaCard({ kompania }) {
  const navigate = useNavigate();
  const [fotoProfile, setFotoProfile] = useState(null);
  const [fotoError, setFotoError] = useState(false);

  useEffect(() => {
    if (kompania?.foto) {
      setFotoProfile(
        `${import.meta.env.VITE_API_URL}/api/profili/${kompania._id}/foto`,
      );
    }
  }, [kompania]);

  const handleClick = () => {
    navigate(`/kompania/${kompania._id}`);
  };

  const handlePhotoError = () => {
    setFotoError(true);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg w-full p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-gray-300 hover:bg-white/90 group">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
          {fotoProfile && !fotoError ? (
            <img
              src={fotoProfile}
              alt="Company Logo"
              className="w-16 h-16 rounded-xl object-cover border border-gray-200"
              onError={handlePhotoError}
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-700 via-gray-800 to-black flex items-center justify-center border border-gray-200">
              <span className="text-white font-bold text-xl">
                {getInitials(kompania.kompania)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl text-gray-900 leading-tight transition-colors duration-300 group-hover:text-[#0f4c75]">
            {kompania.kompania}
          </h3>
        </div>
      </div>

      <div className="mb-4">
        <p className="flex items-center text-gray-700 font-medium text-sm transition-colors duration-300 group-hover:text-gray-900">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="mr-2 text-gray-500 transition-colors duration-300 group-hover:text-[#0f4c75]"
          />
          {kompania.email}
        </p>
      </div>

      <hr className="border-gray-200 my-4 transition-opacity duration-300 group-hover:opacity-50" />

      {/* Footer - View More Button */}
      <div className="flex items-center justify-between">
        <div>{/* Placeholder for additional info if needed */}</div>

        <button
          className="relative group/button bg-transparent cursor-pointer"
          onClick={handleClick}
        >
          <span className="relative z-10 bg-gradient-to-r from-slate-700 via-gray-800 to-black bg-clip-text text-transparent font-semibold text-sm group-hover/button:from-slate-800 group-hover/button:via-gray-900 group-hover/button:to-black transition-all duration-300">
            Shiko më shumë
          </span>
          <FontAwesomeIcon
            icon={faArrowRightLong}
            className="ml-1 text-gray-700 group-hover/button:text-black group-hover/button:translate-x-1 transition-all duration-300"
          />
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-700 to-black group-hover/button:w-full transition-all duration-500 ease-out"></div>
        </button>
      </div>
    </div>
  );
}

export default KompaniaCard;
