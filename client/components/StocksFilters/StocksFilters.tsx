'use client';

import { useState } from 'react';
import { Input, Button } from '@heroui/react';
import { Card, CardBody } from '@heroui/react';

interface StocksFiltersProps {
  onSubmit: (symbol: string, country: string) => void;
  loading: boolean;
}

export default function StocksFilters({
  onSubmit,
  loading,
}: StocksFiltersProps) {
  const [symbol, setSymbol] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(symbol, country);
  };

  return (
    <Card>
      <CardBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Symbol"
              placeholder="e.g., AAPL"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              isClearable
              onClear={() => setSymbol('')}
            />
            <Input
              label="Country"
              placeholder="e.g., US"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              isClearable
              onClear={() => setCountry('')}
            />
          </div>

          <Button type="submit" color="primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
