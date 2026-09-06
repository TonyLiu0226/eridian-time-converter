import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Tab 1 state: Earth to Erid time
  const [earthTime, setEarthTime] = useState('');
  const [amountTime, setAmountTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [tab1Radio, setTab1Radio] = useState<number>(0);

  // Tab 2 state: Erid to Earth time
  const [eridTime, setEridTime] = useState({
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    hexaminutes: 0,
    minutes: 0,
    hexaseconds: 0,
    seconds: 0
  });
  const [tab2Radio, setTab2Radio] = useState('standard');
  const [isPositive, setIsPositive] = useState(true);

  function getEridianTimeDifference() {
    const startTime = new Date('2026-07-20T15:00:00Z');
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - startTime.getTime());

    const symbols = ['ℓ', 'I', 'V', 'λ', '+', '∀'];
    const eridianSecondLength = 2336;

    let totalEridianSeconds = timeDiff / eridianSecondLength;
    const eridianYears = totalEridianSeconds / (6 * 6 * 6 * 6 * 6 * 6 * 6 * 6);
    // Note: Other calculations follow similarly...
  }

  const handleAmountChange = (field: keyof typeof amountTime, value: string) => {
    setAmountTime(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleEridChange = (field: keyof typeof eridTime, value: string) => {
    setEridTime(prev => ({ ...prev, [field]: Number(value) }));
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header className="header">
          <h1>Erid Time Calculator</h1>
          <p>Bridge the gap between Earth and Eridani time</p>
        </header>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => setActiveTab(0)}
          >
            Earth → Erid
          </button>
          <button 
            className={`tab ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveTab(1)}
          >
            Erid → Earth
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 0 && (
            <div className="form-section animate-fade-in">
              <div className="form-group">
                <label>Time (Local)</label>
                <input 
                  type="datetime-local" 
                  step="1"
                  value={earthTime} 
                  onChange={(e) => setEarthTime(e.target.value)} 
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Amount of time from now</label>
                <div className="grid-inputs">
                  {Object.keys(amountTime).map((key) => (
                    <div className="input-group" key={key}>
                      <input 
                        type="number" 
                        value={amountTime[key as keyof typeof amountTime]} 
                        onChange={(e) => handleAmountChange(key as keyof typeof amountTime, e.target.value)}
                        className="input-field"
                        min="0"
                      />
                      <span className="input-label">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
                
              <div className="explanation-text">
                <h3>Choose which reference time to use:</h3>
                <p>Base-Anj time sets the epoch (timestamp 0) at 08:00:00 UTC on January 7, 2026.</p>
                <p>Base-Nutanix time sets the epoch at 15:00:00 UTC on July 20, 2026.</p>
              </div>
              <div className="form-group radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="tab1Radio" 
                    value={0}
                    checked={tab1Radio === 0}
                    onChange={(e) => setTab1Radio(Number(e.target.value))}
                  />
                  <span className="radio-custom"></span>
                  Base-Anj Time
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="tab1Radio" 
                    value={1}
                    checked={tab1Radio === 1}
                    onChange={(e) => setTab1Radio(Number(e.target.value))}
                  />
                  <span className="radio-custom"></span>
                  Base-Nutanix Time
                </label>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="form-section animate-fade-in">
              <div className="form-group">
                <label>Eridian Time Units</label>
                <div className="grid-inputs erid-grid">
                  {Object.keys(eridTime).map((key) => (
                    <div className="input-group" key={key}>
                      <input 
                        type="number" 
                        value={eridTime[key as keyof typeof eridTime]} 
                        onChange={(e) => handleEridChange(key as keyof typeof eridTime, e.target.value)}
                        className="input-field"
                        min="0"
                      />
                      <span className="input-label">{key}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-row">
                <div className="form-group toggle-group">
                  <label>Value Sign</label>
                  <button 
                    className={`toggle-btn ${isPositive ? 'positive' : 'negative'}`}
                    onClick={() => setIsPositive(!isPositive)}
                  >
                    <div className="toggle-slider"></div>
                    <span className="toggle-text">{isPositive ? 'Positive' : 'Negative'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
