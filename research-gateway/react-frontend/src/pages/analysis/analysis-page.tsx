import { useEffect, useState } from "react";

const AnalysisPage = () => {

  const [data, setData] = useState();

  useEffect(() => {
    fetch('/api/v1/data-logs')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <>
      <div>AnalysisPage</div>
      <span>{data}</span>
    </>
  );
};

export default AnalysisPage;