require("dotenv").config();
const bs58 = require("bs58");
const fetch = require("node-fetch");
const {
  Connection,
  Keypair,
  VersionedTransaction,
} = require("@solana/web3.js");

const bearerToken = process.env.API_KEY;
const base58EncodedSecretKey = process.env.SENDER_PRIVATE_KEY;
const secretKeyUint8Array = bs58.decode(base58EncodedSecretKey);
const senderKeypair = Keypair.fromSecretKey(secretKeyUint8Array);
const connection = new Connection(process.env.RPC_URL, "confirmed");

/**
 * Fetches serialized transaction data from the given endpoint.
 * @param {string} endpoint - The API endpoint URL.
 * @returns {Promise<Object>} The transaction data.
 */
async function fetchTxData(endpoint) {
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch transaction data: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Sends a transaction to bid on a Solana NFT on Magic Eden.
 * @param {Object} params - The transaction parameters.
 * @param {string} params.buyerAddress - The buyer's address.
 * @param {string} params.tokenMintAddress - The token mint address.
 * @param {number} params.price - The bidding price.
 * @param {string} params.auctionHouseAddress - The auction house address.
 */
const sendBidTx = async ({
  buyerAddress,
  tokenMintAddress,
  price,
  auctionHouseAddress,
}) => {
  try {
    const baseUrl = "https://api-mainnet.magiceden.dev/v2/instructions/buy";
    const endpointUrl = `${baseUrl}?buyer=${buyerAddress}&tokenMint=${tokenMintAddress}&price=${price}&auctionHouseAddress=${auctionHouseAddress}`;

    const txData = await fetchTxData(endpointUrl);
    const serializedTxData = new Uint8Array(txData.txSigned.data);
    const tx = VersionedTransaction.deserialize(serializedTxData);
    tx.sign([senderKeypair]);

    const txId = await connection.sendTransaction(tx);
    await connection.confirmTransaction({
      signature: txId,
      blockhash: txData.blockhashData.blockhash,
      lastValidBlockHeight: txData.blockhashData.lastValidBlockHeight,
    });

    console.log(`Transaction sent. Signature: ${txId}`);
  } catch (error) {
    console.error(`Error sending bid transaction: ${error.message}`);
  }
};

// Example usage:
sendBidTx({
  buyerAddress: "Wwj2i5ZFGp9aVvwjCa7KqRcwUk2Rbww871SqcB4rkJ2",
  tokenMintAddress: "D7Hc5wXkWbsv1QKfmtAqM1Br5yYFKW6mQhHUQfxNYcaP",
  price: 0.005,
  auctionHouseAddress: "E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe",
});
