import React from 'react'
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import * as XLSX from 'xlsx';
import { FaRocket, FaEnvelope, FaPaperPlane, FaTrash, FaCheckCircle, FaHistory } from "react-icons/fa";



function App() {

  const [msg, setMsg] = useState("")
  const [status, setStatus] = useState(false)
  const [emailList, setEmailList] = useState([])
  const [progress, setProgress] = useState(0);
  const [sendHistory, setSendHistory] = useState([]);
  const [subject, setSubject] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [errors, setErrors] = useState({});


  // Predefined templates
  const templates = {
    promotional: "🎉✨ Upgrade your experience with our latest offers!",
    newsletter: "📝 Discover our newest stories, updates, and community highlights.",
    reminder: "⏰ Don’t forget! Your upcoming event is just around the corner!",
    custom: "✨ Craft a message that fits your purpose perfectly.",
  };

  function handlemsg(evt) {
    setMsg(evt.target.value)
  }

  const handleSubject = (e) => {
    setSubject(e.target.value);
    setErrors({ ...errors, subject: "" });
  };

  const handleTemplateChange = (e) => {
    const template = e.target.value;
    setSelectedTemplate(template);
    setMsg(templates[template] || "");
  };

  // Clear all
  const clearAll = () => {
    setMsg("");
    setSubject("");
    setEmailList([]);
    setSelectedTemplate("");
    setErrors({});
    setProgress(0);
  };

  function handleFile(event) {
    const file = event.target.files[0];
    console.log(file);

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });
      const totalemails = emailList.map(function (item) { return item.A; });
      console.log(totalemails);
      setEmailList(totalemails);
    }

    reader.readAsBinaryString(file);
  }


  function send() {
    setStatus(true);
    axios.post("https://bulkmail-app-k1nz.onrender.com/sendemail", { msg: msg, emailList: emailList, subject: subject })
      .then(function (data) {
        if (data.data === true) {
          setSendHistory([...sendHistory, { subject, count: emailList.length, date: new Date().toLocaleString() }]);
          setMsg("");
          setSubject("");
          setEmailList([]);
          setSelectedTemplate("");
          alert("Emails sent successfully!");
          setStatus(false);
        }
        else {
          alert("Failed to send emails. Please try again.");
        }
      })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-purple-950 to-fuchsia-950 flex flex-col items-center justify-center p-4 transition-opacity duration-1000">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-800 to-fuchsia-950 text-white text-center py-6 px-8 rounded-t-2xl shadow-2xl w-full max-w-5xl transform hover:scale-105 transition-all duration-300 border border-fuchsia-600 glow-emerald">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3 text-purple-200 animate-pulse">
          <FaRocket className="text-emerald-200 animate-bounce" /> ZapMailer App
        </h1>
        <p className="text-lg mt-2 opacity-80 text-purple-200">Craft smart emails. Deliver at lightning speed.!</p>
      </div>

      {/* Main Content box */}

      <div className="bg-linear-to-br from-slate-800 to-slate-900 shadow-2xl rounded-b-2xl w-full max-w-5xl p-8 md:p-10 lg:p-12 border border-fuchsia-600 glow-indigo">
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-slate-300 flex items-center gap-3 glow-text">
            <FaEnvelope className="text-purple-300 animate-pulse" /> Craft & Zap
          </h2>
        </div>

        {/* Template Selector */}
        <div className="mb-6">
          <label className="block text-md font-medium text-slate-300 mt-4 mb-4">Choose a Template</label>
          <select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            className="w-full p-4 bg-slate-700 border-2 border-fuchsia-500 rounded-xl text-white placeholder-slate-400 focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-400 hover:shadow-lg hover:border-indigo-500 hover:bg-slate-600"
          >
            <option value="" className="bg-slate-700">Select a template...</option>
            <option value="promotional" className="bg-slate-700">Promotional</option>
            <option value="newsletter" className="bg-slate-700">Newsletter</option>
            <option value="reminder" className="bg-slate-700">Reminder</option>
            <option value="custom" className="bg-slate-700">Custom</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-md font-medium text-slate-300 mb-2">Email Subject</label>
          <input
            type="text"
            value={subject}
            onChange={handleSubject}
            className="w-full p-4 mb-6 bg-slate-700 border-2 border-fuchsia-500 rounded-xl text-white placeholder-slate-400 focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-300 hover:shadow-lg hover:border-indigo-500 hover:bg-slate-600"
            placeholder="Add a subject that grabs attention…"
          />
          {errors.subject && <p className="text-red-500 text-sm mt-2 flex items-center gap-2"><FaExclamationTriangle /> {errors.subject}</p>}
        </div>

        {/* Email Text */}
        <div className='mb-4'>
          <label className="block text-md font-medium text-slate-300 mb-2">Message Body</label>
          <textarea
            value={msg}
            onChange={handlemsg}
            className="w-full h-40 p-4 bg-slate-700 border-2 border-fuchsia-500 rounded-xl text-white placeholder-slate-400 focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-300 hover:shadow-lg hover:border-indigo-500 hover:bg-slate-600 resize-none"
            placeholder="Craft your message here..."
          />
          {errors.msg && <p className="text-red-500 text-sm mt-2 flex items-center gap-2"><FaExclamationTriangle /> {errors.msg}</p>}
        </div>

        {/* FILE INPUT */}
        <div>
          <label className="block text-md font-medium text-slate-300 mb-2">Upload Email List (Excel)</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFile}
            className="w-full p-4 bg-slate-700 border-2 border-dashed border-purple-300 rounded-xl text-white hover:border-emerald-500 hover:bg-slate-600 transition-all duration-300 cursor-pointer focus:ring-4 focus:ring-indigo-400"
          />
          {errors.file && <p className="text-red-500 text-sm mt-2 flex items-center gap-2"><FaExclamationTriangle /> {errors.file}</p>}
          {errors.emails && <p className="text-red-500 text-sm mt-2 flex items-center gap-2"><FaExclamationTriangle /> {errors.emails}</p>}
        </div>

        <p className="text-lg text-center mt-5 text-slate-200">Total Emails in file: {emailList.length} </p>

        {/* Right: Preview & History */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-300 flex items-center gap-3 glow-text">
            <FaHistory className="text-purple-400 animate-pulse" /> Preview & History
          </h2>

          {/* Email Preview */}
          <div className="bg-linear-to-br from-slate-700 to-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-400 hover:border-indigo-600">
            <h3 className="font-bold text-lg text-purple-300 mb-3 flex items-center gap-2">
              <FaEnvelope className="animate-pulse" /> Email Preview
            </h3>
            <p className="text-md text-slate-300 mb-2">
              <strong className="text-indigo-400">Subject:</strong> {subject || "No subject yet"}
            </p>
            <p className="text-md text-slate-300 mb-2">
              <strong className="text-indigo-400">Message:</strong> {msg || "No message yet"}
            </p>
            <p className="text-md text-slate-300">
              <strong className="text-indigo-400">To:</strong> {emailList.slice(0, 5).join(", ")}
              {emailList.length > 5 ? "..." : ""}
            </p>
          </div>

          {/* Send History */}
          <div className="bg-linear-to-br from-slate-700 to-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-400 hover:border-indigo-600 max-h-60 overflow-y-auto">
            <h3 className="font-bold text-lg text-purple-300 mb-3 flex items-center gap-2">
              <FaHistory className="animate-pulse" /> Recent Sends
            </h3>
            {sendHistory.length === 0 ? (
              <p className="text-md text-slate-400 italic">No history yet—send your first email!</p>
            ) : (
              sendHistory.slice(-5).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 mt-3 p-3 bg-slate-600 rounded-lg shadow hover:shadow-md transition-all duration-200 border-2 border-slate-600 hover:border-slate-500"
                >
                  <FaCheckCircle className="text-emerald-500 animate-bounce" />
                  <div>
                    <p className="text-sm font-medium text-white">{item.subject}</p>
                    <p className="text-xs text-slate-400">{item.count} emails • {item.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>


        {/* Buttons */}
        <div className="flex gap-4 flex-wrap justify-center items-center mt-4">
          <button
            onClick={send}
            disabled={status}
            className="bg-linear-to-r from-violet-800 via-purple-800 to-fuchsia-700 hover:from-violet-900 hover:via-purple-900 hover:to-fuchsia-800 text-white py-4 px-8 rounded-xl font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:glow-emerald disabled:opacity-50 flex items-center gap-3"
            title="Send emails to the list"
          >
            <FaPaperPlane className="animate-bounce" /> {status ? "Sending..." : "Send Emails"}
          </button>
          <button
            onClick={clearAll}
            className="bg-linear-to-r from-slate-700 to-red-800 hover:from-slate-600 hover:to-red-700 text-white py-4 px-8 rounded-xl font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:glow-red flex items-center gap-3"
            title="Reset the form"
          >
            <FaTrash /> Clear All
          </button>
        </div>

        <p className="text-center text-lg text-gray-500 mt-4">
          Powered by BulkMailer • Excel supported
        </p>

      </div>
    </div>
  )
}

export default App;
