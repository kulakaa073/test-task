'use client';

import { Card, CardBody } from '@heroui/react';

interface StocksErrorCardProps {
  error: string;
}

export default function StocksErrorCard({ error }: StocksErrorCardProps) {
  return (
    <Card className="bg-red-50 border border-red-200">
      <CardBody className="p-4">
        <p className="text-red-700">{error}</p>
      </CardBody>
    </Card>
  );
}
