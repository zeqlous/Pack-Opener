// Game Stats Tracking State
let totalPacksOpened = 0;
let heirloomsEarned = 0;
let packsSinceLastHeirloom = 0;
let packsSinceLastLegendary = 0;

const itemCounters = {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    heirloom: 0
};

// Target DOM Elements
const openButton = document.getElementById('open-btn');
const totalPacksDisplay = document.getElementById('total-packs');
const heirloomCountDisplay = document.getElementById('heirloom-count');
const totalMoneyMainDisplay = document.getElementById('total-money-main');
const blurToggle = document.getElementById('blur-toggle');

const counterDisplays = {
    common: document.getElementById('count-common'),
    rare: document.getElementById('count-rare'),
    epic: document.getElementById('count-epic'),
    legendary: document.getElementById('count-legendary')
};

const cards = [
    document.getElementById('card-1'),
    document.getElementById('card-2'),
    document.getElementById('card-3')
];

// Modal DOM Elements
const heirloomModal = document.getElementById('heirloom-modal');
const modalPacks = document.getElementById('modal-packs');
const modalMoney = document.getElementById('modal-money');
const modalCloseBtn = document.getElementById('modal-close-btn');

// Realistic Item Probability Rates (percentages)
const LEGENDARY_RATE = 1.0; 
const EPIC_RATE = 22.0;
// Note: Remaining items drop as Commons or Rares. 
// A "Rare or better" guarantee check modifies items if a pack rolls all Commons.

// Evaluates base rolling chance for an individual item item drop slot
function rollItemRarity() {
    const roll = Math.random() * 100;

    if (roll < LEGENDARY_RATE) {
        return 'legendary';
    } else if (roll < (LEGENDARY_RATE + EPIC_RATE)) {
        return 'epic';
    } else {
        // True base items lean heavily toward whites/commons
        return Math.random() < 0.75 ? 'common' : 'rare';
    }
}

function openPack() {
    totalPacksOpened++;
    packsSinceLastHeirloom++;
    packsSinceLastLegendary++;

    totalPacksDisplay.textContent = totalPacksOpened;
    totalMoneyMainDisplay.textContent = ` $${(totalPacksOpened * 1.00).toFixed(2)} USD`;

    // 1. Evaluate Heirloom Pity System (Standard chance is roughly <0.2%, guaranteed at 500)
    const isHeirloomPack = (Math.random() * 100 < 0.2) || (packsSinceLastHeirloom >= 500);

    if (isHeirloomPack) {
        triggerHeirloomScreen();
        return; 
    }

    // 2. Evaluate Legendary Pity System (Guaranteed at 30)
    let forceLegendary = false;
    if (packsSinceLastLegendary >= 30) {
        forceLegendary = true;
    }

    let packResults = [];

    // Roll initial items
    for (let i = 0; i < 3; i++) {
        packResults.push(rollItemRarity());
    }

    // Apply Legendary Pity injection if required
    if (forceLegendary) {
        packResults[0] = 'legendary';
    }

    // Check if player hit *any* legendary naturally or via pity, resetting counter
    if (packResults.includes('legendary')) {
        packsSinceLastLegendary = 0;
    }

    // 3. Evaluate Rare Guarantee (Pack must contain at least 1 Rare or better item)
    const hasRareOrBetter = packResults.some(tier => tier !== 'common');
    if (!hasRareOrBetter) {
        // Force the third reward card slot to become a Rare
        packResults[2] = 'rare';
    }

    // Render results to UI and update item limits
    cards.forEach((card, index) => {
        card.className = 'card';
        void card.offsetWidth; // Force CSS reload

        const chosenRarity = packResults[index];
        card.classList.add(chosenRarity, 'reveal');

        // Increment specific item type tracking counters
        itemCounters[chosenRarity]++;
        if (counterDisplays[chosenRarity]) {
            counterDisplays[chosenRarity].textContent = itemCounters[chosenRarity];
        }
    });
}

function triggerHeirloomScreen() {
    heirloomsEarned++;
    heirloomCountDisplay.textContent = heirloomsEarned;
    itemCounters.heirloom += 3; // Heirloom sets provide 3 Shard items

    // Paint all cards red instantly for visual display
    cards.forEach(card => {
        card.className = 'card';
        void card.offsetWidth;
        card.classList.add('heirloom', 'reveal');
    });

    // Populate metadata inside confirmation modal box
    modalPacks.textContent = packsSinceLastHeirloom;
    // Calculation assumes flat baseline profile rate of $1.00 USD cost per pack opening
    modalMoney.textContent = (packsSinceLastHeirloom * 1.00).toFixed(2);

    // Unhide modal box backdrop to seize user interaction focus
    heirloomModal.classList.remove('hidden');

    // Reset pity run metric
    packsSinceLastHeirloom = 0;
}

// Interactive Event Actions
openButton.addEventListener('click', openPack);

modalCloseBtn.addEventListener('click', () => {
    heirloomModal.classList.add('hidden');
});

blurToggle.addEventListener('change', (event) => {
    if (event.target.checked) {
        totalMoneyMainDisplay.classList.add('blurred');
    } else {
        totalMoneyMainDisplay.classList.remove('blurred');
    }
});