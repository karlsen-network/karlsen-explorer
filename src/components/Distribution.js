import { useEffect, useState, useCallback, useMemo } from "react";
import { Spinner, Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import { PieChart, pieChartDefaultProps } from "react-minimal-pie-chart";
import { useWindowSize } from "react-use";
import {
  getTopWallets,
  getTotalAddresses,
  getAddressDistribution,
} from "../karlsen-api-client";
import UtxoPagination from "./UtxoPagination";
import addressTags from "./addressTags";

const WALLETS_PER_PAGE = 100;

const Distribution = () => {
  const [wallets, setWallets] = useState([]);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageError, setPageError] = useState(false);

  const { width } = useWindowSize();

  const totalPages = useMemo(
    () => Math.ceil(wallets.length / WALLETS_PER_PAGE),
    [wallets],
  );

  const paginatedWallets = useMemo(() => {
    const startIndex = (currentPage - 1) * WALLETS_PER_PAGE;
    return wallets.slice(startIndex, startIndex + WALLETS_PER_PAGE);
  }, [wallets, currentPage]);

  const distributionRanges = useMemo(
    () => [
      {
        min: 10000000,
        max: -1,
        label: "10M+ KLS",
        color: "#1F3954",
        link: "/range/10m",
      },
      {
        min: 1000000,
        max: 10000000,
        label: "1M - 10M KLS",
        color: "#213A53",
        link: "/range/1m",
      },
      {
        min: 500000,
        max: 1000000,
        label: "500K - 1M KLS",
        color: "#445A6F",
        link: "/range/500k",
      },
      {
        min: 100000,
        max: 500000,
        label: "100K - 500K KLS",
        color: "#66788A",
        link: "/range/100k",
      },
      {
        min: 10000,
        max: 100000,
        label: "10K - 100K KLS",
        color: "#8492A2",
        link: "/range/10k",
      },
      {
        min: 1000,
        max: 10000,
        label: "1K - 10K KLS",
        color: "#8C9BA8",
        link: "/range/1k",
      },
      {
        min: 100,
        max: 1000,
        label: "100 - 1K KLS",
        color: "#AAB9C5",
        link: "/range/100",
      },
      {
        min: 1,
        max: 100,
        label: "1 - 100 KLS",
        color: "#D9DDE2",
        link: "/range/1",
      },
    ],
    [],
  );

  // distribution data based on thresholds
  const fetchDistributions = useCallback(
    async (totalAddressesCount) => {
      try {
        const distributionData = await Promise.all(
          distributionRanges.map(({ min, max }) =>
            getAddressDistribution(min, max),
          ),
        );

        const distributions = distributionRanges.map((item, index) => ({
          ...item,
          value: distributionData[index],
        }));

        return distributions;
      } catch (error) {
        throw new Error("Error fetching distribution data");
      }
    },
    [distributionRanges],
  );

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
  }, [fetchDistributions]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageError(false);
    } else {
      setPageError(true);
    }
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const pageNo = parseInt(e.target.pageNo.value, 10);
    handlePageChange(pageNo);
  };

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
              <FaWallet className={loading ? "rotate" : ""} size="1.7rem" />{" "}
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
                    {distributions.map(({ label, value, link }) => (
                      <tr key={label}>
                        <td>
                          <Link to={link} className="blockinfo-link">
                            {label}
                          </Link>
                        </td>
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
                      <th>Supply</th>
                      <th>Address</th>
                      <th>Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedWallets.map((wallet, index) => (
                      <tr key={wallet.address}>
                        <td>
                          {(currentPage - 1) * WALLETS_PER_PAGE + index + 1}
                        </td>
                        <td>{wallet.amount}&nbsp;KLS</td>
                        <td>{wallet.percent}%</td>
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

                <Row className="mt-4">
                  <Col
                    xs={12}
                    sm={6}
                    className="d-flex flex-row justify-content-center mb-3 mb-sm-0"
                  >
                    <div className="me-auto">
                      <Form onSubmit={handleGoToPage} className="d-flex">
                        <Form.Control
                          type="text"
                          name="pageNo"
                          placeholder="Page"
                          className={`me-2 ${pageError ? "is-invalid" : ""}`}
                          style={{ width: "80px" }}
                        />
                        <Button type="submit" variant="dark">
                          Go
                        </Button>
                      </Form>
                    </div>
                  </Col>
                  <Col
                    xs={12}
                    sm={6}
                    className="d-flex flex-row justify-content-end"
                  >
                    <UtxoPagination
                      active={currentPage}
                      total={totalPages}
                      setActive={handlePageChange}
                    />
                  </Col>
                </Row>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Distribution;
