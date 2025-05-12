// ABI for EnergyTrading Smart Contract
const contractAddress = "0xF4990e33c13b5BB917E756C86Fce0e3D886D8502"; // Replace with your deployed contract address

const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "energyAmountWh",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "pricePerWhWei",
                "type": "uint256"
            }
        ],
        "name": "EnergyListed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "energyAmountWh",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalCost",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "remainingBalance",
                "type": "uint256"
            }
        ],
        "name": "EnergyPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newPricePerWhWei",
                "type": "uint256"
            }
        ],
        "name": "PriceUpdated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_listingId", "type": "uint256"},
            {"internalType": "uint256", "name": "_amountWh", "type": "uint256"}
        ],
        "name": "buyEnergy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimTestETH",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "energyListings",
        "outputs": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "address payable", "name": "seller", "type": "address"},
            {"internalType": "uint256", "name": "energyAmountWh", "type": "uint256"},
            {"internalType": "uint256", "name": "pricePerWhWei", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_listingId", "type": "uint256"}],
        "name": "getTransactionHistory",
        "outputs": [
            {
                "components": [
                    {"internalType": "address", "name": "buyer", "type": "address"},
                    {"internalType": "uint256", "name": "energyBoughtWh", "type": "uint256"},
                    {"internalType": "uint256", "name": "amountPaid", "type": "uint256"},
                    {"internalType": "uint256", "name": "remainingBalance", "type": "uint256"}
                ],
                "internalType": "struct EnergyTrading.Transaction[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
        "name": "getUserBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
        "name": "getUserEnergyUsage",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_energyAmountWh", "type": "uint256"},
            {"internalType": "uint256", "name": "_pricePerKWhMilliEther", "type": "uint256"}
        ],
        "name": "listEnergy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "listingCounter",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_listingId", "type": "uint256"},
            {"internalType": "uint256", "name": "_newPricePerKWhMilliEther", "type": "uint256"}
        ],
        "name": "updatePrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_listingId", "type": "uint256"}],
        "name": "checkListingExpiration",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_listingId", "type": "uint256"}],
        "name": "getListingExpirationTime",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

export { contractAddress, contractABI };

// Web3 integration for EnergyTrading dApp

// Connect to Web3 provider (MetaMask)
let web3;
let energyContract;
let currentAccount;

// Initialize web3
async function init() {
    // Modern browsers with MetaMask
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            console.log("Web3 instance created using window.ethereum");
            
            // Try to connect automatically if previously connected
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                currentAccount = accounts[0];
                await setupContract();
                updateUI();
            }
        } catch (error) {
            console.error("Error initializing web3:", error);
            alert("Failed to connect to Ethereum. Please ensure MetaMask is installed and configured correctly.");
            return;
        }
    } else {
        alert("Please install MetaMask to use this dApp!");
        return;
    }

    // Set up listeners for network change
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', async (accounts) => {
            console.log('Account changed:', accounts[0]);
            currentAccount = accounts[0];
            await updateUI();
        });
        
        window.ethereum.on('chainChanged', (chainId) => {
            console.log('Network changed:', chainId);
            window.location.reload();
        });
    }

    setupEventListeners();
}

// Setup contract instance
async function setupContract() {
    try {
        if (contractAddress) {
            energyContract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contract initialized at:", contractAddress);
        } else {
            console.error("No contract address specified");
            alert("Contract address not specified. Please deploy the contract and update the address in contractABI.js");
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error initializing contract:", error);
        alert("Failed to initialize the smart contract. Please check the contract address and ABI.");
        return false;
    }
}

// Connect wallet button
async function connectWallet() {
    try {
        // Request account access if needed
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        console.log("Connected account:", currentAccount);
        
        // Check if we're on Sepolia network
        const chainId = await web3.eth.getChainId();
        if (chainId !== 11155111) { // Sepolia chain ID
            alert("Please connect to Sepolia Test Network in MetaMask");
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID in hex
                });
            } catch (switchError) {
                console.error("Failed to switch to Sepolia network:", switchError);
            }
        }
        
        await setupContract();
        await updateUI();
        
        return true;
    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet. Please ensure MetaMask is installed and unlock your wallet.");
        return false;
    }
}

// Setup event listeners for form submissions and buttons
function setupEventListeners() {
    // Connect wallet button
    document.getElementById('connect-wallet').addEventListener('click', connectWallet);
    
    // Claim test ETH button
    document.getElementById('claim-eth').addEventListener('click', claimTestETH);
    
    // List energy form submission
    document.getElementById('list-energy-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        if (!currentAccount) {
            alert("Please connect your wallet first");
            return;
        }
        
        const energyAmount = document.getElementById('energy-amount').value;
        const pricePerKwh = document.getElementById('price-per-kwh').value;
        
        await listEnergy(energyAmount, pricePerKwh);
    });
}

// Claim test ETH function
async function claimTestETH() {
    if (!currentAccount) {
        const connected = await connectWallet();
        if (!connected) return;
    }
    
    try {
        const oldBalance = await web3.eth.getBalance(currentAccount);
        await energyContract.methods.claimTestETH().send({ from: currentAccount });
        const newBalance = await web3.eth.getBalance(currentAccount);
        
        await updateBalanceDisplay(currentAccount, web3.utils.fromWei(newBalance, 'ether'));
        alert("Test ETH claimed successfully!");
    } catch (error) {
        console.error("Error claiming test ETH:", error);
        alert("Failed to claim test ETH: " + error.message);
    }
}

// List energy function
async function listEnergy(energyAmount, pricePerKwh) {
    if (!energyAmount || !pricePerKwh) {
        alert("Please enter both energy amount and price");
        return;
    }
    
    try {
        const oldBalance = await web3.eth.getBalance(currentAccount);
        await energyContract.methods.listEnergy(energyAmount, pricePerKwh)
            .send({ from: currentAccount });
        const newBalance = await web3.eth.getBalance(currentAccount);
        
        await updateBalanceDisplay(currentAccount, web3.utils.fromWei(newBalance, 'ether'));
        alert("Energy listed successfully!");
        document.getElementById('list-energy-form').reset();
        await updateUI();
    } catch (error) {
        console.error("Error listing energy:", error);
        alert("Failed to list energy: " + error.message);
    }
}

// Buy energy function
async function buyEnergy(listingId) {
    try {
        // Get listing details before purchase
        const listing = await energyContract.methods.energyListings(listingId).call();
        const seller = listing.seller;
        
        // Get balances before transaction
        const oldBuyerBalance = await web3.eth.getBalance(currentAccount);
        const oldSellerBalance = await web3.eth.getBalance(seller);
        
        // Execute the purchase transaction
        const transaction = await energyContract.methods.buyEnergy(listingId)
            .send({ from: currentAccount });
        
        // Get balances after transaction
        const newBuyerBalance = await web3.eth.getBalance(currentAccount);
        const newSellerBalance = await web3.eth.getBalance(seller);
        
        // Update balances in UI
        await updateBalanceDisplay(currentAccount, web3.utils.fromWei(newBuyerBalance, 'ether'));
        await updateBalanceDisplay(seller, web3.utils.fromWei(newSellerBalance, 'ether'));
        
        // Update transaction history
        await updateTransactionHistory();
        
        alert("Energy purchased successfully!");
    } catch (error) {
        console.error("Error buying energy:", error);
        alert("Failed to buy energy: " + error.message);
    }
}

// Update balance display function
async function updateBalanceDisplay(address, balance) {
    // Update main balance display if it's the current user
    if (address.toLowerCase() === currentAccount.toLowerCase()) {
        const balanceElement = document.getElementById('account-balance');
        if (balanceElement) {
            balanceElement.textContent = parseFloat(balance).toFixed(4);
        }
    }
    
    // Update balance in the listings table
    const addressCells = document.querySelectorAll('.seller-address');
    addressCells.forEach(cell => {
        if (cell.textContent.toLowerCase().includes(address.toLowerCase())) {
            const balanceCell = cell.parentElement.querySelector('.seller-balance');
            if (balanceCell) {
                balanceCell.textContent = parseFloat(balance).toFixed(4) + ' ETH';
            }
        }
    });
}

// Update transaction history
async function updateTransactionHistory() {
    try {
        const listingCounter = await energyContract.methods.listingCounter().call();
        const transactionsList = document.getElementById('transactions-list');
        if (!transactionsList) return;

        transactionsList.innerHTML = '';

        for (let i = 1; i <= listingCounter; i++) {
            try {
                const txDetails = await energyContract.methods.getTransactionHistory(i).call();
                if (txDetails.buyer !== '0x0000000000000000000000000000000000000000') {
                    const listItem = document.createElement('div');
                    listItem.className = 'transaction-item';
                    
                    const buyerBalance = await web3.eth.getBalance(txDetails.buyer);
                    const buyerBalanceEth = web3.utils.fromWei(buyerBalance, 'ether');
                    
                    listItem.innerHTML = `
                        <div class="transaction-details">
                            <div>
                                <p>Transaction #${i}</p>
                                <p>Buyer: <span class="address-display">${txDetails.buyer.substring(0, 6)}...${txDetails.buyer.substring(38)}</span></p>
                                <p>Current Balance: <span class="balance-change">${parseFloat(buyerBalanceEth).toFixed(4)} ETH</span></p>
                            </div>
                            <div>
                                <p>Energy: ${txDetails.energyBoughtWh} Wh</p>
                                <p>Amount Paid: ${web3.utils.fromWei(txDetails.amountPaid, 'ether')} ETH</p>
                            </div>
                        </div>
                    `;
                    transactionsList.appendChild(listItem);
                }
            } catch (error) {
                console.error(`Error fetching transaction ${i}:`, error);
            }
        }
    } catch (error) {
        console.error("Error updating transaction history:", error);
    }
}

// Function to display user's energy holdings
async function updateEnergyHoldings() {
    try {
        const holdingsContainer = document.getElementById('energy-holdings');
        if (!holdingsContainer) return;

        // Get user's total energy balance
        const energyBalance = await energyContract.methods.getUserEnergyBalance(currentAccount).call();
        
        // Create holdings display
        holdingsContainer.innerHTML = `
            <div class="holdings-card">
                <h3>Your Energy Holdings</h3>
                <p>Total Energy Balance: <span class="energy-amount">${energyBalance} Wh</span></p>
            </div>
        `;
    } catch (error) {
        console.error("Error updating energy holdings:", error);
    }
}

// Function to format time remaining
function formatTimeRemaining(expirationTime) {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = expirationTime - now;
    
    if (timeLeft <= 0) return "Expired";
    
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    return `${hours}h ${minutes}m remaining`;
}

// Enhanced updateEnergyListings function
async function updateEnergyListings() {
    try {
        const listingCounter = await energyContract.methods.listingCounter().call();
        const listingsContainer = document.getElementById('listings-container');
        if (!listingsContainer) return;

        listingsContainer.innerHTML = `
            <h2>Energy Market</h2>
            <div class="listings-grid">
                <div class="active-listings">
                    <h3>Available Energy Listings</h3>
                    <div id="active-listings-container"></div>
                </div>
                <div class="my-listings">
                    <h3>My Listings</h3>
                    <div id="my-listings-container"></div>
                </div>
            </div>
        `;

        const activeListingsContainer = document.getElementById('active-listings-container');
        const myListingsContainer = document.getElementById('my-listings-container');

        for (let i = 0; i < listingCounter; i++) {
            try {
                const listing = await energyContract.methods.energyListings(i).call();
                const expirationTime = await energyContract.methods.getListingExpirationTime(i).call();
                
                // Check if listing is expired
                const now = Math.floor(Date.now() / 1000);
                if (now > expirationTime) {
                    await energyContract.methods.checkListingExpiration(i).send({ from: currentAccount });
                    continue;
                }

                // Only show active listings with remaining energy
                if (listing.isActive && parseInt(listing.energyAmountWh) > 0) {
                    const listingCard = document.createElement('div');
                    listingCard.className = 'listing-card';
                    
                    const isMyListing = currentAccount.toLowerCase() === listing.seller.toLowerCase();
                    
                    listingCard.innerHTML = `
                        <div class="listing-details">
                            <div class="listing-header">
                                <h4>Listing #${i}</h4>
                                ${isMyListing ? '<span class="my-listing-badge">Your Listing</span>' : ''}
                            </div>
                            <p>Seller: <span class="address-display">${listing.seller}</span></p>
                            <p>Available Energy: <span class="energy-amount">${listing.energyAmountWh} Wh</span></p>
                            <p>Price per Wh: ${web3.utils.fromWei(listing.pricePerWhWei, 'ether')} ETH</p>
                            <p>Time Remaining: <span class="time-remaining">${formatTimeRemaining(expirationTime)}</span></p>
                            ${!isMyListing ? `
                                <div class="buy-form">
                                    <input type="number" id="buy-amount-${i}" 
                                           max="${listing.energyAmountWh}" 
                                           min="1"
                                           placeholder="Amount to buy (Wh)" 
                                           class="buy-input">
                                    <button onclick="buyPartialEnergy(${i})" class="buy-button">Buy Energy</button>
                                </div>
                            ` : ''}
                        </div>
                    `;

                    if (isMyListing) {
                        myListingsContainer.appendChild(listingCard);
                    } else {
                        activeListingsContainer.appendChild(listingCard);
                    }
                }
            } catch (error) {
                console.error(`Error fetching listing ${i}:`, error);
            }
        }

        // Show message if no listings found
        if (activeListingsContainer.children.length === 0) {
            activeListingsContainer.innerHTML = '<p class="no-listings">No active listings available</p>';
        }
        if (myListingsContainer.children.length === 0) {
            myListingsContainer.innerHTML = '<p class="no-listings">You have no active listings</p>';
        }

    } catch (error) {
        console.error("Error updating energy listings:", error);
    }
}

// Enhanced buyPartialEnergy function
async function buyPartialEnergy(listingId) {
    try {
        const amountInput = document.getElementById(`buy-amount-${listingId}`);
        const amountToBuy = parseInt(amountInput.value);
        
        if (!amountToBuy || amountToBuy <= 0) {
            alert("Please enter a valid amount to buy");
            return;
        }

        const listing = await energyContract.methods.energyListings(listingId).call();
        
        if (amountToBuy > parseInt(listing.energyAmountWh)) {
            alert("Cannot buy more than available energy amount");
            return;
        }

        // Show loading state
        const buyButton = amountInput.nextElementSibling;
        buyButton.textContent = 'Processing...';
        buyButton.disabled = true;

        try {
            // Get balances before transaction
            const buyerBalanceBefore = await energyContract.methods.getUserBalance(currentAccount).call();
            const sellerBalanceBefore = await energyContract.methods.getUserBalance(listing.seller).call();

            // Execute the purchase transaction
            const result = await energyContract.methods.buyEnergy(listingId, amountToBuy)
                .send({ from: currentAccount });

            // Get balances after transaction
            const buyerBalanceAfter = await energyContract.methods.getUserBalance(currentAccount).call();
            const sellerBalanceAfter = await energyContract.methods.getUserBalance(listing.seller).call();

            // Calculate and display balance changes
            const buyerChange = web3.utils.fromWei(
                (BigInt(buyerBalanceAfter) - BigInt(buyerBalanceBefore)).toString(),
                'ether'
            );
            const sellerChange = web3.utils.fromWei(
                (BigInt(sellerBalanceAfter) - BigInt(sellerBalanceBefore)).toString(),
                'ether'
            );

            // Update UI
            await updateEnergyListings();
            await updateTransactionHistory();

            // Show transaction summary
            alert(`Transaction successful!
                \nYou bought: ${amountToBuy} Wh
                \nYour balance change: ${buyerChange} ETH
                \nSeller balance change: ${sellerChange} ETH`);

        } finally {
            buyButton.textContent = 'Buy Energy';
            buyButton.disabled = false;
        }

    } catch (error) {
        console.error("Error buying energy:", error);
        alert("Failed to buy energy: " + error.message);
    }
}

// Function to update balances for both parties
async function updateBalances(buyer, seller) {
    try {
        const buyerBalance = await web3.eth.getBalance(buyer);
        const sellerBalance = await web3.eth.getBalance(seller);
        
        await Promise.all([
            updateBalanceDisplay(buyer, web3.utils.fromWei(buyerBalance, 'ether')),
            updateBalanceDisplay(seller, web3.utils.fromWei(sellerBalance, 'ether'))
        ]);
    } catch (error) {
        console.error("Error updating balances:", error);
    }
}

// Update the main updateUI function
async function updateUI() {
    if (!currentAccount || !energyContract) return;
    
    try {
        await Promise.all([
            updateAccountInfo(),
            updateEnergyListings(),
            updateEnergyHoldings(),
            updateTransactionHistory()
        ]);
    } catch (error) {
        console.error("Error updating UI:", error);
    }
}

// Function to update account info
async function updateAccountInfo() {
    try {
        const addressDisplay = document.getElementById('account-address');
        if (addressDisplay) {
            addressDisplay.textContent = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
        }
        
        const ethBalance = await web3.eth.getBalance(currentAccount);
        const ethBalanceInEther = web3.utils.fromWei(ethBalance, 'ether');
        const balanceDisplay = document.getElementById('account-balance');
        if (balanceDisplay) {
            balanceDisplay.textContent = parseFloat(ethBalanceInEther).toFixed(4);
        }
        
        const connectWalletButton = document.getElementById('connect-wallet');
        const accountInfo = document.getElementById('account-info');
        if (connectWalletButton && accountInfo) {
            connectWalletButton.style.display = 'none';
            accountInfo.style.display = 'block';
        }
    } catch (error) {
        console.error("Error updating account info:", error);
    }
}

// Add automatic refresh of listings
function startListingRefresh() {
    // Update listings every minute
    setInterval(async () => {
        await updateEnergyListings();
    }, 60000);
}

// Initialize the dApp
window.addEventListener('load', async () => {
    await init();
    startListingRefresh();
}); 