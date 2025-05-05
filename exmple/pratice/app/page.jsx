'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  // All vehicle data from the server, including violations
  const [vehicles, setVehicles] = useState([]);

  // Form for creating a new vehicle
  const [vehicleForm, setVehicleForm] = useState({ plate: '', owner: '' });

  // Form for creating violations per vehicle
  const [violationForms, setViolationForms] = useState({});

  // Task 8: Summary counts for paid and unpaid violations
  const [summary, setSummary] = useState({ paid: 0, unpaid: 0 });

  useEffect(() => {
    fetchVehicles();  // Load all vehicles and their violations
    fetchSummary();   // Load total paid/unpaid counts
  }, []);

  // GET /api/vehicles
  const fetchVehicles = async () => {
    const res = await fetch('/api/vehicles');
    const data = await res.json();
    setVehicles(data);
  };

  // GET /api/summary
  const fetchSummary = async () => {
    const res = await fetch('/api/summary');
    const data = await res.json();
    setSummary(data);
  };

  // Handle input changes for vehicle creation form
  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleForm((prev) => ({ ...prev, [name]: value }));
  };

  // POST /api/vehicles
  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleForm),
    });
    setVehicleForm({ plate: '', owner: '' }); // Reset form
    fetchVehicles();
    fetchSummary();
  };

  // Handle input changes in violation form
  const handleViolationInputChange = (vehicleId, e) => {
    const { name, value } = e.target;
    setViolationForms((prev) => ({
      ...prev,
      [vehicleId]: { ...prev[vehicleId], [name]: value },
    }));
  };

  // POST /api/vehicles/:vehicleId/violations
  const handleViolationSubmit = async (e, vehicleId) => {
    e.preventDefault();
    const data = violationForms[vehicleId];
    await fetch(`/api/vehicles/${vehicleId}/violations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setViolationForms((prev) => ({ ...prev, [vehicleId]: { category: '', date: '' } }));
    fetchVehicles();
    fetchSummary();
  };

  // PATCH /api/vehicles/:vehicleId/violations/:violationId to mark as paid
  const handlePay = async (vehicleId, violationId) => {
    await fetch(`/api/vehicles/${vehicleId}/violations/${violationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paid: true }),
    });
    fetchVehicles();
    fetchSummary();
  };

  // DELETE /api/vehicles/:vehicleId/violations/:violationId (only if paid)
  const handleDelete = async (vehicleId, violationId) => {
    await fetch(`/api/vehicles/${vehicleId}/violations/${violationId}`, {
      method: 'DELETE',
    });
    fetchVehicles();
    fetchSummary();
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🚗 Vehicle Violations</h1>

      {/* Task 8: Violation count summary */}
      <p>
        ✅ Paid Violations: {summary.paid} | ❌ Unpaid Violations: {summary.unpaid}
      </p>

      {/* Task 6: Add vehicle form */}
      <form onSubmit={handleVehicleSubmit} style={{ marginBottom: '2rem' }}>
        <h2>Add New Vehicle</h2>
        <input
          type="text"
          name="plate"
          placeholder="Plate Number"
          value={vehicleForm.plate}
          onChange={handleVehicleInputChange}
          required
        />
        <input
          type="text"
          name="owner"
          placeholder="Owner Name"
          value={vehicleForm.owner}
          onChange={handleVehicleInputChange}
          required
        />
        <button type="submit">Add Vehicle</button>
      </form>

      {/* Loop through each vehicle */}
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '2rem' }}>
          <h3>{vehicle.plate} — {vehicle.owner}</h3>

          {/* Task 6: Add violation form for this vehicle */}
          <form onSubmit={(e) => handleViolationSubmit(e, vehicle.id)} style={{ marginTop: '1rem' }}>
            <h4>Add Violation</h4>
            <input
              type="text"
              name="category"
              placeholder="Violation Category"
              value={violationForms[vehicle.id]?.category || ''}
              onChange={(e) => handleViolationInputChange(vehicle.id, e)}
              required
            />
            <input
              type="date"
              name="date"
              value={violationForms[vehicle.id]?.date || ''}
              onChange={(e) => handleViolationInputChange(vehicle.id, e)}
              required
            />
            <button type="submit">Add Violation</button>
          </form>

          {/* Task 7: Show violations with buttons */}
          <ul style={{ marginTop: '1rem' }}>
            {vehicle.violations?.map((v) => (
              <li key={v.id}>
                {v.category} — {new Date(v.date).toLocaleDateString()} — {v.paid ? '✅ Paid' : '❌ Unpaid'}
                {!v.paid && (
                  <button onClick={() => handlePay(vehicle.id, v.id)} style={{ marginLeft: '10px' }}>
                    Pay
                  </button>
                )}
                {v.paid && (
                  <button onClick={() => handleDelete(vehicle.id, v.id)} style={{ marginLeft: '10px' }}>
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}


//Update the page to be able to create new vehicles and violations. Use forms and
 //named fields.
  //[ Add two buttons to each violation: one button to pay it and another button to
//delete it, only after it has been paid.
// Display the total number of unpaid and paid violations using an aggregate Prisma
//query.


// Create a client-side page using React and Next to display the list of vehicles along
//with their violations:
//  Store the list of vehicles and violations using a state variable.
//  Use an effect and a single fetch call to read the list of vehicles and violations.
//  Display the list of vehicles and violations. The violations should be visually
//grouped by vehicle and sorted by date.



//to run npm run dev