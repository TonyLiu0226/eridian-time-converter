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

  const [finalTimeResult, setFinalTimeResult] = useState('');

  const [refEpoch, setRefEpoch] = useState<'anj' | 'nutanix'>('anj');

  function generateEridianBase6Number(num: number): string {
    const symbols = ['ℓ', 'I', 'V', 'λ', '+', '∀'];
    if (num < 0) throw new Error("Number must be non-negative");
    if (num === 0) return symbols[0];
    
    let result = '';
    let currentNum = num;
    while (currentNum > 0) {
      const remainder = currentNum % 6;
      // Prepend the remainder so the most significant digit is on the left
      result = symbols[remainder] + result;
      currentNum = Math.floor(currentNum / 6);
    }
    return result;
  }

  function getEridianTimeDifference() {
    const startTime = refEpoch === 'anj' ? new Date('2026-01-07T08:00:00Z') : new Date('2026-07-20T15:00:00Z');
    let timeDiff = 0;
    let currentIsPositive = true;
    if (startTime.getTime() > Date.parse(earthTime)) {
      currentIsPositive = false;
      timeDiff = (startTime.getTime() - Date.parse(earthTime));
    }
    else {
      currentIsPositive = true;
      timeDiff = (Date.parse(earthTime) - startTime.getTime());
    }
    const eridianSecondLength = 2336;

    let totalEridianSeconds = Math.floor(timeDiff / (eridianSecondLength));
    const eridianYears = generateEridianBase6Number(Math.floor(totalEridianSeconds / (6 ** 8)));
    const timeInEridianYear = totalEridianSeconds % (6 ** 8);
    const eridianMonths = generateEridianBase6Number(Math.floor(timeInEridianYear / (6 ** 7)));
    const timeInEridianMonth = timeInEridianYear % (6 ** 7);
    const eridianWeeks = generateEridianBase6Number(Math.floor(timeInEridianMonth / (6 ** 6)));
    const timeInEridianWeek = timeInEridianMonth % (6 ** 6);  
    const eridianDays = generateEridianBase6Number(Math.floor(timeInEridianWeek / (6 ** 5)));
    const timeInEridianDay = timeInEridianWeek % (6 ** 5);
    const eridianHours = generateEridianBase6Number(Math.floor(timeInEridianDay / (6 ** 4)));
    const timeInEridianHour = timeInEridianDay % (6 ** 4);
    const eridianHexaMinutes = generateEridianBase6Number(Math.floor(timeInEridianHour / (6 ** 3)));
    const timeInEridianHexaMinute = timeInEridianHour % (6 ** 3);
    const eridianMinutes = generateEridianBase6Number(Math.floor(timeInEridianHexaMinute / (6 ** 2)));
    const timeInEridianMinute = timeInEridianHexaMinute % (6 ** 2);
    const eridianHexaSeconds = generateEridianBase6Number(Math.floor(timeInEridianMinute / 6));
    const timeInEridianHexaSecond = timeInEridianMinute % 6;
    const eridianSeconds = generateEridianBase6Number(timeInEridianHexaSecond);
    
    let timeStr = '';
    if (currentIsPositive) {
      timeStr = `${eridianYears}${eridianMonths}${eridianWeeks}${eridianDays}${eridianHours}${eridianHexaMinutes}${eridianMinutes}${eridianHexaSeconds}${eridianSeconds}`;
    }
    else {
      timeStr = `-${eridianYears}${eridianMonths}${eridianWeeks}${eridianDays}${eridianHours}${eridianHexaMinutes}${eridianMinutes}${eridianHexaSeconds}${eridianSeconds}`;
    }
    console.log(timeStr);
    setFinalTimeResult(timeStr);
  }

  const handleEarthChange = (value: string) => {
    setEarthTime(value);
    setAmountTime({years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0});
  };
    
  const handleAmountChange = (field: keyof typeof amountTime, value: string) => {
    setAmountTime(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleEridChange = (field: keyof typeof eridTime, value: string) => {
    setEridTime(prev => ({ ...prev, [field]: Number(value) }));
  };

  useEffect(() => {
    if(activeTab === 0 &&earthTime !== '') {
      getEridianTimeDifference();
    }
  }, [earthTime, refEpoch]);

  //adds the specified amountTime offset to the current time
  useEffect(() => {
    if (amountTime.years > 0 || amountTime.months > 0 || amountTime.days > 0 || amountTime.hours > 0 || amountTime.minutes > 0 || amountTime.seconds > 0) {
      let newTime = new Date();
      newTime.setFullYear(newTime.getFullYear() + amountTime.years);
      newTime.setMonth(newTime.getMonth() + amountTime.months);
      newTime.setDate(newTime.getDate() + amountTime.days);
      newTime.setHours(newTime.getHours() + amountTime.hours);
      newTime.setMinutes(newTime.getMinutes() + amountTime.minutes);
      newTime.setSeconds(newTime.getSeconds() + amountTime.seconds);
      setEarthTime(newTime.toISOString().slice(0, -1));
    }
  }, [amountTime, refEpoch]);

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
                  onChange={(e) => handleEarthChange(e.target.value)} 
                  className="input-field"
                />
                <button className="now-button" onClick={() => handleEarthChange(new Date().toISOString().slice(0, -1))}>NOW</button>
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
                    checked={refEpoch === 'anj'}
                    onChange={(e) => setRefEpoch('anj')}
                  />
                  <span className="radio-custom"></span>
                  Base-Anj Time
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="tab1Radio" 
                    value={1}
                    checked={refEpoch === 'nutanix'}
                    onChange={(e) => setRefEpoch('nutanix')}
                  />
                  <span className="radio-custom"></span>
                  Base-Nutanix Time
                </label>
              </div>
              {finalTimeResult && (
              <div className="result-section animate-fade-in">
                <h3>Eridian Time:</h3>
                <p className="result-time">{finalTimeResult}</p>
              </div>)}
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
