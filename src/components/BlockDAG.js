import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useCallback } from "react";
import { getBlockdagInfo } from "../karlsen-api-client";

const BlockDAGBox = () => {
  const [networkName, setNetworkName] = useState("");
  const [blockCount, setBlockCount] = useState();
  const [headerCount, setHeaderCount] = useState("");
  const [virtualDaaScore, setVirtualDaaScore] = useState("");
  const [hashrate, setHashrate] = useState("");

  // calculate and assign correct hashrate unit
  const calculateAndFormatHashrate = (difficulty) => {
    const hashrateValue = ((difficulty * 2) / 1000000000000).toFixed(2);
    return parseFloat(hashrateValue) >= 1
      ? `${hashrateValue} TH/s`
      : `${(parseFloat(hashrateValue) * 1000).toFixed(2)} GH/s`;
  };

  // wrap initBox in useCallback to avoid dependency of useEffect
  const initBox = useCallback(async () => {
    const dag_info = await getBlockdagInfo();

    console.log("DAG Info ", dag_info);

    setNetworkName(dag_info.networkName);
    setBlockCount(dag_info.blockCount);
    setHeaderCount(dag_info.headerCount);
    setVirtualDaaScore(dag_info.virtualDaaScore);
    setHashrate(calculateAndFormatHashrate(dag_info.difficulty));
  }, []);

  useEffect(() => {
    initBox();
    const updateInterval = setInterval(async () => {
      const dag_info = await getBlockdagInfo();
      setNetworkName(dag_info.networkName);
      setBlockCount(dag_info.blockCount);
      setHeaderCount(dag_info.headerCount);
      setVirtualDaaScore(dag_info.virtualDaaScore);
      setHashrate(calculateAndFormatHashrate(dag_info.difficulty));
    }, 60000);
    return () => clearInterval(updateInterval);
  }, [initBox]);

  useEffect(() => {
    document
      .getElementById("blockCount")
      .animate([{ opacity: "1" }, { opacity: "0.6" }, { opacity: "1" }], {
        duration: 300,
      });
  }, [blockCount]);

  useEffect(() => {
    document
      .getElementById("headerCount")
      .animate([{ opacity: "1" }, { opacity: "0.6" }, { opacity: "1" }], {
        duration: 300,
      });
  }, [headerCount]);

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
            <td className="cardBoxElement">Block count</td>
            <td className="pt-1" id="blockCount">
              {blockCount}
            </td>
          </tr>
          <tr>
            <td className="cardBoxElement">Header count</td>
            <td className="pt-1" id="headerCount">
              {headerCount}
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
