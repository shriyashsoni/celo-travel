async function getFailedTxs() {
  const url = 'https://celo-alfajores.blockscout.com/api?module=account&action=txlist&address=0x3CAb3d9b205DBc5dB656c16743fc88C301d0ad6A&page=1&offset=10&sort=desc';
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === "1") {
      const txs = data.result.filter(tx => tx.isError === "1");
      console.log(`Found ${txs.length} failed txs`);
    } else {
      console.log("No txs found or error", data);
    }
  } catch (e) {
    console.log("Error:", e);
  }
}
getFailedTxs();
