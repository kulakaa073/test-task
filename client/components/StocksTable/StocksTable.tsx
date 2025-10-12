'use client';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Pagination,
} from '@heroui/react';

interface Stock {
  symbol: string;
  name: string;
  marketCap: number;
  price: number;
  changes: number;
  changePerMonth: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StocksTableProps {
  stocks: Stock[];
  pagination: PaginationMeta | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const formatMarketCap = (marketCap: number): string => {
  if (marketCap === 0) return 'N/A';
  return `${marketCap.toFixed(2).toLocaleString()}$`;
};

export default function StocksTable({
  stocks,
  pagination,
  currentPage,
  onPageChange,
}: StocksTableProps) {
  return (
    <Card>
      <CardBody className="p-0">
        <Table
          aria-label="Stocks table"
          bottomContent={
            pagination && pagination.totalPages > 1 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={currentPage}
                  total={pagination.totalPages}
                  onChange={onPageChange}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn key="symbol">#</TableColumn>
            <TableColumn key="name">NAME</TableColumn>
            <TableColumn key="marketCap">CAPITALIZATION</TableColumn>
            <TableColumn key="price">PRICE</TableColumn>
            <TableColumn key="changes">PRICE CHANGE / DAY</TableColumn>
            <TableColumn key="changePerMonth">PRICE CHANGE / MONTH</TableColumn>
          </TableHeader>

          <TableBody items={stocks}>
            {(stock: Stock) => (
              <TableRow key={stock.symbol}>
                <TableCell className="font-semibold text-blue-600">
                  {stock.symbol}
                </TableCell>
                <TableCell className="font-semibold">{stock.name}</TableCell>
                <TableCell>{formatMarketCap(stock.marketCap)}</TableCell>
                <TableCell>${stock.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={
                      stock.changes >= 0 ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {stock.changes >= 0 ? '+' : ''}
                    {stock.changes.toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      stock.changePerMonth >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {stock.changePerMonth >= 0 ? '+' : ''}
                    {stock.changePerMonth.toFixed(2)}%
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
