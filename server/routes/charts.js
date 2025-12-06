const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Snake bite statistics from sub-Saharan Africa research
router.get('/summary-stats', auth, async (req, res) => {
    try {
        const snakeBiteData = {
            // Annual Statistics from the research figure
            casualties: [
                { category: 'Envenomings', value: 360000, range: '300,000-420,000' },
                { category: 'Deaths', value: 18500, range: '7,000-30,000' },
                { category: 'Amputations', value: 15000, range: '5,000-25,000' }
            ],
            // Snake species data from Africa map
            speciesCount: [
                { species: 'Cobra', count: 13, region: 'Sub-Saharan Africa' },
                { species: 'Mamba', count: 4, region: 'Sub-Saharan Africa' },
                { species: 'Rinkhals', count: 1, region: 'Southern Africa' }
            ],
            // Additional context data
            researchProgress: {
                currentTreatment: 'Horse-derived antibodies',
                newApproach: 'Camelid-derived nanobodies',
                targetSpecies: 'Elapid snakes (current), Viperid snakes (future)',
                advantages: ['Smaller size', 'Better tissue penetration', 'Multi-toxin effectiveness']
            }
        };

        res.json(snakeBiteData);
    } catch (error) {
        console.error('Error fetching summary stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Additional endpoint for detailed reports data
router.get('/reports-data', auth, async (req, res) => {
    try {
        const reportsData = {
            // Toxin binding data from research figure part (a)
            toxinProfiles: [
                { toxin: 'CTx', clones: 239, bindingStrength: 2.0, color: '#ff6b6b' },
                { toxin: 'sNTx', clones: 811, bindingStrength: 3.0, color: '#e91e63' },
                { toxin: 'lNTx', clones: 233, bindingStrength: 3.0, color: '#ff9800' },
                { toxin: 'AgTx', clones: 184, bindingStrength: 5.0, color: '#8b0000' },
                { toxin: 'Og XI', clones: 142, bindingStrength: 3.0, color: '#757575' },
                { toxin: 'KUN', clones: 123, bindingStrength: 6.0, color: '#4caf50' },
                { toxin: 'PLA₂', clones: 122, bindingStrength: 4.0, color: '#00bcd4' }
            ],
            // Binding affinity ranges (from part b of figure)
            bindingAffinities: [
                { toxin: 'CTx-10', kd_range: '1pM-1nM', variants: ['VH1', 'VH2', 'VH3', 'VH4'] },
                { toxin: 'sNTx-3', kd_range: '10pM-100pM', variants: ['VH5', 'VH6', 'VH7', 'VH8'] },
                { toxin: 'lNTx-1', kd_range: '100pM-1nM', variants: ['VH9', 'VH10', 'VH11', 'VH12'] },
                { toxin: 'AgTx-2', kd_range: '1nM-10nM', variants: ['VH13', 'VH14'] },
                { toxin: 'Og XI-2', kd_range: '10nM-100nM', variants: ['VH15', 'VH16'] },
                { toxin: 'KUN-1', kd_range: '100nM-1μM', variants: ['VH17', 'VH18', 'VH19'] },
                { toxin: 'PLA₂-2', kd_range: '1μM-10μM', variants: ['VH20', 'VH21'] }
            ],
            // Treatment effectiveness comparison
            treatmentComparison: [
                { treatment: 'Horse Antibodies', effectiveness: 65, cost: 'High' },
                { treatment: 'Camelid Nanobodies', effectiveness: 90, cost: 'Medium' }
            ]
        };

        res.json(reportsData);
     } catch (error) {
        console.error('Error fetching reports data:', error);
        res.status(500).json({ message: 'Server error' });
     }
});

module.exports = router;