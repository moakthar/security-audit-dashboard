import React, { useState } from "react";
import { XMarkIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import { logService } from "../services/api";

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let logData;
      try {
        logData = JSON.parse(logs);
      } catch (parseError) {
        setError("INVALID JSON FORMAT");
        setLoading(false);
        return;
      }

      if (!Array.isArray(logData)) {
        setError("DATA MUST BE AN ARRAY OF LOG OBJECTS");
        setLoading(false);
        return;
      }

      if (logData.length === 0) {
        setError("PLEASE PROVIDE AT LEAST ONE LOG ENTRY");
        setLoading(false);
        return;
      }

      if (logData.length > 10000) {
        setError("MAXIMUM 10,000 LOG ENTRIES ALLOWED");
        setLoading(false);
        return;
      }

      const response = await logService.uploadLogs(logData);

      setSuccess(`SUCCESSFULLY UPLOADED ${response.data.insertedCount} LOGS`);

      setTimeout(() => {
        onUploadSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "UPLOAD FAILED");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          JSON.parse(content);
          setLogs(content);
          setError(null);
        } catch {
          setError("INVALID JSON FILE");
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black opacity-75" onClick={onClose} />

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true">
          &#8203;
        </span>

        {/* Modal Content */}
        <div className="inline-block align-bottom bg-white border-8 border-black text-left overflow-hidden shadow-[12px_12px_0px_#000] transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-6">
              <div>
                <h3 className="text-4xl font-black tracking-[-2px] uppercase">
                  UPLOAD AUDIT LOGS
                </h3>
                <p className="text-sm uppercase tracking-widest mt-1">
                  JSON FORMAT ONLY
                </p>
              </div>
              <button
                onClick={onClose}
                className="border-4 border-black p-3 hover:bg-black hover:text-white transition-all">
                <XMarkIcon className="h-8 w-8" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* File Upload */}
              <div className="mb-8">
                <label className="block uppercase tracking-[3px] text-sm font-black mb-3">
                  UPLOAD JSON FILE
                </label>
                <label className="border-4 border-black bg-white p-6 block cursor-pointer hover:bg-yellow-100 transition-colors text-center">
                  <DocumentArrowUpIcon className="h-12 w-12 mx-auto mb-3" />
                  <span className="font-black uppercase tracking-widest">
                    CHOOSE JSON FILE
                  </span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Or Paste JSON */}
              <div className="mb-8">
                <label className="block uppercase tracking-[3px] text-sm font-black mb-3">
                  OR PASTE JSON DATA
                </label>
                <textarea
                  rows={12}
                  value={logs}
                  onChange={(e) => setLogs(e.target.value)}
                  placeholder='[{"actor": "user@example.com", "action": "login", ...}]'
                  className="w-full border-4 border-black font-mono p-6 text-sm resize-y min-h-[280px] focus:outline-none focus:bg-yellow-50"
                />
              </div>

              {error && (
                <div className="border-4 border-red-600 bg-red-100 p-6 text-red-700 font-bold mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="border-4 border-green-600 bg-green-100 p-6 text-green-700 font-bold mb-6">
                  {success}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border-4 border-black py-6 font-black uppercase tracking-widest text-lg hover:bg-black hover:text-white transition-all">
                  CANCEL
                </button>

                <button
                  type="submit"
                  disabled={loading || !logs.trim()}
                  className="flex-1 border-4 border-black bg-black text-white py-6 font-black uppercase tracking-widest text-lg hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
                      UPLOADING...
                    </>
                  ) : (
                    <>
                      <DocumentArrowUpIcon className="h-6 w-6" />
                      UPLOAD LOGS
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
