import React, { useEffect, useState } from 'react';
import './LiveOdds.css'; 
const LiveOdds = () => {
  const [oddsData, setOddsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Loaded API Key:", process.env.REACT_APP_RAPIDAPI_KEY);
    fetch("https://odds-api1.p.rapidapi.com/surebets", {
      method: 'GET',
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
        'X-RapidAPI-Host': "odds-api1.p.rapidapi.com",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const parsed = Object.values(data);
        setOddsData(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching odds:", err);
        setLoading(false);
      });
  }, []);

  return (
  <div className="container">
    <h2>Arbitrage Opportunities</h2>
    {loading ? (
      <p>Loading odds...</p>
    ) : (
      <table className="arb-table">
        <thead>
          <tr>
            <th>Match</th>
            <th>Market</th>
            <th>Outcome 1</th>
            <th>Outcome 2</th>
            <th>Outcome 3</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {oddsData.map((bet, index) => {
            const market = bet?.markets && Object.values(bet.markets)[0];
            const marketName = market?.marketName || "N/A";
            const outcomes = market?.outcomes || {};

            const outcomeNames = Object.keys(outcomes);
            const outcomeCells = outcomeNames.slice(0, 3).map((key) => {
              const outcome = outcomes[key];
              const firstBookieName = Object.keys(outcome.bookmakers)[0];
              const firstBookie = outcome.bookmakers[firstBookieName];
              return (
                <td key={key}>
                  {outcome.outcomeName} <br />
                  <strong>{firstBookieName}</strong>: {firstBookie.price}
                </td>
              );
            });

            while (outcomeCells.length < 3) {
              outcomeCells.push(<td key={`blank-${outcomeCells.length}`}>—</td>);
            }

            // Profit calculation (example: 2-way)
            const odds = outcomeNames.map((key) => {
              const outcome = outcomes[key];
              const firstBookieName = Object.keys(outcome.bookmakers)[0];
              return outcome.bookmakers[firstBookieName].price;
            });

            let profit = null;
            if (odds.length >= 2) {
              const implied = odds.reduce((sum, o) => sum + 1 / o, 0);
              profit = ((1 - implied) * 100).toFixed(2);
            }

            return (
              <tr key={index}>
                <td>{`${bet.participant1} vs ${bet.participant2}`}</td>
                <td>{marketName}</td>
                {outcomeCells}
                <td className={profit >= 0 ? "profit-positive" : "profit-negative"}>
                  {profit ? `${profit}%` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
);
};

export default LiveOdds;





