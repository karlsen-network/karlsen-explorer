import { useEffect, useState } from "react";
import { Spinner, Container } from "react-bootstrap";
import { FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getWalletsInRange } from "../../karlsen-api-client";
import addressTags from "../addressTags";

const DistributionRangePage500k = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

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
                  {wallets.map((wallet, index) => (
                    <tr key={wallet.address}>
                      <td>{index + 1}</td>
                      <td>{wallet.amount} KLS</td>
                      <td>{wallet.percent}%</td>
                      <td>
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
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DistributionRangePage500k;
