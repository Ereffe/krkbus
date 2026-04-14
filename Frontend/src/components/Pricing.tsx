import React from "react";
import "../styles/Pricing.css";

interface PricingProps {
  selectedRoute: string | null;
}

const Pricing: React.FC<PricingProps> = ({ selectedRoute }) => {
  const prices: Record<string, number> = {
    "Kraków - Warszawa": 50,
    "Kraków - Katowice": 30,
    "Kraków - Gdańsk": 70,
  };

  const route = selectedRoute ? JSON.parse(selectedRoute) : null;

  return (
    <div className="pricing-container">
      {route ? (
        <div className="pricing-info">
          <div className="pricing-route">
            <span className="pricing-label">Trasa:</span>
            <span className="pricing-value">
              {route.from} → {route.to}
            </span>
          </div>
          <div className="pricing-price">
            <span className="pricing-label">Cena:</span>
            <span className="pricing-value-price">
              {prices[`${route.from} - ${route.to}`] || "Brak danych"} PLN
            </span>
          </div>
        </div>
      ) : (
        <div className="pricing-empty">
          <p>Wybierz trasę, aby zobaczyć cenę</p>
        </div>
      )}
    </div>
  );
};

export default Pricing;
