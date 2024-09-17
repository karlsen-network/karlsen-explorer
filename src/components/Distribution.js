import { useEffect, useState } from "react";
import { Spinner, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import {
  getTopWallets,
  getTotalAddresses,
  getAddressDistribution,
} from "../karlsen-api-client";
import { PieChart, pieChartDefaultProps } from "react-minimal-pie-chart";
import { useWindowSize } from "react-use";

const Distribution = () => {
  const [wallets, setWallets] = useState([]);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowSize();

  // define the address to tag mapping as a const (current ones are for testing)
  const addressTags = {
    "karlsen:qrdn0eyzyc2z4leqwgxcngt98su5gq4p47gz435q8mu2wh8c78502qlfquvnj":
      "Mexc",
    "karlsen:qzmf98x2k50txs0ljctwmshsztfyedy54mpa2ndz0lhj8pdfwwhgun66h89d7":
      "Xeggex",
  };

  // distribution ranges with labels and colors
  const distributionThresholds = [
    { threshold: 10000000, label: ">10M KLS", color: "#1F3954" },
    { threshold: 1000000, label: ">1M KLS", color: "#213A53" },
    { threshold: 500000, label: ">500K KLS", color: "#445A6F" },
    { threshold: 100000, label: ">100K KLS", color: "#66788A" },
    { threshold: 10000, label: ">10K KLS", color: "#8492A2" },
    { threshold: 1000, label: ">1K KLS", color: "#8C9BA8" },
    { threshold: 100, label: ">100 KLS", color: "#AAB9C5" },
  ];

  // distribution data based on thresholds
  const fetchDistributions = async (totalAddressesCount) => {
    try {
      const distributionData = await Promise.all(
        distributionThresholds.map(({ threshold }) =>
          getAddressDistribution(threshold),
        ),
      );

      const distributions = distributionThresholds.map((item, index) => ({
        ...item,
        value: distributionData[index],
      }));

      const others =
        totalAddressesCount - distributionData[distributionData.length - 1];

      // 'Others'
      distributions.push({
        label: "Others",
        value: others,
        color: "#D9DDE2",
      });

      return distributions;
    } catch (error) {
      throw new Error("Error fetching distribution data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // fetch data in parallel
        const [walletsData, totalAddressesCount] = await Promise.all([
          getTopWallets(),
          getTotalAddresses(),
        ]);

        setWallets(walletsData.sort((a, b) => b.amount - a.amount));
        setTotalAddresses(totalAddressesCount);

        // fetch and set distribution data
        const distributionData = await fetchDistributions(totalAddressesCount);
        setDistributions(distributionData);

        setLoading(false);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // total for chart percentages
  const totalForChart = distributions.reduce(
    (sum, { value }) => sum + value,
    0,
  );

  // prep data for the pie chart
  const chartData = distributions.map(({ label, value, color }) => ({
    title: label,
    value: totalForChart ? (value / totalForChart) * 100 : 0,
    color,
  }));

  return (
    <div className="blocks-page">
      <Container className="webpage px-md-5 blocks-page-overview" fluid>
        <div className="block-overview mb-4">
          <div className="d-flex flex-row w-100">
            <h4 className="block-overview-header text-center w-100 mt-4">
              <FaWallet className="rotate" size="1.7rem" />
              Distribution
            </h4>
          </div>
          <div className="block-overview-content">
            {loading ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              <>
                <div className="blockinfo-summary">
                  <p>Total Addresses: {totalAddresses}</p>
                </div>
                <table className="top-table w-100 mb-4">
                  <thead>
                    <tr>
                      <th>Distribution Range</th>
                      <th align="right">Number of Addresses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributions.map(({ label, value }) => (
                      <tr key={label}>
                        <td>{label}</td>
                        <td align="left">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pie Chart */}
                <div className="d-flex justify-content-center mt-4">
                  <PieChart
                    data={chartData}
                    label={({ dataEntry }) =>
                      `${dataEntry.value.toFixed(2)}% ${dataEntry.title}`
                    }
                    lineWidth={50}
                    paddingAngle={5}
                    radius={pieChartDefaultProps.radius - 10}
                    labelStyle={{
                      fill: "#fff",
                      fontSize: "3px",
                      fontFamily: "sans-serif",
                    }}
                    labelPosition={105}
                    style={{
                      maxHeight: width < 768 ? "250px" : "350px",
                      width: "100%",
                    }}
                    lengthAngle={360}
                  />
                </div>

                {/* Wallets Table */}
                <table className="styled-table w-100 mt-4">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Amount</th>
                      <th>Address</th>
                      <th>Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wallets.map((wallet, index) => (
                      <tr key={wallet.address}>
                        <td>{index + 1}</td>
                        <td>{wallet.amount}&nbsp;KLS</td>
                        <td className="distribution">
                          <Link
                            to={`/addresses/${wallet.address}`}
                            className="blockinfo-link"
                          >
                            {wallet.address}
                          </Link>
                        </td>
                        <td>{addressTags[wallet.address] || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Distribution;
