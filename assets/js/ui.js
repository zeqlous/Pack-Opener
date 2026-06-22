import { ECONOMY } from './config.js';

const DOM = {
    openButton: document.getElementById('open-btn'),
    totalPacks: document.getElementById('total-packs'),
    heirloomCount: document.getElementById('heirloom-count'),
    totalMoneyMain: document.getElementById('total-money-main'),
    blurToggle: document.getElementById('blur-toggle'),
    heirloomModal: document.getElementById('heirloom-modal'),
    modalPacks: document.getElementById('modal-packs'),
    modalMoney: document.getElementById('modal-money'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    cards: [
        document.getElementById('card-1'),
        document.getElementById('card-2'),
        document.getElementById('card-3')
    ],
    counters: {
        common: document.getElementById('count-common'),
        rare: document.getElementById('count-rare'),
        epic: document.getElementById('count-epic'),
        legendary: document.getElementById('count-legendary')
    }
};

export function updateMainCounters(state) {
    DOM.totalPacks.textContent = state.totalPacksOpened;
    DOM.heirloomCount.textContent = state.heirloomsEarned;
    DOM.totalMoneyMain.textContent = ` $${(state.totalPacksOpened * ECONOMY.PACK_COST_USD).toFixed(2)} USD`;

    Object.keys(DOM.counters).forEach(rarity => {
        DOM.counters[rarity].textContent = state.itemCounters[rarity];
    });
}

export function renderCards(items) {
    DOM.cards.forEach((card, index) => {
        card.className = 'card';
        void card.offsetWidth; // Force CSS animation restart
        card.classList.add(items[index], 'reveal');
    });
}

export function displayHeirloomModal(packsCount) {
    DOM.modalPacks.textContent = packsCount;
    DOM.modalMoney.textContent = (packsCount * ECONOMY.PACK_COST_USD).toFixed(2);
    DOM.heirloomModal.classList.remove('hidden');
}

export function hideHeirloomModal() {
    DOM.heirloomModal.classList.add('hidden');
}

// Bind the blur functionality directly
DOM.blurToggle.addEventListener('change', (e) => {
    DOM.totalMoneyMain.classList.toggle('blurred', e.target.checked);
});

export { DOM };