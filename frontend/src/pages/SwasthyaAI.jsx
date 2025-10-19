import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const API_BASE = 'https://backend-91i8.onrender.com';

const colors = {
  LOW: '#10B981',
  MEDIUM: '#F59E0B',
  HIGH: '#EF4444',
  NORMAL: '#10B981',
  MODERATE: '#F59E0B',
  CRITICAL: '#EF4444'
};

const AgentStatus = () => {
  const [agentData, setAgentData] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchAgentStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/agent-coordination`);
        const data = await response.json();
        setAgentData(data);
        setIsActive(data.status === 'ACTIVE');
      } catch (error) {
        console.error('Error fetching agent status:', error);
      }
    };

    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-semibold text-gray-800">AI Agent Status</h3>
        {isActive && (
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        )}
      </div>
      {agentData ? (
        <div className="space-y-2 text-sm">
          <div>
            <div className="font-medium text-gray-700">Predictive Agent</div>
            <div className="text-gray-600">{agentData.predictiveAgent}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Operations Agent</div>
            <div className="text-gray-600">{agentData.operationsAgent}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Coordination Agent</div>
            <div className="text-gray-600">{agentData.coordinationAgent}</div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-sm">Loading agent status...</div>
      )}
    </div>
  );
};

const ControlPanel = ({ onPredict, onSimulate }) => {
  const [event, setEvent] = useState('Normal');
  const [pollutionLevel, setPollutionLevel] = useState(100);
  const [crisisType, setCrisisType] = useState('Smog Alert');
  const [predictLoading, setPredictLoading] = useState(false);
  const [crisisLoading, setCrisisLoading] = useState(false);

  const handlePredict = async () => {
    setPredictLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/predict-surge?event=${encodeURIComponent(event)}&pollutionLevel=${pollutionLevel}`);
      const data = await response.json();
      onPredict(data);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Failed to fetch prediction. Please check if the backend is running.');
    } finally {
      setPredictLoading(false);
    }
  };

  const handleSimulate = async () => {
    setCrisisLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/simulate-crisis?type=${encodeURIComponent(crisisType)}`);
      const data = await response.json();
      onSimulate(data);
    } catch (error) {
      console.error('Simulation error:', error);
      alert('Failed to simulate crisis. Please check if the backend is running.');
    } finally {
      setCrisisLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Surge Prediction</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
          <select 
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Diwali</option>
            <option>Holi</option>
            <option>Normal</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pollution Level: {pollutionLevel}
          </label>
          <input 
            type="range"
            min="0"
            max="500"
            value={pollutionLevel}
            onChange={(e) => setPollutionLevel(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>500</span>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={predictLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
        >
          {predictLoading ? (
            <>
              <RefreshCw className="animate-spin" size={16} />
              Predicting...
            </>
          ) : (
            'Predict Surge'
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Crisis Simulation</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Crisis Type</label>
          <select 
            value={crisisType}
            onChange={(e) => setCrisisType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option>Smog Alert</option>
            <option>Heatwave</option>
            <option>Epidemic Outbreak</option>
          </select>
        </div>

        <button
          onClick={handleSimulate}
          disabled={crisisLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-orange-400 flex items-center justify-center gap-2"
        >
          {crisisLoading ? (
            <>
              <RefreshCw className="animate-spin" size={16} />
              Simulating...
            </>
          ) : (
            'Simulate Crisis'
          )}
        </button>
      </div>

      <AgentStatus />
    </div>
  );
};

const PredictionResult = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Activity size={48} className="mx-auto mb-3 text-gray-400" />
          <p>Run a prediction to see results</p>
        </div>
      </div>
    );
  }

  const gaugeData = [
    { value: data.riskScore },
    { value: 100 - data.riskScore }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full overflow-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Prediction Results</h3>
      
      <div 
        className="rounded-lg p-4 mb-4"
        style={{ backgroundColor: `${colors[data.riskLevel]}20` }}
      >
        <div className="text-sm font-medium text-gray-600 mb-1">Risk Level</div>
        <div 
          className="text-3xl font-bold"
          style={{ color: colors[data.riskLevel] }}
        >
          {data.riskLevel}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Predicted Surge</div>
        <div className="text-2xl font-semibold text-gray-800">{data.predictedSurge}%</div>
      </div>

      {/* FIXED CHART CONTAINER - Added margin and fixed height */}
      <div className="mb-6 mt-8"> {/* Added mt-8 for more top spacing */}
        <div className="text-sm font-medium text-gray-600 mb-2 text-center">Risk Score</div>
        <div className="relative" style={{ height: '140px' }}> {/* Increased height */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="80%" 
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                <Cell fill={colors[data.riskLevel]} />
                <Cell fill="#E5E7EB" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-2xl font-bold text-gray-800">{data.riskScore}</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mt-4"> {/* Added mt-4 */}
        <div className="text-sm font-medium text-gray-600 mb-2">Recommended Action</div>
        <div className="text-sm text-gray-700">{data.recommendedAction}</div>
      </div>
    </div>
  );
};

const CrisisOutput = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <AlertTriangle size={48} className="mx-auto mb-3 text-gray-400" />
          <p>Run a simulation to see the automated response</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full overflow-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Crisis Simulation</h3>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Crisis Type</div>
        <div className="text-xl font-bold text-red-700">{data.crisis}</div>
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-600 mb-2">Impact</div>
        <div className="text-gray-700">
          <span className="font-semibold">{data.affectedHospitals}</span> hospitals affected, 
          <span className="font-semibold"> {data.estimatedPatients}</span> estimated patients
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-600 mb-3">Automated Actions</div>
        <div className="space-y-2">
          {data.autoActions.map((action, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HospitalStatusTable = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/hospitals`);
        const data = await response.json();
        setHospitals(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        setLoading(false);
      }
    };

    fetchHospitals();
    const interval = setInterval(fetchHospitals, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-full flex items-center justify-center">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Hospital Status</h3>
      
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hospital Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bed Capacity</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Beds Available</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital, idx) => {
              const capacityPercent = ((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds * 100).toFixed(0);
              
              // Dynamic status colors using Tailwind
              const statusColor = 
                hospital.status === 'CRITICAL' ? 'bg-red-500' :
                hospital.status === 'MODERATE' ? 'bg-yellow-500' :
                'bg-green-500';
              
              const rowColor = 
                hospital.status === 'CRITICAL' ? 'hover:bg-red-50' :
                hospital.status === 'MODERATE' ? 'hover:bg-yellow-50' :
                'hover:bg-green-50';

              const progressColor = 
                hospital.status === 'CRITICAL' ? 'bg-red-500' :
                hospital.status === 'MODERATE' ? 'bg-yellow-500' :
                'bg-green-500';

              return (
                <tr key={idx} className={`border-b border-gray-100 ${rowColor}`}>
                  <td className="py-3 px-4 text-sm text-gray-800">{hospital.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}>
                      {hospital.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${progressColor}`}
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{capacityPercent}% occupied</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">{hospital.availableBeds} / {hospital.totalBeds}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function SwasthyaAI() {
  const [predictionData, setPredictionData] = useState(null);
  const [crisisData, setCrisisData] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Swasthya-AI Dashboard</h1>
        <p className="text-gray-600 mt-1">Predictive Hospital Management System</p>
      </header>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
        <div className="col-span-4">
          <div className="sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Swasthya-AI Controls</h2>
            <ControlPanel 
              onPredict={setPredictionData}
              onSimulate={setCrisisData}
            />
          </div>
        </div>

        <div className="col-span-8">
          <div className="grid grid-rows-2 gap-6 h-full">
            <div className="grid grid-cols-2 gap-6">
              <PredictionResult data={predictionData} />
              <CrisisOutput data={crisisData} />
            </div>

            <div>
              <HospitalStatusTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}