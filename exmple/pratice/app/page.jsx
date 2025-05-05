'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching vehicles:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading vehicles...</p>;

  return (
    <div>
      <h1>Vehicle Violations</h1>
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} style={{ border: '1px solid #ccc', margin: '1em 0', padding: '1em' }}>
          <h2>{vehicle.plate} - {vehicle.owner}</h2>
          <h3>Violations:</h3>
          <ul>
            {vehicle.violations
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((violation) => (
                <li key={violation.id}>
                  {violation.date}: {violation.category} - {violation.paid ? 'Paid' : 'Unpaid'}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
