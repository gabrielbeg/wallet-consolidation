'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import * as XLSX from "xlsx";
import languages from "@/services/languages.json";
import MapExcelData from "@/services/fileMap";
import MonthlyReport from "@/components/report";

export default function Home() {
  const [tableData, setTableData] = useState([]);
  const [lang, _setLang] = useState("pt");
  const [texts, setTexts] = useState(languages[lang]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const mappedData = MapExcelData(workbook);
      console.log(mappedData);
      setTableData(mappedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const setLang = (lang) => {
    setTexts(languages[lang]);
    _setLang(lang);
  }

  return (    
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <main className="container mx-auto max-w-7xl">    
            {/* Language Switcher */}
            <div className="flex justify-end mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex">
                <button 
                  onClick={() => setLang("pt")} 
                  className={`px-3 py-1 text-sm rounded-l-lg transition ${lang === "pt" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}
                >
                  PT
                </button>
                <button 
                  onClick={() => setLang("en")} 
                  className={`px-3 py-1 text-sm rounded-r-lg transition ${lang === "en" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}
                >
                  EN
                </button>
              </div>
            </div>
        {/* Header */}
        <div className="flex flex-col items-center justify-center py-8 mb-8">
          <Image
            className="mb-6"
            src="/logo.png"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center">{texts.title}</h1>          
          {/* File input button */}
          <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition cursor-pointer w-full max-w-xs">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </span>
            {texts.importFile}
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        {/* Table - only display if tableData has elements */}
        {tableData.length === 0 && (
          <MonthlyReport data={tableData} />
        )}
        {tableData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold uppercase text-sm text-center">{texts.customer}</th>
                  <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold uppercase text-sm text-center">{texts.startValue}</th>
                  <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold uppercase text-sm text-center">{texts.endValue}</th>
                  <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold uppercase text-sm text-center">{texts.totalOperations}</th>
                  <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold uppercase text-sm text-center">{texts.netTotal}</th>
                  <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold uppercase text-sm text-center">{texts.averageCapital}</th>
                  <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold uppercase text-sm text-center">{texts.approximateProfit}</th>
                  <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold uppercase text-sm text-center">{texts.cdi}</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200 text-center">{item.customer}</td>
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200 text-center">{item.startValue}</td>
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200 text-center">{item.endValue}</td>
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200 text-center">{item.totalOperations}</td>
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200 text-center">{item.netTotal}</td>
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200 text-center">{item.averageCapital}</td>
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200 text-center">{item.approximateProfit}</td>
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200 text-center">{item.cdi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>          
    </div>
  );
}
