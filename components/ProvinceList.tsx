"use client";
// import React, { useState, useEffect } from "react";

export default async function ProvinceList() {
  const [selectedProvince, setSelectedProvince] = useState("");

  return (
    <div>
      <h1>Province List</h1>
      <select
        id="provinceDropdown"
        // onChange={provinceChange}
        // value={selectedProvinceCode}
      >
        <option value="">Select...</option>
        {/* {provinces.map((prov) => (
          <option key={prov.code} value={prov.code}>
            {prov.name}
          </option>
        ))} */}
      </select>
    </div>
  );
}
