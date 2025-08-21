'use client';

import { useEffect } from 'react';
import '../amplify';

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        console.log('Amplify configured');
    }, []);

    return <>{children}</>;
}
