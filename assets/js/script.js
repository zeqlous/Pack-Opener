import { generatePackResults } from './pitySystem.js';
import { updateMainCounters, triggerSlotRoll, triggerConfettiBurst, displayHeirloomModal, hideHeirloomModal, DOM } from './ui.js';

const state = {
    totalPacksOpened: 0,
    heirloomsEarned: 0,
    packsSinceLastHeirloom: 0,
    packsSinceLastLegendary: 0,
    itemCounters: { common: 0, rare: 0, epic: 0, legendary: 0, heirloom: 0 }
};

const RARITY_WEIGHTS = { common: 1, rare: 2, epic: 3, legendary: 4, heirloom: 5 };

function getHighestRarityInPack(items) {
    return items.reduce((highest, current) => {
        return RARITY_WEIGHTS[current] > RARITY_WEIGHTS[highest] ? current : highest;
    }, 'common');
}

function executePackOpening() {
    state.totalPacksOpened++;
    state.packsSinceLastHeirloom++;
    state.packsSinceLastLegendary++;

    const results = generatePackResults(state);

    triggerSlotRoll(results.items, () => {
        if (results.isHeirloom) {
            state.heirloomsEarned++;
            state.itemCounters.heirloom += 3;
            triggerConfettiBurst('heirloom');
            displayHeirloomModal(state.packsSinceLastHeirloom);
            state.packsSinceLastHeirloom = 0; 
            updateMainCounters(state);
            return;
        }

        results.items.forEach(item => {
            state.itemCounters[item]++;
        });

        if (results.items.includes('legendary')) {
            state.packsSinceLastLegendary = 0;
        }

        const peakRarity = getHighestRarityInPack(results.items);
        triggerConfettiBurst(peakRarity);

        updateMainCounters(state);
    });
}

DOM.openButton.addEventListener('click', executePackOpening);
DOM.modalCloseBtn.addEventListener('click', hideHeirloomModal);