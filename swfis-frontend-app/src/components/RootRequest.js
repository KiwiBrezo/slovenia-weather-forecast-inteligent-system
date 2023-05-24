import React, { useState, useEffect } from 'react';

const RootRequest = () => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/');
        const data = await res.json();
        setResponse(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card">
      <h2>Root Request</h2>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
};

export default RootRequest;
