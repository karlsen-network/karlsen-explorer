import { useEffect, useState } from "react";
import { Spinner, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import {
  getTopWallets,
  getTotalAddresses,
  getAddressDistribution,
} from "../karlsen-api-client";

const Distribution = () => {
  const [wallets, setWallets] = useState([]);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const [distributions, setDistributions] = useState({
    moreThan1M: 0,
    moreThan100k: 0,
    moreThan10k: 0,
    moreThan1k: 0,
    others: 0,
  });
  const [loading, setLoading] = useState(true);

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
        const moreThan100k = await getAddressDistribution(100000);
        const moreThan10k = await getAddressDistribution(10000);
        const moreThan1k = await getAddressDistribution(1000);
        const others = totalAddressesCount - moreThan1k;

        setDistributions({
          moreThan1M,
          moreThan100k,
          moreThan10k,
          moreThan1k,
          others,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="blocks-page">
      <Container className="webpage px-md-5 blocks-page-overview" fluid>
        <div className="block-overview mb-4">
          <div className="d-flex flex-row w-100">
            <h4 className="block-overview-header text-center w-100 mt-4">
              <FaWallet size="1.7rem" />
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
                      <td>{">"}1M coins</td>
                      <td align="left">{distributions.moreThan1M}</td>
                    </tr>
                    <tr>
                      <td>{">"}100k coins</td>
                      <td align="left">{distributions.moreThan100k}</td>
                    </tr>
                    <tr>
                      <td>{">"}10k coins</td>
                      <td align="left">{distributions.moreThan10k}</td>
                    </tr>
                    <tr>
                      <td>{">"}1k coins</td>
                      <td align="left">{distributions.moreThan1k}</td>
                    </tr>
                    <tr>
                      <td>Others</td>
                      <td align="left">{distributions.others}</td>
                    </tr>
                  </tbody>
                </table>

                <table className="styled-table w-100">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Amount</th>
                      <th>Address</th>
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
