'use client';

import { useState } from 'react';
import ProductStage from './ProductStage';

const details = {
  protection: { number: '01 / PROTECTION', title: 'A wearable layer of defence.', text: 'Broad-spectrum SPF 50+ with a lightweight gel texture for daily sun protection.' },
  hydration: { number: '02 / HYDRATION', title: 'Hydration in the everyday.', text: 'Hyaluronic acid is a key ingredient in the formula, paired with a comfortable gel feel.' },
  finish: { number: '03 / FINISH', title: 'A lightweight gel finish.', text: 'Explore the concept visualization, then review the product page and label for full details.' }
};

function ProductConcept() {
  return (
    <div className="sculpture formula-page-sculpture" role="img" aria-label="Three-dimensional SKINAA sunscreen packaging concept">
      <div className="cylinder">
        {Array.from({ length: 32 }, (_, index) => <i key={index} className="cylinder-panel" style={{ '--i': index }} />)}
        <div className="cylinder-top" />
        <div className="sculpture-label"><span>SKINAA</span><small>DERMATOLOGY + DAILY CARE</small><b>AQUA</b><em>sun gel</em><strong>50<span>SPF +</span></strong><small>HYALURONIC ACID<br />50 ml / 1.69 fl. oz.</small></div>
        <div className="sculpture-cap" />
      </div>
    </div>
  );
}

export default function FormulaExperience() {
  const [activeDetail, setActiveDetail] = useState('protection');
  return <ProductStage activeDetail={activeDetail} detail={details[activeDetail]} onSelect={setActiveDetail}><ProductConcept /></ProductStage>;
}
