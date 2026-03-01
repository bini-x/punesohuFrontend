import React, { useEffect } from "react";
import { useAlert } from "../contexts/AlertContext";
import { X, AlertTriangle } from "lucide-react";

const alertStyles = {
  success: "bg-green-50 border-green-400 text-green-800",
  error: "bg-red-50 border-red-400 text-red-800",
  warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
  info: "bg-blue-50 border-blue-400 text-blue-800",
};

const CustomAlert = () => {
  const { alert, hideAlert, confirm, hideConfirm } = useAlert();

  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(hideAlert, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.open, hideAlert]);

  return (
    <>
      {alert.open && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-96 max-w-[90%] ease-in-out transition-all duration-300">
          <div
            className={`rounded-lg border px-4 py-3 shadow-lg ${alertStyles[alert.type]}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{alert.message}</p>
              <button
                onClick={hideAlert}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {confirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={hideConfirm}
          ></div>

          <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {confirm.title}
                </h3>
              </div>
              <button
                onClick={hideConfirm}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">{confirm.message}</p>
            </div>

            <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-200">
              <button
                onClick={hideConfirm}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200"
              >
                Anulo
              </button>
              <button
                onClick={() => {
                  confirm.onConfirm();
                  hideConfirm();
                }}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium transition-all duration-200"
              >
                Fshij
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomAlert;
