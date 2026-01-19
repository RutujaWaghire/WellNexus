import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { practitionerService } from "../services/api";

const Practitioners = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadPractitioners();
  }, [filter]);

  const loadPractitioners = async () => {
    try {
      let response;
      if (filter === "all") {
        response = await practitionerService.getAll();
      } else if (filter === "verified") {
        response = await practitionerService.getVerified();
      } else {
        response = await practitionerService.getBySpecialization(filter);
      }
      setPractitioners(response.data);
    } catch (error) {
      console.error("Error loading practitioners:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-12"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/00/45/27/00/360_F_45270035_xs5LemZ7pbjm1vIbMGLoA0YRDB9hxOxl.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/75"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2f5f59] mb-3">
            Find Practitioners
          </h1>
          <p className="text-[#6f8f89]">
            Connect with trusted professionals for your wellness journey 🌱
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { label: "All", value: "all" },
            { label: "Verified", value: "verified" },
            { label: "Physiotherapy", value: "Physiotherapy" },
            { label: "Acupuncture", value: "Acupuncture" },
            { label: "Ayurveda", value: "Ayurveda" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition
                ${
                  filter === f.value
                    ? "bg-teal-600 text-white shadow"
                    : "bg-white/80 text-[#355f5b] hover:bg-teal-50"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Practitioners Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {practitioners.map((practitioner) => (
            <div
              key={practitioner.id}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 hover:-translate-y-1 hover:shadow-2xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-[#2f5f59]">
                  Practitioner #{practitioner.userId}
                </h3>

                {practitioner.verified && (
                  <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    ✓ Verified
                  </span>
                )}
              </div>

              <p className="text-[#6f8f89] mb-2">
                <strong className="text-[#355f5b]">Specialization:</strong>{" "}
                {practitioner.specialization}
              </p>

              <p className="text-[#6f8f89] mb-6">
                <strong className="text-[#355f5b]">Rating:</strong>{" "}
                ⭐ {practitioner.rating.toFixed(1)}
              </p>

              <Link
                to={`/book-session/${practitioner.id}`}
                className="block text-center bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
              >
                Book Session
              </Link>
            </div>
          ))}
        </div>

        {practitioners.length === 0 && (
          <p className="text-center text-[#6f8f89] mt-12">
            No practitioners found
          </p>
        )}
      </div>
    </div>
  );
};

export default Practitioners;
