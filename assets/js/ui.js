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
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebar-toggle'),
    confettiContainer: document.getElementById('confetti-container'),
    packStage: document.getElementById('pack-stage'),
    toggleAnimBtn: document.getElementById('toggle-anim-btn'),
    toggleSoundBtn: document.getElementById('toggle-sound-btn'),
    strips: [
        document.getElementById('strip-1'),
        document.getElementById('strip-2'),
        document.getElementById('strip-3')
    ],
    counters: {
        common: document.getElementById('count-common'),
        rare: document.getElementById('count-rare'),
        epic: document.getElementById('count-epic'),
        legendary: document.getElementById('count-legendary')
    }
};

export const SETTINGS = {
    animationsEnabled: true,
    soundEnabled: true
};

const ICON_MAP = {
    animOn: 'assets/images/On.png',
    animOff: 'assets/images/Off.png',
    soundOn: 'assets/images/Sound_On.png',
    soundOff: 'assets/images/Volume-Off.png'
};

const SVG_MAP = {
    common: 'assets/images/Crafting_Metals.svg',
    rare: 'assets/images/Crafting_Metals.svg',
    epic: 'assets/images/Crafting_Metals_Epic.svg',
    legendary: 'assets/images/Crafting_Metals_Legendary.svg',
    heirloom: 'assets/images/Heirloom_Shards.svg'
};

const AUDIO = {
    roll: new Audio('assets/audio/roll.mp3'),
    dink: new Audio('assets/audio/dink.mp3'),
    heirloom: new Audio('assets/audio/heirloom.mp3')
};

const animIcon = document.getElementById('anim-icon');
const soundIcon = document.getElementById('sound-icon');

function playSound(soundKey) {
    if (!SETTINGS.soundEnabled) return;
    const sound = AUDIO[soundKey];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

// User Action Interface Connections
DOM.sidebarToggle.addEventListener('click', () => DOM.sidebar.classList.toggle('collapsed'));
DOM.blurToggle.addEventListener('change', (e) => DOM.totalMoneyMain.classList.toggle('blurred', e.target.checked));

DOM.toggleAnimBtn.addEventListener('click', () => {
    SETTINGS.animationsEnabled = !SETTINGS.animationsEnabled;
    animIcon.src = SETTINGS.animationsEnabled ? ICON_MAP.animOn : ICON_MAP.animOff;
    DOM.toggleAnimBtn.classList.toggle('disabled-state', !SETTINGS.animationsEnabled);
});

DOM.toggleSoundBtn.addEventListener('click', () => {
    SETTINGS.soundEnabled = !SETTINGS.soundEnabled;
    soundIcon.src = SETTINGS.soundEnabled ? ICON_MAP.soundOn : ICON_MAP.soundOff;
    DOM.toggleSoundBtn.classList.toggle('disabled-state', !SETTINGS.soundEnabled);
});

export function updateMainCounters(state) {
    DOM.totalPacks.textContent = state.totalPacksOpened;
    DOM.heirloomCount.textContent = state.heirloomsEarned;
    DOM.totalMoneyMain.textContent = ` $${(state.totalPacksOpened * ECONOMY.PACK_COST_USD).toFixed(2)} USD`;

    Object.keys(DOM.counters).forEach(rarity => {
        DOM.counters[rarity].textContent = state.itemCounters[rarity];
    });
}

export function buildSlotStrips(finalItems) {
    const pool = ['common', 'rare', 'epic', 'legendary'];
    
    DOM.strips.forEach((strip, index) => {
        strip.innerHTML = '';
        strip.classList.remove('rolling');
        void strip.offsetWidth;

        // True target award locked directly to the top edge mapping position index 0
        strip.appendChild(createSlotNode(finalItems[index]));

        if (SETTINGS.animationsEnabled) {
            const totalItemsInStrip = 15 + (index * 4);
            for (let i = 0; i < totalItemsInStrip - 1; i++) {
                const randomRarity = pool[Math.floor(Math.random() * pool.length)];
                strip.appendChild(createSlotNode(randomRarity));
            }
        }
    });
}

function createSlotNode(rarity) {
    const node = document.createElement('div');
    node.className = `slot-node ${rarity}`;

    const matIcon = document.createElement('div');
    matIcon.className = 'material-icon';
    matIcon.style.backgroundImage = `url('${SVG_MAP[rarity]}')`;
    
    node.appendChild(matIcon);
    return node;
}

export function triggerSlotRoll(finalItems, callback) {
    DOM.openButton.disabled = true;
    buildSlotStrips(finalItems);
    
    if (!SETTINGS.animationsEnabled) {
        DOM.openButton.disabled = false;
        callback();
        return;
    }

    playSound('roll');

    DOM.strips.forEach((strip, index) => {
        const duration = 1.0 + (index * 0.4);
        strip.style.animationDuration = `${duration}s`;
        strip.classList.add('rolling');

        setTimeout(() => {
            playSound('dink');
        }, duration * 1000);
    });

    const entireSequenceDuration = (1.0 + (2 * 0.4)) * 1000;
    setTimeout(() => {
        DOM.openButton.disabled = false;
        callback();
    }, entireSequenceDuration);
}

export function triggerConfettiBurst(rarity) {
    if (!SETTINGS.animationsEnabled) return;

    const colors = {
        common: ['#ffffff', '#aaaaaa'],
        rare: ['#2a75d3', '#1c4a85'],
        epic: ['#8a2be2', '#531b8a'],
        legendary: ['#ffd700', '#ffa500'],
        heirloom: ['#da292a', '#ff4d4d']
    };

    const targetColors = colors[rarity] || colors.common;
    const stageRect = DOM.packStage.getBoundingClientRect();
    
    // Position exact origin from the middle crosshair bounds coordinates of the cards
    const originX = stageRect.left + (stageRect.width / 2);
    const originY = stageRect.top + (stageRect.height / 2);

    for (let i = 0; i < 75; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti-particle';
        particle.style.backgroundColor = targetColors[Math.floor(Math.random() * targetColors.length)];
        
        particle.style.left = `${originX}px`;
        particle.style.top = `${originY}px`;

        const upwardVelocity = -(300 + Math.random() * 400); 
        const lateralSpread = (Math.random() - 0.5) * 400;   
        const randomRotation = `${360 + Math.random() * 360}deg`;

        particle.style.setProperty('--targetX', `${lateralSpread}px`);
        particle.style.setProperty('--targetY', `${upwardVelocity}px`);
        particle.style.setProperty('--targetRotate', randomRotation);
        
        particle.style.animationDelay = `${Math.random() * 0.1}s`;
        particle.style.transform = `scale(${0.6 + Math.random() * 0.8})`;

        DOM.confettiContainer.appendChild(particle);

        setTimeout(() => particle.remove(), 2000);
    }
}

export function displayHeirloomModal(packsCount) {
    playSound('heirloom');
    DOM.modalPacks.textContent = packsCount;
    DOM.modalMoney.textContent = (packsCount * ECONOMY.PACK_COST_USD).toFixed(2);
    DOM.heirloomModal.classList.remove('hidden');
}

export function hideHeirloomModal() {
    DOM.heirloomModal.classList.add('hidden');
}

export { DOM };