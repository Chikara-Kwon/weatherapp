async function getProvinces() {
  const res = await fetch("https://psgc.gitlab.io/api/provinces/");

  return res.json();
}

export default async function ProvinceList() {
  const provinces = await getProvinces();

  return (
    <div>
      <h1>Province List</h1>
      <ul>
        {provinces.map((province, index) => (
          <li key={province.code}>{province.name}</li>
        ))}
      </ul>
    </div>
  );
}
