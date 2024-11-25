import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Nav,
  Navbar,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { BiDonateHeart } from "react-icons/bi";
import { FaGithub } from "react-icons/fa";
import { SiFastapi } from "react-icons/si";
import { useLocation, useNavigate } from "react-router";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import "react-toggle/style.css";
import io from "socket.io-client";
import "./App.scss";
import AddressInfoPage from "./components/AddressInfo";
import BlockInfo from "./components/BlockInfo";
import BlocksPage from "./components/BlocksPage";
import BlueScoreContext from "./components/BlueScoreContext";
import LastBlocksContext from "./components/LastBlocksContext";
import NotFound from "./components/NotFound";
import PriceContext from "./components/PriceContext";
import TransactionInfo from "./components/TransactionInfo";
import TxPage from "./components/TxPage";
import Dashboard from "./Dashboard";
import Distribution from "./components/Distribution";
import { getBlock } from "./karlsen-api-client";
import { apiAddress } from "./addresses";
import DistributionRangePage10m from "./components/rangepages/DistributionRangePage10m";
import DistributionRangePage1m from "./components/rangepages/DistributionRangePage1m";
import DistributionRangePage500k from "./components/rangepages/DistributionRangePage500k";
import DistributionRangePage100k from "./components/rangepages/DistributionRangePage100k";
import DistributionRangePage10k from "./components/rangepages/DistributionRangePage10k";
import DistributionRangePage1k from "./components/rangepages/DistributionRangePage1k";
import DistributionRangePage100 from "./components/rangepages/DistributionRangePage100";
import DistributionRangePage1 from "./components/rangepages/DistributionRangePage1";

const buildVersion = process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA || "xxxxxx";

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("scroll", function () {
    if (window.location.pathname === "/") {
      if (window.scrollY > 200) {
        document.getElementById("navbar_top").classList.add("fixed-top");
      } else {
        document.getElementById("navbar_top").classList.remove("fixed-top");
      }
    }
  });
});

const socket = io(`wss://${apiAddress}`, {
  path: "/ws/socket.io",
});

function App() {
  const [price, setPrice] = useState("");
  const [marketData, setMarketData] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [blueScore, setBlueScore] = useState(0);
  const [isConnected, setIsConnected] = useState();

  const location = useLocation();
  const navigate = useNavigate();

  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

  const search = async (e) => {
    e.preventDefault();
    const v = e.target.searchbox.value;

    if (v.length === 64) {
      getBlock(v)
        .then((data) => {
          if (data.detail === "Block not found") {
            navigate(`/txs/${v}`);
          } else {
            navigate(`/blocks/${v}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (v.startsWith("karlsen:")) {
      navigate(`/addresses/${v}`);
    }

    e.target.searchbox.value = "";
  };

  const updatePrice = () => {
    fetch(`https://${apiAddress}/info/market-data`, {
      headers: { "Cache-Control": "no-cache" },
    })
      .then((response) => response.json())
      .then((data) => {
        setPrice(data["current_price"]["usd"].toFixed(4));
        setMarketData(data);
      })
      .catch((r) => console.log(r));
  };

  useEffect(() => {
    updatePrice();

    const intervalPrice = setInterval(() => {
      updatePrice();
    }, 60000);

    // socketio
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("last-blocks", (e) => {
      setBlocks(e);
      socket.emit("join-room", "blocks");
    });

    socket.emit("last-blocks", "");

    socket.on("bluescore", (e) => {
      setBlueScore(e.blueScore);
    });
    console.log("join room bluescore");
    socket.emit("join-room", "bluescore");

    socket.on("new-block", (d) => {
      setBlocks([...blocksRef.current, d].slice(-20));
    });

    return () => {
      clearInterval(intervalPrice);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new-block");
      socket.off("last-blocks");
      socket.off("bluescore");
    };
  }, []);

  const closeMenuIfNeeded = () => {
    if (
      document
        .getElementById("responsive-navbar-nav")
        .classList.contains("show")
    ) {
      document.getElementsByClassName("navbar-toggler")[0].click();
    }
  };

  return (
    <LastBlocksContext.Provider value={{ blocks, isConnected }}>
      <PriceContext.Provider value={{ price, marketData }}>
        <BlueScoreContext.Provider value={{ blueScore }}>
          <div className="big-page">
            <Navbar
              expand="md"
              bg="dark"
              variant="dark"
              sticky="top"
              id="navbar_top"
              className={location.pathname === "/" ? "" : "fixed-top"}
            >
              <Container id="navbar-container" fluid>
                <div className="navbar-title">
                  <Navbar.Brand>
                    <Link to="/">
                      <div className="navbar-brand">
                        <img
                          className="shake"
                          src="/k-icon-glow.png"
                          alt=""
                          style={{
                            marginRight: ".5rem",
                            width: "4rem",
                            height: "4rem",
                          }}
                        />
                        <div className="navbar-brand-text text-start">
                          KARLSEN
                          <br />
                          EXPLORER
                        </div>
                      </div>
                    </Link>
                  </Navbar.Brand>
                </div>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto">
                    <Nav.Item>
                      <NavLink
                        className="nav-link fs-5"
                        onClick={closeMenuIfNeeded}
                        to={"/"}
                      >
                        Dashboard
                      </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                      <NavLink
                        className="nav-link fs-5"
                        onClick={closeMenuIfNeeded}
                        to={"/blocks"}
                      >
                        Blocks
                      </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                      <NavLink
                        className="nav-link fs-5"
                        onClick={closeMenuIfNeeded}
                        to={"/txs"}
                      >
                        Transactions
                      </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                      <NavLink
                        className="nav-link fs-5"
                        onClick={closeMenuIfNeeded}
                        to={"/distribution"}
                      >
                        Distribution
                      </NavLink>
                    </Nav.Item>
                  </Nav>
                  <div className="ms-auto navbar-price">
                    ${price} <span className="text-light">/ KLS</span>
                  </div>
                </Navbar.Collapse>
              </Container>
            </Navbar>
            <div className="search-row">
              <Container className="webpage" hidden={location.pathname === "/"}>
                <Row>
                  <Col xs={12}>
                    <Form onSubmit={search} className="">
                      <InputGroup className="mt-4 mb-4 search-box-group">
                        <Form.Control
                          className="d-inline-block bg-light text-dark shadow-none"
                          name="searchbox"
                          id="search-box-high"
                          type="text"
                          placeholder="Search for karlsen:address or block"
                        />
                        <Button
                          type="submit"
                          className="shadow-none searchButton"
                          variant="dark"
                        >
                          <i className="fa fa-search" />
                        </Button>
                      </InputGroup>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </div>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/blocks" element={<BlocksPage />} />
              <Route path="/blocks/:id" element={<BlockInfo />} />
              <Route path="/blocks/:id/:txview" element={<BlockInfo />} />
              <Route path="/distribution" element={<Distribution />} />
              <Route path="/addresses/:addr" element={<AddressInfoPage />} />
              <Route path="/txs" element={<TxPage />} />
              <Route path="/txs/:id" element={<TransactionInfo />} />

              <Route path="/range/10m" element={<DistributionRangePage10m />} />
              <Route path="/range/1m" element={<DistributionRangePage1m />} />
              <Route
                path="/range/500k"
                element={<DistributionRangePage500k />}
              />
              <Route
                path="/range/100k"
                element={<DistributionRangePage100k />}
              />
              <Route path="/range/10k" element={<DistributionRangePage10k />} />
              <Route path="/range/1k" element={<DistributionRangePage1k />} />
              <Route path="/range/100" element={<DistributionRangePage100 />} />
              <Route path="/range/1" element={<DistributionRangePage1 />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <div className="text-light footerfull d-flex flex-row justify-content-center px-0">
            <Container
              className="footer webpage px-sm-5 py-3 text-center madewith"
              fluid
            >
              <Row className="d-none d-sm-block">
                <Col>
                  Made with{" "}
                  <font className="fs-5" color="red">
                    ♥
                  </font>{" "}
                  by Kaspa and Karlsen developers
                  <span className="ms-3">
                    <OverlayTrigger
                      placement="left"
                      overlay={<Tooltip id="github">Source code</Tooltip>}
                    >
                      <a
                        className="blockinfo-link"
                        href="https://github.com/karlsen-network/karlsen-explorer"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaGithub size="1.3rem" />
                      </a>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="right"
                      overlay={<Tooltip id="donate">Donation address</Tooltip>}
                    >
                      <Link
                        className="blockinfo-link ms-3"
                        to="/addresses/karlsen:qqe3p64wpjf5y27kxppxrgks298ge6lhu6ws7ndx4tswzj7c84qkjlrspcuxw"
                      >
                        <BiDonateHeart size="1.3rem" />
                      </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="right"
                      overlay={<Tooltip id="github">REST-API server</Tooltip>}
                    >
                      <a
                        className="blockinfo-link ms-3"
                        href={`https://${apiAddress}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiFastapi size="1.3rem" />
                      </a>
                    </OverlayTrigger>
                  </span>
                  <span className="px-3 build">|</span>
                  <span className="build">
                    Build version: {buildVersion.substring(0, 8)}
                  </span>
                </Col>
              </Row>
              <Row className="d-sm-none px-0">
                <Col className="px-0">
                  Made with{" "}
                  <font className="fs-5" color="red">
                    ♥
                  </font>{" "}
                  by Kaspa and Karlsen developers
                </Col>
              </Row>
              <Row className="py-1 d-sm-none px-0">
                <Col>
                  <span className="ms-2">
                    <OverlayTrigger
                      placement="left"
                      overlay={<Tooltip id="github">Source code</Tooltip>}
                    >
                      <a
                        className="blockinfo-link"
                        href="https://github.com/karlsen-network/karlsen-explorer"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaGithub size="1.1rem" />
                      </a>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="right"
                      overlay={<Tooltip id="donate">Donation address</Tooltip>}
                    >
                      <Link
                        className="blockinfo-link ms-2"
                        to="/addresses/karlsen:qqe3p64wpjf5y27kxppxrgks298ge6lhu6ws7ndx4tswzj7c84qkjlrspcuxw"
                      >
                        <BiDonateHeart size="1.1rem" />
                      </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="right"
                      overlay={<Tooltip id="github">REST-API server</Tooltip>}
                    >
                      <a
                        className="blockinfo-link ms-2"
                        href={`https://${apiAddress}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiFastapi size="1.1rem" />
                      </a>
                    </OverlayTrigger>
                  </span>
                </Col>
              </Row>
              <Row className="d-sm-none px-0">
                <Col>
                  <span className="build">
                    Build version: {buildVersion.substring(0, 8)}
                  </span>
                </Col>
              </Row>
            </Container>
          </div>
        </BlueScoreContext.Provider>
      </PriceContext.Provider>
    </LastBlocksContext.Provider>
  );
}

export default App;
