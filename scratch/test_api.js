async function check() {
  const url1 = `https://celo-alfajores.blockscout.com/api?module=account&action=tokentx&address=0x78bf048E450Ec94cB055C8ab180CA27c912e975e`;
  const url2 = `https://celo-alfajores.blockscout.com/api?module=account&action=tokennfttx&address=0x48Bd564c86e379D08D5b536c766b65b966548Ab1`;

  try {
    const res1 = await fetch(url1);
    const data1 = await res1.json();
    console.log(`Pool fallback length: ${data1.result.length}`);

    const res2 = await fetch(url2);
    const data2 = await res2.json();
    console.log(`NFT fallback length: ${data2.result.length}`);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}
check();
