import React, { useEffect, useState } from 'react';

const LiveOdds = () => {
  const [oddsData, setOddsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://odds-api1.p.rapidapi.com/surebets", {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': "b18728c46cmsh4b6072ab1d5baedp15f8d8jsnf1765595f19d",
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
    <div style={{ padding: '20px' }}>
      <h2 style={{textAlign: "center"}}>Arbitrage Opportunities</h2>
      {loading ? (
        <p>Loading odds...</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "90%" , margin: "0 auto"}}>
          <thead>
            <tr>
              <th>Match</th>
              <th>Market</th>
              <th>Outcome 1</th>
              <th>Outcome 2</th>
              <th>Outcome 3</th>
              <th>Profit %</th>
            </tr>
          </thead>
          <tbody>
            {oddsData.map((bet, index) => {
              const market = bet?.markets && Object.values(bet.markets)[0];
              const marketName = market?.marketName || 'N/A';
              const outcomes = market?.outcomes || {};

              const outcomeNames = Object.keys(outcomes);

              // Generate cells for outcome columns
              const outcomeCells = outcomeNames.slice(0, 3).map((key) => {
                const outcome = outcomes[key];
                const firstBookieName = Object.keys(outcome.bookmakers)[0];
                const firstBookie = outcome.bookmakers[firstBookieName];
                return (
                  <td key={key}>
                    {outcome.outcomeName || key}
                    <br />
                    <strong>
                      {firstBookie?.eventPath ? (
                        <a href={firstBookie.eventPath} target="_blank" rel="noopener noreferrer">
                          {firstBookieName}
                        </a>
                      ) : (
                        firstBookieName
                      )}
                    </strong>: {firstBookie?.price ?? '—'}
                  </td> 
                );
              });

              // Fill missing outcome columns with blanks
              while (outcomeCells.length < 3) {
                outcomeCells.push(<td key={`blank-${outcomeCells.length}`}>—</td>);
              }

              // 🧮 Manual profit calculation
              const odds = outcomeNames.slice(0, 3).map((key) => {
                const bookieKey = Object.keys(outcomes[key].bookmakers)[0];
                return parseFloat(outcomes[key].bookmakers[bookieKey]?.price || 0);
              });

              const totalInverse = odds.reduce((sum, o) => sum + (o ? 1 / o : 0), 0);
              const profit = (1 - totalInverse) * 100;
              const formattedProfit = profit > 0 ? `${profit.toFixed(2)}%` : '—';

              return (
                <tr key={index}>
                  <td>{`${bet.participant1} vs ${bet.participant2}`}</td>
                  <td>{marketName}</td>
                  {outcomeCells}
                  <td>{formattedProfit}</td>
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





