'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Load Bootstrap JS on client side only
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}
