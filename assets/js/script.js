import { generatePackResults } from './pitySystem.js';
import { updateMainCounters, renderCards, displayHeirloomModal, hideHeirloomModal, DOM } from './ui.js';

// Central Game Engine State Container
const state = {
    totalPacksOpened: 0,
    heirloomsEarned: 0,
    packsSinceLastHeirloom: 0,
    packsSinceLastLegendary: 0,
    itemCounters: { common: 0, rare: 0, epic: 0, legendary: 0, heirloom: 0 }
};

function executePackOpening() {
    state.totalPacksOpened++;
    state.packsSinceLastHeirloom++;
    state.packsSinceLastLegendary++;

    const results = generatePackResults(state);

    if (results.isHeirloom) {
        state.heirloomsEarned++;
        state.itemCounters.heirloom += 3;
        renderCards(results.items);
        displayHeirloomModal(state.packsSinceLastHeirloom);
        state.packsSinceLastHeirloom = 0; // Clear metric
        updateMainCounters(state);
        return;
    }

    // Process normal items
    results.items.forEach(item => {
        state.itemCounters[item]++;
    });

    if (results.items.includes('legendary')) {
        state.packsSinceLastLegendary = 0;
    }

    renderCards(results.items);
    updateMainCounters(state);
}

// Setup Controller Listeners
DOM.openButton.addEventListener('click', executePackOpening);
DOM.modalCloseBtn.addEventListener('click', hideHeirloomModal);