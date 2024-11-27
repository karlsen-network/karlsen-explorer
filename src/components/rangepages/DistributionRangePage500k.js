import { useEffect, useState, useMemo } from "react";
import { Spinner, Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getWalletsInRange } from "../../karlsen-api-client";
import UtxoPagination from "../UtxoPagination";
import addressTags from "../addressTags";

const WALLETS_PER_PAGE = 100;

const DistributionRangePage500k = () => {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageError, setPageError] = useState(false);

  const totalPages = useMemo(
    () => Math.ceil(wallets.length / WALLETS_PER_PAGE),
    [wallets],
  );

  const paginatedWallets = useMemo(() => {
    const startIndex = (currentPage - 1) * WALLETS_PER_PAGE;
    return wallets.slice(startIndex, startIndex + WALLETS_PER_PAGE);
  }, [wallets, currentPage]);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoading(true);

        // Fetch wallets within the range 500K to 1m
        const walletsData = await getWalletsInRange(500000, 1000000);
        setWallets(walletsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching range:", error);
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

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

  return (
    <div className="blocks-page">
      <Container className="webpage px-md-5 blocks-page-overview" fluid>
        <div className="block-overview mb-4">
          <div className="d-flex flex-row w-100">
            <h4 className="block-overview-header text-center w-100 mt-4">
              <FaWallet className={loading ? "rotate" : ""} size="1.7rem" />{" "}
              500K to 1m KLS
            </h4>
          </div>
          <div className="block-overview-content">
            {loading ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              <>
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
                      <tr
                        key={wallet.address}
                        onClick={() => navigate(`/addresses/${wallet.address}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>
                          {(currentPage - 1) * WALLETS_PER_PAGE + index + 1}
                        </td>
                        <td>{wallet.amount} KLS</td>
                        <td>{wallet.percent}%</td>
                        <td>{wallet.address}</td>
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

export default DistributionRangePage500k;
