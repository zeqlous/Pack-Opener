import { DROP_RATES, PITY_LIMITS } from './config.js';

function rollItemRarity() {
    const roll = Math.random() * 100;

    // Check individual item thresholds based on our calculated pool boundaries
    if (roll < DROP_RATES.LEGENDARY_PER_ITEM) {
        return 'legendary';
    } else if (roll < (DROP_RATES.LEGENDARY_PER_ITEM + DROP_RATES.EPIC_PER_ITEM)) {
        return 'epic';
    } else {
        return Math.random() < DROP_RATES.COMMON_VS_RARE_BIAS ? 'common' : 'rare';
    }
}

export function generatePackResults(gameState) {
    // 1. Evaluate Heirloom Pity and baseline 0.045% odds
    const isHeirloomPack = (Math.random() * 100 < PITY_LIMITS.HEIRLOOM_CHANCE) || 
                          (gameState.packsSinceLastHeirloom >= PITY_LIMITS.HEIRLOOM_PITY);

    if (isHeirloomPack) {
        return { isHeirloom: true, items: ['heirloom', 'heirloom', 'heirloom'] };
    }

    // 2. Evaluate Legendary Pity (Guaranteed 1 if 29 packs yielded zero Legendaries)
    let forceLegendary = gameState.packsSinceLastLegendary >= PITY_LIMITS.LEGENDARY_PITY;
    let packItems = [];

    for (let i = 0; i < 3; i++) {
        packItems.push(rollItemRarity());
    }

    if (forceLegendary) {
        packItems[0] = 'legendary';
    }

    // 3. Enforce Mandatory Rare Guarantee (100% chance at least one item is Rare or better)
    const hasRareOrBetter = packItems.some(tier => tier !== 'common');
    if (!hasRareOrBetter) {
        // Replace the final slot to guarantee the pack rules are met
        packItems[2] = 'rare';
    }

    return { isHeirloom: false, items: packItems };
}