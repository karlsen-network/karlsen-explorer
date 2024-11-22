import { apiAddress } from "./addresses";

export async function getBlock(hash) {
  const res = await fetch(`https://${apiAddress}/blocks/${hash}`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getTransaction(hash) {
  const res = await fetch(`https://${apiAddress}/transactions/${hash}`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getBlockdagInfo() {
  const res = await fetch(`https://${apiAddress}/info/blockdag`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getKarlsendInfo() {
  const res = await fetch(`https://${apiAddress}/info/karlsend`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getCoinSupply() {
  const res = await fetch(`https://${apiAddress}/info/coinsupply`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getAddressBalance(addr) {
  const res = await fetch(`https://${apiAddress}/addresses/${addr}/balance`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data.balance;
    });
  return res;
}

export async function getAddressTxCount(addr) {
  const res = await fetch(
    `https://${apiAddress}/addresses/${addr}/transactions-count`,
    { headers: { "Access-Control-Allow-Origin": "*" } },
  )
    .then((response) => response.json())
    .then((data) => {
      return data.total;
    });
  return res;
}

export async function getAddressUtxos(addr) {
  const res = await fetch(`https://${apiAddress}/addresses/${addr}/utxos`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getHalving() {
  const res = await fetch(`https://${apiAddress}/info/halving`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getTransactionsFromAddress(addr, limit = 20, offset = 0) {
  const res = await fetch(
    `https://${apiAddress}/addresses/${addr}/full-transactions?limit=${limit}&offset=${offset}`,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
      },
      method: "GET",
    },
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getTransactions(tx_list, inputs, outputs) {
  const res = await fetch(`https://${apiAddress}/transactions/search`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ transactionIds: tx_list }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getTopWallets(limit = 10000, offset = 0) {
  const res = await fetch(
    `https://${apiAddress}/analytics/addresses/top?limit=${limit}&offset=${offset}`,
    {
      headers: { "Access-Control-Allow-Origin": "*" },
    },
  );
  const data = await res.json();
  return data.top_addresses;
}

export async function getTotalAddresses() {
  const res = await fetch(`https://${apiAddress}/analytics/addresses/total`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
  const data = await res.json();
  return data.total_addresses;
}

export async function getAddressDistribution(minAmount, maxAmount = -1) {
  const res = await fetch(
    `https://${apiAddress}/analytics/addresses/distribution?min_amount=${minAmount}&max_amount=${maxAmount}`,
    {
      headers: { "Access-Control-Allow-Origin": "*" },
    },
  );
  const data = await res.json();
  return data.from_addresses_total;
}

export async function getWalletsInRange(minAmount, maxAmount) {
  const res = await fetch(
    `https://${apiAddress}/analytics/addresses/range?min_amount=${minAmount}&max_amount=${maxAmount}`,
    {
      headers: { "Access-Control-Allow-Origin": "*" },
    },
  );
  const data = await res.json();
  return data;
}
