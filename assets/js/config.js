export const DROP_RATES = {
    // Individual item roll odds calculated to output your exact required per-pack totals
    LEGENDARY_PER_ITEM: 2.53, // Yields a ~7.4% chance of "at least one" per pack
    EPIC_PER_ITEM: 6.50,       // Together with Legendary, yields a ~24.8% chance of "at least one" per pack
    
    // Of the remaining baseline rolls, how many turn out white/common vs blue/rare
    COMMON_VS_RARE_BIAS: 0.80 
};

export const PITY_LIMITS = {
    LEGENDARY_PITY: 30,
    HEIRLOOM_PITY: 500,
    HEIRLOOM_CHANCE: 0.045 // Your updated explicit baseline percent chance per pack roll
};

export const ECONOMY = {
    PACK_COST_USD: 1.00
};