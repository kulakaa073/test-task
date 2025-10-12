'use client';

import { Card, CardBody } from '@heroui/react';

interface StocksResultsInfoProps {
  page: number;
  limit: number;
  total: number;
}

export default function StocksResultsInfo({
  page,
  limit,
  total,
}: StocksResultsInfoProps) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <Card className="bg-blue-50 border border-blue-200">
      <CardBody className="p-4">
        <p className="text-blue-700">
          Showing {start} to {end} of {total} results
        </p>
      </CardBody>
    </Card>
  );
}
