// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnergyTrading {
    address public admin;
    uint constant SCALING_FACTOR = 1e6; // Scale milliEther (mETH) to whole numbers

    struct EnergyListing {
        uint id;
        address payable seller;
        uint energyAmountWh; // Store energy in Wh (1 kWh = 1000 Wh)
        uint pricePerWhWei; // Price per Wh in Wei
    }

    struct Transaction {
        address buyer;
        uint energyBoughtWh;
        uint amountPaid;
        uint remainingBalance;
    }

    uint public listingCounter = 0;
    mapping(uint => EnergyListing) public energyListings;
    mapping(address => uint) public userEnergyBalance; // User ETH balance for testing
    mapping(address => uint) public userEnergyUsage;
    mapping(uint => Transaction[]) public transactions;

    event EnergyListed(uint id, address seller, uint energyAmountWh, uint pricePerWhWei);
    event EnergyPurchased(uint id, address buyer, uint energyAmountWh, uint totalCost, uint remainingBalance);
    event PriceUpdated(uint id, uint newPricePerWhWei);

    constructor() {
        admin = msg.sender;
    }

    // 🚀 Give every user 1 ETH for testing (only in Remix VM)
    function claimTestETH() public {
        require(userEnergyBalance[msg.sender] == 0, "Already claimed test ETH");
        userEnergyBalance[msg.sender] = 1 ether;
    }

    // ✅ Accept price in milliEther (mETH) and convert to Wei
    function listEnergy(uint _energyAmountWh, uint _pricePerKWhMilliEther) public {
        require(_energyAmountWh > 0, "Energy amount must be greater than zero");
        require(_pricePerKWhMilliEther > 0, "Price per kWh must be greater than zero");

        uint pricePerWhWei = (_pricePerKWhMilliEther * 1 ether) / (1000 * SCALING_FACTOR);

        energyListings[listingCounter] = EnergyListing(
            listingCounter,
            payable(msg.sender),
            _energyAmountWh,
            pricePerWhWei
        );

        emit EnergyListed(listingCounter, msg.sender, _energyAmountWh, pricePerWhWei);
        listingCounter++;
    }

    // ✅ Buyer (including seller) can purchase energy multiple times
    // ✅ Reduces energy listing on partial purchase
    function buyEnergy(uint _listingId, uint _amountWh) public {
        EnergyListing storage listing = energyListings[_listingId];
        require(_amountWh > 0 && _amountWh <= listing.energyAmountWh, "Invalid energy amount");

        uint totalCost = _amountWh * listing.pricePerWhWei;
        require(userEnergyBalance[msg.sender] >= totalCost, "Insufficient balance!");

        // Deduct balance from buyer and credit to seller
        userEnergyBalance[msg.sender] -= totalCost;
        userEnergyBalance[listing.seller] += totalCost;

        // Update listing to reduce available energy
        listing.energyAmountWh -= _amountWh;

        // Update user energy usage
        userEnergyUsage[msg.sender] += _amountWh;

        // Log transaction
        transactions[_listingId].push(Transaction(msg.sender, _amountWh, totalCost, userEnergyBalance[msg.sender]));

        emit EnergyPurchased(_listingId, msg.sender, _amountWh, totalCost, userEnergyBalance[msg.sender]);
    }

    function updatePrice(uint _listingId, uint _newPricePerKWhMilliEther) public {
        require(msg.sender == energyListings[_listingId].seller, "Not the seller");
        require(_newPricePerKWhMilliEther > 0, "Price must be greater than zero");

        uint newPricePerWhWei = (_newPricePerKWhMilliEther * 1 ether) / (1000 * SCALING_FACTOR);
        energyListings[_listingId].pricePerWhWei = newPricePerWhWei;

        emit PriceUpdated(_listingId, newPricePerWhWei);
    }

    function getUserEnergyUsage(address _user) public view returns (uint) {
        return userEnergyUsage[_user];
    }

    function getUserBalance(address _user) public view returns (uint) {
        return userEnergyBalance[_user];
    }

    function getTransactionHistory(uint _listingId) public view returns (Transaction[] memory) {
        return transactions[_listingId];
    }
}
