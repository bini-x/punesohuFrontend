import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../App.css";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SquareChartGantt, Heart, Settings, LogOut, User } from "lucide-react";

import {
  faBars,
  faTimes,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import Perdoruesi from "../PerdoruesiContext";

const JobSearchIcon = ({ className = "" }) => (
  <svg
    width="47"
    height="36"
    viewBox="0 0 18 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Main search circle - centered and proportional */}
    <circle
      cx="15"
      cy="15"
      r="12"
      stroke="currentColor"
      strokeWidth="2.8"
      fill="none"
    />

    {/* User/Person icon inside the magnifier - better centered */}
    {/* Head */}
    <circle cx="15" cy="13" r="3" fill="currentColor" />

    {/* Body/Shoulders - smoother curve */}
    <path
      d="M9.5 20C9.5 18 11.5 16.5 15 16.5C18.5 16.5 20.5 18 20.5 20"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />

    {/* Search handle - cleaner angle */}
    <path
      d="M22.5 22.5L30 30"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

function Header({ withGradient = false, forceNonHomePage = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { perdoruesiData, setPerdoruesiData } = Perdoruesi.usePerdoruesi();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check if we're on the home page
  const isHomePage = forceNonHomePage ? false : location.pathname === "/";

  // Check if we're on BallinaMysafir (root path with no user)
  const isBallinaMysafir = location.pathname === "/" && !perdoruesiData;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsMobileProfileOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMobileProfileOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleMobileProfile = () => {
    setIsMobileProfileOpen(!isMobileProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleCkycja = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ckycja/perdoruesi`,
        {},
      );

      setPerdoruesiData(null);
      console.log("Ckycja u be", response.data);
      closeDropdown();
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setPerdoruesiData(null);
    }
  };

  const isPunedhenes = perdoruesiData?.tipiPerdoruesit === "punedhenes";

  // Check if current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if user has photo
  const kaFoto =
    perdoruesiData?.foto && Object.keys(perdoruesiData?.foto).length > 0;

  const NavLink = ({ to, children, onClick }) => {
    const active = isActive(to);
    return (
      <Link to={to} onClick={onClick} className="relative group py-2">
        <span
          className={`font-medium transition-colors duration-300 ${
            isHomePage
              ? "text-white"
              : active
                ? "text-[#0F4C75]"
                : "text-zinc-700 hover:text-[#0F4C75]"
          }`}
        >
          {children}
        </span>
        <span
          className={`absolute bottom-0 left-0 h-[3px] rounded-full transition-all duration-300 ease-out ${
            isHomePage
              ? "bg-white"
              : "bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0F4C75]"
          } ${
            active
              ? "w-full opacity-100"
              : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
          }`}
        ></span>
      </Link>
    );
  };

  const MobileNavLink = ({ to, children, onClick }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className={`relative text-base font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center overflow-hidden ${
          active
            ? "text-[#0F4C75] bg-gradient-to-r from-[#0F4C75]/10 to-[#3282B8]/10 shadow-sm"
            : "text-gray-800 hover:text-[#0F4C75] hover:bg-gray-50"
        }`}
        onClick={onClick}
      >
        {active && (
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0F4C75] to-[#3282B8] rounded-r-full"></span>
        )}
        <span className="relative z-10">{children}</span>
      </Link>
    );
  };

  return (
    <>
      <div
        className={`relative ${withGradient ? "bg-gradient-to-r from-[#F5F7F8] via-[#DDE6ED] to-[#F5F7F8]" : ""}`}
      >
        {/* Header Content */}
        <div
          className={`relative z-40 flex items-center justify-between w-full py-6 px-6 mx-auto text-base`}
        >
          <Link to="/" className="flex items-center gap-3 mr-8 group">
            <div className="transform group-hover:scale-110 transition-all duration-300">
              <JobSearchIcon
                className={`${isHomePage ? "text-white" : "text-[#0F4C75]"} group-hover:text-[#3282B8] transition-colors duration-300`}
              />
            </div>
            <div className="flex flex-col leading-none gap-0.5">
              <span
                className={`text-[22px] tracking-tight font-bold ${isHomePage ? "text-white" : "bg-gradient-to-r from-[#0F4C75] to-[#3282B8] bg-clip-text text-transparent"}`}
              >
                𝗣𝘂𝗻𝗲𝘀𝗼𝗵𝘂
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8 items-center">
            <NavLink to="/">Ballina</NavLink>
            <NavLink to="/listaPuneve">Lista e Puneve</NavLink>
            <NavLink to="/listaKompanive">Lista e Kompanive</NavLink>
            <NavLink to="/listaAplikanteve">Lista e Aplikanteve</NavLink>
            {isPunedhenes && <NavLink to="/publikopune">Publiko Pune</NavLink>}
            <NavLink to="/rrethNesh">Rreth Nesh</NavLink>
          </nav>

          <div className="hidden md:flex space-x-3 items-center ml-auto">
            {perdoruesiData ? (
              <>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 hover:shadow-sm group ${
                      isHomePage ? "hover:bg-white/10" : "hover:bg-[#D6E6F2]"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 bg-gray-200">
                      {kaFoto ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}/api/profili/${perdoruesiData._id}/foto`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0F4C75] to-[#3282B8] flex items-center justify-center">
                          <User size={18} className="text-white" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`font-semibold text-sm ${isHomePage ? "text-white" : "text-zinc-700"}`}
                    >
                      {perdoruesiData.tipiPerdoruesit === "punedhenes"
                        ? perdoruesiData.kompania
                        : perdoruesiData.emri}
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`text-sm transition-transform duration-300 ${
                        isHomePage ? "text-white/80" : "text-zinc-400"
                      } ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-500 font-medium">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold text-zinc-800 truncate">
                          {perdoruesiData.tipiPerdoruesit === "punedhenes"
                            ? perdoruesiData.kompania
                            : perdoruesiData.emri}
                        </p>
                      </div>

                      <div className="py-2">
                        <Link
                          to={`/profili/${perdoruesiData._id}`}
                          className="flex items-center px-4 py-3 text-zinc-700 font-medium hover:bg-gradient-to-r hover:from-[#0F4C75]/5 hover:to-[#3282B8]/5 hover:text-[#0F4C75] transition-all duration-200 group"
                          onClick={closeDropdown}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#0F4C75]/10 flex items-center justify-center mr-3 group-hover:bg-[#0F4C75]/20 group-hover:scale-110 transition-all duration-200">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-[#0F4C75] text-sm"
                            />
                          </div>
                          <span>Profili</span>
                        </Link>

                        {isPunedhenes ? (
                          <Link
                            to={`/profili/${perdoruesiData._id}/menaxhoShpalljet`}
                            className="flex items-center px-4 py-3 text-zinc-700 font-medium hover:bg-gradient-to-r hover:from-[#0F4C75]/5 hover:to-[#3282B8]/5 hover:text-[#0F4C75] transition-all duration-200 group"
                            onClick={closeDropdown}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#0F4C75]/10 flex items-center justify-center mr-3 group-hover:bg-[#0F4C75]/20 group-hover:scale-110 transition-all duration-200">
                              <SquareChartGantt
                                size={16}
                                className="text-[#0F4C75]"
                              />
                            </div>
                            <span>Menaxho Shpalljet</span>
                          </Link>
                        ) : (
                          <Link
                            to={`/profili/${perdoruesiData._id}/menaxhoAplikimet`}
                            className="flex items-center px-4 py-3 text-zinc-700 font-medium hover:bg-gradient-to-r hover:from-[#0F4C75]/5 hover:to-[#3282B8]/5 hover:text-[#0F4C75] transition-all duration-200 group"
                            onClick={closeDropdown}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#0F4C75]/10 flex items-center justify-center mr-3 group-hover:bg-[#0F4C75]/20 group-hover:scale-110 transition-all duration-200">
                              <SquareChartGantt
                                size={16}
                                className="text-[#0F4C75]"
                              />
                            </div>
                            <span>Menaxho Aplikimet</span>
                          </Link>
                        )}

                        <Link
                          to={`/profili/${perdoruesiData._id}/konfigurimet`}
                          className="flex items-center px-4 py-3 text-zinc-700 font-medium hover:bg-gradient-to-r hover:from-[#0F4C75]/5 hover:to-[#3282B8]/5 hover:text-[#0F4C75] transition-all duration-200 group"
                          onClick={closeDropdown}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#0F4C75]/10 flex items-center justify-center mr-3 group-hover:bg-[#0F4C75]/20 group-hover:scale-110 transition-all duration-200">
                            <Settings size={16} className="text-[#0F4C75]" />
                          </div>
                          <span>Konfigurimet</span>
                        </Link>

                        {!isPunedhenes && (
                          <Link
                            to={`/profili/${perdoruesiData._id}/punetRuajtura`}
                            className="flex items-center px-4 py-3 text-zinc-700 font-medium hover:bg-gradient-to-r hover:from-[#0F4C75]/5 hover:to-[#3282B8]/5 hover:text-[#0F4C75] transition-all duration-200 group"
                            onClick={closeDropdown}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#0F4C75]/10 flex items-center justify-center mr-3 group-hover:bg-[#0F4C75]/20 group-hover:scale-110 transition-all duration-200">
                              <Heart size={16} className="text-[#0F4C75]" />
                            </div>
                            <span>Punet e Ruajtura</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-2 mt-2">
                        <button
                          type="button"
                          className="w-full flex items-center px-4 py-3 text-zinc-700 font-medium hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                          onClick={handleCkycja}
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mr-3 group-hover:bg-red-100 group-hover:scale-110 transition-all duration-200">
                            <LogOut size={16} className="text-red-600" />
                          </div>
                          <span>C'kycu</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {isBallinaMysafir ? (
                  <>
                    <Link
                      to="/kycja"
                      className="px-8 py-3 bg-white border border-white rounded-xl text-[#0F4C75] font-semibold hover:bg-transparent hover:text-white transition-all duration-300"
                    >
                      Kycu/Regjistrohu
                    </Link>
                    <Link
                      to="/kycja"
                      className="px-8 py-3 bg-transparent border border-white rounded-xl text-white font-semibold hover:bg-white hover:text-[#0F4C75] transition-all duration-300"
                    >
                      Publiko Pune
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/kycja"
                      className="px-5 py-2.5 border border-[#0F4C75] rounded-xl text-[#0F4C75] font-semibold hover:bg-[#0F4C75] hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      Kycu/Regjistrohu
                    </Link>
                    <Link to="/kycja" className="publikoPune">
                      Publiko Pune
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <button
            className={`md:hidden text-2xl ml-auto transform hover:scale-110 transition-transform duration-200 ${
              isHomePage ? "text-white" : "text-zinc-700"
            } hover:text-[#0F4C75]`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className={`mobile-menu-override md:hidden ${isBallinaMysafir ? "bg-white/95 backdrop-blur-sm" : "bg-white"} shadow-2xl rounded-2xl overflow-hidden mx-4 mt-2 border ${isBallinaMysafir ? "border-white/20" : "border-gray-100"} animate-in fade-in slide-in-from-top-4 duration-300`}
        >
          <nav className="flex flex-col py-4 px-4 space-y-1">
            <MobileNavLink to="/" onClick={closeMenu}>
              Ballina
            </MobileNavLink>
            <MobileNavLink to="/listaPuneve" onClick={closeMenu}>
              Lista e Puneve
            </MobileNavLink>
            <MobileNavLink to="/listaKompanive" onClick={closeMenu}>
              Lista e Kompanive
            </MobileNavLink>
            <MobileNavLink to="/listaAplikanteve" onClick={closeMenu}>
              Lista e Aplikanteve
            </MobileNavLink>
            <MobileNavLink to="/rrethNesh" onClick={closeMenu}>
              Rreth Nesh
            </MobileNavLink>

            {isPunedhenes && (
              <MobileNavLink to="/publikopune" onClick={closeMenu}>
                Publiko Pune
              </MobileNavLink>
            )}

            {perdoruesiData ? (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <button
                  onClick={toggleMobileProfile}
                  className="flex items-center justify-between w-full text-left py-3 px-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 bg-gray-200">
                      {kaFoto ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}/api/profili/${perdoruesiData._id}/foto`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0F4C75] to-[#3282B8] flex items-center justify-center">
                          <User size={18} className="text-white" />
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-gray-800">
                      {perdoruesiData.tipiPerdoruesit === "punedhenes"
                        ? perdoruesiData.kompania
                        : perdoruesiData.emri}
                    </span>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-sm text-zinc-400 transition-transform duration-300 ${
                      isMobileProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMobileProfileOpen && (
                  <div className="mt-2 ml-4 space-y-1 border-l-2 border-[#0F4C75] pl-4 animate-in fade-in slide-in-from-left-2 duration-300">
                    <Link
                      to={`/profili/${perdoruesiData._id}`}
                      className="flex items-center gap-3 py-2.5 px-3 text-gray-800 hover:text-[#0F4C75] transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium"
                      onClick={closeMenu}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-[#0F4C75]"
                      />
                      Profili
                    </Link>

                    {isPunedhenes ? (
                      <Link
                        to={`/profili/${perdoruesiData._id}/menaxhoShpalljet`}
                        className="flex items-center gap-3 py-2.5 px-3 text-gray-800 hover:text-[#0F4C75] transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium"
                        onClick={closeMenu}
                      >
                        <SquareChartGantt
                          size={18}
                          className="text-[#0F4C75]"
                        />
                        Menaxho Shpalljet
                      </Link>
                    ) : (
                      <Link
                        to={`/profili/${perdoruesiData._id}/menaxhoAplikimet`}
                        className="flex items-center gap-3 py-2.5 px-3 text-gray-800 hover:text-[#0F4C75] transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium"
                        onClick={closeMenu}
                      >
                        <SquareChartGantt
                          size={18}
                          className="text-[#0F4C75]"
                        />
                        Menaxho Aplikimet
                      </Link>
                    )}

                    <Link
                      to={`/profili/${perdoruesiData._id}/konfigurimet`}
                      className="flex items-center gap-3 py-2.5 px-3 text-gray-800 hover:text-[#0F4C75] transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium"
                      onClick={closeMenu}
                    >
                      <Settings size={18} className="text-[#0F4C75]" />
                      Konfigurimet
                    </Link>

                    {!isPunedhenes && (
                      <Link
                        to={`/profili/${perdoruesiData._id}/punetRuajtura`}
                        className="flex items-center gap-3 py-2.5 px-3 text-gray-800 hover:text-[#0F4C75] transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium"
                        onClick={closeMenu}
                      >
                        <Heart size={18} className="text-[#0F4C75]" />
                        Punet e Ruajtura
                      </Link>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    handleCkycja();
                    closeMenu();
                  }}
                  className="mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold w-full hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  C'kycu
                </button>
              </div>
            ) : (
              <div className="mt-4 border-t border-gray-200 pt-4 flex flex-col gap-3">
                {isBallinaMysafir ? (
                  <>
                    <Link
                      to="/kycja"
                      className="px-5 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 font-semibold text-center hover:bg-gray-50 hover:border-[#0F4C75] hover:text-[#0F4C75] transition-all duration-300 transform hover:scale-[1.02]"
                      onClick={closeMenu}
                    >
                      Kycu/Regjistrohu
                    </Link>
                    <Link
                      to="/kycja"
                      className="publikoPune px-5 py-3 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] border border-transparent rounded-xl text-white font-semibold text-center hover:from-[#3282B8] hover:to-[#0F4C75] transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                      onClick={closeMenu}
                    >
                      Publiko Pune
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/kycja"
                      className="px-5 py-3 border border-[#0F4C75] rounded-xl text-[#0F4C75] font-semibold text-center hover:bg-[#0F4C75] hover:text-white transition-all duration-300 transform hover:scale-[1.02]"
                      onClick={closeMenu}
                    >
                      Kycu/Regjistrohu
                    </Link>
                    <Link
                      to="/kycja"
                      className="publikoPune px-5 py-3 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-xl text-white font-semibold text-center hover:from-[#3282B8] hover:to-[#0F4C75] transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      onClick={closeMenu}
                    >
                      Publiko Pune
                    </Link>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

export default Header;
