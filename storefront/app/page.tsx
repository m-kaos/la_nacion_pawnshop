'use client';

import { useState } from 'react';
import LandingPage1 from '@/components/landing/LandingPage1';
import LandingPage2 from '@/components/landing/LandingPage2';
import LandingPage3 from '@/components/landing/LandingPage3';
import LandingPageSelector from '@/components/landing/LandingPageSelector';

export default function Home() {
  const [selectedPage, setSelectedPage] = useState<1 | 2 | 3>(1);

  const renderLandingPage = () => {
    switch (selectedPage) {
      case 1:
        return <LandingPage1 />;
      case 2:
        return <LandingPage2 />;
      case 3:
        return <LandingPage3 />;
      default:
        return <LandingPage1 />;
    }
  };

  return (
    <>
      {renderLandingPage()}
      <LandingPageSelector
        currentPage={selectedPage}
        onSelectPage={setSelectedPage}
      />
    </>
  );
}
