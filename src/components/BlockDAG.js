import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useCallback } from "react";
import { getBlockdagInfo, getKarlsendInfo } from "../karlsen-api-client";

const BlockDAGBox = () => {
  const [networkName, setNetworkName] = useState("");
  const [virtualDaaScore, setVirtualDaaScore] = useState("");
  const [hashrate, setHashrate] = useState("");
  const [mempool, setMempool] = useState("");

  // calculate and assign correct hashrate unit
  const formatHashrate = (hashraw, decimals) => {
    let hashrateValue = hashraw;
    let unit = "H/s";
    if (hashrateValue >= 1e12) {
      hashrateValue = hashrateValue / 1e12;
      unit = "TH/s";
    } else if (hashrateValue >= 1e9) {
      hashrateValue = hashrateValue / 1e9;
      unit = "GH/s";
    } else if (hashrateValue >= 1e6) {
      hashrateValue = hashrateValue / 1e6;
      unit = "MH/s";
    }
    return `${hashrateValue.toFixed(decimals)} ${unit}`;
  };

  // wrap initBox in useCallback to avoid dependency of useEffect
  const initBox = useCallback(async () => {
    const dag_info = await getBlockdagInfo();
    const karlsendInfo = await getKarlsendInfo();

    console.log("DAG Info ", dag_info);

    setNetworkName(dag_info.networkName);
    setVirtualDaaScore(dag_info.virtualDaaScore);
    const hashraw = dag_info.difficulty * 2;
    setHashrate(formatHashrate(hashraw, 2));
    setMempool(karlsendInfo.mempoolSize);
  }, []);

  useEffect(() => {
    initBox();
    const updateInterval = setInterval(async () => {
      const dag_info = await getBlockdagInfo();
      setNetworkName(dag_info.networkName);
      setVirtualDaaScore(dag_info.virtualDaaScore);
      const hashraw = dag_info.difficulty * 2;
      setHashrate(formatHashrate(hashraw, 2));
    }, 60000);
    return () => clearInterval(updateInterval);
  }, [initBox]);

  useEffect(() => {
    document
      .getElementById("virtualDaaScore")
      .animate([{ opacity: "1" }, { opacity: "0.6" }, { opacity: "1" }], {
        duration: 300,
      });
  }, [virtualDaaScore]);

  useEffect(() => {
    document
      .getElementById("hashrate")
      .animate([{ opacity: "1" }, { opacity: "0.6" }, { opacity: "1" }], {
        duration: 300,
      });
  }, [hashrate]);

  return (
    <>
      <div className="cardBox mx-0">
        <table style={{ fontSize: "1rem" }}>
          <tr>
            <td
              colspan="2"
              className="text-center"
              style={{ fontSize: "4rem" }}
            >
              <FontAwesomeIcon icon={faDiagramProject} />
              <div className="cardLight" />
            </td>
          </tr>
          <tr>
            <td colspan="2" className="text-center">
              <h3>BLOCKDAG INFO</h3>
            </td>
          </tr>
          <tr>
            <td className="cardBoxElement">Network name</td>
            <td className="pt-1 text-nowrap">{networkName}</td>
          </tr>
          <tr>
            <td className="cardBoxElement">Mempool count</td>
            <td className="pt-1" id="mempool">
              {mempool}
            </td>
          </tr>
          <tr>
            <td className="cardBoxElement">Virtual DAA Score</td>
            <td className="pt-1 align-top" id="virtualDaaScore">
              {virtualDaaScore}
            </td>
          </tr>
          <tr>
            <td className="cardBoxElement">Hashrate</td>
            <td className="pt-1" id="hashrate">
              {hashrate}
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default BlockDAGBox;
