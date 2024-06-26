document.addEventListener('DOMContentLoaded', () => {
    setupTabs('#autoTabPanel', true); // Configuração para guias automáticas
    setupTabs('#manualTabPanel', false); // Configuração para guias manuais
    // Ativa a primeira guia de cada painel automaticamente
    activateFirstTab('#autoTabPanel');
    activateFirstTab('#manualTabPanel');
});

function setupTabs(panelId, isAuto) {
    const panel = document.querySelector(panelId);
    const tabs = panel.querySelectorAll('[role="tab"]');
    const tabList = panel.querySelector('.tab-list');

    tabList.addEventListener('keydown', e => navigateTabs(e, tabs, isAuto));
    tabs.forEach(tab => {
        const selectTabFunction = () => selectTab(tab, tabs, isAuto);
        tab.addEventListener('click', selectTabFunction);
        // Adiciona suporte para mudança de conteúdo ao focar nas guias (útil para navegação por teclado)
        if (isAuto) {
            tab.addEventListener('focus', selectTabFunction);
        }
        tab.addEventListener('touchend', e => {
            e.preventDefault(); // Previne o evento de clique subsequente
            selectTabFunction();
        });
    });
}

function navigateTabs(e, tabs, isAuto) {
    let newIndex, dir;
    const currentTab = e.target;
    const currentIndex = Array.from(tabs).indexOf(currentTab);

    if (e.key === 'ArrowLeft') dir = -1;
    else if (e.key === 'ArrowRight') dir = 1;

    if (dir !== undefined) {
        newIndex = (currentIndex + dir + tabs.length) % tabs.length;
        e.preventDefault();
        tabs[newIndex].focus();
        if (isAuto) selectTab(tabs[newIndex], tabs, isAuto);
    } else if (e.key === 'Enter' && !isAuto) {
        selectTab(currentTab, tabs, isAuto);
    }
}

function selectTab(selectedTab, tabs, isAuto) {
    tabs.forEach(tab => {
        const isSelected = tab === selectedTab;
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        const panelId = tab.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        panel.style.display = isSelected ? 'block' : 'none';
        if (isSelected && !isAuto) {
            // Mover o foco para o conteúdo da guia ativa no modo manual
            panel.setAttribute('tabindex', '-1');
            panel.focus();
        } else {
            panel.setAttribute('hidden', 'true');
        }
    });
}

function activateFirstTab(panelId) {
    const panel = document.querySelector(panelId);
    const firstTab = panel.querySelector('[role="tab"]');
    if (firstTab) {
        // Chama selectTab diretamente em vez de simular um clique
        const tabs = panel.querySelectorAll('[role="tab"]');
        const isAuto = panelId.includes('auto');
        selectTab(firstTab, tabs, isAuto);
    }
}
