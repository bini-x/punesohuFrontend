import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="bg-footer text-gray-300 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 max-w-7xl mx-auto px-6 py-16 gap-10">
        <div>
          <h3 className="text-white">Punësohu</h3>
          <p className="text-sm leading-relaxed">
            Platformë moderne për lidhjen e punëkërkuesve me kompanitë më të
            mira në Kosovë.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Për kandidatët
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">
              <Link to="/listapuneve">Kërko Punë</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link to="/llogaritpagen">Llogarit pagën</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link to="/rrethnesh">Rreth Nesh</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Për kompanitë
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">
              <Link to="PublikoPune">Shpall Konkurs</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link to="ListaAplikanteve">Lista e Aplikanteve</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link to="RrethNesh">Rreth Nesh</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Kontakt</h4>
          <p className="text-sm">Email: info-Punesohu@gmail.com</p>
          <p className="text-sm mb-4">Tel: +383 44 444 444</p>
          <div className="flex space-x-4 text-sm">
            <span className="footerLinks">Facebook</span>
            <span className="footerLinks">LinkedIn</span>
            <span className="footerLinks">Instagram</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 py-4 text-center text-sm text-gray-400">
        © 2026 Punësimi. Të gjitha të drejtat e rezervuara.
      </div>
    </footer>
  );
}

export default Footer;
