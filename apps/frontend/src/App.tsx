/**
 * @file App.tsx
 * @description Root application component — acts as a lightweight client-side
 *              router for the Fixed Income Platform microservice dashboard.
 *
 * Routing strategy:
 *   - `view === 'dashboard'`       → renders the service-tile dashboard
 *   - `view === 'bond-calculator'` → renders the Bond Yield Calculator page
 *
 * No external router package is required; a simple React state switch is
 * sufficient for this small number of pages.
 */

import React, { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { BondCalculatorPage } from './pages/BondCalculatorPage';

/** All registered service view IDs. Extend this union as new services are added. */
type View = 'dashboard' | 'bond-calculator';

function App(): React.ReactElement {
    // Start on the dashboard; navigate by setting this state.
    const [view, setView] = useState<View>('dashboard');

    if (view === 'bond-calculator') {
        return <BondCalculatorPage onBack={() => setView('dashboard')} />;
    }

    // Default: dashboard
    return <Dashboard onNavigate={(id) => setView(id as View)} />;
}

export default App;
