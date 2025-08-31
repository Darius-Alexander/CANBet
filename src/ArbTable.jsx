import React from 'react';

const mockData = [
  {
    sport: 'Tennis',
    match: 'Nadal vs Djokovic',
    bookieA: 'Bet365: 1.90',
    bookieB: 'Pinnacle: 2.10',
    profit: '5.26%',
  },
  {
    sport: 'Soccer',
    match: 'Barcelona vs Real Madrid',
    bookieA: 'Betway: 2.00',
    bookieB: '888Sport: 2.05',
    profit: '3.17%',
  },
];

const ArbTable = () => {
    return (
        <div>
            <h2 style={{ textAlign: "center"}}>Arbitrage Opportunities</h2>

            <table border="1" cellPadding="10" cellSpacing="0" style={{width: "70%" , margin: "0 auto"}}>
                <thead>
                    <tr>    
                        <th>Sport</th>
                        <th>Match</th>
                        <th>Bookie A</th>
                        <th>Bookie B</th>
                        <th>Profit %</th>
                    </tr>
                </thead>

                <tbody>
                    {mockData.map((bet, idx) => (
                        <tr key={idx}>
                            <td>{bet.sport}</td>
                            <td>{bet.match}</td>
                            <td>{bet.bookieA}</td>
                            <td>{bet.bookieB}</td>
                            <td>{bet.profit}</td>
                        </tr>
                    ))}
        </tbody>
        
      </table>
    </div>
  );
};




export default ArbTable; 