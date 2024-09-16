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
  const [distributions, setDistributions] = useState({
    moreThan1M: 0,
    moreThan500k: 0,
    moreThan100k: 0,
    moreThan10k: 0,
    moreThan1k: 0,
    moreThan100: 0,
    others: 0,
  });

  const [loading, setLoading] = useState(true);
  const { width } = useWindowSize();

  // define the address to tag mapping as a const (current ones are for testing)
  const addressTags = {
    "karlsen:qrdn0eyzyc2z4leqwgxcngt98su5gq4p47gz435q8mu2wh8c78502qlfquvnj":
      "Mexc",
    "karlsen:qzmf98x2k50txs0ljctwmshsztfyedy54mpa2ndz0lhj8pdfwwhgun66h89d7":
      "Xeggex",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // top wallets
        const walletsData = await getTopWallets();
        setWallets(walletsData.sort((a, b) => b.amount - a.amount));

        // total number of addresses
        const totalAddressesCount = await getTotalAddresses();
        setTotalAddresses(totalAddressesCount);

        // distribution data
        const moreThan1M = await getAddressDistribution(1000000);
        const moreThan500k = await getAddressDistribution(500000);
        const moreThan100k = await getAddressDistribution(100000);
        const moreThan10k = await getAddressDistribution(10000);
        const moreThan1k = await getAddressDistribution(1000);
        const moreThan100 = await getAddressDistribution(100);
        const others = totalAddressesCount - moreThan100;

        setDistributions({
          moreThan1M,
          moreThan500k,
          moreThan100k,
          moreThan10k,
          moreThan1k,
          moreThan100,
          others,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // data for the pie chart
  const totalForChart =
    distributions.moreThan1M +
    distributions.moreThan500k +
    distributions.moreThan100k +
    distributions.moreThan10k +
    distributions.moreThan1k +
    distributions.moreThan100 +
    distributions.others;

  const chartData = [
    {
      title: "> 1M KLS",
      value: (distributions.moreThan1M / totalForChart) * 100,
      color: "#213A53",
    },
    {
      title: "> 500K KLS",
      value: (distributions.moreThan500k / totalForChart) * 100,
      color: "#445A6F",
    },
    {
      title: "> 100K KLS",
      value: (distributions.moreThan100k / totalForChart) * 100,
      color: "#66788A",
    },
    {
      title: "> 10K KLS",
      value: (distributions.moreThan10k / totalForChart) * 100,
      color: "#8492A2",
    },
    {
      title: "> 1K KLS",
      value: (distributions.moreThan1k / totalForChart) * 100,
      color: "#8C9BA8",
    },
    {
      title: "> 100 KLS",
      value: (distributions.moreThan100 / totalForChart) * 100,
      color: "#AAB9C5",
    },
    {
      title: "Others",
      value: (distributions.others / totalForChart) * 100,
      color: "#D9DDE2",
    },
  ];

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
                <table className="styled-table w-100 mb-4">
                  <thead>
                    <tr>
                      <th>Distribution Range</th>
                      <th align="right">Number of Addresses</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{">"}1M KLS</td>
                      <td align="left">{distributions.moreThan1M}</td>
                    </tr>
                    <tr>
                      <td>{">"}500k KLS</td>
                      <td align="left">{distributions.moreThan500k}</td>
                    </tr>
                    <tr>
                      <td>{">"}100k KLS</td>
                      <td align="left">{distributions.moreThan100k}</td>
                    </tr>
                    <tr>
                      <td>{">"}10k KLS</td>
                      <td align="left">{distributions.moreThan10k}</td>
                    </tr>
                    <tr>
                      <td>{">"}1k KLS</td>
                      <td align="left">{distributions.moreThan1k}</td>
                    </tr>
                    <tr>
                      <td>{">"}100 KLS</td>
                      <td align="left">{distributions.moreThan100}</td>
                    </tr>
                    <tr>
                      <td>Others</td>
                      <td align="left">{distributions.others}</td>
                    </tr>
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
