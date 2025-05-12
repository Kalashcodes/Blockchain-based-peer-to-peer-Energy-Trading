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
        } catch (error) {
            console.error("Error initializing web3:", error);
            alert("Failed to connect to Ethereum. Please ensure MetaMask is installed and configured correctly.");
            return;
        }
    } 
    // Legacy browsers or no provider
    else {
        alert("Please install MetaMask to use this dApp!");
        return;
    }

    // Set up listeners for network change
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            console.log('Account changed:', accounts[0]);
            updateUI();
        });
        
        window.ethereum.on('chainChanged', (chainId) => {
            console.log('Network changed:', chainId);
            window.location.reload();
        });
    }

    try {
        // Initialize contract instance
        if (contractAddress) {
            energyContract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contract initialized at:", contractAddress);
        } else {
            console.error("No contract address specified");
            alert("Contract address not specified. Please deploy the contract and update the address in contractABI.js");
            return;
        }
    } catch (error) {
        console.error("Error initializing contract:", error);
        alert("Failed to initialize the smart contract. Please check the contract address and ABI.");
        return;
    }

    // Register event listeners
    setupEventListeners();
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
        
        // Update UI
        updateUI();
        
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
        await energyContract.methods.claimTestETH().send({ from: currentAccount });
        alert("Test ETH claimed successfully!");
        updateUI();
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
        await energyContract.methods.listEnergy(energyAmount, pricePerKwh)
            .send({ from: currentAccount });
        
        alert("Energy listed successfully!");
        document.getElementById('list-energy-form').reset();
        updateUI();
    } catch (error) {
        console.error("Error listing energy:", error);
        alert("Failed to list energy: " + error.message);
    }
}

// Buy energy function
async function buyEnergy(listingId) {
    try {
        await energyContract.methods.buyEnergy(listingId)
            .send({ from: currentAccount });
        
        alert("Energy purchased successfully!");
        updateUI();
    } catch (error) {
        console.error("Error buying energy:", error);
        alert("Failed to buy energy: " + error.message);
    }
}

// Update price function
async function updatePrice(listingId, newPrice) {
    try {
        await energyContract.methods.updatePrice(listingId, newPrice)
            .send({ from: currentAccount });
        
        alert("Price updated successfully!");
        updateUI();
    } catch (error) {
        console.error("Error updating price:", error);
        alert("Failed to update price: " + error.message);
    }
}

// Update UI with latest data
async function updateUI() {
    if (!currentAccount || !energyContract) return;
    
    try {
        // Update account info display
        document.getElementById('account-address').textContent = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
        
        const ethBalance = await web3.eth.getBalance(currentAccount);
        const ethBalanceInEther = web3.utils.fromWei(ethBalance, 'ether');
        document.getElementById('account-balance').textContent = parseFloat(ethBalanceInEther).toFixed(4);
        
        // Show account info
        document.getElementById('connect-wallet').style.display = 'none';
        document.getElementById('account-info').style.display = 'block';
        
        // Get user energy usage and balance
        const energyUsage = await energyContract.methods.getUserEnergyUsage(currentAccount).call();
        const userBalance = await energyContract.methods.getUserBalance(currentAccount).call();
        
        document.getElementById('energy-balance').textContent = energyUsage;
        document.getElementById('eth-balance').textContent = web3.utils.fromWei(userBalance, 'ether');
        
        // Get available listings
        await fetchAndDisplayListings();
        
        // Get user transactions
        await fetchAndDisplayTransactions();
        
    } catch (error) {
        console.error("Error updating UI:", error);
    }
}

// Fetch and display energy listings
async function fetchAndDisplayListings() {
    const listingsContainer = document.getElementById('listings-container');
    const noListingsElement = document.getElementById('no-listings');
    
    try {
        const listingCount = await energyContract.methods.listingCounter().call();
        
        let listingsHTML = '';
        let hasAvailableListings = false;
        
        for (let i = 0; i < listingCount; i++) {
            const listing = await energyContract.methods.energyListings(i).call();
            
            if (listing.isAvailable) {
                hasAvailableListings = true;
                
                // Convert Wei per Wh to milliETH per kWh for display
                const priceInWeiPerWh = listing.pricePerWhWei;
                const priceInWeiPerKwh = priceInWeiPerWh * 1000;
                const priceInMilliEthPerKwh = web3.utils.fromWei(priceInWeiPerKwh.toString(), 'ether') * 1000;
                
                const isSeller = listing.seller.toLowerCase() === currentAccount.toLowerCase();
                
                listingsHTML += `
                    <div class="listing-card">
                        <h3>Listing #${listing.id}</h3>
                        <p>Seller: ${listing.seller.substring(0, 6)}...${listing.seller.substring(38)}</p>
                        <p>Energy Amount: ${listing.energyAmountWh} Wh</p>
                        <p>Price: ${priceInMilliEthPerKwh} milliETH per kWh</p>
                        <p>Total Cost: ${web3.utils.fromWei((listing.energyAmountWh * listing.pricePerWhWei).toString(), 'ether')} ETH</p>
                        ${!isSeller ? 
                            `<button class="buy-button" onclick="buyEnergy(${listing.id})">Buy Energy</button>` : 
                            `<div class="price-update">
                                <input type="number" id="new-price-${listing.id}" placeholder="New price (milliETH/kWh)" min="1">
                                <button onclick="updatePrice(${listing.id}, document.getElementById('new-price-${listing.id}').value)">Update Price</button>
                            </div>`
                        }
                    </div>
                `;
            }
        }
        
        if (hasAvailableListings) {
            noListingsElement.style.display = 'none';
            listingsContainer.innerHTML = listingsHTML + noListingsElement.outerHTML;
        } else {
            noListingsElement.style.display = 'block';
            listingsContainer.innerHTML = noListingsElement.outerHTML;
        }
    } catch (error) {
        console.error("Error fetching listings:", error);
        listingsContainer.innerHTML = `<p>Error loading listings: ${error.message}</p>`;
    }
}

// Fetch and display user transactions
async function fetchAndDisplayTransactions() {
    const transactionsContainer = document.getElementById('transactions-container');
    const noTransactionsElement = document.getElementById('no-transactions');
    
    try {
        const listingCount = await energyContract.methods.listingCounter().call();
        
        let transactionsHTML = '';
        let hasTransactions = false;
        
        for (let i = 0; i < listingCount; i++) {
            const listing = await energyContract.methods.energyListings(i).call();
            
            if (!listing.isAvailable) {
                const txDetails = await energyContract.methods.getTransactionDetails(i).call();
                
                if (txDetails[0].toLowerCase() === currentAccount.toLowerCase() || 
                    listing.seller.toLowerCase() === currentAccount.toLowerCase()) {
                    
                    hasTransactions = true;
                    const role = txDetails[0].toLowerCase() === currentAccount.toLowerCase() ? "Buyer" : "Seller";
                    const otherParty = role === "Buyer" ? listing.seller : txDetails[0];
                    
                    transactionsHTML += `
                        <div class="transaction-card">
                            <h3>Transaction #${i}</h3>
                            <p>Role: ${role}</p>
                            <p>${role === "Buyer" ? "Seller" : "Buyer"}: ${otherParty.substring(0, 6)}...${otherParty.substring(38)}</p>
                            <p>Energy Amount: ${txDetails[1]} Wh</p>
                            <p>Amount Paid: ${web3.utils.fromWei(txDetails[2].toString(), 'ether')} ETH</p>
                            <p>Transaction Date: ${new Date().toLocaleDateString()}</p>
                        </div>
                    `;
                }
            }
        }
        
        if (hasTransactions) {
            noTransactionsElement.style.display = 'none';
            transactionsContainer.innerHTML = transactionsHTML + noTransactionsElement.outerHTML;
        } else {
            noTransactionsElement.style.display = 'block';
            transactionsContainer.innerHTML = noTransactionsElement.outerHTML;
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
        transactionsContainer.innerHTML = `<p>Error loading transactions: ${error.message}</p>`;
    }
}

// Helper function to format addresses
function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
}

// Initialize the app when the window loads
window.addEventListener('load', init); 