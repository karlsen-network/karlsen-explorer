import { faMemory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useCallback } from "react";
import { apiAddress } from "../addresses";

const KarlsendInfoBox = () => {
  const [data, setData] = useState({});

  const updateData = useCallback(async () => {
    try {
      const response = await fetch(`https://${apiAddress}/info/karlsend`);
      const d = await response.json();
      setData(d);
    } catch (err) {
      console.log("Error", err);
    }
    setTimeout(updateData, 60000);
  }, []); // Empty dependency array ensures updateData is only created once

  useEffect(() => {
    updateData();
  }, [updateData]); // No more issues with changing dependencies

  return (
    <div className="cardBox mx-0">
      <table>
        <tr>
          <td colSpan="2" className="text-center" style={{ fontSize: "4rem" }}>
            <FontAwesomeIcon icon={faMemory} />
            <div className="cardLight" />
          </td>
        </tr>
        <tr>
          <td colSpan="2" className="text-center">
            <h3>KARLSEND INFO</h3>
          </td>
        </tr>
        <tr>
          <td className="cardBoxElement">Mempool size</td>
          <td>{data.mempoolSize}</td>
        </tr>
        <tr>
          <td className="cardBoxElement">Server version</td>
          <td>{data.serverVersion}</td>
        </tr>
      </table>
    </div>
  );
};

export default KarlsendInfoBox;
